import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
  base: './',
  plugins: [react(), dsv()],
  server: { host: true, port: 5000 },
  build: { chunkSizeWarningLimit: 1024 },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
