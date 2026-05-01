---
title: 开启 ES6 之旅：从解构到类，解锁 JavaScript 新范式
published: 2025-09-27
tags: [javascript]
category: 前端
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/es6_class.png
description: ES6 最新特性，助你高效开发！
pinned: false
draft: false
---

提到 JavaScript 的进化，ES6（ECMAScript 2015）绝对是绕不开的关键节点。它像一场及时雨，为这门语言注入了诸多强大且实用的特性，让开发者得以摆脱过去繁琐的写法，用更简洁、更优雅的方式去构建代码。

从能让变量 赋值 如“拆盲盒”般灵活的**解构赋值**（无论是数组还是对象，都能精准提取所需数据），到为对象属性名提供“唯一性保障”的 **Symbol**，再到让 面向对象编程 更直观的 **Class（类）** 语法……这些新特性不仅丰富了 JavaScript 的表达能力，更重塑了我们编写代码的思维方式。

接下来，就让我们循着大纲，一步步走进 ES6 的世界，从解构赋值的灵活妙用，到 Symbol 的独特价值，再到类的结构化编程，深入探索这些基本方法，感受 ES6 为 JavaScript 带来的全新范式。

解构赋值是 ES6 引入的一种便捷的赋值语法，它允许从数组或对象中提取值，并按照一定的模式分配给变量。这种语法可以简化代码，让数据提取更直观。

#### **一、数组解构赋值**

数组解构按照**位置顺序**提取值，适用于数组、类数组对象（如 `arguments`、`NodeList`）等可迭代对象。

##### 1\. 基本用法

```javascript
const [a, b, c] = [1, 2, 3];
console.log(a); // 1（第一个元素赋值给 a）
console.log(b); // 2（第二个元素赋值给 b）
console.log(c); // 3（第三个元素赋值给 c）
```

##### 2\. 忽略部分元素

通过空位置跳过不需要的元素：

```javascript
const [, , third] = ["a", "b", "c"];
console.log(third); // 'c'（只取第三个元素）
```

##### 3\. 剩余元素（`...`）

用 `...` 收集剩余元素到一个数组中（只能放在最后）：

```javascript
const [first, ...rest] = [10, 20, 30, 40];
console.log(first); // 10
console.log(rest); // [20, 30, 40]（剩余元素组成的数组）
```

##### 4\. 默认值

当解构的值为 `undefined` 时，使用默认值：

```javascript
const [x = 5, y = 10] = [7]; // 第二个元素未提供
console.log(x); // 7（实际值覆盖默认值）
console.log(y); // 10（使用默认值）
```

#### **二、对象解构赋值**

对象解构按照**属性名**匹配提取值，不依赖顺序。

##### 1\. 基本用法

变量名需与对象属性名一致：

```javascript
const { name, age } = { name: "Alice", age: 20 };
console.log(name); // 'Alice'
console.log(age); // 20
```

##### 2\. 重命名变量

如果想使用不同的变量名，可通过 `新变量名: 原属性名` 语法：

```javascript
const { name: userName, age: userAge } = { name: "Bob", age: 22 };
console.log(userName); // 'Bob'（用 userName 接收 name 属性）
console.log(userAge); // 22（用 userAge 接收 age 属性）
```

##### 3\. 默认值

当属性不存在或值为 `undefined` 时，使用默认值：

```javascript
const { city = "Beijing", gender = "unknown" } = { city: "Shanghai" };
console.log(city); // 'Shanghai'（实际值覆盖默认值）
console.log(gender); // 'unknown'（使用默认值）
```

##### 4\. 嵌套对象解构

提取嵌套对象的属性：

```javascript
const user = {
  info: {
    height: 175,
    weight: 65,
  },
  hobbies: ["reading"],
};
// 解构嵌套的 info 对象
const {
  info: { height, weight },
} = user;
console.log(height); // 175
console.log(weight); // 65
```

#### **三、其他常见用法**

##### 1\. 函数参数解构

直接在函数参数中解构，简化参数处理：

```javascript
// 数组参数解构
function sum([a, b]) {
  return a + b;
}
console.log(sum([1, 2])); // 3

// 对象参数解构（常用）
function printUser({ name, age = 0 }) {
  console.log(`Name: ${name}, Age: ${age}`);
}
printUser({ name: "Charlie" }); // "Name: Charlie, Age: 0"
```

##### 2\. 交换变量值

无需临时变量即可交换两个变量的值：

```javascript
let x = 1,
  y = 2;
[x, y] = [y, x]; // 交换
console.log(x, y); // 2 1
```

##### 3\. 解构字符串

字符串可被视为类数组对象，支持数组解构：

```javascript
const [a, b, c] = "hello";
console.log(a); // 'h'
console.log(b); // 'e'
console.log(c); // 'l'
```

#### **四、注意事项**

1. **圆括号问题**：如果解构赋值的左侧是一个单独的对象/数组字面量（而非声明语句），需要用圆括号包裹，否则会被解析为代码块：

   ```javascript
   // 错误写法（会被解析为代码块）
   { x } = { x: 1 };

   // 正确写法（用圆括号包裹）
   ({ x } = { x: 1 });
   ```

2. **解构失败**：如果解构的目标不存在，变量会被赋值为 `undefined`：

   ```javascript
   const [a] = [];
   const { b } = {};
   console.log(a, b); // undefined undefined
   ```

#### **总结**

解构赋值的核心是**模式匹配**：数组按位置匹配，对象按属性名匹配。它极大简化了从复杂数据结构中提取值的操作，常见于处理函数参数、解析 API 返回数据、交换变量等场景，是 ES6 中最常用的特性之一。

在 JavaScript 中，`Symbol` 是 ES6（ECMAScript 2015）引入的一种新的原始数据类型，用于表示独一无二的值。它与 `Number`、`String`、`Boolean`、`null` 和 `undefined` 并列，是 JavaScript 的第 7 种原始类型。

#### **一、 Symbol 的基本特性**

- **唯一性**：每个通过 `Symbol()` 创建的值都是唯一的，即使描述相同也不相等。
- **原始类型**：`Symbol` 是原始值（不是对象），不能使用 `new` 关键字创建（会报错）。
- **不可枚举**：用 `Symbol` 作为对象属性名时，不会被 `for...in`、`Object.keys()` 等方法枚举到。

#### **二、 创建 Symbol**

##### （1）基本创建方式

使用 `Symbol()` 函数创建，可传入一个字符串作为描述（仅用于调试，不影响唯一性）：

```javascript
// 创建一个 Symbol
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false（即使没有描述，也不相等）

// 带描述的 Symbol
const s3 = Symbol("foo");
const s4 = Symbol("foo");
console.log(s3 === s4); // false（描述相同，依然不相等）
```

##### （2）全局 Symbol 注册表

使用 `Symbol.for(key)` 可以创建全局共享的 Symbol，相同 `key` 会返回同一个 Symbol：

```javascript
// 全局注册表中创建
const s5 = Symbol.for("bar");
const s6 = Symbol.for("bar");
console.log(s5 === s6); // true（相同 key，返回同一个 Symbol）

// 获取全局 Symbol 的 key
console.log(Symbol.keyFor(s5)); // "bar"
console.log(Symbol.keyFor(s3)); // undefined（s3 不是全局注册的）
```

#### **三、 Symbol 的主要用途**

##### （1）作为对象的唯一属性名

避免对象属性名冲突（尤其在多人协作或库开发中）：

```javascript
const name = Symbol("name");
const user = {
  [name]: "张三", // 用 Symbol 作为属性名
  age: 20,
};

console.log(user[name]); // "张三"（必须用 [] 访问）
```

##### （2）定义常量集合

表示一组互不相等的常量：

```javascript
const COLOR_RED = Symbol("red");
const COLOR_GREEN = Symbol("green");

function getColor(color) {
  switch (color) {
    case COLOR_RED:
      return "红色";
    case COLOR_GREEN:
      return "绿色";
    default:
      return "未知颜色";
  }
}
```

##### （3）模拟私有属性

由于 `Symbol` 属性不会被常规枚举方法遍历到，可模拟“私有属性”（并非真正私有，仍可通过 `Object.getOwnPropertySymbols()` 访问）：

```javascript
const privateProp = Symbol("private");

class MyClass {
  constructor() {
    this[privateProp] = "秘密数据";
  }

  getPrivate() {
    return this[privateProp]; // 只能通过类内部方法访问
  }
}

const obj = new MyClass();
console.log(obj.getPrivate()); // "秘密数据"
console.log(Object.keys(obj)); // []（无法枚举到 Symbol 属性）
```

##### （4）内置 Symbol 值

JavaScript 提供了一些内置 `Symbol` 值，用于定义对象的特殊行为，例如：

- `Symbol.iterator`：定义对象的迭代器（使对象可被 `for...of` 遍历）。
- `Symbol.toStringTag`：定义对象的 `toString()` 返回值。
- `Symbol.hasInstance`：自定义 `instanceof` 操作的行为。

示例：自定义对象的迭代器

```javascript
const myIterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        return i < 3 ? { value: i++, done: false } : { done: true };
      },
    };
  },
};

for (const num of myIterable) {
  console.log(num); // 0, 1, 2
}
```

#### **四·、注意事项**

- `Symbol` 不能与其他类型的值进行运算（会报错）：

  ```javascript
  console.log(Symbol("foo") + "bar"); // TypeError
  ```

- `Symbol` 可以显式转为字符串或布尔值：

  ```javascript
  console.log(String(Symbol("foo"))); // "Symbol(foo)"
  console.log(Boolean(Symbol())); // true（所有 Symbol 都是真值）
  ```

- `JSON.stringify()` 会忽略 `Symbol` 属性：

  ```javascript
  const obj = { [Symbol("id")]: 123, name: "test" };
  console.log(JSON.stringify(obj)); // {"name":"test"}
  ```

总结来说，`Symbol` 的核心价值在于其**唯一性**，主要用于解决属性名冲突问题，以及定义对象的特殊行为，是 JavaScript 中处理复杂对象交互的重要工具。

ES6 引入的 `class` 语法是 JavaScript 面向对象编程的重大改进，它提供了更简洁、更接近传统面向对象语言的语法糖（底层依然是原型继承）。以下是 `class` 类的核心属性和方法功能详解：

#### **一、类的基本结构**

`class` 语法通过 `class` 关键字定义类，包含**构造函数**、**实例方法**、**静态方法**等：

```javascript
class Person {
  // 构造函数（初始化实例）
  constructor(name, age) {
    this.name = name; // 实例属性
    this.age = age;
  }

  // 实例方法（原型上的方法）
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 静态方法（类自身的方法）
  static create(name, age) {
    return new Person(name, age); // 用于创建实例
  }
}
```

#### **二、核心属性与功能**

##### 1\. **构造函数（`constructor`）**

- 类的默认方法，用于初始化实例对象，通过 `new` 关键字创建实例时自动调用。
- 一个类只能有一个 `constructor` 方法，若未显式定义，会默认生成一个空构造函数。
- 可通过 `super()` 调用父类的构造函数（用于继承）。

```javascript
const p = new Person("Alice", 20);
console.log(p.name); // "Alice"（通过构造函数初始化）
```

##### 2\. **实例属性与方法**

- **实例属性**：定义在 `this` 上的属性（如 `this.name`），每个实例独占一份。
- **实例方法**：直接定义在类体内的方法（如 `sayHello()`），实际上是挂载在类的原型（`prototype`）上，所有实例共享。

```javascript
// 所有实例共享原型方法
const p1 = new Person("Bob", 22);
const p2 = new Person("Charlie", 25);
console.log(p1.sayHello === p2.sayHello); // true（指向同一个原型方法）
```

##### 3\. **静态属性与方法（`static`）**

- 用 `static` 关键字修饰，属于类本身，而非实例。
- 静态方法通常用于定义工具函数或工厂方法，需通过**类名**调用，不能通过实例调用。
- 静态属性在 ES6 中需在类外部定义（ES2022 支持类内直接定义静态属性）。

```javascript
// 调用静态方法
const p3 = Person.create("David", 30); // 通过类名调用

// 静态属性（ES6 写法）
Person.version = "1.0";
console.log(Person.version); // "1.0"

// ES2022 类内静态属性（更简洁）
class Person {
  static version = "1.0"; // 直接在类内定义
}
```

##### 4\. **继承（`extends` 与 `super`）**

- 通过 `extends` 关键字实现类的继承，子类可继承父类的属性和方法。
- 子类构造函数中必须通过 `super()` 调用父类构造函数（否则会报错），且需在 `this` 之前调用。
- 子类可重写父类方法，通过 `super.方法名()` 调用父类的原始方法。

```javascript
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // 调用父类构造函数
    this.grade = grade; // 子类新增属性
  }

  // 重写父类方法
  sayHello() {
    super.sayHello(); // 调用父类的 sayHello
    console.log(`I'm in grade ${this.grade}`);
  }

  // 子类静态方法
  static createStudent(name, age, grade) {
    return new Student(name, age, grade);
  }
}

const s = new Student("Eve", 16, 10);
s.sayHello();
// 输出：
// "Hello, I'm Eve"
// "I'm in grade 10"
```

##### 5\. get 与 set

- 用于拦截对象属性的读取（`get`）和设置（`set`），类似属性的访问器。
- 可用于对属性的读写进行验证或处理。

```javascript
class User {
  constructor(name) {
    this._name = name; // 约定用下划线表示“私有”属性
  }

  // getter：读取 name 时触发
  get name() {
    return this._name.toUpperCase(); // 返回大写形式
  }

  // setter：设置 name 时触发
  set name(newName) {
    if (typeof newName !== "string") {
      throw new Error("Name must be a string");
    }
    this._name = newName;
  }
}

const u = new User("frank");
console.log(u.name); // "FRANK"（触发 getter）
u.name = "grace"; // 触发 setter
u.name = 123; // 报错（触发 setter 验证）
```

##### 6\. **私有属性与方法（`#` 前缀）**

- ES2022 引入，用 `#` 前缀表示真正的私有成员，只能在类内部访问。
- 私有属性/方法无法被实例、子类访问，也不能通过 `Object.getOwnPropertyNames()` 等方法获取。

```javascript
class BankAccount {
  #balance = 0; // 私有属性

  deposit(amount) {
    this.#balance += amount; // 类内部可访问
  }

  #calculateInterest() {
    // 私有方法
    return this.#balance * 0.05;
  }

  getTotal() {
    return this.#balance + this.#calculateInterest();
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.getTotal()); // 105（正确访问）
console.log(acc.#balance); // 报错（外部无法访问私有属性）
```

##### 7\. **静态块（Static Block）**

- ES2022 引入，用于类的静态初始化逻辑（如一次性设置静态属性、初始化资源等）。
- 静态块在类定义时执行，且仅执行一次。

```javascript
class Config {
  static settings;

  static {
    // 静态初始化逻辑
    const env = process.env.NODE_ENV || "development";
    Config.settings =
      env === "development" ? { debug: true } : { debug: false };
  }
}

console.log(Config.settings); // 根据环境初始化的配置
```

#### **三、与 ES5 原型写法的对比**

`class` 本质是原型继承的语法糖，但相比 ES5 的 `function` 构造函数写法，有以下优势：

1.  语法更清晰，结构更易读（类、构造函数、方法分层明确）。
2.  继承更简洁（`extends` 替代 `Object.create()` 和原型链手动绑定）。
3.  内置支持静态方法（无需手动挂载到构造函数上）。
4.  新增私有成员、静态块等特性，增强封装性。

#### **总结**

ES6 的 `class` 语法通过 `constructor`、`static`、`extends`、`super` 等关键字，结合 getter/setter、私有成员、静态块等特性，极大简化了 JavaScript 面向对象编程的实现，使其更接近传统面向对象语言的使用习惯，同时保持了原型继承的核心机制。这些特性在框架开发（如 React 组件类）和复杂业务逻辑封装中被广泛应用。

这些基本方法，是我们开启现代 JavaScript 开发的钥匙。掌握它们，不仅能让代码更简洁高效，更能让我们在面对复杂业务逻辑、框架开发等场景时，拥有更扎实的基础与更开阔的思路。
