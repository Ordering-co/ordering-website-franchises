import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { Checkout } from '../index'

const checkoutCart = {
  ...baseCartUIProps.cart,
  uuid: 'cart-1',
  status: 0,
  valid: true,
  products: [{ id: 100, name: 'Burger', code: 'BRG-1', price: 9.99 }],
  business: baseCartUIProps.business
}

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~/utils/parseDriverTipOptions', () => ({
  parseDriverTipOptions: () => []
}))
vi.mock('~components', () => ({
  Checkout: () => <div data-testid='checkout-controller'>checkout</div>,
  useOrder: () => [{
    loading: false,
    options: { type: 1 },
    carts: { 'businessId:1': checkoutCart }
  }, { confirmCart: vi.fn() }],
  useSession: () => [{ token: 'token', user: { id: 1 }, loading: false }, { login: vi.fn() }],
  useApi: () => [{ root: 'http://api', appId: 'app', project: 'demo' }],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useCustomer: () => [{ user: { id: 1 } }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  CartContent: () => <div data-testid='cart-content' />,
  UpsellingPage: () => null
}))

describe('Checkout', () => {
  it('loads checkout controller when cart is available', async () => {
    window.localStorage.removeItem('user-customer')
    const { findByTestId } = renderWithProviders(
      <Checkout
        cartUuid='cart-1'
        handleOrderRedirect={vi.fn()}
        handleCheckoutRedirect={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleCheckoutListRedirect={vi.fn()}
      />
    )
    expect(await findByTestId('checkout-controller')).toBeInTheDocument()
  })
})
