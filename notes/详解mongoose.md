# **Mongoose 介绍**

**Mongoose** 是一个 **MongoDB** 的对象建模工具，它提供了一个基于 **Node.js** 的 API，使得与 MongoDB 进行交互变得更加简单和高效。MongoDB 是一个 NoSQL 数据库，它的特点是文档导向存储，不使用传统的关系型数据库的表格模型。Mongoose 通过提供类似于 ORM（对象关系映射）的功能，简化了 MongoDB 的操作，让开发者可以使用更接近面向对象编程的方式来操作数据库。

## 前置了解 mongoDB 连接基础

1. mongoDB 与数据库连接，后端使用 mongoose 连接 mongoDB atlas 或者本地 mongoDB，连接 uri 包含认证、数据库 name、集群信息，uri 是服务入口类似于数据库网关，连接后才能读写 collection 中的 document
2. 定义 schema 数据结构约束，使用 mongoose 创建 model（crud 接口封装），每个 model 对应 collection
3. 设置 express 路由系统处理 http 请求，在路由中设置 model 操作 mongoDB 数据，所有 crud mongodb 都通过 mongoose model 实现，每个路由对应一个 crud 动作/restful
4. 前后端交互

## 一、Mongoose 的主要功能

> **前置知识速览**
> Schema（模式）：描述数据结构的“蓝图”，类似数据库字段的定义表。
> Model（模型）：基于 Schema 创建的“操作接口”，可以对数据库进行增删改查（CRUD）。
> Database（数据库）：真实存储数据的地方，通常是一组集合（MongoDB）或表（MySQL/PostgreSQL）。
> 就 mongoDB 而言，他一些特殊概念如下
>
> - MongoDB 中，一个数据库包含多个集合（Collection）
> - 每个集合里包含多个文档（Document）,schema 定义文档结构，model 使用 schema 构建出来的类用于操作 document
>
> ```md
> MongoDB（数据库引擎）engine
> └── myAppDB（数据库）
> ├── users（集合）collection
> │ ├── {name: 'Alice', age: 23}
> │ └── ...
> └── posts（集合）
> ├── {title: 'Intro to GraphQL', author: 'Bob'}
> ```
>
> 另外需要了解 mongoDB 中常见三种 cluster 类型
>
> - replica set 副本集合： 主从复制结构，1 主 + 多从，自动故障恢复 - 高可用性 - 后期自行探索
> - Shared cluster 分片集群： 数据被拆分存储到多个分片（分区）上 - scalability - 后期自行探索
> - mongoDB Atlas cluster: mongoDB 云端服务集群（按需配置）- 托管集群服务
>
> 在 mongoDB 中 cluster 集群可以包含多个数据库，相当于 cluster 是数据中心园区,db 是一栋楼，collection 是楼层/部门，document 是房间，schema 是楼层结构图纸（用来定义字段规则）
>
> 对于绝大多数 中小型项目 / Side Project / 教学项目 / MVP 验证系统，你只需要：
> 一个 Cluster（例如 MongoDB Atlas 免费版 Cluster0）属于是数据库服务器
> 一个 Database（比如叫 myAppDB）
> 多个 Collection（users, posts, comments 等）->表示多张表
> 每个 Collection 下存储多个 Document -> 表示多行，另外 doc 中的字段表示多列
> 在这里解释一下：
>
> - collection 是集合，对应一张表比如 users,posts
> - document 是文档，对应一行记录比如{ name: "Evan", age: 24 }
>
> 你不需要多个数据库、多个集群，更不需要分片集群或高可用副本集，除非你确实面临高负载或高可用场景。
>
> 具体结构如下图所示：
>
> ```md
> Cluster0 (MongoDB Atlas 免费集群)
> │
> └── Database: myAppDB
> ├── Collection: users
> │ └── { \_id: ..., name: "Evan", email: "...", passwordHash: "..." }
> ├── Collection: posts
> │ └── { title: "Hello", content: "...", authorId: "...", createdAt: ... }
> └── Collection: comments
> └── { postId: "...", content: "...", userId: "...", createdAt: ... }
> ```
>
> 什么时候才考虑用多个数据库、集群、分片？
>
> | 场景                            | 原因                             |
> | ------------------------------- | -------------------------------- |
> | **大规模高并发系统**            | 需要 Sharded Cluster 分担负载    |
> | **业务隔离场景**（多租户 SaaS） | 每个客户独立数据库，提高安全性   |
> | **高可用需求（容灾）**          | 使用 Replica Set 防止单点故障    |
> | **分布式微服务架构**            | 各服务有独立数据库、独立生命周期 |
> | **海量存储需求（上百 G 数据）** | 单数据库效率下降，需分库分片     |
>
> 简单场景的数据库设计
>
> | 建议                                                 | 说明                              |
> | ---------------------------------------------------- | --------------------------------- |
> | **一个数据库管理整个项目逻辑**                       | 简单直接、易于维护、适合单体应用  |
> | **一个 Collection 对应一个实体模型（如用户、帖子）** | 结构清晰，ORM（Mongoose）建模方便 |
> | **使用 Mongoose 管理 schema 和 model**               | 自动验证、封装接口，代码更规范    |
> | **按需做字段索引**                                   | 提升查询效率，但初期可以不加      |
> | **合理划分文档结构（embed vs reference）**           | 保持灵活性与性能平衡              |

## 二、Mongoose 的应用场景

1. **Web 应用程序开发**：
   在使用 Node.js 和 Express 框架进行 Web 应用开发时，Mongoose 是非常常用的工具。它简化了与 MongoDB 数据库的交互，使得开发者可以更专注于应用逻辑而不是处理复杂的数据库操作。

   - **例如**：开发一个用户管理系统，使用 Mongoose 来处理用户注册、登录、个人信息管理等操作。

2. **数据模型化**：
   在任何需要对数据进行建模和结构化的应用中，Mongoose 都非常有用。它可以帮助您定义数据结构、实现验证、设置默认值、进行数据转换等。

   - **例如**：在电子商务网站中，Mongoose 可以用于定义产品、订单、购物车等模型，并提供相关的 CRUD 操作。

3. **与其他服务的集成**：
   如果你的 Node.js 应用需要集成多个外部服务（例如 API、其他数据库），Mongoose 可以简化与 MongoDB 的交互，并确保数据库操作的一致性。

   - **例如**：开发一个社交媒体平台，Mongoose 用于处理用户信息、帖子、评论等数据，同时可以与其他 API（例如支付网关、推送通知等）进行集成。

4. **内容管理系统（CMS）**：
   使用 Mongoose 可以帮助你轻松管理和存储文章、评论、用户等内容。它允许你根据业务需求灵活定义数据模型和交互模式。

   - **例如**：一个博客平台，使用 Mongoose 来管理文章、标签、作者等数据结构。

5. **实时应用**：
   对于需要快速处理大量并发请求的实时应用（例如在线聊天、推送通知等），Mongoose 可以帮助你高效地管理实时数据并进行存储。

   - **例如**：开发一个实时聊天应用，使用 Mongoose 来管理聊天记录和用户会话。

## 三、对比使用与不使用实现 db 功能的区别

以下是对 **Mongoose** 和 **MongoDB Node.js Driver** 在实现数据库功能时的详细对比，不仅仅包括前面提到的 CRUD、数据验证、中间件等功能，还包括聚合查询、虚拟属性、索引管理等功能。通过这些对比，你可以更清楚地看到两者在数据库操作时的差异和优缺点。

### 1. 数据模型定义与验证（Schema）

#### **有 Mongoose 的情况：**

Mongoose 提供了 **Schema** 功能，用于定义文档的结构，并能为每个字段提供验证、默认值、枚举限制等功能。

**示例**：使用 Mongoose 定义数据模型和验证

```javascript
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
})

// 创建模型
const User = mongoose.model('User', userSchema)
```

- **功能**：
  - **字段验证**：`name` 和 `email` 必须存在，`age` 不能小于 18，`status` 字段只能是 `'active'` 或 `'inactive'`。
  - **默认值**：`status` 字段有默认值 `'active'`。
  - **唯一性验证**：`email` 字段是唯一的，Mongoose 会确保数据库中没有重复的 `email`。

#### **没有 Mongoose 的情况：**

如果不使用 Mongoose，MongoDB Node.js Driver 不会有 Schema 定义和验证功能。你需要手动验证数据、检查字段是否存在、类型是否匹配等。
**示例：不使用 Mongoose 进行数据验证**

```javascript
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function createUser() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')

  const newUser = {
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
    status: 'active',
  }

  // 手动验证数据
  if (
    !newUser.name ||
    !newUser.email.includes('@') ||
    newUser.age < 18 ||
    !['active', 'inactive'].includes(newUser.status)
  ) {
    throw new Error('Invalid user data')
  }

  await users.insertOne(newUser)
  console.log('User created')
}

createUser().catch((err) => console.error(err))
```

- **缺点**：
  - 需要手动检查每个字段的有效性。
  - 没有内建的字段验证和默认值功能。

### **2. CRUD 操作**

#### **有 Mongoose 的情况：**

Mongoose 提供了封装好的 API，使得执行 CRUD 操作非常简洁。并且，操作后返回的是基于模型的文档。

**示例：Mongoose 执行 CRUD 操作**

```javascript
// 创建用户
const newUser = new User({ name: 'John', email: 'john@example.com', age: 25 })
newUser.save() // 保存到数据库

// 查询用户
User.find({ age: { $gte: 18 } }) // 查询年龄大于等于 18 的用户

// 更新用户
User.updateOne({ email: 'john@example.com' }, { $set: { age: 26 } })

// 删除用户
User.deleteOne({ email: 'john@example.com' })
```

#### **没有 Mongoose 的情况：**

没有 Mongoose 时，操作变得更冗长，需要手动处理连接和数据库操作，且没有模型层的抽象。

**示例：MongoDB Node.js Driver 执行 CRUD 操作**

```javascript
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function createUser() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')

  const newUser = { name: 'John', email: 'john@example.com', age: 25 }
  await users.insertOne(newUser)
}

async function findUser() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')
  const usersList = await users.find({ age: { $gte: 18 } }).toArray()
  console.log(usersList)
}

createUser().then(() => findUser())
```

- **缺点**：
  - 没有 Mongoose 提供的封装的查询方法。
  - 查询和操作过程更繁琐且代码更冗长。
  - 缺少对数据类型和模型的支持。

### **3. 中间件（Middleware）**

#### **有 Mongoose 的情况：**

Mongoose 提供了中间件功能，可以在执行某些操作前或后插入逻辑。例如，可以在保存前加密密码，或者在删除前记录日志。

**示例：使用 Mongoose 中间件**

```javascript
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashPassword(this.password) // 对密码进行加密
  }
  next() // 继续执行保存操作
})
```

#### **没有 Mongoose 的情况：**

没有 Mongoose 时，没有直接的中间件机制，开发者需要手动在操作前后插入额外逻辑。

**示例：手动执行加密逻辑**

```javascript
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function createUser() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')

  const newUser = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
  }

  // 手动加密密码
  newUser.password = hashPassword(newUser.password)

  await users.insertOne(newUser)
  console.log('User created')
}

createUser().catch((err) => console.error(err))
```

- **缺点**：
  - 需要手动插入额外的逻辑，没有中间件机制。

### **4. 聚合查询（Aggregation）**

#### **有 Mongoose 的情况：**

Mongoose 提供了与 MongoDB 聚合操作兼容的高级 API，可以轻松执行数据的聚合（如分组、筛选、排序等）。

**示例：使用 Mongoose 聚合查询**

```javascript
User.aggregate([
  { $match: { age: { $gte: 18 } } }, // 筛选年龄大于等于 18 的用户
  { $group: { _id: '$age', count: { $sum: 1 } } }, // 按年龄分组，并统计每组的人数
  { $sort: { count: -1 } }, // 按人数降序排序
])
  .then((result) => console.log(result))
  .catch((err) => console.error(err))
```

#### **没有 Mongoose 的情况：**

没有 Mongoose 时，MongoDB Node.js Driver 直接支持聚合查询，但代码结构可能会更复杂，并且没有像 Mongoose 那样的封装。

**示例：MongoDB Node.js Driver 聚合查询**

```javascript
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function aggregateUsers() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')

  const result = await users
    .aggregate([
      { $match: { age: { $gte: 18 } } },
      { $group: { _id: '$age', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray()

  console.log(result)
}

aggregateUsers().catch((err) => console.error(err))
```

- **缺点**：
  - 聚合查询的代码结构更冗长，需要手动配置聚合管道。
  - 没有 Mongoose 提供的额外封装。

### **5. 虚拟属性（Virtuals）**

#### **有 Mongoose 的情况：**

Mongoose 支持 **虚拟属性**，这些属性不是存储在数据库中的，但可以通过一些其他字段计算得出，常用于计算字段或格式化字段。

**示例：使用 Mongoose 虚拟属性**

```javascript
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})
```

#### **没有 Mongoose 的情况：**

没有 Mongoose 时，你需要手动在查询数据后处理这些计算字段。

**示例：没有 Mongoose 的虚拟属性**

```javascript
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

async function getUser() {
  await client.connect()
  const db = client.db('test')
  const users = db.collection('users')

  const user = await users.findOne({ email: 'alice@example.com' })

  // 手动计算虚拟属性
  const fullName = user.firstName + ' ' + user.lastName
  console.log(fullName)
}

getUser().catch((err) => console.error(err))
```

- **缺点**：
  - 手动计算虚拟属性，增加了额外的代码逻辑。

### **总结**

| 功能/操作                | 使用 Mongoose                      | 不使用 Mongoose                              |
| ------------------------ | ---------------------------------- | -------------------------------------------- |
| **数据模型定义与验证**   | 使用 Schema 定义，自动验证数据     | 手动验证数据，缺少内建验证机制               |
| **CRUD 操作**            | 提供封装的 API，简洁的查询和更新   | 需要手动处理连接、查询和操作数据，代码更冗长 |
| **数据验证**             | 自动验证数据格式和类型，易于管理   | 需要手动验证数据是否合法，增加了复杂性       |
| **中间件（Middleware）** | 支持在数据操作前后插入自定义逻辑   | 手动在操作前后插入逻辑，没有中间件机制       |
| **聚合查询**             | 简单的 API，支持复杂的聚合操作     | 需要手动编写聚合管道，代码较复杂             |
| **虚拟属性**             | 支持虚拟属性，方便计算和格式化数据 | 手动计算虚拟属性，增加了额外的代码           |

通过以上对比，可以看出使用 **Mongoose** 提供了更多的高层次抽象和简化的 API，减少了手动验证、数据操作和额外的逻辑处理。而 **MongoDB Node.js Driver** 提供的是更原生的 API，需要开发者手动处理许多细节，虽然灵活但工作量较大。
