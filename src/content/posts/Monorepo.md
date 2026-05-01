---
title: Monorepo（多包架构）
published: 2026-03-23
tags: [前端, Monorepo]
category: 分类
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/%E5%AF%B9%E6%AF%94.png
description: Monorepo 单仓管理多包，通过工作区软链接实现本地依赖实时生效。pnpm/Yarn 支持 workspace:* 协议，根目录执行过滤命令，优势在于代码复用、依赖统一、配置复用。
pinned: false
draft: false
---

Monorepo（多包架构）已成为现代前端工程化的主流方案，无论是大厂的大型项目还是中小型团队的模块化开发，都能通过它实现代码复用、统一管理与高效协作。本文将从核心概念出发，结合 pnpm 和 Yarn 两大主流工具，完整讲解多包架构的设计、配置与实战技巧。

## 一、什么是多包架构（Monorepo）？

Monorepo（全称 Monolithic Repository，译为「单体仓库」或「多包仓库」）是一种**代码管理范式**：**将多个独立的软件包（package）集中存储在同一个 Git 仓库中**，每个包拥有独立的 `package.json`、版本号、源码与构建产物，同时通过包管理器的「工作区（Workspace）」能力实现本地互引、依赖共享与跨包操作。

### 与传统多仓库（Polyrepo）的核心差异

| 特性       | 多包架构（Monorepo）     | 多仓库（Polyrepo）         |
| ---------- | ------------------------ | -------------------------- |
| 代码存储   | 单个 Git 仓库管理所有包  | 每个包对应独立 Git 仓库    |
| 包间引用   | 本地软链接，修改实时生效 | 需发布到 npm 后重新安装    |
| 依赖管理   | 根目录统一管理，版本一致 | 各仓库独立维护，易版本冲突 |
| 工程化配置 | 根目录统一配置，子包继承 | 各仓库重复配置，维护成本高 |

## 二、为什么选择多包架构？

1. **极致的代码复用**：多个业务包可直接引用本地的工具包/核心包（如 `extension` 依赖 `core`），无需发布到 npm 仓库，修改源码后实时生效，大幅降低跨包调试成本。
2. **统一的工程化管理**：根目录可集中处理所有包的依赖安装、构建、测试、发布等任务，避免每个包重复配置构建脚本、ESLint/TypeScript 规则。
3. **减少配置冗余**：公共配置（如 `tsconfig.json`、`.eslintrc`）可放在根目录，子包通过「继承」复用，降低配置维护成本。
4. **清晰的依赖关系**：可直观看到所有包的依赖链路，便于梳理模块边界、优化构建顺序。

## 三、多包架构的核心目录结构

无论使用 pnpm 还是 Yarn，多包架构的目录结构遵循统一的设计范式，以下是通用的最小可用结构：

```
my-monorepo/                  # 根仓库（私有，不发布）
├── package.json              # 根配置：工作区声明、全局脚本、共享依赖
├── pnpm-workspace.yaml       # pnpm 专属：工作区范围声明（Yarn 无需此文件）
├── tsconfig.json             # 全局 TS 配置（子包继承）
├── packages/                 # 所有子包的统一存放目录
│   ├── core/                 # 核心包（被其他包依赖）
│   │   ├── package.json      # 子包配置：名称、版本、依赖、脚本
│   │   ├── src/
│   │   │   └── index.ts      # 子包源码
│   │   └── tsconfig.json     # 子包 TS 配置（继承根配置）
│   └── extension/            # 业务包（依赖 core 包）
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
└── .gitignore                # 全局忽略配置（node_modules、dist 等）
```

### 关键结构说明

- **根目录**：标记为「私有」（`private: true`），避免被误发布到 npm；存放全局共享依赖（如 TypeScript、构建工具）和跨包脚本。
- **packages 目录**：所有子包的容器，子包名称建议遵循「作用域命名规范」（如 `@your-org/core`），避免 npm 包名冲突。
- **子包目录**：每个子包是独立的模块单元，拥有自己的入口、版本和依赖，可单独发布。

## 四、核心配置：Workspace 工作区与包间依赖

Workspace（工作区）是多包架构的核心，pnpm 和 Yarn 均通过工作区实现「本地包软链接」「依赖共享」「跨包命令执行」，只是配置方式略有差异。

### 1. 工作区范围声明

首先需要告诉包管理器：哪些目录属于多包架构的子包。

#### pnpm 配置：`pnpm-workspace.yaml`

pnpm 通过独立的 `pnpm-workspace.yaml` 声明工作区范围，这是 pnpm 工作区的核心配置文件：

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/**" # 匹配 packages 下所有子目录（支持嵌套）
  - "!packages/**/test" # 可选：排除不需要的目录（如测试目录）
```

#### Yarn/npm 配置：根 `package.json` 中的 `workspaces` 字段

Yarn（v1/v2+）和 npm（v7+）无需额外文件，直接在根 `package.json` 中声明工作区：

```json
// package.json（Yarn/npm）
{
  "name": "my-monorepo",
  "private": true, // 必须标记为私有，禁止发布根包
  "workspaces": [
    "packages/*" // 声明子包目录，与 pnpm-workspace.yaml 等效
  ]
}
```

### 2. 子包间的相互依赖：`workspace:*` 协议

子包之间的依赖是多包架构的核心场景，通过 `workspace:*` 协议可实现「本地包引用」，而非从 npm 仓库下载。

#### 配置示例（core + extension）

假设 `extension` 依赖本地的 `core` 包，需在 `extension/package.json` 中声明：

```json
// packages/extension/package.json
{
  "name": "@your-org/extension",
  "version": "2.0.5",
  "dependencies": {
    // 核心：通过 workspace:* 引用本地 core 包
    "@your-org/core": "workspace:*"
  }
}
```

#### 协议说明

- `workspace:*`：匹配本地 `core` 包的最新版本，pnpm/Yarn 会自动创建**软链接（symlink）**，将 `extension/node_modules/@your-org/core` 指向本地 `packages/core` 目录；
- 也可指定版本范围：如 `workspace:^2.0.0`，仅匹配 2.x 版本的本地 `core` 包；
- 执行 `pnpm install`/`yarn install` 后，软链接自动生成，修改 `core` 源码后，`extension` 可实时获取最新代码，无需发布。

### 3. 依赖安装的底层逻辑

pnpm 和 Yarn 处理依赖的方式略有差异，但核心目标一致：共享依赖、减少冗余。

- **pnpm**：采用「非扁平 node_modules」+「内容寻址存储（CAS）」，公共依赖提升到根目录，子包通过软链接引用，无「幽灵依赖」；
- **Yarn**：默认将公共依赖提升到根 `node_modules`（扁平结构），子包直接使用根依赖，安装速度快但可能出现幽灵依赖（未声明的依赖也能使用）；
- 最终效果：所有子包的依赖仅安装一次，磁盘占用大幅降低，安装速度提升。

## 五、工作区命令：操作单个/所有子包

在多包架构中，所有命令需在**根目录**执行（子目录执行会导致 `workspace:*` 解析失败），pnpm 和 Yarn 提供了专属参数实现「精准操作子包」。

### 1. 核心参数对比

| 操作目标         | pnpm 命令                            | Yarn 命令                      |
| ---------------- | ------------------------------------ | ------------------------------ |
| 操作单个子包     | `pnpm --filter <包名> <命令>`        | `yarn workspace <包名> <命令>` |
| 递归操作所有子包 | `pnpm -r <命令>`（-r = --recursive） | `yarn workspaces run <命令>`   |
| 查看工作区包列表 | `pnpm list -r --depth -1`            | `yarn workspaces info`         |
| 分析依赖来源     | `pnpm why <包名> --filter <子包名>`  | `yarn why <包名> -W <子包名>`  |

### 2. 常用命令示例

#### （1）操作单个子包

```bash
# pnpm：为 extension 添加 react 依赖
pnpm --filter @your-org/extension add react

# Yarn：为 extension 添加 react 依赖
yarn workspace @your-org/extension add react

# pnpm：构建 extension 包
pnpm --filter @your-org/extension build

# Yarn：运行 extension 的开发服务器
yarn workspace @your-org/extension dev
```

#### （2）操作所有子包

```bash
# pnpm：递归构建所有子包（按依赖拓扑顺序执行）
pnpm -r run build

# Yarn：运行所有子包的 build 脚本
yarn workspaces run build

# pnpm：安装所有子包的依赖（根目录执行）
pnpm install

# Yarn：安装所有子包的依赖
yarn install
```

#### （3）查看工作区信息

```bash
# pnpm：查看所有子包列表（仅显示一级）
pnpm list -r --depth -1

# Yarn：查看工作区依赖关系图（Yarn 专属）
yarn workspaces info

# pnpm：分析 extension 中 core 包的依赖来源
pnpm why @your-org/core --filter @your-org/extension
```

### 3. 脚本封装（简化命令）

可在根 `package.json` 中封装常用命令，降低记忆成本：

```json
// package.json（根目录）
{
  "scripts": {
    "dev": "pnpm --filter @your-org/extension dev", // pnpm 版本
    // "dev": "yarn workspace @your-org/extension dev", // Yarn 版本
    "build:extension": "pnpm --filter @your-org/extension build",
    "build:core": "pnpm --filter @your-org/core build",
    "build": "pnpm -r run build" // 构建所有子包
  }
}
```

执行封装后的命令：

```bash
pnpm run dev  # 等价于 pnpm --filter @your-org/extension dev
pnpm build    # 等价于 pnpm -r run build
```

遇到依赖问题时，可按以下步骤梳理：

1. **确定工作区范围**：查看 `pnpm-workspace.yaml`（pnpm）或根 `package.json` 的 `workspaces` 字段（Yarn），明确哪些目录是子包；
2. **查看子包标识**：进入子包目录，查看 `package.json` 的 `name` 字段（如 `@your-org/core`），这是操作子包的「唯一标识」；
3. **梳理依赖链路**：查看子包的 `dependencies`/`devDependencies`，所有带 `workspace:*` 的依赖即为「本地子包依赖」；
4. **确认构建顺序**：被依赖的包需先构建（如 `core` → `extension`），pnpm/Yarn 的递归命令（`pnpm -r build`/`yarn workspaces run build`）会自动按「拓扑排序」执行，无需手动调整。

## 六、常见问题与解决方案

### Q1：为什么子目录执行 `pnpm build` 会失败？

A：子目录的包管理器无法识别工作区配置，会尝试从 npm 仓库下载 `workspace:*` 声明的包（如 `@your-org/core`），但 npm 上无此包（或版本不匹配），导致解析失败。**所有命令必须在根目录执行**，通过 `--filter`/`workspace` 参数指定子包。

### Q2：如何新增一个子包？

A：步骤如下：

1. 在 `packages/` 下创建新目录（如 `packages/utils`）；
2. 初始化 `package.json`，配置 `name`（建议用作用域：`@your-org/utils`）、`version`、入口等；
3. 在根目录执行 `pnpm install`/`yarn install`，包管理器自动识别新包并建立软链接；
4. 其他子包可通过 `workspace:*` 引用新包。

### Q3：子包版本如何管理？

A：有两种主流方式：

1. **独立版本**：每个子包维护自己的 `version`（如 `core:2.0.0`、`extension:2.0.5`），适合不同包迭代节奏不同的场景；
2. **统一版本**：所有子包使用相同版本（如均为 2.0.0），可通过 `changesets`/`lerna` 工具统一管理；
3. 工具推荐：`changesets`（pnpm 官方推荐）可自动检测子包变更、更新版本号、生成发布日志，适配两种版本管理方式。

### Q4：如何发布子包到 npm？

A：

1. 确保子包 `package.json` 中 `private: false`（根包必须为 `true`）；
2. pnpm：`pnpm --filter @your-org/core publish`；
3. Yarn：`yarn workspace @your-org/core publish`；
4. 发布前建议用 `changesets` 确认版本号，避免手动修改出错。

### Q5：多包架构中如何解决包间循环依赖问题？

**1. 重构代码**：将公共功能提取到独立的 C 包，使 A 和 B 都依赖 C，而非相互依赖。

**2. 使用接口解耦**：定义接口于一个单独包中，实现类置于另一包，通过依赖注入方式交互。

**3.调整加载顺序**：部分语言支持延迟加载或弱引用，以缓解循环依赖的影响。

## 总结

1. **核心本质**：多包架构通过「单仓库管理多包 + 工作区软链接」实现代码复用与统一管理，`workspace:*` 是本地包依赖的核心协议；
2. **工具选择**：pnpm 更适合追求「严格依赖隔离」的场景，Yarn 适合追求「安装速度」的场景，两者核心能力一致；
3. **命令原则**：所有操作在根目录执行，通过 `--filter`（pnpm）/`workspace`（Yarn）精准操作子包，`-r`/`workspaces run` 批量操作所有子包；
4. **核心优势**：修改本地包源码实时生效，无需发布到 npm；公共依赖统一管理，减少冗余；工程化配置复用，降低维护成本。

多包架构的核心价值是「提升开发效率」，掌握上述配置和命令后，可轻松应对中小型多包项目的开发、构建与发布，后续可结合 `changesets`（版本管理）、`tsup`/`rollup`（构建）、`vitest`（测试）等工具，打造完整的多包工程化体系。
