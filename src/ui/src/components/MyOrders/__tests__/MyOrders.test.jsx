import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { MyOrders } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('../../GiftCard/GiftCardOrdersList', () => ({
  GiftCardOrdersList: () => <div>Gift cards</div>
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  useConfig: () => [{
    configs: {
      cash_wallet: { value: '1' },
      wallet_enabled: { value: '1' },
      wallet_cash_enabled: { value: '1' }
    }
  }],
  useEvent: () => [{ emit: vi.fn() }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    handleGoToPage: () => {}
  }),
  OrdersOption: () => <div data-testid='orders-option' />,
  GiftCardOrdersList: () => <div>Gift cards</div>
}))

describe('MyOrders', () => {
  it('renders the orders tab', () => {
    const { getByText } = renderWithProviders(<MyOrders />)
    expect(getByText('Orders')).toBeInTheDocument()
  })

  it('switches to business and gift card tabs', () => {
    const { getByText } = renderWithProviders(<MyOrders />)
    fireEvent.click(getByText('Business'))
    expect(getByText('Business')).toBeInTheDocument()
    fireEvent.click(getByText('Gift card'))
    expect(getByText('Gift cards')).toBeInTheDocument()
  })
})
