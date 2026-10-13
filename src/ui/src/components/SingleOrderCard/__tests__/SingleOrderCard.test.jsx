import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SingleOrderCard } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('react-bootstrap-icons', () => ({
  Heart: () => <span />,
  HeartFill: () => <span />
}))
vi.mock('../OrderDetails/OrderEta', () => ({
  OrderEta: () => <span>eta</span>
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  SingleOrderCard: ({ UIComponent, ...rest }) => {
    const order = {
      ...require('../../../../../test/ordersUiTestUtils').baseOrder,
      cart: { uuid: 'cart-1' }
    }
    return (
      <UIComponent
        {...rest}
        order={order}
        isSkeleton={false}
        pastOrders
        handleReorder={() => {}}
        onRedirectPage={() => {}}
      />
    )
  }
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getOrderStatus: () => ({ value: 'Completed', percentage: 100 })
  }),
  ReviewOrder: () => null,
  ReviewProduct: () => null,
  ReviewDriver: () => null
}))

describe('SingleOrderCard', () => {
  it('renders business name and reorder', () => {
    const { getByText } = renderWithProviders(<SingleOrderCard />)
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('Reorder')).toBeInTheDocument()
    expect(getByText('1 Product')).toBeInTheDocument()
    fireEvent.click(getByText('Review'))
    expect(getByText('Reviews')).toBeInTheDocument()
  })
})
