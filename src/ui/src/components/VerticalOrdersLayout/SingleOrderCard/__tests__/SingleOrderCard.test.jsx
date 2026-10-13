import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { SingleOrderCard } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  SingleOrderCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...rest}
      order={require('../../../../../../test/ordersUiTestUtils').baseOrder}
      handleReorder={() => {}}
      getOrderStatus={() => ({ value: 'Completed' })}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    getOrderStatus: () => ({ value: 'Completed' })
  })
}))

describe('Vertical SingleOrderCard', () => {
  it('renders review and reorder actions', () => {
    const { getByText } = renderWithProviders(<SingleOrderCard />)
    expect(getByText('Review')).toBeInTheDocument()
    expect(getByText('Reorder')).toBeInTheDocument()
  })
})
