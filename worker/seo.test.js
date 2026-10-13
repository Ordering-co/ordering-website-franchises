import { describe, expect, it } from 'vitest'
import {
  isOrderingHost,
  isConfiguredBrandAsset,
  resolveTenantFaviconUrl,
  deriveProjectFromHost,
  mapSeoEndpoint,
  ORDERING_FAVICON,
  WHITE_LABEL_FAVICON
} from './seo.js'
import { safeDecodeURIComponent } from './safeDecodeURIComponent.js'

describe('seo helpers', () => {
  it('detects ordering hosts', () => {
    expect(isOrderingHost('demo.orderingplus.com')).toBe(true)
    expect(isOrderingHost('shop.example.com')).toBe(false)
    expect(isOrderingHost('')).toBe(false)
  })

  it('rejects placeholder brand assets', () => {
    expect(isConfiguredBrandAsset('/default-logo.png')).toBe(false)
    expect(isConfiguredBrandAsset('https://cdn.example.com/logo.png')).toBe(true)
    expect(isConfiguredBrandAsset('')).toBe(false)
  })

  it('resolves tenant favicon fallbacks', () => {
    expect(resolveTenantFaviconUrl('', '', 'demo.orderingplus.com')).toBe(ORDERING_FAVICON)
    expect(resolveTenantFaviconUrl('', '', 'shop.example.com')).toBe(WHITE_LABEL_FAVICON)
    expect(resolveTenantFaviconUrl('https://cdn.example.com/fav.png', '', 'x')).toBe('https://cdn.example.com/fav.png')
  })

  it('derives project from host rules', () => {
    expect(deriveProjectFromHost('demo.orderingplus.com', { use_project_subdomain: true, project: 'fallback' })).toBe('demo')
    expect(deriveProjectFromHost('shop.example.com', { use_project_domain: true, project: 'fallback' })).toBe('_')
    expect(deriveProjectFromHost('shop.example.com', { project: 'fallback' })).toBe('fallback')
  })

  it('does not throw on malformed percent-encoding', () => {
    expect(safeDecodeURIComponent('%')).toBe('%')
    expect(safeDecodeURIComponent('%ZZ')).toBe('%ZZ')
    expect(safeDecodeURIComponent('pizza%20place')).toBe('pizza place')
    expect(() => mapSeoEndpoint('/%', new URLSearchParams())).not.toThrow()
    expect(() => mapSeoEndpoint('/%ZZ', new URLSearchParams())).not.toThrow()
    expect(() => mapSeoEndpoint('/store/%', new URLSearchParams())).not.toThrow()
  })

  it('maps valid encoded business slugs', () => {
    expect(mapSeoEndpoint('/store/pizza%20place', new URLSearchParams())).toBe(
      '/seo/business/pizza%20place'
    )
  })
})
