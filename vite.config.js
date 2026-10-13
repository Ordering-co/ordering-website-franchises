import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const createConfig = base => ({
  base,
  plugins: [
    react({
      include: /\.(js|jsx|ts|tsx)$/,
      babel: {
        babelrc: false,
        configFile: false,
        presets: [['@babel/preset-react', { runtime: 'automatic' }]]
      }
    }),
    {
      name: 'copy-config-json-to-dist',
      writeBundle () {
        const distDir = resolve(__dirname, 'dist')
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true })
        }
        copyFileSync(
          resolve(__dirname, 'src/config.json'),
          resolve(__dirname, 'dist/config.json')
        )
      }
    }
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '~components': resolve(__dirname, 'src/@/components/src'),
      '~ui': resolve(__dirname, 'src/ui'),
      'smart-app-banner': resolve(__dirname, 'src/shims/ordering-sab.js'),
      'ordering-sab-vendor': resolve(__dirname, 'node_modules/smart-app-banner')
    }
  },
  publicDir: 'public',
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: false,
    host: true
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const assetBaseUrl =
    process.env.ASSET_BASE_URL ||
    process.env.VITE_ASSET_BASE_URL ||
    env.ASSET_BASE_URL ||
    env.VITE_ASSET_BASE_URL ||
    '/'

  return createConfig(
    assetBaseUrl.endsWith('/') ? assetBaseUrl : `${assetBaseUrl}/`
  )
})
