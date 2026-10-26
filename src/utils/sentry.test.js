import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as Sentry from '@sentry/react'

import settings from '../config'
import baseConfig from '../config.json'
import { initSentry, isAllowedDomain } from './sentry'

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({ name: 'BrowserTracing' }))
}))

const DSN = 'https://public@o1.ingest.us.sentry.io/1'
const originalSentryKey = settings.sentry_key

const stubHostname = (hostname) => {
  vi.stubGlobal('location', { hostname })
}

const enableAllGates = () => {
  vi.stubEnv('VITE_SENTRY_RELEASE', 'abc123')
  settings.sentry_key = DSN
  stubHostname('demo.orderingplus.com')
}

describe('isAllowedDomain', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    'demo.orderingplus.com',
    'v26-x.orderingplus.com'
  ])('allows %s', (hostname) => {
    stubHostname(hostname)
    expect(isAllowedDomain()).toBe(true)
  })

  it.each([
    'customer-store.com',
    'localhost'
  ])('rejects %s', (hostname) => {
    stubHostname(hostname)
    expect(isAllowedDomain()).toBe(false)
  })
})

describe('initSentry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Sentry.browserTracingIntegration.mockImplementation(() => ({ name: 'BrowserTracing' }))
    Sentry.init.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    settings.sentry_key = originalSentryKey
  })

  it('ships an empty DSN until the deployment owner configures Sentry', () => {
    expect(baseConfig.sentry_key).toBe('')
    expect(settings.sentry_key).toBe(baseConfig.sentry_key)
  })

  it('skips the SDK import when the build has no release', async () => {
    enableAllGates()
    vi.stubEnv('VITE_SENTRY_RELEASE', '')

    expect(initSentry()).toBeUndefined()
    await Promise.resolve()

    expect(Sentry.init).not.toHaveBeenCalled()
    expect(Sentry.browserTracingIntegration).not.toHaveBeenCalled()
  })

  it('skips the SDK import when the DSN is empty', async () => {
    enableAllGates()
    settings.sentry_key = ''

    expect(initSentry()).toBeUndefined()
    await Promise.resolve()

    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('skips the SDK import when the DSN is missing', async () => {
    enableAllGates()
    delete settings.sentry_key

    expect(initSentry()).toBeUndefined()
    await Promise.resolve()

    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it.each([
    'customer-store.com',
    'localhost'
  ])('skips the SDK import on %s', async (hostname) => {
    enableAllGates()
    stubHostname(hostname)

    expect(initSentry()).toBeUndefined()
    await Promise.resolve()

    expect(Sentry.init).not.toHaveBeenCalled()
    expect(Sentry.browserTracingIntegration).not.toHaveBeenCalled()
  })

  it.each([
    'demo.orderingplus.com',
    'v26-x.orderingplus.com'
  ])('imports the SDK and initializes with the production options on %s', async (hostname) => {
    enableAllGates()
    stubHostname(hostname)

    const pending = initSentry()

    expect(pending).toBeInstanceOf(Promise)
    await pending
    expect(Sentry.browserTracingIntegration).toHaveBeenCalledTimes(1)
    expect(Sentry.init).toHaveBeenCalledTimes(1)
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: DSN,
      environment: 'production',
      release: 'website-franchises@abc123',
      integrations: [{ name: 'BrowserTracing' }],
      tracesSampleRate: 0.1
    })
  })

  it('swallows errors thrown by Sentry.init', async () => {
    enableAllGates()
    Sentry.init.mockImplementation(() => {
      throw new Error('init failed')
    })

    await expect(initSentry()).resolves.toBeUndefined()
    expect(Sentry.init).toHaveBeenCalledTimes(1)
  })

  it('swallows errors thrown while building integrations', async () => {
    enableAllGates()
    Sentry.browserTracingIntegration.mockImplementation(() => {
      throw new Error('integration failed')
    })

    await expect(initSentry()).resolves.toBeUndefined()
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('swallows synchronous errors when the location is unavailable', () => {
    enableAllGates()
    vi.stubGlobal('location', undefined)

    expect(() => initSentry()).not.toThrow()
    expect(initSentry()).toBeUndefined()
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  describe('when the SDK chunk fails to load', () => {
    beforeEach(() => {
      vi.resetModules()
      vi.doMock('./sentrySdk', () => {
        throw new Error('chunk load failed')
      })
    })

    afterEach(() => {
      vi.doUnmock('./sentrySdk')
      vi.resetModules()
    })

    it('swallows the rejected import', async () => {
      enableAllGates()

      const pending = initSentry()

      expect(pending).toBeInstanceOf(Promise)
      await expect(pending).resolves.toBeUndefined()
      expect(Sentry.init).not.toHaveBeenCalled()
    })
  })
})
