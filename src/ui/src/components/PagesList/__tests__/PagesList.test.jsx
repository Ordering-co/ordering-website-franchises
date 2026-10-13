import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PagesList } from '../index'

const getPages = vi.fn()

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useApi: () => [{
    pages: () => ({
      get: () => getPages()
    })
  }]
}))

describe('PagesList', () => {
  beforeEach(() => {
    getPages.mockReset()
  })

  it('renders static routes and fetched pages', async () => {
    getPages.mockResolvedValue({
      response: { data: { result: [{ id: 2, name: 'About', slug: 'about' }] } }
    })
    const { getByText, getByRole } = renderWithProviders(
      <PagesList routes={[{ name: 'Home', slug: '/' }]} />
    )
    expect(getByText('Site Map')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    await waitFor(() => {
      expect(getByRole('link', { name: 'About' })).toHaveAttribute('href', 'pages/about')
    })
  })

  it('keeps the initial routes when the pages request fails', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    getPages.mockRejectedValue(new Error('network'))
    const { getByText, getByRole } = renderWithProviders(
      <PagesList routes={[{ name: 'Help', slug: '/help' }]} />
    )
    expect(getByText('Site Map')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/help')
    await waitFor(() => {
      expect(log).toHaveBeenCalled()
    })
    log.mockRestore()
  })
})
