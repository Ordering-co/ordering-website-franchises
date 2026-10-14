// A local storefront must use the selected project, even on a private hostname.
export const isLocalProject = (development, hostname = '') => development ||
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' ||
  hostname.endsWith('.ts.net') || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname) ||
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(hostname)

export const mergeRuntimeSettings = (base, runtime, pinned) => ({
  ...base,
  ...runtime,
  api: { ...base.api, ...runtime.api, ...(pinned ? base.api : {}) },
  socket: { ...base.socket, ...runtime.socket, ...(pinned ? base.socket : {}) },
  ...(pinned
    ? {
        project: base.project,
        franchiseSlug: base.franchiseSlug,
        businessSlug: base.businessSlug,
        use_marketplace: base.use_marketplace,
        use_project_domain: false,
        use_project_subdomain: false
      }
    : {}),
  localProjectPinned: pinned
})

// Every SDK strategy and direct browser call uses the same local namespace.
// Legacy/global data and other tenant namespaces remain untouched.
const rawStorage = Symbol.for('ordering.franchise.raw-storage')
export const localStorageScope = settings => 'ordering-franchise:' + encodeURIComponent(JSON.stringify([
  settings.api.url, settings.api.version, settings.api.language, settings.project, settings.franchiseSlug
])) + ':'

export const createScopedStorage = (storage, scope) => {
  const native = storage[rawStorage] || storage
  const keys = () => Array.from({ length: native.length }, (_, i) => native.key(i)).filter(key => key?.startsWith(scope))
  const methods = {
    getItem: key => native.getItem(scope + String(key)),
    setItem: (key, value) => native.setItem(scope + String(key), String(value)),
    removeItem: key => native.removeItem(scope + String(key)),
    clear: () => { for (const key of keys()) native.removeItem(key) },
    key: index => keys()[Number(index)]?.slice(scope.length) ?? null
  }
  return new Proxy(methods, {
    get: (target, key) => key === rawStorage ? native : key === 'length' ? keys().length : key in target ? target[key] : typeof key === 'string' ? methods.getItem(key) ?? undefined : undefined,
    set: (_, key, value) => { methods.setItem(key, value); return true },
    deleteProperty: (_, key) => { methods.removeItem(key); return true },
    ownKeys: () => keys().map(key => key.slice(scope.length)),
    getOwnPropertyDescriptor: (_, key) => methods.getItem(key) === null ? undefined : { configurable: true, enumerable: true, writable: true, value: methods.getItem(key) }
  })
}

export const installLocalProjectStorage = (settings, browser) => {
  if (!settings.localProjectPinned) return
  const scope = localStorageScope(settings)
  const names = ['localStorage', 'sessionStorage']
  for (const name of names) {
    const descriptor = Object.getOwnPropertyDescriptor(browser, name)
    if (!descriptor?.configurable) throw new Error('local_storage_cannot_be_scoped')
  }
  // Read/test access before replacing either getter; never fall back to global.
  const storages = names.map(name => {
    const storage = browser[name]
    const native = storage[rawStorage] || storage
    void native.length
    return createScopedStorage(native, scope)
  })
  names.forEach((name, index) => Object.defineProperty(browser, name, {
    configurable: true, get: () => storages[index]
  }))
}

export const resolveLocalFranchise = async (selected, request = fetch, signal) => {
  const { project, api, franchiseSlug } = selected
  const numericSelection = Number.isSafeInteger(franchiseSlug) && franchiseSlug > 0
  if (!/^[a-zA-Z0-9_-]+$/.test(project || '') || project === 'your-project' || (!numericSelection && (typeof franchiseSlug !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(franchiseSlug)))) throw new Error('project_and_franchise_required')
  const root = `${api.url.replace(/\/$/, '')}/${api.version}/${api.language}/${encodeURIComponent(project)}`
  const options = { method: 'GET', credentials: 'omit', redirect: 'error', signal, headers: { Accept: 'application/json' } }
  const currentResponse = await request(`${root}/current`, options)
  if (!currentResponse.ok) throw new Error('project_unavailable')
  const current = await currentResponse.json()
  if (current.error !== false || current.result?.code !== project) throw new Error('project_mismatch')
  const query = new URLSearchParams({
    where: JSON.stringify({ conditions: [{ attribute: numericSelection ? 'id' : 'slug', value: franchiseSlug }], conector: 'AND' }),
    params: 'id,slug,enabled',
    page: '1',
    page_size: '2'
  })
  const response = await request(`${root}/franchises?${query}`, options)
  if (!response.ok) throw new Error('franchise_unavailable')
  const data = await response.json()
  if (data.error !== false || !Array.isArray(data.result)) throw new Error('franchise_unavailable')
  const matches = data.result.filter(item => numericSelection ? item.id === franchiseSlug : item.slug === franchiseSlug)
  if ((data.pagination?.total !== undefined && Number(data.pagination.total) !== 1) || data.result.length !== 1 || matches.length !== 1 || ![true, 1, '1'].includes(matches[0].enabled) || !Number.isSafeInteger(matches[0].id) || matches[0].id <= 0 || typeof matches[0].slug !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(matches[0].slug)) throw new Error('franchise_selection_invalid')
  return { id: matches[0].id, slug: matches[0].slug }
}

export const selectedFranchise = (settings, themeSlug) => settings.localProjectPinned
  ? settings.franchiseSlug
  : (themeSlug || settings.franchiseSlug)

export const selectedBusiness = (settings, themeSlug) => settings.localProjectPinned
  ? settings.businessSlug
  : (themeSlug || settings.businessSlug)

// Read-only catalogue defaults are independent of stored order options: the SDK
// can replay options to the backend after login, so never seed its options key.
export const resolveLocalCatalogueOptions = async (selected, request = fetch, signal) => {
  const { api, project } = selected
  const response = await request(`${api.url.replace(/\/$/, '')}/${api.version}/${api.language}/${encodeURIComponent(project)}/configs?mode=dictionary&params=key,value`, {
    method: 'GET', credentials: 'omit', redirect: 'error', signal, headers: { Accept: 'application/json' }
  })
  if (!response.ok) throw new Error('catalogue_configuration_unavailable')
  const data = await response.json()
  if (data.error !== false || !data.result || Array.isArray(data.result)) throw new Error('catalogue_configuration_unavailable')
  const allowed = String(data.result.order_types_allowed?.value || '').split('|').map(Number)
  const unaddressed = String(data.result.unaddressed_order_types_allowed?.value || '').split('|').map(Number)
  const lat = Number(data.result.location_default_latitude?.value)
  const lng = Number(data.result.location_default_longitude?.value)
  if (!allowed.includes(2) || !unaddressed.includes(2) || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || !String(data.result.location_default_latitude?.value ?? '').trim() || !String(data.result.location_default_longitude?.value ?? '').trim()) throw new Error('public_pickup_catalogue_unavailable')
  return { type: 2, location: { lat, lng } }
}
