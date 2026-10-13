import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const appSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'App.js'),
  'utf8'
)

describe('App powered-by wiring', () => {
  it('uses the shared white-label helper instead of the worker flag alone', () => {
    expect(appSource).toContain('shouldShowPoweredByForClient')
    expect(appSource).not.toContain('powered_by_ordering_module?.value')
  })
})
