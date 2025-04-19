# reactDOM 新 render 方式

> Source: `DEBUGS[2025-04-18 21:45] 导入react/client` (Line 1)

## 原始注释

> DEBUGS[2025-04-18 21:45] 导入 react/client

## 分析与思考

你遇到的错误 `Uncaught TypeError: react_dom__WEBPACK_IMPORTED_MODULE_1__.render is not a function` 是因为 React 18 引入了对 `ReactDOM.render()` 的修改，导致你在 React 18 中调用 `render` 函数时报错。

### **问题的根本原因：**

在 React 18 之后，`ReactDOM.render()` 被移除了，取而代之的是 `ReactDOM.createRoot()`。这意味着你在使用 React 18 的项目中不能再使用 `ReactDOM.render()`，而是需要使用 `ReactDOM.createRoot()` 来创建应用的根节点。

### **解决方案：**

要解决这个问题，你需要使用 `ReactDOM.createRoot()`，并且通过 `.render()` 来渲染应用程序。

**修改代码如下：**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client' // 注意这里的 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')) // 创建根节点
root.render(
  // 使用 root.render() 渲染
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### **为什么会有这个变化：**

React 18 引入了并发渲染（Concurrent Rendering），并且改变了渲染 API。原本的 `ReactDOM.render()` 方法被 `createRoot` 和 `render` 方法替代，以支持并发特性和更细粒度的渲染控制。

`ReactDOM.createRoot()` 方法返回一个根节点实例，之后你需要调用 `.render()` 来渲染组件。

### React 18 其他变化

React 18 带来了很多新的特性和改进，其中最重要的是对并发渲染（Concurrent Rendering）的支持，此外还包括多个性能优化、更新的 React API 和其他一些改变。以下是 React 18 的几个关键升级部分：

#### 1. **并发渲染 (Concurrent Rendering)**

并发渲染是 React 18 中最重要的特性之一，旨在提高 UI 响应性和用户体验。并发渲染允许 React 在不阻塞用户界面的情况下渲染多个任务。

##### **主要内容：**

- **`createRoot()` 和 `.render()`：** 正如前面提到的，`ReactDOM.createRoot()` 替代了 `ReactDOM.render()`，开启并发渲染。这意味着你可以利用 React 的并发功能进行更高效的更新。
- **`Suspense` 改进：** React 18 改进了 `Suspense`，它不再局限于只在代码拆分时使用。现在，`Suspense` 可以配合并发渲染使用，帮助处理更复杂的异步数据加载场景。

- **并发渲染：** 这个特性让 React 在有多个更新时，能够将这些更新分成多个小块，以非阻塞的方式来处理，而不会导致页面的卡顿或渲染不流畅。

##### **示例代码：**

```javascript
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

#### 2. **自动批量更新 (Automatic Batching)**

React 18 引入了自动批量更新，即使是在异步事件（例如 `setTimeout`、`Promise`、`fetch` 请求等）中，React 也会批量处理多个状态更新。这意味着 React 会自动将多个状态更新合并成一个重新渲染过程，从而提高性能。

#### 3. **`Suspense` 对数据加载的支持**

React 18 扩展了 `Suspense`，现在它不仅仅是用于延迟加载代码，还可以与异步数据加载一起使用。这使得你能够在数据还没有准备好时，展示一个加载状态，并在数据准备好后自动渲染组件。

##### **示例：**

```javascript
const MyComponent = React.lazy(() => import('./MyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  )
}
```

#### 4. **`useId` Hook**

React 18 引入了 `useId` 钩子，它是一个新的用于生成稳定、跨渲染的 ID 的钩子。这个功能解决了服务端渲染和客户端渲染中 ID 不匹配的问题，尤其是在表单和可访问性相关的功能中，生成稳定的 ID 非常重要。

##### **示例代码**

```javascript
import { useId } from 'react'

function MyForm() {
  const id = useId()

  return (
    <form>
      <label htmlFor={id}>Name:</label>
      <input id={id} name="name" type="text" />
    </form>
  )
}
```

#### 5. **`startTransition` API**

React 18 引入了 `startTransition` API，它允许你将某些更新标记为非紧急的，并且这些更新会被延迟处理，以确保高优先级更新（如用户输入）能尽快渲染。这个特性帮助开发者控制和优化应用的渲染过程。

##### **示例**

```javascript
import { startTransition } from 'react'

function handleClick() {
  startTransition(() => {
    setSomeState(someNewState)
  })
}
```

#### 6. **`useSyncExternalStore` Hook**

React 18 提供了 `useSyncExternalStore` Hook，用于订阅外部存储（例如 Redux、MobX 等）并同步地获取状态。这是一个为了优化 React 与外部状态管理工具的交互而设计的钩子，它保证了在 React 渲染期间，外部状态的获取是同步的。

```javascript
import { useSyncExternalStore } from 'react'

function useStore() {
  const state = useSyncExternalStore(subscribe, getState)
  return state
}
```

#### 8. **`useDeferredValue` Hook**

`useDeferredValue` 是一个新的钩子，它允许你推迟某些更新的执行，特别是在处理大量计算或渲染时。通过这个钩子，你可以将低优先级的更新推迟，以优化渲染过程并减少卡顿。

```javascript
const deferredValue = useDeferredValue(someValue)

return <div>{deferredValue}</div>
```

#### 9. **性能改进**

React 18 中还进行了许多性能改进，特别是在并发渲染和数据加载方面。它能够更智能地决定何时渲染组件、如何分配优先级，以最大化性能。

- **更智能的批量更新**：React 在执行批量更新时，可以更加高效地处理更新，并减少不必要的重新渲染。
- **延迟渲染**：通过并发渲染，React 18 可以在渲染过程中延迟非关键部分的更新，从而使应用响应更快。

#### 10. **React 18 对服务端渲染 (SSR) 的支持**

React 18 改进了服务端渲染的体验，引入了新的 `ReactDOM.hydrateRoot` 和 `createRoot` API，使得服务端渲染和客户端渲染的过渡更加平滑。

#### 总结

React 18 引入了多个创新和性能提升，最重要的特性包括：

- 并发渲染（Concurrent Rendering）和 `createRoot` 替代 `render`。
- 自动批量更新，提升性能。
- `Suspense` 支持数据加载，简化异步渲染。
- 新的 `useId`、`startTransition` 和 `useSyncExternalStore` 钩子，优化组件性能和外部状态管理。
- 实验性功能如 React Server Components。

这些升级不仅提高了应用的性能和响应性，还为开发者提供了更多的控制和优化渲染的方式。
