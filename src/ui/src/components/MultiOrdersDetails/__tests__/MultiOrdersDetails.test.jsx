import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { MultiOrdersDetails } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/fa/FaUserAlt', () => ({ default: () => <span /> }))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  MultiOrdersDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      ordersList={{
        loading: false,
        error: null,
        orders: [require('../../../../../test/ordersUiTestUtils').baseOrder]
      }}
      customer={{ name: 'Jane', lastname: 'Doe', email: 'j@x.com' }}
      paymentEvents={[]}
      ordersSummary={{ total: 12.99 }}
      handleOrderRedirect={() => {}}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getOrderStatus: () => ({ value: 'Pending', percentage: 20 })
  }),
  Image: () => null,
  SingleOrderCard: () => <div data-testid='single-order-card' />,
  NotFoundSource: ({ content }) => <div>{content}</div>
}))

describe('MultiOrdersDetails', () => {
  it('renders customer greeting and summary', () => {
    const { getByText } = renderWithProviders(<MultiOrdersDetails />)
    expect(getByText('Hey')).toBeInTheDocument()
    expect(getByText('Order summary')).toBeInTheDocument()
  })
})
