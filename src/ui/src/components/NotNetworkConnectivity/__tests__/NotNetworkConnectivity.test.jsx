import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
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
    global.fetch = vi.fn().mockResolvedValue({
      blob: async () => new Blob(['img'], { type: 'image/png' })
    })
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
      Object.defineProperty(this, 'result', { configurable: true, value: 'data:image/png;base64,xx' })
      this.dispatchEvent(new Event('load'))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete global.fetch
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
})
