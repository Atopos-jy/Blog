---
title: JavaScript事件入门，从基础到 DOM 交互
published: 2025-9-27
tags: [前端, dom]
category: 分类
description: 文章描述
pinned: false
draft: false
---

在 JavaScript 中，**事件（Event）** 是指浏览器或用户在页面上执行的特定动作或发生的状态变化，例如点击按钮、鼠标移动、键盘输入、页面加载完成等。事件是 JavaScript 与 HTML 交互的核心机制，让程序能够响应用户行为或系统状态变化。

#### 为什么要引入事件？

在网页开发中，我们需要程序能够根据用户操作做出反应（比如点击按钮后提交表单，输入文字时实时验证）。如果没有事件机制，程序无法感知用户行为，只能执行固定的预设逻辑，无法实现交互功能。

事件机制的核心价值在于：

1.  **实现交互性**：让网页能够响应用户操作（如点击、输入、滑动等）。
2.  **异步执行**：当特定动作发生时才触发对应代码，避免程序阻塞或无效执行。
3.  **解耦逻辑**：将用户操作与处理逻辑分离，使代码更清晰、易于维护。

#### 了解事件前要掌握的知识

JavaScript 由 ECMAScript、DOM、 BOM 组成。

![](https://i-blog.csdnimg.cn/direct/548bc5448d164623807ee6f4265df8c0.png)

        ECMAScript定义的只是这门语言的基础，与 Web 浏览器没有依赖关系，而在基础语法上可以构建更完善的脚本语言。JavaScript的运行需要一定的环境，脱离了环境JavaScript代码是不能运行的，JavaScript只能够寄生在某个具体的环境中才能够工作。

        JavaScript运行环境一般都由宿主环境和执行期环境共同构成，其中宿主环境是由外壳程序生成的，如Web浏览器就是一个外壳程序，它提供了一个可控制浏览器窗口的宿主环境。执行期环境则由嵌入到外壳程序中的JavaScript引擎（或称为JavaScript解释器）生成，在这个环境中JavaScript能够生成内置静态对象，初始化执行环境等。

        Web浏览器自定义的DOM组件，以面向对象方式描述的文档模型。DOM定义了表示和修改文档所需的对象、这些对象的行为和属性以及这些对象之间的关系。DOM对象，是我们用传统的方法(javascript)获得的对象。DOM属于浏览器，而不是JavaScript语言规范里的规定的核心内容。

        前面的DOM是为了操作浏览器中的文档，而为了控制浏览器的行为和操作，浏览器还提供了BOM（浏览器对象模型）。

- ECMAScript(基础语法)JavaScript的核心语法ECMAScript描述了该语言的语法和基本对象
- DOM(文档对象模型)文档对象模型（DOM）——描述了处理网页内容的方法和接口

        在 JavaScript 的组成（ECMAScript、DOM、BOM）中，事件主要在 **DOM（文档对象模型）** 和 **BOM（浏览器对象模型）** 部分发挥关键作用，是实现网页交互的核心机制。下面分 DOM 和 BOM 两部分来解释事件的作用：

##### DOM 中的事件作用

DOM 是用来操作网页内容的方法和接口，事件在 DOM 里让网页元素能响应用户操作（如点击、鼠标移动、输入等），从而实现交互功能。

- **用户交互的桥梁**：比如点击一个按钮（`<button>`），通过给按钮绑定 `click` 事件，就能在用户点击时执行特定代码，像提交表单、显示隐藏内容等。
- **动态更新页面**：当用户在输入框（`<input>`）中输入内容时，`input` 或 `change` 事件可触发，进而动态验证输入、实时搜索提示等，无需刷新页面就能更新内容。
- **事件委托**：利用 DOM 事件的冒泡机制，把多个子元素的事件委托给父元素处理，减少事件绑定数量，提升性能。例如，给一个列表的父容器 `<ul>` 绑定 `click` 事件，处理所有子 `<li>` 的点击，即使列表项是动态添加的，也能正常响应。

##### BOM 中的事件作用

BOM 用于控制浏览器的行为和操作，事件在 BOM 里让开发者能响应浏览器级别的操作或状态变化。

- **浏览器窗口控制**：`window` 对象的 `resize` 事件，在浏览器窗口大小改变时触发，可用于调整页面布局以适配不同窗口尺寸；`scroll` 事件在页面滚动时触发，能实现滚动加载、导航栏固定等效果。
- **页面生命周期管理**：`window` 的 `load` 事件在页面及其所有资源（如图片、脚本等）加载完成后触发，可在此时执行需要所有资源就绪的初始化操作；`unload` 或 `beforeunload` 事件在页面即将卸载（如用户关闭标签页）时触发，可用于提示用户保存数据等。
- **与浏览器交互**：`window` 的 `popstate` 事件（配合历史记录 API），能在用户点击浏览器的前进、后退按钮时触发，实现单页应用的路由控制等功能。

总的来说，事件是 JavaScript 实现网页交互和浏览器控制的核心机制，让静态的网页能根据用户操作和浏览器状态动态响应，提升了网页的交互性和用户体验。

#### 事件

##### 作用

在 JavaScript 中，事件（Event）是实现网页交互的核心机制，其作用主要体现在以下几个方面：

**1.实现用户交互响应**

事件最核心的作用是让网页能够感知并响应用户的操作，例如：

- 点击按钮（`click` 事件）后提交表单、弹出弹窗；
- 输入框输入内容（`input` 事件）时实时验证格式；
- 鼠标悬停在元素上（`mouseover` 事件）时显示提示信息；
- 滚动页面（`scroll` 事件）时加载更多内容或固定导航栏。

没有事件机制，网页只能是静态的展示页面，无法与用户进行任何动态交互。

**2.处理系统状态变化**

事件不仅能响应用户操作，还能监听浏览器或系统的状态变化，例如：

- 页面加载完成（`load` 事件）后执行初始化逻辑；
- 窗口大小改变（`resize` 事件）时调整页面布局；
- 网络状态变化（`online`/`offline` 事件）时提示用户；
- 表单提交（`submit` 事件）前验证数据合法性。

这些功能让网页能根据系统环境动态调整行为，提升鲁棒性。

**3.实现异步逻辑触发**

JavaScript 是单线程语言，事件机制是实现异步操作的重要方式：

- 定时器（`setTimeout`/`setInterval`）触发时执行延迟任务；
- AJAX 请求完成（`readystatechange` 事件）时处理返回数据；
- 图片加载完成（`load` 事件）后获取其尺寸。

通过事件，程序可以“等待”某个条件满足后再执行对应逻辑，避免阻塞主线程。

**4.解耦代码逻辑**

事件机制采用“发布-订阅”模式，将“触发行为”和“处理逻辑”分离：

> - 事件源（如按钮）只负责触发事件，不关心谁来处理；
> - 处理函数只负责响应事件，不关心事件何时被触发。

这种解耦让代码更灵活、易维护，例如多个函数可以同时监听同一个事件，新增或移除逻辑无需修改事件 源代码 。

事件是网页从“静态展示”走向“动态交互”的基础，它让程序能够感知用户行为和系统状态，实现异步逻辑，并通过解耦提升代码的 灵活性 。几乎所有网页的交互功能（如表单提交、导航切换、数据加载等）都依赖事件机制实现。

##### 常见事件类型：

- **鼠标事件(mouse)**：`click`（点击）、`mouseover`（鼠标移入）、`mouseout`（鼠标移出）等。
- **键盘事件(keyboard)**：`keydown`（按键按下）、`keyup`（按键松开）、`input`（输入框内容变化）等。
- **表单事件(form)**：`submit`（表单提交）、`change`（选项变化）等。
- **文档/窗口事件(window/media)**：`load`（页面加载完成）、`resize`（窗口大小变化）、`scroll`（滚动）等。

##### 事件的使用方式

JavaScript 中使用事件通常分为三个步骤：

- **确定事件源**：哪个元素会触发事件（如按钮、输入框、整个文档等）。
- **指定事件类型**：触发的动作类型（如 `click` 点击、`input` 输入、`load` 页面加载等）。
- **绑定事件处理函数**：事件触发时执行的代码（函数）分为事件监听（谁管这个事情，谁监听？）和事件处理（发生了怎么办？）。

案例

> 闯红灯 事件源：车、 事件名：闯红灯 监听：摄像头、交警 处理：扣分、罚款
>
> 按下按钮 事件源：按钮 事件名：按下 监听：窗口 处理：执行函数

##### 事件流和事件模型

        我们的事件最后都有一个特定的事件源，暂且将事件源看做是HTML的某个元素，那么当一个HTML元素产生一个事件时，该事件会在元素节点与根节点之间按特定的顺序传播，路径所经过的节点都会受到该事件，这个传播过程称为DOM事件流。

事件顺序有两种类型：事件捕获 和 事件冒泡。

        冒泡和捕获其实都是事件流的不同表现，这两者的产生是因为IE和Netscape两个大公司完全不同的事件流概念产生的。（事件流：是指页面接受事件的顺序）IE的事件流是事件冒泡，Netscape的事件流是事件捕获流。

###### 事件捕获

        Netscape提出的另一种事件流叫做事件捕获，事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。事件捕获的用意在于在事件到达预定目标之前捕获它。还以前面的例子为例。那么单击`<div>`元素就会按下列顺序触发`click`事件：1、`document`2、`<html>`3、`<body>`4、`<div>`

`![](https://i-blog.csdnimg.cn/direct/edeffeb2135a4229b3cc68a23617c38c.png)`

        在事件捕获过程中，`document`对象首先接收到`click`事件，然后沿DOM树依次向下，一直传播到事件的实际目标，即`<div>`元素。

        虽然事件捕获是Netscape唯一支持的事件流模式，但很多主流浏览器目前也都支持这种事件流模型。尽管“DOM2级事件”规范要求事件应该从`document`对象开始时传播，但这些浏览器都是从`window`对象开始捕获的。

###### 事件冒泡

IE的事件流叫做事件冒泡，即事件开始时由最具体的元素接受，然后逐级向上传播到较为不具体的节点（文档）。例如下面的：

```javascript
window.onload = function () {

var oDiv = document.querySelector('div');

oDiv.onclick = function (event) {

console.log(event);

}

oDiv.addEventListener('click',function(e) {

console.log(e);

console.log(e.target);

})

oDiv.addEventListener('click', function (e) {

console.log(e.type);

})

var oUl = document.querySelector('ul');

oUl.addEventListener('click', function (e) {

alert('aa');

})

}

<body>

<div>123</div>

<ul>

<li>1</li>

<li>2</li>

<li>3</li>

</ul>

</body>
```

每一个li将会因为事件冒泡被影响，点击li将弹出aa

##### 事件处理程序：

**1.HTML 内联属性（不推荐，耦合性高）**

直接在 HTML 标签中通过 `on+事件名` 属性绑定函数：

```javascript
<button onclick="handleClick()">点击我</button>



<script>

function handleClick() {

alert("按钮被点击了！");

}

</script>
```

**2.DOM 属性绑定（简单场景可用）**

通过 JavaScript 获取 DOM 元素，直接赋值事件属性：

```javascript
<button id="myBtn">点击我</button>



<script>

const btn = document.getElementById("myBtn");

 btn.onclick = function() {

alert("按钮被点击了！");

};

</script>
```

**缺点**：一个元素的同一事件只能绑定一个处理函数（后面的会覆盖前面的）。

**3.addEventListener\` 方法（推荐，灵活强大）**

通过 DOM 方法 `addEventListener` 绑定事件，支持为同一事件绑定多个处理函数：

```javascript
<button id="myBtn">点击我</button>



<script>

const btn = document.getElementById("myBtn");

 btn.addEventListener("click", function() {

alert("第一次点击处理");

});

 btn.addEventListener("click", function() {

alert("第二次点击处理");

});

</script>
```

**优点**：

- 支持同一事件绑定多个处理函数。
- 可以通过 `removeEventListener` 移除事件监听，避免内存泄漏。
- 支持事件捕获/冒泡阶段的控制。

##### 事件对象（Event Object）

当事件触发时，处理函数会自动接收一个**事件对象**，包含事件相关信息（如触发元素、鼠标位置、按键信息等）：

```javascript
<button id="myBtn">点击我</button>



<script>

const btn = document.getElementById("myBtn");

 btn.addEventListener("click", function(event) {

console.log("触发元素：", event.target);

console.log("鼠标位置：", event.clientX, event.clientY);

});

</script>
```

#### 总结

事件是 JavaScript 实现交互的核心机制，通过监听用户或系统的动作，触发对应的处理逻辑。推荐使用 `addEventListener` 方法绑定事件，它更灵活且支持多处理函数，同时通过事件对象可以获取丰富的事件信息，实现更复杂的交互功能。
