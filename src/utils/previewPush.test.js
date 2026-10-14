import { describe, expect, it, vi } from 'vitest'
import { webPushAllowed, getProductionOneSignal } from './previewPush'

vi.mock('../config', () => ({ default: { localProjectPinned: true } }))
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(), getApps: vi.fn(), getApp: vi.fn() }))
vi.mock('firebase/messaging', () => ({ getMessaging: vi.fn(), getToken: vi.fn(), onMessage: vi.fn() }))

describe('preview push policy', () => {
  it('does not load or queue OneSignal in a pinned preview', () => {
    const browser = { OneSignal: { push: vi.fn() } }
    const document = { querySelector: vi.fn(), createElement: vi.fn(), head: { appendChild: vi.fn() } }
    expect(webPushAllowed({ localProjectPinned: true })).toBe(false)
    expect(getProductionOneSignal({ localProjectPinned: true }, browser, document)).toBeNull()
    expect(browser.OneSignal.push).not.toHaveBeenCalled()
    expect(document.createElement).not.toHaveBeenCalled()
    expect(document.head.appendChild).not.toHaveBeenCalled()
  })

  it('preserves the production OneSignal queue and loads its SDK once', () => {
    const queue = []
    const browser = { OneSignal: queue }
    const script = { dataset: {} }
    const document = { querySelector: vi.fn(() => null), createElement: vi.fn(() => script), head: { appendChild: vi.fn() } }
    expect(getProductionOneSignal({ localProjectPinned: false }, browser, document)).toBe(queue)
    expect(script.src).toBe('https://cdn.onesignal.com/sdks/OneSignalSDK.js')
    expect(script.async).toBe(true)
    document.querySelector.mockReturnValue(script)
    expect(getProductionOneSignal({}, browser, document)).toBe(queue)
    expect(document.head.appendChild).toHaveBeenCalledTimes(1)
  })

  it('exits Firebase before permission, worker registration, token or subscription calls', async () => {
    const { firebasePushSetup } = await import('./firebaseWebPush')
    const permission = vi.fn()
    const register = vi.fn()
    const descriptor = Object.getOwnPropertyDescriptor(window, 'Notification')
    const workerDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { register } })
    Object.defineProperty(window, 'Notification', { configurable: true, value: { requestPermission: permission } })
    const onToken = vi.fn()
    try {
      expect(await firebasePushSetup({ config: {}, onToken })).toBeNull()
      expect(permission).not.toHaveBeenCalled()
      expect(register).not.toHaveBeenCalled()
      expect(onToken).not.toHaveBeenCalled()
    } finally {
      if (workerDescriptor) Object.defineProperty(navigator, 'serviceWorker', workerDescriptor)
      else delete navigator.serviceWorker
      if (descriptor) Object.defineProperty(window, 'Notification', descriptor)
      else delete window.Notification
    }
  })
})
