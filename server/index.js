import express from 'express'
import bodyParser from 'body-parser'
// TODOS[2025-04-18 18:08]: bodyParser原理功能应用场景和特点
import mongoose from 'mongoose'
// TODOS[2025-04-18 18:09]: mongoose原理功能应用场景和特点
import cors from 'cors'
// TODOS[2025-04-18 18:09]: cors原理功能应用场景和特点，额外还需要了解nodemon作用
// TODOS[2025-04-18 12:07]: 在这里设置import和require的导入方法是有区别的，需要额外根据项目做下笔记
// TODOS[2025-04-18 20:31]: nodemon
//*需要在pacakge.json中加入"type":"module"来使用ES module module,require()是commonJS模块系统语法

//创建了一个 Express 应用实例，app 是整个应用的核心对象，用于定义路由、配置中间件以及处理 HTTP 请求和响应
const app = express('express')
app.use(bodyParser.json({limit:"30mb",extended:true}))
/**
 * 配置了 body-parser 中间件，用于解析 Content-Type: application/json 的请求体。
 * limit: "30mb"：限制请求体的大小为 30MB，防止过大的请求导致服务器内存耗尽。
 * extended: true：允许解析嵌套的复杂对象（使用 qs 库）。
 */
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
/**
 * 用于解析 application/x-www-form-urlencoded 格式的表单数据。
 */
app.use(cors())
/**
 * 用于启用跨域资源共享（CORS），允许其他域名的客户端访问该服务器的资源。
 */


