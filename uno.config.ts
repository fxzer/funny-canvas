import {
  defineConfig,
  presetUno, transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  shortcuts: [
    ['flex-x-center', 'flex justify-center'],
    ['flex-y-center', 'flex items-center'],
    ['flex-center', 'flex items-center justify-center'],
    // 宽高相同
    [/^wh-(.+)$/, ([, c]) => `w-${c}  h-${c}`],
  ],
  rules: [
    [/^clamp-(\d+)$/, ([, d]) => ({
      'display': '-webkit-box',
      '-webkit-box-orient': ' vertical',
      '-webkit-line-clamp': d,
      'overflow': 'hidden',
    })],
    [/^sd-(\d+)-(\d+)$/, ([, d, a]) => ({
      'box-shadow': `0 0 ${d}px rgba(0, 0, 0, 0.${a})`,
    })],
  ],
  theme: {
    colors: {
    },
    width: {
    },
  },
  presets: [
    presetUno(),
    presetRemToPx(),
  ],
  transformers: [
    transformerDirectives(), // @apply, @screen, @variants
    transformerVariantGroup(), // 样式分组
  ],
})
