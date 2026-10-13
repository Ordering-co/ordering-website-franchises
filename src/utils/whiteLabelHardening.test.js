import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { shouldShowPoweredBy } from './poweredByVisibility'
import { resolveWorkerDisablePoweredBy } from '../../worker/poweredByFirstPaint'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const readRepoFile = (relativePath) =>
  readFileSync(join(repoRoot, relativePath), 'utf8')

const enabled = { value: true }
const disabled = { value: false }

describe('white-label hardening', () => {
  it('hides branding when first-load features stay on after configs drop the flag', () => {
    expect(shouldShowPoweredBy({
      configs: { powered_by_ordering_module: enabled },
      features: { white_label_franchise_module: enabled },
      disablePoweredByFromWorker: false
    })).toBe(false)
    expect(resolveWorkerDisablePoweredBy(false, {
      features: {
        white_label_franchise_module: enabled,
        white_label_module: enabled
      }
    })).toBe(true)
  })

  it('keeps powered-by when the white-label feature is off', () => {
    expect(shouldShowPoweredBy({
      configs: {
        white_label_franchise_module: disabled,
        powered_by_ordering_module: enabled
      },
      features: { white_label_franchise_module: disabled },
      disablePoweredByFromWorker: false
    })).toBe(true)
  })

  it('does not modify the ordering-components submodule', () => {
    const output = execFileSync(
      'git',
      ['status', '--short', '--', 'src/@/components'],
      { cwd: repoRoot, encoding: 'utf8' }
    )
    expect(output.trim()).toBe('')
  })

  it('keeps white-label wiring in the franchise website, not the submodule', () => {
    const parentSources = [
      'src/App.js',
      'src/components/HelmetTags/index.js',
      'src/ui/src/components/Footer/index.js',
      'worker/index.js'
    ]

    parentSources.forEach((relativePath) => {
      const source = readRepoFile(relativePath)
      expect(source).toMatch(/shouldShowPoweredByForClient|resolveHelmetTitle|resolveWorkerDisablePoweredBy/)
      expect(source).not.toContain("from '~components/utils/poweredByVisibility'")
    })
  })
})
