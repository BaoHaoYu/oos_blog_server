import cors from '@koa/cors'
import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import json from 'koa-json'
import logger from 'koa-logger'
// @ts-ignore
import onerror from 'koa-onerror'
import koaStatic from 'koa-static'
// import path from 'path'
import index from './routes/index'
import config from './config'

const app = new Koa()

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())
app.use(cors())

// 缓存一个月
app.use(koaStatic(config.blogPublic, { maxage: 2592000 }))

// routes
app.use(index.routes()).use(index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

export default app
