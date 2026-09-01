import { Context, h } from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import { Config } from './config'
import { createRenderer, Style } from './render'

export { Config }
export const name = 'p5-advance-letter-generator'
export const inject = ['puppeteer']

export const usage = `## 使用

文本中用 \`/\` 换行。自定义字体放入 \`data/p5-advance-letter-generator/fonts/\`。

## 指令

| 指令 | 说明 |
| --- | --- |
| \`p5letter\` | 查看帮助 |
| \`p5letter.生成预告信 <文本>\` | 生成预告信 |
| \`p5letter.生成UI <文本>\` | 生成 UI 风格图 |

支持 \`-w <宽度>\` 与 \`--height <高度>\`。`

export function apply(ctx: Context, config: Config) {
  const render = createRenderer(ctx, config)

  const cmd = ctx.command('p5letter', 'P5 预告信 / UI 生成')
    .alias('p5advanceLetter')
    .action(({ session }) => session.execute('help p5letter'))

  function define(name: string, description: string, style: Style) {
    cmd.subcommand(`.${name} <text:text>`, description)
      .option('canvasWidth', '-w <width:posint> 画布宽度')
      .option('canvasHeight', '--height <height:posint> 画布高度')
      .usage('文本里用 `/` 换行。')
      .action(async ({ options }, text) => {
        if (!text?.trim()) return '⚠️ 请输入要生成的文本。文本里用 `/` 换行。'
        const width = options.canvasWidth || config.canvasWidth
        const height = options.canvasHeight || config.canvasHeight
        const buffer = await render(text.replace(/\/+/g, '\n'), width, height, style)
        return h.image(buffer, `image/${config.imageType}`)
      })
  }

  define('生成预告信', '生成 P5 预告信', 'letter')
  define('生成UI', '生成 P5 UI 风格图', 'ui')
}
