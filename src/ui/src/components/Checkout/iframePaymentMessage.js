const TRUSTED_PAYMENT_PLUGIN_HOST = 'plugins.orderingplus.com'

export const isTrustedPaymentPluginOrigin = (origin) => {
  if (typeof origin !== 'string' || !origin) return false
  try {
    const url = new URL(origin)
    const { hostname } = url
    return url.protocol === 'https:' && (
      hostname === TRUSTED_PAYMENT_PLUGIN_HOST ||
      hostname.endsWith(`.${TRUSTED_PAYMENT_PLUGIN_HOST}`)
    )
  } catch {
    return false
  }
}

export const parsePaymentPluginMessage = (data) => {
  if (data && typeof data === 'object' && !Array.isArray(data)) return data
  if (typeof data !== 'string') return null
  try {
    const parsed = JSON.parse(data || '{}')
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

export const shouldIgnoreIframePayment = (payment) => (
  payment?.data?.action === 'payment_ready' || payment?.action === 'card'
)

export const createConfirmCartLock = () => {
  let locked = false
  return {
    tryAcquire () {
      if (locked) return false
      locked = true
      return true
    }
  }
}
