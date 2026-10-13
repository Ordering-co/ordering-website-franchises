const isTruthyFlag = (value) => {
  if (value === true || value === 1 || value === '1') return true
  if (typeof value === 'string' && value.trim().toLowerCase() === 'true') return true
  return false
}

const isConfigFlagEnabled = (entry) => isTruthyFlag(entry?.value)

export const isWhiteLabelFranchiseEnabled = (source = {}) =>
  isConfigFlagEnabled(source?.white_label_franchise_module)

export const isWhiteLabelFranchiseEnabledForClient = (configs) =>
  isWhiteLabelFranchiseEnabled(configs) ||
  (typeof window !== 'undefined' &&
    isWhiteLabelFranchiseEnabled(window.__FIRST_LOAD__?.features))

export const shouldDisablePoweredBy = ({
  envDisablePoweredBy = false,
  features,
  configs
} = {}) => (
  isTruthyFlag(envDisablePoweredBy) ||
  isWhiteLabelFranchiseEnabled(features) ||
  isWhiteLabelFranchiseEnabled(configs)
)

export const shouldShowPoweredBy = ({
  configs,
  features,
  disablePoweredByFromWorker
} = {}) => {
  if (isWhiteLabelFranchiseEnabled(configs) || isWhiteLabelFranchiseEnabled(features)) {
    return false
  }

  if (isTruthyFlag(disablePoweredByFromWorker)) {
    return false
  }

  return isConfigFlagEnabled(configs?.powered_by_ordering_module) ||
    isConfigFlagEnabled(configs?.plan_enterprise) ||
    isConfigFlagEnabled(features?.powered_by_ordering_module) ||
    isConfigFlagEnabled(features?.plan_enterprise)
}

export const shouldShowPoweredByForClient = (configs) =>
  shouldShowPoweredBy({
    configs,
    features: typeof window === 'undefined'
      ? undefined
      : window.__FIRST_LOAD__?.features,
    disablePoweredByFromWorker: typeof window === 'undefined'
      ? undefined
      : window.__CONFIG__?.disable_powered_by
  })
