import React from 'react'

// DEBUGS[2025-04-18 21:45] 导入react/client
import ReactDOM from 'react-dom/client'

import App from './App'
/** 
 * ! 在 React 18 之后，ReactDOM.render() 被移除了，取而代之的是 ReactDOM.createRoot()
 * * React 18 引入了并发渲染（Concurrent Rendering），并且改变了渲染 API
 * * ReactDOM.createRoot() 方法返回一个根节点实例，之后你需要调用 .render() 来渲染组件。
 * ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)



