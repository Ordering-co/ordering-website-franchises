import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const source = vi.hoisted(() => ({
  project: 'historical-project',
  franchiseSlug: null,
  api: { url: 'https://api.example.com', version: 'v400', language: 'en' },
  socket: { url: 'https://socket.example.com' },
  use_project_domain: false
}))
vi.mock('../config.json', () => ({ default: source }))
const localDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
const sessionDescriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage')

beforeEach(() => {
  vi.resetModules()
  delete source.localProjectConfigured
  Object.defineProperty(window, 'localStorage', localDescriptor)
  Object.defineProperty(window, 'sessionStorage', sessionDescriptor)
  window.localStorage.clear()
  window.sessionStorage.clear()
  delete window.__CONFIG__
  delete window.__FIRST_LOAD__
})
afterEach(() => {
  Object.defineProperty(window, 'localStorage', localDescriptor)
  Object.defineProperty(window, 'sessionStorage', sessionDescriptor)
  delete window.__CONFIG__
  delete window.__FIRST_LOAD__
})

describe('explicit local setup activation at the configuration boundary', () => {
  it.each([undefined, false, 'true'])('preserves normal Worker settings and global session without source opt-in %s', async marker => {
    source.localProjectConfigured = marker
    const storage = window.localStorage
    const session = window.sessionStorage
    storage.setItem('token', 'existing-session')
    window.__FIRST_LOAD__ = { marker: 'existing-worker-load' }
    window.__CONFIG__ = { project: 'worker-project', localProjectConfigured: true, localProjectPinned: true, api: { url: 'https://worker-api.example.com' } }
    const { default: settings } = await import('../config')
    expect(settings.localProjectPinned).toBe(false)
    expect(settings.localProjectConfigured).toBe(false)
    expect(settings.project).toBe('worker-project')
    expect(settings.api.url).toBe('https://worker-api.example.com')
    expect(settings.franchiseSlug).toBeNull()
    expect(window.localStorage).toBe(storage)
    expect(window.sessionStorage).toBe(session)
    expect(storage.getItem('token')).toBe('existing-session')
    expect(window.__FIRST_LOAD__).toEqual({ marker: 'existing-worker-load' })
  })

  it('activates source opt-in and isolates storage despite an injected remote marker override', async () => {
    source.localProjectConfigured = true
    const storage = window.localStorage
    storage.setItem('token', 'legacy-session')
    window.__CONFIG__ = { project: 'foreign-worker', localProjectConfigured: false, localProjectPinned: false }
    const { default: settings } = await import('../config')
    expect(settings.localProjectPinned).toBe(true)
    expect(settings.localProjectConfigured).toBe(true)
    expect(settings.project).toBe('historical-project')
    expect(window.localStorage).not.toBe(storage)
    expect(window.localStorage.getItem('token')).toBeNull()
    expect(storage.getItem('token')).toBe('legacy-session')
  })
})
