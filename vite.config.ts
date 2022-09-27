import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    WindiCSS(),
    Components({
      dirs: ['src/components'],
      resolvers: [AntDesignVueResolver()],
      dts: 'src/types/components.d.ts',
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'drawer-header-padding': '0.5rem',
          'drawer-body-padding': '0.5rem',
          'tabs-horizontal-gutter': '0.75rem',
          'tabs-bar-margin': '0',
        },
      },
    },
  },
})
