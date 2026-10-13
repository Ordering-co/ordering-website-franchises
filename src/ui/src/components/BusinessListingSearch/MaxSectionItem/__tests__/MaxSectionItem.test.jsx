import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { MaxSectionItem } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }],
  useConfig: () => [{ configs: { distance_unit: { value: 'mi' } } }]
}))
vi.mock('~ui', () => ({ capitalize: (v) => v }))

describe('MaxSectionItem', () => {
  it('renders max filter options and handles selection', () => {
    const handleChangeFilters = vi.fn()
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        title='Max delivery fee'
        filter='max_delivery_fee'
        filters={{ max_delivery_fee: 5 }}
        options={[5, 10, 15, 'default']}
        handleChangeFilters={handleChangeFilters}
      />
    )
    fireEvent.click(getByText('Max delivery fee'))
    fireEvent.click(getByText('$10'))
    expect(handleChangeFilters).toHaveBeenCalledWith('max_delivery_fee', 10)
  })
})
