# P5 预告信生成器

Koishi 插件：把文字生成《女神异闻录5》风格的预告信与 UI 图片

[![GitHub](https://img.shields.io/badge/GitHub-araea%2Fkoishi--plugin--p5--advance--letter--generator-181717?logo=github&logoColor=white)](https://github.com/araea/koishi-plugin-p5-advance-letter-generator)
[![npm](https://img.shields.io/npm/v/koishi-plugin-p5-advance-letter-generator?logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator)

## 安装

```sh
npm i koishi-plugin-p5-advance-letter-generator
```

启用插件，并安装 `puppeteer` 服务。自定义字体放入 `data/p5-advance-letter-generator/fonts/`，文件名（去掉扩展名）即字体族名，同名覆盖内置字体。

## 快速使用

发送 `p5letter.生成预告信 怪盗团出击` 生成一张预告信，文本中的 `/` 表示换行；改用 `p5letter.生成UI` 生成 UI 风格图片。

| 指令 | 说明 |
| --- | --- |
| `p5letter` | 查看帮助，别名 `p5advanceLetter` |
| `p5letter.生成预告信 <text:text>` | 生成 P5 预告信 |
| `p5letter.生成UI <text:text>` | 生成 UI 风格图片 |

`-w <宽度>` 与 `--height <高度>` 设置图片尺寸。

## 配置

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `imageType` | `png` / `jpeg` / `webp` | `png` | 生成的图片格式 |
| `fonts` | string[] | `['微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀']` | 随机取用的字体族 |
| `canvasWidth` | number | `1770` | 默认画布宽度（像素），最小 64 |
| `canvasHeight` | number | `1300` | 默认画布高度（像素），最小 64 |

## 限制 / 风险

需要 `puppeteer` 服务，渲染失败时回退为纯文本。

## 链接

- [设计系统](DESIGN_SYSTEM.md)
- [MIT](LICENSE-MIT) / [Apache-2.0](LICENSE-APACHE)
