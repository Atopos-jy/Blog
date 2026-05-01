---
title: cors跨域请求
published: 2026-04-05
tags: [前端, cors]
category: 前端
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1775096712288.png
description: 跨域请求详解
pinned: false
draft: false
---

文章内容...
在前端开发中，很多人会听说什么是跨域请求很难，到底怎么实现跨域请求，需要配置什么参数？本文会讲解跨域请求流程，并在最后加入怎么实现跨域的案例，怎么获取跨域请求中的cookie

## 什么是同源？

跨域的本质是「违背同源策略」，而同源的判定标准非常明确—— **协议、域名/IP、端口号三者必须完全相同**，缺一不可。

- **协议**：http 与 https 属于不同源（如 http://csdn.net 和 https://csdn.net 不同源）；
- **域名/IP**：www.csdn.net 与 blog.csdn.net（子域名不同）、www.csdn.net 与 www.doubao.com（主域名不同即二级域名）均属于不同源；

```js
www. csdn. net
↑    ↑     ↑
子域名 二级域名 顶级域名（根域名）
//www = World Wide Web 早期网站默认用 www 开头，表示这是网页服务,后来就变成约定俗成，大家都跟着用
```

- **端口号**：默认端口可省略，http 默认 80 端口，https 默认 443 端口（如 localhost:3000 与 localhost:8080 不同源）。

## 浏览器自带的「安全锁」

同源策略是浏览器内置的核心安全机制，核心作用是「限制不同源的页面之间的资源访问」，防止恶意网站窃取用户隐私数据（如Cookie、本地存储）。

但需注意：同源策略 **只限制 AJAX / Fetch / Axios 这类异步请求**，以下操作不受限制：

- 页面跳转（a标签、location.href）；
- 打开新窗口（window.open）；
- iframe 嵌入（虽有部分限制，但不会出现AJAX那种跨域报错[参考这篇博客](https://blog.csdn.net/qq_45799465/article/details/129872592?fromshare=blogdetail&sharetype=blogdetail&sharerId=129872592&sharerefer=PC&sharesource=2401_85011172&sharefrom=from_link)；
- 图片、CSS、Script等静态资源加载。

> 很多人会疑惑：
> 「iframe 父窗口给子窗口发消息，为什么不跨域？子窗口给父窗口 / 平台接口发 AJAX，为什么会报错？」
> 因为 postMessage 跨域通信API

## Cookie：浏览器自动携带的「身份卡」

很多跨域相关的问题（如CSRF攻击），都与Cookie的特性息息相关。首先要明确一个关键知识点：**Cookie不是浏览器自动生成的，而是服务器主动下发，浏览器被动存储并遵守规则的「身份凭证」**。

其核心流程的：

1. 用户触发登录（或其他需要身份验证的操作），前端将凭证（如账号密码）发送给服务器；
2. 服务器校验通过后，通过响应头的 `Set-Cookie` 字段，将Cookie（含身份信息、有效期等规则）下发给浏览器；
3. 浏览器收到后，将Cookie存储在本地（可在Chrome开发者工具 → Application → Cookies中查看）；
4. 后续用户访问该域名时，浏览器会自动按照Cookie的规则（如Domain、Path），在请求头中携带Cookie，让服务器识别用户身份。

例如B站可以通过 `runtime.getCookie` 获取 `.bilibili.com` 域名下的 `bili_jct`（即CSRF Token），就是利用了Cookie自动存储、可读取的特性。

## CORS：给跨域请求「开锁」的规则

同源策略虽然保障了安全，但在前后端分离、多平台同步等场景下，不可避免需要跨域请求（如插件中前端页面请求B站、WordPress等平台接口）。此时，CORS就成为了「合法突破同源限制」的核心方案。

CORS（Cross-Origin Resource Sharing，跨域资源共享），本质是 **服务器与浏览器的协商规范**——让服务器主动声明「哪些跨域源可以访问我的接口」，从而绕过同源策略的限制。

简单来说：CORS不解决安全问题，只解决「跨域请求能不能通」的问题，是一种「放行机制」。

浏览器会根据请求的方法、头信息，将CORS请求分为三类，处理逻辑完全不同。

### 1. 简单请求

#### （1）判定标准

同时满足以下两个条件，即为简单请求：

- 请求方法为 `GET`、`HEAD`、`POST` 三者之一；
- 请求头仅包含 `Accept`、`Accept-Language`、`Content-Language`、`Content-Type`（仅 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 三种），无自定义请求头。

#### （2）处理流程

简单请求无需预检，浏览器会直接发送实际请求，核心步骤：

1.  **浏览器自动添加请求头**：自动在请求头中添加 `Origin` 字段，标识请求的源（如 `Origin: http://foo.example`）；
2.  **服务器配置响应头**：服务器在响应头中添加 `Access-Control-Allow-Origin` 字段，指定允许访问的源（如 `Access-Control-Allow-Origin: http://foo.example`，或通配符 `*` 允许所有源）；
3.  **浏览器校验放行**：浏览器收到响应后，对比 `Origin` 与 `Access-Control-Allow-Origin`，若匹配则放行响应，否则拦截并抛出跨域错误。

简单请求仅需两步即可完成通信，是最基础的CORS场景。

下面是用apifox模拟的简单请求界面!
<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1775091248976.png"/>

### 2. 非简单请求（Non-Simple Request / 预检请求）

#### （1）判定标准

不满足简单请求条件的，均为非简单请求，常见场景：

- 请求方法为 `PUT`、`DELETE`、`PATCH` 等；
- `Content-Type` 为 `application/json` 等非简单请求允许的类型；
- 携带自定义请求头（如 `Authorization`、`X-CSRF-Token`）。

#### （2）处理流程

非简单请求会先发送**预检请求（OPTIONS请求）**，确认服务器允许跨域后，再发送实际请求，核心步骤：

1.  **发送预检请求**：浏览器自动发送 `OPTIONS` 请求，请求头包含：
    - `Origin`：请求源；
    - `Access-Control-Request-Method`：实际请求的方法（如 `PUT`）；
    - `Access-Control-Request-Headers`：实际请求携带的自定义头信息；
2.  **服务器预检响应**：服务器校验后，返回包含CORS头的响应，核心头信息：
    - `Access-Control-Allow-Origin`：允许的源；
    - `Access-Control-Allow-Methods`：允许的请求方法（如 `PUT, POST, GET`）；
    - `Access-Control-Allow-Headers`：允许的自定义请求头；
    - `Access-Control-Max-Age`：预检请求的缓存时间（单位：秒，避免重复发送预检请求）；

**发送实际请求**：预检通过后，浏览器发送实际请求，后续流程与简单请求一致。

Apifox、Postman、curl、后端 Node.js/Java 发起的请求，**不受同源策略限制**，浏览器不会拦截，也不会自动发预检请求，在csdn/github 上测试会出现CSP（内容安全策略）,所以这里我采用的本地窗口测试，
<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1775092516999.png"/>

### 3. 附带身份凭证的请求（Credentialed Request）

#### （1）核心定义

指跨域请求需要携带身份凭据（如Cookie、`Authorization`请求头、TLS客户端证书）的场景，是实际开发中最常用的场景（如接口鉴权、用户登录态保持）。

#### （2）关键配置要求

- **前端配置**：`XMLHttpRequest` 需设置 `withCredentials = true`，`fetch` 需设置 `credentials: "include"`；
- **服务器配置**：必须在响应头中添加 `Access-Control-Allow-Credentials: true`，否则浏览器会拦截响应；
- **限制规则**：
  - 若服务器设置 `Access-Control-Allow-Credentials: true`，则 `Access-Control-Allow-Origin` **不能使用通配符 `*`**，必须指定具体的源；
  - 预检请求的响应头也必须包含 `Access-Control-Allow-Credentials: true`，否则实际请求不会发送。

### 4.CORS 核心响应头全解析

CORS的所有规则，都通过服务器返回的响应头实现，核心头信息如下：

#### 1. `Access-Control-Allow-Origin`

- **作用**：指定允许访问资源的跨域源，是CORS最基础的头信息；
- **取值**：
  - 具体域名：如 `https://localhost:3000`，仅允许该域名访问；
  - 通配符 `*`：允许所有域名访问（**注意：附带身份凭证的请求不可用 `*`**）；
- **逻辑**：服务器对比请求头的 `Origin` 字段，若匹配则返回对应值，否则不返回该字段，浏览器拦截请求。

#### 2. `Access-Control-Allow-Headers`

- **作用**：用于预检请求，指定允许客户端在实际请求中携带的HTTP请求头；
- **取值**：
  - 具体头字段：如 `Authorization, X-CSRF-Token`，仅允许携带指定头；
  - 通配符 `*`：允许携带任意请求头（**例外：`Authorization` 必须明确指定，`*` 不包含该字段**）；
- **场景**：当请求携带自定义头时，必须配置该头，否则预检请求会失败。

#### 3. `Access-Control-Allow-Credentials`

- **作用**：指定是否允许跨域请求携带身份凭据；
- **取值**：仅 `true` 或 `false`，默认 `false`；
- **关键限制**：若值为 `true`，`Access-Control-Allow-Origin` 必须为具体域名，不可用 `*`。

#### 4. `Access-Control-Allow-Methods`

- **作用**：用于预检请求，指定允许跨域访问的HTTP请求方法；
- **取值**：
  - 具体方法：如 `GET, POST, PUT, DELETE`；
  - 通配符 `*`：允许所有方法（**注意：若请求携带身份凭据，`*` 无效，需明确指定方法**）。

#### 5. `Access-Control-Expose-Headers`

- **作用**：指定允许前端JS访问的响应头字段；
- **默认限制**：浏览器默认仅允许前端访问 `Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma` 6个基础头，自定义响应头（如 `X-Request-ID`）需通过该头暴露，否则前端无法读取。

#### 6. `Access-Control-Max-Age`

- **作用**：指定预检请求的缓存时间（单位：秒）；
- **场景**：避免浏览器对同一接口重复发送预检请求，提升性能；
- **示例**：`Access-Control-Max-Age: 86400` 表示预检结果缓存1天，1天内无需重复发送预检请求。

### 5.CORS 的缺陷与注意事项

### 1. 核心缺陷

- **仅浏览器限制**：CORS是浏览器的安全规则，**服务器之间的请求不受CORS限制**（如后端代理、Node.js请求接口），因此CORS仅能防护前端跨域，无法防护服务器端的恶意请求；
- **通配符风险**：`Access-Control-Allow-Origin: *` 会允许所有源访问，若接口包含敏感数据，极易被恶意网站滥用；
- **预检请求性能损耗**：非简单请求的预检请求会增加一次网络请求，虽可通过 `Access-Control-Max-Age` 缓存，但仍会影响首屏性能；
- **兼容性问题**：部分老旧浏览器（如IE8/9）不支持CORS，需通过`JSONP`等方案兼容（但JSONP仅支持GET请求，安全性差）。

### 2. 开发注意事项

- **优先使用具体域名，避免通配符**：尤其是生产环境，禁止使用 `*`，仅允许信任的源访问；
- **预检请求缓存优化**：合理配置 `Access-Control-Max-Age`，减少预检请求次数；
- **身份凭证校验**：附带身份凭证的请求，必须同时配置前端 `withCredentials` 和后端 `Access-Control-Allow-Credentials: true`，且`Access-Control-Allow-Origin` 为具体域名；
- **自定义头暴露**：若前端需要读取自定义响应头，必须通过 `Access-Control-Expose-Headers` 暴露，否则无法获取。

## 为什么跨域请求会被黑客攻击？

跨域请求本身不具备安全风险，但因「身份凭证（Cookie）自动携带」和「CORS配置不当」，容易被黑客利用，引发安全攻击，最典型的就是**CSRF（跨站请求伪造）攻击**。

### 1. CSRF 攻击原理

CSRF攻击的核心漏洞是：**浏览器会自动携带目标域名的Cookie，服务器仅通过Cookie校验身份，不校验请求来源**。
攻击流程：

1.  用户登录目标网站（如银行网站 `bank.com`），浏览器存储登录Cookie；
2.  用户未退出登录，打开黑客网站 `hacker.com`；
3.  黑客网站通过JS自动向 `bank.com/transfer` 发送跨域/同源请求，浏览器自动携带用户的Cookie；
4.  服务器校验Cookie合法，误以为是用户本人操作，执行转账等恶意操作。

### 2. CORS 配置不当加剧风险

若服务器CORS配置为 `Access-Control-Allow-Origin: *` 且 `Access-Control-Allow-Credentials: true`（**违规配置，浏览器会直接拦截**），或允许恶意源访问，黑客可直接通过跨域请求窃取用户数据、发起恶意操作。

### CSRF 防御方案

针对CSRF攻击和CORS配置风险，核心防御思路是「**双重校验身份，严格限制跨域源**」，常用方案如下：

#### 1. CSRF Token（最主流、最有效）

- **核心逻辑**：服务器生成唯一的随机Token，存储在Cookie中，同时嵌入页面；前端发请求时，必须手动携带Token（放在请求头/请求体中），服务器同时校验Cookie和Token，只有两者都合法，才执行请求；
- **优势**：黑客无法获取用户的Token，即使有Cookie，也无法发起恶意请求，从根源上防御CSRF。

#### 2. SameSite Cookie（最简单、无需前端改动）

- **核心逻辑**：给Cookie添加 `SameSite` 属性，限制Cookie的携带场景：
  - `SameSite=Strict`：仅允许本网站主动发起的请求携带Cookie，完全禁止跨站请求携带；
  - `SameSite=Lax`：允许部分跨站请求（如a标签跳转）携带，禁止JS发起的跨站请求携带；
- **优势**：无需前端改造，从浏览器层面限制Cookie携带，防御CSRF攻击。

#### 3. 严格校验 Referer / Origin

- **核心逻辑**：服务器校验请求头中的 `Referer`（请求来源页面）或 `Origin`（请求来源域名），仅允许信任的源（如自身域名、信任的前端域名）访问接口；
- **场景**：适合无法使用CSRF Token的场景，需注意部分浏览器会隐藏 `Referer`，需结合其他方案使用。

#### 4. 规范CORS配置

- 禁止使用 `Access-Control-Allow-Origin: *`，仅允许信任的具体源；
- 附带身份凭证的请求，必须配置 `Access-Control-Allow-Credentials: true` 且指定具体源；
- 严格限制 `Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`，仅开放必要的方法和头信息

## 实现跨域

- **跨域请求要想携带 Cookie，必须前后端同时满足 3 个条件：**

- **前端请求必须开启：`credentials: 'include'`**
- **后端响应头必须返回：`Access-Control-Allow-Credentials: true`**
- **后端 `Access-Control-Allow-Origin` 不能是 `*`，必须写具体域名**

### 1.前端携带cookie参数

1. fetch 跨域携带 Cookie

```js
fetch(url, {
  method: "POST",
  credentials: "include", // ✅ 必须加，才能携带跨域 Cookie
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

2. axios 跨域携带 Cookie

```js
axios.post(url, data, {
  withCredentials: true, // ✅ 必须加
});
```

3. XMLHttpRequest 携带 Cookie

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", url);
xhr.withCredentials = true; // ✅ 必须加
xhr.send(data);
```

### 2.后端必须配置响应头

```
Access-Control-Allow-Origin: https://localhost:5500
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type,X-CSRF-Token
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Max-Age: 86400
```

**重点记住：**

- **不能用 \***，否则带 Cookie 直接失败
- **必须允许 OPTIONS**，否则非简单请求被拦截
- **必须写 Access-Control-Allow-Credentials: true**

> Cookie 必须满足
>
> - `Secure`：必须 HTTPS
> - `SameSite` 不能是 `Strict`
> - `Domain` 正确
> - 不能跨浏览器、跨设备
>
> 掘金 / B 站 / CSDN 这类网站，Cookie 设置了 SameSite=Lax，跨域时浏览器直接禁止携带，前端怎么配置都带不过去

既然浏览器不让跨域带 Cookie，**唯一解决方案就是：同源转发**

```
前端 localhost:5500
   ↓ 请求 /api/juejin/xxx（同源，不跨域）
本地代理（Vite/Webpack）
   ↓ 转发到 https://api.juejin.cn
掘金服务器
```

配置示例（Vite）

```javaScript
// vite.config.js
export default {
  server: {
    proxy: {
      "/api": {
        target: "https://api.juejin.cn",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
};
```

前端请求

```javascript
fetch("/api/user_api/v1/user/get", {
  credentials: "include",
});
```

还可以选择另一种方案：直接装一个 Chrome 插件 Allow CORS: Access-Control-Allow-Origin，开启后，浏览器就不拦截跨域了（尽量不选择）

## 总结

用一句话理清所有知识点的关系，方便记忆和应用：

- 同源策略 = 浏览器的「安全锁」，限制跨域异步请求；
- Cookie = 浏览器自动携带的「身份卡」，由服务器下发，是身份验证的核心；
- CORS = 给跨域请求「开锁」的规则，解决「请求能不能通」的问题；
- CSRF = 利用Cookie自动携带的「攻击方式」，解决「请求是不是本人发起」的安全问题；
- CSRF防御 = 给「身份卡」加锁，防止被黑客盗用。

跨域请求的核心，本质是「安全与便捷的平衡」——同源策略保障安全，CORS实现跨域便捷访问，CSRF防御则规避跨域带来的安全风险。掌握这些知识点，不仅能轻松应对面试，更能在插件开发、前后端对接等实际场景中，快速解决跨域相关问题。
