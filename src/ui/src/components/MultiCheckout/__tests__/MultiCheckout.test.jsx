import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { MultiCheckout } from '../index'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push: vi.fn(), replace: vi.fn() })
  }
})
vi.mock('~/utils/parseDriverTipOptions', () => ({
  parseDriverTipOptions: () => [],
  isCombinedDeliveryFeeEnabled: () => false
}))
vi.mock('~components', () => ({
  MultiCheckout: () => (
    <div data-testid='multi-checkout-controller'>
      <h2 className='checkout-title'>Checkout</h2>
      <button type='button'>Place Order</button>
    </div>
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDate: (v) => v }],
  useCustomer: () => [{ user: { id: 1 } }],
  useConfig: () => [{ configs: {} }],
  useSession: () => [{ token: 'token', user: { id: 1 } }, { login: vi.fn() }],
  useValidationFields: () => [{ fields: {} }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useToast: () => [null, { showToast: vi.fn() }],
  ToastType: { Error: 'error', Success: 'success' }
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('MultiCheckout', () => {
  it('renders checkout title and place order action', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={baseCartUIProps.cart.uuid} />
    )
    expect(getByTestId('multi-checkout-controller')).toBeInTheDocument()
    expect(getByText('Checkout')).toBeInTheDocument()
    expect(getByText('Place Order')).toBeInTheDocument()
  })
})
