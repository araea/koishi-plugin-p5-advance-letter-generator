# koishi-plugin-p5-advance-letter-generator

[![npm](https://img.shields.io/npm/v/koishi-plugin-p5-advance-letter-generator?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-p5-advance-letter-generator)

## 🎈 介绍

基于 [Koishi](https://koishi.chat/) 框架，用于生成 **p5 预告信** 和 **p5 UI** 图片。🔥

p5 预告信是指《女神异闻录5》中的一种信件，由佐仓双叶用特殊的字体和颜色写成，用来告知主角和同伴们下一次的目标和计划。💌

p5 UI 是指《女神异闻录5》中的一种用户界面，由鲜艳的红色和白色组成，具有强烈的视觉冲击力和动感。🎨

## 📦 安装

```bash
npm install koishi-plugin-p5-advance-letter-generator
```

或者，你可以直接前往 Koishi 插件市场添加该插件。👍

## 🎮 使用

- 启动 `puppeteer` 服务插件。🖼️
- 建议为指令添加合适的别名。📸

## ⚙️ 配置项

- `imageType`：图片类型，默认为 `png`。🖼️

## 📝 命令

该插件提供了两个命令，分别是：

- `p5advanceLetter`：查看 p5 预告信生成帮助。📚
- `p5advanceLetter.generateAdvanceLetter [text:text]`：生成 p5 预告信。💌
- `p5advanceLetter.generateUI [text:text]`：生成 p5 UI。🎨

其中，`[text:text]` 参数是必须的，表示要生成的文本内容。你可以用 `/` 来换行。🔤

你还可以使用以下选项来调整生成的图片：

- `-w [canvasWidth:number]`：画布宽度，默认为 1770 像素。🔢
- `--height [canvasHeight:number]`：画布高度，默认为 1300 像素。🔢

例如，你可以输入以下命令：

```bash
p5advanceLetter.generateAdvanceLetter -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人 ，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
```

来生成一张宽为 1920 像素，高为 1080 像素的 p5 预告信图片，示例如下：

![p5预告信示例](https://camo.githubusercontent.com/b9cb7d845e60d4b5b318f76a1b3291df9f54e1b59542ca2dbf06780f16ad5099/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032342f706e672f33343533383636322f313730343138323236393530342d38613638636131612d306234382d343532352d623537662d3337326434323730363932382e706e673f782d6f73732d70726f636573733d696d616765253246726573697a65253243775f3933372532436c696d69745f30)

p5 UI 图片，示例如下：

![p5UI示例](https://camo.githubusercontent.com/b5f72c1632444b9eaf0441e76b48afbc33a8a11e40c96cb82a7ad89a188227df/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032342f706e672f33343533383636322f313730343138323236393532322d64616264643165662d343961322d346137342d613833382d3339326333313132616565372e706e673f782d6f73732d70726f636573733d696d616765253246726573697a65253243775f3933372532436c696d69745f30)

## 🙏 致谢

* [Koishi](https://koishi.chat/) - 机器人框架
* [F.a.i.t.h](https://user.qzone.qq.com/185110524) - 插件动力源泉
* [女神异闻录5](https://www.jp.playstation.com/games/persona-5-royal/) - 一款优秀的游戏
* [nonebot-plugin-p5generator](https://github.com/xi-yue-233/nonebot-plugin-p5generator) - nonebot 插件代码参考

## 🐱 QQ 群

- 956758505

## ✨ License

MIT License © 2024

希望您喜欢这款插件！ 💫

如有任何问题或建议，欢迎联系我哈~ 🎈
