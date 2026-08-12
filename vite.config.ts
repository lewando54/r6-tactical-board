import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

function spaFallback404() {
  return {
    name: 'spa-github-pages-404',
    closeBundle() {
      const distDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
      const indexFile = path.join(distDir, 'index.html')
      const notFoundFile = path.join(distDir, '404.html')
      if (existsSync(indexFile)) {
        copyFileSync(indexFile, notFoundFile)
      }
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), spaFallback404()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
