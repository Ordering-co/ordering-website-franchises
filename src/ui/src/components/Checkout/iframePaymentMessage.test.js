import { describe, expect, it } from 'vitest'

import {
  createConfirmCartLock,
  isTrustedPaymentPluginOrigin,
  parsePaymentPluginMessage,
  shouldIgnoreIframePayment
} from './iframePaymentMessage'

describe('isTrustedPaymentPluginOrigin', () => {
  it('accepts the exact HTTPS plugin origin', () => {
    expect(isTrustedPaymentPluginOrigin('https://plugins.orderingplus.com')).toBe(true)
  })

  it('accepts HTTPS plugin subdomains used by iframe gateways', () => {
    expect(isTrustedPaymentPluginOrigin('https://globalpay.plugins.orderingplus.com')).toBe(true)
    expect(isTrustedPaymentPluginOrigin('https://cybersource.plugins.orderingplus.com')).toBe(true)
  })

  it('rejects lookalike hosts that only contain the trusted substring', () => {
    expect(isTrustedPaymentPluginOrigin('https://plugins.orderingplus.com.evil.com')).toBe(false)
    expect(isTrustedPaymentPluginOrigin('https://notplugins.orderingplus.com')).toBe(false)
  })

  it('rejects HTTP and missing origins', () => {
    expect(isTrustedPaymentPluginOrigin('http://plugins.orderingplus.com')).toBe(false)
    expect(isTrustedPaymentPluginOrigin(undefined)).toBe(false)
  })
})

describe('parsePaymentPluginMessage', () => {
  it('parses a JSON string payload', () => {
    expect(parsePaymentPluginMessage('{"data":{"id":"pay_1"}}')).toEqual({
      data: { id: 'pay_1' }
    })
  })

  it('accepts an already-parsed object without throwing', () => {
    expect(parsePaymentPluginMessage({ data: { id: 'pay_1' } })).toEqual({
      data: { id: 'pay_1' }
    })
  })

  it('returns null for non-JSON payloads instead of throwing', () => {
    expect(parsePaymentPluginMessage('not-json')).toBeNull()
    expect(parsePaymentPluginMessage(123)).toBeNull()
  })
})

describe('shouldIgnoreIframePayment', () => {
  it('ignores plugin handshake and card-setup messages', () => {
    expect(shouldIgnoreIframePayment({ data: { action: 'payment_ready' } })).toBe(true)
    expect(shouldIgnoreIframePayment({ action: 'card' })).toBe(true)
    expect(shouldIgnoreIframePayment({ data: { status: 'completed' } })).toBe(false)
  })
})

describe('createConfirmCartLock', () => {
  it('allows only one confirmCart acquisition', () => {
    const lock = createConfirmCartLock()
    expect(lock.tryAcquire()).toBe(true)
    expect(lock.tryAcquire()).toBe(false)
  })
})
