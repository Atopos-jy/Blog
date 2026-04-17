---
title: 为什么 mouseover 能做事件委托，mouseenter 却不行？
published: 2025-11-08
tags: [前端, 事件冒泡]
category: 分类
description: 文章描述
pinned: false
draft: false
---

我们先看一个列表

```html
<ul class="interactive-list">
  <li>列表项 1</li>
  <li>列表项 2</li>
  <li>列表项 3</li>
  <li>列表项 4</li>
  <li>列表项 5</li>
  <li>列表项 6</li>
</ul>
```

我们想给这个列表加入鼠标交互事件，当鼠标经过的的时候添加样式放大1.2 双击事件底色变蓝。

我们首先会想到获取所有列表项，然后为每个列表项绑定事件

```javascript
<script>
// 获取所有列表项
const listItems = document.querySelectorAll('.interactive-list li');

// 为每个列表项绑定事件
listItems.forEach(item => {
    // mouseenter 事件：鼠标进入时的效果
    item.addEventListener('mouseenter', function () {
        this.classList.add('mouse-enter');
        // 可选：添加提示文本（鼠标进入时显示）
        this.setAttribute('title', '双击可激活');
    }, true);

    // mouseleave 事件：鼠标离开时移除效果（增强体验）
    item.addEventListener('mouseleave', function () {
        this.classList.remove('mouse-enter');
    });

    // dblclick 事件：双击时的效果
    item.addEventListener('dblclick', function () {
        // 切换激活状态（点击一次激活，再点击一次取消）
        this.classList.toggle('dblclick-active');

        // 可选：添加点击反馈提示
                const span = document.createElement('span');
                span.style.position = 'absolute';
                span.color = '#1890ff';
                span.style.fontSize = '14px';
                span.textContent = this.classList.contains('dblclick-active') ? '已激活' : '已取消';

                // 获取当前列表项的位置并显示提示
                const rect = this.getBoundingClientRect();
                span.style.left = `${rect.right + 10}px`;
                span.style.top = `${rect.top}px`;
                document.body.appendChild(span);

                // 2秒后移除提示
                setTimeout(() => {
                    document.body.removeChild(span);
                }, 2000);
            }, true);
        });
</script>
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/样式.png"/>

当我们不想给每一个列表项绑定事件，更改绑定方式**"父元素监听，子元素触发"**

```javascript
<script>
    // 获取 ul 容器（只绑定这一个元素）
    const listContainer = document.querySelector('.interactive-list');

// 1. 监听 mouseover 事件（替代 mouseenter，支持冒泡）
listContainer.addEventListener('mouseenter', function (e) {
    // 判断触发事件的是不是 li 元素（精准匹配子元素）
    if (e.target.matches('.interactive-list li')) {
        e.target.classList.add('mouse-enter');
        console.log("111");

        e.target.setAttribute('title', '双击可激活');
    }
}, false);

// 2. 监听 mouseout 事件（替代 mouseleave，支持冒泡）
listContainer.addEventListener('mouseout', function (e) {
    if (e.target.matches('.interactive-list li')) {
        e.target.classList.remove('mouse-enter');
    }
});

// 3. 监听 dblclick 事件（支持冒泡，直接委托）
listContainer.addEventListener('dblclick', function (e) {
    if (e.target.matches('.interactive-list li')) {
        // 切换激活状态
        e.target.classList.toggle('dblclick-active');

        // 显示临时提示反馈
        const tip = document.createElement('span');
        tip.style.position = 'absolute';
        tip.style.color = '#1890ff';
        tip.style.fontSize = '14px';
        tip.textContent = e.target.classList.contains('dblclick-active') ? '已激活' : '已取消';

        // 定位提示到 li 右侧
        const rect = e.target.getBoundingClientRect();
        tip.style.left = `${rect.right + 10}px`;
        tip.style.top = `${rect.top}px`;
        document.body.appendChild(tip);

        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(tip);
        }, 2000);
    }
});
</script>
```

​ 但是用这种mouseover事件，我们会发现当鼠标经过，打印会发现控制台会因冒泡和子元素边界切换打印多次；

> **当我们不想为每个事件绑定，想要给ul容器直接绑定这个事件，那用之前的方法还可以吗？**不可以

​ 当我们用mouseenter事件时，当鼠标指针从它后代的物理空间移动到它自己的物理物理空间时，它不会冒泡，也不会发送给它的任何后代。在这个事件中是给容器盒子绑定，当它不会给子元素发送了之后子元素接收不到信息就会导致进行不下去。

> 先回顾浏览器的「事件流」（W3C 标准）：
>
> 1. **捕获阶段**：事件从最顶层的父元素（比如 html）向下传递到「目标元素」（触发事件的元素，比如 li）；
> 2. **目标阶段**：事件到达目标元素本身；
> 3. **冒泡阶段**：事件从目标元素向上传递回最顶层的父元素。
>
> `addEventListener` 第三个参数的含义：
>
> - `false`（默认）：事件处理函数在 **冒泡阶段** 执行；
> - `true`：事件处理函数在 **捕获阶段** 执行。

下面我们来解释一下原理，首先从`addEventListener()` 事件监听来介绍，

**EventTarget.addEventListener()** 方法将指定的监听器注册到 `EventTarget` 上，当该对象触发指定的事件时，指定的回调函数就会被执行。事件目标可以是一个文档上的元素 [`Element`、`Document` 和 `Window`，也可以是任何支持事件的对象（比如 `XMLHttpRequest`。

`addEventListener()` 的工作原理是将实现 `EventListener`的函数或对象添加到调用它的 `EventTarget` 上的指定事件类型的事件侦听器列表中。如果要绑定的函数或对象已经被添加到列表中，该函数或对象不会被再次添加。

当一个 `EventListener` 在 `EventTarget` 正在处理事件的时候被注册到 `EventTarget` 上，它不会被立即触发，但可能在事件流后面的事件触发阶段被触发，例如可能在捕获阶段添加，然后在冒泡阶段被触发。

> addEventListener(type, listener, useCapture);
>
> 在旧版本的 DOM 的规定中，`addEventListener()` 的第三个参数是一个布尔值，表示是否在捕获阶段调用事件处理程序。

`type`

表示监听事件类型的大小写敏感的字符串。

`listener`

当所监听的事件类型触发时，会接收到一个事件通知（实现了 `Event`接口的对象）对象。`listener` 必须是一个实现了 `EventListener`接口的对象，或者是一个addEventListener(type, listener, useCapture);[函数

`options` 可选

一个指定有关 `listener` 属性的可选参数对象。可用的选项如下：

- `capture` 可选

  一个布尔值，表示 `listener` 会在该类型的事件捕获阶段传播到该 `EventTarget` 时触发。

- `once` 可选

  一个布尔值，表示 `listener` 在添加之后最多只调用一次。如果为 `true`，`listener` 会在其被调用之后自动移除。

- `passive` 可选

  一个布尔值，设置为 `true` 时，表示 `listener` 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

- `signal` 可选

  `AbortSignal`，该 `AbortSignal` 的 `abort()`方法被调用时，监听器会被移除。

`useCapture` 可选

一个布尔值，表示在 DOM 树中注册了 `listener` 的元素，是否要先于它下面的 `EventTarget` 调用该 `listener`。**当 useCapture（设为 true）时，沿着 DOM 树向上冒泡的事件不会触发 listener**。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件如果没有指定，`useCapture` 默认为 `false`。

> **备注：**对于事件目标上的事件监听器来说，事件会处于“目标阶段”，而不是冒泡阶段或者捕获阶段。捕获阶段的事件监听器会在任何非捕获阶段的事件监听器之前被调用。

事件冒泡和事件捕获

#### mouseenter事件

移入时，一个 `mouseenter` 事件会向层次结构中的每个元素发送一个鼠标输入事件。在这里，当指针到达文本时，四个事件被发送到层次结构中的四个元素。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1762587520877.png"/>

#### mouseover事件

单个 `mouseover` 事件被发送到 DOM 树最深的元素中，然后它会按层次结构冒泡，直到它被处理程序取消或者到达根元素。

由于层次结构很深，发送到 `mouseover` 事件可能相当多，并导致严重的性能问题。在这种情况下，最好是监听 `mouseenter` 事件。

结合相应的 `mouseleave`（当鼠标退出其内容区域时向元素触发），`mouseenter` 事件的作用与 CSS 伪类 `:hover`非常相似。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1762587539017.png"/>

```javascript
const listContainer = document.querySelector(".interactive-list");
listContainer.addEventListener(
  "mouseenter",
  function (e) {
    // 判断触发事件的是不是 li 元素（精准匹配子元素）
    if (e.target.matches(".interactive-list li")) {
      e.target.classList.add("mouse-enter");
      console.log("111");

      e.target.setAttribute("title", "双击可激活");
    }
  },
  false,
);
```

所有更改为mouseenter 子元素不会触发，`mouseenter` 事件是个 “特例”，它 **既不支持冒泡，也不支持捕获**，完全跳过整个事件流，只在「目标元素」上触发一次。

> `mouseenter` 不参与事件流（无捕获、无冒泡），所以 `addEventListener` 的第三个参数（`true`/`false`）对它 **没有任何实际影响**—— 不管设为 `true` 还是 `false`，回调函数都会在「目标阶段」执行，`e.target` 的指向也完全由「鼠标落点」决定（和参数无关）。

**mouseenter 事件根本不走 “捕获→目标→冒泡” 的流程，所以控制 “在捕获还是冒泡阶段执行” 的第三个参数，完全没用**—— 就像给一个不会跑步的人，纠结让他用左脚还是右脚跑步，没有任何意义。

下面来一个总结：

| 事件类型        | 具体事件名    | 触发时机                           | 常用场景                 |
| --------------- | ------------- | ---------------------------------- | ------------------------ |
| 鼠标点击 / 按键 | ★`click`      | 鼠标左键单击释放时                 | 点击交互                 |
|                 | ★`dblclick`   | 鼠标左键双击时                     | 双击激活 / 编辑          |
|                 | ★`mousedown`  | 鼠标任意按键按下时                 | 拖拽开始 / 按住交互      |
|                 | ★`mouseup`    | 鼠标任意按键释放时                 | 拖拽结束 / 确认操作      |
|                 | `contextmenu` | 鼠标右键点击时（打开上下文菜单前） | 自定义右键菜单           |
| 鼠标移动        | ★`mouseover`  | 鼠标移入元素或其子元素时           | 替代 `mouseenter` 做委托 |
|                 | ★`mouseout`   | 鼠标移出元素或其子元素时           | 替代 `mouseleave` 做委托 |
|                 | ★`mousemove`  | 鼠标在元素内持续移动时             | 拖拽跟踪 / 鼠标位置检测  |
| 滚轮操作        | `wheel`       | 鼠标滚轮滚动时                     | 页面缩放 / 滚动控制      |
| 触摸笔 / 多设备 | `pointerdown` | 鼠标 / 触摸笔按下时                | 多设备兼容的点击 / 触摸  |
|                 | `pointerup`   | 鼠标 / 触摸笔释放时                | 多设备兼容的结束操作     |
|                 | `pointerover` | 鼠标 / 触摸笔移入元素时            | 多设备兼容的鼠标进入     |
|                 | `pointerout`  | 鼠标 / 触摸笔移出元素时            | 多设备兼容的鼠标离开     |

- 不冒泡的鼠标事件：「进入离开两组对」→ `mouseenter`/`mouseleave`、`pointerenter`/`pointerleave`；
- 其余所有鼠标事件：「都能冒泡能捕获」→ 放心用事件委托；
- 委托优先选：`mouseover` 替 `mouseenter`，`mouseout` 替 `mouseleave`。
