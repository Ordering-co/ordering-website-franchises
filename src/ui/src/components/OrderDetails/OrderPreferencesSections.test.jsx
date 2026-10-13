import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { OrderPreferencesSection } from './OrderPreferencesSections'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('OrderPreferencesSection', () => {
  it('renders delivery preference and comment', () => {
    const { getByText } = renderWithProviders(
      <OrderPreferencesSection
        order={{
          delivery_type: 1,
          delivery_option: { name: 'Leave at door' },
          comment: 'No onions'
        }}
      />
    )
    expect(getByText('Delivery preference')).toBeInTheDocument()
    expect(getByText('Leave at door')).toBeInTheDocument()
    expect(getByText('Comment')).toBeInTheDocument()
    expect(getByText('No onions')).toBeInTheDocument()
  })

  it('falls back to either way without a named option', () => {
    const { getByText } = renderWithProviders(
      <OrderPreferencesSection order={{ delivery_type: 1 }} />
    )
    expect(getByText('Either way')).toBeInTheDocument()
  })
})
