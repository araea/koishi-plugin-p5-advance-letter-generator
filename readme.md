# koishi-plugin-p5-advance-letter-generator

P5 预告信与 UI 风格图片生成插件。

## 安装

~~~sh
yarn add koishi-plugin-p5-advance-letter-generator
~~~

在 Koishi 配置中启用 koishi-plugin-p5-advance-letter-generator，并提供 puppeteer 服务。
自定义字体放入 data/p5-advance-letter-generator/fonts/。

## 指令

| 指令 | 说明 |
| --- | --- |
| p5letter | 查看帮助 |
| p5letter.生成预告信 &lt;文本&gt; | 生成预告信 |
| p5letter.生成UI &lt;文本&gt; | 生成 UI 风格图片 |

文本中的 / 表示换行。-w &lt;宽度&gt; 与 --height &lt;高度&gt; 可调整图片尺寸。

## 许可证

可按 [Apache-2.0](LICENSE-APACHE) 或 [MIT](LICENSE-MIT) 使用。
