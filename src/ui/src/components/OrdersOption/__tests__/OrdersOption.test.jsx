import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrdersOption } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => {
  const { baseOrdersUiHooks, baseOrderList, basePagination } = require('../../../../../test/ordersUiTestUtils')
  return {
    ...baseOrdersUiHooks,
    OrderList: ({ UIComponent, ...rest }) => (
      <UIComponent
        {...rest}
        orderList={{
          ...baseOrderList,
          orders: rest.activeOrders
            ? [{ ...baseOrderList.orders[0], status: 0 }]
            : baseOrderList.orders
        }}
        pagination={basePagination}
        reorderState={{ loading: false }}
        businesses={rest.businesses || { loading: false, result: [{ id: 1, name: 'Demo Store', slug: 'demo', open: true }] }}
      />
    )
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getOrderStatus: () => ({ value: 'Completed', percentage: 100 })
  }),
  HorizontalOrdersLayout: ({ orders }) => (
    <div>{orders?.[0]?.business?.name}</div>
  ),
  VerticalOrdersLayout: ({ orders }) => (
    <div>{orders?.[0]?.business?.name}</div>
  ),
  BusinessController: ({ business }) => <div>{business?.name}</div>,
  SingleProductCard: () => null
}))

describe('OrdersOption', () => {
  it('renders past orders heading and store name', () => {
    const { getByText } = renderWithProviders(<OrdersOption pastOrders />)
    expect(getByText('Past orders')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
  })

  it('renders active orders heading', () => {
    const { getByText } = renderWithProviders(<OrdersOption activeOrders />)
    expect(getByText('Active')).toBeInTheDocument()
  })

  it('renders previously ordered businesses', () => {
    const { getByText } = renderWithProviders(
      <OrdersOption
        isBusiness
        hideOrders
        businessOrderIds={[1]}
        businesses={{ loading: false, result: [{ id: 1, name: 'Demo Store', slug: 'demo', open: true }] }}
      />
    )
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
