import { describe, expect, it, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { Checkout } from '../index'

const checkoutCart = {
  ...baseCartUIProps.cart,
  uuid: 'cart-1',
  status: 0,
  valid: true,
  valid_address: true,
  valid_maximum: true,
  valid_minimum: true,
  balance: 9.99,
  paymethod_id: 1,
  taxes: [],
  products: [{ id: 100, name: 'Burger', code: 'BRG-1', price: 9.99 }],
  business: baseCartUIProps.business
}

const mockCheckoutProps = { current: {} }
const mockConfigs = { current: {} }
const mockSessionUser = { current: { guest_id: 'guest-1' } }
const mockOrderPlacement = { current: vi.fn() }
const mockPaymentCallbacks = { current: [] }
const mockOrderState = {
  loading: false,
  options: { type: 1 },
  carts: { 'businessId:1': checkoutCart }
}
const mockCustomerState = { user: { id: 1 } }

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
  Checkout: ({ UIComponent, ...props }) => (
    <UIComponent {...props} {...mockCheckoutProps.current} />
  ),
  useOrder: () => [mockOrderState, { confirmCart: vi.fn() }],
  useSession: () => [{ token: 'token', user: mockSessionUser.current, loading: false }, { login: vi.fn() }],
  useApi: () => [{ root: 'http://api', appId: 'app', project: 'demo' }],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useCustomer: () => [mockCustomerState],
  useConfig: () => [{ configs: mockConfigs.current }],
  useUtils: () => [{ parsePrice: (value) => `$${value}`, parseDate: (value) => value, parseNumber: (value) => value }],
  useEvent: () => [{}],
  useBusiness: () => [{}, { setBusiness: vi.fn() }],
  useToast: () => [{}, { showToast: vi.fn() }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  CartContent: () => <div data-testid='cart-content' />,
  UpsellingPage: () => null,
  AddressDetails: () => <div data-testid='address-details' />,
  UserDetails: () => <div data-testid='user-details' />,
  PaymentOptions: (props) => {
    mockPaymentCallbacks.current.push(props.onPlaceOrderClick)
    return <button type='button' data-testid='payment-place' onClick={() => props.onPlaceOrderClick?.()}>Payment</button>
  },
  PaymentOptionWallet: () => null,
  DriverTips: () => null,
  Cart: () => null,
  CartFirstView: ({ handleChangeCartView }) => (
    <button type='button' data-testid='open-checkout-view' onClick={() => handleChangeCartView?.('checkout')}>
      Open checkout
    </button>
  ),
  PlaceSpot: () => null,
  MomentContent: () => null,
  OrderTypeSelector: () => null,
  AddressOrderType: () => null,
  TextArea: () => null,
  BusinessInformation: () => null,
  CouponControl: () => null,
  generalUtilities: () => ({ getIconCard: vi.fn(), addQueryToUrl: (url) => url, walletName: 'Wallet' }),
  capitalize: (value) => value,
  verifyDecimals: (value) => value,
  SpinnerLoader: () => null
}))

describe('Checkout', () => {
  beforeEach(() => {
    mockConfigs.current = {
      guest_checkout_enabled: { value: '1' },
      allowed_order_types_guest_checkout: { value: 'delivery' }
    }
    mockSessionUser.current = { guest_id: 'guest-1' }
    mockOrderPlacement.current = vi.fn()
    mockPaymentCallbacks.current = []
    mockCheckoutProps.current = {
      cart: checkoutCart,
      errors: [],
      placing: false,
      cartState: { loading: false },
      businessDetails: { loading: false, business: {} },
      paymethodSelected: { paymethod_id: 1, gateway: 'cash' },
      handlePaymethodChange: vi.fn(),
      handlerClickPlaceOrder: vi.fn(),
      handleOrderRedirect: vi.fn(),
      handleChangeDeliveryOption: vi.fn(),
      handleChangeComment: vi.fn(),
      instructionsOptions: [],
      deliveryOptionSelected: null,
      handleStoreRedirect: vi.fn(),
      onPlaceOrderClick: (...args) => mockOrderPlacement.current(...args),
      setPlaceSpotNumber: vi.fn(),
      checkoutFieldsState: { fields: [] },
      commentState: {},
      returnUrl: '',
      checkOutView: 'paymethods',
      hideDeliveryFee: false,
      globalPayIFrameUrl: '',
      cybersourceIFrameUrl: '',
      createBusinessUserPaymethod: vi.fn(),
      isCustomerMode: false
    }
  })

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
    expect(await findByTestId('payment-place')).toBeInTheDocument()
  })

  it('blocks a retained payment callback after revocation while preserving registered placement', async () => {
    const { findByTestId, findByRole, getByRole, getByTestId, rerender } = renderWithProviders(
      <Checkout
        cartUuid='cart-1'
        handleOrderRedirect={vi.fn()}
        handleCheckoutRedirect={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleCheckoutListRedirect={vi.fn()}
      />
    )

    await findByTestId('payment-place')
    const retainedCallback = mockPaymentCallbacks.current[0]
    retainedCallback()
    expect(mockOrderPlacement.current).toHaveBeenCalledTimes(1)

    mockConfigs.current = {}
    mockCheckoutProps.current.checkOutView = 'checkout'
    rerender(
      <Checkout
        cartUuid='cart-1'
        handleOrderRedirect={vi.fn()}
        handleCheckoutRedirect={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleCheckoutListRedirect={vi.fn()}
      />
    )
    const blockedPlaceOrderButton = await findByRole('button', { name: 'Complete my order' })
    expect(blockedPlaceOrderButton).toBeDisabled()
    fireEvent.click(getByRole('button', { name: 'Login' }))
    expect(getByTestId('modal')).toBeInTheDocument()
    retainedCallback()
    expect(mockOrderPlacement.current).toHaveBeenCalledTimes(1)

    mockSessionUser.current = { id: 'registered-1' }
    rerender(
      <Checkout
        cartUuid='cart-1'
        handleOrderRedirect={vi.fn()}
        handleCheckoutRedirect={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleCheckoutListRedirect={vi.fn()}
      />
    )
    retainedCallback()
    expect(mockOrderPlacement.current).toHaveBeenCalledTimes(2)
  })
})
