---
title: 前端页面切换的3种核心方法：从简单到SPA实践
published: 2025-10-26
tags: [SPA]
category: 前端
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/演示.gif
description: SPA 最全知识体系总结，助你高效开发！
pinned: false
draft: false
---

在前端开发中，页面切换是用户交互的基础需求——小到静态页面跳转，大到复杂单页应用（SPA）的视图切换，不同场景需要不同的实现方案。本文将详细拆解3种最常用的页面切换方法，包含原理、代码示例和适用场景，帮你快速选择适合项目的方案。

### 一、方法1：直接插入HTML链接——最简单的多页跳转

#### 原理

通过 `<a>` 标签的 `href` 属性或 JavaScript 的 `window.location`，直接跳转至其他HTML文件（如 `page2.html`）。这是最原始的“多页应用”模式，跳转时浏览器会重新加载整个页面，属于“硬跳转”。

#### 代码示例

##### 1.1 用 `<a>` 标签直接跳转

```html
<!-- 首页 index.html -->
<div class="nav">
  <!-- 点击跳转到推荐列表页 -->
  <a href="./recommendList.html">推荐歌单</a>
  <!-- 点击跳转到播放器页 -->
  <a href="./player.html">播放器</a>
</div>
```

##### 1.2 用 JavaScript 控制跳转

```javascript
// 双击歌曲时，跳转到播放器页并携带歌曲ID
function handleSongDblClick(songId) {
  // 拼接带参数的URL，传递歌曲ID
  window.location.href = `./player.html?id=${songId}`;
}
```

#### 优缺点分析

| 优点                    | 缺点                                       |
| ----------------------- | ------------------------------------------ |
| 实现简单，无需额外逻辑  | 页面重新加载，白屏时间长，体验差           |
| 天然支持浏览器前进/后退 | 页面状态无法保留（如输入框内容、滚动位置） |
| 对新手友好，学习成本低  | 资源重复加载（如CSS、JS），性能浪费        |

#### 适用场景

- 简单静态网站（如个人博客、企业官网）；
- 页面交互少、对体验要求不高的项目；
- 快速原型开发。

### 二、方法2：innerHTML插入+隐藏旧结构——无刷新小型交互

#### 原理

在同一个HTML文件中，通过 `innerHTML` 动态插入新页面的HTML结构，同时用CSS（如 `display: none`）隐藏旧结构。本质是“单页内的视图切换”，不触发浏览器刷新，属于“软跳转”。

#### 代码示例

##### 2.1 页面容器准备

先在HTML中定义所有页面的容器（初始隐藏非首页容器）：

```html
<!-- 页面容器：所有页面共享一个#app -->
<div id="app">
  <!-- 首页容器（初始显示） -->
  <div class="page home-page">首页内容：推荐歌单列表...</div>
  <!-- 推荐列表页容器（初始隐藏） -->
  <div class="page recommend-page" style="display: none;"></div>
  <!-- 播放器页容器（初始隐藏） -->
  <div class="page player-page" style="display: none;"></div>
</div>
```

##### 2.2 切换逻辑实现

```javascript
// 页面切换函数：隐藏所有页面，插入新内容并显示
function switchPage(pageName, data = {}) {
  // 1. 隐藏所有页面容器
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => {
    page.style.display = "none";
  });

  // 2. 根据页面名称，插入对应HTML结构
  const targetPage = document.querySelector(`.${pageName}-page`);
  switch (pageName) {
    case "recommend":
      // 插入推荐列表页内容（携带歌单ID）
      targetPage.innerHTML = `
        <h2>推荐歌单：${data.playlistName}</h2>
        <ul class="song-list">...</ul> <!-- 歌曲列表内容 -->
      `;
      break;
    case "player":
      // 插入播放器页内容（携带歌曲ID）
      targetPage.innerHTML = `
        <div class="player-cover">
          <img src="${data.songCover}" alt="">
        </div>
        <div class="lyric">...</div> <!-- 歌词内容 -->
      `;
      break;
    default:
      // 首页无需重新插入，直接显示
      document.querySelector(".home-page").style.display = "block";
  }

  // 3. 显示目标页面
  targetPage.style.display = "block";
}

// 调用示例：从首页切换到推荐列表页
switchPage("recommend", { playlistName: "华语热歌榜" });
```

#### 优缺点分析

| 优点                             | 缺点                                |
| -------------------------------- | ----------------------------------- |
| 无页面刷新，切换流畅             | HTML结构与JS混写，维护成本高        |
| 页面状态易保留（如通过变量存储） | 大量内容时，innerHTML插入性能差     |
| 无需额外路由配置，适合小型项目   | 不支持浏览器前进/后退（需额外处理） |

#### 适用场景

- 小型交互项目（如音乐播放器、 Todo 应用）；
- 单页内多视图切换（如弹窗、步骤条）；
- 对性能和维护成本要求不高的场景。

### 三、方法3：监控hash变化+动态加载JS——SPA核心方案

#### 原理

利用URL中的 `hash`（`#` 后面的部分，如 `#/player/123`）作为路由标识，通过 `hashchange` 事件监听地址栏变化，解析 `hash` 后动态加载对应的页面组件JS，再渲染到容器中。这是现代单页应用（SPA）的核心实现方式，完全无刷新，体验接近原生App。

#### 代码示例

##### 3.1 路由配置定义

先定义路由映射表，关联“路径-页面名称-组件JS”：

```javascript
// 路由配置：path -> 页面名称 + 组件加载函数
const routers = [
  {
    path: "/home",
    name: "home",
    // 动态加载首页组件JS（按需加载，减少初始加载体积）
    component: () => import("./pages/homePage.js"),
  },
  {
    path: "/recommendList/:id", // 带参数的动态路由（歌单ID）
    name: "recommendList",
    component: () => import("./pages/recommendListPage.js"),
  },
  {
    path: "/player/:id", // 带参数的动态路由（歌曲ID）
    name: "player",
    component: () => import("./pages/playerPage.js"),
  },
];
```

##### 3.2 解析hash与加载组件

```javascript
// 1. 解析hash：从URL中提取路径和参数（如 #/player/123 → 路径/player，参数123）
function getRouterOptions(hash) {
  const hashStr = hash.replace(/^#/, ""); // 去掉#，得到 /player/123
  const [path] = hashStr.split("?"); // 忽略查询参数
  const pathSegments = path.split("/").filter(Boolean); // 分割为 ["player", "123"]

  let route = routers.find((item) => {
    // 匹配动态路由（如 /player/:id 匹配 /player/123）
    const routeSegments = item.path.split("/").filter(Boolean);
    if (routeSegments.length !== pathSegments.length) return false;
    // 忽略参数部分，匹配固定路径（如 player 匹配 player）
    return routeSegments[0] === pathSegments[0];
  });

  return {
    route,
    params: pathSegments[1] || "", // 提取参数（如123）
  };
}

// 2. 核心切换函数：加载组件并渲染
async function changeComponent() {
  const hash = window.location.hash || "#/home"; // 默认首页
  const { route, params } = getRouterOptions(hash);

  if (!route) {
    // 无匹配路由，跳转到首页
    window.location.hash = "#/home";
    return;
  }

  // 3. 动态加载组件JS（import返回Promise）
  const componentModule = await route.component();
  const pageComponent = componentModule.default; // 组件函数

  // 4. 渲染组件到#app容器（组件函数接收参数，返回HTML）
  const appContainer = document.querySelector("#app");
  appContainer.innerHTML = await pageComponent({ params });
}

// 3. 监听hash变化：地址栏#后面内容变了就触发切换
window.addEventListener("hashchange", changeComponent);
// 4. 页面初始加载时，执行一次切换
window.addEventListener("load", changeComponent);
```

##### 3.3 页面组件示例（playerPage.js）

```javascript
// 播放器组件：接收参数（歌曲ID），返回HTML结构
export default async function playerPage({ params: songId }) {
  // 1. 按需请求歌曲数据（如封面、歌词）
  const songData = await fetch(`/api/song?id=${songId}`).then((res) =>
    res.json(),
  );

  // 2. 返回播放器HTML结构
  return `
    <div class="player-container">
      <div class="player-cover">
        <img src="${songData.cover}" alt="${songData.name}">
      </div>
      <h3 class="song-name">${songData.name}</h3>
      <div class="lyric">${songData.lyric}</div>
      <audio src="${songData.url}" controls autoplay></audio>
    </div>
  `;
}
```

#### 优缺点分析

| 优点                            | 缺点                                               |
| ------------------------------- | -------------------------------------------------- |
| 完全无刷新，体验接近原生App     | 初始配置复杂，学习成本高                           |
| 按需加载JS，性能优化好          | 依赖前端路由，SEO需额外处理（如SSR）               |
| 支持浏览器前进/后退，状态易管理 | 首次加载路由逻辑和核心JS，耗时略长                 |
| 模块化开发，维护成本低          | 复杂场景需引入路由库（如Vue Router、React Router） |

#### 适用场景

- 中大型项目（如电商平台、管理系统、音乐App）；
- 对用户体验要求高，需要频繁切换页面的场景；
- 追求模块化和可维护性的项目。

小案例：

```html
<!-- 演示代码 -->
<a href="#page1">page1</a>
<a href="#page2">page2</a>
<div id="app"></div>

<script>
  import { page1 } from "./page1.js";
  import { page2 } from "./page2.js";
  window.addEventListener("hashchange", () => {
    let hash = window.location.hash.slice(1); //得到 url 上的 hash 值
    if (hash == "page1") {
      // 通过 hash 值调用相应的 js 文件
      page1();
    } else if (hash == "page2") {
      page2();
    }
  });
</script>
```

```
// page1.js
export function page1() {
  document.querySelector("#app").innerHTML = `page1`;
}

// page2.js
export function page2() {
  document.querySelector("#app").innerHTML = `page2`;
}
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/演示.gif"/>

从这个 demo 中可以看出，页面内容的变化是通过 js 来动态生成的，而触发 js 执行则是通过监听 window 的 hashchange 事件来触发的。hashchange 则是监听 window.location 的 hash 值，该值可由 a 便签的 href 属性来指定。

### 四、3种方法对比与选择建议

| 对比维度     | 方法1：直接跳转 | 方法2：innerHTML插入   | 方法3：hash+动态加载 |
| ------------ | --------------- | ---------------------- | -------------------- |
| 页面刷新     | 是（硬跳转）    | 否（软跳转）           | 否（SPA）            |
| 实现复杂度   | 极低            | 低                     | 中（需路由逻辑）     |
| 维护成本     | 低（多页独立）  | 高（HTML混写）         | 低（模块化）         |
| 体验         | 差（白屏）      | 中（流畅但无历史记录） | 优（接近原生）       |
| 适用项目规模 | 小型静态页      | 小型交互页             | 中大型SPA            |

#### 选择建议

1.  **快速搭建静态页**：选方法1，用 `<a>` 标签直接跳转，效率最高；
2.  **小型交互工具**：选方法2，无需路由，用 `innerHTML` 快速实现切换；
3.  **中大型应用**：选方法3，用 `hash`+动态加载构建SPA，兼顾体验和维护性；
4.  **超大型项目**：在方法3基础上，引入成熟路由库（如Vue Router），减少重复开发。

页面切换看似简单，实则是前端架构的缩影——从多页到单页，从简单到复杂，本质是“体验”与“成本”的平衡。根据项目需求选择合适的方案，才能在开发效率和用户体验之间找到最优解。

> \` 标签直接跳转，效率最高；

2.  **小型交互工具**：选方法2，无需路由，用 `innerHTML` 快速实现切换；
3.  **中大型应用**：选方法3，用 `hash`+动态加载构建SPA，兼顾体验和维护性；
4.  **超大型项目**：在方法3基础上，引入成熟路由库（如Vue Router），减少重复开发。

页面切换看似简单，实则是前端架构的缩影——从多页到单页，从简单到复杂，本质是“体验”与“成本”的平衡。根据项目需求选择合适的方案，才能在开发效率和用户体验之间找到最优解。
