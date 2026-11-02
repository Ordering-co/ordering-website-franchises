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
      tracesSampleRate: 0.1,
      denyUrls: [/^iabjs:\/\/navigation_performance_logger_android$/]
    })
  })

  it.each([
    ['observed Facebook stack', 'Error invoking postMessage: Java object is gone', '    at sendDataToNative (iabjs://navigation_performance_logger_android:1:11853)\n    at sendJsBlockingTimeMessage (iabjs://navigation_performance_logger_android:1:16434)\n    at iabjs://navigation_performance_logger_android:1:20871\n    at sentryWrapped (https://example.invalid/sentry.js:97:17)', false],
    ['object method', 'Error invoking postMessage: Java object is gone', '    at Object.sendDataToNative (iabjs://navigation_performance_logger_android:1:11853)', false],
    ['minified method', 'Error invoking postMessage: Java object is gone', '    at e.sendDataToNative (iabjs://navigation_performance_logger_android:1:11853)', false],
    ['message punctuation variant', 'Error invoking postMessage: Java object is gone.', '    at sendDataToNative (iabjs://navigation_performance_logger_android:1:11853)', false],
    ['other error in this logger', 'Logger failed to collect timing', '    at collectTiming (iabjs://navigation_performance_logger_android:1:100)', false],
    ['application error with identical message', 'Error invoking postMessage: Java object is gone', '    at onClick (https://example.invalid/assets/app.js:1:100)', true],
    ['logger only in caller frame', 'Error invoking postMessage: Java object is gone', '    at onClick (https://example.invalid/assets/app.js:1:100)\n    at sendDataToNative (iabjs://navigation_performance_logger_android:1:11853)', true],
    ['other injected script', 'Error invoking postMessage: Java object is gone', '    at sendDataToNative (iabjs://other_logger:1:100)', true],
    ['similarly named script', 'Error invoking postMessage: Java object is gone', '    at sendDataToNative (iabjs://navigation_performance_logger_android_other:1:100)', true],
    ['missing stack frames', 'Error invoking postMessage: Java object is gone', '', true]
  ])('filters %s through the real SDK before transport', async (_name, message, stack, shouldSend) => {
    enableAllGates()
    await initSentry()
    const options = Sentry.init.mock.calls[0][0]
    const sdk = await vi.importActual('@sentry/react')
    const envelopes = []
    const client = new sdk.BrowserClient({
      ...options,
      stackParser: sdk.defaultStackParser,
      integrations: [sdk.inboundFiltersIntegration()],
      sendClientReports: false,
      transport: () => ({
        send: (envelope) => {
          envelopes.push(envelope)
          return Promise.resolve({ statusCode: 200 })
        },
        flush: () => Promise.resolve(true)
      })
    })
    client.init()
    try {
      const error = new Error(message)
      error.stack = `Error: ${message}\n${stack}`
      client.captureException(error)
      expect(await client.flush(2000)).toBe(true)
      const events = envelopes.flatMap(envelope => envelope[1])
        .filter(item => item[0].type === 'event')
        .map(item => item[1])
      expect(events).toHaveLength(shouldSend ? 1 : 0)
      if (shouldSend) expect(events[0].exception.values[0].value).toBe(message)
    } finally {
      await client.close(2000)
    }
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
