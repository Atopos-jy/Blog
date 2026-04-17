---
title: JavaScript基础
published: 2025-09-06
tags: [javascript]
category: 前端
description: JavaScript 最全知识体系总结，助你高效开发！
pinned: false
draft: false
---

## javaScript组成

- ECMASCript:解释器、翻译

- DOM:DocumentObjectModel

- BOM:BrowserObject Model

## 一、JS变量

### 1.变量的定义

变量：值可以改变的叫做变量

（1）**声明变量**：通过关键字(系统定义的有特殊功能的单词)var  声明变量的时候，同时给变量赋值，叫做初始化。

（2）**变量赋值**（3）**可以同时定义多个变量，变量之间要使用逗号隔开**。补充：输出当前变量/常量的数据类型：格式：typeof 变量/常量  JS是弱数据类型语言，容错率较高，变量被赋值成什么类型就是什么类型。不要在后续的代码里改变该变量的数据类型，很容易引起代码歧义。

```javascript
var temp; //temp是啥数据类型？不确定
temp = 12; //temp变量是数字类型
temp = "hello"; //temp变量变成了字符串类型
```

### 2.标识符规则

标识符:用户自定义的变量名叫做标识符。变量名规律：

- 标识符必须由数字，字母、下划线和美元符号$组成。

- 不能以数字开头。

- 标识符区分大小写，age和Age这是两个变量

- 标识符必须见名思意。

### 3.变量的数据类型

JS中的数据类型分为两大类：

（1）**基本数据类型**

-  数字Number(整数，浮点数为float)，如：100 3.14
-  字符串：String，如：所有带双引号/单引号 ‘hello’ “hello”
- 布尔值：Boolean，如：true false
- 特殊数据类型：Null、Undefined、 NaN，如：null空、unde fined未声明注意：
  -    如果alert(abc)一个不存在的变量，会直接报错，而不是undefined,可见undefined和真正的未定义还是有些区别的。因为它是一种特殊类型。
  -    null也是一种值，但逻辑含义是没有值，它是对象Object类型。
  -     变量的类型只有在赋值后才能确定。

（2）**复合数据类型**

## 二、JS运算符

### 1.运算符的种类

（1）算术运算符(+, -, \*,/,%(取余数)）

（2）字符串和变量的拼接(+)

（3）关系运算符（<、>、<=、>=、==、===、!= !==）

（4）逻辑运算符（&&与(且)、||或、!非）

（5）赋值运算符（=、+=、-=、\*=、/=、%=）

（6）自增、自减（++a,、a++、--a,、a--）

### 2.算术运算符

| 运算符 | 说明                                                                                            | 示例      | 备注                                               |
| ------ | ----------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------- |
| +      | 加                                                                                              | a=5+4     |                                                    |
| \-     | 减                                                                                              | a=8-5     |                                                    |
| /      | 除                                                                                              | a=20/5    |                                                    |
| \*     | 乘                                                                                              | a = 5\*19 |                                                    |
| %      | 取模一两个数相除的余数                                                                          | 10%3=1    |                                                    |
| ++     | 一元自加。该运算符带一个操作数，将操作数的值加1。返回的值取决于++运算符位于操作数的前面或是后面 | ++x，x++  | ++x将返回x自加运算后的值。x++将返回x自加运算前的值 |
| –      | 一元自减。该运算符只带一个操作数。返回的值取决于–运算符位于操作数的前面或是后面                 | –x，x–    | –x将返回x自减运算后的值。x–将返回x自减运算前的值   |

注意：

任何类型的数据和字符串类型数据做相加操作的时候。其他数据类型会自动转换成为字符串类型。此时的相加操作不再是数学意义上加法，而是表示拼接的意思。如果其中一个操作数是字符串的时候，+号叫做字符串拼接符。任何数据除了和字符串做相加运算外，先要将字符串转成数字再进行运算。

（1）与NaN做算数运算的结果始终都是NaN,包括NaN本身和NaN做运算结果也为NaN。

（2）字符串如果是纯数字字符串转成数字，否则转换成NaN。

```javascript
var tmp = "您" + "好";
var tmp = "1" + 1;
var tmp = "h" + true;
var tmp = "h" + undefined;
alert(tmp); //tmp is not defined (tmp变量没有声明。)
var tmp = 1 - "2"; //-1字符串"2"转成了数字2
var tmp = 1 - "2a"; //NaN not a number "2a"转成数字NaN
```

代码规范:

（1）注意层级缩进 tab =四个空格; ,后面都跟一个空格

（2）运算符= +前后都应该空空格。

（3）每一条语句后面都必须添加;分号。

（4）所有的括号成对输入，所有的双引号成对输入。

（5）一句话占一行

（6）缩进对齐:同级对齐子一级比上一级缩进4个空格

### 3.赋值运算符

（1）赋值运算符用等于号(=)表示，就是把右边的值赋给左边的变量。（2）复合赋值运算符通过x=的形式表示，x表示算术运算符。

### 4.关系运算符

用于进行比较的运算符称作为关系运算符。如：小于(<)、大于(>)、 小于等于(<=)、大于等于(>=).相等(=),不等(!=)、全等(恒等)(===)、不全等(不恒等)(!==)和其他运算符一样, 当关系运算符操作非数值时要遵循一.下规则:

（1）两个操作数都是数值，则数值比较；

（2）两个操作数都是字符串，则比较两个字符串对应的字符编码值（ASCII码表值）；逐位进行比较，直到比较出大小，终止比较。

（3）两个操作数有一个是数值，则将另一个转换为数值，再进行数值比较。

| 运算符 | 说明                                                         | 示例                  |
| ------ | ------------------------------------------------------------ | --------------------- |
| \==    | 等于。如果两个操作数相等，则返回真。                         | a==b                  |
| !=     | 不等于。如果两个操作数不相等，则返回真。                     | a != 5                |
| \>     | 大于。如果左边的操作数大于右边的操作数，则返回真。           | var1>var2             |
| <      | 小于。如果左边的操作数小于右边的操作数，则返回真。           | var2 < var1           |
| <=     | 小于等于。如果左边的操作数小于或等于右边的操作数，则返回真。 | var2 <= 4var2 <= var1 |
| \>=    | 大于等于。如果左边的操作数大于或等于右边的操作数，则返回真。 | var1 >= 5varl >= var2 |

在相等和不等的比较上，如果操作数是非数值，则遵循一下规则:

（1）一个操作数是布尔值，则比较之前将其转换为数值，false 转成0，true 转成1；

（2）一个操作数是字符串，则比较之前将其转成为数值再比较；

（3）一个操作数是NaN，则==返回false,!=返回 true;并且NaN和自身不等；

（4）在全等（===）和全不等（!==）的判断上，比如值和类型都相等，才返回true，否则返回false。

```javascript
alert(1 == true); //true
alert(0 == false); //true
alert(20 == "20"); //true
alert(1 != NaN); //true
alert(NaN != NaN); //true
alert(20 === "20"); //false
alert(20 === Number("20")); //true
```

### 5.逻辑运算符

| 运算符   | 值           | 说明                                                                 |
| -------- | ------------ | -------------------------------------------------------------------- | ----- | --- | ----- | -------------------------------------------------------------------------------- |
| 与(`&&`) | expr1&&expr2 | 只有当`exprl 和expr2` 同为真时，才返回真(true).否则，返回假(false)。 |
| 或(`     |              | `)                                                                   | expr1 |     | expr2 | 如果其中一个表达式为真，或两个表达式同为真，则返回真(true).否则，返回假(false)。 |
| 非( `!`) | !expr        | 如果表达式为真，则返回假(false).如果为假，则返回真(true).            |

逻辑非(NOT): `!`  

逻辑非运算符可以用于任何值。无论这个值是什么数据类型，这个运算符都会返回一个布尔值。它的流程是:先将这个值转换成布尔值，然后取反，规则如下:

（1）操作数是一个空字符串，返回true；

（2）操作数是-个非空字符串，返回false；

（3）操作数是数值0，返回true；

（4）操作数是任意非0数值(包括Infinity)，false；

（5）操作数是NaN，返回true;（6）操作数是undefined，返回true;

```javascript
alert(!"); //true
alert( !"ss"); //false
alert(!0); //true
alert(!1); //false
alert( !Infinity) //false
alert( !NaN); //true
alert( !undefined); //true
```

注意：短路操作，与运算只要第一个为true便不再执行第二个，或运算只要第一个为false便不再执行第二个

### 6.其他运算符

（1）字符串运算符

字符串运算符只有一个，即: “+”。它的作用是将两个字符串相加。规则:至少-一个操作数是字符串即可。

（2）逗号运算符逗号运算符可以在一条语句中执行多个操作。

（3）三元(目)条件运算符

### 7.一元运算符

只能操作一个值的运算符叫做一元运算符。

```javascript
var age = ++box; /加后取值先执行加法运算,在取值
var height = box++; //加前取值先取值再执行加法运算
*其他类型应用一元运算符的规则
var box = '89';
box++; //90,数值字符自动转换成数值
var box = 'ab'
box++; //NaN,字符串包含非数值转成NaN
var box = false;
box++; //1 ,false转成数值0,累加就是
var box= 2.3;
box++; //3.3，直接加1
```

### 8.表达式概念

> 由运算符和操作数(变量或常量)组成的式子，叫做表达式
>
> 算术运算符组成的式子叫算术表达式关系运算符组成的式子叫关系表达式或者条件表达式逻辑运算符组成的式子叫做逻辑表达式如: 2+3; a+5; c>3; a&&b等;

### 9.json

随着互联网的发展和各种 [Web 应用程序](https://so.csdn.net/so/search?q=Web%20%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F&spm=1001.2101.3001.7020 "Web 应用程序")的普及，数据交换已经成为了我们日常开发中的重要环节。而在各种数据交换格式中，JSON（JavaScript Object Notation）作为一种轻量级的数据交换格式，以其简洁、易于阅读和解析的特性，得到了广泛应用

**轻量级**：相比 XML 等格式，JSON 更加简洁，减少了数据传输量。**易于阅读和书写**：其结构简单，符合大多数开发者的习惯，便于阅读和手动书写。**解析效率高**：JSON 的解析速度非常快，特别适合在浏览器和服务器之间进行数据交互。**良好的语言支持**：几乎所有的 编程语言 都提供了对 JSON 的良好支持，方便开发者在不同的技术栈中使用。

#### 1\. 对象（Object）

对象表示为花括号 `{}` 包围的内容，内部是多个 键值对 的集合。键（key）是字符串，值（value）可以是任意合法的 JSON 数据类型。键值对之间使用逗号 `,` 分隔，键和值之间使用冒号 `:` 分隔。

```javascript
{
  "name": "Alice",
  "age": 25,
  "isStudent": false
}
```

#### 2\. 数组（Array）

数组表示为方括号 `[]` 包围的内容，内部是按顺序排列的多个值。数组中的值可以是任意合法的 JSON 数据类型，不需要相同类型。

```javascript
["Apple", "Banana", "Cherry"];
```

#### 3\. 键值对（Key-Value Pair）

键值对由键和值组成，键必须是字符串，值可以是任意类型。注意键要用双引号括起来。

```javascript
{
	"key": "value"
}
```

## 三、数组

### 1.创建数组

#### 1.使用Array创建数组

```javascript
// 无参构建
let arr = new Array(); //创建一个空数组  []

// 如果只传一个数值参数，则表示创建一个初始长度为指定数值的空数组
let arr = new Array(5); // 创建一个包含20项的数组  [empty × 5]

// 如果传入一个非数值的参数或者参数个数大于 1，则表示创建一个包含指定元素的数组。
let arr = new Array("lily", "lucy", "Tom"); // ['lily', 'lucy', 'Tom']

let arr = new Array("23"); // ["23"]
```

#### 2.使用Array of创建数组(es6 新增)

```javascript
let arr = Array.of(1, 2); // [ 1, 2 ]

let arr1 = Array.of(3);
console.log("Array.of", arr1.length); //1
console.log("Array.of", arr1[0]); //3
```

#### 3.Array.from 方法创建数组(es6 新增)

```javascript
function arga(...args) {
  //...args剩余参数数组,由传递给函数的实际参数提供
  let arg = Array.from(args);
  console.log(arg);
}

arga("arr1", 26, "from"); // [ arr1 ,26, from ]
```

### 2.join

该方法可以将数组里的元素,通过指定的分隔符,以字符串的形式连接起来。返回值:返回一个新的字符串

```javascript
//将数组用 - 符号连接起来
let arr = [1, 2, 3, 4, 5];
let str = arr.join("-");
console.log("join", str); // str = 1-2-3-4-5;
```

### 3.split

该方法是用过指定的分隔符,将字符串分割成数组。返回值:返回一个新的数组

```javascript
let str = "wqz-ttj";
let arr = str.split("-");
console.log("split", arr); // arr=['wqz','ttj'];
```

### 4.数组的翻转和排序（改变数组）

#### 1.reverse反转数组

```javascript
let arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log("reserse", arr); // [5, 4, 3, 2, 1]
```

#### 2.sort排序

```javascript
let arr = [1, 3, 5, 2, 4, 23, 122, 34];
// 没有参数:时按照首字符的先后排序
arr.sort();
console.log("没有参数", arr); //arr=[1,122,2,23,3,34,4,5];

// 有参数
arr.sort(function (a, b) {
  return a - b; //从小到大排序
  return b - a; //从大到小排序
});
console.log("正序排列", arr); // [1, 2, 3, 4, 5, 23, 34, 122]
```

### 5.concat拼接方法

concat 方法会将参数拼接到该数组中；如果是基本数据类型，那么直接添加进去；如果是数组类型那么会将外层的 【】去掉，只将参数添加进去如果是数组嵌套数组，那么只会扒掉一层 【】，将内层数组添加进去

```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr = arr1.concat(arr2);
console.log(arr); //arr = [1,2,3,4,5,6];

arr = arr1.concat({ name: "张三" });
console.log(arr); // arr = [1,2,3, { name: '张三' }]

arr = arr1.concat([[7, 8, 9]]);
console.log(arr); // arr = [1,2,3, [7,8,9]]

arr1.push(arr2);
console.log(arr1); //arr1 = [1,2,3,[4,5,6]];
```

### 6.slice截取办法

该方法可以从数组中截取指定的字段,返回出来返回值:返回截取出来的字段,放到新的数组中,不改变原数组

#### 1.arr.slice(start,end)

从start下标开始截取,一直到end结束,不包括end

```javascript
arr = [0, 1, 2, 3, 4, 5, 6, 7];
let newArr = arr.slice(0, 3); //newArr = [0,1,2];
console.log("slice", newArr);
```

#### 2.arr.slice(start)

从start下标开始截取,一直到最后

```javascript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
newArr = arr.slice(2); //newArr = [2，3，4，5，6，7];
console.log("slice", newArr);
```

#### 3.arr.slice()

全部截取

```javascript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
newArr = arr.slice(); //newArr = [0,1,2,3,4,5,6,7];
console.log("slice", newArr);
```

### 7. splice

删除或增加元素(任意在任何位置,直接改变原数组,返回的是被删除元素组成的新数组或者空数组)

#### 1.arr.splice(start,deletedCount) 纯删除

```javascript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
arr.splice(1, 2); //newArr = [1,2];
console.log("splice", arr); //  [0, 3, 4, 5, 6, 7]
```

#### 2.arr.splice(start,deletedCount,item) 替换

```javascript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
arr.splice(1, 2, 10, 20, 30); // newArr = [1,2];
console.log("splice", arr); // [0, 10, 20, 30, 3, 4, 5, 6, 7]
```

#### 3.arr.splice(start,0,item) 纯添加

从start下标开始,删除0个,并在该位置添加item,start开始全部往后移动

```javascript
let arr = [0, 1, 2, 3, 4, 5, 6, 7];
arr.splice(2, 0, 10, 20, 30); //arr = [0,1,2,3,4,5,6,7]
console.log("splice", arr); //  [0, 1, 10, 20, 30, 2, 3, 4, 5, 6, 7]
```

### 8.数组的增删类型

#### 1.push方法（末尾添加）

push 向数组末尾添加数据

```javascript
let arr = [1, 2, 3, 4, 5];
arr.push(6); // 返回值:返回的是添加元素后数组的长度.
console.log("push", arr); //  [1, 2, 3, 4, 5, 6]
```

#### 2.unshift 方法（首部添加）

unshift 向数组前面添加数据

```javascript
let arr = [1, 2, 3, 4, 5];
arr.unshift(0); // 6 返回的是添加元素后数组的长度
console.log("unshift", arr); //  [0, 1, 2, 3, 4, 5, 6]
```

#### 3.pop方法（末尾删除）

pop 删除末尾元素元素

```javascript
let arr = [1, 2, 3, 4, 5];
arr.pop(); //  5 返回值:返回的是刚才删除的元素.
console.log("pop", arr); //  [1, 2, 3, 4]
```

#### 4.shift方法（首部删除）

shift 删除前面的元素

```javascript
let arr = [1, 2, 3, 4, 5];
arr.shift(); //  1 返回值:返回的是刚才删除的元素.
console.log("shift", arr); //  [2, 3, 4, 5]
```

### 9.数组的遍历类型

#### 1.map

映射,该方法使用和forEach大致相同,但是该方法有返回值,返回一个新数组,新数组的长度和原数组长度相等，可以修改原数组。//里面的function是一个回调函数,//item: 数组中的每一项;//index:item 对应的下标索引值//arr: 就是调用该方法的数组本身

```javascript
let arr = [1, 32, 54, 6, 543];
let res = arr.map(function (item, index, arr) {
  return item * 2;
});
console.log("map", res); // [2, 64, 108, 12, 1086]
```

#### 2.filter

filter方法: 有返回值, 过滤出符合条件的元素

```javascript
let arr = [1, 3, 5, 2, 4, 6];
let res3 = arr.filter(function (item, index) {
  return item % 2 === 0;
});
console.log("filter", res3); // [2, 4, 6]
```

#### 3.find

找到符合条件的项,并且返回第一项

```javascript
let arr4 = [
  { id: 3, name: "ls", done: false },
  { id: 1, name: "zs", done: true },
  { id: 2, name: "ww", done: true },
];
var res7 = arr4.find(function (item) {
  return item.done;
});
console.log("find", res7); // {id: 1, name: 'zs', done: true}
```

#### 4.findlndex

找到符合条件的项的下标,并且返回第一个

```javascript
arr4 = [
  { id: 3, name: "ls", done: false },
  { id: 1, name: "zs", done: true },
  { id: 2, name: "ww", done: true },
];
var res8 = arr4.findIndex(function (item) {
  return item.done;
});
console.log("findindex", res8); // 1
```

#### 5.for循环

`for` 循环是最基础的数组遍历方法，可以灵活控制遍历的开始、结束条件及增量。与 `forEach` 相比，`for` 循环可以通过 `break` 提前退出，但代码相对繁琐。

```javascript
for (let i = 0; i < array.length; i++) {
  // 逻辑
}
```

### 10.forEach

**forEach()** 方法对数组的每个元素执行一次提供的函数

```javascript
var array = ["a", "b", "c"];

array.forEach(function (element) {
  console.log(element);
});
```

输出为：a;b;c;

**foreach 语法：**

```javascript
[ ].forEach(function(value,index,array){　　　　//code something　　});
```

- `currentValue`：数组中正在处理的当前元素。
- `index`：当前元素的索引（可选）。
- `array`：当前正在遍历的数组（可选）

. forEach 方法的特性不改变原数组：forEach 方法只会对数组中的每个元素执行回调函数，不会修改原数组本身。无法中途停止：forEach 方法无法通过 break 或 return 提前终止循环。如果需要中途退出循环，应该考虑使用 for 循环或 some、every 等方法。

### 11.some方法

some方法用于检测数组中是否满足条件的元素

some() 方法会依次执行数组的每个元素：

如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。

如果没有满足条件的元素，则返回false。

```javascript
let arr = [1, 2, 3, 4, 5, 6];
let result = arr.some((item) => {
  if (item == 1) {
    return item;
  }
});
console.log(result); //true
```

注：some方法不会对空数组检测，some方法不会改变原始数组

### 12、every方法

every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

every() 方法使用指定函数检测数组中的所有元素：

如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。

如果所有元素都满足条件，则返回 true。

```javascript
let arr = [1, 2, 3, 4, 5, 6];
let result = arr.every((item) => {
  return item < 7;
});
console.log(result); //true
```

注：every方法不会对空数组检测，every方法不会改变原始数组

## 四、函数

### 1.箭头函数

在JS中箭头函数根据是否书写大小括号可分为以下四种情况

```javascript
// 不省略
const fun = (value) => {
  return value;
};

// 省略小括号
const fun = (value) => {
  return value;
};

// 省略大括号
const fun = (value) => value;

// 省略大括号与小括号
const fun = (value) => value;
```

### 2.函数声明

由关键字function、函数名、参数列表和函数体组成。函数声明可以在任何地方进行定义，并且会被提升到作用域的顶部。

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 输出 5
```

### 3.函数表达式

函数表达式是将函数赋值给一个变量或属性的方式。它由关键字function、可选的函数名、参数列表和函数体组成。函数表达式可以是匿名的，也可以是具名的。

```javascript
// 匿名函数表达式
var add = function (a, b) {
  return a + b;
};

console.log(add(2, 3)); // 输出 5

// 具名函数表达式
var multiply = function multiply(a, b) {
  return a * b;
};

console.log(multiply(2, 3)); // 输出 6
```

### 4.构造函数

构造函数是用来创建对象的函数，它由关键字function、函数名、参数列表和函数体组成。构造函数通过new关键字来调用，并且会创建一个新的对象并返回。

```javascript
function Person(name = "匿名", age = 0) {
  this.name = name;
  this.age = age;
}
Person.prototype = {
  constructor: Person,
  sayHi() {
    console.log(`你好，我是 ${this.name}`);
  },
  run() {
    console.log(`${this.name} 在跑步`);
  },
};
```

- **new会帮你创建好一个新对象**

- **new会帮你准备Person.共有属性**

- **new会帮你关联隐藏属性与共有属性（即直接调用Person.prototype即可）**

- **new会帮你return新对象**
