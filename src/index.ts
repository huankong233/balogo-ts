import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import config from './config.ts'
import { LogoCanvas, init } from './LogoCanvas.ts'

await init()

const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {
  const logo = new LogoCanvas(ctx.request.query)
  const image = await logo.draw()

  if (ctx.request.query.type === 'json') {
    ctx.body = {
      code: 200,
      data: {
        image: image.toString('base64')
      }
    }
  } else {
    ctx.set('content-type', 'image/png')
    ctx.body = image
  }
})

app.listen(config.port)

console.log(`server is running on port ${config.port}`)
