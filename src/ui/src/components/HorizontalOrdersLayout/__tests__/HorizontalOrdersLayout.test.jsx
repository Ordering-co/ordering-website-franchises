import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseOrder } from '../../../../../test/ordersUiTestUtils'
import { HorizontalOrdersLayout } from '../index'

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
  SingleOrderCard: ({ order }) => (
    <div data-testid='single-order-card'>{order?.business?.name}</div>
  ),
  Pagination: () => <div data-testid='pagination' />
}))

describe('HorizontalOrdersLayout', () => {
  it('renders a single order card', () => {
    const { getByTestId } = renderWithProviders(
      <HorizontalOrdersLayout
        orders={[baseOrder]}
        pagination={{ currentPage: 1, totalPages: 2 }}
      />
    )
    expect(getByTestId('single-order-card')).toBeInTheDocument()
  })
})
