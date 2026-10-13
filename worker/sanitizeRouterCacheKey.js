import { ROUTER_CACHE_KEY_BASE } from './seo.js'

// The first_load edge-cache namespace is shared with the trusted websites-router
// worker. Tenant identity lives in the key's `origin` query param. Require both
// the router namespace and an origin that matches this request.
export const sanitizeRouterCacheKey = (rawKey, requestOrigin) => {
  if (typeof rawKey !== 'string' || rawKey.length > 1024) return null
  try {
    const parsed = new URL(rawKey)
    if (parsed.origin !== ROUTER_CACHE_KEY_BASE) return null
    return parsed.searchParams.get('origin') === requestOrigin ? rawKey : null
  } catch (_) {
    return null
  }
}
