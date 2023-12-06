# balogo-ts

## 介绍

使用 `koa` + `node-canvas` 复刻 [Bluearchive-logo](https://github.com/nulla2011/Bluearchive-logo) 项目

## 请求参数

| 参数名        | 类型      | 介绍              | 默认值    |
| ------------- | --------- | ----------------- | --------- |
| `textL`       | `string`  | 左侧文本          | `Blue`    |
| `textR`       | `string`  | 右侧文本          | `Archive` |
| `graphX`      | `number`  | 光环 `X` 方向位移 | `-15`     |
| `graphY`      | `number`  | 光环 `Y` 方向位移 | `0`       |
| `transparent` | `boolean` | 背景透明          | `false`   |

## 存在问题

- 当前存在文本不能过长的问题，已提交 [issues](https://github.com/Automattic/node-canvas/issues/2321)

