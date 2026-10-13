import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderItAgain } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  AutoScroll: ({ children }) => children,
  SingleProductCard: ({ product }) => <div>{product?.name}</div>
}))

describe('OrderItAgain', () => {
  it('renders the order it again heading', () => {
    const { getByText } = renderWithProviders(
      <OrderItAgain
        businessId={1}
        productList={[{ id: 1, name: 'Burger' }]}
      />
    )
    expect(getByText('Order it again')).toBeInTheDocument()
  })
})
