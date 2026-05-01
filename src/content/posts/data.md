---
title: 前端必备：玩转 DOM 的 dataset 属性与 HTML data-* 自定义属性
published: 2025-11-01
tags: [前端, dataset, data-*]
category: 前端
description: 文章描述
pinned: false
draft: false
---

# 前端必备：玩转 DOM 的 dataset 属性与 HTML data-\* 自定义属性

在前端开发中，我们经常需要给 HTML 元素附加一些“额外信息”——比如列表项对应的用户 ID、商品卡片的价格参数、按钮的状态标记等。如果直接用 `id` 或 `class` 存储这些数据，不仅破坏语义化，还容易和样式、其他逻辑冲突。这时，HTML 的 `data-*` 自定义属性和 DOM 的 `dataset` 属性就成了最优解。今天我们就来彻底搞懂这对“数据存储搭档”，让你的代码更优雅、更易维护。

## 一、HTML 层面：data-\* 自定义属性的基础用法

`data-*` 是 HTML5 引入的自定义属性规范，允许开发者为任意 HTML 元素添加以 `data-` 为前缀的属性，用于存储无需显示给用户的“私有数据”。它的核心特点是：**语义化、无冲突、可扩展**。

### 1. 基本语法：怎么写？

`data-*` 的命名规则很简单，记住 3 点即可：

- 必须以 `data-` 开头（这是规范的“身份标识”，缺一不可）；
- 前缀后的数据名：多个单词用 **连字符（-）** 分隔（比如 `data-user-id`，不能用驼峰或下划线）；
- 不能包含特殊字符（如 `@`、`#`、`$`），只能是字母、数字、连字符、下划线。

**示例代码**：给不同元素添加 `data-*` 属性

```html
<!-- 1. 列表项：存储用户 ID 和状态 -->
<ul class="user-list">
  <li data-user-id="1001" data-user-status="active">张三</li>
  <li data-user-id="1002" data-user-status="inactive">李四</li>
</ul>

<!-- 2. 商品卡片：存储商品 ID、价格、库存 -->
<div
  class="product-card"
  data-product-id="2023"
  data-product-price="999.9"
  data-product-stock="50"
>
  <h3>无线耳机</h3>
  <p>降噪效果拉满</p>
</div>

<!-- 3. 按钮：存储点击后的执行动作 -->
<button class="operate-btn" data-action="delete" data-target="user-1002">
  删除用户
</button>
```

从示例能看出，`data-*` 完全不影响元素的显示和语义，只是悄悄“携带”了我们需要的数据——这比用 `id="user-1001-status-active"` 这种拼接式命名优雅太多了。

### 2. 注意点：data-\* 的值都是“字符串”

无论你在 `data-*` 里写什么（数字、布尔值、JSON），最终它的取值都是字符串类型。比如：

```html
<!-- 看似是数字，实际取值是 "999.9" -->
<div data-price="999.9"></div>

<!-- 看似是布尔值，实际取值是 "true" -->
<div data-is-active="true"></div>
```

后续在 JS 中使用时，需要根据需求手动转换类型（比如转数字、转布尔），这是新手最容易踩的坑之一。

## 二、DOM 层面：dataset 属性如何操作 data-\* 数据？

当 HTML 元素被加载到 DOM 中后，浏览器会自动将所有 `data-*` 属性映射到元素的 `dataset` 属性上。`dataset` 是一个 **DOMStringMap 对象**，它的作用是：让开发者用更简洁的语法（驼峰命名）获取、修改、删除 `data-*` 数据，无需手动调用 `getAttribute`/`setAttribute`。

### 1. 核心规则：data-\* 与 dataset 的命名映射

这是 `dataset` 的核心知识点——**连字符命名转驼峰命名**：

- HTML 中的 `data-user-id` → DOM 中 `dataset.userId`；
- HTML 中的 `data-product-price` → DOM 中 `dataset.productPrice`；
- HTML 中的 `data-is-active` → DOM 中 `dataset.isActive`。

简单说：去掉 `data-` 前缀，然后把连字符（-）后的第一个字母大写，其他字母小写，就是 `dataset` 中的属性名。

### 2. 实战：获取、修改、删除数据

我们用一个完整示例，演示 `dataset` 的常用操作：

#### 步骤 1：HTML 结构（带 data-\* 属性）

```html
<div
  id="product"
  data-product-id="2023"
  data-product-price="999.9"
  data-product-stock="50"
>
  无线耳机
</div>
```

#### 步骤 2：JS 操作 dataset

```javascript
// 1. 获取 DOM 元素
const product = document.getElementById("product");

// 2. 👉 获取数据（无需写 data- 前缀，直接用驼峰名）
console.log(product.dataset.productId); // "2023"（字符串类型）
console.log(product.dataset.productPrice); // "999.9"（字符串类型）
console.log(product.dataset.productStock); // "50"（字符串类型）

// 注意：需要手动转换类型（比如价格转数字，库存转数字）
const price = Number(product.dataset.productPrice);
const stock = Number(product.dataset.productStock);
console.log(price + 100); // 1099.9（数字运算正常）

// 3. 👉 修改数据（直接赋值，自动同步到 HTML 属性）
product.dataset.productPrice = "1099.9"; // 修改价格
product.dataset.productStock = "45"; // 修改库存
// 此时 HTML 元素会变成：data-product-price="1099.9" data-product-stock="45"

// 4. 👉 新增数据（直接给 dataset 加新属性，自动生成 data-*）
product.dataset.productBrand = "XX科技"; // 新增品牌数据
// 此时 HTML 元素会新增：data-product-brand="XX科技"

// 5. 👉 删除数据（用 delete 关键字，自动移除 HTML 属性）
delete product.dataset.productStock; // 删除库存数据
// 此时 HTML 元素的 data-product-stock 属性会消失
```

对比传统的 `getAttribute`/`setAttribute`，`dataset` 的优势太明显了：

- 传统写法：`product.getAttribute('data-product-price')` → 冗长，容易写错；
- dataset 写法：`product.dataset.productPrice` → 简洁，符合 JS 命名习惯。

### 3. 特殊情况：data-\* 带多个连字符怎么办？

比如 HTML 中写 `data-user-address-city`，按照规则，`dataset` 中对应的属性名是 `userAddressCity`（连字符后的每个单词首字母大写）：

```html
<div data-user-address-city="北京" id="user"></div>
```

```javascript
const user = document.getElementById("user");
console.log(user.dataset.userAddressCity); // "北京"
```

## 三、实际应用场景：dataset 能解决哪些问题？

光懂语法不够，关键要知道在项目中怎么用。以下是 `data-*` + `dataset` 的 4 个高频场景，覆盖 80% 的前端需求。

### 1. 列表项点击：快速获取关联 ID

在用户列表、商品列表中，点击某一项需要获取对应的 ID（比如删除用户、查看商品详情）。用 `dataset` 无需遍历或拼接 ID，直接从点击元素中取：

```html
<ul id="userList">
  <li data-user-id="1001">张三 <button class="delete-btn">删除</button></li>
  <li data-user-id="1002">李四 <button class="delete-btn">删除</button></li>
</ul>
```

```javascript
// 事件委托：给父元素绑定点击事件
const userList = document.getElementById("userList");
userList.addEventListener("click", (e) => {
  // 只处理删除按钮的点击
  if (e.target.classList.contains("delete-btn")) {
    // 获取当前列表项的 user-id（通过 closest 找到父 li）
    const userId = e.target.closest("li").dataset.userId;
    console.log(`删除用户 ID：${userId}`);
    // 后续调用接口：deleteUser(userId)
  }
});
```

`closest()` 是 JavaScript 中 **DOM 元素的原生方法**，用于**向上遍历当前元素的祖先节点（包括自身）**，查找第一个匹配指定 CSS 选择器的元素。简单说：它能帮你快速找到 “离当前元素最近的某个祖先（或自己）”，是处理事件委托、元素定位的高效工具。

### 2. 组件配置：传递初始化参数

开发自定义组件（如弹窗、列表）时，我们可以通过 `data-*` 给组件传递配置参数，无需写额外的 JS 配置对象：

```html
<li
  class="songlist-item ${isEvenOrOdd} ${activeProxy.active === String(item.id) ? 'active' : ''} d-flex justify-content-start"
  data-index="${item.id}"
></li>

//script const songlistWrap =
document.querySelector(".recommend-list-songlist-body");
songlistWrap.addEventListener("mouseover", (e) => { //获取到的e.target总是大写的
转化为小写之后才能比对 const targetName = e.target.nodeName.toLocaleLowerCase();
if(targetName == "li") { const id = e.target.getAttribute("data-index");
console.log(id); activeProxy.active = id; } }, true) //mouseenter
是一个特殊的事件 ——它只在鼠标 “首次进入当前元素本身”
时触发，不会冒泡，也不会因为子元素的进入而触发。
```

这种方式让组件的配置更灵活——修改参数只需改 HTML 的 `data-*`，无需动 JS 代码，符合“关注点分离”原则。

### 3. 状态标记：记录元素的动态状态

有些元素的状态（如是否选中、是否展开、加载状态）不需要用 CSS 类标记，用 `data-*` 存储更合适：

```html
<!-- 折叠面板：用 data-is-expanded 标记展开状态 -->
<div class="collapse-panel" data-is-expanded="false">
  <h3 class="panel-header">面板标题</h3>
  <div class="panel-content">面板内容...</div>
</div>
```

```javascript
const panel = document.querySelector(".collapse-panel");
const header = panel.querySelector(".panel-header");
const content = panel.querySelector(".panel-content");

// 点击标题切换展开/折叠
header.addEventListener("click", () => {
  // 切换状态（取反）
  const isExpanded = panel.dataset.isExpanded === "true";
  panel.dataset.isExpanded = !isExpanded;

  // 根据状态修改样式
  content.style.display = isExpanded ? "none" : "block";
  header.textContent = isExpanded ? "展开面板" : "折叠面板";
});
```

### 4. 避免硬编码：关联 DOM 与业务数据

比如在表格中，每行数据对应一个业务对象（如订单），我们可以用 `data-*` 存储订单的关键信息，避免在 JS 中硬编码映射关系：

```html
<table id="orderTable">
  <tr data-order-id="3001" data-order-status="paid" data-order-amount="199">
    <td>3001</td>
    <td>已支付</td>
    <td>199元</td>
    <td><button class="view-btn">查看详情</button></td>
  </tr>
</table
```

## 四、注意事项与最佳实践

虽然 `data-*` 和 `dataset` 很好用，但如果不注意细节，也容易踩坑。记住以下 4 点，让你的代码更稳健：

### 1. 类型转换：dataset 的值都是字符串！

前面反复提到，`dataset` 获取的值默认是字符串，即使你写的是数字或布尔值。比如：

```html
<div data-count="10" data-is-valid="true" id="test"></div>
```

```javascript
const test = document.getElementById("test");
console.log(typeof test.dataset.count); // "string"（不是 number）
console.log(typeof test.dataset.isValid); // "string"（不是 boolean）
```

**解决方案**：根据需求手动转换类型：

- 数字：`Number(dataset.count)` 或 `+dataset.count`；
- 布尔：`dataset.isValid === 'true'`（注意不能用 `Boolean(dataset.isValid)`，因为空字符串也是 `false`）；
- JSON：如果 `data-*` 存储的是 JSON 字符串（如 `data-user='{"name":"张三","age":20}'`），需要用 `JSON.parse(dataset.user)` 解析。

### 2. 命名规范：避免冲突，保持语义化

- 数据名要带“业务前缀”：比如存储用户数据用 `data-user-*`，商品数据用 `data-product-*`，避免不同模块的 `data-*` 冲突（比如 `data-id` 可能被用户、商品同时使用，改成 `data-user-id` 和 `data-product-id` 更清晰）；
- 不要用 `data-` 存储样式相关数据：比如 `data-is-red` 这种标记样式的，应该用 CSS 类（如 `class="red"`），`data-*` 只用于“数据存储”，不用于“样式控制”。

### 3. 兼容性：dataset 不支持 IE10 及以下

`dataset` 是 HTML5 特性，支持 IE11+、Chrome、Firefox、Safari 等现代浏览器。如果需要兼容 IE10 及以下，只能用传统的 `getAttribute`/`setAttribute`：

```javascript
// 兼容 IE10 的写法（替代 dataset）
const userId = el.getAttribute("data-user-id"); // 获取
el.setAttribute("data-user-id", "1003"); // 修改
el.removeAttribute("data-user-id"); // 删除
```

不过现在大部分项目已经不再兼容 IE 低版本，直接用 `dataset` 即可。

### 4. 性能：大数据不建议存在 dataset 中

`dataset` 适合存储“轻量级数据”（如 ID、状态、配置参数）。如果需要存储大量数据（如完整的用户列表、商品详情），建议用 JS 变量或 `localStorage`/`sessionStorage` 存储，避免 `data-*` 过多导致 DOM 元素体积过大，影响渲染性能。

## 五、总结：为什么推荐用 data-\* + dataset？

对比传统的“自定义属性”（如 `id="user-1001"`、`class="product-2023"`）或“隐藏 input”（如 `<input type="hidden" value="1001">`），`data-*` + `dataset` 有 3 个核心优势：

1. **语义化**：`data-*` 是 HTML 规范认可的自定义属性，不会破坏元素的语义（比如 `id` 本来是用于唯一标识元素，不该用来存储业务数据）；
2. **简洁性**：`dataset` 用驼峰命名简化了数据操作，比 `getAttribute`/`setAttribute` 代码更短、更易读；
3. **可扩展性**：支持任意数量的 `data-*` 属性，不同模块可以独立定义自己的 `data-*`，不会冲突。

总之，`data-*` 和 `dataset` 是前端开发中“小而美”的知识点，看似简单，却能解决很多实际问题。
