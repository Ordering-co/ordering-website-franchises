import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductOptionSubOption } from '../index'

const mockState = vi.hoisted(() => ({
  state: { selected: false, quantity: 0, position: 'whole' },
  isSoldOut: false
}))

vi.mock('~components', () => ({
  ProductOptionSuboption: ({ UIComponent, ...rest }) => (
    <UIComponent
      option={{ id: 1, min: 0, max: 3, with_half_option: false, allow_suboption_quantity: true }}
      suboption={{ id: 1, name: 'Large', price: 2, max: 1 }}
      state={mockState.state}
      balance={0}
      isSoldOut={mockState.isSoldOut}
      toggleSelect={vi.fn()}
      increment={vi.fn()}
      decrement={vi.fn()}
      changePosition={vi.fn()}
      changeQuantity={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }]
}))
vi.mock('~ui', () => ({
  Alert: () => null
}))

describe('ProductOptionSubOption', () => {
  beforeEach(() => {
    mockState.state = { selected: false, quantity: 0, position: 'whole' }
    mockState.isSoldOut = false
  })

  it('renders suboption name', () => {
    const { getByText } = renderWithProviders(
      <ProductOptionSubOption
        option={{ id: 1, min: 0, max: 3, with_half_option: false }}
        suboption={{ id: 1, name: 'Large', price: 2, max: 1 }}
        onChange={vi.fn()}
      />
    )
    expect(getByText('Large')).toBeInTheDocument()
  })

  it('renders formatted price when suboption is selected', () => {
    mockState.state = { selected: true, quantity: 1, position: 'whole' }
    const { getByText } = renderWithProviders(
      <ProductOptionSubOption
        option={{ id: 1, min: 0, max: 3, with_half_option: false }}
        suboption={{ id: 1, name: 'Large', price: 2, max: 1 }}
        onChange={vi.fn()}
      />
    )
    expect(getByText('+ $2')).toBeInTheDocument()
  })

  it('disables quantity controls when suboption is sold out', () => {
    mockState.state = { selected: true, quantity: 1, position: 'whole' }
    mockState.isSoldOut = true
    const { container } = renderWithProviders(
      <ProductOptionSubOption
        option={{ id: 1, min: 0, max: 3, with_half_option: false, allow_suboption_quantity: true }}
        suboption={{ id: 1, name: 'Large', price: 2, max: 1 }}
        onChange={vi.fn()}
      />
    )
    const disabledButtons = container.querySelectorAll('button[disabled], svg[disabled]')
    expect(disabledButtons.length).toBeGreaterThan(0)
  })
})
