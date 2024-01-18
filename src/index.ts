import {Context, h, Logger, Schema} from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import {} from 'koishi-plugin-canvas'


import * as fs from 'fs';
import * as path from 'path';
import {randomBytes} from 'crypto';

export const inject = {
  required: ['canvas'],
  optional: ['puppeteer'],
}
export const name = 'p5-advance-letter-generator'
export const usage = `## 🎮 使用

- 你需要先启动 canvas 服务插件（puppeteer 或 canvas），以便使用画布功能。🖼️
- 在 \`Koishi\` 默认根目录下，安装 \`./data/p5alg/\` 文件夹内的 5 个字体。🛠️
- 建议为指令添加合适的别名，以便你使用该插件提供的命令，来生成 p5 预告信和 p5 UI 的图片。📸

## ⚙️ 配置项

- \`drawingServiceChoice\`：选择绘制服务。📏

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

export interface Config {
  drawingServiceChoice: string
}

export const Config: Schema<Config> = Schema.object({
  drawingServiceChoice: Schema.union(['canvas', 'puppeteer']).default('canvas').description('选择绘制服务。')
}) as any

const logger = new Logger(`p5AdvanceLetterGenerator`)

export function apply(ctx: Context, config: Config) {
  const {drawingServiceChoice} = config
  const dependencyPjskDir = path.join(__dirname, '..', 'p5alg')
  const pluginDataDir = path.join(ctx.baseDir, 'data', 'p5alg')
  // 将资源文件存到data目录下
  fs.cp(dependencyPjskDir,
    pluginDataDir,
    {recursive: true, force: false},
    (err) => {
      if (err) {
        logger.error('复制 p5alg 文件夹出错：' + err.message)
      }
    });
  ctx.command('p5advanceLetter', '查看p5预告信生成帮助')
    .action(async ({session}) => {
      await session.execute(`p5advanceLetter -h`)
    })
  ctx.command('p5advanceLetter.generateAdvanceLetter [text:text]', '生成p5预告信')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', {fallback: 1770})
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', {fallback: 1300})
    .action(async ({session, options}, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const {canvasWidth, canvasHeight} = options
      text = (drawingServiceChoice === 'canvas') ? text.replace(/\/+/g, '\n') : text.replace(/\/+/g, '\\n');
      const result = await generateAdvanceLetterImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, 'image/png'));
    })
  ctx.command('p5advanceLetter.generateUI [text:text]', '生成p5UI')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', {fallback: 1770})
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', {fallback: 1300})
    .action(async ({session, options}, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const {canvasWidth, canvasHeight} = options
      text = (drawingServiceChoice === 'canvas') ? text.replace(/\/+/g, '\n') : text.replace(/\/+/g, '\\n');
      const result = await generateUIImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, 'image/png'));
    })


  async function generateAdvanceLetterImage(text: string, canvasWidth: number, canvasHeight: number): Promise<Buffer> {
    if (drawingServiceChoice === 'puppeteer') {
      const html = `<html>
<html lang="zh">
<head>
    <title>generateAdvanceLetterImage</title>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
<canvas id="myCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>

<script>
    function randomChoice(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    async function generateAdvanceLetterImage(text, canvasWidth, canvasHeight) {
        const fonts = ['微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀'];
        const colors = ['white', 'black', 'gray', 'red'];
        const bgColors = {
            white: ['black', 'gray'],
            black: ['white', 'gray'],
            gray: ['white', 'black'],
            red: ['white'],
        };
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const context = canvas.getContext('2d');
        context.textAlign = 'left'; // 设置文本对齐方式为左对齐
        context.textBaseline = 'bottom'; // 设置文本基线为底部

        // const backgroundImagePath = path.join(pluginDataDir, 'background.png'); // Assuming pluginDataDir is defined
        // const backgroundImage = await ctx.canvas.loadImage(backgroundImagePath);
        // const backgroundImage = await loadImage('./background.png');
        // context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

        const sentences = text.split('\\n');

        let textHeight = 0;
        let maxCharHeight = 0;
        const sentencesCount = sentences.length;
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            const textFont = randomChoice(fonts);
            const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
            context.font = (textFont === '微软雅黑 Bold') ? \`bold \${textSize}px "\${textFont}"\` : \`\${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const charHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            maxCharHeight = Math.max(maxCharHeight, charHeight);

            textHeight += maxCharHeight + 20;
        }

        let y = (canvasHeight - textHeight) / 2;

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            const textSize = Math.min(1770 / (trimmedSentence.length + 6), 1300 / (sentencesCount + 6));
            const textFont = randomChoice(fonts);
            context.font = (textFont === '微软雅黑 Bold') ? \`bold \${textSize}px "\${textFont}"\` : \`\${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const sentenceWidth = metrics.width;

            let x = (canvasWidth - sentenceWidth) / 2 - 170;
            for (let i = 0; i < trimmedSentence.length; i++) {
                const char = trimmedSentence[i];

                const charFont = randomChoice(fonts);
                // 模拟随机字符大小
                const randomArray = new Uint8Array(1);
                crypto.getRandomValues(randomArray);
                const charSize = Math.floor(textSize + (randomArray[0] / 255) * 20);

                context.font = (charFont === '微软雅黑 Bold') ? \`bold \${charSize}px "\${charFont}"\` : \`\${charSize}px "\${charFont}"\`;

                const color = randomChoice(colors);
                const bgColor = randomChoice(bgColors[color]);

                const charMetrics = context.measureText(char);
                const charWidth = charMetrics.width;
                const charHeight = charMetrics.actualBoundingBoxAscent + charMetrics.actualBoundingBoxDescent;

                const centerX = x + charWidth / 2;
                const centerY = y + charHeight / 2;

                // const randomAngle = (randomBytes(4).readUInt32BE(0) / 0xffffffff) * 10 - 5;
                // const angle = randomAngle * Math.PI / 180;
                const randomAngle = (Math.random() * 10) - 5;
                const angle = randomAngle * Math.PI / 180;

                context.translate(centerX, centerY);
                context.rotate(angle);
                context.translate(-centerX, -centerY);

                context.fillStyle = bgColor;
                context.fillRect(x, y, charWidth, charHeight);

                context.fillStyle = color;
                context.fillText(char, x, y + charMetrics.actualBoundingBoxAscent);

                x += charWidth + 20;

                context.resetTransform();
            }
            y += maxCharHeight + 20;
        }

        return await new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    }


    // 获取 Canvas 元素
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = './background.png';
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };

    generateAdvanceLetterImage('${text}', canvas.width, canvas.height).then(imageData => {
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([imageData], {type: 'image/png'}));
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    });
</script>
</body>
</html>
`

      const page = await ctx.puppeteer.page()
      const htmlPath = 'file://' + pluginDataDir.replaceAll('\\', '/') + '/generateAdvanceLetterImage.html'
      await page.goto(htmlPath)
      await page.setContent(h.unescape(html), {waitUntil: 'load'});
      // 截取 Canvas 并返回 Buffer
      const canvas = await page.$('canvas#myCanvas');

      const buffer = await canvas.screenshot({type: 'png'})
      // 关闭 page
      await page.close();
      return buffer
    }
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
    if (drawingServiceChoice === 'puppeteer') {
      const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <title>Canvas</title>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
<canvas id="myCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>

<script>
    function randomChoice(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    async function generateAdvanceLetterImage(text, canvasWidth, canvasHeight) {
        // 设置字体列表
        const fonts = ['微软雅黑 Bold'];
        // 设置颜色列表
        const colors = ['white', 'red'];
        // 设置背景颜色列表
        const bgColors = {white: ['black', 'red'], red: ['black']};

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const context = canvas.getContext('2d');
        context.textAlign = 'left'; // 设置文本对齐方式为左对齐
        context.textBaseline = 'bottom'; // 设置文本基线为底部


        // 分割文本为多个句子
        const sentences = text.split('\\n');

        // 计算文本总高度和最大字符高度
        let textHeight = 0;
        let maxCharHeight = 0;
        const sentencesCount = sentences.length;
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
            context.font = \`bold $\{textSize}px "\${textSize}"\`;

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
            context.font = \`bold \${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const sentenceWidth = metrics.width;

            // 计算句子起始位置
            let x = (canvasWidth - sentenceWidth) / 2 - 170;
            // 遍历句子中的每个字符
            for (let i = 0; i < trimmedSentence.length; i++) {
                const char = trimmedSentence[i];

                // 随机选择字体和大小
                const charFont = randomChoice(fonts);
                // 模拟随机字符大小
                const randomArray = new Uint8Array(1);
                crypto.getRandomValues(randomArray);
                const charSize = Math.floor(textSize + (randomArray[0] / 255) * 20);
                context.font = \`bold \${charSize}px "\${charFont}"\`;

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
                const randomAngle = (Math.random() * 10) - 5;
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
        return await new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    }


    // 获取 Canvas 元素
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = './background.png';
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };

    generateAdvanceLetterImage('${text}', canvas.width, canvas.height).then(imageData => {
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([imageData], {type: 'image/png'}));
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    });
</script>
</body>
</html>
`
      const page = await ctx.puppeteer.page()
      const htmlPath = 'file://' + pluginDataDir.replaceAll('\\', '/') + '/generateAdvanceLetterImage.html'
      await page.goto(htmlPath)
      await page.setContent(h.unescape(html), {waitUntil: 'load'});
      // 截取 Canvas 并返回 Buffer
      const canvas = await page.$('canvas#myCanvas');

      const buffer = await canvas.screenshot({type: 'png'})
      // 关闭 page
      await page.close();
      return buffer
    }
    // 设置字体列表
    const fonts = ['微软雅黑 Bold'];
    // 设置颜色列表
    const colors = ['white', 'red'];
    // 设置背景颜色列表
    const bgColors: { [key: string]: string[] } = {white: ['black', 'red'], red: ['black']};

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

