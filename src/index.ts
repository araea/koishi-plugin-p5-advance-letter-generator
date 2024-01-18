import {Context, h, Logger, Schema} from 'koishi'


import * as fs from 'fs';
import * as path from 'path';
import {randomBytes} from 'crypto';

export const inject = ['canvas']
export const name = 'p5-advance-letter-generator'
export const usage = `## 🎮 使用

- 你需要先安装 [koishi-plugin-canvas](https://github.com/koishijs/koishi-plugin-canvas) 插件（必须用这个），以便使用画布功能。🖼️
- 在 \`Koishi\` 默认根目录下，安装 \`./data/p5alg/\` 文件夹内的 5 个字体。🛠️
- 建议为指令添加合适的别名，以便你使用该插件提供的命令，来生成 p5 预告信和 p5 UI 的图片。📸

## ⚙️ 配置项

该插件目前没有提供任何配置项，但是你可以在命令中指定一些参数，如画布的宽度和高度。📏

## 📝 命令

该插件提供了两个命令，分别是：

- \`p5advanceLetter\`：查看 p5 预告信生成帮助。📚
- \`p5advanceLetter.generateAdvanceLetter [text:text]\`：生成 p5 预告信。💌
- \`p5advanceLetter.generateUI [text:text]\`：生成 p5 UI。🎨

其中，\`[text:text]\` 参数是必须的，表示要生成的文本内容。你可以用 \`/\` 来换行。🔤

你还可以使用以下选项来调整生成的图片：

- \`-w [canvasWidth:number]\`：画布宽度，默认为 1770 像素。🔢
- \`--height [canvasHeight:number]\`：画布高度，默认为 1300 像素。🔢

例如，你可以输入以下命令：

\`\`\`bash
p5advanceLetter.generateAdvanceLetter -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人 ，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
\`\`\`

来生成一张宽为 1920 像素，高为 1080 像素的 p5 预告信图片，示例如下：

![p5预告信示例](https://camo.githubusercontent.com/b9cb7d845e60d4b5b318f76a1b3291df9f54e1b59542ca2dbf06780f16ad5099/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032342f706e672f33343533383636322f313730343138323236393530342d38613638636131612d306234382d343532352d623537662d3337326434323730363932382e706e673f782d6f73732d70726f636573733d696d616765253246726573697a65253243775f3933372532436c696d69745f30)

p5 UI 图片，示例如下：

![p5UI示例](https://camo.githubusercontent.com/b5f72c1632444b9eaf0441e76b48afbc33a8a11e40c96cb82a7ad89a188227df/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032342f706e672f33343533383636322f313730343138323236393532322d64616264643165662d343961322d346137342d613833382d3339326333313132616565372e706e673f782d6f73732d70726f636573733d696d616765253246726573697a65253243775f3933372532436c696d69745f30)
`

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

const logger = new Logger(`p5AdvanceLetterGenerator`)
export function apply(ctx: Context) {
  const dependencyPjskDir = path.join(__dirname, '..', 'p5alg')
  const pluginDataDir = path.join(ctx.baseDir, 'data', 'p5alg')
  // 将资源文件存到data目录下
  fs.cp(dependencyPjskDir,
    pluginDataDir,
    { recursive: true, force: false },
    (err) => {
      if (err) {
        logger.error('复制 p5alg 文件夹出错：' + err.message)
      }
    });
  ctx.command('p5advanceLetter', '查看p5预告信生成帮助')
    .action(async ({ session }) => {
      await session.execute(`p5advanceLetter -h`)
    })
  ctx.command('p5advanceLetter.generateAdvanceLetter [text:text]', '生成p5预告信')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', { fallback: 1770 })
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', { fallback: 1300 })
    .action(async ({ session, options }, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const { canvasWidth, canvasHeight } = options
      text = text.replace(/\/+/g, '\n');
      const result = await generateAdvanceLetterImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, 'image/png'));
    })
  ctx.command('p5advanceLetter.generateUI [text:text]', '生成p5UI')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', { fallback: 1770 })
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', { fallback: 1300 })
    .action(async ({ session, options }, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const { canvasWidth, canvasHeight } = options
      text = text.replace(/\/+/g, '\n');
      const result = await generateUIImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, 'image/png'));
    })



  async function generateAdvanceLetterImage(text: string, canvasWidth: number, canvasHeight: number): Promise<Buffer> {
    // 设置字体列表
    const fonts: string[] = ['微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀'];
    // 设置颜色列表
    const colors: string[] = ['white', 'black', 'gray', 'red'];
    // 设置背景颜色列表
    const bgColors: { [key: string]: string[] } = {
      white: ['black', 'gray'],
      black: ['white', 'gray'],
      gray: ['white', 'black'],
      red: ['white'],
    };
    const canvas = await ctx.canvas.createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    // 加载背景图片
    const backgroundImagePath = path.join(pluginDataDir, 'background.png');
    const backgroundImage = await ctx.canvas.loadImage(backgroundImagePath);
    context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // 分割文本为多个句子
    const sentences = text.split('\n');

    // 计算文本总高度和最大字符高度
    let textHeight = 0;
    let maxCharHeight = 0;
    const sentencesCount = sentences.length;
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      const textFont = randomChoice(fonts);
      const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
      context.font = (textFont === '微软雅黑 Bold') ? `bold ${textSize}px "${textFont}"` : `${textSize}px "${textFont}`;

      const metrics = context.measureText(trimmedSentence);
      const charHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      maxCharHeight = Math.max(maxCharHeight, charHeight);

      textHeight += maxCharHeight + 20;
    }

    // 计算文本起始位置
    let y = (canvasHeight - textHeight) / 2;

    // 遍历每个句子
    for (const sentence of sentences) {
      // 计算句子宽度
      const trimmedSentence = sentence.trim();
      const textSize = Math.min(1770 / (trimmedSentence.length + 6), 1300 / (sentencesCount + 6));
      const textFont = randomChoice(fonts);
      context.font = (textFont === '微软雅黑 Bold') ? `bold ${textSize}px "${textFont}"` : `${textSize}px "${textFont}`;

      const metrics = context.measureText(trimmedSentence);
      const sentenceWidth = metrics.width;

      // 计算句子起始位置
      let x = (canvasWidth - sentenceWidth) / 2 - 170;
      // 遍历句子中的每个字符
      for (let i = 0; i < trimmedSentence.length; i++) {
        const char = trimmedSentence[i];

        // 随机选择字体和大小
        const charFont = randomChoice(fonts);
        const charSize = Math.floor(textSize + (randomBytes(1)[0] / 255) * 20);
        context.font = (charFont === '微软雅黑 Bold') ? `bold ${charSize}px "${charFont}"` : `${charSize}px "${charFont}`;


        // 随机选择颜色
        const color = randomChoice(colors);
        // 根据颜色选择背景颜色
        const bgColor = randomChoice(bgColors[color]);

        // 获取字符大小
        const charMetrics = context.measureText(char);
        const charWidth = charMetrics.width;
        const charHeight = charMetrics.actualBoundingBoxAscent + charMetrics.actualBoundingBoxDescent;

        // 计算字符中心点坐标
        const centerX = x + charWidth / 2;
        const centerY = y + charHeight / 2;

        // 随机旋转角度
        const randomAngle = (randomBytes(4).readUInt32BE(0) / 0xffffffff) * 10 - 5;
        const angle = randomAngle * Math.PI / 180;

        // 移动画布原点到字符中心点
        context.translate(centerX, centerY);
        // 进行旋转
        context.rotate(angle);
        // 移动画布原点回初始位置
        context.translate(-centerX, -centerY);

        // 绘制背景色块
        context.fillStyle = bgColor;
        context.fillRect(x, y, charWidth, charHeight);

        // 绘制字符
        context.fillStyle = color;
        context.fillText(char, x, y + charMetrics.actualBoundingBoxAscent);

        // 更新x坐标
        x += charWidth + 20;

        // 恢复旋转
        context.resetTransform();
      }
      // 更新y坐标以换行
      y += maxCharHeight + 20;
    }

    // 将画布转换为图像数据
    return await canvas.toBuffer('image/png');
  }
  async function generateUIImage(text: string, canvasWidth: number, canvasHeight: number): Promise<Buffer> {
    // 设置字体列表
    const fonts = ['微软雅黑 Bold'];
    // 设置颜色列表
    const colors = ['white', 'red'];
    // 设置背景颜色列表
    const bgColors: { [key: string]: string[] } = { white: ['black', 'red'], red: ['black'] };

    const canvas = await ctx.canvas.createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    // 加载背景图片
    const backgroundImagePath = path.join(pluginDataDir, 'background.png');
    const backgroundImage = await ctx.canvas.loadImage(backgroundImagePath);
    context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // 分割文本为多个句子
    const sentences = text.split('\n');

    // 计算文本总高度和最大字符高度
    let textHeight = 0;
    let maxCharHeight = 0;
    const sentencesCount = sentences.length;
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
      context.font = `bold ${textSize}px "${textSize}"`;

      const metrics = context.measureText(trimmedSentence);
      const charHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      maxCharHeight = Math.max(maxCharHeight, charHeight);

      textHeight += maxCharHeight + 20;
    }

    // 计算文本起始位置
    let y = (canvasHeight - textHeight) / 2;

    // 遍历每个句子
    for (const sentence of sentences) {
      // 计算句子宽度
      const trimmedSentence = sentence.trim();
      const textSize = Math.min(1770 / (trimmedSentence.length + 6), 1300 / (sentencesCount + 6));
      const textFont = randomChoice(fonts);
      context.font = `bold ${textSize}px "${textFont}"`;

      const metrics = context.measureText(trimmedSentence);
      const sentenceWidth = metrics.width;

      // 计算句子起始位置
      let x = (canvasWidth - sentenceWidth) / 2 - 170;
      // 遍历句子中的每个字符
      for (let i = 0; i < trimmedSentence.length; i++) {
        const char = trimmedSentence[i];

        // 随机选择字体和大小
        const charFont = randomChoice(fonts);
        const charSize = Math.floor(textSize + (randomBytes(1)[0] / 255) * 20);
        context.font = `bold ${charSize}px "${charFont}"`;

        // 随机选择颜色
        const color = randomChoice(colors);
        // 根据颜色选择背景颜色
        const bgColor = randomChoice(bgColors[color]);

        // 获取字符大小
        const charMetrics = context.measureText(char);
        const charWidth = charMetrics.width;
        const charHeight = charMetrics.actualBoundingBoxAscent + charMetrics.actualBoundingBoxDescent;

        // 计算字符中心点坐标
        const centerX = x + charWidth / 2;
        const centerY = y + charHeight / 2;

        // 随机旋转角度
        const randomAngle = (randomBytes(4).readUInt32BE(0) / 0xffffffff) * 10 - 5;
        const angle = randomAngle * Math.PI / 180;

        // 移动画布原点到字符中心点
        context.translate(centerX, centerY);
        // 进行旋转
        context.rotate(angle);
        // 移动画布原点回初始位置
        context.translate(-centerX, -centerY);

        // 绘制背景色块
        context.fillStyle = bgColor;
        context.fillRect(x, y, charWidth + 7, charHeight + 7);

        // 绘制白色边框
        context.strokeStyle = 'white';
        context.lineWidth = 7;
        context.strokeRect(x, y, charWidth, charHeight);

        // 绘制字符
        context.fillStyle = color;
        context.fillText(char, x + 7, y + 7 + charMetrics.actualBoundingBoxAscent);


        // 更新x坐标
        x += charWidth + 20;

        // 恢复旋转
        context.resetTransform();
      }
      // 更新y坐标以换行
      y += maxCharHeight + 20;
    }

    // 将画布转换为图像数据
    return await canvas.toBuffer('image/png');
  }

  function randomChoice<T>(array: T[]): T {
    const randomBytesBuffer = randomBytes(4);
    const index = randomBytesBuffer.readUInt32BE(0) % array.length;
    return array[index];
  }
}

