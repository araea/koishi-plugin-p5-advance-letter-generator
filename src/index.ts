import { Context, h } from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import { Config } from './config'
import { createRenderer, Style } from './render'

export { Config }
export const name = 'p5-advance-letter-generator'
export const inject = ['puppeteer']

export const usage = `## 使用

1. 启动 \`puppeteer\` 服务。
2. 文本里用 \`/\` 换行。

## 字体

插件不再随包分发字体（那些是有版权的商用字体）。默认直接使用系统里同名的字体；
想要原汁原味的效果，把字体文件放进 \`data/p5-advance-letter-generator/fonts\`，
文件名（去掉扩展名）就是配置项里的字体族名，例如 \`微软雅黑.ttf\`。

## 示例

\`\`\`
p5advanceLetter.生成预告信 -w 1920 --height 1080 尊敬的金城润矢先生:/扭曲事实沉溺于金钱利益之人，/您的种种恶行，我等已全然知晓/那个扭曲的欲望/就由我等来收下!/心之怪盗团-Joker敬上
\`\`\`

## QQ 群

- 956758505`

export function apply(ctx: Context, config: Config) {
  const render = createRenderer(ctx, config)

  const cmd = ctx.command('p5advanceLetter', 'P5 预告信 / UI 生成')
    .action(({ session }) => session.execute('help p5advanceLetter'))

  function define(name: string, description: string, style: Style) {
    cmd.subcommand(`.${name} <text:text>`, description)
      .option('canvasWidth', '-w <width:posint> 画布宽度')
      .option('canvasHeight', '--height <height:posint> 画布高度')
      .usage('文本里用 `/` 换行。')
      .action(async ({ options }, text) => {
        if (!text?.trim()) return '请给我要生成的语句呀，不然佐仓双叶来了都没办法生成！'
        const width = options.canvasWidth || config.canvasWidth
        const height = options.canvasHeight || config.canvasHeight
        const buffer = await render(text.replace(/\/+/g, '\n'), width, height, style)
        return h.image(buffer, `image/${config.imageType}`)
      })
  }

  define('生成预告信', '生成 P5 预告信', 'letter')
  define('生成UI', '生成 P5 UI 风格图', 'ui')
}
