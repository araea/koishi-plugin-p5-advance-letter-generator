import { Context } from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import type { Config } from './config'

export type Style = 'letter' | 'ui'

/** 两种风格只在配色与字块描边上有区别。 */
const STYLES = {
  letter: {
    colors: ['white', 'black', 'gray', 'red'],
    contrast: {
      white: ['black', 'gray'],
      black: ['white', 'gray'],
      gray: ['white', 'black'],
      red: ['white'],
    },
    padX: 0,
    padY: 10,
    stroke: null as string,
    mixFonts: true,
    preferred: null as string,
  },
  ui: {
    colors: ['white', 'red'],
    contrast: { white: ['black', 'red'], red: ['black'] },
    padX: 7,
    padY: 7,
    stroke: 'white',
    mixFonts: false,
    // UI 风格整张图共用一款粗体，与旧版一致
    preferred: '微软雅黑 Bold',
  },
}

const FONT_EXTENSIONS = new Set(['.ttf', '.ttc', '.otf', '.woff', '.woff2'])

/** 随包分发的字体：字体族名 -> `assets/fonts` 下的文件名。 */
const BUNDLED_FONTS: Record<string, string> = {
  '微软雅黑': 'msyh.ttf',
  '微软雅黑 Bold': 'msyhbd.ttf',
  '黑体': 'simhei.ttf',
  '新宋体': 'simsun.ttf',
  '华文琥珀': 'STHUPO.TTF',
}

/** 在浏览器里跑的排版 + 绘制逻辑。 */
const CLIENT_SCRIPT = String.raw`
async ({ text, width, height, style, background }) => {
  const GAP = 20
  const canvas = document.getElementById('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  const image = new Image()
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = () => reject(new Error('背景图加载失败：' + background))
    image.src = background
  })
  context.drawImage(image, 0, 0, width, height)

  const pick = (list) => list[Math.floor(Math.random() * list.length)]
  const lines = text.split('\n').map((line) => line.trim())
  const sharedFont = style.fonts.includes(style.preferred) ? style.preferred : pick(style.fonts)

  // 每个字的字体、抖动量与配色先定下来；后面整体缩放时这些保持不变，
  // 否则缩一次就换一套随机数，观感会跟着跳
  const plan = lines.map((line) => [...line].map((char) => {
    const color = pick(style.colors)
    return {
      char,
      font: style.mixFonts ? pick(style.fonts) : sharedFont,
      jitter: Math.random() * 20,
      color,
      background: pick(style.contrast[color]),
    }
  }))

  // 按给定比例排一遍版，量出每行的真实宽高。字间距同样按比例缩，
  // 否则字缩了、间距没缩，长行永远收不进画布
  const layout = (scale) => plan.map((chars, index) => {
    const line = lines[index]
    const base = Math.min(width / (line.length + 6), height / (lines.length + 6))
    const measured = chars.map((item) => {
      const size = Math.max(8, Math.floor((base + item.jitter) * scale))
      context.font = size + 'px "' + item.font + '"'
      const metrics = context.measureText(item.char)
      return {
        ...item, size,
        width: metrics.width,
        ascent: metrics.fontBoundingBoxAscent,
        height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
      }
    })
    const gap = GAP * scale
    return {
      chars: measured,
      width: measured.reduce((sum, item) => sum + item.width + gap, -gap),
      height: measured.reduce((max, item) => Math.max(max, item.height), 0),
    }
  })

  // 基准字号没把字间距算进去，长行会顶出画布；量完按最宽的一行整体收一次。
  // 宽度与 scale 成正比（字宽和间距都乘了 scale），所以一次就能收到位
  let scale = 1
  let rows = layout(scale)
  const limit = width * 0.96
  const widest = rows.reduce((max, row) => Math.max(max, row.width), 0)
  if (widest > limit) {
    scale = limit / widest
    rows = layout(scale)
  }
  const gap = GAP * scale

  // 第二遍：整体居中后逐字绘制。行高统一取最高的一行，行距才不会忽宽忽窄
  const rowHeight = rows.reduce((max, row) => Math.max(max, row.height), 0)
  const total = rows.length * (rowHeight + gap) - gap
  let y = (height - total) / 2

  for (const row of rows) {
    let x = (width - row.width) / 2
    for (const item of row.chars) {
      context.font = item.size + 'px "' + item.font + '"'

      // 每个字随机歪一点，绕自身中心旋转
      const centerX = x + item.width / 2
      const centerY = y + item.height / 2
      context.translate(centerX, centerY)
      context.rotate((Math.random() * 10 - 5) * Math.PI / 180)
      context.translate(-centerX, -centerY)

      context.fillStyle = item.background
      context.fillRect(x, y, item.width + style.padX, item.height + style.padY)

      if (style.stroke) {
        context.strokeStyle = style.stroke
        context.lineWidth = style.padX
        context.strokeRect(x, y, item.width, item.height)
      }

      context.fillStyle = item.color
      context.fillText(item.char, x + style.padX, y + style.padY / 2 + item.ascent)

      context.resetTransform()
      x += item.width + gap
    }
    y += rowHeight + gap
  }
}`

export function createRenderer(ctx: Context, config: Config) {
  const logger = ctx.logger('p5-advance-letter-generator')
  const blankUrl = 'file://' + path.join(__dirname, 'assets', 'blank.html').replace(/\\/g, '/')
  const background = './background.png'

  /** 用户自备的字体目录，文件名即字体族名。 */
  const fontDir = path.join(ctx.baseDir, 'data', 'p5-advance-letter-generator', 'fonts')
  fs.mkdirSync(fontDir, { recursive: true })

  function fontFaces() {
    let files: string[] = []
    try {
      files = fs.readdirSync(fontDir).filter((file) => FONT_EXTENSIONS.has(path.extname(file).toLowerCase()))
    } catch (error) {
      logger.warn('读取字体目录 %s 失败：%s', fontDir, error.message)
    }
    // 优先用用户自备的同名字体文件，其次用随包分发的那份；
    // 两者都没有就不写 @font-face，交给浏览器按名字找系统字体
    return config.fonts.map((family) => {
      const custom = files.find((name) => path.parse(name).name === family)
      const file = custom
        ? path.join(fontDir, custom)
        : BUNDLED_FONTS[family] && path.join(__dirname, 'assets', 'fonts', BUNDLED_FONTS[family])
      if (!file || !fs.existsSync(file)) return ''
      const url = `file://${file.replace(/\\/g, '/')}`
      return `@font-face { font-family: "${family}"; src: local("${family}"), url("${url}"); }`
    }).filter(Boolean).join('\n    ')
  }

  function html() {
    return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>P5</title>
  <style>
    ${fontFaces()}
    body { margin: 0; }
    canvas { display: block; }
  </style>
</head>
<body><canvas id="canvas"></canvas></body>
</html>`
  }

  /** 交给 page.evaluate 执行的表达式：等字体就位，然后排版绘制。 */
  function script(text: string, width: number, height: number, style: Style) {
    const payload = JSON.stringify({
      text,
      width,
      height,
      background,
      style: { ...STYLES[style], fonts: config.fonts },
    })
    return `(async (payload) => {
      // 量字之前必须确认字体已经就位，否则测出来的是回退字体的宽度；
      // 系统里没有的字体会 reject，忽略即可，交给浏览器回退
      await Promise.all(payload.style.fonts.map((family) =>
        document.fonts.load('100px "' + family + '"').catch(() => {})))
      await document.fonts.ready
      await (${CLIENT_SCRIPT})(payload)
    })(${payload})`
  }

  return async function render(text: string, width: number, height: number, style: Style) {
    const target = await ctx.puppeteer.page()
    try {
      await target.setViewport({ width, height })
      // 先落到 assets 目录下的空白页：页面有了 file:// 源才读得到旁边的背景图。
      // 背景图也因此不必 base64 内联——两百多 KB 塞进页面会把无头浏览器顶崩
      await target.goto(blankUrl)
      await target.setContent(html())
      // 直接 evaluate 一个 async 表达式，puppeteer 会等它 resolve，
      // 不必往页面里塞 <script> 再轮询完成标记
      await target.evaluate(script(text, width, height, style))
      return await (await target.$('#canvas')).screenshot({ type: config.imageType })
    } finally {
      await target.close()
    }
  }
}
