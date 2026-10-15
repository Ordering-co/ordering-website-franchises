import { describe, expect, it, vi } from 'vitest'
import { isLocalProject, mergeRuntimeSettings, localStorageScope, createScopedStorage, installLocalProjectStorage, resolveLocalFranchise, resolveLocalCatalogueOptions, selectedFranchise, selectedBusiness } from './localProject'

import { WebStrategy } from '../@/components/src/webStrategy'

const base = {
  project: 'selected',
  franchiseSlug: 'chosen',
  businessSlug: '',
  api: { url: 'https://api.example.com', version: 'v400', language: 'en' },
  socket: { url: 'https://socket.example.com' },
  use_project_domain: true,
  localProjectPinned: true,
  localProjectConfigured: true
}

const memoryStorage = () => {
  const data = new Map()
  return {
    get length () { return data.size },
    key: index => [...data.keys()][index] ?? null,
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: key => data.delete(String(key))
  }
}

const response = result => ({ ok: true, json: async () => ({ error: false, result }) })
const requestFor = franchises => vi.fn(async url => url.endsWith('/current') ? response({ code: 'selected' }) : response(franchises))

describe('local project isolation', () => {
  it('pins dev and private previews but leaves public domain delivery enabled', () => {
    for (const host of ['localhost', '127.0.0.1', '100.64.1.2', '10.0.0.2', 'laptop.ts.net']) expect(isLocalProject(false, host, base)).toBe(true)
    expect(isLocalProject(true, 'public.example.com', base)).toBe(true)
    expect(isLocalProject(false, 'public.example.com', base)).toBe(false)
  })

  it('does not opt in for a historical project or missing/false/string source marker', () => {
    for (const marker of [undefined, false, 'true']) {
      const historical = { ...base, localProjectConfigured: marker }
      expect(isLocalProject(true, 'localhost', historical)).toBe(false)
      expect(isLocalProject(false, '100.64.1.2', historical)).toBe(false)
    }
    expect(isLocalProject(true, 'localhost')).toBe(false)
  })

  it('preserves the selected tenant, transport and franchise despite stale injection', () => {
    const result = mergeRuntimeSettings(base, {
      project: 'old',
      franchiseSlug: 'old-franchise',
      businessSlug: 'first-business',
      api: { url: 'https://old.example.com' },
      socket: { url: 'https://old-socket.example.com' }
    }, true)
    expect(result.project).toBe('selected')
    expect(result.franchiseSlug).toBe('chosen')
    expect(result.businessSlug).toBe('')
    expect(result.api).toEqual(base.api)
    expect(result.socket).toEqual(base.socket)
    expect(result.use_project_domain).toBe(false)
    expect(selectedFranchise({ ...result, franchiseSlug: 23 }, 'remote-franchise')).toBe(23)
    expect(selectedBusiness(result, 'first-business')).toBe('')
  })

  it('keeps explicit production runtime and theme resolution', () => {
    const result = mergeRuntimeSettings(base, { project: 'production' }, false)
    expect(result.project).toBe('production')
    expect(selectedFranchise(result, 'theme-franchise')).toBe('theme-franchise')
  })

  it('isolates tenant A/B sessions and clear while preserving every legacy key', () => {
    const raw = memoryStorage()
    const legacy = { project: 'legacy', token: 'legacy-token', user: 'legacy-user', options: 'legacy-options', order: 'legacy-order', language: 'es', table_number: '9', unrelated: 'preserve' }
    for (const [key, value] of Object.entries(legacy)) raw.setItem(key, value)
    const a = createScopedStorage(raw, localStorageScope(base))
    const b = createScopedStorage(raw, localStorageScope({ ...base, project: 'tenant-b' }))
    expect(a.getItem('token')).toBeNull()
    a.setItem('token', 'tenant-a-token')
    a.setItem('table_number', 23)
    b.setItem('token', 'tenant-b-token')
    expect(a.getItem('token')).toBe('tenant-a-token')
    expect(b.getItem('token')).toBe('tenant-b-token')
    expect(a.length).toBe(2)
    expect(a.key(1)).toBe('table_number')
    expect(Object.keys(a)).toEqual(['token', 'table_number'])
    expect(createScopedStorage(a, localStorageScope(base)).getItem('token')).toBe('tenant-a-token')
    b.clear()
    expect(b.length).toBe(0)
    expect(a.getItem('token')).toBe('tenant-a-token')
    for (const [key, value] of Object.entries(legacy)) expect(raw.getItem(key)).toBe(value)
  })

  it('routes direct calls and repeated storage installation by the complete scope', () => {
    const raw = memoryStorage()
    const session = memoryStorage()
    raw.setItem('token', 'global-token')
    session.setItem('review-required', 'legacy')
    const browser = { localStorage: raw, sessionStorage: session }
    installLocalProjectStorage(base, browser)
    browser.localStorage.setItem('token', 'a-token')
    browser.sessionStorage.setItem('review-required', 'a-session')
    installLocalProjectStorage({ ...base, franchiseSlug: 'other' }, browser)
    expect(browser.localStorage.getItem('token')).toBeNull()
    expect(browser.sessionStorage.getItem('review-required')).toBeNull()
    browser.localStorage.setItem('token', 'b-token')
    installLocalProjectStorage(base, browser)
    expect(browser.localStorage.getItem('token')).toBe('a-token')
    expect(browser.sessionStorage.getItem('review-required')).toBe('a-session')
    expect(raw.getItem('token')).toBe('global-token')
    expect(session.getItem('review-required')).toBe('legacy')
    for (const change of [{ api: { ...base.api, url: 'https://other.example.com' } }, { api: { ...base.api, version: 'v500' } }, { api: { ...base.api, language: 'es' } }]) expect(localStorageScope({ ...base, ...change })).not.toBe(localStorageScope(base))
  })

  it('routes the unchanged SDK WebStrategy and direct checkout storage to the same namespace', async () => {
    const localDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
    const sessionDescriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage')
    const raw = window.localStorage
    raw.setItem('token', 'legacy-token')
    raw.setItem('table_number', 'legacy-table')
    try {
      installLocalProjectStorage(base, window)
      const strategy = new WebStrategy()
      expect(await strategy.getItem('token')).toBeNull()
      await strategy.setItem('user', { id: 23 }, true)
      expect(window.localStorage.getItem('user')).toBe('{"id":23}')
      window.localStorage.setItem('table_number', 'local-table')
      expect(await strategy.getItem('table_number')).toBe('local-table')
      await strategy.removeItem('table_number')
      expect(raw.getItem('table_number')).toBe('legacy-table')
      expect(raw.getItem('token')).toBe('legacy-token')
    } finally {
      Object.defineProperty(window, 'localStorage', localDescriptor)
      Object.defineProperty(window, 'sessionStorage', sessionDescriptor)
    }
  })

  it('fails closed before replacing either storage when a descriptor is unavailable', () => {
    const raw = memoryStorage()
    const browser = { localStorage: raw }
    Object.defineProperty(browser, 'sessionStorage', { value: memoryStorage(), configurable: false })
    expect(() => installLocalProjectStorage(base, browser)).toThrow('local_storage_cannot_be_scoped')
    expect(browser.localStorage).toBe(raw)
    expect(() => installLocalProjectStorage({ ...base, localProjectPinned: false }, browser)).not.toThrow()
    expect(browser.localStorage).toBe(raw)
  })

  it('resolves the chosen enabled slug to a numeric SDK ID, never the first franchise', async () => {
    const request = requestFor([{ slug: 'chosen', id: 23, enabled: true }])
    expect(await resolveLocalFranchise(base, request)).toEqual({ id: 23, slug: 'chosen' })
    const [url, options] = request.mock.calls[1]
    expect(new URL(url).searchParams.get('params')).toBe('id,slug,enabled')
    expect(options.credentials).toBe('omit')
    expect(JSON.parse(new URL(url).searchParams.get('where')).conditions).toEqual([{ attribute: 'slug', value: 'chosen' }])
  })

  it('accepts a production-compatible numeric source ID and resolves its human slug', async () => {
    const request = requestFor([{ slug: 'chosen', id: 23, enabled: true }])
    expect(await resolveLocalFranchise({ ...base, franchiseSlug: 23 }, request)).toEqual({ id: 23, slug: 'chosen' })
    expect(JSON.parse(new URL(request.mock.calls[1][0]).searchParams.get('where')).conditions).toEqual([{ attribute: 'id', value: 23 }])
    await expect(resolveLocalFranchise({ ...base, franchiseSlug: 23 }, requestFor([{ slug: 'foreign', id: 24, enabled: true }]))).rejects.toThrow('franchise_selection_invalid')
  })

  it.each([
    [], [{ slug: 'other', id: 1, enabled: true }], [{ slug: 'chosen', id: 23, enabled: false }],
    [{ slug: 'chosen', id: '23', enabled: true }], [{ slug: 'chosen', id: 0, enabled: true }],
    [{ slug: 'chosen', id: 23, enabled: true }, { slug: 'chosen', id: 24, enabled: true }]
  ].map(franchises => [franchises]))('rejects unavailable, disabled, ambiguous or nonnumeric selection %j', async franchises => {
    await expect(resolveLocalFranchise(base, requestFor(franchises))).rejects.toThrow('franchise_selection_invalid')
  })

  it('rejects project mismatch before requesting franchises', async () => {
    const request = vi.fn(async () => response({ code: 'foreign' }))
    await expect(resolveLocalFranchise(base, request)).rejects.toThrow('project_mismatch')
    expect(request).toHaveBeenCalledTimes(1)
  })
  it('prepares public pickup catalogue defaults without changing stored personal order options', async () => {
    const raw = memoryStorage()
    const personal = JSON.stringify({ type: 1, address: { address: 'existing personal address', location: { lat: 12, lng: 34 } }, moment: 'keep' })
    raw.setItem('options', personal)
    const request = vi.fn(async () => response({ order_types_allowed: { value: '1|2|9' }, unaddressed_order_types_allowed: { value: '2' }, location_default_latitude: { value: '38' }, location_default_longitude: { value: '-97' } }))
    expect(await resolveLocalCatalogueOptions(base, request)).toEqual({ type: 2, location: { lat: 38, lng: -97 } })
    expect(raw.getItem('options')).toBe(personal)
    expect(request).toHaveBeenCalledWith(expect.stringContaining('/configs?mode=dictionary&params=key,value'), expect.objectContaining({ method: 'GET', credentials: 'omit' }))
  })

  it('does not invent a pickup mode or coordinate when public defaults are unavailable', async () => {
    await expect(resolveLocalCatalogueOptions(base, vi.fn(async () => response({ order_types_allowed: { value: '1' } })))).rejects.toThrow('public_pickup_catalogue_unavailable')
  })
})
