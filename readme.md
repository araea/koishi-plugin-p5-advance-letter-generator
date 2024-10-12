# koishi-plugin-p5-advance-letter-generator

[![npm](https://img.shields.io/npm/v/koishi-plugin-p5-advance-letter-generator?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator)

## 介绍

Koishi 的 P5 预告信/UI 生成插件。

## 使用

1. 启动 `puppeteer` 服务。️
2. 设置指令别名。

## 特性

- 文本参数是必需的，可用 `/` 换行。

- 可用以下选项调整生成：
  - `-w [canvasWidth:number]`：画布宽度，默认为 1770 像素。
  - `--height [canvasHeight:number]`：画布高度，默认为 1300 像素。

- 示例：
  - 生成一张 1920px * 1080px 的 p5 预告信图片：

```
p5advanceLetter.generateAdvanceLetter -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人 ，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
```

## 致谢

* [Koishi](https://koishi.chat/)
* [F.a.i.t.h](https://user.qzone.qq.com/185110524)
* [女神异闻录5](https://www.jp.playstation.com/games/persona-5-royal/)
* [nonebot-plugin-p5generator](https://github.com/xi-yue-233/nonebot-plugin-p5generator)

## QQ 群

- 956758505

## License

MIT License © 2024
