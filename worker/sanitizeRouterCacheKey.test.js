import { describe, expect, it } from 'vitest'

import { sanitizeRouterCacheKey } from './sanitizeRouterCacheKey'

const requestOrigin = 'https://franchise.example.com'
const validKey = `https://websites-router.internal/first-load?origin=${encodeURIComponent(requestOrigin)}`

describe('sanitizeRouterCacheKey', () => {
  it('keeps a router key whose origin matches the request', () => {
    expect(sanitizeRouterCacheKey(validKey, requestOrigin)).toBe(validKey)
  })

  it('drops a router key for a different tenant origin', () => {
    expect(sanitizeRouterCacheKey(
      'https://websites-router.internal/first-load?origin=https://other-tenant.example.com',
      requestOrigin
    )).toBeNull()
  })

  it('drops keys outside the router-internal namespace', () => {
    expect(sanitizeRouterCacheKey(
      'https://evil.example.com/first-load?origin=https://franchise.example.com',
      requestOrigin
    )).toBeNull()
  })

  it('drops lookalike router hosts', () => {
    expect(sanitizeRouterCacheKey(
      'https://websites-router.internal.evil.com/first-load?origin=https://franchise.example.com',
      requestOrigin
    )).toBeNull()
  })

  it('drops oversize or invalid values', () => {
    expect(sanitizeRouterCacheKey('not a url', requestOrigin)).toBeNull()
    expect(sanitizeRouterCacheKey('x'.repeat(1025), requestOrigin)).toBeNull()
    expect(sanitizeRouterCacheKey(null, requestOrigin)).toBeNull()
  })
})
