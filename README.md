# P5 预告信生成器

Koishi 插件 · P5 预告信生成器

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
