import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { PreviousProductsOrdered } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../../test/ordersUiTestUtils').baseOrdersUiHooks
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  AutoScroll: ({ children }) => children,
  SingleProductCard: ({ product }) => <div>{product?.name}</div>,
  ProductForm: () => null
}))

describe('PreviousProductsOrdered', () => {
  it('renders previously ordered products', () => {
    const { getByText } = renderWithProviders(
      <PreviousProductsOrdered
        products={[{ id: 1, name: 'Burger', business: { available: true, id: 1 } }]}
      />
    )
    expect(getByText('Burger')).toBeInTheDocument()
  })
})
