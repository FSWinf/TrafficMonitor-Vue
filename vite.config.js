import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/ogd_realtime/': {
        target: 'https://www.wienerlinien.at/',
        changeOrigin: true,
        secure: false
      },
      '/calendar/': {
        target: 'https://calendar.google.com/',
        changeOrigin: true,
        secure: false
      },
      '/events/': {
        target: 'https://tiss.tuwien.ac.at/',
        changeOrigin: true,
        secure: false
      },
    }
  }
})
