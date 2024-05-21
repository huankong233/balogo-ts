import Koa from 'koa'
import { koaBody } from 'koa-body'
import { BaLogoCanvas } from './BaLogoCanvas.ts'
import { RuntimeParams, getConfig } from './config.ts'

const config = getConfig()
const canvas = new BaLogoCanvas(config)

const app = new Koa()

app.use(koaBody({ multipart: true }))

app.use(async (ctx) => {
  const { query, body, files } = ctx.request

  let params: RuntimeParams

  try {
    params = canvas.prepareParams(query, body, files)
  } catch (error) {
    if (error instanceof Error) {
      ctx.body = { code: 409, message: error.message }
    } else {
      ctx.body = { code: 409, message: 'params error' }
    }
    return
  }

  try {
    const image = await canvas.draw(params)

    switch (params.type) {
      case 'image':
        ctx.set('content-type', 'image/png')
        ctx.body = image
        break
      case 'json':
        ctx.body = { code: 200, message: 'ok', data: { image: image.toString(params.encode) } }
        break
    }
  } catch (error) {
    ctx.body = { code: 500, message: 'Serevr Error' }
  }
})

app.listen(config.port)

console.info(`server is running on port ${config.port}`)
