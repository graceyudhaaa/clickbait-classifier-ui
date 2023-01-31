import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  server: {
    proxy: {
      '/api':{
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        app: './src/main.jsx',
      },
    },
  },
})