import type { Canvas, CanvasRenderingContext2D } from 'canvas'
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
  graphX?: number
  graphY?: number
  transparent?: string | boolean
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

  constructor(query: queryParams, body: queryParams) {
    this.#canvas = createCanvas(config.canvasWidth, config.canvasHeight)
    this.#ctx = this.#canvas.getContext('2d')

    this.#textL = query.textL ?? body.textL ?? 'Blue'
    this.#textR = query.textR ?? body.textR ?? 'Archive'
    this.#graphOffset = {
      X: query.graphX ?? body.graphX ?? config.graphOffset.X,
      Y: query.graphY ?? body.graphY ?? config.graphOffset.Y
    }

    const transparent = query.transparent ?? body.transparent
    this.#transparent = transparent ? transparent.toString() === 'true' : config.transparent
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
      this.#ctx.fillStyle = '#fff'
      this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
    }

    //blue text -> halo -> black text -> cross
    this.#ctx.font = this.#font
    this.#ctx.fillStyle = '#128AFA'
    this.#ctx.textAlign = 'end'
    this.#ctx.setTransform(1, 0, config.horizontalTilt, 1, 0, 0)
    this.#ctx.fillText(this.#textL, this.#canvasWidthL, this.#canvas.height * config.textBaseLine)
    this.#ctx.resetTransform() //restore don't work
    this.#ctx.drawImage(
      global.halo,
      this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
      this.#graphOffset.Y,
      config.canvasHeight,
      config.canvasHeight
    )

    this.#ctx.fillStyle = '#2B2B2B'
    this.#ctx.textAlign = 'start'
    if (this.#transparent) {
      this.#ctx.globalCompositeOperation = 'destination-out'
    }
    this.#ctx.strokeStyle = 'white'
    this.#ctx.lineWidth = 12
    this.#ctx.setTransform(1, 0, config.horizontalTilt, 1, 0, 0)
    this.#ctx.strokeText(this.#textR, this.#canvasWidthL, this.#canvas.height * config.textBaseLine)
    this.#ctx.globalCompositeOperation = 'source-over'
    this.#ctx.fillText(this.#textR, this.#canvasWidthL, this.#canvas.height * config.textBaseLine)
    this.#ctx.resetTransform()
    const graph = {
      X: this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
      Y: this.#graphOffset.Y
    }
    this.#ctx.beginPath()
    this.#ctx.moveTo(
      graph.X + (config.hollowPath[0][0] / 500) * config.canvasHeight,
      graph.Y + (config.hollowPath[0][1] / 500) * config.canvasHeight
    )

    for (let i = 1; i < 4; i++) {
      this.#ctx.lineTo(
        graph.X + (config.hollowPath[i][0] / 500) * config.canvasHeight,
        graph.Y + (config.hollowPath[i][1] / 500) * config.canvasHeight
      )
    }
    this.#ctx.closePath()
    if (this.#transparent) {
      this.#ctx.globalCompositeOperation = 'destination-out'
    }
    this.#ctx.fillStyle = 'white'
    this.#ctx.fill()
    this.#ctx.globalCompositeOperation = 'source-over'
    this.#ctx.drawImage(
      global.cross,
      this.#canvasWidthL - this.#canvas.height / 2 + this.#graphOffset.X,
      this.#graphOffset.Y,
      config.canvasHeight,
      config.canvasHeight
    )

    return this.#canvas.toBuffer('image/png')
  }

  setWidth() {
    this.#textWidthL =
      this.#textMetricsL!.width -
      (config.textBaseLine * config.canvasHeight + this.#textMetricsL!.fontBoundingBoxDescent * 2) *
        config.horizontalTilt

    this.#textWidthR =
      this.#textMetricsR!.width +
      (config.textBaseLine * config.canvasHeight - this.#textMetricsR!.fontBoundingBoxDescent * 2) *
        config.horizontalTilt

    //extend canvas
    if (this.#textWidthL + config.paddingX > config.canvasWidth / 2) {
      this.#canvasWidthL = this.#textWidthL + config.paddingX
    } else {
      this.#canvasWidthL = config.canvasWidth / 2
    }

    if (this.#textWidthR + config.paddingX > config.canvasWidth / 2) {
      this.#canvasWidthR = this.#textWidthR + config.paddingX
    } else {
      this.#canvasWidthR = config.canvasWidth / 2
    }

    this.#canvas.width = this.#canvasWidthL + this.#canvasWidthR
  }
}
