---
title: git分支命令
published: 2026-02-09
tags: [前端, git]
category: 分类
description: 文章描述
pinned: false
draft: false
---

# GitFlow 工作流完整命令手册（纯命令干货版）

GitFlow 是一套标准化的 Git 分支管理流程，核心围绕 `master`（生产分支）、`develop`（开发分支）、`feature`（功能分支）、`release`（发布分支）、`hotfix`（紧急修复分支）五类分支展开。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/gitflow.png"/>

具体工作流详情见：[Git之GitFlow工作流 | Gitflow Workflow（万字整理，已是最详）](https://blog.csdn.net/sunyctf/article/details/130587970?fromshare=blogdetail&sharetype=blogdetail&sharerId=130587970&sharerefer=PC&sharesource=2401_85011172&sharefrom=from_link)

以下是从仓库初始化到生产发布的全流程命令，无冗余文字，直接复制可用。

## 一、初始化：仓库与分支准备

### 1. 本地初始化仓库（全新项目）

```bash
# 创建项目目录并进入
mkdir project-name && cd project-name
# 初始化Git仓库
git init
# 关联远程仓库（替换为你的远程地址）
git remote add origin git@github.com:xxx/project-name.git
# 首次提交并推送到master
touch README.md && git add . && git commit -m "init: 初始化仓库"
git push -u origin master
```

当你首次配置仓库时，需要配置密钥，以下是首次创建项目时，不同认证方式的**触发时机+核心命令**，直接对应场景使用：

| 认证方式          | 触发时机                                     | 适用场景                   |
| ----------------- | -------------------------------------------- | -------------------------- |
| SSH密钥           | 配置后，首次`git push/pull`远程仓库时        | 长期使用（免重复输入密码） |
| 个人令牌（Token） | 无SSH时，首次`git push`输入账号后替代密码    | 临时/无SSH权限场景         |
| 账号密码          | 无SSH/Token时，首次`git push`弹窗/命令行提示 | 仅临时测试（不推荐）       |

#### 方式1：SSH密钥认证

首次关联远程仓库（`git remote add origin`）后执行`git push`时，若未配置SSH，会提示权限拒绝，需先配置SSH密钥。

```bash
# 1. 生成SSH密钥（替换为你的邮箱，一路回车默认即可）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 查看并复制SSH公钥（复制输出的全部内容）
# Mac/Linux
cat ~/.ssh/id_ed25519.pub
# Windows（PowerShell）
type $HOME/.ssh/id_ed25519.pub

# 3. 登录Git平台（GitHub/GitLab/Gitee）添加公钥
# 路径：个人设置 → SSH and GPG keys → New SSH key → 粘贴公钥保存

# 4. 验证SSH连接（替换为对应平台域名）
ssh -T git@github.com # GitHub
ssh -T git@gitee.com   # Gitee
ssh -T git@gitlab.com  # GitLab

# 5. 验证成功后，执行首次push（免密）
git push -u origin master
```

#### 方式2：个人令牌（Token）认证

未配置SSH，执行`git push -u origin master`后，命令行弹出“输入用户名密码”时，**密码框输入Token而非真实密码**。

```bash
# 1. 先执行首次push，触发账号输入
git push -u origin master

# 2. 命令行提示输入时：
# 用户名：输入Git平台账号（如GitHub用户名/邮箱）
# 密码：输入提前生成的个人令牌（Token）

# 【可选】保存Token到凭据管理器（免重复输入）
# Windows
git config --global credential.helper wincred
# Mac
git config --global credential.helper osxkeychain
# Linux
git config --global credential.helper store
```

**Token生成步骤（以GitHub为例）**

> 1. 登录GitHub → 头像 → Settings → Developer settings → Personal access tokens → Generate new token；
> 2. 勾选权限（至少`repo`）→ 生成Token（**仅显示一次，务必复制保存**）。

#### 方式3：账号密码认证

未配置SSH/Token，执行`git push -u origin master`后，命令行/弹窗提示输入“用户名+密码”时。

> GitHub/GitLab已禁用纯密码认证，此方式仅适用于部分私有Git服务器；
>
> 输入后若提示“密码认证失败”，需切换Token方式。

核心总结

```bash
# SSH密钥生成
ssh-keygen -t ed25519 -C "你的邮箱" && cat ~/.ssh/id_ed25519.pub

# 保存凭据（Token/密码免重复输入）
git config --global credential.helper [wincred/osxkeychain/store]

# 首次push（触发认证）
git push -u origin master
```

### 2. 初始化GitFlow分支结构（基于已有仓库）

```bash
# 拉取远程master最新代码
git checkout master && git pull origin master
# 创建并切换到develop分支（开发主分支）
git checkout -b develop
# 推送develop到远程
git push -u origin develop
```

## 二、功能开发：feature分支全流程

### 1. 从develop创建功能分支

```bash
# 切换到develop并拉取最新
git checkout develop && git pull origin develop
# 创建功能分支（命名规范：feature/功能名-版本，例：feature/user-login-v1）
git checkout -b feature/xxx-function
```

### 2. 功能开发&本地提交

```bash
# 开发过程中阶段性提交
# 开发中多次本地提交（仅本地，随意提交，不影响远程）
git add .
git commit -m "feat: 实现xxx功能核心逻辑"

#功能开发完成/需要协作/备份时
git push origin feature/xxx-function
```

### 3.从develop上拉别人的代码

#### 场景 1：本地 develop 分支无未提交修改

```bash
# 1. 切换到本地develop分支
git checkout develop

# 2. 拉取远程develop最新代码（自动合并到本地develop）
git pull origin develop
```

#### 场景 2：本地有未提交修改

```bash
# 1. 暂存本地未提交的修改（关键：防止拉取时代码冲突丢失）
git stash

# 2. 切换到develop并拉取最新
git checkout develop && git pull origin develop

# 3. 恢复本地暂存的修改（继续开发）
git stash pop

# 4. 若恢复后有冲突，解决后提交
git add . && git commit -m "merge: 解决拉取develop后的代码冲突"
```

#### 场景 3：当前在功能分支，需同步 develop 最新代码到功能分支

```bash
# 1. 切换到develop并拉取最新
git checkout develop && git pull origin develop

# 2. 切回功能分支，合并develop最新代码（同步他人修改）
git checkout feature/xxx-function && git merge develop

# 3. 有冲突则解决后提交，无冲突直接继续开发
git add . && git commit -m "merge: 同步develop最新代码到功能分支"
```

### 4.功能完成：合并到develop

```bash
# 1. 拉取功能分支本地最新（防止本地遗漏提交）
git checkout feature/xxx-function && git add . && git commit -m "fix: 修复xxx问题"
# 2. 切换到develop并拉取远程最新
git checkout develop
git pull origin develop
# 3. 合并功能分支到develop
git merge feature/xxx-function --no-ff -m "merge: 合并xxx功能到develop"
# 4. 推送合并后的develop到远程
git push origin develop
# 5. 删除本地+远程功能分支（可选，功能已合并）
git branch -d feature/xxx-function
git push origin -d feature/xxx-function
git fetch origin --prune # 清理远程已删除的分支缓存
```

## 三、版本发布：release分支全流程

### 1. 从develop创建发布分支

```bash
# 切换到develop并拉取最新
git checkout develop && git pull origin develop
# 创建发布分支（命名规范：release/版本号，例：release/v1.0.0）
git checkout -b release/v1.0.0
```

### 2. 发布分支测试&修复

```bash
# 测试过程中修复小问题（仅改bug，不新增功能）
git add . && git commit -m "fix: 修复发布前xxx小问题"
```

### 3. 发布完成：合并到master+develop

```bash
# 1. 合并到master（生产分支）
git checkout master && git pull origin master
git merge release/v1.0.0 --no-ff -m "release: 发布v1.0.0正式版"
git tag -a v1.0.0 -m "v1.0.0 正式发布" # 打版本标签
git push origin master && git push origin v1.0.0 # 推送master+标签

# 2. 合并到develop（同步发布分支的修复）
git checkout develop && git pull origin develop
git merge release/v1.0.0 --no-ff -m "merge: 同步release/v1.0.0修复到develop"
git push origin develop

# 3. 删除发布分支（本地+远程）
git branch -d release/v1.0.0
git push origin -d release/v1.0.0
git fetch origin --prune
```

## 四、紧急修复：hotfix分支全流程

### 1. 从master创建紧急修复分支

```bash
# 切换到master并拉取最新生产代码
git checkout master && git pull origin master
# 创建hotfix分支（命名规范：hotfix/问题描述-版本，例：hotfix/login-bug-v1.0.1）
git checkout -b hotfix/login-bug-v1.0.1
```

### 2. 修复bug并提交

```bash
git add . && git commit -m "fix: 紧急修复生产环境登录失败问题"
```

### 3. 修复完成：合并到master+develop

```bash
# 1. 合并到master并打新标签
git checkout master && git pull origin master
git merge hotfix/login-bug-v1.0.1 --no-ff -m "hotfix: 修复登录bug，发布v1.0.1"
git tag -a v1.0.1 -m "v1.0.1 紧急修复登录问题"
git push origin master && git push origin v1.0.1

# 2. 合并到develop（同步修复）
git checkout develop && git pull origin develop
git merge hotfix/login-bug-v1.0.1 --no-ff -m "merge: 同步hotfix登录bug修复到develop"
git push origin develop

# 3. 删除hotfix分支（本地+远程）
git branch -d hotfix/login-bug-v1.0.1
git push origin -d hotfix/login-bug-v1.0.1
git fetch origin --prune
```

## 五、通用辅助命令

```bash
# 查看状态
git status
# 查看所有分支（含远程）
git branch -a
# 强制切换分支（放弃本地未提交修改）
git checkout -f develop
# 拉取远程所有分支最新代码
git fetch origin
# 解决冲突后标记为已解决
git add .
# 撤销最近一次提交（保留代码，仅撤回commit）
git reset --soft HEAD~1
# 推送到远程时强制覆盖（谨慎使用，仅自己的分支）
git push origin feature/xxx-function -f
```

## 核心规范总结

1. 分支命名：`feature/xxx`、`release/vx.x.x`、`hotfix/xxx-vx.x.x`；
2. 提交信息：`feat/fix/release/hotfix: 描述`（符合Conventional Commits）；
3. 合并规则：仅通过 `merge --no-ff` 合并（保留分支历史），禁止直接推送到 `master/develop`。
