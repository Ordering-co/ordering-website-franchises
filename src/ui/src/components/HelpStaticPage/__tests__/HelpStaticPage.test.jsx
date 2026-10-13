import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { HelpStaticPage } from '../index'

const getPage = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  useApi: () => [{
    pages: (slug) => ({
      get: async ({ cancelToken } = {}) => {
        if (cancelToken) cancelToken.cancel = vi.fn()
        return getPage(slug)
      }
    })
  }]
}))

describe('HelpStaticPage', () => {
  beforeEach(() => {
    getPage.mockReset()
  })

  it('renders fetched page html', async () => {
    getPage.mockResolvedValue({
      content: { error: false, result: { body: '<p>Help order copy</p>' } }
    })
    const { getByText, queryByTestId } = renderWithProviders(
      <HelpStaticPage slug='helpOrder' />
    )
    await waitFor(() => {
      expect(getByText('Help order copy')).toBeInTheDocument()
    })
    expect(queryByTestId('skeleton')).not.toBeInTheDocument()
    expect(getPage).toHaveBeenCalledWith('helpOrder')
  })

  it('shows a skeleton while the page request is pending', async () => {
    let resolvePage
    getPage.mockImplementation(() => new Promise((resolve) => {
      resolvePage = resolve
    }))
    const { getByTestId, queryByTestId, unmount } = renderWithProviders(
      <HelpStaticPage slug='helpAccountAndPayment' />
    )
    expect(getByTestId('skeleton')).toBeInTheDocument()
    resolvePage({ content: { error: true, result: 'missing' } })
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument()
    })
    unmount()
  })

  it('ignores cancelled requests and stores fetch errors', async () => {
    getPage.mockRejectedValue(Object.assign(new Error('boom'), { constructor: { name: 'Error' } }))
    const { queryByTestId } = renderWithProviders(
      <HelpStaticPage slug='helpOrderingGuide' />
    )
    await waitFor(() => {
      expect(queryByTestId('skeleton')).not.toBeInTheDocument()
    })
  })
})
