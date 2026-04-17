---
title: Vue3与Vite的区别
published: 2025-12-27
tags: [前端, Vue3]
category: 分类
description: 文章描述
pinned: false
draft: false
---

# 从Vue3与Vite的区别切入：详解Props校验与组件实例（附完整学习大纲）

很多前端初学者刚接触Vue3生态时，容易把“Vue3”和“Vite”混为一谈——有人以为Vite是Vue3的一部分，也有人不清楚为什么开发Vue3项目一定要用Vite。其实核心问题是没分清“前端框架”和“构建工具”的本质差异。

因此，本文的切入逻辑是：**先通过“对比辨析”明确Vue3（框架）与Vite（构建工具）的核心区别，建立“框架负责‘做什么’（构建界面），工具负责‘怎么高效做’（开发/构建）”的基础认知**，再基于这个认知聚焦Vue3本身，深入讲解组件系统中的核心知识点——Props校验与组件实例，最终让大家既能分清工具与框架的定位，也能掌握Vue3组件开发的核心实操。

## Vue3 与 Vite 的区别

Vue3是“前端框架”，Vite是“前端构建工具”，二者协同但职责完全不同

### 1. Vue 3

- **是什么？** Vue 3 是 Vue.js 框架的最新主要版本（发布于 2020年9月）。它是一个用于构建用户界面的**渐进式 JavaScript 框架**。

### 2. Vite

- **是什么？** Vite 是由 Vue 作者尤雨溪开发的下一代**前端构建工具**。它的名字源于法语单词 “vite”（快），其目标就是提供**极速的开发服务器启动**和**闪电般的模块热更新 (HMR)**。

### Vue 3 和 Vite 的核心关系

1. **官方强绑定推荐**：Vue 官方已将 Vite 作为 Vue 项目的首选构建工具，官方脚手架工具 `create-vue` 默认基于 Vite 搭建，替代了过去的 Vue CLI，是 Vue 3 项目的官方标配。
2. 技术理念高度契合
   - Vue 3 对 Tree-shaking、ES 模块（ESM）的深度优化，与 Vite 基于浏览器原生 ESM 设计的核心思路完全匹配，能充分发挥 Vue 3 的体积优化优势；
   - Vite 提供的极速冷启动、闪电般的模块热更新（HMR），完美适配 Vue 3 单文件组件（.vue）的开发模式，解决了大型 Vue 项目开发中启动慢、热更久的问题。
3. **生态与功能无缝适配**：Vite 拥有专门的 Vue 插件（如 `@vitejs/plugin-vue`），能无缝处理 Vue 3 的组合式 API、TS/JSX 支持、多个根节点等新特性，同时 Vite 的 CSS 处理、预构建依赖等能力，能最大化支撑 Vue 3 项目的开发和构建需求。
4. **协同构成黄金开发组合**：Vue 3 负责提供强大的前端界面开发能力（组合式 API、响应式系统、新特性等），Vite 负责提供极致的开发体验和高效的构建能力，两者结合成为现代 Vue 开发的 “黄金搭档”，共同提升大型 Vue 应用的开发效率和交付质量。

5. Vite 是 Vue 3 项目的**官方首选构建工具**，是 Vue 3 生态的核心配套工具；
6. 两者技术理念高度契合，Vite 能最大化发挥 Vue 3 的性能和特性优势；
7. 二者协同构成现代 Vue 开发的 “黄金搭档”，Vue 3 负责界面开发能力，Vite 负责开发 / 构建效率。ite 负责开发 / 构建效率。

## Vue3项目创建

### 项目结构

<img src="https://raw.githubusercontent.com/Atopos-jy/image-host/main/images/1766805381463.png"/>

通过create vue 创建 vue项目

1.vite.config.js - 项目的配置文件 基于vite 的配置

2.package.json - 项目包文件 核心依赖项变成了 Vue3.x 和 vite

3.main.js - 入口文件 createApp函数创建应用实例

4.app.vue - 跟组件 SFC 单文件组件 script -template -style

变化一： 脚本script 和模板 template 顺序调整

变化二： 模板temp;ate 不再要求唯一根元素

变化三：脚本script添加 setup标识支持组合式API

5.index.html - 单页入口 提供id 为 app的挂载点

## 创建Vue实例

```javascript
// 1. 从vue中导入createApp
import { createApp } from "vue";
// 2. 导入根组件（通常是App.vue）
import App from "./App.vue";
// 3. 创建应用实例（传入根组件）
const app = createApp(App);
// 4. （可选）配置应用（如全局组件、指令、原型挂载等）
// 示例：全局注册组件
// import HelloWorld from './components/HelloWorld.vue'
// app.component('HelloWorld', HelloWorld)
// 5. 挂载应用到DOM元素（通常是#app）
app.mount("#app");
```

### 基础语法（模板语法）

- 插值表达式：{{ 数据/表达式 }}
- 指令系统：
  - 基础指令：v-text、v-html、v-show、v-if/v-else-if/v-else、v-for、v-bind、v-on、v-model、v-slot、v-pre、v-cloak
  - 指令修饰符：事件修饰符（.stop、.prevent等）、表单修饰符（.number、.trim等）
- 模板中的表达式与计算

- 响应系统：
  - 基础响应式API：ref（基本类型）、reactive（引用类型）
  - 响应式工具API：toRef、toRefs、toRaw、markRaw、shallowRef、shallowReactive
  - 计算属性：computed函数
  - 监听器：watch函数、watchEffect函数、watchPostEffect、watchSyncEffect
- 响应式原理：Proxy代理（Vue3）vs Object.defineProperty（Vue2）

- 生命周期钩子函数，需导入：
  - 创建阶段：无对应钩子（setup替代beforeCreate+created）
  - 挂载阶段：onBeforeMount、onMounted
  - 更新阶段：onBeforeUpdate、onUpdated
  - 卸载阶段：onBeforeUnmount、onUnmounted
  - 错误捕获：onErrorCaptured、onRenderTracked、onRenderTriggered

- 组合式API：通过script setup + 导出定义（推荐），或defineComponent函数
- 组件分类：全局组件、局部组件、异步组件

- 组件通信：
  - 父传子：defineProps宏接收
  - 子传父：defineEmits宏定义+触发
  - 兄弟通信：mitt库
  - 跨层级通信：provide函数、inject函数
- Props校验：两种API均支持（类型、必填、默认值、自定义校验函数）

- 组件实例：
  - 模板ref：获取DOM/组件实例
  - defineExpose：暴露组件内部数据/方法（供父组件访问）

在组件基础学习完成后，我们正式进入组件通信的核心知识点——Props。对于熟悉 Vue2 的开发者来说，Props + $emit 是父向子、子向父通信的经典组合；而在 Vue3 中，Props 依然承担着“父组件向子组件传递数据”的核心角色，只是在声明方式上有了更灵活的拓展（比如 `defineProps` 宏），同时保留了 Vue2 中Props的核心特性。

本篇博客将从 Props 的核心作用出发，详细拆解 Vue3 中 Props 的声明方式、校验规则、单向数据流原则，并结合实践示例帮你彻底掌握这一核心知识点。

## Props 是什么？核心作用与价值

Props（全称 Properties）是 Vue 组件体系中“父向子”数据传递的唯一标准方式。它的核心价值在于：

- 明确组件间的数据流向：只能从父组件传递到子组件，保证数据流向的可追踪性；
- 实现组件复用：子组件通过接收不同的 Props 数据，可在不同场景下渲染不同内容，提升组件通用性；
- 约束数据规范：通过 Props 校验，可限制传递数据的类型、格式，避免错误数据导致的组件异常，提升代码健壮性。

就像 Vue2 中我们用 `props` 选项接收父组件数据一样，Vue3 中 Props 的核心逻辑未变，但声明方式更贴合组合式 API 的简洁性，尤其是 `<script setup>` 语法糖下的 `defineProps` 宏，让声明过程更高效。

## Vue3 中 Props 的声明方式

Vue3 支持两种核心的 Props 声明方式：**字符串数组形式**和**对象形式**，分别适用于不同场景。同时，根据是否使用 `<script setup>` 语法糖，声明写法略有差异，但核心参数完全一致。

### 字符串数组形式

适用于简单场景：只需明确接收的 Props 名称，无需限制数据类型、校验规则。

#### （1）使用 <script setup>（Vue3 推荐）

通过 `defineProps` 宏直接传入字符串数组，声明后可直接在模板或脚本中使用 Props 数据：

```
<script setup>
// 声明需要接收的 Props 名称列表
const props = defineProps(['message', 'userId', 'isVIP'])

// 脚本中访问 Props
console.log(props.message)
console.log(props.userId)
</script>

<template>
  <div>
    <p>父组件传递的消息：{{ message }}</p>
    <p>用户ID：{{ userId }}</p>
  </div>
</template>
```

#### （2）不使用 <script setup>（传统选项式写法）

通过 `props` 选项声明，在 `setup` 函数中可直接接收 `props` 作为第一个参数：

```
export default {
  // 字符串数组形式声明 Props
  props: ['message', 'userId', 'isVIP'],
  setup(props) {
    // setup 中访问 Props
    console.log(props.message)
    return {}
  }
}
```

### 对象形式

适用于绝大多数业务场景：不仅能声明 Props 名称，还能指定数据类型、必填性、默认值、自定义校验规则，兼具“类型提示”和“组件文档”的作用。

#### （1）使用 <script setup>

```
<script setup>
const props = defineProps({
  // 基础类型约束：指定 Prop 类型为 String
  title: String,
  // 基础类型约束：指定 Prop 类型为 Number
  likes: Number,
  // 必传且类型为 String 的 Prop
  content: {
    type: String,
    required: true
  }
})
</script>
```

#### （2）不使用 <script setup>

```
export default {
  props: {
    title: String,
    likes: Number,
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    console.log(props.title)
    return {}
  }
}
```

#### 关键说明

无论是 `defineProps` 宏还是 `props` 选项，传递的参数格式完全一致——这意味着两种写法的核心逻辑互通，只是语法糖差异。Vue3 推荐使用 `<script setup> + defineProps`，代码更简洁，且无需手动导出组件。

### TypeScript 类型标注声明

如果你的项目使用 TypeScript，在 `<script setup>` 中还可以通过**类型标注**的方式声明 Props，语法更简洁，类型约束更严格：

```
<script setup lang="ts">
// 通过接口定义 Props 类型
interface Props {
  message: string
  userId?: number // 可选 Prop
  isVIP: boolean
}

// 传入接口作为类型约束
const props = defineProps<Props>()
</script>
```

## 深入理解：Props 校验规则

Props 校验是提升组件健壮性的关键——当其他开发者使用你的组件时，若传递的 Props 不符合规则，Vue 会在**开发环境**的控制台抛出明确警告，帮助快速定位问题（生产环境校验会被移除，以减小包体积）。

以下是完整的校验规则配置示例，我们逐一拆解核心配置项：

```javascript
defineProps({
  // 1. 基础类型检查
  // (传递 null 或 undefined 会跳过类型检查)
  propA: Number,

  // 2. 多种可能的类型（数组形式）
  propB: [String, Number],

  // 3. 必传且为 String 类型
  propC: {
    type: String,
    required: true,
  },

  // 4. 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true,
  },

  // 5. Number 类型的默认值（非必传时生效）
  propE: {
    type: Number,
    default: 100,
  },

  // 6. 对象类型的默认值
  // 注意：对象/数组的默认值必须通过工厂函数返回
  // 避免多个组件实例共享同一个对象/数组
  propF: {
    type: Object,
    default(rawProps) {
      // rawProps 是父组件传递的原始 Props 数据
      return { message: "hello Vue3" };
    },
  },

  // 7. 自定义类型校验函数（3.4+ 支持第二个参数 props，获取所有 Props）
  propG: {
    validator(value, props) {
      // 要求 value 必须是 success/warning/danger 中的一个
      return ["success", "warning", "danger"].includes(value);
    },
  },

  // 8. 函数类型的默认值
  // 注意：函数类型的默认值无需工厂函数，直接赋值即可
  propH: {
    type: Function,
    default() {
      return () => "默认函数返回值";
    },
  },
});
```

### 核心校验配置项解读

- **type：指定数据类型** 可取值为原生构造函数（String/Number/Boolean/Array/Object/Function/Symbol）、自定义构造函数，或多个类型组成的数组（如 [String, Number]）。Vue 会通过 `Object.prototype.toString.call(value)` 校验类型。
- **required：是否必填** 布尔值，设为 `true` 时，父组件必须传递该 Prop，否则抛出警告。
- **default：默认值**非必填 Prop 的默认值。基础类型（String/Number/Boolean）可直接赋值；对象/数组必须通过工厂函数返回（避免多组件实例共享同一引用）；函数类型可直接赋值函数。
- **validator：自定义校验函数**接收两个参数：当前 Prop 的值（value）、所有 Props 数据（props，Vue3.4+ 支持）。返回布尔值，`true` 表示校验通过，`false` 表示失败（失败会抛出警告）。适用于复杂校验场景（如手机号格式、枚举值校验）。

### 实用校验示例：手机号格式校验

结合自定义校验函数，实现手机号格式的严格校验，符合实际业务需求：

```javascript
<script setup>
const props = defineProps({
  phone: {
    type: String,
    required: true,
    // 自定义校验函数：校验手机号格式
    validator(value) {
      const phoneReg = /^1[3-9]\d{9}$/
      return phoneReg.test(value)
    }
  }
})
</script>
```

当父组件传递的`phone` 不符合手机号格式时，控制台会抛出警告：`[Vue warn]: Invalid prop: custom validator check failed for prop "phone".`

## 核心原则：Props 单向数据流

所有 Vue 版本的 Props 都遵循**单向数据流**原则，这是组件通信的核心准则，必须严格遵守：

> Props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。

### 禁止直接修改 Props

子组件中直接修改 Props 会触发 Vue 警告，这是明确的错误用法：

```javascript
<script setup>
const props = defineProps(['count'])

// 错误：直接修改 Props
const increment = () => {
  props.count++ // [Vue warn]: Attempting to mutate prop "count". Props are readonly.
}
</script>
```

若需要修改 Props 对应的数值，需通过“父组件修改数据源”的方式实现，核心思路是“子组件触发事件，父组件响应更新”：

#### 方案 1：子组件触发自定义事件，父组件更新数据

最常用的方案，适用于“数据需要同步到父组件”的场景（如表单输入、计数器）：

```javascript
<!-- 子组件 Child.vue -->
<script setup>
// 声明接收的 Props
const props = defineProps(['count'])
// 声明可触发的自定义事件
const emit = defineEmits(['update:count'])

// 子组件触发事件，传递新值给父组件
const increment = () => {
  emit('update:count', props.count + 1)
}
</script>

<template>
  <button @click="increment">计数：{{ count }}</button>
</template>
```

```javascript
<!-- 父组件 Parent.vue -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

// 父组件的数据源
const parentCount = ref(0)

// 父组件响应事件，更新数据
const handleUpdateCount = (newCount) => {
  parentCount.value = newCount
}
</script>

<template>
  <!-- 父组件传递 Props，监听子组件事件 -->
  <Child :count="parentCount" @update:count="handleUpdateCount" />
</template>
```

#### 方案 2：基于 Props 生成本地响应式数据

适用于“子组件仅需使用 Props 的初始值，后续修改不影响父组件”的场景（如局部数据展示、临时编辑）：

```javascript
<script setup>
import { ref } from 'vue'
const props = defineProps(['initialName'])

// 基于 Props 初始值，生成本地响应式数据
const localName = ref(props.initialName)

// 修改本地数据，不影响父组件
const changeName = () => {
  localName.value = '新名称'
}
</script>

<template>
  <p>{{ localName }}</p>
  <button @click="changeName">修改名称</button>
</template>
```

## 补充要点：Props 名称大小写规范

HTML 属性不区分大小写，而 JavaScript 标识符区分大小写，因此 Vue 对 Props 名称有明确的规范：

- 声明时（JavaScript 环境）：使用 `camelCase`（驼峰命名），如 `userId`、`userName`；
- 模板传递时（HTML 环境）：使用 `kebab-case`（短横线分隔），如 `user-id`、`user-name`；
- 特殊场景：单文件组件（SFC）的模板或字符串模板支持直接使用驼峰命名传递，但推荐统一用短横线，保持风格一致。

```javascript
<!-- 正确：声明为 userId，模板传递用 user-id -->
<Child :user-id="1001" />

<!-- 错误：模板直接用驼峰，HTML 会解析为 userid -->
<Child :userId="1001" />
```

## 实践示例：完整的 Props 通信流程

结合以上知识点，实现一个“用户信息卡片组件”，包含 Props 声明、校验、单向数据流通信：

```javascript
<!-- 子组件 UserCard.vue -->
<script setup>
const props = defineProps({
  // 校验用户ID：必传，数字类型
  userId: {
    type: Number,
    required: true
  },
  // 校验用户名：必传，字符串类型
  userName: {
    type: String,
    required: true
  },
  // 校验用户等级：可选，只能是 normal/vip/admin
  userLevel: {
    type: String,
    default: 'normal',
    validator(value) {
      return ['normal', 'vip', 'admin'].includes(value)
    }
  }
})

// 触发事件，通知父组件修改用户名
const emit = defineEmits(['update:userName'])
const changeUserName = (newName) => {
  emit('update:userName', newName)
}
</script>

<template>
  <div class="user-card">
    <h3>用户ID：{{ userId }}</h3>
    <p>用户名：{{ userName }}</p>
    <p>等级：{{ userLevel }}</p>
    <button @click="changeUserName('新用户名')">修改用户名</button>
  </div>
</template>
```

```javascript
<!-- 父组件 App.vue -->
<script setup>
import { ref } from 'vue'
import UserCard from './UserCard.vue'

const userInfo = ref({
  userId: 1001,
  userName: 'Vue学习者',
  userLevel: 'vip'
})

// 响应子组件事件，更新用户名
const handleUpdateName = (newName) => {
  userInfo.value.userName = newName
}
</script>

<template>
  <h2>用户中心</h2>
  <UserCard
    :user-id="userInfo.userId"
    :user-name="userInfo.userName"
    :user-level="userInfo.userLevel"
    @update:userName="handleUpdateName"
  />
</template>
```

## 总结

Props 是 Vue3 组件间父向子通信的核心机制，核心要点可归纳为：

- 声明方式：支持字符串数组（简洁）和对象（进阶校验），推荐 `<script setup> + defineProps`；
- 校验规则：通过 type、required、default、validator 实现数据约束，提升组件健壮性；
- 核心原则：严格遵循单向数据流，子组件不可直接修改 Props，需通过触发事件由父组件更新数据；
- 命名规范：声明用驼峰，模板传递用短横线，避免 HTML 大小写解析问题。

掌握 Props 是深入 Vue3 组件开发的基础，后续结合 $emit、Pinia 等知识点，可实现更复杂的组件通信场景。建议多通过实践示例巩固校验规则和单向数据流的用法，避免踩坑。
