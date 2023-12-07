export default {
  port: process.env.port ?? 3000,
  transparent: process.env.transparent ?? false,
  bgColor: process.env.bgColor ?? '#fff',
  textLColor: process.env.textLColor ?? '#128AFA',
  textRColor: process.env.textRColor ?? '#2B2B2B',
  bgImageX: process.env.bgimageX ?? 0,
  bgImageY: process.env.bgimageY ?? 0,
  hideHalo: process.env.hideHalo ?? false,
  hideCross: process.env.hideCross ?? false,
  scale: process.env.scale ?? 1,
  canvasHeight: process.env.canvasHeight ?? 250,
  canvasWidth: process.env.canvasWidth ?? 900,
  fontSize: process.env.fontSize ?? 84,
  subtitleFontSize: process.env.subtitleFontSize ?? 36,
  subtitleAlign: (process.env.subtitleAlign ?? 'center') as CanvasTextAlign,
  crossColor: process.env.crossColor ?? '#128AFA',
  haloColor: process.env.haloColor ?? '#2B2B2B',
  paddingX: process.env.paddingX ?? 10,
  textBaseLine: process.env.textBaseLine ?? 0.68,
  horizontalTilt: process.env.horizontalTilt ?? -0.4,
  graphOffset: { X: process.env.graphX ?? -15, Y: process.env.graphY ?? 0 },
  hollowPath: [
    [284, 136],
    [321, 153],
    [159, 410],
    [148, 403]
  ]
}
