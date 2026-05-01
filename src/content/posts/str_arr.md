---
title: 字符串 → 数组（String → Array）
published: 2025-11-29
tags: [string, array]
category: 分类
description: 字符串转数组推荐`[...str]`或`Array.from`（支持Unicode），按分隔符用`split`。数组转字符串用`join`自定义连接符，`toString`快速逗号连接。
pinned: false
draft: false
---

## 一、字符串 → 数组（String → Array）

### 1. 核心内置方法（共4种）

#### （1）`String.prototype.split(separator, limit)`（最常用）

- **语法**：`str.split(分隔符, 最大长度)`
- **逻辑**：按指定分隔符拆分字符串，返回新数组；若分隔符为 `''`，则拆分每个字符（注意：对 emoji 等 Unicode 字符可能拆分异常，见下文说明）。
- **参数**：
  - `separator`：可选，字符串/正则表达式（如 `','`、`/ /`、`''`）；
  - `limit`：可选，限制返回数组的最大长度（超出部分忽略）。

- **示例**：

```javascript
const str = "a,b,c,123";

// 1. 按逗号分隔
console.log(str.split(",")); // ["a", "b", "c", "123"]

// 2. 分隔符为''：拆分每个字符
console.log(str.split("")); // ["a", ",", "b", ",", "c", ",", "1", "2", "3"]

// 3. 正则分隔（拆分所有非字母字符）
console.log(str.split(/[^a-z]/)); // ["a", "b", "c", "", ""]

// 4. 加limit限制
console.log(str.split(",", 2)); // ["a", "b"]（只取前2个）

// 5. 无分隔符：返回只含原字符串的数组
console.log(str.split()); // ["a,b,c,123"]
```

- **注意**：`split('')` 无法正确处理 Unicode 扩展字符（如 emoji 😊、中文姓氏「𠀀」），会拆分为代理对（如 `😊` 拆为 `["\ud83d", "\ude0a"]`），需用下文 `[...str]` 或 `Array.from` 解决。

#### （2）扩展运算符 `[...str]`（ES6+，推荐处理所有字符）

- **语法**：`[...字符串]`
- **逻辑**：将字符串视为可迭代对象，逐个提取字符到数组，**完美支持 Unicode 字符**（emoji、特殊符号等）。
- **示例**：

```javascript
const str = "abc😊123";

// 正确拆分 Unicode 字符
console.log([...str]); // ["a", "b", "c", "😊", "1", "2", "3"]

// 对比 split('') 的缺陷
console.log(str.split("")); // ["a", "b", "c", "\ud83d", "\ude0a", "1", "2", "3"]（拆分错误）
```

#### （3）`Array.from(str, mapFn)`（ES6+，支持映射转换）

- **语法**：`Array.from(类数组对象/可迭代对象, 映射函数)`
- **逻辑**：将字符串（可迭代对象）转为数组，可选第二个参数对每个字符做映射处理，同样支持 Unicode 字符。
- **示例**：

```javascript
const str = "12345";

// 1. 基础转换（同 [...str]）
console.log(Array.from(str)); // ["1", "2", "3", "4", "5"]

// 2. 加映射函数（转为数字）
console.log(Array.from(str, (char) => Number(char))); // [1, 2, 3, 4, 5]

// 3. 处理 Unicode 字符
console.log(Array.from("a😊b")); // ["a", "😊", "b"]
```

#### （4）`String.prototype.match(regexp)`（按正则匹配拆分）

- **语法**：`str.match(正则表达式)`
- **逻辑**：返回匹配正则的结果数组，若正则含 `g` 修饰符则匹配所有符合项，常用于「提取特定字符」（而非单纯拆分）。
- **示例**：

```javascript
const str = "a1b2c3d4";

// 1. 提取所有数字（正则 /\d/g 匹配全局数字）
console.log(str.match(/\d/g)); // ["1", "2", "3", "4"]

// 2. 提取所有字母
console.log(str.match(/[a-z]/g)); // ["a", "b", "c", "d"]

// 3. 无匹配时返回 null（需处理）
console.log("xyz".match(/\d/g) || []); // []（避免 null 报错）
```

### 2. 循环遍历手动实现（3种方式）

若需自定义拆分逻辑（如过滤特定字符、分步处理），可通过循环手动转换：

#### （1）`for` 循环（按索引遍历）

```javascript
function strToArrByFor(str) {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    // 可选：过滤空格、标点等
    if (str[i] !== " ") {
      arr.push(str[i]);
    }
  }
  return arr;
}

console.log(strToArrByFor("a b c 123")); // ["a", "b", "c", "1", "2", "3"]（过滤了空格）
```

#### （2）`for...of` 循环（遍历字符，支持 Unicode）

```javascript
function strToArrByForOf(str) {
  const arr = [];
  for (const char of str) {
    arr.push(char);
  }
  return arr;
}

console.log(strToArrByForOf("a😊b")); // ["a", "😊", "b"]（正确处理 emoji）
```

#### （3）`forEach` 遍历（需借助可迭代对象）

```javascript
function strToArrByForEach(str) {
  const arr = [];
  // 字符串本身不可直接 forEach，需先转为可迭代对象（如 [...str]）
  [...str].forEach((char) => {
    arr.push(char);
  });
  return arr;
}

console.log(strToArrByForEach("hello")); // ["h", "e", "l", "l", "o"]
```

## 二、数组 → 字符串（Array → String）

### 1. 核心内置方法（共4种）

#### （1）`Array.prototype.join(separator)`（最常用）

- **语法**：`arr.join(连接符)`
- **逻辑**：用指定连接符拼接数组所有元素，返回新字符串；若连接符为 `''`，则无缝拼接；若数组元素非字符串，会自动转为字符串。
- **参数**：`separator` 可选，默认是 `','`（逗号）。

- **示例**：

```javascript
const arr = ["a", "b", "c", 123];

// 1. 无连接符（默认逗号）
console.log(arr.join()); // "a,b,c,123"

// 2. 连接符为''（无缝拼接）
console.log(arr.join("")); // "abc123"

// 3. 自定义连接符
console.log(arr.join("-")); // "a-b-c-123"

// 4. 连接符为换行符
console.log(arr.join("\n"));
// 输出：
// a
// b
// c
// 123

// 5. 空数组/undefined/null 元素处理
console.log([1, undefined, 3].join(",")); // "1,,3"（undefined 转为空字符串）
console.log([1, null, 3].join(",")); // "1,,3"（null 转为空字符串）
```

#### （2）`Array.prototype.toString()`（简单快捷）

- **语法**：`arr.toString()`
- **逻辑**：等价于 `arr.join(',')`，直接用逗号连接数组元素，无需传参，适合快速转换。
- **示例**：

```javascript
const arr = [1, 2, 3, "hello"];
console.log(arr.toString()); // "1,2,3,hello"

// 嵌套数组处理（会扁平化一层）
const nestedArr = [1, [2, 3], 4];
console.log(nestedArr.toString()); // "1,2,3,4"
```

#### （3）`String(arr)`（强制类型转换）

- **语法**：`String(数组)`
- **逻辑**：与 `toString()` 效果完全一致，通过强制类型转换将数组转为字符串，默认逗号连接。
- **示例**：

```javascript
const arr = ["x", "y", 100];
console.log(String(arr)); // "x,y,100"

// 空数组转为空字符串
console.log(String([])); // ""
```

#### （4）模板字符串 + 扩展运算符（ES6+，简洁）

- **语法**：`${...arr}`
- **逻辑**：通过扩展运算符 `...` 解构数组元素，再用模板字符串拼接（默认无连接符，等价于 `arr.join('')`）。
- **示例**：

```javascript
const arr = ["h", "e", "l", "l", "o"];
console.log(`${...arr}`); // "hello"（无缝拼接）

// 加自定义连接符（需配合 join）
console.log(`${arr.join(' ')}`); // "h e l l o"（空格连接）
```

### 2. 循环遍历手动实现（3种方式）

#### （1）`for` 循环拼接

```javascript
function arrToStrByFor(arr, separator = "") {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    // 拼接当前元素
    str += arr[i];
    // 除了最后一个元素，添加连接符
    if (i !== arr.length - 1) {
      str += separator;
    }
  }
  return str;
}

console.log(arrToStrByFor(["a", "b", "c"], "-")); // "a-b-c"
console.log(arrToStrByFor([1, 2, 3])); // "123"（无连接符）
```

#### （2）`for...of` 循环拼接

```javascript
function arrToStrByForOf(arr, separator = ",") {
  let str = "";
  const arrLength = arr.length;
  for (const [index, item] of arr.entries()) {
    str += item;
    // 避免最后一个元素后加连接符
    if (index < arrLength - 1) {
      str += separator;
    }
  }
  return str;
}

console.log(arrToStrByForOf(["x", "y", "z"], " ")); // "x y z"
```

#### （3）`reduce` 方法拼接（函数式风格）

```javascript
function arrToStrByReduce(arr, separator = "") {
  // reduce 累加：prev 是上一轮结果，curr 是当前元素
  return arr.reduce((prev, curr, index) => {
    // 第一轮无 prev，直接返回 curr；后续拼接 separator + curr
    return index === 0 ? curr : `${prev}${separator}${curr}`;
  }, "");
}

console.log(arrToStrByReduce([10, 20, 30], "-")); // "10-20-30"
console.log(arrToStrByReduce(["hello", "world"], " ")); // "hello world"
```

## 三、关键总结（避坑+场景推荐）

| 转换方向    | 推荐方法                   | 适用场景                            | 注意事项                            |
| ----------- | -------------------------- | ----------------------------------- | ----------------------------------- |
| 字符串→数组 | `[...str]` 或 `Array.from` | 通用场景（尤其是含 emoji/特殊字符） | `split('')` 不支持 Unicode 扩展字符 |
| 字符串→数组 | `split(separator)`         | 按指定分隔符拆分（如逗号、空格）    | 正则分隔需注意匹配规则              |
| 数组→字符串 | `arr.join(separator)`      | 自定义连接符（无缝/空格/换行等）    | 支持所有元素类型（自动转字符串）    |
| 数组→字符串 | `arr.toString()`           | 快速逗号连接（无需自定义分隔符）    | 嵌套数组会扁平化一层                |

### 避坑点：

1. 处理 emoji、特殊符号时，优先用 `[...str]` 或 `Array.from`（而非 `split('')`）；
2. 数组含 `undefined`/`null` 时，`join`/`toString` 会转为空字符串，需提前过滤；
3. 嵌套数组转换：`toString`/`String` 会扁平化一层，`join` 会直接拼接（如 `[1, [2,3]].join('-')` → `"1-2,3"`）。
