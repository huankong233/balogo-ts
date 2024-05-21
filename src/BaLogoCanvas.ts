import { Image, createCanvas, loadImage, registerFont } from 'canvas'
import { readFileSync } from 'fs'
import path from 'path'
import url from 'url'
import type { Config, FileParams, QueryParams, RuntimeParams } from './config.ts'

export class BaLogoCanvas {
  #config: Config
  #cross: string
  #halo: string

  constructor(config: Config) {
    this.#config = config
    const baseDir = path.dirname(url.fileURLToPath(import.meta.url))
    registerFont(path.join(baseDir, './font/GlowSansSC-Normal-Heavy.otf'), {
      family: 'GlowSansSC-Normal-Heavy'
    })
    this.#cross = readFileSync(path.join(baseDir, './image/cross.svg'), 'utf-8')
    this.#halo = readFileSync(path.join(baseDir, './image/halo.svg'), 'utf-8')
  }

  #query?: QueryParams
  #body?: QueryParams

  getParam<T extends keyof QueryParams>(key: T): Config[T] {
    const defaultValue = this.#config[key]
    const value = this.#query?.[key] ?? this.#body?.[key]
    if (!value) return defaultValue

    if (key === 'type') {
      if (['json', 'image'].indexOf(value) === -1) throw new Error('Invalid type')
    } else if (key === 'subtitleAlign') {
      if (['center', 'end', 'left', 'right', 'start'].indexOf(value) === -1)
        throw new Error('Invalid subtitleAlign')
    } else if (key === 'encode') {
      if (
        [
          'ascii',
          'utf8',
          'utf-8',
          'utf16le',
          'utf-16le',
          'ucs2',
          'ucs-2',
          'base64',
          'base64url',
          'latin1',
          'binary',
          'hex'
        ].indexOf(value) === -1
      )
        throw new Error('Invalid encode')
    }

    if (typeof value === 'number') {
      return parseFloat(value) as Config[T]
    } else if (typeof value === 'boolean') {
      return (value === 'true' || value === true) as Config[T]
    }

    return value as Config[T]
  }

  prepareParams(query: QueryParams, body: QueryParams, files: FileParams = {}): RuntimeParams {
    this.#query = query
    this.#body = body

    const font = this.#config._font

    const scale = this.getParam('scale')
    const fontSize = this.getParam('fontSize') * scale
    const subtitleFontSize = this.getParam('subtitleFontSize') * scale

    return {
      hollowPath: this.#config.hollowPath,
      encode: this.getParam('encode'),
      type: this.getParam('type'),
      canvasHeight: this.getParam('canvasHeight') * scale,
      canvasWidth: this.getParam('canvasWidth') * scale,
      scale,
      paddingX: this.getParam('paddingX') * scale,
      textL: this.getParam('textL'),
      textR: this.getParam('textR'),
      font: `${fontSize}px ${font}`,
      fontSize,
      textBaseLine: this.getParam('textBaseLine'),
      horizontalTilt: this.getParam('horizontalTilt'),
      subtitle: this.getParam('subtitle'),
      subtitleColor: this.getParam('subtitleColor'),
      subtitleAlign: this.getParam('subtitleAlign'),
      subtitleFont: `${subtitleFontSize}px ${font}`,
      subtitleFontSize,
      transparent: this.getParam('transparent'),
      bgColor: this.getParam('bgColor'),
      textLColor: this.getParam('textLColor'),
      textRColor: this.getParam('textRColor'),
      graphX: this.getParam('graphX') * scale,
      graphY: this.getParam('graphY') * scale,
      bgImage: files.bgImage ?? false,
      bgImageX: this.getParam('bgImageX') * scale,
      bgImageY: this.getParam('bgImageY') * scale,
      bgImageW: this.getParam('bgImageW') * scale,
      bgImageH: this.getParam('bgImageH') * scale,
      hideHalo: this.getParam('hideHalo'),
      hideCross: this.getParam('hideCross'),
      haloColor: this.getParam('haloColor'),
      crossColor: this.getParam('crossColor')
    }
  }

  async draw(params: RuntimeParams) {
    const canvas = createCanvas(
      params.canvasWidth * params.scale,
      params.canvasHeight * params.scale
    )
    const ctx = canvas.getContext('2d')

    ctx.font = params.font

    const textMetricsL = ctx.measureText(params.textL)
    const textMetricsR = ctx.measureText(params.textR)

    // TODO: 需要等待 `node-canvas` 修复缺失的属性
    const textWidthL = textMetricsL.width + 160 * params.scale * params.scale
    const textWidthR = textMetricsR.width + 50 * params.scale * params.scale

    const canvasWidthL = textWidthL + params.paddingX
    const canvasWidthR = textWidthR + params.paddingX

    canvas.width = canvasWidthL + canvasWidthR

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Background
    if (!params.transparent) {
      if (params.bgColor) {
        ctx.fillStyle = params.bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (params.bgImage) {
        // 重新计算 bgImage 的宽高
        if (params.bgImageW === 0) params.bgImageW = canvas.width - params.bgImageX
        if (params.bgImageH === 0) params.bgImageH = canvas.height - params.bgImageY

        ctx.drawImage(
          await loadImage(params.bgImage.filepath),
          params.bgImageX,
          params.bgImageY,
          params.bgImageW,
          params.bgImageH
        )
      }
    }

    //blue text -> halo -> black text -> cross
    ctx.font = params.font
    ctx.fillStyle = params.textLColor
    ctx.textAlign = 'end'
    // @ts-ignore
    ctx.setTransform(1, 0, params.horizontalTilt, 1, 0, 0)
    ctx.fillText(params.textL, canvasWidthL, canvas.height * params.textBaseLine)
    ctx.resetTransform() //restore don't work

    if (!params.hideHalo) {
      ctx.drawImage(
        await this.loadSvgAndChangeColor(this.#halo, params.haloColor),
        canvasWidthL - canvas.height / 2 + params.graphX,
        params.graphY,
        canvas.height,
        canvas.height
      )
    }

    ctx.fillStyle = params.textRColor
    ctx.textAlign = 'start'
    if (params.transparent) ctx.globalCompositeOperation = 'destination-out'
    if (!params.bgImage) {
      ctx.strokeStyle = params.bgColor
      ctx.lineWidth = 12
      ctx.strokeText(params.textR, canvasWidthL, canvas.height * params.textBaseLine)
    }

    // @ts-ignore
    ctx.setTransform(1, 0, params.horizontalTilt, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillText(params.textR, canvasWidthL, canvas.height * params.textBaseLine)
    ctx.resetTransform()

    if (params.subtitle) {
      ctx.font = params.subtitleFont
      // @ts-ignore
      ctx.setTransform(1, 0, params.horizontalTilt * 1, 1, 0, 0)
      ctx.textAlign = params.subtitleAlign
      ctx.fillStyle = params.subtitleColor
      ctx.fillText(
        params.subtitle,
        canvasWidthL + textWidthR / 2,
        canvas.height * params.textBaseLine + params.subtitleFontSize + 15 * params.scale
      )
      ctx.resetTransform()
    }

    const graphX = canvasWidthL - canvas.height / 2 + params.graphX
    const graphY = params.graphY

    ctx.beginPath()
    ctx.moveTo(
      graphX + (params.hollowPath[0][0] / 500) * canvas.height,
      graphY + (params.hollowPath[0][1] / 500) * canvas.height
    )

    for (let i = 1; i < 4; i++) {
      ctx.lineTo(
        graphX + (params.hollowPath[i][0] / 500) * canvas.height,
        graphY + (params.hollowPath[i][1] / 500) * canvas.height
      )
    }
    ctx.closePath()

    if (params.transparent) ctx.globalCompositeOperation = 'destination-out'

    if (!params.bgImage) {
      ctx.fillStyle = params.bgColor
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    if (!params.hideCross) {
      ctx.drawImage(
        await this.loadSvgAndChangeColor(this.#cross, params.crossColor),
        canvasWidthL - canvas.height / 2 + params.graphX,
        params.graphY,
        canvas.height,
        canvas.height
      )
    }

    return canvas.toBuffer('image/png')
  }

  async loadSvgAndChangeColor(src: string, color: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onerror = reject
      image.onload = () => resolve(image)
      image.src = Buffer.from(src.replace('<path ', `<path fill="${color}" `))
    })
  }
}
