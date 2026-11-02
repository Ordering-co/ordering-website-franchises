import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { NotNetworkConnectivity } from '../index'

const onlineRef = { current: false }

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  useOnlineStatus: () => onlineRef.current
}))

describe('NotNetworkConnectivity', () => {
  beforeEach(() => {
    onlineRef.current = false
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['img'], { type: 'image/png' })
    }))
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
      Object.defineProperty(this, 'result', { configurable: true, value: 'data:image/png;base64,xx' })
      this.dispatchEvent(new Event('load'))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the offline message, image, and refresh action', async () => {
    const reload = vi.fn()
    const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    })
    const { getByText, getByAltText } = renderWithProviders(
      <NotNetworkConnectivity image='offline.png' />
    )
    expect(getByText('No internet connection')).toBeInTheDocument()
    expect(getByText('Your connection appears to be off-line. Try to refresh the page')).toBeInTheDocument()
    await waitFor(() => {
      expect(getByAltText('Not network')).toHaveAttribute('src', 'data:image/png;base64,xx')
    })
    fireEvent.click(getByText('Refresh'))
    expect(reload).toHaveBeenCalled()
    if (locationDescriptor) {
      Object.defineProperty(window, 'location', locationDescriptor)
    }
  })

  it('can be forced online through the isOnline prop', () => {
    const { getByText } = renderWithProviders(
      <NotNetworkConnectivity isOnline image='offline.png' />
    )
    expect(getByText('No internet connection')).toBeInTheDocument()
  })

  it.each(['network', 'body', 'reader', 'http'])('keeps the offline controls usable after an image %s failure', async (failure) => {
    const error = new TypeError('Load failed')
    if (failure === 'network') fetch.mockRejectedValue(error)
    if (failure === 'body') fetch.mockResolvedValue({ ok: true, blob: () => Promise.reject(error) })
    if (failure === 'http') fetch.mockResolvedValue({ ok: false })
    if (failure === 'reader') {
      FileReader.prototype.readAsDataURL.mockImplementation(function () {
        this.dispatchEvent(new Event('error'))
      })
    }

    let view
    await act(async () => {
      view = renderWithProviders(<NotNetworkConnectivity image='offline.png' />)
    })

    expect(fetch).toHaveBeenCalledWith('offline.png')
    expect(view.queryByAltText('Not network')).not.toBeInTheDocument()
    expect(view.getByText('No internet connection')).toBeVisible()
    expect(view.getByRole('button', { name: 'Refresh' })).toBeEnabled()
  })

  it('handles a pending image failure after unmount', async () => {
    let rejectImage
    fetch.mockReturnValue(new Promise((resolve, reject) => { rejectImage = reject }))
    const { unmount } = renderWithProviders(<NotNetworkConnectivity image='offline.png' />)
    unmount()

    await act(async () => {
      rejectImage(new TypeError('Load failed'))
    })
  })
})
