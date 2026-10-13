import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseOrder } from '../../../../../test/ordersUiTestUtils'
import { VerticalOrdersLayout } from '../index'

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
  SingleOrderCard: ({ setOrderSelected, order }) => (
    <button type='button' onClick={() => setOrderSelected(order)}>
      select order
    </button>
  ),
  ReviewOrder: () => <div>Review order form</div>,
  ReviewProduct: () => null,
  ReviewDriver: () => null
}))

describe('VerticalOrdersLayout', () => {
  it('renders the load more orders action', () => {
    const { getByText } = renderWithProviders(
      <VerticalOrdersLayout
        orders={[baseOrder]}
        pagination={{ currentPage: 1, totalPages: 2 }}
        loadMoreOrders={() => {}}
      />
    )
    expect(getByText('Load more orders')).toBeInTheDocument()
  })

  it('opens the review modal when an order is selected', () => {
    const { getByText } = renderWithProviders(
      <VerticalOrdersLayout
        orders={[baseOrder]}
        pagination={{ currentPage: 1, totalPages: 1 }}
        setRefreshOrders={() => {}}
      />
    )
    fireEvent.click(getByText('select order'))
    expect(getByText('Reviews')).toBeInTheDocument()
    expect(getByText('Review order form')).toBeInTheDocument()
  })
})
