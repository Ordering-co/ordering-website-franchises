import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { OrderHeaderInfoSection } from './OrderHeaderInfoSection'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('OrderHeaderInfoSection', () => {
  it('renders the received order message', () => {
    const { getByText } = renderWithProviders(<OrderHeaderInfoSection />)
    expect(getByText('Your order has been received')).toBeInTheDocument()
  })

  it('renders the services heading', () => {
    const { getByText } = renderWithProviders(<OrderHeaderInfoSection isService />)
    expect(getByText('Services')).toBeInTheDocument()
  })
})
