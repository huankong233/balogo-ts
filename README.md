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

| 参数名        | 类型      | 介绍                                      | 默认值                                     |
| ------------- | --------- | ----------------------------------------- | ------------------------------------------ |
| `textL`       | `string`  | 左侧文本                                  | `Blue`                                     |
| `textR`       | `string`  | 右侧文本                                  | `Archive`                                  |
| `graphX`      | `number`  | 光环 `X` 方向位移                         | `-15`                                      |
| `graphY`      | `number`  | 光环 `Y` 方向位移                         | `0`                                        |
| `transparent` | `boolean` | 背景透明                                  | `false`                                    |
| `bgColor`     | `string`  | 背景颜色 需要非透明                       | `#fff`                                     |
| `textLColor`  | `string`  | 左侧文本颜色                              | `#128AFA`                                  |
| `textRColor`  | `string`  | 右侧文本颜色                              | `#2B2B2B`                                  |
| `hideHalo`    | `boolean` | 隐藏 `Halo`                               | `false`                                    |
| `hideCross`   | `boolean` | 隐藏 `Cross`                              | `false`                                    |
| `type`        | `string`  | 是否使用 `JSON` 输出                      | `image`                                    |
| `encode`      | `string`  | 使用 `JSON` 输出的格式 (`Buffer`可用格式) | `base64`                                   |
| `bgImage`     | `File`    | 背景图片 需要使用表单提交                 | `undefined`                                |
| `bgImageX`    | `Number`  | 背景图片 X 坐标                           | `0`                                        |
| `bgImageY`    | `Number`  | 背景图片 Y 坐标                           | `0`                                        |
| `bgImageW`    | `Number`  | 背景图片 宽度                             | `画布宽度` 如果设置了X或Y则为 `画布宽度-X` |
| `bgImageH`    | `Number`  | 背景图片 高度                             | `画布高度` 如果设置了X或Y则为 `画布高度-Y` |

## 存在问题

- 存在文本不能过长的问题，已提交 [issues](https://github.com/Automattic/node-canvas/issues/2321) (已使用缓解措施)
- 存在错误的类型错误，已提交 [pr](https://github.com/Automattic/node-canvas/pull/2322)

