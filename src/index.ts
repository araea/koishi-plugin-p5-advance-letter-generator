import { Context, h } from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import { Config } from './config'
import { createRenderer, Style } from './render'

export { Config }
export const name = 'p5-advance-letter-generator'
export const inject = ['puppeteer']

export const usage = `## 使用

发送 \`p5letter.生成预告信 <文本>\` 或 \`p5letter.生成UI <文本>\` 得到一张图，文本中的 \`/\` 表示换行。自定义字体放入 \`data/p5-advance-letter-generator/fonts/\`。

## 指令

| 指令 | 说明 |
| --- | --- |
| \`p5letter\` | 帮助 |
| \`p5letter.生成预告信 <文本>\` | 生成预告信 |
| \`p5letter.生成UI <文本>\` | 生成 UI 风格图片 |

\`-w <宽度>\` 与 \`--height <高度>\` 调整图片尺寸。`

export function apply(ctx: Context, config: Config) {
  const render = createRenderer(ctx, config)

  const cmd = ctx.command('p5letter', 'P5 预告信 · UI 生成')
    .alias('p5advanceLetter')
    .action(({ session }) => session.execute('help p5letter'))

  function define(name: string, description: string, style: Style) {
    cmd.subcommand(`.${name} <text:text>`, description)
      .option('canvasWidth', '-w <width:posint> 画布宽度')
      .option('canvasHeight', '--height <height:posint> 画布高度')
      .usage('文本中的 `/` 表示换行。')
      .action(async ({ options }, text) => {
        if (!text?.trim()) return `⚠️ 文本是空的\n例：「p5letter.${name} 我们是怪盗团」。`
        const width = options.canvasWidth || config.canvasWidth
        const height = options.canvasHeight || config.canvasHeight
        const content = text.replace(/\/+/g, '\n')
        try {
          const buffer = await render(content, width, height, style)
          return h.image(buffer, `image/${config.imageType}`)
        } catch (error) {
          // 图是增强不是前提：渲染不可用时把文本原样发回去
          ctx.logger('p5-advance-letter-generator').warn('图片没有渲染出来：%s', error.message)
          return `❌ 图片没有渲染出来\n文本：${content}\n详细原因见后台日志，稍后重发即可。`
        }
      })
  }

  define('生成预告信', '生成 P5 预告信', 'letter')
  define('生成UI', '生成 P5 UI 风格图', 'ui')
}
