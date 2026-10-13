import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductItemAccordion } from '../index'

const mockState = vi.hoisted(() => ({
  product: { id: 100, name: 'Cheeseburger', quantity: 1, price: 9.99, options: {}, ingredients: {} },
  productInfo: { ingredients: [], options: [] }
}))

vi.mock('~components', () => ({
  ProductItemAccordion: ({ UIComponent, ...rest }) => (
    <UIComponent
      product={mockState.product}
      productInfo={mockState.productInfo}
      isCartProduct
      onDeleteProduct={vi.fn()}
      changeQuantity={vi.fn()}
      getProductMax={vi.fn(() => 10)}
      onEditProduct={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDate: () => 'Jan 1' }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useConfig: () => [{ configs: {} }]
}))

describe('ProductItemAccordion', () => {
  beforeEach(() => {
    mockState.product = { id: 100, name: 'Cheeseburger', quantity: 1, price: 9.99, options: {}, ingredients: {} }
    mockState.productInfo = { ingredients: [], options: [] }
  })

  it('renders cart product name', () => {
    const { getByText } = renderWithProviders(
      <ProductItemAccordion
        product={mockState.product}
        isCartProduct
        onDeleteProduct={vi.fn()}
        changeQuantity={vi.fn()}
        getProductMax={vi.fn()}
      />
    )
    expect(getByText('Cheeseburger')).toBeInTheDocument()
  })

  it('expands accordion to show removed ingredients', () => {
    mockState.productInfo = {
      ingredients: [{ id: 1, name: 'Lettuce', selected: false }],
      options: []
    }
    const { getByText, container } = renderWithProviders(
      <ProductItemAccordion
        product={mockState.product}
        productInfo={mockState.productInfo}
        isCartProduct
        onDeleteProduct={vi.fn()}
        changeQuantity={vi.fn()}
        getProductMax={vi.fn(() => 10)}
      />
    )
    fireEvent.click(container.querySelector('.product.accordion'))
    expect(getByText(/Lettuce/)).toBeInTheDocument()
  })

  it('calls delete handler from cart actions', () => {
    const onDeleteProduct = vi.fn()
    const { container } = renderWithProviders(
      <ProductItemAccordion
        product={mockState.product}
        isCartProduct
        onDeleteProduct={onDeleteProduct}
        changeQuantity={vi.fn()}
        getProductMax={vi.fn(() => 10)}
      />
    )
    fireEvent.click(container.querySelector('.trash'))
    expect(onDeleteProduct).toHaveBeenCalledWith(mockState.product)
  })
})
