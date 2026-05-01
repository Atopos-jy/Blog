---
title: 前端js调用后端API的三种方法
published: 2025-10-12
tags: [前端, api]
category: 工具
description: 文章描述
pinned: false
draft: false
---

## 前端js调用后端API的三种方法

在 Web 开发中，前端与后端的协同是实现功能的核心环节，而前端通过 JavaScript 调用后端 API 接口，更是实现数据交互、完成业务逻辑的关键步骤。无论是用户登录时的信息验证，还是页面数据的动态加载，都离不开 API 调用。本文将详细介绍三种主流的前端 JS 调用后端 API 的方法，包括传统的 XMLHttpRequest、简化开发的 jQuery Ajax，以及现代项目常用的 axios 与 fetch，帮助开发者根据项目需求选择合适的方案。

下面主要介绍三种方法来实现前端js对后端API接口的调用：

**方法一**： `XMLHttpRequest`

**方法二**： `jQuery和Ajax`

**方法三**： `axios`、`fetch`

### XMLHttpRequest

XMLHttpRequest（简称 XHR）是浏览器提供的原生 API，也是前端调用后端 API 的 “鼻祖” 级方案。它不依赖任何第三方库，兼容性极强，能在几乎所有主流浏览器中运行，适合需要兼顾老旧浏览器的项目。

（1）创建XMLHttpRequest对象；

（2）建立http连接；

（3）发送请求；

（4）获取返回数据。

#### 1.核心原理

通过创建 XMLHttpRequest 对象，配置请求方式（GET、POST 等）、请求 URL、是否异步等参数，然后发送请求；同时监听对象的状态变化，当请求完成且响应成功时，获取后端返回的数据并进行处理。

Post请求与Get请求主要有两点不同：
①post请求需要设置请求头的格式内容：xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
②post请求参数放在send里面，即请求体

#### 2.实现步骤与代码示例

```javascript
// 1. 创建XMLHttpRequest对象
const xhr = new XMLHttpRequest();

// 2. 配置请求（请求方法、URL、是否异步）
// GET请求：若需传参，可在URL后拼接（如"?id=1&name=test"）
xhr.open("GET", "https://api.example.com/user/list", true);

// 3. 设置请求头（可选，根据后端要求配置，如POST请求传JSON需设置）
// 若为POST请求，需添加：xhr.setRequestHeader('Content-Type', 'application/json');

// 4. 监听请求状态变化，处理响应
xhr.onreadystatechange = function () {
  // readyState=4表示请求已完成，status=200表示响应成功
  if (xhr.readyState === 4 && xhr.status === 200) {
    // 解析后端返回的JSON数据（若返回非JSON则直接用xhr.responseText）
    const responseData = JSON.parse(xhr.responseText);
    console.log("请求成功，返回数据：", responseData);
    // 后续业务逻辑：如渲染页面数据
  } else if (xhr.readyState === 4) {
    // 请求完成但响应失败（如404、500错误）
    console.error("请求失败，状态码：", xhr.status);
  }
};

// 5. 发送请求（POST请求需传参，如xhr.send(JSON.stringify({id: 1}))）
xhr.send();

// 6. 处理网络错误
xhr.onerror = function () {
  console.error("网络错误，请求无法发送");
};
```

3. #### 优缺点

- 优点：原生 API，无依赖；兼容性好，支持老旧浏览器（如 IE6+）。

- 缺点：代码繁琐，需手动处理请求状态、错误和数据解析；不支持 Promise，无法使用 async/await 简化异步代码。

### jQuery Ajax

Query 是早期前端开发中常用的 JavaScript 库，它对 XMLHttpRequest 进行了封装，提供了简洁的 Ajax 方法，大幅减少了代码量，让 API 调用更高效。

1. #### 核心原理

基于 XMLHttpRequest 封装，通过统一的$.ajax()方法整合请求配置，内置了数据解析、错误处理等逻辑，同时提供$.get()、$.post()等简化方法，降低开发成本。

#### 2. 实现步骤与代码示例

jquary调用ajax方法：

​ 格式：$.ajax({});

​ 参数：

​ type：请求方式GET/POST

​ url：请求地址

​ async：是否异步，默认是true表示异步

​ data：发送到服务器的数据

​ dataType：预期服务器返回的数据类型

​ contentType：设置请求头

​ error：请求失败时调用此函数

get请求

```html
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
```

```javascript
$.ajax({
  url: "https://api.example.com/user/add", // 请求URL
  type: "POST", // 请求方法（GET/POST/PUT/DELETE等）
  contentType: "application/json", // 发送数据的格式
  data: JSON.stringify({
    // 发送给后端的数据
    name: "张三",
    age: 25,
  }),
  dataType: "json", // 预期后端返回的数据格式（自动解析）
  success: function (response) {
    // 请求成功回调
    console.log("添加用户成功：", response);
  },
  error: function (xhr, status, error) {
    // 请求失败回调
    console.error("添加用户失败：", status, error);
  },
  complete: function () {
    // 请求完成（无论成功/失败）回调
    console.log("请求结束");
  },
});
```

（2）简化方法：$.get()与$.post()

适用于简单的 GET/POST 请求，无需复杂配置：

```javascript
$.get();
	语法：
    $.get("请求地址"，"请求参数",function(形参){

    })；
$.post();
	语法：
    $.post("请求地址"，"请求参数",function(形参){

    })；
```

```javascript
// GET请求：获取用户列表
$.get(
  "https://api.example.com/user/list",
  { page: 1, size: 10 },
  function (response) {
    console.log("用户列表：", response);
  },
  "json",
).fail(function (error) {
  console.error("获取失败：", error);
});

// POST请求：添加用户
$.post(
  "https://api.example.com/user/add",
  { name: "李四", age: 30 },
  function (response) {
    console.log("添加成功：", response);
  },
  "json",
).fail(function (error) {
  console.error("添加失败：", error);
});
```

#### 3. 优缺点

- 优点：代码简洁，封装完善；内置错误处理和数据解析；支持链式调用。

- 缺点：需引入 jQuery 库，增加页面加载体积；现代单页应用（如 Vue、React 项目）中，通常不依赖 jQuery，易造成冗余。

### axios fetch

随着前端技术的发展，Promise 成为异步编程的标准，axios 和 fetch 应运而生。它们基于 Promise，支持 async/await 语法，更符合现代前端开发习惯，是 Vue、React、Angular 等框架项目的首选。

#### 1. axios：功能强大的 Promise 库

axios 是一个基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js 环境，提供了拦截请求 / 响应、取消请求、自动转换 JSON 数据等丰富功能。

（1）使用步骤

首先需安装 axios（npm/yarn）或通过 CDN 引入：

```html
# npm安装 npm install axios # 或CDN引入
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

```javascript
// 1. 基础GET请求（带参数）
axios
  .get("https://api.example.com/user/list", {
    params: { page: 1, size: 10 }, // 自动拼接为URL参数
  })
  .then(function (response) {
    console.log("请求成功：", response.data); // response.data直接是解析后的JSON
  })
  .catch(function (error) {
    // 统一处理错误（包括网络错误、404、500等）
    if (error.response) {
      // 有响应但状态码错误
      console.error("响应错误，状态码：", error.response.status);
      console.error("错误数据：", error.response.data);
    } else if (error.request) {
      // 无响应（网络错误）
      console.error("网络错误，无响应：", error.request);
    } else {
      // 请求配置错误
      console.error("请求配置错误：", error.message);
    }
  });

// 2. 基础POST请求（传JSON数据）
axios
  .post(
    "https://api.example.com/user/add",
    {
      name: "王五",
      age: 28,
    },
    {
      headers: { "Content-Type": "application/json" }, // 可选，默认已支持JSON
    },
  )
  .then((response) => {
    console.log("添加成功：", response.data);
  })
  .catch((error) => {
    console.error("添加失败：", error);
  });

// 3. 结合async/await（更简洁的异步写法）
async function getUserList() {
  try {
    const response = await axios.get("https://api.example.com/user/list", {
      params: { page: 1, size: 10 },
    });
    console.log("用户列表：", response.data);
    return response.data;
  } catch (error) {
    console.error("获取失败：", error);
    throw error; // 抛出错误供上层处理
  }
}
// 调用函数
getUserList();

// 4. 高级功能：请求拦截器（添加Token等）
axios.interceptors.request.use(
  (config) => {
    // 给所有请求添加Token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
```

#### 2. fetch调用API接口使用方法

fetch 是 ES6 引入的浏览器原生 API，基于 Promise，无需依赖第三方库，设计更简洁，是现代浏览器的原生选择。但需注意其部分 “特殊行为”（如不默认拦截 HTTP 错误状态码）。

##### 一、请求头的核心作用

请求头的本质是“键值对”（比如 `Key: Value`），不同的键对应不同的功能，常见作用有 4 类：

1. **身份验证**：告诉服务器“我有权限访问”，比如携带登录后的 Token。  
   示例：`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
2. **说明请求体格式**：如果请求带了数据（比如 POST 提交表单/JSON），告诉服务器“数据是什么格式”，避免服务器解析错误。  
   示例：`Content-Type: application/json`（表示请求体是 JSON 格式）
3. **指定响应格式**：告诉服务器“我只想要 JSON 格式的响应，不要 HTML”，减少无用数据传输。  
   示例：`Accept: application/json`
4. **控制缓存/超时**：告诉服务器“是否用缓存数据”“请求超时时间”等，优化性能。  
   示例：`Cache-Control: no-cache`（表示不使用缓存，要最新数据）

##### 二、在 fetch 中如何设置请求头

fetch 默认会带一些基础请求头（比如 `User-Agent` 表示浏览器信息），如果需要自定义，需在 `fetch` 的第二个参数（配置对象）中通过 `headers` 字段设置，格式是对象或 `Headers` 实例。

#### 代码示例（自定义请求头）：

```javascript
// 1. 定义要发送的数据（比如提交表单）
const postData = {
  username: "test",
  password: "123456",
};

// 2. fetch 请求中设置请求头
fetch("https://api.example.com/login", {
  method: "POST", // 请求方法（POST/GET 等）
  headers: {
    // 自定义请求头：说明请求体是 JSON 格式
    "Content-Type": "application/json",
    // 自定义请求头：携带身份 Token（如果需要登录后访问）
    Authorization: "Bearer your_token_here",
  },
  // 请求体：要和 Content-Type 对应（这里转成 JSON 字符串）
  body: JSON.stringify(postData),
})
  .then((response) => response.json())
  .then((data) => console.log("响应数据：", data))
  .catch((error) => console.error("请求错误：", error));
```

##### 三、常见的默认/常用请求头

不用手动设置，但需要了解的基础请求头：
| 请求头字段 | 作用说明 | 示例值 |
| ---------------- | ------------------------------------------- | ------------------------------------ |
| `User-Agent` | 告诉服务器“发起请求的客户端（浏览器/设备）” | `Mozilla/5.0 (Windows NT 10.0; ...)` |
| `Host` | 告诉服务器“请求的目标域名” | `api.example.com` |
| `Connection` | 控制请求连接是否保持（比如长连接） | `keep-alive` |
| `Content-Length` | 告诉服务器“请求体的字节大小”（自动计算） | `45`（表示请求体有 45 个字节） |

简单说，请求头就是“请求的说明书”——没有它，服务器可能不知道怎么解析你的数据、不知道你有没有权限，甚至不知道你要什么格式的响应。

fetch 请求中的**请求体（Request Body）**，简单说就是你通过请求**发送给服务器的具体数据**——如果把请求比作“寄快递”，请求头是“快递单”（写说明信息），请求体就是“包裹里的东西”（实际要传递的内容）。

##### 一、请求体的核心特点

1. **不是所有请求都有请求体**
   - 有请求体的请求：通常是需要“提交数据”的请求，比如 `POST`（提交表单、创建数据）、`PUT`（修改数据）、`PATCH`（部分更新数据）。
   - 没有请求体的请求：通常是“获取数据”的请求，比如 `GET`（参数直接拼在 URL 里，如 `?id=123`）、`DELETE`（部分场景参数也在 URL 中）。

2. **数据格式需和请求头匹配**  
   请求体的格式（如 JSON、表单、文件），必须通过请求头中的 **`Content-Type`** 字段告诉服务器，否则服务器无法正确解析数据。比如：
   - 发送 JSON 数据 → `Content-Type: application/json`
   - 发送表单数据 → `Content-Type: application/x-www-form-urlencoded`
   - 上传文件 → `Content-Type: multipart/form-data`

##### 二、fetch 中如何设置请求体（常见场景示例）

在 `fetch` 的配置对象中，通过 `body` 字段设置请求体，不同数据格式的写法不同，以下是 3 种高频场景：

1. 场景1：发送 JSON 数据（最常用）

适合接口要求传递结构化数据（如登录、创建订单），需将 JavaScript 对象转成 JSON 字符串。

```javascript
const userData = {
  username: "testUser",
  password: "123456",
};

fetch("https://api.example.com/login", {
  method: "POST", // 必须用 POST/PUT 等支持请求体的方法
  headers: {
    "Content-Type": "application/json", // 告诉服务器“请求体是 JSON 格式”
  },
  body: JSON.stringify(userData), // 请求体：将对象转成 JSON 字符串
})
  .then((res) => res.json())
  .then((data) => console.log("登录结果：", data));
```

2. 场景2：发送表单数据（模拟表单提交）

适合传递简单键值对（如搜索、表单提交），数据格式类似 URL 参数（`key1=value1&key2=value2`）。

```javascript
// 方式1：手动拼接字符串
const formDataStr = "username=testUser&password=123456";

// 方式2：用 URLSearchParams 自动处理（推荐，避免手动拼接错误）
const formData = new URLSearchParams();
formData.append("username", "testUser");
formData.append("password", "123456");

fetch("https://api.example.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded", // 表单格式标识
  },
  body: formData, // 直接传 URLSearchParams 实例（无需转字符串）
})
  .then((res) => res.json())
  .then((data) => console.log("登录结果：", data));
```

3. 场景3：上传文件（如图片、文档）

需用 `FormData` 对象，此时不需要手动设置 `Content-Type`——浏览器会自动添加 `multipart/form-data` 及边界标识（避免文件数据解析错误）。

```javascript
// 假设页面有 <input type="file" id="fileInput">
const fileInput = document.querySelector("#fileInput");
const file = fileInput.files[0]; // 获取选中的文件

const formData = new FormData();
formData.append("file", file); // "file" 是服务器接收文件的字段名
formData.append("fileName", file.name); // 额外传递文件名（可选）

fetch("https://api.example.com/upload", {
  method: "POST",
  // 不用手动设置 Content-Type！浏览器会自动处理
  body: formData, // 请求体：FormData 实例（包含文件数据）
})
  .then((res) => res.json())
  .then((data) => console.log("上传结果：", data));
```

##### 三、关键注意事项

1. **数据格式必须与 `Content-Type` 一致**  
   比如：如果 `Content-Type` 是 `application/json`，`body` 必须是 JSON 字符串（不能直接传对象）；如果传 `FormData`，则不能手动设置 `Content-Type`（否则浏览器无法添加正确的边界标识）。

2. **`GET` 请求不能设置请求体**  
   即使给 `GET` 请求加了 `body`，浏览器也会忽略该字段，数据不会发送给服务器。如果需要传参数，只能拼在 URL 中（如 `https://api.example.com/user?id=123`）。

3. **注意请求体大小限制**  
   不同服务器对请求体大小有默认限制（比如 Nginx 默认限制 1MB），如果上传大文件（如视频），需要提前配置服务器调整限制。

简单说，请求体就是“你要发给服务器的数据本体”，核心是选对数据格式、配好对应的 `Content-Type`，再结合合适的请求方法（如 `POST`）即可正常传递。

```javascript
// 1. 基础GET请求
fetch("https://api.example.com/user/list?page=1&size=10")
  .then(function (response) {
    // 注意：fetch仅在网络错误时 reject，404、500等状态码仍会 resolve
    if (!response.ok) {
      // 手动处理HTTP错误
      throw new Error(`请求失败，状态码：${response.status}`);
    }
    // 解析响应数据（支持json()、text()、blob()等）
    return response.json();
  })
  .then(function (data) {
    console.log("用户列表：", data);
  })
  .catch(function (error) {
    console.error("请求错误：", error.message);
  });

// 2. 基础POST请求（传JSON数据）
fetch("https://api.example.com/user/add", {
  method: "POST", // 请求方法
  headers: {
    "Content-Type": "application/json", // 数据格式
  },
  body: JSON.stringify({ name: "赵六", age: 32 }), // 发送的数据（需转为字符串）
  credentials: "include", // 跨域时携带Cookie（可选）
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`状态码错误：${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("添加成功：", data);
  })
  .catch((error) => {
    console.error("添加失败：", error);
  });

// 3. 结合async/await
async function addUser() {
  try {
    const response = await fetch("https://api.example.com/user/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "孙七", age: 26 }),
    });
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }
    const data = await response.json();
    console.log("添加成功：", data);
    return data;
  } catch (error) {
    console.error("错误：", error);
    throw error;
  }
}
// 调用函数
addUser();
```

（2）fetch 的 “特殊注意点”

- 不默认拦截 HTTP 错误：即使状态码为 404、500，fetch 仍会进入then回调，需通过response.ok（true表示 200-299 状态码）手动判断。

- 不自动携带 Cookie：跨域请求时需添加credentials: 'include'配置，同域请求需添加credentials: 'same-origin'。

- 无内置超时处理：需手动通过Promise.race()实现超时控制。

  #### 3. axios 与 fetch 的优缺点对比

特性axiosfetch依赖需安装第三方库浏览器原生，无依赖HTTP 错误处理自动拦截（404、500 等会 reject）需手动通过 response.ok 判断数据解析自动解析 JSON 数据需手动调用 response.json ()超时控制内置 timeout 配置需手动实现拦截器支持请求 / 响应拦截器需手动封装兼容性支持 IE8+（需配合 es6-promise）仅支持现代浏览器（IE 不支持）

总结与选择建议

三种前端 JS 调用后端 API 的方法各有优劣，选择时需结合项目场景、浏览器兼容性要求和开发效率：

- 若需兼容老旧浏览器（如 IE6+），或项目无第三方库依赖，XMLHttpRequest是唯一选择；

- 若项目已引入 jQuery，或需快速实现简单 API 调用，jQuery Ajax能简化代码；

- 若为现代单页应用（Vue/React/Angular），或需丰富功能（如拦截器、超时控制），axios是最优解；

- 若项目追求 “零依赖” 且仅支持现代浏览器，fetch可作为轻量选择（需处理其特殊行为）。

前端技术不断迭代，但 API 调用的核心逻辑始终是 “发送请求 - 处理响应 - 处理错误”。掌握这三种方法，能让你在不同项目中灵活应对前后端交互需求。你在实际开发中更倾向于使用哪种方法？欢迎在评论区分享你的经验！
