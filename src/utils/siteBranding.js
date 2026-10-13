import { publicAssetUrl } from './publicAssetUrl'

export const ORDERING_DOMAINS = ['tryordering.com', 'ordering.co', 'orderingplus.com']
export const ORDERING_FAVICON = '/favicon.png'
export const WHITE_LABEL_LOGO = '/default-logo.png'
export const WHITE_LABEL_FAVICON = '/default-favicon.png'
export const WHITE_LABEL_SITE_NAME = 'My Brand'

const PLACEHOLDER_ASSETS = new Set([WHITE_LABEL_LOGO, WHITE_LABEL_FAVICON])

const currentHostname = () =>
  typeof window === 'undefined' ? '' : window.location.hostname

const brandAssetPath = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    return raw.includes('://') ? new URL(raw).pathname : raw.split('?')[0]
  } catch (_) {
    return raw
  }
}

export const isOfficialOrderingHost = (hostname = currentHostname()) => {
  if (!hostname) return false
  return ORDERING_DOMAINS.some(domain => String(hostname).includes(domain))
}

export const isConfiguredBrandAsset = (value) => {
  const path = brandAssetPath(value)
  return !!path && !PLACEHOLDER_ASSETS.has(path)
}

export const getSiteLogoUrl = (
  configuredLogo,
  orderingLogo,
  hostname = currentHostname()
) => publicAssetUrl(
  (isConfiguredBrandAsset(configuredLogo) ? String(configuredLogo).trim() : '') ||
  (isOfficialOrderingHost(hostname) ? orderingLogo : WHITE_LABEL_LOGO)
)

export const resolveSiteFaviconSource = (
  configuredFavicon,
  siteLogo,
  hostname = currentHostname()
) =>
  (isConfiguredBrandAsset(configuredFavicon) ? String(configuredFavicon).trim() : '') ||
  (isConfiguredBrandAsset(siteLogo) ? String(siteLogo).trim() : '') ||
  (isOfficialOrderingHost(hostname) ? ORDERING_FAVICON : WHITE_LABEL_FAVICON)

export const getSiteFaviconUrl = (
  configuredFavicon,
  siteLogo,
  hostname = currentHostname()
) => publicAssetUrl(resolveSiteFaviconSource(configuredFavicon, siteLogo, hostname))
