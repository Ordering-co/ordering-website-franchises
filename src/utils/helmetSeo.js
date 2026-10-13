import { isWhiteLabelFranchiseEnabledForClient, shouldShowPoweredByForClient } from './poweredByVisibility'
import { WHITE_LABEL_SITE_NAME } from './siteBranding'

const POWERED_BY_TEXT = /\s*-?\s*Powered by Orderingplus\s*/gi
const BARE_ORDERING_TITLE = /^ordering$/i

export const getSeoInjected = (seo, pathname) => {
  if (!seo || typeof seo !== 'object') return null
  if (seo.pathname && seo.pathname !== pathname) return null
  return seo
}

export const sanitizeWhiteLabelText = (value, isWhiteLabel) => {
  if (value == null) return ''
  let text = String(value)
  if (isWhiteLabel) {
    text = text.replace(POWERED_BY_TEXT, ' ').replace(/\s+/g, ' ').trim()
    if (BARE_ORDERING_TITLE.test(text)) return ''
  }
  return text.trim()
}

export const resolveHelmetTitle = ({
  page,
  siteName,
  configs,
  helmetMetaTags,
  seoInjected,
  helmetDataTitle
} = {}) => {
  const isWhiteLabel = isWhiteLabelFranchiseEnabledForClient(configs)
  const showPoweredBy = shouldShowPoweredByForClient(configs)
  const brandName = String(siteName || '').trim() || (isWhiteLabel ? WHITE_LABEL_SITE_NAME : '')
  const canRenderTitle = !!brandName && (!!page || isWhiteLabel)
  const rawPageTitle = String(
    helmetMetaTags?.title ??
    seoInjected?.title ??
    (page ? helmetDataTitle : '') ??
    ''
  ).trim()
  const pageTitle = sanitizeWhiteLabelText(rawPageTitle, isWhiteLabel)
  const seoIsFullTitle = !helmetMetaTags?.title && !!seoInjected?.title && !!pageTitle
  const titleTemplate = page && brandName && pageTitle && !seoIsFullTitle
    ? `${brandName} - %s`
    : undefined
  const titleInner = pageTitle
    ? `${pageTitle}${showPoweredBy && !/Powered by Orderingplus/i.test(pageTitle) ? ' - Powered by Orderingplus' : ''}`.trim()
    : brandName

  return {
    brandName,
    canRenderTitle,
    isWhiteLabel,
    showPoweredBy,
    titleTemplate,
    titleInner
  }
}

export const resolveHelmetDescription = ({
  siteDescription,
  helmetMetaTags,
  seoInjected,
  helmetDataDescription,
  configs
} = {}) => {
  const isWhiteLabel = isWhiteLabelFranchiseEnabledForClient(configs)
  const showPoweredBy = shouldShowPoweredByForClient(configs)
  const raw = String(
    helmetMetaTags?.description ||
    seoInjected?.description ||
    siteDescription ||
    helmetDataDescription ||
    ''
  )
  const description = sanitizeWhiteLabelText(raw, isWhiteLabel)
  if (showPoweredBy && description && !/Powered by Orderingplus/i.test(description)) {
    return `${description} Powered by Orderingplus`
  }
  return description
}

export const shouldRenderEnvOgTag = (value, isWhiteLabel) => {
  const text = String(value || '').trim()
  if (!text) return false
  if (isWhiteLabel && /ordering/i.test(text)) return false
  return true
}
