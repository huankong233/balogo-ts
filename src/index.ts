import Koa from 'koa'
import { koaBody } from 'koa-body'
import config from './config.ts'
import { LogoCanvas, init } from './LogoCanvas.ts'

await init()

const app = new Koa()

app.use(koaBody({ multipart: true }))

app.use(async ctx => {
  const logo = new LogoCanvas(ctx.request.query, ctx.request.body as any)
  const image = await logo.draw()

  if (ctx.request.query.type ?? ctx.request.body.type === 'json') {
    ctx.body = {
      code: 200,
      data: {
        image: image.toString(ctx.request.query.encode ?? ctx.request.body.encode ?? 'base64')
      }
    }
  } else {
    ctx.set('content-type', 'image/png')
    ctx.body = image
  }
})

app.listen(config.port)

console.log(`server is running on port ${config.port}`)
