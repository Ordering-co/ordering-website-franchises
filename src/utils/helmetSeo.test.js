/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from 'vitest'

import {
  getSeoInjected,
  resolveHelmetDescription,
  resolveHelmetTitle,
  sanitizeWhiteLabelText,
  shouldRenderEnvOgTag
} from './helmetSeo'

const enabled = { value: true }

describe('getSeoInjected', () => {
  it('returns SEO when the pathname matches', () => {
    expect(getSeoInjected({ title: 'Home', pathname: '/' }, '/')).toEqual({
      title: 'Home',
      pathname: '/'
    })
  })

  it('ignores SEO from another path', () => {
    expect(getSeoInjected({ title: 'Home', pathname: '/' }, '/login')).toBeNull()
  })
})

describe('sanitizeWhiteLabelText', () => {
  it('strips Powered by Orderingplus when white label is on', () => {
    expect(sanitizeWhiteLabelText(
      'CloudyJAYS - Home - Powered by Orderingplus',
      true
    )).toBe('CloudyJAYS - Home')
  })

  it('clears a bare Ordering title when white label is on', () => {
    expect(sanitizeWhiteLabelText('Ordering', true)).toBe('')
  })

  it('keeps Powered by text when white label is off', () => {
    expect(sanitizeWhiteLabelText(
      'CloudyJAYS - Home - Powered by Orderingplus',
      false
    )).toBe('CloudyJAYS - Home - Powered by Orderingplus')
  })
})

afterEach(() => {
  delete window.__FIRST_LOAD__
  delete window.__CONFIG__
})

describe('resolveHelmetTitle', () => {
  it('does not prefix site name onto a full worker SEO title', () => {
    const result = resolveHelmetTitle({
      page: 'home',
      siteName: 'CloudyJAYS',
      configs: { white_label_franchise_module: enabled },
      seoInjected: { title: 'CloudyJAYS - Home - Powered by Orderingplus' }
    })

    expect(result.titleTemplate).toBeUndefined()
    expect(result.titleInner).toBe('CloudyJAYS - Home')
  })

  it('strips Powered by when only first-load features enable white label', () => {
    window.__CONFIG__ = { disable_powered_by: false }
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: enabled }
    }

    const result = resolveHelmetTitle({
      page: 'home',
      siteName: 'CloudyJAYS',
      configs: { powered_by_ordering_module: enabled },
      seoInjected: { title: 'CloudyJAYS - Home - Powered by Orderingplus' }
    })

    expect(result.isWhiteLabel).toBe(true)
    expect(result.showPoweredBy).toBe(false)
    expect(result.titleInner).toBe('CloudyJAYS - Home')
  })

  it('uses My Brand when first-load white label is on and the site has no name', () => {
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: enabled }
    }

    const result = resolveHelmetTitle({
      configs: { powered_by_ordering_module: enabled }
    })

    expect(result.isWhiteLabel).toBe(true)
    expect(result.titleInner).toBe('My Brand')
  })

  it('keeps Powered by when first-load and configs both have white label off', () => {
    window.__CONFIG__ = { disable_powered_by: false }
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: { value: false } }
    }

    const result = resolveHelmetTitle({
      page: 'home',
      siteName: 'CloudyJAYS',
      configs: {
        white_label_franchise_module: { value: false },
        powered_by_ordering_module: enabled
      },
      helmetMetaTags: { title: 'Home' }
    })

    expect(result.isWhiteLabel).toBe(false)
    expect(result.showPoweredBy).toBe(true)
    expect(result.titleInner).toContain('Powered by Orderingplus')
  })
})

describe('resolveHelmetDescription', () => {
  it('prefers worker SEO description and strips Powered by when white label is on', () => {
    expect(resolveHelmetDescription({
      siteDescription: 'Franchise site',
      seoInjected: { description: 'CMS description Powered by Orderingplus' },
      configs: { white_label_franchise_module: enabled }
    })).toBe('CMS description')
  })

  it('strips Powered by from description when only first-load features enable white label', () => {
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: enabled }
    }

    expect(resolveHelmetDescription({
      seoInjected: { description: 'CMS description Powered by Orderingplus' },
      configs: { powered_by_ordering_module: enabled }
    })).toBe('CMS description')
  })
})

describe('shouldRenderEnvOgTag', () => {
  it('hides Ordering env tags when white label is on', () => {
    expect(shouldRenderEnvOgTag('Orderingplus', true)).toBe(false)
    expect(shouldRenderEnvOgTag('CloudyJAYS', true)).toBe(true)
  })

  it('keeps Ordering env tags when white label is off', () => {
    expect(shouldRenderEnvOgTag('Orderingplus', false)).toBe(true)
  })
})
