import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { MessagesListing } from '../index'

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
        orderList={baseOrderList}
        pagination={basePagination}
        handleOrderCardClick={rest.handleOrderCardClick || (() => {})}
        handleOpenOrderDetail={rest.handleOpenOrderDetail || (() => {})}
        setOrderListStatus={rest.setOrderListStatus || (() => {})}
      />
    ),
    OrderDetails: () => <div data-testid='order-details-controller' />
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getOrderStatus: () => ({ value: 'Pending' }),
    getOrderType: () => 'Delivery'
  }),
  Messages: () => <div data-testid='messages' />,
  NotFoundSource: ({ content }) => <div>{content}</div>
}))

describe('MessagesListing', () => {
  it('renders orders with messages and a store card', () => {
    const { getByText } = renderWithProviders(<MessagesListing onRedirectPage={() => {}} />)
    expect(getByText('Orders with messages')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('View details')).toBeInTheDocument()
  })
})
