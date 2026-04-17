---
title: 从入门到精通：CSS最全知识体系总结，助你高效开发！
published: 2025-08-09
tags: [css, flex]
category: 前端
description: CSS 最全知识体系总结，助你高效开发！
pinned: false
draft: false
---

### CSS三大特性

#### 1、层叠性

相同选择器给设置相同的样式，此时一个样式就会覆盖（层叠）另一个冲突的样式。层叠性主要解决样式冲突的问题

层叠性原则:

- 样式冲突，遵循的原则是就近原则，哪个样式离结构近，就执行哪个样式

- 样式不冲突，不会层叠

![](https://i-blog.csdnimg.cn/direct/b80505d15e9f4856954b089c54cd8fbf.png)

#### 2、继承性

CSS中的继承: 子标签会继承父标签的某些样式，如文本颜色和字号。恰当地使用继承可以简化代码，降低 CSS 样式的复杂性。

![](https://i-blog.csdnimg.cn/direct/e39c54102eb34489b3fc3abd89477a31.png)

子元素可以继承父元素的样式：

（ text \-，font-，line-这些元素开头的可以继承，以及color属性）

继承性口诀：龙生龙，凤生凤，老鼠生的孩子会打洞

行高的继承性：

```css
body {
  font: 12px/1.5 Microsoft YaHei；;
}
```

- 行高可以跟单位也可以不跟单位

- 如果子元素没有设置行高，则会继承父元素的行高为 1.5

- 此时子元素的行高是：当前子元素的文字大小 \* 1.5

- body 行高 1.5 这样写法最大的优势就是里面子元素可以根据自己文字大小自动调整行高

#### 3、优先级

当同一个元素指定多个选择器，就会有优先级的产生。

- 选择器相同，则执行层叠性

- 选择器不同，则根据选择器权重执行

选择器优先级计算表格：

| 选择器              | 选择器权重 |
| ------------------- | ---------- |
| 继承 或者\*         | 0,0,0,0    |
| 元素选择器          | 0,0,0,1    |
| 类选择器 伪类选择器 | 0,0,1,0    |
| ID选择器            | 0,1,0,0    |
| 行内样式 style=""   | 1,0,0,0    |
| !important          | 无穷大     |

**优先级注意点:**

1.  权重是有4组数字组成,但是不会有进位。

2.  可以理解为类选择器永远大于元素选择器, id选择器永远大于类选择器,以此类推..

3.  等级判断从左向右，如果某一位数值相同，则判断下一位数值。

4.  可以简单记忆法: 通配符和继承权重为0, 标签选择器为1,类(伪类)选择器为 10, id选择器 100, 行内样式表为 1000, !important 无穷大.

5.  继承的权重是0， 如果该元素没有直接选中，不管父元素权重多高，子元素得到的权重都是 0。

权重叠加：如果是复合选择器，则会有权重叠加，需要计算权重。

- div ul li ------> 0,0,0,3

- .nav ul li ------> 0,0,1,2

- a:hover -----—> 0,0,1,1

- .nav a ------> 0,0,1,1

## CSS的选择模式

### 1、什么是元素的显示模式

**定义：**

元素显示模式就是元素（标签）以什么方式进行显示，比如<div>自己占一行，比如一行可以放多个<span>。

**作用：**

网页的标签非常多，在不同地方会用到不同类型的标签，了解他们的特点可以更好的布局我们的网页。

### 2、元素显示模式的分类

##### 2.1、块元素

**常见的块元素**：

```html
<h1>
  ~
  <h6>
    、
    <p>、</p>
    <div>
      、
      <ul>
        、
        <ol>
          、
          <li></li>
        </ol>
      </ul>
    </div>
  </h6>
</h1>
```

 <div> 标签是最典型的块元素。

**块级元素的特点**：

- 比较霸道，自己独占一行。

- 高度，宽度、外边距以及内边距都可以控制。

- 宽度默认是容器（父级宽度）的100%。

- 是一个容器及盒子，里面可以放行内或者块级元素。

**注意：**

文字类的元素内不能放块级元素

<p> 标签主要用于存放文字，因此 <p> 里面不能放块级元素，特别是不能放<div>  
同理， <h1>~<h6>等都是文字类块级标签，里面也不能放其他块级元素

##### 2.2、行内元素

**常见的行内元素：**

```html
<a
  >、<strong
    >、<b
      >、<em
        >、<i
          >、<del
            >、<s
              >、<ins
                >、<u>、<span></span></u></ins></s></del></i></em></b></strong
></a>
```

<span> 标签是最典型的行内元素。有的地方也将行内元素称为内联元素。

**行内元素的特点：**

- 相邻行内元素在一行上，一行可以显示多个。

- 高、宽直接设置是无效的。

- 默认宽度就是它本身内容的宽度。

- 行内元素只能容纳文本或其他行内元素。

**注意：** 链接里面不能再放链接 特殊情况链接 <a> 里面可以放块级元素，但是给 <a> 转换一下块级模式最安全

##### 2.3、行内块元素

**常见的行内块标签**：

```html
<img />、<input />、
<td></td>
```

它们同时具有块元素和行内元素的特点。有些资料称它们为行内块元素。

**行内块元素的特点**：

- 和相邻行内元素（行内块）在一行上，但是他们之间会有空白缝隙。

- 一行可以显示多个（行内元素特点）。

- 默认宽度就是它本身内容的宽度（行内元素特点）。

- 高度，行高、外边距以及内边距都可以控制（块级元素特点）。

##### 2.4、元素显示模式总结

学习元素显示模式的主要目的就是分清它们各自的特点，当我们网页布局的时候，在合适的地方用合适的标签元素。

| 元素模式   | 元素排列                 | 设置样式           | 默认宽度           | 包含                   |
| ---------- | ------------------------ | ------------------ | ------------------ | ---------------------- |
| 块级元素   | 一行只能放一个块级元素   | 可以设置宽度       | 宽度的100%         | 容器级可以包含任何标签 |
| 行内元素   | 一行可以放多个行内元素   | 不可以直接设置宽度 | 它本身内容的宽度   | 容纳文本或其他行内元素 |
| 行内块元素 | 一行可以放多个行内块元素 | 可以设置宽度和高度 | 它本身内容的的宽度 |                        |

##### 3、元素显示模式的转换

**简单理解**:

一个模式的元素需要另外一种模式的特性 比如想要增加链接 <a> 的触发范围。

**转换方式**

- 转换为块元素：display:block;

- 转换为行内元素：display:inline;

- 转换为行内块：display: inline-block;

## CSS的复合选择器

### 1、什么是复合选择器？

在 CSS 中，可以根据选择器的类型把选择器分为***基础选择器***和***复合选择器***，复合选择器是建立在基础选择器之上，对基本选择器进行组合形成的。 复合选择器是由两个或多个基础选择器，通过不同的方式组合而成的，可以更准确、更高效的选择目标元素（标签） 常用的复合选择器包括：**后代选择器、子选择器、并集选择器、伪类选择器**等等

### 2、后代选择器 (重要）

**定义：**

后代选择器又称为包含选择器，可以选择父元素里面子元素。其写法就是把外层标签写在前面，内层标签写在后面，中间用空格分隔。当标签发生嵌套时，内层标签就成为外层标签的后代。

**语法：**

```css
元素1 元素2 {样式声明}
```

上述语法表示选择元素 1 里面的所有元素 2 (后代元素)。

**语法说明**：

- 元素1 和 元素2 中间用空格隔开

- 元素1 是父级，元素2 是子级，最终选择的是元素2

- 元素2 可以是儿子，也可以是孙子等，只要是元素1 的后代即可

- 元素1 和 元素2 可以是任意基础选择器

**例子：**

```css
ul li {样式声明}
```

### 3、子选择器 (重要）

**定义：**

子元素选择器（子选择器）只能选择作为某元素的最近一级子元素。

（简单理解就是选亲儿子元素）

**语法：**

```css
元素1>元素2 {样式声明}
```

上述语法表示选择元素1 里面的所有直接后代(子元素) 元素2。

**语法说明**：

- 元素1 和 元素2 中间用 大于号 隔开

- 元素1 是父级，元素2 是子级，最终选择的是元素2

- 元素2 必须是亲儿子，其孙子、重孙之类都不归他管. 你也可以叫他 亲儿子选择器

**例子：**

```css
div>p {样式声明}
```

### 4、并集选择器 (重要）

**定义：**

并集选择器可以选择多组标签, 同时为他们定义相同的样式，通常用于集体声明。并集选择器是各选择器通过英文逗号（,）连接而成，任何形式的选择器都可以作为并集选择器的一部分。

**语法：**

```css
元素1,元素2 {样式声明}
```

         上述语法表示选择元素1 和 元素2。

**语法说明**：

- 元素1 和 元素2 中间用逗号隔开

- 逗号可以理解为和的意思

- 并集选择器通常用于集体声明

**例子：**

```css
ul,div {样式声明}
/*选择ul和div标签元素*/
```

### 5、伪类选择器

**定义：**

伪类选择器用于向某些选择器添加特殊的效果，比如给链接添加特殊效果，或选择第1个，第n个元素。

**语法：**

伪类选择器书写最大的特点是用冒号（:）表示，比如 :hover 、 :first-child 。

### 6、链接伪类选择器

**定义：**

伪类选择器用于向某些选择器添加特殊的效果，比如给链接添加特殊效果，或选择第1个，第n个元素。

**语法：**

伪类选择器书写最大的特点是用冒号（:）表示，比如 :hover 、 :first-child 。

- a:link 没有点击过的(访问过的)链接
- a:visited 点击过的(访问过的)链接
- a:hover 鼠标经过的那个链接
- a:active 鼠标正在按下还没有弹起鼠标的那个链接

**链接伪类选择器注意事项**

为了确保生效，请按照 LVHA 的循顺序声明 :link－:visited－:hover－:active。

记忆法：love hate 或者 lv 包包 hao 。

因为 a 链接在浏览器中具有默认样式，所以我们实际工作中都需要给链接单独指定样式。

**链接伪类选择器实际工作开发中的写法**：

```css
/*a是标签选择器  所有的链接*/
a {
  color: gary;
}
/*:hover 是链接伪类选择器  鼠标经过*/
a:hover {
  color: red;
}
/*鼠标经过的时候 由原来的灰色变成红色*/
```

### 7、:focus 伪类选择器

**定义：**

:focus 伪类选择器用于选取获得焦点的表单元素。

焦点就是光标，一般情况 <input> 类表单元素才能获取

例子：

```css
input:focus {
  background-color: yellow;
}
```

**复合选择器总结**

| 选择器         | 作用                   | 特征             | 使用情况 | 隔开符号及用法                      |
| -------------- | ---------------------- | ---------------- | -------- | ----------------------------------- |
| 后代选择器     | 用来选择后代           | 可以是子孙后代   | 较多     | 符号是**空格** .nav a               |
| 子代选择器     | 选择最近一级元素       | 只选亲儿子       | 较少     | 符号是**大于**  .nav1>p             |
| 并集选择器     | 选择某些相同样式的元素 | 可以用于集体声明 | 较多     | 符号逗号 .nav,:header               |
| 链接伪类选择器 | 选择不同状态的链接     | 用于链接相关     | 较多     | 重点记住a{}和 a:hover实际开发的写法 |
| :focus选择器   | 选择获得光标的表单     | 跟表单相关       | 较少     | input:foucs记住这个写法             |

### 盒子模型（Box Model）

盒子 模型 ：把HTML页面中的布局元素看作一个矩形的盒子，也就是一个承装内容的容器。

CSS盒子模型本质上是一个盒子，封装周围的HTML元素，它包括：边框、外边距、内边距、和实际内容。

![](https://i-blog.csdnimg.cn/direct/7f5c2d2b1b8c4160b526a623621da598.png)

#### **标准盒子模型（W3C 标准）**

**box-sizing: content-box;**（默认值）

**宽度（width）和高度（height）仅包含内容区域**。

**不包含** `padding`、`border`、`margin`。

**实际占用空间** = `width/height` + `padding` + `border` + `margin`

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #000;
  margin: 10px;
  box-sizing: content-box; /* 默认值，可省略 */
}
```

**实际宽度** = `200px`（内容） + `40px`（左右 padding） + `10px`（左右 border） = **250px**。

#### 怪异盒子模型（IE 传统模型 / Border-Box）

**box-sizing: border-box;**

- **宽度（width）和高度（height）包含内容、padding 和 border**。

- **不包含** `margin`。

- **实际占用空间** = `width/height`（已含 padding 和 border） + `margin`。

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #000;
  margin: 10px;
  box-sizing: border-box; /* 启用怪异模型 */
}
```

- **实际宽度** = `200px`（已含 padding 和 border），内容区域宽度 = `200px - 40px - 10px` = **150px**。

#### 边框(Border)

border可以设置元素的边框。边框有三部分组组成，边框宽度（粗细）边框样式 边框颜色

```css
border: border-width || border-style || border-color;
```

| 属性         | 作用                   |
| ------------ | ---------------------- |
| border-width | 定义边框粗细，单位是px |
| border-style | 边框的样式             |
| border-color | 边框颜色               |

边框样式 border-style 可以设置如下值：

- none：没有边框即忽略所有边框的宽度（默认值）

- solid：边框为单实线(最为常用的)

- dashed：边框为虚线

- dotted：边框为点线

3、边框的合写分写

边框简写：

```css
border: 1px solid red;
```

边框分开写法：

```css
border-top: 1px solid red; /* 只设定上边框， 其余同理 */
```

#### 表格的细线边框

1、border-collapse 属性控制浏览器绘制表格边框的方式。它控制相邻单元格的边框。

2、语法：

```css
border-collapse: collapse;
```

collapse 单词是合并的意思

border-collapse: collapse; 表示相邻边框合并在一起

#### 边框会影响盒子实际大小

边框会额外增加盒子的实际大小。因此我们有两种方案解决：

- 测量盒子大小的时候,不量边框。

- 如果测量的时候包含了边框,则需要 width/height 减去边框宽度

##### 1.内边距（padding）

###### 1.1 内边距的使用方式

1、padding 属性用于设置内边距，即边框与内容之间的距离。

2、语法：

合写属性：

| 值的个数                   | 表达意思                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| padding：5px               | 1个值，代表上下左右都有5像素的内边距                             |
| padding:5px 10px           | 2个值，代表上下内边距是5像素 左右内边距是10像素                  |
| padding:5px 10px 20px      | 3个值，代表上下内边距是5像素 左右内边距是10像素 下内边距是20像素 |
| padding:5px 10px 20px 30px | 4个值，上是5像素 右是10像素 下是20像素 左是30像素 顺时针         |

分写属性：

| 属性           | 作用     |
| -------------- | -------- |
| padding-left   | 左内边距 |
| padding-right  | 右内边距 |
| padding-top    | 上内边距 |
| padding-bottom | 下内边距 |

###### 1.2 内边距会影响盒子实际大小

1、当我们给盒子指定 padding 值之后，发生了 2 件事情：

1.  内容和边框有了距离，添加了内边距。

2.  padding影响了盒子实际大小。

2、内边距对盒子大小的影响：

- 如果盒子已经有了宽度和高度，此时再指定内边框，会撑大盒子。

- 如何盒子本身没有指定width/height属性, 则此时padding不会撑开盒子大小。

3、解决方案：

如果保证盒子跟效果图大小保持一致，则让 width/height 减去多出来的内边距大小即可。

##### 2.、外边距（margin）

##### 2.1 外边距的使用方式

margin 属性用于设置外边距，即控制盒子和盒子之间的距离。

| 属性          | 作用     |
| ------------- | -------- |
| margin-left   | 左外边距 |
| margin-right  | 右外边距 |
| margin-top    | 上外边距 |
| margin-bottom | 下外边距 |

##### 2.2 外边距典型应用

外边距可以让块级盒子水平居中的两个条件：

- 盒子必须指定了宽度（width）。

- 盒子左右的外边距都设置为 auto 。

常见的写法，以下三种都可以：

```css
margin-left: auto;
margin-right: auto;
```

注意：以上方法是让块级元素水平居中，行内元素或者行内块元素水平居中给其父元素添加 text-align:center 即可。

##### 2.3 外边距合并

使用 margin 定义块元素的垂直外边距时，可能会出现外边距的合并。

主要有两种情况:

1、相邻块元素垂直外边距的合并

当上下相邻的两个块元素（兄弟关系）相遇时，如果上面的元素有下外边距 margin-bottom，下面的元素有上外边距 margin-top ，则他们之间的垂直间距不是 margin-bottom 与 margin-top 之和。取两个值中的较大者这种现象被称为相邻块元素垂直外边距的合并。

![](https://i-blog.csdnimg.cn/direct/6a174d69d584479b82cb5c1da64b7c8f.png)

解决方案： 尽量只给一个盒子添加 margin 值。

2、嵌套块元素垂直外边距的塌陷

对于两个嵌套关系（父子关系）的块元素，父元素有上外边距同时子元素也有上外边距，此时父元素会塌陷较大的外边距值。

![](https://i-blog.csdnimg.cn/direct/52d05967571e456fb66b4a90d3344c65.png)

解决方案：

- 可以为父元素定义上边框。

- 可以为父元素定义上内边距。

- 可以为父元素添加 overflow:hidden。

  ##### 2.4 清除内外边距

  网页元素很多都带有默认的内外边距，而且不同浏览器默认的也不一致。因此我们在布局前，首先要清除下网页元素的内外边距。

  ```css
  * {
    padding: 0; /* 清除内边距 */
    margin: 0; /* 清除外边距 */
  }
  ```

  注意：行内元素为了照顾兼容性，尽量只设置左右内外边距，不要设置上下内外边距。但是转换为块级和行内块元素就可以了

### css常用的几种布局

### 1.标准流布局

        所谓的标准流，就是标签按照规定好默认方式排列

-  块级元素会独占一行，从上到下顺序排列
- 常用元素:div hr p h1-h6 ul ol dl form table
- 行内元素会按照顺序，从左到右顺序排列，碰到父元素边缘则自动换行
- 常用元素：span a i e

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML标准流布局示意图</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.6;
      }
      .container {
        width: 80%;
        margin: 0 auto;
        border: 2px solid #333;
        padding: 20px;
        background-color: #f9f9f9;
      }
      h1 {
        color: #333;
        text-align: center;
        background-color: #e0e0e0;
        padding: 10px;
        margin-top: 0;
      }
      p {
        background-color: #e6f7ff;
        padding: 10px;
        border: 1px solid #b3e0ff;
      }
      .block {
        background-color: #ffe6e6;
        padding: 15px;
        margin: 10px 0;
        border: 1px solid #ffb3b3;
      }
      .inline {
        background-color: #e6ffe6;
        padding: 5px;
        margin: 0 5px;
        border: 1px solid #b3ffb3;
      }
      .float-right {
        float: right;
        width: 100px;
        height: 100px;
        background-color: #ffffcc;
        border: 1px solid #cccc99;
        margin-left: 15px;
        padding: 10px;
      }
      .clearfix::after {
        content: "";
        display: table;
        clear: both;
      }
      .explanation {
        background-color: #f0f0f0;
        padding: 15px;
        margin-top: 20px;
        border-left: 4px solid #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>HTML标准流布局示意图</h1>

      <p>这是一个段落元素(&lt;p&gt;)，属于块级元素，会占据整行空间。</p>

      <div class="block">
        这是一个div块级元素(&lt;div&gt;)，也会占据整行空间。
      </div>

      <p>
        这是一个包含<span class="inline">行内元素(&lt;span&gt;)</span>和<span
          class="inline"
          >另一个行内元素</span
        >的段落。行内元素不会独占一行。
      </p>

      <div class="block clearfix">
        <div class="float-right">浮动元素(float: right)</div>
        <p>
          这是一个包含浮动元素的块级容器。浮动元素会脱离标准流，但其他内容仍会围绕它排列。
        </p>
        <p>注意：浮动元素不会影响父容器的高度，除非使用清除浮动(clearfix)。</p>
      </div>

      <div class="block">这是另一个块级元素，会从新的一行开始。</div>

      <div class="explanation">
        <h3>标准流布局特点：</h3>
        <ul>
          <li>块级元素(block)从上到下垂直排列，独占一行</li>
          <li>行内元素(inline)水平排列，直到空间不足才会换行</li>
          <li>元素按照它们在HTML中出现的顺序进行布局</li>
          <li>
            除非使用浮动(float)、定位(position)或弹性盒(flexbox)等，否则元素都处于标准流中
          </li>
        </ul>
      </div>
    </div>
  </body>
</html>
```

### 1.定位(position)

> **定位 = 定位模式 + 边偏移**

**定位模式** 用于指定一个元素在文档中的定位方式。**边偏移**则决定了该元素的最终位置。

#### 1 边偏移（方位名词）

**边偏移** 就是定位的盒子移动到最终位置。有 top、bottom、left 和 right 4 个属性。

| 边偏移属性 | 示例           | 描述                                                     |
| ---------- | -------------- | -------------------------------------------------------- |
| `top`      | `top: 80px`    | **顶端**偏移量，定义元素相对于其父元素**上边线的距离**。 |
| `bottom`   | `bottom: 80px` | **底部**偏移量，定义元素相对于其父元素**下边线的距离**。 |
| `left`     | `left: 80px`   | **左侧**偏移量，定义元素相对于其父元素**左边线的距离**。 |
| `right`    | `right: 80px`  | **右侧**偏移量，定义元素相对于其父元素**右边线的距离**   |

定位的盒子有了边偏移才有价值。 一般情况下，凡是有定位地方必定有边偏移。

#### 2 定位模式 (position)

在 CSS 中，通过 `position` 属性定义元素的**定位模式**，语法如下：

```css
选择器 {
  position: relative;
}
```

定位模式是有不同分类的，在不同情况下，我们用到不同的定位模式。

定位模式决定元素的定位方式 ，它通过 CSS 的 position 属性来设置，其值可以分为四个：

| 值         | 语义         |
| ---------- | ------------ |
| `static`   | **静态**定位 |
| `relative` | **相对**定位 |
| `absolute` | **绝对**定位 |
| `fixed`    | **固定**定位 |

![](https://i-blog.csdnimg.cn/direct/6a3cc7a0242a4fe0aae12f53c1c191d2.png)

#### 定位模式介绍

##### 1\. 静态定位(static) - 了解

- **静态定位**是元素的**默认**定位方式，**无定位的意思**。它相当于 border 里面的none，静态定位static，不要定位的时候用。

- 语法：

  ```css
  选择器 {
    position: static;
  }
  ```

- 静态定位 按照标准流特性摆放位置，它没有边偏移。

- 静态定位在布局时我们几乎不用的

##### 2\. 相对定位(relative) - 重要

- **相对定位**是元素在移动位置的时候，是相对于它自己**原来的位置**来说的（自恋型）。

- 语法：

```css
选择器 {
  position: relative;
}
```

- 相对定位的特点：（务必记住）
  - 1.它是相对于自己原来的位置来移动的（移动位置的时候参照点是自己原来的位置）。
  - 2.**原来**在标准流的**位置**继续占有，后面的盒子仍然以标准流的方式对待它。

    因此，**相对定位并没有脱标**。它最典型的应用是给绝对定位当爹的。。。

- 效果图：

![](https://i-blog.csdnimg.cn/direct/3bd22801b7d74e6b9709b131e81093d0.png)

##### 3\. 绝对定位(absolute) - 重要

###### 1 绝对定位的介绍

- **绝对定位**是元素在移动位置的时候，是相对于它**祖先元素**来说的（拼爹型）。

- 语法：

  ```css
  选择器 {
    position: absolute;
  }
  ```

1.  **完全脱标** —— 完全不占位置；

2.  **父元素没有定位**，则以**浏览器**为准定位（Document 文档）。

3.  ![](https://i-blog.csdnimg.cn/direct/183f33a3450b48b18bb3f7fc37513bdd.png)
4.  **父元素要有定位**
    - 元素将依据最近的已经定位（绝对、固定或相对定位）的父元素（祖先）进行定位。

![](https://i-blog.csdnimg.cn/direct/74dc765622604591b33c7c7dd6bf14e0.png)

- **绝对定位的特点总结**：（务必记住）

  1.如果**没有祖先元素**或者**祖先元素没有定位**，则以浏览器为基准定位（Document 文档）。

  2.如果祖先元素有定位（相对、绝对、固定定位），则以最近一级的有定位祖先元素为参考点移动位置。

  3.绝对定位**不再占有原先的位置**。所以绝对定位是脱离标准流的。（脱标）

###### 2 定位口诀 —— 子绝父相

弄清楚这个口诀，就明白了绝对定位和相对定位的使用场景。

这个**“子绝父相”**太重要了，是我们学习定位的**口诀**，是定位中最常用的一种方式这句话的意思是：**子级是绝对定位的话，父级要用相对定位。**

①子级绝对定位，不会占有位置，可以放到父盒子里面的任何一个地方，不会影响其他的兄弟盒子。

②父盒子需要加定位限制子盒子在父盒子内显示。

③父盒子布局时，需要占有位置，因此父亲只能是相对定位。

这就是子绝父相的由来，所以**相对定位经常用来作为绝对定位的父级**。

总结： **因为父级需要占有位置，因此是相对定位， 子盒子不需要占有位置，则是绝对定位**

当然，子绝父相不是永远不变的，如果父元素不需要占有位置，**子绝父绝**也会遇到。

**疑问**：为什么在布局时，**子级元素**使用**绝对定位**时，**父级元素**就要用**相对定位**呢？

观察下图，思考一下在布局时，**左右两个方向的箭头图片**以及**父级盒子**的定位方式。

![](https://i-blog.csdnimg.cn/direct/07caacba1bea4ac8bbc3360e72e30deb.png)

![](https://i-blog.csdnimg.cn/direct/fd2cc8024f354c83979443b8def81c10.png)

**分析**：

1.  **方向箭头**叠加在其他图片上方，应该使用**绝对定位**，因为**绝对定位完全脱标**，完全不占位置。

2.  **父级盒子**应该使用**相对定位**，因为**相对定位不脱标**，后续盒子仍然以标准流的方式对待它。
    - 如果父级盒子也使用**绝对定位**，会完全脱标，那么下方的**广告盒子**会上移，这显然不是我们想要的。

**结论**：**父级要占有位置，子级要任意摆放**，这就是**子绝父相**的由来。

##### 4\. 固定定位(fixed) - 重要

- **固定定位**是元素**固定于浏览器可视区的位置**。（认死理型） 主要使用场景： 可以在浏览器页面滚动时元素的位置不会改变。

- 语法：

  ```css
  选择器 {
    position: fixed;
  }
  ```

- 固定定位的特点：（务必记住）：

  1.以浏览器的可视窗口为参照点移动元素。
  - 跟父元素没有任何关系
  - 不随滚动条滚动。

  2.固定定位**不在占有原先的位置**。

- 固定定位也是**脱标**的，其实**固定定位也可以看做是一种特殊的绝对定位**。（认死理型）
  - **完全脱标**—— 完全不占位置；
  - 只认**浏览器的可视窗口** —— `浏览器可视窗口 + 边偏移属性` 来设置元素的位置；
    - 跟父元素没有任何关系；单独使用的
    - 不随滚动条滚动。

固定定位举例：

![](https://i-blog.csdnimg.cn/direct/9969060cedf7410a86a694633b494461.png)

**提示**：IE 6 等低版本浏览器不支持固定定位。

##### 5 粘性定位(sticky) - 了解

- **粘性定位**可以被认为是相对定位和固定定位的混合。 Sticky 粘性的

- 语法：

  ```css
  选择器 {
    position: sticky;
    top: 10px;
  }
  ```

- 粘性定位的特点：

  1.以浏览器的可视窗口为参照点移动元素（固定定位特点）

  2.粘性定位占有原先的位置（相对定位特点）

  3.必须添加 top 、left、right、bottom **其中一个**才有效

  跟页面滚动搭配使用。 兼容性较差，IE 不支持。

#### 定位总结

| **定位模式**          | **是否脱标**                                                                                             | **移动位置**       | **是否常用**             |
| --------------------- | -------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------ |
| static 静态定位       | 否                                                                                                       | 不能使用边偏移     | 很少                     |
| **relative 相对定位** | **否 (占有位置)**                                                                                        | 相对于自身位置移动 | 基本单独使用             |
| **absolute绝对定位**  | **是（不占有位置）**                                                                                     | 带有定位的父级     | 要和定位父级元素搭配使用 |
| **fixed 固定定位**    | 一定记住 相对定位、固定定位、绝对定位 两个大的特点： 1. 是否占有位置（脱标否） 2. 以谁为基准点移动位置。 |                    |                          |
| sticky                | 否（占有位置）                                                                                           | 浏览器可视区       | 当前阶段少               |

- 学习定位重点学会子绝父相。

- 注意：

1.  **边偏移**需要和**定位模式**联合使用，**单独使用无效**；

2.  `top` 和 `bottom` 不要同时使用；

3.  `left` 和 `right` 不要同时使

### 3. float 布局

float 属性用于创建浮动框，将其移动到一边，直到左边缘或右边缘触及包含块或另一个浮动框的边缘。

语法：

```css
选择器 {
  float: 属性值;
}
```

| 属性值 | 描述         |
| ------ | ------------ |
| none   | 元素不浮动   |
| left   | 元素向左浮动 |
| right  | 元素向右浮动 |

**浮动特性**

加了浮动之后的元素,会具有很多特性,需要我们掌握的.

1、浮动元素会脱离标准流(脱标：浮动的盒子不再保留原先的位置)

![](https://i-blog.csdnimg.cn/direct/1ddf10afffec44a0a4c308a91f9df7c5.png)

2、浮动的元素会一行内显示并且元素顶部对齐

![](https://i-blog.csdnimg.cn/direct/727e55fd4db0464d94efa29bb5aaf0ed.png)

注意：

浮动的元素是互相贴靠在一起的（不会有缝隙），如果父级宽度装不下这些浮动的盒子，多出的盒子会另起一行对齐。

3、浮动的元素会具有行内块元素的特性

浮动元素的大小根据内容来决定

浮动的盒子中间是没有缝隙的

#### 浮动元素经常和标准流父级搭配使用

为了约束浮动元素位置, 我们网页布局一般采取的 策略 是:

先用标准流父元素排列上下位置, 之后内部子元素采取浮动排列左右位置. 符合网页布局第一准侧

![](https://i-blog.csdnimg.cn/direct/150ec1cd751e4788a69af45ede4f5740.png)

#### 清除浮动

由于父级盒子很多情况下，不方便给高度，但是子盒子浮动又不占有位置，最后父级盒子高度为 0 时，就会影响下面的标准流盒子。

![](https://i-blog.csdnimg.cn/direct/82b33284d78b48edbc416f64f67d1a98.png)

#### 清除浮动本质

清除浮动的本质是清除浮动元素造成的影响：浮动的子标签无法撑开父盒子的高度

注意：

- 如果父盒子本身有高度，则不需要清除浮动

- 清除浮动之后，父级就会根据浮动的子盒子自动检测高度。

- 父级有了高度，就不会影响下面的标准流了

#### 清除浮动样式

语法：

```css
选择器 {
  clear: 属性值;
}
```

| 属性值 | 描述                                       |
| ------ | ------------------------------------------ |
| left   | 不允许左侧有浮动元素（清除左侧浮动的影响） |
| right  | 不允许右侧有浮动元素（清除右侧浮动的影响） |
| both   | 同时清除左右两侧浮动的影响                 |

我们实际工作中， 几乎只用 clear: both;

清除浮动的策略是: 闭合浮动.

#### 清除浮动的多种方式

##### 1、额外标签法

额外标签法也称为隔墙法，是 W3C 推荐的做法。

使用方式：

额外标签法会在浮动元素末尾添加一个空的标签。

```css
例如 <div style="clear:both"></div>，或者其他标签（如<br />等）
```

优点： 通俗易懂，书写方便

缺点： 添加许多无意义的标签，结构化较差

注意： 要求这个新的空标签必须是块级元素。

总结:

1、清除浮动本质是?

         清除浮动的本质是清除浮动元素脱离标准流造成的影响

2、清除浮动策略是?

        闭合浮动. 只让浮动在父盒子内部影响,不影响父盒子外面的其他盒子.

3、额外标签法?

        隔墙法, 就是在最后一个浮动的子元素后面添

4、加一个额外标签, 添加 清除浮动样式.

        实际工作可能会遇到,但是不常用

##### 2、父级添加 overflow 属性

可以给父级添加 overflow 属性，将其属性值设置为 hidden、 auto 或 scroll 。

例如：

```css
overflow: hidden | auto | scroll;
```

优点：代码简洁

缺点：无法显示溢出的部分

注意：是给父元素添加代码

##### 3、父级添加after伪元素

:after 方式是额外标签法的升级版。给父元素添加：

```css
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  /* IE6、7 专有 */
  *zoom: 1;
}
```

优点：没有增加标签，结构更简单

缺点：照顾低版本浏览器

代表网站： 百度、淘宝网、网易等

##### 4、父级添加双伪元素

给父元素添加

```css
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
```

优点：代码更简洁

缺点：照顾低版本浏览器

代表网站：小米、腾讯等

#### 总结

为什么需要清除浮动？

1.  父级没高度。

2.  子盒子浮动了。

3.  影响下面布局了，我们就应该清除浮动了。

| 清除浮动的方法       | 优点               | 缺点                              |
| -------------------- | ------------------ | --------------------------------- |
| 额外标签法（隔墙法） | 通俗易懂，书写方便 | 添加了许多无意义的标签，结构化差  |
| 父级overflow:hidden; | 结构语义化正确·    | 溢出隐藏                          |
| 父级after伪元素      | 结构语义化正确     | 由于IE6-7不支持:after，兼容性问题 |
| 父级双伪元素         | 结构语义化正确     | 由于IE6-7不支持:after，兼容性问题 |

### 4.flex布局

CSS3 弹性盒（ Flexible Box 或 flexbox），是一种当页面需要适应不同的屏幕大小以及设备类型时确保元素拥有恰当的行为的布局方式。

引入弹性盒布局模型的目的是提供一种更加有效的方式来对一个容器中的子元素进行排列、对齐和分配空白空间。

#### **1.flex-direction**

`flex-direction` 属性指定了弹性子元素在父容器中的位置。

```css
flex-direction: row | row-reverse | column | column-reverse;
```

```css
.flex-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;
  width: 400px;
  height: 250px;
  background-color: lightgrey;
}
```

#### 2.justify- content 属性

内容对齐（justify-content）属性应用在弹性容器上，把弹性项沿着弹性容器的主轴线（main axis）对齐。

justify-content 语法如下：

```css
justify-content: flex-start | flex-end | center | space-between | space-around;
```

各个值解析:

- **flex-start：**

  弹性项目向行头紧挨着填充。这个是默认值。第一个弹性项的main-start外边距边线被放置在该行的main-start边线，而后续弹性项依次平齐摆放。

- **flex-end：**

  弹性项目向行尾紧挨着填充。第一个弹性项的main-end外边距边线被放置在该行的main-end边线，而后续弹性项依次平齐摆放。

- **center：**

  弹性项目居中紧挨着填充。（如果剩余的自由空间是负的，则弹性项目将在两个方向上同时溢出）。

- **space-between：**

  弹性项目平均分布在该行上。如果剩余空间为负或者只有一个弹性项，则该值等同于flex-start。否则，第1个弹性项的外边距和行的main-start边线对齐，而最后1个弹性项的外边距和行的main-end边线对齐，然后剩余的弹性项分布在该行上，相邻项目的间隔相等。

- **space-around：**

  弹性项目平均分布在该行上，两边留有一半的间隔空间。如果剩余空间为负或者只有一个弹性项，则该值等同于center。否则，弹性项目沿该行分布，且彼此间隔相等（比如是20px），同时首尾两边和弹性容器之间留有一半的间隔（1/2\*20px=10px）。

#### ![](https://i-blog.csdnimg.cn/direct/3b6f940859ba4c22b89017b5f42a8e7d.jpeg)

#### 3.align-items 属性

`align-items` 设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式。

语法

```css
align-items: flex-start | flex-end | center | baseline | stretch;
```

各个值解析:

- flex-start：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴起始边界。
- flex-end：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴结束边界。
- center：弹性盒子元素在该行的侧轴（纵轴）上居中放置。（如果该行的尺寸小于弹性盒子元素的尺寸，则会向两个方向溢出相同的长度）。
- baseline：如弹性盒子元素的行内轴与侧轴为同一条，则该值与'flex-start'等效。其它情况下，该值将参与基线对齐。
- stretch：如果指定侧轴大小的属性值为'auto'，则其值会使项目的边距盒的尺寸尽可能接近所在行的尺寸，但同时会遵照'min/max-width/height'属性的限制。

#### 4.flex-wrap 属性

**flex-wrap** 属性用于指定弹性盒子的子元素换行方式。

flex-wrap语法如下：

```css
flex-wrap: nowrap|wrap|wrap-reverse|initial|inherit;
```

各个值解析:

- **nowrap** - 默认， 弹性容器为单行。该情况下弹性子项可能会溢出容器。
- **wrap** - 弹性容器为多行。该情况下弹性子项溢出的部分会被放置到新行，子项内部会发生断行
- **wrap-reverse** -反转 wrap 排列。

```css
.flex-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  width: 300px;
  height: 250px;
  background-color: lightgrey;
}
```

#### 5.align-content 属性

`align-content` 属性用于修改 `flex-wrap` 属性的行为。类似于 `align-items`, 但它不是设置弹性子元素的对齐，而是设置各个行的对齐。

align-content语法如下：

```css
align-content: flex-start | flex-end | center | space-between | space-around |
  stretch;
```

各个值解析:

- `stretch` - 默认。各行将会伸展以占用剩余的空间。
- `flex-start` - 各行向弹性盒容器的起始位置堆叠。
- `flex-end` - 各行向弹性盒容器的结束位置堆叠。
- `center` -各行向弹性盒容器的中间位置堆叠。
- `space-between` -各行在弹性盒容器中平均分布。
- `space-around` - 各行在弹性盒容器中平均分布，两端保留子元素与子元素之间间距大小的一半。

```css
.flex-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-align-content: center;
  align-content: center;
  width: 300px;
  height: 300px;
  background-color: lightgrey;
}
```

#### 6.align-self属性

`align-self` 属性用于设置弹性元素自身在侧轴（纵轴）方向上的对齐方式。

align-self语法如下：

```css
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

各个值解析:

- auto：如果'align-self'的值为'auto'，则其计算值为元素的父元素的'align-items'值，如果其没有父元素，则计算值为'stretch'。
- flex-start：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴起始边界。
- flex-end：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴结束边界。
- center：弹性盒子元素在该行的侧轴（纵轴）上居中放置。（如果该行的尺寸小于弹性盒子元素的尺寸，则会向两个方向溢出相同的长度）。
- baseline：如弹性盒子元素的行内轴与侧轴为同一条，则该值与'flex-start'等效。其它情况下，该值将参与基线对齐。
- stretch：如果指定侧轴大小的属性值为'auto'，则其值会使项目的边距盒的尺寸尽可能接近所在行的尺寸，但同时会遵照'min/max-width/height'属性的限制。

```css
.flex-item {
  background-color: cornflowerblue;
  width: 60px;
  min-height: 100px;
  margin: 10px;
}

.item1 {
  -webkit-align-self: flex-start;
  align-self: flex-start;
}
.item2 {
  -webkit-align-self: flex-end;
  align-self: flex-end;
}

.item3 {
  -webkit-align-self: center;
  align-self: center;
}

.item4 {
  -webkit-align-self: baseline;
  align-self: baseline;
}

.item5 {
  -webkit-align-self: stretch;
  align-self: stretch;
}
```

#### ![](https://i-blog.csdnimg.cn/direct/c9d9ec5c3ff54d0fae4e7325f8f5540c.png)

#### 7.flex属性

`flex` 属性用于指定弹性子元素如何分配空间。

flex语法如下：

```css
flex: auto | initial | none | inherit | [ flex-grow] || [ flex-shrink] || [
  flex-basis];
```

各个值解析:

- auto: 计算值为 1 1 auto
- initial: 计算值为 0 1 auto
- none：计算值为 0 0 auto
- inherit：从父元素继承
- \[ flex-grow \]：定义弹性盒子元素的扩展比率。
- \[ flex-shrink \]：定义弹性盒子元素的收缩比率。
- \[ flex-basis \]：定义弹性盒子元素的默认基准值。

以下实例中，第一个弹性子元素占用了 2/4 的空间，其他两个各占 1/4 的空间:

```css
.flex-item {
  background-color: cornflowerblue;
  margin: 10px;
}

.item1 {
  -webkit-flex: 2;
  flex: 2;
}

.item2 {
  -webkit-flex: 1;
  flex: 1;
}

.item3 {
  -webkit-flex: 1;
  flex: 1;
}
```

#### ![](https://i-blog.csdnimg.cn/direct/7e09ba94d5664abebe5d537dcebbc1cd.png)

| 属性            | 描述                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| display         | 指定 HTML 元素盒子类型。                                                          |
| ---             | ---                                                                               |
| flex-direction  | 指定了弹性容器中子元素的排列方式                                                  |
| ---             | ---                                                                               |
| justify-content | 设置弹性盒子元素在主轴（横轴）方向上的对齐方式。                                  |
| ---             | ---                                                                               |
| align-items     | 设置弹性盒子元素在侧轴（纵轴）方向上的对齐方式。                                  |
| ---             | ---                                                                               |
| flex-warp       | 设置弹性盒子的子元素超出父容器时是否换行。                                        |
| ---             | ---                                                                               |
| align-content   | 修改 flex-wrap 属性的行为，类似 align-items, 但不是设置子元素对齐，而是设置行对齐 |
| ---             | ---                                                                               |
| flex-flow       | flex-direction 和 flex-wrap 的简写                                                |
| ---             | ---                                                                               |
| ordrt           | 设置弹性盒子的子元素排列顺序。                                                    |
| ---             | ---                                                                               |
| align-self      | 在弹性子元素上使用。覆盖容器的 align-items 属性。                                 |
| ---             | ---                                                                               |
| flex            | 设置弹性盒子的子元素如何分配空间。                                                |
| ---             | ---                                                                               |

###  5.grid布局

网格是一组相交的水平线和垂直线，它定义了网格的列和行。

CSS 提供了一个基于网格的布局系统，带有行和列，可以让我们更轻松地设计网页，而无需使用浮动和定位。

以下是一个简单的网页布局，使用了网格布局，包含六列和三行：

![](https://i-blog.csdnimg.cn/img_convert/ece2debb66a5542f6e02f9a4a9428137.jpeg)

我们通过 grid-template-columns 和 grid-template-rows 属性来定义网格中的列和行。

这些属性定义了网格的轨道，一个网格轨道就是网格中任意两条线之间的空间。

在下图中你可以看到一个绿色框的轨道——网格的第一个行轨道。第二行有三个白色框轨道。

![](https://i-blog.csdnimg.cn/img_convert/ba33afb4182224a0ced6d64d05a57243.png)

以下实例我们使用 grid-template-columns 属性在网格容器中创建四个列:

```css
.grid-container {
  display: grid;

  grid-template-columns: auto auto auto auto;
}
```

#### ![](https://i-blog.csdnimg.cn/direct/3c6f0f02910f4e29afaba459e8cacac9.png)

#### 1.fr 单位

轨道可以使用任何长度单位进行定义。

网格引入了 fr 单位来帮助我们创建灵活的网格轨道。一个 fr 单位代表网格容器中可用空间的一等份。

```css
.grid-container {
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
}
```

#### 2.网格间距

网格间距（Column Gap）指的是两个网格单元之间的网格横向间距或网格纵向间距。

![](https://i-blog.csdnimg.cn/img_convert/d455c54e728e01fadd2e18db87c5a3e1.png)

您可以使用以下属性来调整间隙大小：

- grid-column-gap
- grid-row-gap
- grid-gap

以下实例使用 grid-column-gap 属性来设置列之间的网格间距：

```css
.grid-container {
  display: grid;
  grid-column-gap: 50px;
}
```

#### 3.网格线

列与列，行与行之间的交接处就是网格线。

Grid 会为我们创建编号的网格线来让我们来定位每一个网格元素。

网格线的编号顺序取决于文章的书写模式。在从左至右书写的语言中，编号为 1 的网格线位于最左边。在从右至左书写的语言中，编号为 1 的网格线位于最右边。

接下来我使用了 grid-column-start, grid-column-end, grid-row-start 和 grid-row-end 属性来演示如何使用网格线。

以下实例我们设置一个网格元素的网格线从第一列开始，第三列结束：

```css
.item1 {
  grid-column-start: 1;
  grid-column-end: 3;
}
```

#### ![](https://i-blog.csdnimg.cn/direct/189bc69b8dbf447f98614cf37ebc1008.png)

## 水平&垂直对齐

在日常设计网页过程中，我们可以根据**text-align: center**实现**行内元素**水平居中问题，我们也可以根据**margin: 0 auto**实现**块级元素**水平居中问题。

### 文本的居中对齐

如果仅仅是为了文本在元素内居中对齐，可以使用 text-align: center;

### 单行文本的垂直居中

#### 1\. 已知宽高，结合绝对定位和负margin来解决

　　首先使用绝对定位，**使top和left属性可用**。然后将元素通过top和left向下移动适口的**50%**，此时，元素的左上角位于视口中心点；最后通过**负margin**来移动元素自身的一半，将元素的中心点移至视口中心点。

```css
body {
    width: 100vw; // vw：是视口宽度的1/100
    margin: 0;
    padding: 0;
}


/* 在已知宽高的情况下，使用负margin解决*/

#way1 {
    width: 300px;
    height: 200px;
    background: #f33;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -100px;
}
```

#### 2\. 未知宽高，结合绝对定位和translate来解决

　　大多数情况下，元素的高度都是由内容撑高，因此我们很难用负margin来进行移动，css中大部分属性百分比都是相对于父级元素，如padding。但是，我们可以发现**translate中的参数是相对于自身的**。因此我们就可以利用translate，实现前面负margin的功能。

```css
body {
  width: 100vw;
  margin: 0;
  padding: 0;
}

/* 在不知道宽高的情况下，translate属性移动元素本身*/

#way2 {
  width: 300px;
  height: 200px;
  background: #f33;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 3\. 结合margin和translate来解决

　　我们知道，**margin**可以实现**块级元素**的水平居中问题，我们可以直接利用margin来进行水平居中操作，在用translate来进行垂直居中。

```css
body {
    width: 100vw;
    margin: 0;
    padding: 0;
}


/* 使用margin对元素进行居中，同时利用vh单位获取视口一半高度 */

#way3 {
    width: 300px;
    height: 200px;
    background: #f33;
    margin: 50vh auto 0; //vh: 视口高度的1/100
    transform: translate(0, -50%);
}
```

#### 4\. 使用flexbox实现

　　正常情况下，margin只能实现水平居中，但是当我们在需要居中元素的父元素设置为flexbox，此时**margin：auto就会同时设置水平和垂直居中**。

```css
body {
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
}

/* 父元素需要设置为flexbox，并且需要设置高度，margin:auto将会在水平和垂直方向上都居中; */

#way4 {
  width: 300px;
  height: 200px;
  background: #f33;
  margin: auto;
}
```

#### 5\. 使用flexbox中的align-items和justify-content属性实现

　　这种方法，**必须要设置父元素的高度**，否则无法实现垂直上的居中。

```css
body {
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

/* 可以在父元素上设置aligin-items和justify-content为center实现居中 */

#way5 {
  width: 300px;
  height: 200px;
  background: #f33;
}
```
