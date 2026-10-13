import { shouldDisablePoweredBy } from '../src/utils/poweredByVisibility.js'
import { WHITE_LABEL_SITE_NAME } from '../src/utils/siteBranding.js'

const POWERED_BY_TITLE_SUFFIX = /(?:\s+-\s*)?Powered by Orderingplus\s*$/i
const BARE_ORDERING_TITLE = /^ordering$/i

export const resolveWorkerDisablePoweredBy = (envDisableBoolean, firstLoad) =>
  shouldDisablePoweredBy({
    envDisablePoweredBy: envDisableBoolean,
    features: firstLoad?.features,
    configs: firstLoad?.configs
  })

export const applyPoweredByDisableToFirstLoad = (firstLoad, disable) => {
  if (!disable || !firstLoad?.configs?.powered_by_ordering_module) {
    return firstLoad
  }

  return {
    ...firstLoad,
    configs: {
      ...firstLoad.configs,
      powered_by_ordering_module: {
        ...firstLoad.configs.powered_by_ordering_module,
        value: false
      }
    }
  }
}

export const stripPoweredByFromTitle = (title, disable) => {
  if (!disable || typeof title !== 'string') return title
  return title.replace(POWERED_BY_TITLE_SUFFIX, '').trimEnd()
}

export const applyWhiteLabelDocumentTitle = (title, { disable, siteName } = {}) => {
  const stripped = stripPoweredByFromTitle(title, disable)
  if (!disable) return stripped
  if (typeof stripped === 'string') {
    const trimmed = stripped.trim()
    if (trimmed && !BARE_ORDERING_TITLE.test(trimmed)) return trimmed
  }
  return String(siteName || '').trim() || WHITE_LABEL_SITE_NAME
}
