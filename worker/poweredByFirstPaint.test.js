import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  applyPoweredByDisableToFirstLoad,
  applyWhiteLabelDocumentTitle,
  resolveWorkerDisablePoweredBy,
  stripPoweredByFromTitle
} from './poweredByFirstPaint'

const workerSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'index.js'),
  'utf8'
)

describe('resolveWorkerDisablePoweredBy', () => {
  it('is true when first-load features enable white label', () => {
    expect(resolveWorkerDisablePoweredBy(false, {
      features: { white_label_franchise_module: { value: true } },
      configs: { powered_by_ordering_module: { value: true } }
    })).toBe(true)
  })

  it('is true for the CloudyJAYS production first-load shape', () => {
    expect(resolveWorkerDisablePoweredBy(false, {
      features: {
        white_label_franchise_module: { value: true },
        white_label_module: { value: true }
      }
    })).toBe(true)
  })

  it('is true when the deploy env disables powered-by', () => {
    expect(resolveWorkerDisablePoweredBy(true, {
      features: { white_label_franchise_module: { value: false } }
    })).toBe(true)
  })

  it('is false when neither env nor white label is on', () => {
    expect(resolveWorkerDisablePoweredBy(false, {
      features: { white_label_franchise_module: { value: false } },
      configs: { powered_by_ordering_module: { value: true } }
    })).toBe(false)
  })

  it('is false for enterprise tenants when white label is off', () => {
    expect(resolveWorkerDisablePoweredBy(false, {
      features: { white_label_franchise_module: { value: false } },
      configs: {
        powered_by_ordering_module: { value: true },
        plan_enterprise: { value: true }
      }
    })).toBe(false)
  })
})

describe('applyPoweredByDisableToFirstLoad', () => {
  it('turns off powered_by_ordering_module when branding is disabled', () => {
    const firstLoad = {
      configs: { powered_by_ordering_module: { value: true } }
    }
    expect(applyPoweredByDisableToFirstLoad(firstLoad, true).configs.powered_by_ordering_module.value)
      .toBe(false)
  })

  it('leaves first-load unchanged when branding stays enabled', () => {
    const firstLoad = {
      configs: { powered_by_ordering_module: { value: true } }
    }
    expect(applyPoweredByDisableToFirstLoad(firstLoad, false)).toBe(firstLoad)
  })
})

describe('stripPoweredByFromTitle', () => {
  it('removes Powered by Orderingplus when branding is disabled', () => {
    expect(stripPoweredByFromTitle(
      'CloudyJAYS - Home - Powered by Orderingplus',
      true
    )).toBe('CloudyJAYS - Home')
  })

  it('keeps the title when branding stays enabled', () => {
    expect(stripPoweredByFromTitle(
      'CloudyJAYS - Home - Powered by Orderingplus',
      false
    )).toBe('CloudyJAYS - Home - Powered by Orderingplus')
  })
})

describe('applyWhiteLabelDocumentTitle', () => {
  it('replaces a bare Ordering title with My Brand when branding is disabled', () => {
    expect(applyWhiteLabelDocumentTitle('Ordering', { disable: true })).toBe('My Brand')
  })

  it('uses the tenant site name instead of Ordering when branding is disabled', () => {
    expect(applyWhiteLabelDocumentTitle('Ordering', {
      disable: true,
      siteName: 'CloudyJAYS'
    })).toBe('CloudyJAYS')
  })

  it('keeps a tenant title after stripping Powered by', () => {
    expect(applyWhiteLabelDocumentTitle(
      'CloudyJAYS - Home - Powered by Orderingplus',
      { disable: true, siteName: 'CloudyJAYS' }
    )).toBe('CloudyJAYS - Home')
  })
})

describe('worker first-paint wiring', () => {
  it('uses the first-paint helper for disable_powered_by and titles', () => {
    expect(workerSource).toContain('resolveWorkerDisablePoweredBy')
    expect(workerSource).toContain('applyPoweredByDisableToFirstLoad')
    expect(workerSource).toContain('stripPoweredByFromTitle')
    expect(workerSource).toContain('applyWhiteLabelDocumentTitle')
    expect(workerSource).toContain('pathname: url.pathname')
  })

  it('resolves disable_powered_by from the same firstLoad injected as __FIRST_LOAD__', () => {
    expect(workerSource).toContain('resolveWorkerDisablePoweredBy(\n      resolveBoolEnv(env.DISABLE_POWERED_BY, false),\n      firstLoad\n    )')
    expect(workerSource).toContain('applyPoweredByDisableToFirstLoad(firstLoad, disablePoweredBy)')
    expect(workerSource).toContain('disable_powered_by: disablePoweredBy')
    expect(workerSource).toContain('buildInjectionHandler(enrichedSeoData, processedFirstLoad, runtimeConfig, pageSpecificSeo, shouldNoindex)')
  })
})
