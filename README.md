# balogo-ts

## 介绍

使用 `koa` + `node-canvas` 复刻 [Bluearchive-logo](https://github.com/nulla2011/Bluearchive-logo) 项目

## 部署

### 普通部署 

1.需要安装:
- `nodejs`
- `pnpm`

2.克隆项目

3.安装完成后执行 `pnpm install` 安装依赖

4.最后使用 `pnpm run start` 即可启动项目

### `docker` 部署

1.获取镜像 `https://hub.docker.com/r/huankong233/balogo-ts`即可启动

配置文件可以使用环境变量

## 请求路径

任意路径都可完成绘制

## 请求参数

| 参数名             | 类型      | 介绍                                      | 默认值                                     |
| ------------------ | --------- | ----------------------------------------- | ------------------------------------------ |
| `textL`            | `string`  | 左侧文本                                  | `Blue`                                     |
| `textR`            | `string`  | 右侧文本                                  | `Archive`                                  |
| `graphX`           | `number`  | 光环 `X` 方向位移                         | `-15`                                      |
| `graphY`           | `number`  | 光环 `Y` 方向位移                         | `0`                                        |
| `transparent`      | `boolean` | 背景透明                                  | `false`                                    |
| `bgColor`          | `string`  | 背景颜色 需要背景非透明                   | `#fff`                                     |
| `textLColor`       | `string`  | 左侧文本颜色                              | `#128AFA`                                  |
| `textRColor`       | `string`  | 右侧文本颜色                              | `#2B2B2B`                                  |
| `hideHalo`         | `boolean` | 隐藏 `Halo`                               | `false`                                    |
| `hideCross`        | `boolean` | 隐藏 `Cross`                              | `false`                                    |
| `type`             | `string`  | 是否使用 `JSON` 输出                      | `image`                                    |
| `encode`           | `string`  | 使用 `JSON` 输出的格式 (`Buffer`可用格式) | `base64`                                   |
| `bgImage`          | `File`    | 背景图片 需要使用表单提交 并且 背景非透明 | `undefined`                                |
| `bgImageX`         | `number`  | 背景图片 X 坐标                           | `0`                                        |
| `bgImageY`         | `number`  | 背景图片 Y 坐标                           | `0`                                        |
| `bgImageW`         | `number`  | 背景图片 宽度                             | `画布宽度` 如果设置了X或Y则为 `画布宽度-X` |
| `bgImageH`         | `number`  | 背景图片 高度                             | `画布高度` 如果设置了X或Y则为 `画布高度-Y` |
| `fontSize`         | `number`  | 标题字体大小                              | `84`                                       |
| `scale`            | `number`  | 缩放比例                                  | `1`                                        |
| `subtitle`         | `string`  | 副标题                                    | `null`                                     |
| `subtitleFontSize` | `number`  | 副标题大小                                | `36`                                       |
| `subtitleColor`    | `string`  | 副标题颜色                                | `textRColor`                               |
| `subtitleAlign`    | `string`  | 副标题对齐方式                            | `center`                                   |
| `crossColor`       | `string`  | 十字架颜色                                | `#128AFA`                                  |
| `haloColor`        | `string`  | 光环颜色                                  | `#2B2B2B`                                  |
| `textBaseLine`     | `number`  | 文字绘制基线 精确到第二位的小数           | `0.68`                                     |
| `horizontalTilt`   | `number`  | 倾斜度 需要是负数                         | `-0.4`                                     |

## 存在问题

- 存在文本不能过长的问题，已提交 [issues](https://github.com/Automattic/node-canvas/issues/2321) (已使用缓解措施)
- 存在错误的类型错误，已提交 [pr](https://github.com/Automattic/node-canvas/pull/2322)

