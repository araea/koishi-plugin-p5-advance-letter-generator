import {Context, h, Schema} from 'koishi'
import {} from 'koishi-plugin-puppeteer'

import * as path from 'path';

export const inject = {
  required: ['canvas', 'puppeteer'],
}
export const name = 'p5-advance-letter-generator'
export const usage = `## 使用

1. 启动 \`puppeteer\` 服务。️
2. 设置指令别名。

## 特性

- 文本参数是必需的，可用 \`/\` 换行。

- 可用以下选项调整生成：
  - \`-w [canvasWidth:number]\`：画布宽度，默认为 1770 像素。
  - \`--height [canvasHeight:number]\`：画布高度，默认为 1300 像素。

- 示例：
  - 生成一张 1920px * 1080px 的 p5 预告信图片：

\`\`\`
p5advanceLetter.generateAdvanceLetter -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人 ，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
\`\`\`

## QQ 群

- 956758505`

export interface Config {
  imageType: 'png' | 'jpeg' | 'webp'
}

export const Config: Schema<Config> = Schema.object({
  imageType: Schema.union(['png', 'jpeg', 'webp']).default('png').description(`生成的图片类型。`),
}) as any

export function apply(ctx: Context, config: Config) {
  // cl*
  // const logger = ctx.logger(`p5AdvanceLetterGenerator`)
  // wj*
  const filePath = path.join(__dirname, 'emptyHtml.html').replace(/\\/g, '/');
  const pageGotoFilePath = 'file://' + filePath
  // zl*
  // bz* h*
  ctx.command('p5advanceLetter', '查看p5预告信生成帮助')
    .action(async ({session}) => {
      await session.execute(`p5advanceLetter -h`)
    })
  // ygx*
  ctx.command('p5advanceLetter.生成预告信 [text:text]', '生成p5预告信')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', {fallback: 1770})
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', {fallback: 1300})
    .action(async ({session, options}, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const {canvasWidth, canvasHeight} = options
      text = text.replace(/\/+/g, '\\n').replace(/\n/g, '\\n');
      const result = await generateAdvanceLetterImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, `image/${config.imageType}`));
    })
  // ui*
  ctx.command('p5advanceLetter.生成UI [text:text]', '生成p5UI')
    .option('canvasWidth', '-w [canvasWidth:number] 画布宽度', {fallback: 1770})
    .option('canvasHeight', '--height [canvasHeight:number] 画布高度', {fallback: 1300})
    .action(async ({session, options}, text) => {
      if (!text) {
        await session.send('请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！')
        return
      }
      const {canvasWidth, canvasHeight} = options
      text = text.replace(/\/+/g, '\\n').replace(/\n/g, '\\n');
      const result = await generateUIImage(text, canvasWidth, canvasHeight)
      await session.send(h.image(result, `image/${config.imageType}`));
    })

  // hs*
  async function generateAdvanceLetterImage(text: string, canvasWidth: number, canvasHeight: number): Promise<Buffer> {
    const html = `<html>
<html lang="zh">
<head>
    <title>generateAdvanceLetterImage</title>
    <meta charSet="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
         @font-face {
            font-family: '微软雅黑';
            src: local('微软雅黑'), url('./assets/fonts/msyh.woff2') format('truetype');
        }

        @font-face {
            font-family: '微软雅黑 Bold';
            src: local('微软雅黑 Bold'), url('./assets/fonts/msyhbd.ttc') format('truetype');
        }

        @font-face {
            font-family: '黑体';
            src: local('黑体'), url('./assets/fonts/simhei.ttf') format('truetype');
        }

        @font-face {
            font-family: '新宋体';
            src: local('新宋体'), url('./assets/fonts/simsun.ttc') format('truetype');
        }
        @font-face {
            font-family: '华文琥珀';
            src: local('华文琥珀'), url('./assets/fonts/STHUPO.TTF') format('truetype');
        }
        body {
            font-family: '微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀';
        }
        canvas {
            border: 1px solid black;
             font-family: '微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀';
        }

    </style>
</head>
<body>
<h1 style="font-family: '微软雅黑'; font-weight: normal; font-style: normal;">微软雅黑</h1>
<h1 style="font-family: '微软雅黑 Bold'; font-weight: normal; font-style: normal;">微软雅黑 Bold</h1>
<h1 style="font-family: '黑体'; font-weight: normal; font-style: normal;">黑体</h1>
<h1 style="font-family: '新宋体'; font-weight: normal; font-style: normal;">新宋体</h1>
<h1 style="font-family: '华文琥珀'; font-weight: normal; font-style: normal;">华文琥珀</h1>
<canvas id="myCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>

<script>

 window.onload = () => {
       const fonts = ['微软雅黑', '微软雅黑 Bold', '黑体', '新宋体', '华文琥珀'];
      const colors = ['white', 'black', 'gray', 'red'];
      const bgColors = {
            white: ['black', 'gray'],
            black: ['white', 'gray'],
            gray: ['white', 'black'],
            red: ['white'],
        };
    const canvas = document.getElementById('myCanvas');
    canvas.width = ${canvasWidth};
    canvas.height = ${canvasHeight};
    const context = canvas.getContext('2d');
    const text = '${text}';
    const img = new Image();
    img.src = './assets/background.png';
    img.onload = () => {
        context.drawImage(img, 0, 0, ${canvasWidth}, ${canvasHeight});
         const sentences = text.split('\\n');

        let textHeight = 0;
        let maxCharHeight = 0;
        const sentencesCount = sentences.length;
        for (const sentence of sentences) { // for 0
            const trimmedSentence = sentence.trim();
            const textFont = randomChoice(fonts);
            const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
            context.font = \`\${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const charHeight = metrics.fontBoundingBoxAscent  + metrics.fontBoundingBoxDescent;
            maxCharHeight = Math.max(maxCharHeight, charHeight);

            textHeight += maxCharHeight +  20;
        } // for 0

        let y = (${canvasHeight} - textHeight) / 2;

        for (const sentence of sentences) { // for 1
            const trimmedSentence = sentence.trim();
            const textSize = Math.min(1770 / (trimmedSentence.length + 6), 1300 / (sentencesCount + 6));
            const textFont = randomChoice(fonts);
            context.font = \`\${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const sentenceWidth = metrics.width;

            let x = (${canvasWidth} - sentenceWidth) / 2 - 170;
            for (let i = 0; i < trimmedSentence.length; i++) { // for 2
                const char = trimmedSentence[i];

                const charFont = randomChoice(fonts);
                // 模拟随机字符大小
                const randomArray = new Uint8Array(1);
                crypto.getRandomValues(randomArray);
                const charSize = Math.floor(textSize + (randomArray[0] / 255) * 20);
                context.font = \`\${charSize}px "\${textFont}"\`;

                const color = randomChoice(colors);
                const bgColor = randomChoice(bgColors[color]);

                const charMetrics = context.measureText(char);
                const charWidth = charMetrics.width;
                const charHeight = charMetrics.fontBoundingBoxAscent + charMetrics.fontBoundingBoxDescent;

                const centerX = x + charWidth / 2;
                const centerY = y + charHeight / 2;

                const randomAngle = (Math.random() * 10) - 5;
                const angle = randomAngle * Math.PI / 180;

                context.translate(centerX, centerY);
                context.rotate(angle);
                context.translate(-centerX, -centerY);

                context.fillStyle = bgColor;
                context.fillRect(x, y, charWidth, charHeight + 10);

                context.fillStyle = color;
                context.fillText(char, x, y + charMetrics.fontBoundingBoxAscent);

                x += charWidth + 20;

                context.resetTransform();
            } // for 2
            y += maxCharHeight + 20;
        } // for 1
    } // img.onload
 } // window.onload

    function randomChoice(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
</script>
</body>
</html>
`

    const browser = ctx.puppeteer.browser
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({width: canvasWidth, height: canvasHeight})
    await page.goto(pageGotoFilePath)
    await page.setContent(h.unescape(html), {waitUntil: 'load'});
    const canvas = await page.$('canvas#myCanvas');

    const buffer = await canvas.screenshot({type: config.imageType})
    await page.close();
    await context.close();
    return buffer
  }

  async function generateUIImage(text: string, canvasWidth: number, canvasHeight: number): Promise<Buffer> {
    const html = `<html>
<html lang="zh">
<head>
    <title>generateUIImage</title>
    <style>
        @font-face {
            font-family: '微软雅黑 Bold';
            src: local('微软雅黑 Bold'), url('./assets/fonts/msyhbd.ttc') format('truetype');
        }
        body {
          font-family: '微软雅黑 Bold';
        }
        canvas {
            border: 1px solid black;
            font-family: '微软雅黑 Bold';
        }
    </style>
</head>
<body>
<h1 style="font-family: '微软雅黑 Bold'; font-weight: normal; font-style: normal;">微软雅黑 Bold</h1>
<canvas id="myCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>

<script>
    function randomChoice(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    const text = '${text}';
        // 设置字体列表
        const fonts = ['微软雅黑 Bold'];
        // 设置颜色列表
        const colors = ['white', 'red'];
        // 设置背景颜色列表
        const bgColors = {white: ['black', 'red'], red: ['black']};

    const canvas = document.getElementById('myCanvas');

        canvas.width = ${canvasWidth};
        canvas.height = ${canvasHeight};
        const context = canvas.getContext('2d');
    const img = new Image();
    img.src = './assets/background.png';
    img.onload = function () {
        context.drawImage(img, 0, 0, ${canvasWidth}, ${canvasHeight});

        // 分割文本为多个句子
        const sentences = text.split('\\n');

        // 计算文本总高度和最大字符高度
        let textHeight = 0;
        let maxCharHeight = 0;
        const sentencesCount = sentences.length;
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            const textSize = Math.min(1770 / trimmedSentence.length, 1300 / (sentencesCount + 6));
            context.font = \`$\{textSize}px "\${textSize}"\`;

            const metrics = context.measureText(trimmedSentence);
            const charHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + 20;
            maxCharHeight = Math.max(maxCharHeight, charHeight);

            textHeight += maxCharHeight + 20;
        }

        // 计算文本起始位置
        let y = (${canvasHeight} - textHeight) / 2;

        // 遍历每个句子
        for (const sentence of sentences) {
            // 计算句子宽度
            const trimmedSentence = sentence.trim();
            const textSize = Math.min(1770 / (trimmedSentence.length + 6), 1300 / (sentencesCount + 6));
            const textFont = randomChoice(fonts);
            context.font = \`\${textSize}px "\${textFont}"\`;

            const metrics = context.measureText(trimmedSentence);
            const sentenceWidth = metrics.width;

            // 计算句子起始位置
            let x = (${canvasWidth} - sentenceWidth) / 2 - 170;
            // 遍历句子中的每个字符
            for (let i = 0; i < trimmedSentence.length; i++) {
                const char = trimmedSentence[i];

                // 随机选择字体和大小
                const charFont = randomChoice(fonts);
                // 模拟随机字符大小
                const randomArray = new Uint8Array(1);
                crypto.getRandomValues(randomArray);
                const charSize = Math.floor(textSize + (randomArray[0] / 255) * 20);
                context.font = \`\${charSize}px "\${charFont}"\`;

                // 随机选择颜色
                const color = randomChoice(colors);
                // 根据颜色选择背景颜色
                const bgColor = randomChoice(bgColors[color]);

                // 获取字符大小
                const charMetrics = context.measureText(char);
                // console.log(charMetrics)
                const charWidth = charMetrics.width;
                const charHeight = charMetrics.fontBoundingBoxAscent + charMetrics.fontBoundingBoxDescent;

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
                context.fillText(char, x + 7, y + 7 + charMetrics.fontBoundingBoxAscent);


                // 更新x坐标
                x += charWidth + 20;

                // 恢复旋转
                context.resetTransform();
            }
            // 更新y坐标以换行
            y += maxCharHeight + 20;
        }
    };


</script>
</body>
</html>
`
    const browser = ctx.puppeteer.browser
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({width: canvasWidth, height: canvasHeight})
    await page.goto(pageGotoFilePath)
    await page.setContent(h.unescape(html), {waitUntil: 'load'});
    const canvas = await page.$('canvas#myCanvas');

    const buffer = await canvas.screenshot({type: config.imageType})
    await page.close();
    await context.close();
    return buffer
  }
}

