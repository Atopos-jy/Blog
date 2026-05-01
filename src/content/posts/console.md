---
title: console
published: 2025-9-21
tags: [console]
category: 工具
cover: https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/三个模块.png
description: 文章描述
pinned: false
draft: false
---

# 探索 JavaScript 调试的利器：浏览器控制面板与核心调试方法

在 JavaScript 开发的世界里，代码运行时的“黑盒”常常让开发者对程序的执行过程感到困惑。为什么预期的结果没有出现？变量的值为何异常？函数调用栈是怎样的？好在，现代浏览器为我们提供了强大的调试工具——控制面板，它就像一把钥匙，能帮我们打开代码运行的“黑盒”，看清其中的奥秘。同时，JavaScript 本身也提供了多种调试手段，如 `debugger`、`try...catch`、断点以及 `console.log`。接下来，我们先深入了解浏览器控制面板的组成，为后续掌握各类调试方法奠定基础。

1：直接电脑上按F12

2:在浏览器上右键点击“检查”

这是是Chrome浏览器的开发者工具界面

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/开发者界面.png"/>

source面板主要由三个部分组成

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/三个模块.png"/>

- 文件导航区：页面请求的所有文件都会在此列出；
- 代码编辑区：当我们从文件导航栏中选取一个文件时，该文件的内容就会在此列出，我们可以在这里编辑代码；
- Debugger区：这里会有很多工具可以用来设置断点，检查变量值、观察执行步骤等。

在JavaScript中，常见的调试方法有`console.log`调试、断点调试和`try...catch`捕获错误，它们各有特点，适用于不同的场景，以下是详细讲解：

Elements页面，右侧栏的功能

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/功能.png"/>

network

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/network.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/细分.png"/>

- Header：请求url、HTTP方法、响应状态码、请求头和响应头及它们各自的值、请求参数等
- Preview：预览面板，用于资源的预览
- Response：响应信息面板包含资源还未进行格式处理的内容
- Timing：资源请求的详细信息花费时间
- Cookies:身份

sources（源代码）

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/sources.png"/>

在熟悉了浏览器控制面板的组成后，我们自然会思考：如何快速验证代码中的变量状态或执行逻辑？此时，`console.log()` 作为最基础也最常用的调试方法，就成了开发者接触最早、使用最频繁的“入门级工具”。它无需复杂的面板操作，仅通过一行代码就能将关键信息输出到控制台，成为连接代码逻辑与开发者的“第一座桥梁”。

### console.log调试

`console.log`是最基础、简单的调试方式，它通过在代码中合适的位置插入`console.log`语句，将程序运行过程中变量的值、执行步骤等信息输出到控制台，方便开发者了解代码执行情况。

**使用方法**：在需要查看变量值或信息的地方，编写`console.log()`函数，将需要输出的内容作为参数传入。

```javascript
let num = 10;
console.log("num的值是:", num);

function add(a, b) {
  console.log("开始执行add函数，传入的参数a:", a, "，参数b:", b);
  return a + b;
}
let result = add(3, 5);
console.log("add函数的返回值是:", result);
```

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1758440158227.png"/>

**优势**：

- **简单易用**：不需要复杂的配置，直接在代码中添加语句即可。
- **灵活**：可以在代码的任何位置输出想要的信息，无论是变量、函数调用结果还是自定义的提示信息。
- **跨环境**：在浏览器环境、Node.js环境中都能使用。

**劣势**：

- **不够直观**：只能看到输出的信息，无法直观地看到代码执行流程和变量的变化过程。
- **代码侵入性**：调试完成后，需要手动删除或注释掉这些`console.log`语句，否则会影响性能，而且如果遗漏可能会导致生产环境出现不必要的输出。

当 `console.log()` 难以满足复杂场景的调试需求时，断点调试便成为更强大的选择。如果说 `console.log()` 是 “事后查看快照”，那么断点测试就是 “实时观察过程”—— 它允许我们在代码的特定位置 “按下暂停键”，让程序执行暂时冻结，从而细致入微地探查每一步的变量状态、执行路径和调用关系。

### 断点调试

断点调试是一种交互式的调试方式，开发者可以在代码中设置断点，程序执行到断点处会暂停，此时可以逐行执行代码，查看变量的值、调用栈等信息，从而分析代码的执行逻辑是否正确。

**在浏览器中设置断点的方法（以Chrome浏览器为例）**：

1. 打开Chrome浏览器并访问包含JavaScript代码的页面。
2. 按下`F12`打开开发者工具，切换到`Sources`面板。
3. 在左侧文件列表中找到要调试的JavaScript文件，点击文件名展开代码。
4. 在代码行号区域点击想要设置断点的行，该行会显示一个蓝色标记，表示断点已设置。
5. 刷新页面或触发相关操作，程序执行到断点处会暂停，此时可以使用调试面板上的按钮（如`Step over`、`Step into`、`Step out` ）逐行执行代码，查看变量的值。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1758440384969.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1758440412238.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/9c93d509837b4e0f9c5341e9c9dc677b.png"/>

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1758440457551.png"/>

优势\*\*：

- **直观清晰**：可以直观地看到代码执行流程，以及每个变量在不同时刻的值，方便定位逻辑错误。
- **深入分析**：能够查看调用栈，了解函数的调用关系和顺序，对于复杂的代码逻辑调试非常有帮助。
- **动态调试**：可以在程序暂停时修改变量的值，观察对后续代码执行的影响。

**劣势**：

- **环境依赖**：需要特定的调试环境，如浏览器的开发者工具或Node.js的调试器，在一些生产环境中可能无法使用。
- **操作相对复杂**：对于初学者来说，调试工具的操作和理解需要一定的学习成本。

调试过程中，除了主动探查程序的正常执行流程，如何优雅地应对意外错误同样重要。`try...catch` 机制就像为程序穿上了一层 “防弹衣”，它不直接参与逻辑调试，却能在错误发生时精准捕获异常，防止程序崩溃并提供关键的错误信息，是保障代码健壮性的重要手段。

### `try...catch`捕获错误

`try...catch`语句用于捕获代码执行过程中抛出的异常，当`try`块中的代码发生错误时，程序会立即跳转到`catch`块中执行，开发者可以在`catch`块中对错误进行处理，比如输出错误信息、记录日志等。

**使用方法**：

```javascript
try {
  let num = 10 / 0; // 这里会抛出除零错误
  console.log("这行代码不会执行");
} catch (error) {
  console.log("捕获到错误:", error.message);
  // 可以在这里进行错误上报、提示用户等操作
}

function debugTest(input) {
  // 1. 用于console.log测试
  console.log("输入值:", input);
  console.log("输入类型:", typeof input);

  let result;
  // 2. 适合设置断点的位置（在此行设置断点可观察变量变化）
  const processedInput = input ? input.toString().trim() : "";

  try {
    // 3. try...catch测试（故意制造可能的错误）
    if (processedInput === "") {
      throw new Error("输入不能为空！");
    }
    result = processedInput.length * 2;

    // 适合设置断点的位置（查看result计算结果）
    console.log("处理结果:", result);
  } catch (error) {
    // 4. 错误捕获测试
    console.error("捕获到错误:", error.message);
    result = null;
  }

  return result;
}

// 测试调用
debugTest("test");
debugTest(""); // 会触发错误
debugTest(123);
```

**测试空输入（触发错误场景）**

```
// 调用2：输入空字符串
debugTest("");
```

**执行结果（控制台输出）**：

plaintext

```
输入值:
输入类型: string
捕获到错误: 输入不能为空！  // 被try...catch捕获的错误
```

**返回值**：`null`

**优势**：

- **错误处理**：能够有效地捕获并处理代码中的异常，避免因为一个错误导致整个程序崩溃，提高程序的稳定性和健壮性。
- **友好提示**：可以在`catch`块中对错误进行处理，给用户提供友好的错误提示信息，或者进行错误上报，方便后续排查问题。

**劣势**：

- **只能捕获运行时错误**：对于语法错误等在代码编译阶段就会报错的问题，`try...catch`无法捕获。
- **不够灵活**：只能针对`try`块中的代码进行错误捕获，无法像断点调试那样深入分析代码执行流程。

### 三种调试方式的区别总结

| 调试方式   | `console.log`调试                        | 断点调试                                 | `try...catch`捕获错误                          |
| ---------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| 基本原理   | 在代码中插入输出语句，将信息打印到控制台 | 在代码中设置断点，暂停程序执行，逐行分析 | 捕获代码执行过程中抛出的异常并进行处理         |
| 信息呈现   | 以文本形式输出到控制台                   | 在调试工具中直观显示变量值、调用栈等     | 捕获到异常后，可自定义处理方式，如输出错误信息 |
| 适用场景   | 简单查看变量值和执行步骤，快速定位问题   | 复杂逻辑调试，深入分析代码执行流程       | 处理运行时错误，提高程序稳定性                 |
| 代码侵入性 | 调试完成后需手动删除或注释相关语句       | 无代码侵入                               | 需添加`try...catch`代码块                      |
| 操作难度   | 简单                                     | 相对复杂，需学习调试工具使用             | 中等，需理解异常处理机制                       |

如果上面的代码调用debugger去测试的话

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1758441115693.png"/>

### 一、`debugger` 的基本用法

`debugger` 是一个关键字，使用时直接在代码中插入该语句，当浏览器或 JavaScript 引擎执行到此时，会自动暂停程序运行（前提是打开了开发者工具）。

示例代码：

```javascript
function calculateTotal(price, quantity) {
  // 插入debugger语句
  debugger;

  const total = price * quantity;
  return total;
}

calculateTotal(100, 3);
```

**使用步骤**：

1. 在代码中需要调试的位置添加 `debugger;` 语句。
2. 打开浏览器开发者工具（F12 或 Ctrl+Shift+I），切换到 **Sources** 面板。
3. 运行代码，程序会在 `debugger` 语句处暂停。

### 二、`debugger` 暂停后的操作

程序暂停后，开发者工具会显示当前代码位置，并提供一系列调试工具，核心功能包括：

#### 1. 观察变量和作用域

- 在 **Scope**（作用域）面板中，可以查看当前执行环境中的变量：
  - **Local**：当前函数内的局部变量（如示例中的 `price`、`quantity`、`total`）。
  - **Global**：全局变量（如 `window` 对象）。
- 鼠标悬停在代码中的变量上，会直接显示其当前值，快速验证变量是否符合预期。

#### 2. 控制程序执行流程

在开发者工具的调试工具栏中，有几个核心按钮控制执行：

- **继续执行（Resume）**：▶️ 按钮，点击后程序会继续运行，直到下一个断点或程序结束。
- **单步执行（Step over）**：▶️▶️ 按钮，执行当前行代码，然后暂停（如果下一行是函数调用，不会进入函数内部）。
- **单步进入（Step into）**：↩️ 按钮，执行当前行代码，如果下一行是函数调用，会进入函数内部继续调试。
- **单步跳出（Step out）**：↪️ 按钮，当前在函数内部时，执行完当前函数的剩余代码并跳出，回到调用该函数的位置暂停。
- **禁用断点（Deactivate breakpoints）**：⏸ 按钮，临时禁用所有断点，程序会正常执行。

#### 3. 查看调用栈（Call Stack）

在 **Call Stack** 面板中，可以看到当前函数的调用路径，例如：

- 如果 `calculateTotal` 被 `order` 函数调用，`order` 又被 `init` 函数调用，调用栈会显示：`calculateTotal` → `order` → `init`。
- 点击调用栈中的任意函数，可以跳转到该函数的执行位置，方便追溯代码执行的上下文。

#### 4. 监视表达式（Watch）

在 **Watch** 面板中，可以添加需要持续监控的表达式或变量，例如：

- 添加 `price * quantity` 表达式，程序暂停时会实时显示计算结果。
- 当变量或表达式的值变化时，会高亮显示，便于跟踪关键数据的变化。

### 三、`debugger` 与手动断点的区别

| 对比维度   | `debugger` 语句                  | 手动断点（在开发者工具中设置）          |
| ---------- | -------------------------------- | --------------------------------------- |
| 设置方式   | 直接写在代码中，属于代码的一部分 | 在开发者工具的 Sources 面板点击行号设置 |
| 生效条件   | 仅当开发者工具打开时才会暂停     | 无论是否打开开发者工具，设置后都会暂停  |
| 灵活性     | 需修改代码，适合固定调试场景     | 无需修改代码，可临时在任意行设置        |
| 代码侵入性 | 有（需删除或注释才能移除）       | 无（关闭开发者工具或删除断点即可）      |

**建议**：

- 临时调试且不想修改代码时，用手动断点；
- 调试逻辑固定（如复现特定bug）时，用 `debugger` 语句（需注意调试后删除，避免线上代码残留）。

### 四、`debugger` 的高级用法

#### 1. 结合条件判断使用

可以在 `debugger` 前添加条件，仅当满足条件时才触发暂停：

```javascript
function checkUser(user) {
  // 仅当用户年龄小于18时才暂停
  if (user.age < 18) {
    debugger;
  }
  // ...其他逻辑
}
```

#### 2. 在异步代码中使用

`debugger` 同样支持异步场景（如定时器、Promise）：

```javascript
setTimeout(() => {
  const data = "异步数据";
  debugger; // 会在定时器执行时暂停
  console.log(data);
}, 1000);
```

#### 3. 配合 `try...catch` 调试错误

在捕获错误后用 `debugger` 暂停，可查看错误发生时的上下文：

```javascript
try {
  // 可能出错的代码
  const result = JSON.parse(invalidJson);
} catch (error) {
  debugger; // 暂停并查看error详情和当前变量状态
  console.error("解析失败:", error);
}
```

### 五、注意事项

1. **线上环境慎用**：`debugger` 语句如果未删除，在用户打开开发者工具时会导致程序暂停，影响体验，建议通过构建工具（如Webpack）在生产环境自动移除。
2. **依赖开发者工具**：`debugger` 仅在打开开发者工具时生效，关闭工具后会被忽略，程序正常执行。
3. **性能影响**：频繁使用 `debugger` 会中断程序执行，调试完成后应及时清理。
