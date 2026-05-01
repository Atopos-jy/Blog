---
title: 原型和原型链
published: 2025-10-12
tags: [原型和原型链]
category: 前端
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1759280201021.png
description: 原型是对象共享属性和方法的机制，通过`prototype`定义，`__proto__`访问。原型链层层追溯，终点是`Object`。`class`基于原型的语法糖，`super`调用父类。
pinned: false
draft: false
---

## 原型和原型链

**在js中，所有的变量都有原型，原型也可以有原型，原型最终都指向Object**

## 什么是原型

在js中，一个变量被创建出来，它就会被绑定一个原型；比如说，任何一个变量都可以使用console.log打印，这里是调用了它的toString方法，而变量被创建后可能并没有设置toString方法，但是它任然可以打印，这就从原型中获取的toString方法

```javascript
// 1. 创建一个空对象
const myObject = {};

// 2. 检查这个对象自身是否有 toString 方法
console.log(myObject.hasOwnProperty("toString")); // 输出: false

// 3. 尝试打印这个对象
// console.log 会自动调用 myObject.toString()
console.log(myObject); // 输出: {} (这是 Object.prototype.toString() 的结果)

// 4. 验证它调用的是原型上的方法
console.log(myObject.toString === Object.prototype.toString); // 输出: true
```

所以可以得到第一点：原型可以提供方法给实例的变量，

原型也是一个对象，或者说对象可以作为原型并赋值给其他变量，这样对象成为了变量的原型，而对象本身也有原型，此时就形成了 ‘链’

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1759280201021.png"/>

同样的这个变量也是一个对象，他也可以作为其他变量的原型，这样‘链’就变得更长了，但是所有的链都有一个最终指向（root终点）--- Object，Obejct是最原始的对象，它包含了所有js变量都共享的方法，它不再有原型属性[[prototype]], 所以在js中一切皆对象中的对象就是指的继承自Object

这里可以总结一下：

- 原型是一个对象，它可以向继承了自身的变量提供方法（属性）

- 变量都拥有原型，也可以成为原型，循环下去可以形成‘链’，
- 链的最顶端是Object对象，它提供了最基本的方法
- js通过原型来复用通用的方法和属性，这样极大的减少了变量创建的成本（减少了内存支出，原型的方法属性都存储在原型上，变量中不会复制过来占用内存；也不必每个对象都去书写基本的方法），

**tips：**

原型链：就前面说到的 变量获得原型，原型又有原型，变量又可以作为原型，这样就形成了‘链’，链的最外层（底层），拥有最多的方法，继承了原型链上所有原型的方法和属性

## prototype

在 JavaScript 中，**函数/类**有一个特殊的公开属性 `prototype`，它是一个对象，专门用来存放由该函数创建的**所有实例共享的属性和方法**。当你用 `new` 关键字创建实例时，实例的内部原型 `[[Prototype]]`（即 `__proto__`）会自动指向这个 `prototype` 对象。

当我们从实例中读取一个缺失的属性时，JavaScript 会自动从 `[[Prototype]]` 指向的 `prototype` 对象中查找，这就是继承的实现机制，实例可以“借用” `prototype` 中的方法。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1759154598862.png"/>

`prototype` 是一个**可以直接访问和修改的公开属性**（区别于实例的 `[[Prototype]]`）。虽然 `prototype` 本身可以被访问，但它里面的共享方法默认是**不可枚举的**，所以 `Object.keys()` 不会列出它们。不过，`for...in` 循环会遍历实例自身以及原型链上的可枚举属性。在控制台中，它通常直接显示为 `prototype: Object`，而不是用 `[[ ]]` 包裹的隐藏属性。

在构造函数或类中，你可以直接为 `prototype` 添加属性或方法，这些添加的成员会被**所有现有和未来的实例**共享。

### 代码示例

```javascript
// 1. 定义一个构造函数
function Dog(name) {
  this.name = name;
}

// 2. 给 Dog 的 prototype 添加共享方法
Dog.prototype.bark = function () {
  console.log(`${this.name} says: woof!`);
};

Dog.prototype.species = "Canis lupus familiaris";

// 3. 创建实例
const dog1 = new Dog("Buddy");
const dog2 = new Dog("Max");

// 4. 实例可以调用 prototype 中的方法和属性
dog1.bark(); // Buddy says: woof!
dog2.bark(); // Max says: woof!

console.log(dog1.species); // Canis lupus familiaris
console.log(dog2.species); // Canis lupus familiaris

// 5. 验证实例的 __proto__ 指向构造函数的 prototype
console.log(dog1.__proto__ === Dog.prototype); // true

// 6. 验证 prototype 上的方法是共享的（内存中只有一份）
console.log(dog1.bark === dog2.bark); // true

// 7. 演示查找规则：自身没有，就去 prototype 找
console.log(dog1.hasOwnProperty("bark")); // false (bark 不在实例自身)
console.log("bark" in dog1); // true (bark 在原型链上)

// 8. 演示可枚举性
console.log(Object.keys(dog1)); // ['name'] (只显示自身的可枚举属性)

console.log("--- 使用 for...in 遍历 ---");
for (const key in dog1) {
  console.log(key); // 'name', 'bark', 'species' (会遍历原型链上的可枚举属性)
}
```

## `__proto__`

`__proto__` 是每个**对象实例**都有的一个**访问器属性**（getter/setter），它允许你访问该对象的**内部原型**（Internal Prototype）。

这个内部原型在 JavaScript 规范中被称为 `[[Prototype]]`。`__proto__` 就是访问 `[[Prototype]]` 的一个“后门”。

### 核心要点

1. **它不是 `prototype`**
   - `__proto__` 是**对象实例**的属性。
   - `prototype` 是**函数/类**的属性。
   - 它们指向的对象通常是**同一个**，但角色完全不同。

   ```javascript
   function Dog(name) {
     this.name = name;
   }
   const dog = new Dog("Buddy");

   // dog 是实例，它有 __proto__
   // Dog 是函数，它有 prototype
   console.log(dog.__proto__ === Dog.prototype); // true
   ```

2. **它确实有些“过时”，但并非只能在浏览器中使用**
   - `__proto__` 最初是由浏览器厂商（如 Netscape）引入的非标准属性。
   - 由于广泛使用，它后来在 ES6 中被**标准化**，但被明确标记为“不推荐使用”（Legacy）。
   - 现在，几乎所有现代 JavaScript 环境（包括 Node.js）都支持它。
   - **推荐的替代方法**是使用全局函数：
     - `Object.getPrototypeOf(obj)`：获取一个对象的原型。
     - `Object.setPrototypeOf(obj, prototype)`：设置一个对象的原型。

3. **它与遍历的关系**
   - 你的说法“这样添加的原型属性或方法会被遍历出来”是**错误**的。
   - 默认情况下，通过 `__proto__` 或 `prototype` 添加到原型上的方法是**不可枚举的**（non-enumerable）。
   - `for...in` 循环会遍历对象自身的**可枚举属性**，以及其原型链上所有**可枚举属性**。
   - `Object.keys()` 只会返回对象**自身的**可枚举属性，**不会**遍历原型链。

### 代码示例

#### 1. `__proto__` vs `prototype`

```javascript
class Animal {}
const animal = new Animal();

// animal 实例的 __proto__ 指向 Animal 类的 prototype
console.log(animal.__proto__ === Animal.prototype); // true

// Animal 类本身也是一个对象，它的 __proto__ 指向 Function.prototype
console.log(Animal.__proto__ === Function.prototype); // true
```

#### 2. `for...in` vs `Object.keys()`

```javascript
const myObject = { a: 1 };

// 给 myObject 的原型添加一个方法
myObject.__proto__.b = 2;

// 使用 for...in 遍历
console.log("使用 for...in 遍历:");
for (const key in myObject) {
  console.log(key); // 输出 'a', 'b' (因为 b 在原型链上且可枚举)
}

// 使用 Object.keys() 遍历
console.log("使用 Object.keys() 遍历:");
console.log(Object.keys(myObject)); // 输出 ['a'] (只返回自身的可枚举属性)
```

#### 3. 使用现代 API 替代 `__proto__`

```javascript
const obj = {};
const protoObj = { greet: "hello" };

// 设置 obj 的原型为 protoObj
// 不推荐的方式: obj.__proto__ = protoObj;
Object.setPrototypeOf(obj, protoObj);

console.log(obj.greet); // 'hello'

// 获取 obj 的原型
// 不推荐的方式: const p = obj.__proto__;
const p = Object.getPrototypeOf(obj);
console.log(p === protoObj); // true
```

### 总结

| 特性         | `__proto__`                                           | `prototype`                                |
| :----------- | :---------------------------------------------------- | :----------------------------------------- |
| **所属对象** | 任何对象实例                                          | 函数/类                                    |
| **作用**     | 访问/设置实例的内部原型 `[[Prototype]]`               | 定义由该函数创建的所有实例共享的属性和方法 |
| **推荐度**   | **不推荐**，仅用于调试或理解原型链                    | **标准用法**，用于定义类的方法             |
| **现代替代** | `Object.getPrototypeOf()` / `Object.setPrototypeOf()` | 无                                         |

简单来说，`__proto__` 是连接对象和其原型的“桥梁”，是理解原型链的关键，但在实际编程中，应优先使用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 来操作原型，以保证代码的健壮性和可读性。

> 注意，**proto** 与内部的 [[Prototype]] 不一样。**proto** 是 [[Prototype]] 的getter/setter；获取和设置原型可以使用函数 Object.getPrototypeOf/Object.setPrototypeOf 来替代 **proto** 去 get/set 原型

## new

当使用 new 关键字调用函数时，该函数将被用作构造函数。new 将执行以下操作：

> 创建一个空的简单 JavaScript 对象作为实例。
> 如果构造函数的 prototype 属性是一个对象，则将实例的 原型[[Prototype]] 指向构造函数的 prototype 属性，否则实例将保持为一个普通对象，其 [[Prototype]]为 Object.prototype, 因此，通过构造函数创建的所有实例都可以访问添加到构造函数 prototype 属性中的属性/对象。
> 使用给定参数执行构造函数，并将this指向实例
> 如果构造函数返回非原始值，则该返回值成为整个 new 表达式的结果。否则，如果构造函数未返回任何值或返回了一个原始值，则返回实例。（通常构造函数不返回值，但可以选择返回值，以覆盖正常的对象创建过程。）

new的关键点在于，它新建了一个实例对象，同时引入了原型，改变了构造函数的this指向，让实例对象成为了这个构造函数的构造结果

## class

class是es6新增的语法糖，它简化了js中构造类的步骤，隐去了对原型的操作（根本上还是原型的操作），js中的类是基于原型的，使用原型达到继承的效果，

```javascript
// --- ES6 class 写法 ---
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

// --- ES5 原型写法 ---
function PersonES5(name) {
  this.name = name;
}
PersonES5.prototype.sayHello = function () {
  console.log(`Hello, I'm ${this.name}`);
};
```

- 1、constructor 是一个构造函数，创建对象时会自动调用。即使你不写，它也默认存在。
- 2、所有写在 constructor 中的属性都是实例属性，是定义在实例中的。那么相对的，在 constructor 之外的属性，都是定义在类中的，也就是原型属性。
- 3、this 指向的是调用的实例对象，静态方法指向类本身。
- 4、子类使用构造器时，必须使用 super 关键字来扩展构造器，并且需要先调用 super。
- 5、子类会覆盖父类同名属性/方法，这与原型优先级一致。如果需要使用父类属性/方法，使用 super 关键字。
- 6、使用 static 关键字标明类属性/方法，它们无法在实例中使用，而是通过类直接调用的。

supper

### 1. `constructor`：构造函数

`constructor` 是类中的一个特殊方法，当你使用 `new` 关键字创建类的实例时，`constructor` 会被自动调用。

**主要作用：**

1.  **初始化实例的属性**：给 `this` 添加属性。
2.  **返回实例对象**：默认返回 `this`。如果你返回了一个对象，那么 `new` 表达式的结果就是这个返回的对象。

**案例：**

```javascript
class Cat {
  constructor(name, age, fn) {
    this.name = name;
    this.age = age;
    this.action = fn;
  }
  miao() {
    console.log("喵喵");
  }
  static species = ["China", "Japan", "Usa"];
  static run() {
    console.log("running");
  }
}

const myCar = new Car("Tesla", "Model 3", 2023);
console.log(myCar);
```

---

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1760236201160.png"/>

### 2. `super`：调用父类

`super` 用于**访问和调用一个对象的父对象上的函数**。它的使用场景有两种：

#### 场景一：在子类的 `constructor` 中调用父类的 `constructor`

**为什么必须这样做？**

- 子类没有自己的 `this` 对象，它的 `this` 是继承自父类的。
- 因此，在子类的 `constructor` 中，必须先通过 `super()` 调用父类的构造函数，来完成 `this` 的创建和初始化。
- **规则**：在子类的 `constructor` 中，`this` 的使用必须在 `super()` 调用之后。

#### 场景二：在子类方法中调用父类的同名方法

当你在子类中重写了父类的一个方法后，如果你还想调用父类的那个原始方法，可以使用 `super.miao()`。

**案例：**

```javascript
class ChinaCat extends Cat {
  constructor(name, age, fn, type) {
    super(name, age, fn);
    this.type = type;
  }
  sport() {
    super.miao();
    console.log("翻滚");
  }
  static sit() {
    console.log(super.species);
    console.log("坐下");
  }
}
// 子类 派生类
// 父类 基类

const myChinaCat = new ChinaCat("馒头", 3, function () {
  console.log("乖小猫");
});
myChinaCat.action();
// 打印实例对象
console.log(myChinaCat);
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/Snipaste_2025-10-12_10-35-40.png"/>

> myChinaCat → ChinaCat.prototype → Cat.prototype → Object.prototype → null

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/class.jpg"/>

### 总结

| 关键字            | 角色           | 核心功能                                                                     | 关键点                                          |
| :---------------- | :------------- | :--------------------------------------------------------------------------- | :---------------------------------------------- |
| **`class`**       | **语法糖**     | 简化对象和继承的创建，基于原型。                                             | 让代码更清晰，更易于理解和维护。                |
| **`constructor`** | **构造函数**   | 初始化新创建的实例对象。                                                     | 使用 `new` 时自动调用，负责设置 `this` 的属性。 |
| **`super`**       | **父类调用器** | 1. 在子类构造函数中调用父类构造函数。<br>2. 在子类方法中调用父类的同名方法。 | **必须在子类构造函数中 `this` 使用前调用**。    |
