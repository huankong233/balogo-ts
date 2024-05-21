import { File } from 'formidable'

export interface FileParams {
  bgImage?: File
}

export interface QueryParams {
  type?: string
  encode?: BufferEncoding
  canvasHeight?: string
  canvasWidth?: string
  scale?: string
  paddingX?: string
  textL?: string
  textR?: string
  fontSize?: string
  textBaseLine?: string
  horizontalTilt?: string
  subtitle?: string
  subtitleColor?: string
  subtitleAlign?: string
  subtitleFontSize?: string
  transparent?: string
  bgColor?: string
  textLColor?: string
  textRColor?: string
  graphX?: string
  graphY?: string
  bgImageX?: string
  bgImageY?: string
  bgImageW?: string
  bgImageH?: string
  hideHalo?: string
  hideCross?: string
  haloColor?: string
  crossColor?: string
}

export interface RuntimeParams {
  hollowPath: number[][]
  type: 'json' | 'image'
  encode: BufferEncoding
  canvasHeight: number
  canvasWidth: number
  scale: number
  paddingX: number
  textL: string
  textR: string
  font: string
  fontSize: number
  textBaseLine: number
  horizontalTilt: number
  subtitle: string
  subtitleColor: string
  subtitleAlign: CanvasTextAlign
  subtitleFont: string
  subtitleFontSize: number
  transparent: boolean
  bgColor: string
  textLColor: string
  textRColor: string
  graphX: number
  graphY: number
  bgImage: File | false
  bgImageX: number
  bgImageY: number
  bgImageW: number
  bgImageH: number
  hideHalo: boolean
  hideCross: boolean
  haloColor: string
  crossColor: string
}

export interface Config extends RuntimeParams {
  port: number
  hollowPath: number[][]
  _font: string
}

function getEnv<T extends keyof Config, V>(key: T, defaultValue: V) {
  return process.env[key] ?? defaultValue
}

export function getConfig() {
  const type = getEnv('type', 'image')
  if (['json', 'image'].indexOf(type) === -1) throw new Error('Invalid default type config')
  const subtitleAlign = getEnv('subtitleAlign', 'center')
  if (['center', 'end', 'left', 'right', 'start'].indexOf(subtitleAlign) === -1)
    throw new Error('Invalid default subtitleAlign config')
  const encode = getEnv('encode', 'base64url')
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
    ].indexOf(encode) === -1
  )
    throw new Error('Invalid default encode config')

  const font =
    'GlowSansSC-Normal-Heavy, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif'

  const scale = parseFloat(getEnv('scale', '1'))
  const fontSize = parseFloat(getEnv('fontSize', '84')) * scale
  const subtitleFontSize = parseFloat(getEnv('subtitleFontSize', '36')) * scale

  const config: Config = {
    port: parseFloat(process.env.port ?? '3000'),
    hollowPath: [
      [284, 136],
      [321, 153],
      [159, 410],
      [148, 403]
    ],
    _font: font,
    type: type as Config['type'],
    encode: encode as BufferEncoding,
    canvasHeight: parseFloat(getEnv('canvasHeight', '250')) * scale,
    canvasWidth: parseFloat(getEnv('canvasWidth', '900')) * scale,
    scale,
    paddingX: parseFloat(getEnv('paddingX', '10')) * scale,
    textL: getEnv('textL', 'Blue'),
    textR: getEnv('textR', 'Archive'),
    font: `${fontSize}px ${font}`,
    fontSize,
    textBaseLine: parseFloat(getEnv('textBaseLine', '0.68')),
    horizontalTilt: parseFloat(getEnv('horizontalTilt', '-0.4')),
    subtitle: getEnv('subtitle', ''),
    subtitleColor: getEnv('subtitleColor', '#128AFA'),
    subtitleAlign: subtitleAlign as CanvasTextAlign,
    subtitleFont: `${subtitleFontSize}px ${font}`,
    subtitleFontSize,
    transparent: getEnv('transparent', 'false') === 'true',
    bgColor: getEnv('bgColor', '#ffffff'),
    textLColor: getEnv('textLColor', '#128AFA'),
    textRColor: getEnv('textRColor', '#2B2B2B'),
    graphX: parseFloat(getEnv('graphX', '-15')) * scale,
    graphY: parseFloat(getEnv('graphY', '0')) * scale,
    bgImage: getEnv('bgImage', false) as File | false,
    bgImageX: parseFloat(getEnv('bgImageX', '0')) * scale,
    bgImageY: parseFloat(getEnv('bgImageY', '0')) * scale,
    bgImageW: parseFloat(getEnv('bgImageW', '0')) * scale,
    bgImageH: parseFloat(getEnv('bgImageH', '0')) * scale,
    hideHalo: getEnv('hideHalo', 'false') === 'true',
    hideCross: getEnv('hideCross', 'false') === 'true',
    haloColor: getEnv('haloColor', '#2B2B2B'),
    crossColor: getEnv('crossColor', '#128AFA')
  }
  return config
}
