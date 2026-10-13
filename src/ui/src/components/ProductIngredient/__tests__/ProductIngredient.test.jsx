import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductIngredient } from '../index'

vi.mock('~components', () => ({
  ProductIngredient: ({ UIComponent, ...rest }) => (
    <UIComponent
      ingredient={{ id: 1, name: 'Lettuce' }}
      state={{ selected: true }}
      toggleSelect={vi.fn()}
      isSoldOut={false}
      {...rest}
    />
  )
}))

describe('ProductIngredient', () => {
  it('renders ingredient name', () => {
    const { getByText } = renderWithProviders(
      <ProductIngredient ingredient={{ id: 1, name: 'Lettuce' }} onChange={vi.fn()} />
    )
    expect(getByText('Lettuce')).toBeInTheDocument()
  })
})
