# Nodemon

> Source: `TODOS[2025-04-18 20:31]: nodemon` (Line 1)

## 原始注释

> TODOS[2025-04-18 20:31]: nodemon

`nodemon` 是一个常用于 Node.js 开发中的工具，它的作用是自动监视你的文件变化并在文件发生变化时自动重启 Node.js 应用。它可以节省开发者手动重启服务器的时间，提高开发效率，尤其是在开发过程中频繁修改代码的情况下。

在 MERN（MongoDB, Express, React, Node.js）中，`nodemon` 主要用于监视 Node.js 服务器端代码的变化。比如，当你修改了 `server.js` 或其他后端文件时，`nodemon` 会自动检测到这些变化并重启后端服务，无需手动停止再重新启动。

**如何使用 `nodemon`：**

1. 首先，你需要安装 `nodemon`。可以通过 npm 或 yarn 安装：

   ```bash
   npm install -g nodemon
   ```

   或者

   ```bash
   yarn global add nodemon
   ```

2. 然后，在启动服务器时，用 `nodemon` 替代 `node` 命令：

   ```bash
   nodemon server.js
   ```

3. `nodemon` 会监视 `server.js` 文件以及其他默认的文件类型（如 `.js`, `.json`, `.mjs`, `.coffee` 等）。当这些文件发生变化时，`nodemon` 会自动重启你的服务器。

在 MERN 堆栈中，`nodemon` 经常用于监视 Express 后端的变动，这样你无需每次修改后端代码时都手动重启服务器。

**简单示例：**
假设你有一个 `server.js` 文件，内容如下：

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
```

你可以使用 `nodemon` 启动该服务：

```bash
nodemon server.js
```

这样，当你修改 `server.js` 文件并保存时，`nodemon` 会自动重启服务器，而不需要你手动停止和启动。

**总结**：`nodemon` 使得开发 Node.js 应用更加高效，特别是在频繁修改代码时。
