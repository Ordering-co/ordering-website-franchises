import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const testUiAlias = resolve(__dirname, 'src/test/franchiseUiMock.js')
const testComponentsAlias = resolve(__dirname, 'src/test/franchiseComponentsMock.js')
const uiBarrel = resolve(__dirname, 'src/ui/index.js')
const uiDir = resolve(__dirname, 'src/ui')
const componentsBarrel = resolve(__dirname, 'src/@/components/src/index.js')
const componentsDir = resolve(__dirname, 'src/@/components/src')

const normalizeId = (id = '') => id.split('?')[0]
const isUiUtils = (id) => {
  const normalized = normalizeId(id)
  return normalized === '~ui/utils' ||
    normalized.startsWith('~ui/utils/') ||
    normalized.endsWith('franchiseUiMock.js/utils')
}
const isUiBarrel = (id) => {
  const normalized = normalizeId(id)
  if (isUiUtils(id)) return false
  return normalized === '~ui' ||
    normalized.startsWith('~ui/') ||
    normalized === uiDir ||
    normalized === uiBarrel
}
const isComponentsBarrel = (id) => {
  const normalized = normalizeId(id)
  return normalized === '~components' ||
    normalized.startsWith('~components/') ||
    normalized === componentsDir ||
    normalized === componentsBarrel
}

export default defineConfig(async (configEnv) => {
  const base = typeof viteConfig === 'function'
    ? await viteConfig(configEnv)
    : viteConfig

  const merged = mergeConfig(base, {
    plugins: [
      {
        name: 'franchise-test-barrel-aliases',
        enforce: 'pre',
        resolveId (id) {
          if (isUiUtils(id)) return testUiAlias
          if (isUiBarrel(id)) return testUiAlias
          if (isComponentsBarrel(id)) return testComponentsAlias
          return null
        }
      }
    ],
    test: {
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/'
        }
      },
      setupFiles: './src/setupTests.js',
      pool: 'forks',
      maxWorkers: 1,
      fileParallelism: false,
      include: ['src/**/*.test.js', 'src/**/*.test.jsx', 'worker/**/*.test.js'],
      exclude: ['src/@/components/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json'],
        reportsDirectory: './coverage',
        include: [
          'src/**/*.{js,jsx}',
          'worker/**/*.js'
        ],
        exclude: [
          'src/@/components/**',
          '**/*.{test,spec}.{js,jsx}',
          '**/node_modules/**'
        ]
      }
    }
  })

  merged.resolve = merged.resolve || {}
  const existingAliases = Array.isArray(merged.resolve.alias)
    ? merged.resolve.alias
    : Object.entries(merged.resolve.alias || {}).map(([find, replacement]) => ({ find, replacement }))
  merged.resolve.alias = [
    { find: '~ui/utils', replacement: testUiAlias },
    { find: /^~ui$/, replacement: testUiAlias },
    { find: /^~components$/, replacement: testComponentsAlias },
    ...existingAliases.filter((alias) => {
      const current = typeof alias === 'string' ? alias : alias.find
      return current !== '~ui' && current !== '~ui/utils' && current !== '~components'
    })
  ]

  return merged
})
