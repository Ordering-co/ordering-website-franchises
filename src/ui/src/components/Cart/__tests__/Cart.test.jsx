import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { Cart } from '../index'

const uiPropsRef = { current: null }
const cartRef = { current: null }

const buildCart = (overrides = {}) => ({
  ...baseCartUIProps.cart,
  valid: true,
  valid_products: true,
  valid_schedule: true,
  valid_maximum: true,
  valid_minimum: true,
  valid_address: true,
  subtotal: 9.99,
  total: 12.99,
  taxes: [],
  offers: [],
  fees: [],
  products: [{ id: 100, name: 'Burger', quantity: 1, price: 9.99, code: 'BRG-1' }],
  business: { ...baseCartUIProps.business, tax_type: 0, slug: 'demo' },
  ...overrides
})

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~/utils/parseDriverTipOptions', () => ({
  parseDriverTipOptions: (value) => (value ? [{ value: 0 }, { value: 10 }] : [])
}))
vi.mock('~components', () => ({
  Cart: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={cartRef.current}
      currentCartUuid='cart-1'
      isProducts
      clearCart={vi.fn()}
      changeQuantity={vi.fn()}
      getProductMax={vi.fn()}
      offsetDisabled={false}
      removeProduct={vi.fn()}
      onClickCheckout={vi.fn()}
      isCheckout={false}
      isCartPending={false}
      isStore
      loyaltyRewardRate={0}
      hideDetails={false}
      handleChangeComment={vi.fn()}
      commentState={{}}
      handleRemoveOfferClick={vi.fn()}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseNumber: (v) => v, parseDate: (v) => v }],
  useValidationFields: () => [{ fields: { checkout: { coupon: { enabled: false }, comments: { enabled: false } } } }],
  useConfig: () => [{ configs: {} }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }],
  useCustomer: () => [{ user: null }],
  useApi: () => [{ project: 'demo' }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  ProductItemAccordion: ({ product }) => <div>{product?.name}</div>,
  BusinessItemAccordion: ({ children }) => <div data-testid='business-accordion'>{children}</div>,
  CouponControl: () => <div data-testid='coupon-control'>Coupon</div>,
  ProductForm: () => null,
  UpsellingPage: () => null,
  CartStoresListing: () => null,
  DriverTips: () => <div data-testid='driver-tips'>Tips</div>,
  MomentContent: () => null,
  ServiceForm: () => null,
  TaxInformation: () => <div data-testid='tax-info'>Tax</div>,
  TextArea: () => <textarea data-testid='comment-area' />,
  getCateringValues: () => ({}),
  verifyDecimals: (v) => v,
  capitalize: (v) => v
}))

describe('Cart', () => {
  beforeEach(() => {
    cartRef.current = buildCart()
    uiPropsRef.current = null
  })

  it('renders cart subtotal and product list', () => {
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    expect(getByText('Subtotal')).toBeInTheDocument()
    expect(getByText('Total')).toBeInTheDocument()
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('places progress after products and before the bill', () => {
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore freeDeliveryProgress={{ status: 'progress', minimum: 30, currentAmount: 10, remainingAmount: 20, progressPercent: 33 }} />)
    const message = getByText('Add $20 for free delivery')
    expect(getByText('Burger').compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(message.compareDocumentPosition(getByText('Subtotal')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps explicit progress visible in the header cart with bill details hidden', () => {
    const { getByText, queryByText } = renderWithProviders(<Cart cart={cartRef.current} hideDetails freeDeliveryProgress={{ status: 'unlocked' }} />)
    expect(getByText('Free delivery unlocked')).toBeInTheDocument()
    expect(queryByText('Subtotal')).not.toBeInTheDocument()
  })

  it('shows loading spinner when productLoading is true', () => {
    uiPropsRef.current = { productLoading: true }
    const { getAllByTestId } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    expect(getAllByTestId('spinner').length).toBeGreaterThan(0)
  })

  it('shows invalid products warning', () => {
    cartRef.current = buildCart({ valid_products: false })
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    expect(getByText(/please remove from your cart the products that are not available/i)).toBeInTheDocument()
  })

  it('renders checkout add products button in checkout mode', () => {
    uiPropsRef.current = { isCheckout: true }
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    expect(getByText('Add products')).toBeInTheDocument()
  })

  it('renders checkout button when cart is valid', () => {
    const onClickCheckout = vi.fn()
    uiPropsRef.current = { onClickCheckout }
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    fireEvent.click(getByText('Continue'))
    expect(onClickCheckout).toHaveBeenCalled()
  })

  it('renders delivery fee when the cart has one', () => {
    cartRef.current = buildCart({ delivery_price: 3.5, total: 16.49 })
    const { getByText } = renderWithProviders(<Cart cart={cartRef.current} isStore />)
    expect(getByText('Delivery Fee') || getByText('Total')).toBeTruthy()
  })
})
