# Require和Import区别联系

> Source: `TODOS[2025-04-18 12:07]: 在这里设置import和require的导入方法是有区别的，需要额外根据项目做下笔记` (Line 1)

## 原始注释

> TODOS[2025-04-18 12:07]: 在这里设置 import 和 require 的导入方法是有区别的，需要额外根据项目做下笔记

## 分析与思考

下面从**模块规范**、**语法差异**、**执行时机与加载行为**、**静态分析与优化**、**循环依赖**等维度，详细对比 CommonJS 的 `require` 与 ES Module 的 `import`，并在关键难点处给出示意图。

---

## 1. 模块规范（Specification）

| 规范         | CommonJS                           | ES Module (ESM)                       |
|--------------|------------------------------------|---------------------------------------|
| 发布年份     | 2009 年                           | 2015 年（ES6）                        |
| 使用场景     | Node.js（服务器端），早期打包工具   | 浏览器、现代打包工具（Webpack、Rollup）  |
| 加载方式     | 同步加载（synchronous）            | 静态分析加载，支持异步 `import()`      |

---

## 2. 语法差异（Syntax）

```js
// CommonJS (Node.js)
const fs      = require('fs');
const { log } = require('./utils');
module.exports = { foo, bar };
```

```js
// ES Module
import fs, { readFileSync as read } from 'fs';
export function foo() { … }
export default class Bar { … }
```

- **加载对象**  
  - `require(path)` 返回的是模块的 `module.exports`。  
  - `import { named }`、`import defaultExport`、`import * as ns`，都是静态绑定。

- **导出方式**  
  - CommonJS：`module.exports = …` 或 `exports.xxx = …`。  
  - ESM：`export` 语句，支持多次命名导出和一次 `export default`。

---

## 3. 执行时机与加载行为（Loading Behavior）

| 特性                 | require                                  | import                                  |
|----------------------|------------------------------------------|-----------------------------------------|
| 执行时机             | 运行时动态执行（Runtime）                | 解析时静态分析（Parse Time）            |
| 同步/异步             | 同步：阻塞后续代码直到模块加载完成       | 静态：在模块加载前解析依赖；`import()` 动态异步加载 |
| 举例：               |                                          |                                         |
| ```js               | // 放在函数、条件里也能调用                | // 只允许顶层声明；`import()` 可放在函数里     |
| function fn() {     | function fn() {                          | // 错误：SyntaxError                       |
|   const a = require('./a.js'); // OK       |   import a from './a.js'; // ❌   |
| }                    | }                                        | }                                       |
| ```                  |                                          |                                         |

### 加载流程示意（简化）  

```md
CommonJS (require)
┌─────────────┐
│ require()   │
│ → find file │
│ → compile   │
│ → execute   │
│ → return    │
└─────────────┘

ES Module (import)
┌─────────────────────────────┐
│ 1. Parse all import/export │←──静态分析阶段
│ 2. Fetch & parse modules   │
│ 3. Link bindings            │
│ 4. Execute module code      │
└─────────────────────────────┘
```

---

## 4. 静态分析与优化（Tree Shaking）

- **CommonJS** (`require`)  
  - 动态调用，打包工具无法在编译期准确知道哪些导出被使用，**Tree Shaking** 支持有限。  

- **ES Module** (`import`)  
  - 静态 `import { a, b } from 'lib'`，编译器可以精准地删除未使用的 `export`，实现真正的 Tree Shaking。  

---

## 5. 循环依赖（Circular Dependencies）

- **CommonJS**  
  - 如果 A → require(B)，B → require(A)，在 B 加载未完成前，`require(A)` 会拿到一个**不完整的 exports 对象**。  
- **ES Module**  
  - 静态绑定，先建立执行环境，再执行代码，能够正确地处理循环依赖——访问的是“活引用”（live binding）。

```js
// a.js (ESM)
import { val as bVal } from './b.js';
export const val = 'A';
console.log('bVal in A:', bVal);

// b.js
import { val as aVal } from './a.js';
export const val = 'B';
console.log('aVal in B:', aVal);
```

```md
执行顺序：
1. 解析 import，注册 live binding
2. 执行 a.js 导出 → val='A'
3. 执行 b.js 导出 → val='B'; 打印 aVal='A'
4. 回到 a.js → 打印 bVal='B'
```

---

## 6. 关键难点与易错点（Pitfalls & Interview Focus）

1. **顶层 vs 动态**  
   - `import` 必须顶层声明，动态场景需 `import()`；`require` 可放任意位置。  
2. **Hoisting**  
   - `import` 会被提升到文件顶部，所有导出/导入在模块执行前就已就绪；  
   - `require` 则按执行流执行。  
3. **兼容性**  
   - Node.js 新版本已原生支持 ESM，但老项目需加 `"type":"module"` 或 `.mjs` 后缀；  
   - Babel、TypeScript 项目要配置 `@babel/preset-env` 或 `tsconfig.module`。  
4. **Tree Shaking**  
   - 面试官常看你是否了解静态分析对打包体积的影响，以及为何 ESM 更友好。  

---

## 7. 延伸点（Further Reading）

- **Dynamic `import()`**：在浏览器或 Node.js 中**按需加载**模块。  
- **混用 CommonJS & ESM**：如何在同一项目中兼容两者。  
- **性能对比**：同步 vs 异步加载对启动时间的影响。  

---

### Follow‑up Question

你是否想看一个**Babel 配置示例**，演示如何在旧项目中平滑地从 `require` 迁移到 `import`？
