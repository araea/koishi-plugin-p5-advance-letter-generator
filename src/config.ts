import { Schema } from 'koishi'

export interface Config {
  imageType: 'png' | 'jpeg' | 'webp'
  fonts: string[]
  canvasWidth: number
  canvasHeight: number
}

export const Config: Schema<Config> = Schema.object({
  imageType: Schema.union(['png', 'jpeg', 'webp']).default('png')
    .description('生成的图片格式。'),
  fonts: Schema.array(String).role('table')
    .default(['微软雅黑', '黑体', '新宋体', '华文琥珀'])
    .description('随机取用的字体族。系统里装了同名字体就直接用；也可以把字体文件放进 `data/p5-advance-letter-generator/fonts`，文件名（去掉扩展名）即字体族名。'),
  canvasWidth: Schema.natural().min(64).default(1770).description('默认画布宽度（像素）。'),
  canvasHeight: Schema.natural().min(64).default(1300).description('默认画布高度（像素）。'),
})
