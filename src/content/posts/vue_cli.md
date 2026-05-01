---
title: Vue CLI 脚手架教程：从环境准备到项目启动的完整指南
published: 2025-11-14
tags: [vue]
category: Vue
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763039622407.png
description: Vue CLI 最全知识体系总结，助你高效开发！
pinned: false
draft: false
---

# 工程化开发&脚手架Vue CLI

## 一、基本功能介绍：

Vue CLI（Vue Command Line Interface，命令行界面）是 **Vue 官方提供的全局命令行工具**，核心定位是「快速搭建 Vue 项目的标准化工具链」，专门解决“从零开发 Vue 项目时的配置繁琐、环境不统一”问题。

### 1. 核心作用

- 一键初始化 Vue 项目（支持 Vue 2/Vue 3 切换）；
- 内置成熟的工程化配置（无需手动配置 Webpack、Babel、ESLint、热更新等）；
- 提供统一的开发命令（启动、打包、测试、部署一站式）；
- 支持插件扩展（如添加 Vue Router、Vuex、TypeScript 等，自动配置依赖和代码结构）。

### 2.内置命令

- `vue create 项目名`：创建新 Vue 项目（你之前创建 `vue2` 项目用的命令）；
- `npm run serve`：启动本地开发服务器（热更新、实时预览）；
- `vue --version`：查看 Vue CLI 版本；
- `npm install -g @vue/cli`：全局安装 Vue CLI（你之前安装/卸载过）。

### 3. 核心优势

- 标准化：避免“每个人的项目结构、配置都不一样”，团队协作更高效；
- 零配置上手：新手不用懂 Webpack、Babel 等工具，也能快速启动项目；
- 可扩展：支持自定义配置（修改 `vue.config.js`），满足复杂项目需求；
- 官方维护：与 Vue 框架深度兼容，更新同步，稳定性有保障。

## 二、为什么叫“脚手架”？（核心类比解析）

这个命名源于 **现实中的建筑脚手架**，两者的核心逻辑完全一致，用通俗的类比就能理解：

### 1. 先想：现实中的建筑脚手架是什么？

盖房子时，工人不会先从“砌墙”开始——而是先搭建一套「临时的框架结构」（脚手架）：

- 提供基础支撑：让工人能安全站在上面施工；
- 规定基本轮廓：跟着脚手架的框架，房子的墙体、楼层结构不会乱；
- 省去重复工作：不用每次盖房子都从零搭支撑结构，直接复用脚手架模板。

### 2. 类比到 Vue CLI：开发 Vue 项目的“代码脚手架”

开发 Vue 项目时，你就像“盖房子的工人”，Vue CLI 就是为你搭好的「代码脚手架」：

- 提供基础结构：创建项目后，自动生成 `src`（源码目录）、`package.json`（依赖配置）、`vue.config.js`（项目配置）等固定目录和文件，不用你手动创建；
- 内置“支撑工具”：预先配置好 Webpack（打包）、Babel（兼容旧浏览器）、ESLint（代码检查）、热更新（开发实时预览）等“施工工具”，不用你逐个安装配置；
- 规定开发规范：项目结构、文件命名、依赖管理都遵循 Vue 官方标准，避免你“乱搭结构”导致后续维护困难；
- 专注核心工作：你不用关心“基础框架怎么搭、工具怎么配”，就像工人不用关心“脚手架怎么搭”，只需专注于「业务代码开发」（比如写组件、写逻辑）——这就是脚手架的核心价值。

### 一句话总结命名逻辑：

Vue CLI 就像“开发 Vue 项目的标准化脚手架”，它帮你搭好项目的“基础框架和工具环境”，让你不用从零处理繁琐的配置和结构，直接聚焦核心的业务开发，效率翻倍。

Vue CLI 本质是`「Vue 项目的工程化工具链」`，而“脚手架”的命名是对其核心功能的精准比喻——它不是帮你“写业务代码”，而是帮你“搭好写代码的基础框架”，让开发过程更标准化、更高效，尤其适合新手快速入门和团队协作。

## 三、准备工作：

### 在VScode中配置git终端

#### Windows系统（推荐）

##### 方法1：图形界面快速设置（最简单）

1. 打开VSCode，按`Ctrl+，`进入设置
2. 在搜索框输入"terminal.integrated.defaultProfile.windows"
3. 在下拉菜单中直接选择"Git Bash"（若已安装Git）
4. **关闭所有终端，重新打开**，新终端将使用Git Bash

##### 方法2：手动配置（如列表中无Git Bash选项）

1. 按`Ctrl+Shift+P`，输入"Open Settings (JSON)"，打开`settings.json`
2. 添加以下配置（根据Git安装路径修改）：

```json
"terminal.integrated.profiles.windows": {
  "Git Bash": {
    "path": "C:\\Program Files\\Git\\bin\\bash.exe",  // Git安装路径
    "args": ["--login"]  // 确保加载配置文件
  }
},
"terminal.integrated.defaultProfile.windows": "Git Bash"  // 设置为默认终端
```

3. 保存后关闭所有终端，重新打开即可

##### 实用技巧

- **快速打开终端**：按`Ctrl+`（反引号键）或选择菜单"查看→终端"
- **临时切换终端**：点击终端右上角下拉箭头，选择不同终端
- **若要在终端中使用nvm等工具**：添加配置使终端自动加载环境变量（见下面的进阶配置）

如果你遇到"npm: command not found"等问题，需在终端配置中添加自动加载环境变量：

在`settings.json`中修改终端配置，添加：

```json
// Windows（Git Bash）
"terminal.integrated.profiles.windows": {
  "Git Bash": {
    "path": "C:\\Program Files\\Git\\bin\\bash.exe",
    "args": ["--login", "-i", "-c", "source ~/.bashrc && exec bash"]  // 关键：自动加载bash配置
  }
}
```

保存后，**关闭所有终端，重新打开**即可

在vscode中配置git之后我们可以直接在vscode中执行下载脚手架操作，不用再打开一个终端。

### 检查nvm镜像源配置：

检查你用的 NVM 是否还在使用旧的淘宝镜像地址 `http://npm.taobao.org/mirrors/node/`，但这个地址早就被淘宝废弃了（现在官方镜像域名是 `npmmirror.com`），导致请求 `SHASUMS256.txt` 文件时返回 404 找不到，安装失败。

核心解决思路：**把 NVM 的 Node 镜像源换成淘宝新镜像（或官方镜像）**，再重新执行安装命令。

#### 一、Windows 系统（用的是 nvm-windows）

##### 步骤 1：找到 NVM 的配置文件 `settings.txt`

- 默认路径：`C:\Users\你的用户名\AppData\Roaming\nvm\settings.txt`（比如 `C:\Users\Admin\AppData\Roaming\nvm\settings.txt`）；
- 若找不到：打开 NVM 安装目录（安装时自定义的路径），直接找到 `settings.txt`。

##### 步骤 2：修改配置文件，添加新镜像源

用记事本打开 `settings.txt`，在文件末尾添加以下 2 行（替换旧镜像）：

```txt
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

保存并关闭文件。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763088806677.png"/>
##### 步骤 3：重新安装 Node xx版本

打开**新的终端**（必须重启终端，让配置生效），执行：

```bash
nvm install 18.16.0（选择当前合适的版本）
```

#### 二、备用方案：临时指定镜像安装（无需修改配置）

如果不想修改全局配置，可在安装命令后直接指定镜像源（临时生效）：

```bash
# Windows/macOS/Linux 通用
NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ nvm install 18.16.0
```

#### 三、验证安装成功

```bash
# 切换到 18.16.0 版本
nvm use 18.16.0

# 验证版本（显示 v18.16.0 即成功）
node -v
npm -v  # 会自动配套更新 npm 版本（比如 v9.5.1）
```

### 关键说明

- 淘宝旧镜像 `npm.taobao.org` 已停止维护，所有镜像服务迁移到 `npmmirror.com`，这是核心问题；
- 修改镜像源后必须重启终端（或执行 `source` 命令），否则配置不生效，仍会用旧地址报错；
- 若仍报错 404，检查镜像地址是否拼写正确（注意是 `https`，不是 `http`）。

## 四、使用步骤：

### 1.全局安装（一次）

```html
yarn global add @vue/cli 或 npm i @vue/cli -g
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763038026826.png"/>

这是因为版本不正确，出现了高危漏洞

| Vue版本 | nodeJs版本 | sassLoader版本 | lessLoader版本 |
| ------- | ---------- | -------------- | -------------- |
| 2.5.2   | 14.10.0    | 6.0.6          | -              |
| 2.6.14  | 14.10.0    | 6.0.6          | 12.2.0         |
| 3.2.37  | 16.13.1    | -              | 7.3.0          |
| 3.4.29  | 16.13.1    | -              | -              |

下载更高版本的Vue建议下载18+nodejs版本，这里我下载的时5.0.9版本的重新安装nodejs18+版本，高危漏洞就没有了。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763088875179.png"/>
<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763088902365.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763089018867.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763089194618.png"/>

上面的报错简单说：**全局 Vue CLI 是“工具”，项目本地的插件是“项目依赖”，两者版本必须一致，才能同步更新依赖链里的 `webpack-dev-server`**。

如果实在想修复这些漏洞，且不想接受「破坏性更新」，按以下步骤彻底同步 Vue CLI 版本（从根源解决漏洞）：

#### 1. 先卸载全局旧版 Vue CLI（关键第一步）

打开新的命令行窗口，执行：

```bash
npm uninstall -g @vue/cli
```

（如果之前装过旧版 `vue-cli`，再额外执行：`npm uninstall -g vue-cli`，确保彻底卸载）

#### 2. 安装最新版全局 Vue CLI

```bash
npm install -g @vue/cli@latest
```

- 安装完成后，执行 `vue --version` 验证，会显示最新版本（比如 `5.0.9`）。

#### 3. 更新项目本地的 Vue CLI 核心插件

回到你的 Vue 项目根目录，执行以下命令，更新项目本地的核心插件（和全局版本同步）：

```bash
# 更新项目核心插件（@vue/cli-service 是关键，会带动 webpack-dev-server 更新）
npm install @vue/cli-service@latest @vue/cli-plugin-babel@latest @vue/cli-plugin-eslint@latest --save-dev
```

#### 4. 清理旧依赖，重新安装

删除项目里的旧依赖和锁文件，确保依赖干净：

```bash
# 删除 node_modules 文件夹和 package-lock.json
rm -rf node_modules package-lock.json  # Windows 用：rd /s/q node_modules package-lock.json
```

绝不推荐的做法：`npm audit fix --force`

这个命令会把 `@vue/cli-plugin-babel` 降级到 `3.12.1`（非常旧的版本），而你的项目可能用的是 Vue CLI 4.x/5.x，会导致：

1. 项目启动失败（比如报错 `Cannot find module xxx`）；
2. Babel 编译功能异常（代码无法转译，出现语法错误）；
3. 其他插件兼容问题（比如 ESLint 无法正常工作）。

除非你愿意从零重构项目依赖，否则千万别执行！

> 1. 核心建议：**直接执行 `npm run serve` 启动项目**，忽略漏洞，ECharts 饼图会正常显示，漏洞不影响功能和生产环境；
> 2. 若一定要修复漏洞：按「卸载旧 Vue CLI → 装最新版 → 更新本地插件 → 重装依赖」的步骤操作，无破坏性且能彻底修复；
> 3. 不要碰 `npm audit fix --force`，避免项目崩溃。

### 2.查看Vue版本：

```bash
vue --version
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763037810061.png"/>

### 3.创建项目架子：

```bash
vue create project-name（项目名- 不能用中文）
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763088875179.png"/>

会有一个下载Vue2 或者 Vue3 的判断，使用上下箭头来控制下载的版本，这里我使用的时下载Vue2版本。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763086910849.png"/>

#### 注意要点

Vue CLI（Vue 脚手架，用于创建 Vue 项目的工具）**较新版本（通常 4.x+）强制要求项目名只能包含小写字母、连字符（-）或下划线（\_）**，不允许出现大写字母。

这个限制的目的是：

1. 避免跨系统兼容性问题（Windows 系统文件名不区分大小写，Unix/Linux 区分，全小写能统一行为）；
2. 符合 npm 包命名规范（npm 包名默认推荐全小写，避免依赖安装时的冲突）；
3. 减少项目配置、依赖引用时的语法歧义。

### 4.启动项目

```bash
yarn serve 或 npm run serve （找package.json）
```

> `npm run serve` 是 Vue 项目的启动命令，必须在 **项目根目录**（即包含 `package.json` 文件的文件夹）下执行。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763039602806.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763039622407.png"/>
上面在安装脚手架的时候出现New major version of npm available! 9.5.1 -> 11.6.2，并不代表安装失败，这是因为 npm 自带「版本检测功能」，每次你执行 `npm` 相关命令（比如 `npm install`、`npm run serve`）时，它会自动检查官方最新版本，发现有主版本更新时，就会弹出这个提示，提醒你升级。

#### 重要：是否需要升级？（分情况建议）

#### 👉 推荐升级的情况：

- 你正在创建**新项目**（没有历史依赖兼容问题）；
- 想体验 npm 11.x 的新功能（比如更快的安装速度、更好的依赖冲突检测、新的命令参数）；
- 当前 npm 9.x 遇到了已知 bug（升级后可能修复）。

#### 👉 可以暂缓升级的情况：

- 你正在维护**旧项目**（尤其是依赖较多的 Vue 2/Vue 3 项目），且当前项目运行正常；
- 担心主版本升级可能导致依赖兼容问题（虽然概率低，但旧项目谨慎起见可暂缓）。

👉 总结：**新手 / 新项目直接升级即可**（风险极低，能获得更好的体验）；旧项目如果运行稳定，可暂时忽略，等后续需要时再更。

### 如何升级 npm 到最新版？（1 行命令）

打开终端，执行以下命令（全局升级，所有项目都能用）：

```bash
npm install -g npm@latest
```

- 解释：`-g` 表示「全局安装」，`npm@latest` 表示「安装 npm 的最新稳定版」（会自动安装 11.6.2）。

#### 验证升级是否成功：

升级后执行以下命令，显示 `11.6.2` 即成功：

```bash
npm -v
```

### 补充注意事项：

1. 升级 npm 不会影响你的 Node.js 版本（两者是独立工具，npm 是 Node 自带的包管理器，可单独升级）；

2. 若升级后某个旧项目报错（极少数情况），可回滚到原来的 npm 版本：

   ```bash
   npm install -g npm@9.5.1  # 回滚到之前的 9.5.1 版本
   ```

3. 如果你用的是 yarn 包管理器（而非 npm），这个提示可以忽略，无需升级 npm。

安装完成之后既可以进行组件化开发了

## 五、Vue项目介绍

### 1.项目结构和核心文件解析

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763039854085.png"/>

### 2.入口文件main.js

```javascript
import Vue from "vue";
import App from "./App.vue";

//2.提示当前处于什么环境（生产环境/开发环境）
Vue.config.productionTip = false;

//3.Vue 实例化 提供render 方法 → 基于App.vue创建结构渲染index.html
new Vue({
  //el: '#app' 作用： 和$mount('选择器') 作用一致 用于指定Vue所管理的容器·
  // render: h => h(App),
  render: (createElement) => {
    // 基于
    return createElement(App);
  },
}).$mount("#app");
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763092410576.png"/>

### 3.根组件App.vue

```vue
//三部分组成： //template:结构 //script:js逻辑 //style:样式（可支持less
需要安装包）

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

## 六、组件注册与使用

组件是 Vue 开发的核心单元，合理的组件注册能提高代码复用性和维护性。Vue 提供两种组件注册方式：

### 1.普通组件的注册使用

步骤：

（1）创建.vue文件 （包含 template script style三部分）

（2）在使用该组件的父组件中，通过import导入组件

（3）在父组件中 components 选项中注册组件

（4）在发父组件中的template中直接使用组件标签

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763106533528.png"/>

### 2.全局组件的注册使用

步骤：

（1）在入口文件main.js中导入组件

（2）通过Vue.component('组件名'，组件对象)注册；

（3）在任意组建的template中直接使用组件标签

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1763107886998.png"/>

一般都是局部注册，如果发现是全局注册，再抽离出来

#### 最佳实践：

- 优先使用局部注册，避免全局注册导致的 “组件污染”（过多全局组件会增加项目体积，且不易追溯引用关系）；
- 若多个组件频繁复用（如按钮、表单组件），可封装为 UI 库并全局注册。

## 结语

Vue CLI 作为 Vue 官方的工程化工具链，通过标准化的项目结构、内置的开发工具和简洁的命令集，极大降低了 Vue 项目的入门门槛和维护成本。从环境准备到项目创建，从依赖管理到组件开发，它为开发者构建了一套高效、统一的工作流。

掌握 Vue CLI 后，你可以更专注于业务逻辑的实现，而无需在配置细节上耗费精力。后续学习中，你还可以探索 Vue CLI 的自定义配置（如通过`vue.config.js`修改打包路径、配置代理）、插件扩展（集成 Vue Router 实现路由管理、Vuex 进行状态管理）等高级功能，进一步提升项目开发效率。

希望本文能帮助你快速上手 Vue CLI，在实际项目中感受它带来的便捷与高效，开启更流畅的 Vue 开发之旅。
