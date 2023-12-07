export default {
  port: parseInt((process.env.port ?? 3000).toString()),
  transparent: (process.env.transparent ?? false).toString() === 'true',
  bgColor: process.env.bgColor ?? '#fff',
  textLColor: process.env.textLColor ?? '#128AFA',
  textRColor: process.env.textRColor ?? '#2B2B2B',
  bgimageX: parseInt((process.env.bgimageX ?? 0).toString()),
  bgimageY: parseInt((process.env.bgimageY ?? 0).toString()),
  hideHalo: (process.env.hideHalo ?? false).toString() === 'true',
  hideCross: (process.env.hideCross ?? false).toString() === 'true',
  canvasHeight: parseInt((process.env.canvasHeight ?? 250).toString()),
  canvasWidth: parseInt((process.env.canvasWidth ?? 900).toString()),
  fontSize: parseInt((process.env.fontSize ?? 84).toString()),
  paddingX: parseInt((process.env.paddingX ?? 10).toString()),
  textBaseLine: 0.68,
  horizontalTilt: -0.4,
  graphOffset: { X: -15, Y: 0 },
  hollowPath: [
    [284, 136],
    [321, 153],
    [159, 410],
    [148, 403]
  ]
}
