import type { Canvas, CanvasRenderingContext2D } from 'canvas'
import type { File } from 'formidable'
import { createCanvas, loadImage, registerFont } from 'canvas'
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
    loadImage(path.join(baseDir, './image/halo.png')).then(img => (global.halo = img)),
    loadImage(path.join(baseDir, './image/cross.png')).then(img => (global.cross = img))
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
  bgimageX?: string | number
  bgimageY?: string | number
  bgimageW?: string | number
  bgimageH?: string | number
}

export class LogoCanvas {
  #canvas: Canvas
  #ctx: CanvasRenderingContext2D
  #textL: string
  #textR: string
  #graphOffset: {
    X: number
    Y: number
  }
  #transparent: boolean
  #textMetricsL: TextMetrics | null = null
  #textMetricsR: TextMetrics | null = null

  #canvasWidthL: number = config.canvasWidth / 2
  #canvasWidthR: number = config.canvasWidth / 2

  #textWidthL = 0
  #textWidthR = 0

  #font = `${config.fontSize}px GlowSansSC-Normal-Heavy, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif`

  #bgColor: string = config.bgColor
  #textLColor: string = config.textLColor
  #textRColor: string = config.textRColor

  #hideHalo: boolean = config.hideHalo
  #hideCross: boolean = config.hideCross

  #bgImage: File | null = null

  #bgImageX: number
  #bgImageY: number

  #bgImageW: number
  #bgImageH: number

  constructor(query: queryParams, body: queryParams, files: { bgImage?: File | undefined } = {}) {
    this.#canvas = createCanvas(config.canvasWidth, config.canvasHeight)
    this.#ctx = this.#canvas.getContext('2d')

    this.#textL = query.textL ?? body.textL ?? 'Blue'
    this.#textR = query.textR ?? body.textR ?? 'Archive'

    this.#graphOffset = {
      X: parseInt((query.graphX ?? body.graphX ?? config.graphOffset.X).toString()),
      Y: parseInt((query.graphY ?? body.graphY ?? config.graphOffset.Y).toString())
    }

    this.#transparent =
      (query.transparent ?? body.transparent ?? config.transparent).toString() === 'true'

    this.#bgColor = query.bgColor ?? body.bgColor ?? config.bgColor

    this.#textLColor = query.textLColor ?? body.textLColor ?? config.textLColor
    this.#textRColor = query.textRColor ?? body.textRColor ?? config.textRColor

    this.#hideHalo = (query.hideHalo ?? body.hideHalo ?? config.hideHalo).toString() === 'true'
    this.#hideCross = (query.hideCross ?? body.hideCross ?? config.hideCross).toString() === 'true'

    this.#bgImage = files.bgImage ?? null

    this.#bgImageX = parseInt((query.bgimageX ?? body.bgimageX ?? config.bgimageX).toString())
    this.#bgImageY = parseInt((query.bgimageY ?? body.bgimageY ?? config.bgimageY).toString())
    this.#bgImageW = parseInt((query.bgimageW ?? body.bgimageW ?? 0).toString())
    this.#bgImageH = parseInt((query.bgimageH ?? body.bgimageH ?? 0).toString())
  }

  async draw() {
    this.#ctx.font = this.#font
    this.#textMetricsL = this.#ctx.measureText(this.#textL)
    this.#textMetricsR = this.#ctx.measureText(this.#textR)

    this.setWidth()

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
    this.#ctx.setTransform(1, 0, config.horizontalTilt, 1, 0, 0)
    this.#ctx.fillText(this.#textL, this.#canvasWidthL, this.#canvas.height * config.textBaseLine)
    this.#ctx.resetTransform() //restore don't work

    if (!this.#hideHalo) {
      this.#ctx.drawImage(
        global.halo,
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
        this.#canvas.height * config.textBaseLine
      )
    }

    this.#ctx.setTransform(1, 0, config.horizontalTilt, 1, 0, 0)

    this.#ctx.globalCompositeOperation = 'source-over'
    this.#ctx.fillText(this.#textR, this.#canvasWidthL, this.#canvas.height * config.textBaseLine)
    this.#ctx.resetTransform()
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
        global.cross,
        this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
        this.#graphOffset.Y,
        this.#canvas.height,
        this.#canvas.height
      )
    }

    return this.#canvas.toBuffer('image/png')
  }

  setWidth() {
    // TODO: 需要等待 `node-canvas` 修复缺失的属性

    if (!this.#textMetricsL || !this.#textMetricsR) return

    this.#textWidthL = this.#textMetricsL.width + 160
    this.#textWidthR = this.#textMetricsR.width + 50

    this.#canvasWidthL = this.#textWidthL + config.paddingX
    this.#canvasWidthR = this.#textWidthR + config.paddingX

    this.#canvas.width = this.#canvasWidthL + this.#canvasWidthR
  }
}
