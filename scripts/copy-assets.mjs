import { cp, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 只带上背景图与那张空白页；字体是系统字体或用户自备，不随包分发
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = resolve(root, 'lib/assets')
await mkdir(target, { recursive: true })
for (const file of ['background.png', 'blank.html']) {
  await cp(resolve(root, 'src/assets', file), resolve(target, file))
}
console.log('copied assets to lib/assets/')
