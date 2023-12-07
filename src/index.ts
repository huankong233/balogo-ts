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

  switch (ctx.request.query.type ?? ctx.request.body.type ?? 'image') {
    case 'image':
      ctx.set('content-type', 'image/png')
      ctx.body = image
      break
    case 'json':
      const encode = ctx.request.query.encode ?? ctx.request.body.encode ?? 'base64'
      ctx.body = {
        code: 200,
        data: {
          image: image.toString(encode)
        }
      }
      break
    default:
      ctx.body = {
        code: 400,
        message: 'type error'
      }
      break
  }
})

app.listen(config.port)

console.log(`server is running on port ${config.port}`)
