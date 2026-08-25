koishi-plugin-p5-advance-letter-generator
========================

[<img alt="github" src="https://img.shields.io/badge/github-araea/p5_letter_generator-8da0cb?style=for-the-badge&labelColor=555555&logo=github" height="20">](https://github.com/araea/koishi-plugin-p5-advance-letter-generator)
[<img alt="npm" src="https://img.shields.io/npm/v/koishi-plugin-p5-advance-letter-generator.svg?style=for-the-badge&color=fc8d62&logo=npm" height="20">](https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator)

Koishi 的 P5 预告信/UI 生成插件。

## 使用

1. 启动 `puppeteer` 服务。
2. 文本里用 `/` 换行。

## 指令

| 指令 | 说明 |
| --- | --- |
| `p5advanceLetter` | 查看帮助 |
| `p5advanceLetter.生成预告信 <文本>` | 生成预告信 |
| `p5advanceLetter.生成UI <文本>` | 生成 UI 风格图 |

两条生成指令都支持 `-w <宽度>` 与 `--height <高度>`，缺省用配置里的画布尺寸（1770 × 1300）。

## 字体

插件**不再随包分发字体**——`微软雅黑`、`新宋体` 这些是有版权的商用字体，不适合放进 npm 包。
默认直接使用系统里安装的同名字体；想要原汁原味的效果，把字体文件放进
`data/p5-advance-letter-generator/fonts`，文件名（去掉扩展名）就是配置项 `fonts` 里的字体族名，
例如 `微软雅黑.ttf`。放进去即时生效，不用重启。

仓库的 `src/assets/fonts` 里留有一份参考字体，可自行取用。

- 示例：
  - 生成一张 1920px * 1080px 的 p5 预告信图片：

```
p5advanceLetter.生成预告信 -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人 ，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
```

## 致谢

* [Koishi](https://koishi.chat/)
* [F.a.i.t.h](https://user.qzone.qq.com/185110524)
* [女神异闻录5](https://www.jp.playstation.com/games/persona-5-royal/)
* [nonebot-plugin-p5generator](https://github.com/xi-yue-233/nonebot-plugin-p5generator)

## QQ 群

- 956758505

<br>

#### License

<sup>
Licensed under either of <a href="LICENSE-APACHE">Apache License, Version
2.0</a> or <a href="LICENSE-MIT">MIT license</a> at your option.
</sup>

<br>

<sub>
Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this crate by you, as defined in the Apache-2.0 license, shall
be dual licensed as above, without any additional terms or conditions.
</sub>
