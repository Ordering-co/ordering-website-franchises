import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LastOrders } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => {
  const { baseOrdersUiHooks, baseOrderList } = require('../../../../../test/ordersUiTestUtils')
  return {
    ...baseOrdersUiHooks,
    OrderList: ({ UIComponent, ...rest }) => (
      <UIComponent {...rest} orderList={baseOrderList} />
    )
  }
})
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('LastOrders', () => {
  it('renders the last order heading and store name', () => {
    const { getByText } = renderWithProviders(<LastOrders />)
    expect(getByText('Last order')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
