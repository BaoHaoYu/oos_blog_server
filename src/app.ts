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

// logger
app.use(async (ctx, next) => {
  const start: any = new Date()
  await next()
  const end: any = new Date()
  const ms: any = end - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(koaStatic('/opt/www/hexo-blog/public'))

// routes
app.use(index.routes()).use(index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

export default app
