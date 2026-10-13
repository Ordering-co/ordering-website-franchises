import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { OrderSuccessModal } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  ...require('../../../../../test/ordersUiTestUtils').baseOrdersUiHooks,
  useOrder: () => [{ options: { type: 1 } }, {}]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  getHourMin: (hour, min) => `${hour}:${min}`,
  generalUtilities: () => ({
    getIconCard: () => ''
  })
}))

describe('OrderSuccessModal', () => {
  it('shows the creating order message at checkout', () => {
    const { getByText } = renderWithProviders(
      <OrderSuccessModal
        isCheckOut
        cart={{
          products: [{ id: 1, name: 'Burger' }],
          business: { delivery_time: '00:30' }
        }}
        businessData={{ name: 'Demo Store', address: '123 Main', logo: 'logo.png' }}
      />
    )
    expect(getByText('We are creating your order!')).toBeInTheDocument()
  })
})
