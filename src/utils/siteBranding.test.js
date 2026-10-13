import { describe, expect, it } from 'vitest'

import {
  ORDERING_FAVICON,
  WHITE_LABEL_FAVICON,
  WHITE_LABEL_LOGO,
  WHITE_LABEL_SITE_NAME,
  getSiteFaviconUrl,
  getSiteLogoUrl,
  isOfficialOrderingHost
} from './siteBranding'
import { isOrderingHost, resolveTenantFaviconUrl } from '../../worker/seo'

const officialHosts = [
  'demo.orderingplus.com',
  'tenant.tryordering.com',
  'shop.ordering.co',
  'v26-demo.orderingplus.com'
]

const nonOfficialHosts = [
  'custom.example.com',
  'localhost',
  ''
]

const orderingLogo = '/assets/logotype.svg'
const projectLogo = 'https://cloud-assets.orderingplus.com/tenant/logo.png'
const projectFavicon = 'https://cloud-assets.orderingplus.com/tenant/favicon.png'

describe('host detection stays in sync with the worker', () => {
  it.each(officialHosts)('recognizes official host %s', hostname => {
    expect(isOfficialOrderingHost(hostname)).toBe(true)
    expect(isOrderingHost(hostname)).toBe(true)
  })

  it.each(nonOfficialHosts)('rejects non-official host %s', hostname => {
    expect(isOfficialOrderingHost(hostname)).toBe(false)
    expect(isOrderingHost(hostname)).toBe(false)
  })
})

describe('official Ordering hosts', () => {
  it.each(officialHosts)('falls back to Ordering branding on %s', hostname => {
    expect(getSiteLogoUrl('', orderingLogo, hostname)).toBe(orderingLogo)
    expect(getSiteFaviconUrl('', '', hostname)).toBe(ORDERING_FAVICON)
  })

  it.each(officialHosts)('ignores white-label placeholders on %s', hostname => {
    expect(getSiteLogoUrl(WHITE_LABEL_LOGO, orderingLogo, hostname)).toBe(orderingLogo)
    expect(getSiteFaviconUrl(WHITE_LABEL_FAVICON, '', hostname)).toBe(ORDERING_FAVICON)
  })

  it.each(officialHosts)('lets the configured project override Ordering branding on %s', hostname => {
    expect(getSiteLogoUrl(projectLogo, orderingLogo, hostname)).toBe(projectLogo)
    expect(getSiteFaviconUrl(projectFavicon, '', hostname)).toBe(projectFavicon)
  })
})

describe('white-label and custom domains', () => {
  it.each(nonOfficialHosts)('falls back to My Brand placeholders on %s', hostname => {
    expect(getSiteLogoUrl('', orderingLogo, hostname)).toBe(WHITE_LABEL_LOGO)
    expect(getSiteFaviconUrl('', '', hostname)).toBe(WHITE_LABEL_FAVICON)
  })

  it('uses My Brand as the white-label site name placeholder', () => {
    expect(WHITE_LABEL_SITE_NAME).toBe('My Brand')
  })

  it.each(nonOfficialHosts)('keeps the configured project branding on %s', hostname => {
    expect(getSiteLogoUrl(projectLogo, orderingLogo, hostname)).toBe(projectLogo)
    expect(getSiteFaviconUrl(projectFavicon, '', hostname)).toBe(projectFavicon)
  })
})

describe('favicon falls back to the site logo', () => {
  it.each(officialHosts)('uses site.logo when no custom favicon exists on %s', hostname => {
    expect(getSiteFaviconUrl('', projectLogo, hostname)).toBe(projectLogo)
    expect(resolveTenantFaviconUrl('', projectLogo, hostname)).toBe(projectLogo)
  })

  it.each(nonOfficialHosts)('uses site.logo on white-label host %s', hostname => {
    expect(getSiteFaviconUrl('', projectLogo, hostname)).toBe(projectLogo)
    expect(resolveTenantFaviconUrl('', projectLogo, hostname)).toBe(projectLogo)
  })

  it('ignores placeholder favicon and uses site.logo', () => {
    expect(getSiteFaviconUrl(WHITE_LABEL_FAVICON, projectLogo, 'wegoo.es')).toBe(projectLogo)
    expect(resolveTenantFaviconUrl(WHITE_LABEL_FAVICON, projectLogo, 'wegoo.es')).toBe(projectLogo)
  })

  it('keeps a custom favicon ahead of site.logo', () => {
    expect(getSiteFaviconUrl(projectFavicon, projectLogo, 'wegoo.es')).toBe(projectFavicon)
    expect(resolveTenantFaviconUrl(projectFavicon, projectLogo, 'wegoo.es')).toBe(projectFavicon)
  })

  it('ignores placeholder site.logo and keeps the host default', () => {
    expect(getSiteFaviconUrl('', WHITE_LABEL_LOGO, 'demo.orderingplus.com')).toBe(ORDERING_FAVICON)
    expect(getSiteFaviconUrl('', WHITE_LABEL_LOGO, 'wegoo.es')).toBe(WHITE_LABEL_FAVICON)
    expect(resolveTenantFaviconUrl('', WHITE_LABEL_LOGO, 'demo.orderingplus.com')).toBe(ORDERING_FAVICON)
    expect(resolveTenantFaviconUrl('', WHITE_LABEL_LOGO, 'wegoo.es')).toBe(WHITE_LABEL_FAVICON)
  })
})
