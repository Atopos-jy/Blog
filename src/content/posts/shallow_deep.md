---
title: 浅拷贝和深拷贝的区别
published: 2025-11-23
tags: [前端, 浅拷贝, 深拷贝]
category: 分类
description: 文章描述
pinned: false
draft: false
---

# 深拷贝or浅拷贝

我们来先看一个案例

```javascript
let a = 1;
let b = a;

let arr1 = [1, { a: 10 }];
let arr2 = arr1;
```

###### 这属于浅拷贝吗？

如果不属于浅拷贝那属于什么？这种方法和浅拷贝的区别是什么

基础类型（数字、字符串、布尔值等）的赋值是 “值拷贝” —— 把 `a` 的 “值”（1）完整复制一份给 `b`，`a` 和 `b` 是 两个独立的变量，存放在不同的内存地址，修改其中一个不会影响另一个。

引用类型（数组、对象、函数等）的赋值是 “地址拷贝” —— 变量 `arr1` 和 `arr2` 并没有存储数组本身，而是存储了数组在内存中的 “地址”（类似文件路径）。赋值后，`arr1` 和 `arr2` 指向 同一个内存地址，相当于 “两个指针指向同一个对象”。

但是简单的赋值没办法实现两个复杂数据类型之间的独立，所以需要引入我们今天的主题——深拷贝or浅拷贝

大家先思考一下我们要避免上面复杂数据类型的赋值所导致的数据之间相互影响，用浅拷贝合适还是深拷贝合适？

# 知识引入

## 1.基本数据类型

基本数据类型（String, Numberm,Boolean,Null,Undefined,Symbol）和对象数据类型(Object)

基本数据类型的特点：直接存储在栈（stack）中的数据，

引用数据类型：存储带是该对象在栈中的引用，真实数据存放在堆中。

![栈和堆内存分配.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/mxPOG5z2KeJXJnKa/img/c5faad69-58b2-423c-80e1-88ce5d7c2dce.png)

## 2.关键区别：赋值时的“复制行为”不同

例1：基础数据类型的赋值（复制“值”）

```javascript
let a = 10;
let b = a;

b = 20;
console.log(a); // 输出 10
```

**结论：基础数据类型的赋值，是\[值的复制\]**[茶] **——两个变量完全独立，修改一个不影响另一个。**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/KYLGYmVYSBNxV1yj/079087e9a4464c328a4d1d4300a0046a3037.png)

例2：引用数据类型的赋值（复制”地址“）

```javascript
let arr = [1, { a: 2 }];
let copy = arr;

copy[0] = 100;
copy[1].a = 200;
console.log(arr); // 输出 [100, { a: 200 }]
```

**结论：引用数据类型的赋值，是\[地址的复制\]**[OK]**——两个变量共享同一个堆内存里的”实际值“，修改任何一个都会影响另一个。**

![image](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/KYLGYmVYSBNxV1yj/04a5096be3064bf5af82be383436af3d3037.png)

「如果我们想让引用类型的 “拷贝体” 和 “原变量” 完全独立（修改拷贝体不影响原变量），单纯的赋值（复制地址）做不到 —— 这时候就需要 “拷贝” 操作」。

比如实际开发中：

- 你有一个用户列表数组 `let users = [{id:1, name:"张三"}, {id:2, name:"李四"}]`；
- 你想基于这个列表修改（比如给张三改名字），但又不想影响原列表；
- 直接 `let newUsers = users` 会导致原列表被修改，这时候就需要 “拷贝”。

于是，拷贝的核心目的就明确了：**让引用类型的拷贝体和原变量，拥有独立的 “堆内存值”，互不干扰。**

## 3.赋值和拷贝的区别

### 例子1：赋值（复制地址，共用一个值）

**核心逻辑：**就像你有一把房子钥匙（原变量），复制一把钥匙给别人（赋值）→ 你们俩的钥匙都能开同一套房，对方在房里改东西（比如换家具），你回去也能看到变化。

```javascript
const originArr = [1, { name: "张三" }];
const assignArr = originArr;

assignArr[0] = 100;
assignArr[1].name = "李四";

console.log("原数组：", originArr);
console.log("赋值数组：", assignArr);
```

**结论：\*\***赋值后的变量和原变量，指向「同一个堆内存的值」→ 无论修改表层还是嵌套内容，都会影响原变量。\*\*

### 例子 2：浅拷贝（创建新容器，复制表层元素）

**核心逻辑：**就像你复制了一套 “新房”（新容器），房子结构和原房一样，但：

- 表层的 “家具”（基础类型，比如数字、字符串）是新的，你改自己的不影响原房；
- 嵌套的 “衣柜”（引用类型，比如对象、数组）还是原房的同款（共用地址），你改衣柜里的东西，原房的衣柜也会变。

```javascript
const originArr = [1, { name: "张三" }];
const shallowCopyArr = [...originArr];

shallowCopyArr[0] = 100;
shallowCopyArr[1].name = "李四";

console.log("原数组：", originArr);
// 输出：[1, { name: "李四" }] → 表层没影响，嵌套对象被修改了！
console.log("浅拷贝数组：", shallowCopyArr);
// 输出：[100, { name: "李四" }] → 表层独立，嵌套和原数组共用
```

**结论：\*\***浅拷贝创建了「新容器」→ 表层基础类型独立（修改不影响原变量），但嵌套的引用类型仍共用地址（修改会影响原变量）。\*\*

# 二、浅拷贝、深拷贝

## 1.浅拷贝（Shallow Copy）

浅拷贝创建一个新的对象，但是只复制原始对象的基本数据类型的字段或引用（地址），而不复制引用指向的对象。这意味着新对象和原始对象中的引用指向相同的对象。

如果原始对象中的字段是基本数据类型，那么这些字段会被复制到新对象中，而如果字段是引用类型，则新对象和原始对- 象的对应字段将引用同一个对象。

因此，对新对象所做的修改可能会影响到原始对象，因为它们共享相同的引用。

## 2.实现浅拷贝的四种方法

### 1.Object.assign()

Object.assign()是一个对象的静态方法，用于将一个或多个源对象的可枚举属性的值复制到目标对象中，并返回目标对象，该方法实现到是浅拷贝，也就是说目标对象拷贝得到的是源对象的引用。

👉 原生 API（无依赖），适用于简单对象 / 数组浅拷贝：

✅ 支持拷贝对象 / 数组的可枚举属性，表层元素独立；

✅ 可同时合并多个源对象（如 `Object.assign(target, obj1, obj2)`）；

❌ 不支持循环引用（遇到会报错）。

```javascript
//语法：Object.assign(target, ...sources)
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log("我是copy的对象", copy);
console.log("我是原对象", obj);
```

**注意：字符串和可枚举的Symbol 类型属性都会被复制，例如**

```javascript
const o1 = { a: 1 };
const o2 = { [Symbol("foo")]: 2 };

const obj = Object.assign({}, o1, o2);
console.log(obj); // { a: 1, [Symbol("foo")]: 2 }
```

```javascript
const obj = Object.create(
  { foo: 1 },
  {
    // foo 是个继承属性。
    bar: {
      value: 2, // bar 是个不可枚举属性。
    },
    baz: {
      value: 3,
      enumerable: true, // baz 是个自身可枚举属性。
    },
  },
);

const copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```

**注意：继承属性和不可枚举属性书不能拷贝的**

### 2.利用lodash组件库调用

**lodash是一个一致性、模块化、高性能的 JavaScript 实用工具库。**

[Lodash 简介 | Lodash中文文档 | Lodash中文网 (lodashjs.com)](https://www.lodashjs.com/)

👉 功能全面（按需选择），支持复杂场景的拷贝方案：

**（1）\_.clone ()（浅拷贝）**

✅ 支持 arrays、array buffers、 booleans、 date objects、maps、 numbers， `Object` 对象, regexes, sets, strings, symbols, 以及 typed arrays。 `arguments`对象的可枚举属性会拷贝为普通对象。 一些不可拷贝的对象，例如error objects、functions, DOM nodes, 以及 WeakMaps 会返回空对象。

✅ 表层元素独立，嵌套引用类型共享（标准浅拷贝特性）；

准备依赖库文件

```bash
npm init -y
npm install lodash
```

```javascript
<!-- 引入本地 node_modules 里的 Lodash 核心库 -->
<script src="./node_modules/lodash/lodash.min.js"></script>

<!-- 引入 Lodash CDN（核心库） -->
<!-- <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script> -->

var objects = [{ 'a': 1 }, { 'b': 2 }];
var shallow = _.clone(objects);
console.log(shallow[0] === objects[0]);
```

### 3.扩展运算符(...)

解构赋值就是浅拷贝

- 扩展运算符：“复制并新建” → 主动创建新容器，复制原数据（浅拷贝）；
- 解构赋值：“提取并分配” → 提取原数据元素，可收集剩余元素到新容器（浅拷贝是附带效果）；

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = [...arr1];

arr1[0] = 111;
arr1[2].name = "李四";

console.log("\n=== 扩展运算符 (...) 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

### 3.数组的浅拷贝（7种常用方式）

浅拷贝核心：只复制数组表层元素，若数组内嵌套「对象/数组」，则嵌套部分仍共享引用（修改新数组的嵌套内容会影响原数组）。

#### slice()

作用：提取数组的指定部分作为新数组，返回新的数组片段，不修改原数组，当sclice()不传值的时候就是全拷贝。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = arr1.slice();

arr1[0] = 111;
arr2[2].name = "李四";

// 打印结果
console.log("=== slice() 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

#### Array.from(arr)

从类数组对象或可迭代对象创建新数组，返回新的数组实例。

“转换复制”→ 调用`Array.from(arr)`，将原数组转换为新数组完成复制，表层元素独立、嵌套引用共享（浅拷贝特性）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = Array.from(arr1);

arr1[0] = 111;
arr2[2].name = "李四";

console.log("\n=== Array.from(arr) 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

#### Array.of(...arr)

利用Array.of()接收多个参数创建新数组的特性，将原数组的表层元素逐个传入，从而复制出全新的数组，嵌套引用仍然共享。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = Array.of(...arr1); // 等价于 Array.of(1, 2, { name: "张三" })

arr1[0] = 111;
arr2[2].name = "李四";

cnsole.log("\n=== Array.of() 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

#### concat()

“拼接复制”→ 调用数组`concat()`方法（不传参时），创建新数组复制原数组表层元素，嵌套引用类型共享（浅拷贝特性）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = arr1.concat();

arr1[0] = 111;
arr2[2].name = "李四";

console.log("\n=== concat() 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

#### arr.map()

遍历映射复制”→ 调用数组`map()`方法，传入回调函数遍历原数组元素，返回新数组（每个元素由回调处理），表层元素经处理后独立，嵌套引用类型共享（浅拷贝特性）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = arr1.map((item) => item);

arr1[0] = 111;
arr1[2].name = "李四";

console.log("\n=== arr.map() 浅拷贝 ===");
console.log("原数组 arr1：", arr1); // [111, 2, { name: "李四" }]
console.log("拷贝数组 arr2：", arr2); // [1, 2, { name: "李四" }]
```

#### for...in

“遍历赋值复制”→ 通过`for...in`循环遍历原数组索引，手动将每个元素赋值到新数组，创建新数组复制原数组表层元素，嵌套引用类型共享（浅拷贝特性）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = [];
// for...in 遍历数组索引，复制每个元素
for (let index in arr1) {
  arr2[index] = arr1[index]; // 复制表层元素（基础类型复制值，引用类型复制地址）
}

arr1[0] = 111;
arr1[2].name = "李四";

console.log("\n=== for...in 循环 浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

#### push

遍历添加复制”→ 先创建空数组，通过循环遍历原数组元素，用`push()`方法手动将每个元素添加到新数组，复制原数组表层元素，嵌套引用类型共享（浅拷贝特性）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = [];
// 用 for...of 遍历元素，push 到新数组（比 for...in 更直观）
for (let item of arr1) {
  arr2.push(item);
}

arr1[0] = 111;
arr1[2].name = "李四";

console.log("\n=== push 手动浅拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

### 4.structuredClone

[Window：structuredClone() 方法 - Web API | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/structuredClone)

- 第一个参数 `value`：要克隆的值（支持数组、对象、基础类型等，但不支持函数、Symbol 等）；
- 第二个参数 
  - `transfer`：数组，指定要「转移所有权」的可转移对象；
  - `clone`：函数，自定义克隆逻辑的回调（你的代码核心用法）。

“原生克隆（可强制浅拷贝）”→ 浏览器 / Node.js 原生 API，默认是深拷贝；若通过自定义克隆逻辑限制层级（不递归复制嵌套引用类型），可实现浅拷贝效果，创建新容器复制原数组表层元素，嵌套引用类型共享（强制浅拷贝时），语法需配合自定义克隆器使用（非默认行为，极少用）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = structuredClone(arr1, {
  transfer: [], // 关闭传输流
  // 自定义克隆器：对对象类型直接返回原引用（不深拷贝）
  clone: (value) => {
    if (typeof value === "object" && value !== null) {
      return value; // 嵌套对象不复制，直接用原引用（实现浅拷贝效果）
    }
    return structuredClone(value); // 基础类型正常复制
  },
});

arr1[0] = 111;
arr2[2].name = "李四";

console.log("\n=== structuredClone() 强制浅拷贝（不推荐） ===");
console.log("原数组 arr1：", arr1);
console.log("拷贝数组 arr2：", arr2);
```

**注：补充说明其核心特性避免误解 —— 该 API 天生为深拷贝设计，浅拷贝需手动干预，实际开发中优先用前 7 种天然浅拷贝方法，仅在需原生 API 且需浅拷贝时考虑此方式。**

## 3.深拷贝（Deep Copy）

[https://juejin.cn/post/6932365829614862350](https://juejin.cn/post/6932365829614862350)

深拷贝创建一个新的对象，并且递归地复制原始对象的所有字段和引用指向的对象，而不仅仅是复制引用本身。

深拷贝会递归复制整个对象结构，包括对象内部的对象，确保新对象和原始对象之间的所有关系都是独立的。

这意味着对新对象所做的修改不会影响到原始对象，因为它们拥有彼此独立的副本。

## 4.实现深拷贝的方法四种方法

### 1.JSON.parse(JSON.stringify(arr))

JSON.stringify()是JavaScript中的一个内置方法，用于将一个JavaScript值（对象或值）转换成一个JSON字符串（开辟一个新的地址）。JSON.parse()也是JavaScript中的一个内置方法，用于将一个JSON字符串转换为JavaScript对象或值

👉 最常用（无依赖），但有局限性：

❌ 不支持函数、undefined、Symbol、循环引用；

❌ 会忽略对象的 `function`、`Symbol` 属性。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = JSON.parse(JSON.stringify(arr1));

arr1[0] = 100;
arr2[2].name = "李四";

console.log("=== JSON.parse(JSON.stringify) 深拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("深拷贝数组 arr2：", arr2);

const arrWithLimit = [1, () => {}, undefined, Symbol("test")];
const arr2WithLimit = JSON.parse(JSON.stringify(arrWithLimit));
console.log("局限性示例：", arr2WithLimit);
```

### 2.Lodash \_.cloneDeep(arr)

👉 推荐（无局限性），支持所有数据类型（函数、循环引用等），需安装 Lodash（`npm install lodash`）。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = _.cloneDeep(arr1);

arr2[1] = 200;
arr2[2].name = "王五";

console.log("\n=== Lodash _.cloneDeep 深拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("深拷贝数组 arr2：", arr2);

const arrWithComplex = [
  1,
  { name: "赵六" },
  () => console.log("函数"),
  Symbol("test"),
];
const arr2WithComplex = _.cloneDeep(arrWithComplex);
console.log("支持复杂类型：", arr2WithComplex[2]);
console.log("支持 Symbol：", arr2WithComplex[3]);
```

### 3.structuredClone()

👉 浏览器/Node.js 内置 API（无需依赖），支持大部分类型（循环引用、Date、RegExp等），但不支持函数、Symbol。

```javascript
const arr1 = [1, 2, { name: "张三" }];
const arr2 = structuredClone(arr1);

arr2[0] = 300;
arr2[2].name = "赵六";

console.log("\n=== structuredClone 深拷贝 ===");
console.log("原数组 arr1：", arr1); // [1, 2, { name: "张三" }]
console.log("深拷贝数组 arr2：", arr2); // [300, 2, { name: "赵六" }]

const arrWithCycle = [1, { name: "孙七" }];
arrWithCycle.push(arrWithCycle); // 构建循环引用（数组引用自身）
const arr2WithCycle = structuredClone(arrWithCycle);
console.log("是否支持循环引用：", arr2WithCycle[2] === arr2WithCycle);

// 局限性示例（不支持函数）：
const arrWithFunc = [1, () => {}];
// const arr2WithFunc = structuredClone(arrWithFunc); // 报错：DataCloneError（函数不支持）
```

### 4.手动递归

👉 适合理解原理，需手动处理数组/对象嵌套，复杂场景（如循环引用）需额外处理。

```javascript
const arr1 = [1, 2, { name: "张三" }];

function deepClone(target) {
  if (Array.isArray(target)) {
    return target.map((item) => deepClone(item));
  }
  // 创建新对象，递归拷贝每个属性
  if (typeof target === "object" && target !== null) {
    const newObj = {};
    for (const key in target) {
      newObj[key] = deepClone(target[key]);
    }
    return newObj;
  }
  return target;
}

const arr2 = deepClone(arr1);

arr2[1] = 400;
arr2[2].name = "周八";

console.log("\n=== 手动递归 深拷贝 ===");
console.log("原数组 arr1：", arr1);
console.log("深拷贝数组 arr2：", arr2);
```

## 总结：

#### 前提：先判断数据类型（决定是否需要“拷贝”）

- **基础类型（String/Number/Boolean/undefined/null/Symbol）**：无“深浅拷贝”概念，直接赋值即可。   原理：赋值时会创建独立的栈内存空间，修改新变量不会影响原变量，无需额外拷贝操作。
- **引用类型（Array/Object/Date/RegExp等）**：赋值仅传递内存地址（共享数据），需根据“是否需要独立修改嵌套数据”选择拷贝方式。

#### 1. 无嵌套数据 —— 浅拷贝：适用场景+推荐方法

- **适用场景**：   ① 引用类型无嵌套（仅表层是基础类型）；② 有嵌套但无需独立修改嵌套数据（允许共享嵌套内容）。
- **推荐方法（按简洁度/实用性排序）**：
  - 数组：`[...arr]`（最简洁）、`arr.slice()`、`Array.from(arr)`
  - 对象：`{...obj}`（最简洁）、`Object.assign({}, obj)`

- **注意**：仅创建新的“外层容器”（数组/对象），嵌套的引用类型仍共享内存地址，修改嵌套数据会同步影响原数据。

#### 2. 有嵌套数据类型 —— 深拷贝：适用场景+推荐方案

- **适用场景**：   引用类型有嵌套（对象/数组嵌套），且需要独立修改拷贝数据（不影响原数据）。
- **推荐方案（兼顾实用性和兼容性）**：   ① 「简单场景」无复杂类型（无函数/循环引用/Symbol） → `JSON.parse(JSON.stringify())`（无依赖，简洁高效）；   ② 「复杂场景」含函数/循环引用/Symbol → Lodash `_.cloneDeep()`（需安装依赖，支持所有类型，生产环境推荐）；    ③ 「无依赖+自定义」需灵活控制拷贝逻辑 → 手动递归深拷贝函数（适合理解原理，应对特殊场景）。
- **注意**：递归拷贝所有层级，性能略低于浅拷贝，简单场景无需过度使用。

**使用递归深拷贝函数**

该函数可处理：数组、对象、基础类型，避开常见坑（如原型链污染、无限递归），直接复用：

```javascript
/**
 * 实用递归深拷贝函数（支持常见类型+循环引用）
 * @param {any} target - 要拷贝的目标数据（数组/对象/基础类型等）
 * @returns {any} 深拷贝后的新数据
 */
function deepClone(obj) {
  if (typeof obj !== "object" || obj === undefined) {
    // 如果obj不是object类型或者为undefined,不做处理直接返回
    return obj;
  }

  let result; // 声明一个返回结果
  if (obj instanceof Array) {
    // 判断obj是数组还是对象
    result = [];
  } else {
    result = {};
  }

  for (let key in obj) {
    // 确保key 不是原型上的属性
    if (obj.hasOwnProperty(key)) {
      // 递归调用，一直往下挖，最终完成深拷贝
      result[key] = deepClone(obj[key]);
    }
  }
  return result; // 返回一份完全独立的拷贝
}
```

[https://blog.csdn.net/weixin_42678796/article/details/120527609?](https://blog.csdn.net/weixin_42678796/article/details/120527609?fromshare=blogdetail&sharetype=blogdetail&sharerId=120527609&sharerefer=PC&sharesource=2401_85011172&sharefrom=from_link)
