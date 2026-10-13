import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductOption } from '../index'

vi.mock('~components', () => ({
  ProductOption: ({ UIComponent, ...rest }) => (
    <UIComponent option={{ id: 1, name: 'Toppings', min: 1, max: 1 }} {...rest} />
  ),
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  Alert: () => null
}))

describe('ProductOption', () => {
  it('renders option name and required label', () => {
    const { getByText } = renderWithProviders(
      <ProductOption option={{ id: 1, name: 'Toppings', min: 1, max: 1 }}>
        <span>child</span>
      </ProductOption>
    )
    expect(getByText('Toppings')).toBeInTheDocument()
    expect(getByText('Required')).toBeInTheDocument()
  })
})
