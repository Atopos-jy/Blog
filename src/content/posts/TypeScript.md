---
title: TypeScript知识点梳理
published: 2026-01-26
tags: [前端, TypeScript]
category: TS
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1769432243325.png
description: TypeScript是带静态类型检查的JS超集，用类型注解、接口、类、泛型等约束代码，编译阶段发现错误，提升大型项目可维护性。
pinned: false
draft: false
---

# 从JS到TS：零基础入门TypeScript，一篇吃透核心知识点

作为前端开发者，你是否曾因 JavaScript 的“随心所欲”踩过坑？比如变量类型突然变化导致运行时报错、接手大型项目时看不懂参数类型、团队协作时因类型不统一产生 bug……TypeScript（简称 TS）作为 JavaScript 的超集，完美解决了这些痛点。

本文会从「TS 与 JS 的核心区别」入手，梳理 TS 核心知识点，最后通过一个实战案例串联所有知识点，帮你快速上手 TS，也适合作为博客素材直接使用。

## 一、TypeScript vs JavaScript 核心区别

TS 不是替代 JS 的新语言，而是给 JS 加了“类型约束”的超集——所有合法的 JS 代码都是合法的 TS 代码，TS 最终会编译成 JS 运行。二者核心差异如下：

| 对比维度   | JavaScript                                     | TypeScript                                    |
| ---------- | ---------------------------------------------- | --------------------------------------------- |
| 类型系统   | 动态弱类型（运行时确定类型，变量可随意改类型） | 静态强类型（编译时确定类型，提前约束）        |
| 错误检测   | 运行时才暴露错误（比如上线后才发现类型错）     | 编译阶段就发现错误（提前规避 bug）            |
| 运行环境   | 直接运行在浏览器/Node.js                       | 需通过 `tsc` 编译成 JS 后运行                 |
| 语法扩展   | 仅原生语法（无接口、泛型等）                   | 新增接口、泛型、枚举、访问修饰符等            |
| 工程化支持 | 大型项目易维护性差，IDE 提示弱                 | 天然适配大型项目，VS Code 等 IDE 智能提示拉满 |

## 二、TypeScript 核心知识点梳理

TS 的核心是「类型约束」，所有知识点都围绕“给代码加类型规则”展开，以下是新手必学的核心点：

### 1. 最基础：类型注解

给变量、函数参数/返回值标注“类型”，是 TS 最基础的用法，也是和 JS 最直观的区别。

```typescript
// JS 写法：无类型约束，变量可随意改类型
let name = "张三";
name = 123; // 不报错，但逻辑上不合理

// TS 写法：加类型注解，约束类型
let name: string = "张三";
name = 123; // 编译报错：Type 'number' is not assignable to type 'string'

// 函数参数/返回值注解
function add(a: number, b: number): number {
  return a + b; // 强制返回数字，返回字符串会报错
}
```

### 2. 基础类型：扩展 JS 原生类型

TS 兼容 JS 所有原始类型（`string/number/boolean/null/undefined/symbol`），还新增了实用类型：

- **数组**：两种写法，约束数组元素类型
  ```typescript
  let strArr: string[] = ["学习TS", "写博客"]; // 推荐
  let numArr: Array<number> = [1, 2, 3]; // 泛型写法
  ```
- **元组**：固定长度和类型的数组（比如坐标、键值对）
  ```typescript
  let position: [number, number] = [100, 200]; // 只能是两个数字
  position.push(300); // 允许追加（TS 小坑），但访问 position[2] 会报错
  ```
- **枚举**：给一组常量起名字，避免“魔法值”
  ```typescript
  enum TodoStatus {
    Unfinished = 0,
    Completed = 1,
  }
  let status: TodoStatus = TodoStatus.Completed; // 语义化更强
  ```
- **any**：关闭 TS 类型检查（尽量少用，仅过渡时用）
  ```typescript
  let temp: any = "hello";
  temp = 123; // 不报错，等同于 JS 无约束
  ```
- **void**：函数无返回值
  ```typescript
  function logMsg(): void {
    console.log("TS 知识点"); // 无 return 或 return undefined
  }
  ```

### 3. 接口（Interface）：约束对象结构

JS 没有“接口”概念，TS 用接口定义对象的“形状”（属性名、类型、是否可选/只读），是前端开发中最常用的 TS 特性之一。

```typescript
interface Todo {
  id: number | string; // 联合类型：id 可以是数字或字符串
  content: string; // 必选属性
  completed: boolean; // 必选属性
  createTime?: string; // 可选属性（加 ?）
  readonly author: string; // 只读属性（不可修改）
}

// 符合接口的对象
const todo: Todo = {
  id: 1,
  content: "学习接口",
  completed: false,
  author: "前端开发者",
};

todo.author = "新手"; // 编译报错：只读属性不能修改
```

### 4. 类型别名（Type Alias）：灵活的类型封装

和接口类似，但比接口更灵活（可定义联合类型、交叉类型等），二者核心区别：接口侧重“对象结构”，类型别名侧重“类型复用”。

```typescript
// 定义联合类型别名
type ID = number | string;
// 定义对象类型别名
type User = {
  name: string;
  age: number;
};
// 交叉类型：合并多个类型
type AdminUser = User & { role: string };
```

### 5. 类（Class）：新增访问修饰符

TS 给 JS 类新增了 `public/private/protected` 修饰符，实现属性封装，避免外部随意修改类内部数据。

```typescript
class TodoManager {
  public version: string = "1.0"; // 公有的（默认），外部可访问
  private todos: Todo[] = []; // 私有的，仅类内部可访问
  protected nextId: number = 1; // 受保护的，类内部和子类可访问

  // 获取待办列表（通过方法暴露私有属性，避免直接修改）
  getTodos(): Todo[] {
    return [...this.todos]; // 返回副本，而非原数组
  }
}

const manager = new TodoManager();
console.log(manager.version); // 正常访问
console.log(manager.todos); // 编译报错：private 属性外部不可访问
```

### 6. 泛型（Generic）：解决类型复用问题

泛型是 TS 进阶核心，核心作用：让“类型也能传参”，避免重复定义相似类型。比如封装一个“返回任意类型数组”的函数：

```typescript
// 泛型函数：T 是类型参数，调用时指定具体类型
function wrapValue<T>(value: T): T[] {
  return [value];
}

// 调用时指定类型：T = string
const strArr = wrapValue<string>("学习泛型");
// 自动推导类型：T = number
const numArr = wrapValue(123);
```

### 7. 类型守卫：缩小类型范围

当变量是“联合类型”时，TS 无法确定具体类型，类型守卫（`typeof/instanceof`）可帮 TS 精准判断类型。

```typescript
function handleId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.length); // TS 知道这里 id 是 string
  } else {
    console.log(id.toFixed(2)); // TS 知道这里 id 是 number
  }
}
```

## 三、实战案例：TS 实现 TodoList 核心功能

用一个前端高频场景（待办事项）串联所有知识点，对比 JS 版本，你会直观感受到 TS 的优势。

### 需求

实现 TodoList 核心功能：添加待办、删除待办、切换待办状态，要求用 TS 约束所有类型，避免类型错误。

### 步骤 1：定义核心类型（接口 + 类型别名）

```typescript
//定义接口
interface Todo {
  id: number | string;
  content: string;
  completed: boolean;
}

//定义代办器类型接口
interface ITodoManager {
  addTodo: (content: string) => void;
  createTodoItem: (todo: Todo) => void;
  deleteTodoItem: (id: number | string) => void;
}
```

### 步骤 2：封装 TodoManager 类（访问修饰符 + 函数类型）

```typescript
class TodoList implements ITodoManager {
  //Array 是 TS 泛型 必须明确数组里面存什么类型
  //private todos: Array = []; 写法错误
  //private todos: Todo[] = [];
  private todos: Array<Todo> = [];
  private nextId: number = 1;
  //todo-list容器
  private element: HTMLElement;
  //代办列表
  private ul: HTMLElement;
  //点击添加按钮
  private button: HTMLElement;
  //输入框
  private input: HTMLInputElement;

  constructor() {
    const container = document.querySelector(".todo-container");
    if (!container) throw new Error("未找到 .todo-container 容器");
    this.element = container as HTMLElement;

    //获取 ul
    const todoListUl = this.element.querySelector(".todo-list") as HTMLElement;
    if (!todoListUl || todoListUl.tagName !== "UL") {
      throw new Error("未找到 .todo-list 列表");
    }
    this.ul = todoListUl;

    //获取按钮
    const addBtn = this.element.querySelector(".add-btn");
    if (!addBtn) throw new Error("未找到 .add-btn 按钮");
    this.button = addBtn as HTMLElement;

    //获取输入框
    const todoInput = this.element.querySelector(".todo-input");
    if (!todoInput) throw new Error("未找到 .todo-input 输入框");
    this.input = todoInput as HTMLInputElement;

    // 初始化事件绑定
    this.init();
  }

  init() {
    this.button.addEventListener("click", () => {
      // 从输入框获取内容，调用 addTodo
      this.addTodo(this.input.value);
    });

    // 输入框回车事件（触发添加）
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.addTodo(this.input.value);
      }
    });
  }

  addTodo(content: string): void {
    if (!content.trim()) {
      alert("请输入代办项");
      return;
    }
    const newTodo: Todo = {
      id: this.nextId++,
      content: content.trim(),
      completed: false,
    };
    this.todos.push(newTodo);
    this.createTodoItem(newTodo);
    this.input.value = "";
  }

  createTodoItem(todo: Todo): void {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id.toString();
    if (todo.completed) {
      li.classList.add("todo-item-completed");
    }
    li.innerHTML = `
    <!-- 可选：完成状态复选框 -->
    <input type="checkbox" class="toggle-btn" ${todo.completed ? "checked" : ""}>
    <!-- 待办内容 -->
    <span class="todo-content">${todo.content}</span>
    <!-- 删除按钮 -->
    <button class="todo-delete-btn">
      <i class="delete-btn"></i> 删除
    </button>
  `;

    const deleteBtn = li.querySelector(".todo-delete-btn") as HTMLElement;
    deleteBtn.addEventListener("click", () => {
      this.deleteTodoItem(todo.id);
      li.remove();
    });

    const checkbox = li.querySelector(".toggle-btn") as HTMLInputElement;
    checkbox.addEventListener("change", () => {
      this.finishTodoItem(todo.id, checkbox.checked);
    });

    this.ul.appendChild(li);
  }

  deleteTodoItem(id: number | string): void {
    this.todos = this.todos.filter((item) => item.id !== id);
  }

  finishTodoItem(id: number | string, isChecked: boolean): void {
    const targetTodo = this.todos.find((item) => item.id === id);
    console.log(targetTodo);

    if (targetTodo) {
      targetTodo.completed = isChecked;
    }
    const li = this.ul.querySelector(`[data-id="${id}"]`) as HTMLElement;
    console.log(li);

    if (li) {
      const todoContent = document.querySelector(
        ".todo-content",
      ) as HTMLElement;
      todoContent.classList.toggle("todo-item-completed", isChecked);
    }
  }
}
```

### 步骤 3：使用 TodoManager（类型守卫 + 泛型）

```typescript
import TodoList from "./modules/script.js";

window.addEventListener("DOMContentLoaded", () => {
  new TodoList(); // 此时 HTML 所有元素都已解析，能找到 .add-btn/.todo-input
});
```

### 案例对比 JS 版本的优势

如果用纯 JS 实现这个 TodoList，可能出现以下问题：

- 给 `addTodo` 传数字（比如 `addTodo(123)`），JS 不报错，但逻辑错误；
- 给 `deleteTodo` 传布尔值（比如 `deleteTodo(true)`），运行时才发现过滤逻辑失效；
- 直接修改 `todos` 数组（比如 `manager.todos = []`），破坏类的封装性；

而 TS 编译阶段就会发现这些问题，提前规避 bug，且代码语义化更强，接手项目时能快速看懂每个参数/属性的类型。

https://github.com/Atopos-jy/todo-list_ts.git 代码仓库

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1769432243325.png"/>

## 四、总结

1. TS 是 JS 的超集，核心优势是**静态类型检查**，编译阶段发现错误，提升大型项目可维护性；
2. TS 核心知识点围绕“类型约束”展开：类型注解、接口/类型别名（约束对象）、泛型（类型复用）、类的访问修饰符（封装）是前端高频使用的特性；
3. 初学 TS 无需追求“零 any”，可先用类型注解和接口覆盖核心逻辑，逐步过渡到泛型等进阶特性。

最后小提示：TS 不是“银弹”，小型项目用 JS 足够，中大型项目/团队协作场景下，TS 才能发挥最大价值。
