# P5 预告信生成器

Koishi 插件：把文字生成《女神异闻录5》风格的预告信与 UI 图片

[![GitHub](https://img.shields.io/badge/GitHub-仓库-181717)](https://github.com/araea/koishi-plugin-p5-advance-letter-generator)
[![npm](https://img.shields.io/badge/npm-包-CC0000)](https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator)

## 安装

```sh
yarn add koishi-plugin-p5-advance-letter-generator
```

启用插件并安装 `puppeteer` 服务。自定义字体放入 `data/p5-advance-letter-generator/fonts/`。

## 快速使用

发送 `p5letter.生成预告信 我们是怪盗团` 生成一张预告信，文本里的 `/` 表示换行。改用 `p5letter.生成UI` 生成 UI 风格图片。

## 指令

| 指令 | 说明 |
| --- | --- |
| `p5letter` | 查看帮助（别名 `p5advanceLetter`） |
| `p5letter.生成预告信 <text:text>` | 生成 P5 预告信 |
| `p5letter.生成UI <text:text>` | 生成 UI 风格图片 |

`-w <宽度>` 与 `--height <高度>` 设置图片尺寸。

## 配置

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `imageType` | `'png' \| 'jpeg' \| 'webp'` | `'png'` | 生成的图片格式 |
| `fonts` | `string[]` | `['微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀']` | 随机取用的字体族 |
| `canvasWidth` | `number` | `1770` | 默认画布宽度（像素） |
| `canvasHeight` | `number` | `1300` | 默认画布高度（像素） |

## 限制 / 风险

需要 `puppeteer` 服务，渲染失败会回退为纯文本。自定义字体文件放入 `data/p5-advance-letter-generator/fonts/`，文件名（去掉扩展名）即字体族名，同名覆盖内置字体。

## 必要链接

- GitHub：`https://github.com/araea/koishi-plugin-p5-advance-letter-generator`
- npm：`https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator`
