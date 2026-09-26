# P5 预告信生成器

Koishi 插件，生成 Persona 5 风格的预告信和 UI 图片。

## 安装

```sh
yarn add koishi-plugin-p5-advance-letter-generator
```

在 Koishi 中启用，并安装 `puppeteer` 服务。自定义字体放入 `data/p5-advance-letter-generator/fonts/`。

## 指令

| 指令 | 说明 |
| --- | --- |
| `p5letter` | 查看帮助 |
| `p5letter.生成预告信 <文本>` | 生成预告信 |
| `p5letter.生成UI <文本>` | 生成 UI 风格图片 |

文本中的 `/` 表示换行。使用 `-w <宽度>` 和 `--height <高度>` 设置图片尺寸。

## 许可证

可按 [Apache-2.0](LICENSE-APACHE) 或 [MIT](LICENSE-MIT) 使用。

## 显示与交互

有渲染图时只发图片，不再附带同内容的文字；图片生成失败时才退回文字。作品素材与感官测试的适用边界见 [设计系统](./DESIGN_SYSTEM.md)。

本次更新：生成作品同时附带原文，并支持文字模式。保留 P5 作品风格。
