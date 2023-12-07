import type { Canvas, CanvasRenderingContext2D } from 'canvas'
import type { File } from 'formidable'
import { createCanvas, loadImage, registerFont, Image } from 'canvas'
import { readFile } from 'fs/promises'
import config from './config.ts'
import path from 'path'
import url from 'url'

function getDir(importMeta: ImportMeta): string {
  return path.dirname(url.fileURLToPath(importMeta.url))
}

export const init = async () => {
  const baseDir = getDir(import.meta)
  registerFont(path.join(baseDir, './font/GlowSansSC-Normal-Heavy.otf'), {
    family: 'GlowSansSC-Normal-Heavy'
  })
  await Promise.all([
    await readFile(path.join(baseDir, './image/cross.svg')).then(
      img => (global.cross = img.toString('utf-8'))
    ),
    await readFile(path.join(baseDir, './image/halo.svg')).then(
      img => (global.halo = img.toString('utf-8'))
    )
  ])
}

interface queryParams {
  textL?: string
  textR?: string
  graphX?: number | string
  graphY?: number | string
  transparent?: string | boolean
  bgColor?: string
  textLColor?: string
  textRColor?: string
  hideHalo?: string | boolean
  hideCross?: string | boolean
  canvasWidth?: string | number
  canvasHeight?: string | number
  bgImageX?: string | number
  bgImageY?: string | number
  bgImageW?: string | number
  bgImageH?: string | number
  fontSize?: string | number
  scale?: string | number
  subtitle?: string
  subtitleFontSize?: string | number
  subtitleColor?: string
  subtitleAlign?: CanvasTextAlign
  crossColor?: string
  haloColor?: string
  textBaseLine?: string | number
  horizontalTilt?: string | number
}

export class LogoCanvas {
  #textL: string
  #textR: string
  #graphOffset: {
    X: number
    Y: number
  }
  #transparent: boolean
  #bgColor: string
  #textLColor: string
  #textRColor: string
  #hideHalo: boolean
  #hideCross: boolean
  #bgImage: File | null = null
  #bgImageX: number
  #bgImageY: number
  #bgImageW: number
  #bgImageH: number
  #scale: number
  #fontSize: number | null = null
  #subtitle: string | null = null
  #subtitleFontSize: number
  #subtitleColor: string
  #subtitleAlign: CanvasTextAlign
  #crossColor: string
  #haloColor: string
  #textBaseLine: number
  #horizontalTilt: number

  #canvas: Canvas
  #ctx: CanvasRenderingContext2D
  #textMetricsL: TextMetrics | null = null
  #textMetricsR: TextMetrics | null = null
  #canvasWidthL: number | null = null
  #canvasWidthR: number | null = null
  #paddingX: number

  #font =
    'GlowSansSC-Normal-Heavy, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif'

  #subtitleFont: string

  constructor(
    query: queryParams = {},
    body: queryParams = {},
    files: { bgImage?: File | undefined } = {}
  ) {
    this.#scale = parseFloat((query.scale ?? body.scale ?? config.scale).toString())

    this.#subtitle = query.subtitle ?? body.subtitle ?? null
    this.#subtitleFontSize =
      parseInt(
        (query.subtitleFontSize ?? body.subtitleFontSize ?? config.subtitleFontSize).toString()
      ) * this.#scale
    this.#subtitleFont = `${this.#subtitleFontSize}px ${this.#font}`
    this.#subtitleAlign = query.subtitleAlign ?? body.subtitleAlign ?? config.subtitleAlign

    this.#fontSize =
      parseInt((query.fontSize ?? body.fontSize ?? config.fontSize).toString()) * this.#scale
    this.#font = `${this.#fontSize}px ${this.#font}`

    this.#paddingX = parseInt(config.paddingX.toString()) * this.#scale

    this.#canvas = createCanvas(
      parseInt(config.canvasWidth.toString()) * this.#scale,
      parseInt(config.canvasHeight.toString()) * this.#scale
    )
    this.#ctx = this.#canvas.getContext('2d')

    this.#textL = query.textL ?? body.textL ?? 'Blue'
    this.#textR = query.textR ?? body.textR ?? 'Archive'

    this.#graphOffset = {
      X: parseInt((query.graphX ?? body.graphX ?? config.graphOffset.X).toString()) * this.#scale,
      Y: parseInt((query.graphY ?? body.graphY ?? config.graphOffset.Y).toString()) * this.#scale
    }

    this.#transparent =
      (query.transparent ?? body.transparent ?? config.transparent).toString() === 'true'

    this.#bgColor = query.bgColor ?? body.bgColor ?? config.bgColor

    this.#textLColor = query.textLColor ?? body.textLColor ?? config.textLColor
    this.#textRColor = query.textRColor ?? body.textRColor ?? config.textRColor
    this.#subtitleColor = query.subtitleColor ?? body.subtitleColor ?? this.#textRColor

    this.#hideHalo = (query.hideHalo ?? body.hideHalo ?? config.hideHalo).toString() === 'true'
    this.#hideCross = (query.hideCross ?? body.hideCross ?? config.hideCross).toString() === 'true'

    this.#bgImage = files.bgImage ?? null

    this.#bgImageX =
      parseInt((query.bgImageX ?? body.bgImageX ?? config.bgImageX).toString()) * this.#scale
    this.#bgImageY =
      parseInt((query.bgImageY ?? body.bgImageY ?? config.bgImageY).toString()) * this.#scale
    this.#bgImageW = parseInt((query.bgImageW ?? body.bgImageW ?? 0).toString()) * this.#scale
    this.#bgImageH = parseInt((query.bgImageH ?? body.bgImageH ?? 0).toString()) * this.#scale

    this.#crossColor = query.crossColor ?? body.crossColor ?? config.crossColor
    this.#haloColor = query.haloColor ?? body.haloColor ?? config.haloColor

    this.#textBaseLine = parseFloat(
      (query.textBaseLine ?? body.textBaseLine ?? config.textBaseLine).toString()
    )

    this.#horizontalTilt = parseFloat(
      (query.horizontalTilt ?? body.horizontalTilt ?? config.horizontalTilt).toString()
    )
  }

  async draw() {
    this.#ctx.font = this.#font
    this.#textMetricsL = this.#ctx.measureText(this.#textL)
    this.#textMetricsR = this.#ctx.measureText(this.#textR)

    // TODO: 需要等待 `node-canvas` 修复缺失的属性

    const textWidthL = this.#textMetricsL.width + 160 * this.#scale
    const textWidthR = this.#textMetricsR.width + 50 * this.#scale

    this.#canvasWidthL = textWidthL + this.#paddingX
    this.#canvasWidthR = textWidthR + this.#paddingX

    this.#canvas.width = this.#canvasWidthL + this.#canvasWidthR

    // clear canvas
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    //Background
    if (!this.#transparent) {
      this.#ctx.fillStyle = this.#bgColor
      this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
      if (this.#bgImage) {
        // 重新计算 bgImage 的宽高
        this.#bgImageW =
          this.#bgImageW !== 0 ? this.#bgImageW : this.#canvas.width - this.#bgImageX ?? 0
        this.#bgImageH =
          this.#bgImageH !== 0 ? this.#bgImageH : this.#canvas.height - this.#bgImageY ?? 0

        this.#ctx.drawImage(
          await loadImage(this.#bgImage.filepath),
          this.#bgImageX,
          this.#bgImageY,
          this.#bgImageW,
          this.#bgImageH
        )
      }
    }

    //blue text -> halo -> black text -> cross
    this.#ctx.font = this.#font
    this.#ctx.fillStyle = this.#textLColor
    this.#ctx.textAlign = 'end'
    this.#ctx.setTransform(1, 0, this.#horizontalTilt, 1, 0, 0)
    this.#ctx.fillText(this.#textL, this.#canvasWidthL, this.#canvas.height * this.#textBaseLine)
    this.#ctx.resetTransform() //restore don't work

    if (!this.#hideHalo) {
      this.#ctx.drawImage(
        await this.loadSvg(global.halo, this.#haloColor),
        this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
        this.#graphOffset.Y,
        this.#canvas.height,
        this.#canvas.height
      )
    }

    this.#ctx.fillStyle = this.#textRColor
    this.#ctx.textAlign = 'start'

    if (this.#transparent) {
      this.#ctx.globalCompositeOperation = 'destination-out'
    }

    if (!this.#bgImage) {
      this.#ctx.strokeStyle = this.#bgColor
      this.#ctx.lineWidth = 12
      this.#ctx.strokeText(
        this.#textR,
        this.#canvasWidthL,
        this.#canvas.height * this.#textBaseLine
      )
    }

    this.#ctx.setTransform(1, 0, this.#horizontalTilt, 1, 0, 0)

    this.#ctx.globalCompositeOperation = 'source-over'
    this.#ctx.fillText(this.#textR, this.#canvasWidthL, this.#canvas.height * this.#textBaseLine)
    this.#ctx.resetTransform()

    if (this.#subtitle) {
      this.#ctx.font = this.#subtitleFont
      this.#ctx.setTransform(1, 0, this.#horizontalTilt * 1, 1, 0, 0)
      this.#ctx.textAlign = this.#subtitleAlign
      this.#ctx.fillStyle = this.#subtitleColor
      this.#ctx.fillText(
        this.#subtitle,
        this.#canvasWidthL + textWidthR / 2,
        this.#canvas.height * this.#textBaseLine + this.#subtitleFontSize + 15 * this.#scale
      )
      this.#ctx.resetTransform()
    }

    const graph = {
      X: this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
      Y: this.#graphOffset.Y
    }
    this.#ctx.beginPath()
    this.#ctx.moveTo(
      graph.X + (config.hollowPath[0][0] / 500) * this.#canvas.height,
      graph.Y + (config.hollowPath[0][1] / 500) * this.#canvas.height
    )

    for (let i = 1; i < 4; i++) {
      this.#ctx.lineTo(
        graph.X + (config.hollowPath[i][0] / 500) * this.#canvas.height,
        graph.Y + (config.hollowPath[i][1] / 500) * this.#canvas.height
      )
    }
    this.#ctx.closePath()

    if (this.#transparent) {
      this.#ctx.globalCompositeOperation = 'destination-out'
    }

    if (!this.#bgImage) {
      this.#ctx.fillStyle = this.#bgColor
      this.#ctx.fill()
      this.#ctx.globalCompositeOperation = 'source-over'
    }

    if (!this.#hideCross) {
      this.#ctx.drawImage(
        await this.loadSvg(global.cross, this.#crossColor),
        this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
        this.#graphOffset.Y,
        this.#canvas.height,
        this.#canvas.height
      )
    }

    return this.#canvas.toBuffer('image/png')
  }

  async loadSvg(src: string, color: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onerror = reject
      image.onload = () => {
        resolve(image)
      }
      image.src = Buffer.from(src.replace('<path ', `<path fill="${color}" `))
    })
  }
}
