import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderProgress } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('../../OrderDetails/OrderEta', () => ({
  OrderEta: () => <span>eta</span>
}))
vi.mock('~components', () => {
  const { baseOrdersUiHooks, baseOrderList } = require('../../../../../test/ordersUiTestUtils')
  return {
    ...baseOrdersUiHooks,
    OrderList: ({ UIComponent, ...rest }) => (
      <UIComponent
        {...rest}
        orderList={baseOrderList}
      />
    )
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getStatusPrefix: () => ({ value: 'Completed' })
  })
}))

describe('OrderProgress', () => {
  it('renders last order progress', () => {
    const { getByText } = renderWithProviders(<OrderProgress />)
    expect(getByText('Your last order')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('View all orders')).toBeInTheDocument()
  })
})
