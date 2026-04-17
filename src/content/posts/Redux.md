---
title: Redux
published: 2026-03-02
tags: [前端, Redux]
category: 分类
description: 文章描述
pinned: false
draft: false
---

## 初识Redux

### 1.Redux相关工具

- Redux：核心状态管理库，定义了状态管理的规则和核心概念；
- React-Redux：Redux 与 React 框架的绑定工具，让 React 组件能轻松使用 Redux 的状态；
- Redux Toolkit：官方推荐的现代 Redux 工具，简化 Redux 代码编写（避免繁琐的样板代码）；
- Redux DevTools 扩展：浏览器插件，可查看 Redux 状态变化、追踪每一步操作，方便调试。

### 2.Redux的三个概念

Redux把整个数据修改的流程分成了三个核心概念，分别是：state、action和reducer

1.state - 一个对象 存放着我们管理的数据状态，举个例子：计数器的 state 可以是`{ value: 0 }`，只存放“计数数值”这一个状态。

2.action - 一个对象 用来描述你想怎么改数据

核心格式：必须包含 `type` 属性（描述操作类型，比如“增加计数”“减少计数”），可选 `payload` 属性（传递修改所需的数据）。

举个例子：想让计数器加 1，action 就是 `{ type: 'counter/increment' }`；想让计数器加 5，action 就是 `{ type: 'counter/incrementByAmount', payload: 5 }`。

3.reducer - 一个函数 根据action的描述生成一个新的state

核心逻辑：接收两个参数（prevState：原来的状态，action：要执行的操作），判断 action 的 type，对 prevState 进行处理，最终返回新的 state。

**为什么 Redux 不允许直接修改 state，非要通过 action + reducer 的方式生成新的 state 呢？**

直接修改 state 无法记录操作轨迹，调试时找不到哪里改了状态；通过 action + reducer，每一步修改都有记录，出错了能快速定位

注意：reducer 不能直接修改原来的 state，必须返回一个新的 state（Redux Toolkit 会帮我们简化这一步，后续会讲）。

### 3.通俗类比

| Redux 概念 | 图书馆类比                                               |
| ---------- | -------------------------------------------------------- |
| Store      | 图书馆总服务台（存放所有书籍 / 状态）                    |
| Action     | 借书申请单（描述 “要做什么”：比如 “借《Redux 实战》”）   |
| Reducer    | 图书管理员（根据申请单处理：确认库存、登记、把书给读者） |
| Dispatch   | 提交申请单（把 Action 发送给 Store）                     |

#### 对应上“用户点击计数器加1”的操作，对应图书馆的哪一步流程吗？

用户点击按钮（你去图书馆）→ 组件创建 action（填申请单）→ dispatch action（交申请单）→ reducer 处理（管理员找书）→ Store 更新 state（库存更新）→ 组件重新渲染（你拿到书）

## Vuex 、Pina、Redux之间的区别

### 1.Vue2状态管理Vuex

Vue 2 时代的官方状态管理工具，核心是“模块化管理”，支持 getter、mutation、action，与 Vue 深度绑定；

- `State（状态）`:Vuex 使用单一状态树，即一个对象包含全部的应用层级状态。这个状态树对应着一个应用中的所有状态。
- `Getters（获取器）`:Getters 允许你在模板中计算状态。相当于组件中的计算属性。可以对 state 中的数据进行处理和过滤。
- `Mutations（变更）`:Mutations 是 Vuex 修改状态的唯一方式，它们是同步事务。每个 mutation 都有一个字符串类型的事件类型 (type) 和 一个回调函数，该回调函数接受 state 作为其第一个参数。
- `Actions（动作）`:Actions 类似于 Mutations，不同之处在于它们是异步的。Actions 提交 Mutations 来修改状态。Actions 可以包含任意异步操作。
- `modules（模块）`：Vuex 允许将 store 分割成模块，每个模块都有自己的 state、mutations、actions、getters。

核心特点：**State 可通过 Mutation 同步修改**，异步操作必须写在 Action 中，再由 Action 触发 Mutation，不能直接在 Action 中修改 State。

关键规则：Mutation 必须是同步函数，Action 可包含异步逻辑（比如接口请求）。

#### Vuex版“用户点击计数器+1”操作，数据流动过程

用户点击"借书" → 组件创建action（填写借书单）→ dispatch action（提交借书单，交前台）→  action调用 → commit（前台转交管理员）→ mutation处理（管理员找书）→ Store更新state（更新库存记录）→ 组件重新渲染（你拿到书，屏幕更新）

#### 为什么有了Vuex之后又引入了Pinia

1.嵌套结构

Vuex 强制要求按 `state`、`mutations`、`actions`、`getters`、`modules` 分层组织代码，且修改 state 必须通过 `mutations`（同步）+ `actions`（异步）的固定流程，即使是简单的状态修改也需要写大量模板代码。

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/Vuex.png"/>

```javascript
// Vuex 写法
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    ADD_COUNT(state, num) {
      state.count += num;
    },
  },
  actions: {
    async addCount({ commit }, num) {
      const res = await fetch("/api/getNum"); // 异步操作
      commit("ADD_COUNT", res.data + num);
    },
  },
});
```

2.TypeScript支持差

3.模块化设计复杂

4.与 Vue 3 组合式 API（Composables）适配差

Pinia流程图

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/Pinia.png"/>

```javascript
// Pinia 写法
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  actions: {
    async addCount(num) {
      const res = await fetch("/api/getNum");
      this.count += res.data + num; // 直接修改 state，无需 mutation
    },
  },
});
```

推荐博客：[https://blog.csdn.net/x15514104477/article/details/149488350](https://blog.csdn.net/x15514104477/article/details/149488350?fromshare=blogdetail&sharetype=blogdetail&sharerId=149488350&sharerefer=PC&sharesource=2401_85011172&sharefrom=from_link)

### 2.Vue3状态管理Pinia

Vue 3 时代的官方推荐状态管理工具，替代 Vuex，语法更简洁，支持 Composition API，无需手动注册模块，使用更灵活。

- `State（状态）`： 在 Store 中定义的数据，即应用程序的状态。状态可以是基本类型、对象、数组等。
- `Actions（操作）`： 在 Store 中定义的用于操作状态的函数。Actions 可以是同步或异步的，通过 this，你可以直接修改状态。如果 actions 返回一个 Promise，Pinia 将等待 Promise 完成，然后再继续执行其他代码。
- `Getter（获取器）`：获取器允许你从状态中派生出一些衍生数据，类似于计算属性。通过 getters，你可以在不直接修改状态的情况下获取和处理状态的数据。

核心特点：**抛弃 Mutation**，Action 可直接处理同步 / 异步逻辑，直接修改 State（底层基于 Vue 响应式，无需像 Redux 那样返回新 State）。

关键规则：无严格的 “纯函数” 要求，写法更贴近 Vue 原生响应式，学习成本最低。

- **Vuex**：核心是 “单根 Store + 嵌套 modules”，多模块依赖命名空间管理，层级越深越繁琐；

**Pinia**：核心是 “多独立平级 Store”，每个 Store 都是单独实例，无需嵌套和命名空间，调用 / 维护更简单；

#### Pinia版“用户点击计数器+1”操作，数据流动过程

用户点击 → 调用action（呼叫全能管理员） → action直接改state（管理员一站式服务） → 更新 → 渲染

### 3.React状态管理Redux

适用于 React 项目（也可用于其他框架），核心是“单向数据流”，需要手动编写较多样板代码（Redux Toolkit 可简化），社区生态成熟；

- `Provider`：把父组件传递进来的store对象放入react 上下文中，这样connect组件就可以从上下文中获取到store对象
- `combineReducer`：store.state进行分片管理，每个reducer管理state中的一部分。由于createStore只接受一个reducer，所以采用该方法生成一个最终的reducer
- `中间件（Middleware）`:中间件是一个位于动作派发和 Reducer 之间的拦截层。它允许你在动作被派发到 Reducer 之前执行额外的逻辑。
- `State`：整个 Redux 应用程序的状态，它是只读的。状态的更新是通过触发动作来创建新的状态，而不是直接修改原有状态。
- `action`：更新state的状态时用。
- `dispatch`：触发store修改state的命令，是createStore返回对象的一个方法
- `connect`：从react上下文中取出store对象，订阅store.state的变化，当store state变化时调用自身的方法重新生成connect组件的state,被包装组件便会被重新渲染。不会感知到store的存在，dispatch在这里也是非必须的。
- connect的4个内置组件： 状态mapStateToProps、动作mapDispatchToProps、属性合并mergeProps 和 配置项options
- `异步中间件`：redux没有直接提供执行异步操作的方法，需要手动集成中间件，最常用异步实现的中间件有redux-thunk、redux-saga

核心特点：**State 只读**，必须通过「Action 描述 + Reducer 纯函数」生成新 State，全程单向，无任何 “直接修改” 的可能（Redux Toolkit 只是简化写法，底层仍遵循）。

关键规则：Reducer 不能有副作用（比如异步请求），异步逻辑需通过 Thunk 等中间件处理

#### Redux 和它们Vue中框架中的仓库管理工具的区别是什么吗？

![Redux.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1GXn45K1bA1KDqDQ/img/c20859b5-ac08-4185-a87e-6dc8fbb7d598.png)

Pinia 简化了——抛弃了 Mutation，不用再区分同步/异步的不同写法；Redux 和它们最核心的区别——State 只读，必须通过 reducer 返回新状态，而 Vuex/Pinia 可直接修改 State

| 维度       | Redux                                                                           | Vuex/Pinia                                                                             |
| ---------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 框架耦合性 | 与 React 解耦（可适配任意框架），需手动绑定 React 视图                          | 与 Vue 深度耦合，天然适配 Vue 响应式系统                                               |
| 核心目标   | 强调 “可预测性”，强制严格的状态变更流程                                         | 强调 “易用性”，适配 Vue 开发习惯，简化流程                                             |
| 响应式实现 | 无内置响应式，需依赖 React 组件重渲染或中间件（如 Redux Toolkit + React-Redux） | 基于 Vue 原生响应式系统（Object.defineProperty/Vue 3 Proxy），状态变更自动触发视图更新 |

#### 核心对比

通用单向数据流核心：`State → View → Actions → State`，是所有方案的底层逻辑；

- Vuex 扩展流程：`State → View → Actions → Mutations → State`，多一层 Mutations 保证严格性

- Pinia 简化流程：`State → View → Actions → State`，去掉 Mutations 更简洁，仍遵循单向原则
- Redux 流程核心是 `State → View → Actions → Reducer → State`，对应 Vuex 的 Mutations 层是 Reducer，且约束更严格（纯函数 + 不可变数据）

## Redux的基础使用

### 1.安装依赖

```shell
npm i @reduxjs/toolkit react-redux
```

### 2.创建Redux Store全局状态中心

Redux **store** 汇集了构成应用程序的 state、actions 和 reducers。store 有以下几个职责:

- 在内部保存当前应用程序 state
- 通过 [`store.getState()`](https://cn.redux.js.org/api/store#getState) 访问当前 state;
- 通过 [`store.dispatch(action)`](https://cn.redux.js.org/api/store#dispatch) 更新状态;
- 通过 [`store.subscribe(listener)`](https://cn.redux.js.org/api/store#subscribe) 注册监听器回调;
- 通过 [`store.subscribe(listener)`](https://cn.redux.js.org/api/store#subscribe) 返回的 `unsubscribe` 函数注销监听器。

store/index.js

```shell
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

### 3.编写Redux（状态处理修改）

[https://cn.redux.js.org/introduction/getting-started/](https://cn.redux.js.org/introduction/getting-started/)Redux中文文档

原生Redux

```javascript
// 第一步：定义 action type 常量（RTK 会自动基于 name + reducer 名生成，原生需手动定义）
const INCREMENT = "counter/increment";
const DECREMENT = "counter/decrement";
const INCREMENT_BY_AMOUNT = "counter/incrementByAmount";

// 第二步：创建 Action Creator（RTK 会自动生成，原生需手动写）
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
export const incrementByAmount = (payload) => ({
  type: INCREMENT_BY_AMOUNT,
  payload, // 携带要增加的数值
});

// 第三步：定义初始状态（和 RTK 的 initialState 一致）
const initialState = {
  value: 0,
};

// 第四步：编写 Reducer（原生需手动处理不可变数据，不能直接修改 state）
export const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      // 原生 Redux 必须返回新对象（不可变），不能像 RTK 那样直接 state.value +=1
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    case INCREMENT_BY_AMOUNT:
      return { ...state, value: state.value + action.payload };
    default:
      // 无匹配的 action type 时返回原状态
      return state;
  }
};

// （可选）如果需要像 RTK 一样导出所有 action creators（方便组件使用）
export const counterActions = {
  increment,
  decrement,
  incrementByAmount,
};
```

用 Redux Toolkit 提供的 createSlice 来编写 reducer，它会自动帮我们生成 action 和 reducer，避免手动编写繁琐代码（这就是 Redux Toolkit 的优势，不用自己写大量样板代码）。

在项目中创建 store/modules/counter.ts 文件，编写同步逻辑（最基础的增删改）

```javascript
// 引入 createSlice（用于创建切片，包含 reducer 和 action）
import { createSlice } from "@reduxjs/toolkit";
export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // 并不是真正的改变 state 因为它使用了 immer 库
      // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的
      // 不可变的 state
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});
```

**补充说明**：在原生 Redux 中，我们必须写 `return { ...state, count: state.count + 1 }`。而 RTK 允许我们写 `state.count++`，是因为它内置了 **Immer** 库，在底层自动帮我们生成了新的对象。**这并不是直接修改，而是“看起来像直接修改”的语法糖。**

### 4.在React项目中引入Store

创建好 Store 后，需要让整个 React 项目都能访问到 Store，我们在项目入口文件（index.js）中，用 React-Redux 提供的 Provider 组件包裹整个 App，相当于“给整个项目铺了一条通往 Store 的路”，所有组件都能通过这条路访问到 Store。

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//引入创建好的Store
import store from "./app/store";
//引入Provider组件(用于向所有子组件提供Store)
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

[请至钉钉文档查看附件《ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif》](https://alidocs.dingtalk.com/i/nodes/0eMKjyp814yrAKBmuKDdMeA3JxAZB1Gv?cid=67648796305&corpId=dinge3d499868696289affe93478753d9884&doc_type=wiki_doc&iframeQuery=anchorId%3DX02mm74pp2cin3z3ey4m8&utm_medium=im_card&utm_scene=person_space&utm_source=im)

### 5.组件中使用Redux状态和操作

- `useSelector`：从 Store 中获取需要的 state；
- `useDispatch`：获取 dispatch 方法，用于发送 action，触发状态修改

```javascript
// 引入所需的钩子和 action
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "./counterSlice";

function Counter() {
  // 1. 获取 Store 中的 counter 状态（value 字段）
  const count = useSelector((state) => state.counter.value);
  // 2. 获取 dispatch 方法
  const dispatch = useDispatch();

  return (
    <div>
      <h1>计数器：{count}</h1>
      // 点击按钮，dispatch 对应的 action，触发状态修改
      <button onClick={() => dispatch(decrement())}>减 1</button>
      <button onClick={() => dispatch(increment())}>加 1</button>
      // 传递 payload（比如加 5）
      <button onClick={() => dispatch(incrementByAmount(5))}>加 5</button>
    </div>
  );
}
```

- 初始启动：
  - 使用最顶层的 root reducer 函数创建 Redux store
  - store 调用一次 root reducer，并将返回值保存为它的初始 `state`
  - 当视图 首次渲染时，视图组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便他们可以知道 state 是否已更改。

- 更新环节：
  - 应用程序中发生了某些事情，例如用户单击按钮
  - dispatch 一个 action 到 Redux store，例如 `dispatch({type: 'counter/increment'})`
  - store 用之前的 `state` 和当前的 `action` 再次运行 reducer 函数，并将返回值保存为新的 `state`
  - store 通知所有订阅过的视图，通知它们 store 发生更新
  - 每个订阅过 store 数据的视图 组件都会检查它们需要的 state 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页

**1.Store：集中状态管理中心**

**3.action：一个工厂函数，负责产生action对象**

**4.dispatch：派发action，方法使用了**中间件 **机制**

**5.Reducer：处理action，再把处理完成后的newState返回给Store**

## 异步逻辑（简单了解，不用深入）

实际项目中，我们经常需要异步操作（比如请求接口获取数据），Redux 本身不支持异步，但可以通过 **thunk**（Redux Toolkit 已内置，无需额外安装）实现异步逻辑。

thunk 是一种特殊的 Redux 函数，核心是“允许在函数中包含异步逻辑”，它由两个函数组成：

- 内部 thunk 函数：接收 dispatch 和 getState 作为参数，可在里面编写异步操作（比如接口请求）；
- 外部创建者函数：创建并返回这个内部 thunk 函数。

```javascript
// 基于 Redux Toolkit 的 thunk 异步函数
export const fetchUser = () => {
  // 内部 thunk 函数：接收 dispatch/getState
  return async (dispatch, getState) => {
    // 1. 异步操作：请求接口
    const res = await fetch("/api/user");
    const user = await res.data();

    // 2. 异步完成后，dispatch 同步 action 修改状态
    dispatch({ type: "user/setUser", payload: user });
  };
};

// 组件中使用（和调用普通 action 一样）
dispatch(fetchUser());
```

后续`**createAsyncThunk**`可用使用这个函数

## React中状态管理框架（简单了解，不用深入）

[**React 中的状态管理：Redux、Redux Toolkit、MobX、MobX Lite、Zustand 和 useContext 的比较**](https://medium.com/@alatif.bwp/state-management-in-react-comparing-redux-redux-toolkit-mobx-mobx-lite-zustand-and-usecontext-187ce041427e)

![对比.webp](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1GXn45K1bA1KDqDQ/img/b205ef82-fdc6-4d8c-b697-f0c9010e2384.webp)

## 总结

本次分享，大家只要记住以下 3 点，就掌握了 Redux 的核心框架，后续实际开发中，跟着“安装 → 创建 Store → 编写 reducer → 组件使用”的步骤，就能快速上手：

1.  Redux 是 React 项目的“集中式状态管理工具”，核心解决“多组件共享状态、状态传递繁琐”的问题；
2.  核心三要素：state（存状态）、action（描述操作）、reducer（处理操作，返回新状态），核心流程是“组件 dispatch action → reducer 处理 → Store 更新 state → 组件重新渲染”，全程单向数据流；
3.  实际开发中，用 Redux Toolkit 简化代码，用 React-Redux 绑定 React 组件，不用手动编写大量样板代码，新手也能快速上手。
