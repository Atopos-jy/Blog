/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
    if (Array.isArray(children) && children.length !== 0)
        return h("div", { class: "hidden" }, [
            'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
        ]);

    if (!properties.repo || !properties.repo.includes("/"))
        return h(
            "div",
            { class: "hidden" },
            'Invalid repository. ("repo" attributte must be in the format "owner/repo")',
        );

    const repo = properties.repo;
    const cardUuid = `GC${Math.random().toString(36).slice(-6)}`;

    // 默认数据（fetch 失败时使用）
    const defaultData = {
        avatar: "https://avatars.githubusercontent.com/u/214225888?v=4&size=64",
        description: "A blog built with Astro.",
        stars: "0",
        forks: "0",
        license: "MIT",
        language: "Astro",
    };

    const nAvatar = h(`div#${cardUuid}-avatar`, {
        class: "gc-avatar",
        style: `background-image: url(${defaultData.avatar});`,
    });
    const nLanguage = h(`span#${cardUuid}-language`, { class: "gc-language" }, defaultData.language);

    const nTitle = h("div", { class: "gc-titlebar" }, [
        h("div", { class: "gc-titlebar-left" }, [
            h("div", { class: "gc-owner" }, [
                nAvatar,
                h("div", { class: "gc-user" }, repo.split("/")[0]),
            ]),
            h("div", { class: "gc-divider" }, "/"),
            h("div", { class: "gc-repo" }, repo.split("/")[1]),
        ]),
        h("div", { class: "github-logo" }),
    ]);

    const nDescription = h(
        `div#${cardUuid}-description`,
        { class: "gc-description" },
        defaultData.description,
    );

    const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, defaultData.stars);
    const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, defaultData.forks);
    const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, defaultData.license);

    const nScript = h(
        `script#${cardUuid}-script`,
        { type: "text/javascript", defer: true },
        `
        const init = () => {
            fetch('https://api.github.com/repos/${repo}', { referrerPolicy: "no-referrer" }).then(response => response.json()).then(data => {
                document.getElementById('${cardUuid}-description').innerText = data.description?.replace(/:[a-zA-Z0-9_]+:/g, '') || "Description not set";
                document.getElementById('${cardUuid}-language').innerText = data.language;
                document.getElementById('${cardUuid}-forks').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks).replaceAll("\u202f", '');
                document.getElementById('${cardUuid}-stars').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.stargazers_count).replaceAll("\u202f", '');
                const avatarEl = document.getElementById('${cardUuid}-avatar');
                avatarEl.style.backgroundImage = 'url(' + data.owner.avatar_url + ')';
                avatarEl.style.backgroundColor = 'transparent';
                document.getElementById('${cardUuid}-license').innerText = data.license?.spdx_id || "no-license";
                document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");
                console.log("[GITHUB-CARD] Loaded card for ${repo} | ${cardUuid}.")
            }).catch(err => {
                // fetch 失败时移除 loading 状态，保留默认数据正常显示
                document.getElementById('${cardUuid}-card')?.classList.remove("fetch-waiting");
                console.warn("[GITHUB-CARD] Using default data for ${repo} | ${cardUuid}.")
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    init();
                    observer.disconnect();
                }
            });
        }, { rootMargin: '100px' });

        observer.observe(document.getElementById('${cardUuid}-card'));
        `,
    );

    return h(
        `a#${cardUuid}-card`,
        {
            class: "card-github no-styling",
            href: `https://github.com/${repo}`,
            target: "_blank",
            repo,
        },
        [
            nTitle,
            nDescription,
            h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
            nScript,
        ],
    );
}
