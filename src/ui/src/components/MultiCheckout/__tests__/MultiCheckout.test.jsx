import { describe, expect, it, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { MultiCheckout } from '../index'

const mockMultiProps = { current: {} }
const mockConfigs = { current: {} }
const mockSessionUser = { current: { guest_id: 'guest-1' } }
const mockPlaceOrder = { current: vi.fn() }

const checkoutCart = {
  ...baseCartUIProps.cart,
  uuid: 'cart-1',
  status: 0,
  business: baseCartUIProps.business,
  valid_schedule: true,
  valid_products: true,
  valid_address: true,
  valid_maximum: true,
  valid_minimum: true
}
const mockOrderState = { options: { type: 1 }, carts: { 'cart-1': checkoutCart } }
const mockCustomerState = { user: { id: 1 }, loading: false }
const mockValidationFields = { fields: {} }

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
  MultiCheckout: ({ UIComponent, ...props }) => (
    <UIComponent {...props} {...mockMultiProps.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDate: (v) => v }],
  useCustomer: () => [mockCustomerState],
  useConfig: () => [{ configs: mockConfigs.current }],
  useSession: () => [{ token: 'token', user: mockSessionUser.current, loading: false }, { login: vi.fn() }],
  useValidationFields: () => [mockValidationFields],
  useOrder: () => [mockOrderState, {}],
  useToast: () => [null, { showToast: vi.fn() }],
  ToastType: { Error: 'error', Success: 'success' }
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  AddressDetails: () => null,
  Cart: () => null,
  MultiCartsPaymethodsAndWallets: () => null,
  CouponControl: () => null,
  DriverTips: () => null,
  UserDetails: () => null
}))

describe('MultiCheckout', () => {
  beforeEach(() => {
    mockConfigs.current = {
      guest_checkout_enabled: { value: '1' },
      allowed_order_types_guest_checkout: { value: 'delivery' }
    }
    mockSessionUser.current = { guest_id: 'guest-1' }
    mockPlaceOrder.current = vi.fn()
    mockMultiProps.current = {
      placing: false,
      isCustomerMode: false,
      openCarts: [checkoutCart],
      loyaltyPlansState: { result: [] },
      handleGroupPlaceOrder: (...args) => mockPlaceOrder.current(...args),
      paymethodSelected: { paymethod_id: 1, gateway: 'cash' },
      handleSelectPaymethod: vi.fn(),
      handleSelectWallet: vi.fn(),
      handlePaymethodDataChange: vi.fn(),
      onRedirectPage: vi.fn(),
      cartGroup: { loading: false, result: { balance: 9.99 } },
      cartUuid: 'cart-1',
      totalCartsFee: 0,
      walletState: {},
      handleSearchRedirect: vi.fn(),
      checkoutFieldsState: { fields: [] }
    }
  })

  it('renders checkout title and place order action', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={baseCartUIProps.cart.uuid} />
    )
    expect(getByText('Your order')).toBeInTheDocument()
    expect(getByText('Place Order')).toBeInTheDocument()
  })

  it('allows a guest, blocks revoked permission, and preserves registered placement', () => {
    const { getByRole, getByTestId, rerender } = renderWithProviders(
      <MultiCheckout cartUuid='cart-1' />
    )

    fireEvent.click(getByRole('button', { name: 'Continue as guest' }))
    fireEvent.click(getByRole('button', { name: 'Place Order' }))
    expect(mockPlaceOrder.current).toHaveBeenCalledTimes(1)

    mockConfigs.current = {}
    rerender(<MultiCheckout cartUuid='cart-1' />)
    expect(getByRole('button', { name: 'Place Order' })).toBeDisabled()
    fireEvent.click(getByRole('button', { name: 'Login' }))
    expect(getByTestId('login-form')).toBeInTheDocument()

    mockSessionUser.current = { id: 'registered-1' }
    rerender(<MultiCheckout cartUuid='cart-1' />)
    fireEvent.click(getByRole('button', { name: 'Place Order' }))
    expect(mockPlaceOrder.current).toHaveBeenCalledTimes(2)
  })
})
