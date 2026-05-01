---
title: Nginx 入门与前端项目部署实战配置
published: 2026-04-17
tags: [Nginx]
category: 分类
description: 文章描述
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/2291866-20210131094642778-86146076.jpg
pinned: false
draft: false
---


## Nginx介绍

### 1.什么是

Nginx 是一个异步框架的 **Web 服务器**，也可以用作反向代理，负载平衡器 和 HTTP 缓存，同时也支持反向代理、负载均衡、静态资源托管、HTTPS 配置等核心功能。

简单理解：

- 它能接收用户浏览器的请求
- 把你的前端项目（HTML/CSS/JS/ 图片）返回给用户
- 解决前端路由刷新 404、跨域、资源缓存、网站加速等问题
- 占用内存小、并发能力强，是目前部署前端项目的首选工具

### 2.为什么要使用Nginx

随着当今互联网的迅速发展，单点服务器早已无法承载上万个乃至数十万个用户的持续访问。比如一台Tomcat服务器在理想状态下只能够可以承受住2000个左右的并发量，为了解决这个问题，就需要多台Tomcat服务器来进行负载均衡。

那么，应该如何实现负载均衡？Nginx就是其中的一种解决方案，当用户访问网站时，Nginx拦截到这个访问请求，并将其通过轮询的方式均匀地分配到不同的服务器上。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/2291866-20210131094634921-1809803257.jpg"/>

并且，在Nginx中有一种ip_hash策略，它可以获取到用户的真实IP，计算出hash值来选择服务器，这也是一种优秀的负载均衡方式。 所以，掌握Nginx成为了Web开发学习道路上不可缺少的一部分。

### 3. 正向代理

你 → 代理服务器 → 国外网站

**正向代理，就是客户端将自己的请求率先发给代理服务器，通过代理服务器将请求转发给服务器。**我们常用的VPN就是一种代理服务器，为了可以连上国外的网站，客户端需要使用一个可以连接外网的服务器作为代理，并且客户端能够连接上该代理服务器。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/2291866-20210131094642778-86146076.jpg"/>

### 4. 反向代理

用户 → Nginx → 后端服务

用户不知道背后有多少台服务器

**对用户透明**

反向代理与正向代理不同，正向代理是代理了客户端，而反向代理则是代理服务器端。在有多台服务器分布的情况下，为了能让客户端访问到的IP地址都为同一个网站，就需要使用反向代理。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/2291866-20210131094650731-994473280.jpg"/>

### 5.负载均衡

> 由于不同服务器的配置不同，为了让性能高的服务器分配到更多的请求，便引入了负载均衡的概念

Nginx提供的负载均衡策略有两种：内置策略和扩展策略，内置策略位轮询，加权轮询，lp hash。扩展策略，就天马星空，只有你想不到的没有他做不到的。

内置策略轮询：

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1776410868574.png"/>

加权轮询：保证性能最大化

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1776411484989.png"/>



iphash：对客户端请求的ip进行hash操作，然后根据hash结果将同一个客户端ip的请求分发给同一台服务器进行处理，可以解决session不共享的问题。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1776411536936.png"/>

动静分离：在我们的软件开发中，有些请求是需要后台处理的，有些请求是不需要经过后台处理的（如：css、html、jpg、js等等文件），这些不需要经过后台处理的文件称为静态文件。让动态网站里的动态网页根据一定规则把不变的资源和经常变的资源区分开，东京资源做好了拆分以后，我们就可以根据静态资源的特点将其做缓存操作，提高资源相应的速度。



<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1776411778422.png"/>

具体的Nginx教程可以看：https://xuexb.github.io/learn-nginx/

> 前端的 /api 代理是开发环境的跨域解决方案，打包后失效。
> Nginx 的 /api 代理是生产环境的正式转发规则，是项目上线访问 API 的唯一方式。
>
> 开发靠前端代理，上线靠 Nginx 代理。
> 两者功能相似，但运行阶段、作用范围完全不同。
>
> 这就是我们为什么要用Nginx的原因？

## 部署

在你能访问 `blog.com` 之前，服务器后台其实在偷偷干这两件事：

1. **Nginx**：负责接待用户，直接把你的前端博客文件（HTML/CSS/JS）发给用户。同时，它看到用户请求 `/api`，就把请求转给后端。
2. **后端服务（Node.js + PM2）**：真正的 “大脑”。它一直在运行，监听着 `3000` 端口，处理数据库读写，然后把结果返回给 Nginx，再由 Nginx 发给用户。

所以，你必须完成两个独立的部署任务：

✅ 部署前端（Nginx 托管 dist）

✅ 部署后端（Node + PM2 运行代码）

### 1.安装环境

```bash
# 1. 更新系统软件包
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js 18.x (前端构建和后端运行都需要)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 3. 安装 PM2 (用来后台运行后端代码，防止断开连接就挂了)
npm install pm2 -g

# 4. 安装 Nginx (托管前端)
sudo apt install nginx -y

# 5. 安装 MySQL (存储数据)
sudo apt install mysql-server -y
```

### 2.上传后端代码

然后上传并启动你的后端代码，在本地电脑的新终端中，用 `scp` 命令把项目上传到服务器：

```bash
scp -r /你的本地后端项目路径/* root@47.99.125.73:/root/myapp-backend
```

回到服务器终端，进入目录并启动：

```bash
cd /root/myapp-backend
// 安装生产依赖
npm ci --production
// 启动应用
pm2 start app.js --name "myapp-api"
// 保存当前进程列表
pm2 save
// 生成开机自启动命令
pm2 startup   # 执行后按提示复制粘贴返回的命令
```
<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/fwq"/>

### 3.配置数据库

登录 MySQL，创建数据库，创建用户，并授权：

```
mysql -u root

# 进入 MySQL 后执行
CREATE DATABASE big_event DEFAULT CHARACTER SET utf8mb4;
CREATE USER 'blog_user'@'%' IDENTIFIED BY '你的强密码';
GRANT ALL PRIVILEGES ON big_event.* TO 'blog_user'@'%';
FLUSH PRIVILEGES;
exit;
```

上传数据库后需要修改后端配置，让服务器上的后端接口使用服务器上的数据库，打开 `/root/backend/config/index.js` 或类似的配置文件，把数据库信息改成服务器端的：

```js
// 示例配置
module.exports = {
  port: 3000,
  db: {
    host: 'localhost',
    user: 'blog_user',
    password: '你的强密码',
    database: 'big_event'
  }
};
```

之后启动项目，启动后端服务（用 PM2）

```
# 进入项目目录
cd /root/backend

# 启动项目 (假设入口文件是 app.js 或 index.js)
pm2 start app.js

# 设置开机自启
pm2 startup
```

✅ 此时，你的后端 API 已经在 `http://localhost:3000` 运行了。

### 3.上传前端代码

第一步：生成前端 dist

你在本地电脑执行 `pnpm build`，得到 `dist` 文件夹。

第二步：上传 dist

把 `dist` 上传到服务器 `/root/dist`。

第三步：配置 Nginx

创建并编辑配置文件：

```bash
sudo nano /etc/nginx/conf.d/blog.conf
```

粘贴下面的配置（**仔细看注释**）：

```nginx
server {
    listen 80;
    # 这里填你的域名，或者服务器IP
    server_name 123.123.123.123;

    # 指向你上传的前端 dist 目录
    root /root/dist;
    index index.html;

    # 解决前端刷新 404 问题
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反向代理：凡是请求 /api 的，都转给后端 Node 服务
    location /api {
        proxy_pass http://localhost:3000; # 指向后端运行的地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 测试并重启 Nginx

```bash
# 检查配置文件是否有错
sudo nginx -t

# 重启 Nginx 生效
sudo systemctl restart nginx
```

打开浏览器，输入你的服务器 IP：

1. **看到网页** → 说明 Nginx 配置成功了。
2. **点击登录 / 获取数据**（调用 API） → 说明反向代理配置成功了。
3. **数据能读写** → 说明 MySQL 连接成功了。









