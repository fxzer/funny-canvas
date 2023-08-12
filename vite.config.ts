import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), UnoCSS(), AutoImport({
    include: [
      // 导入目标文件类型
      /\.[tj]s(x|on)?$/, // .ts, .tsx, .js, .jsx .json
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    imports: [
      // 预定义
      'vue', // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      'vue-router',
      {
        '@vueuse/core': [
          'useMouse',
          'useElementSize',
          'useToggle',
          'useDark',
          'useFps',
          'useMouse',
          'useTitle',
          'useDebounceFn',
        ],
      },
    ],
    dts: true, // 为导入的文件生成 .d.ts 文件
    dirs: [
      './src/hooks', // 导入hooks文件夹下的钩子
    ],
  })],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
    ],
  },
})
