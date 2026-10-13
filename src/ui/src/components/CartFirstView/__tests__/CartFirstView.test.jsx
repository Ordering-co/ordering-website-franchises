import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { CartFirstView } from '../index'

const uiPropsRef = { current: null }

const cart = {
  ...baseCartUIProps.cart,
  valid_products: true,
  subtotal: 9.99,
  taxes: [],
  offers: [],
  fees: [],
  products: [{ id: 100, name: 'Burger', quantity: 1, price: 9.99, code: 'BRG-1' }],
  business: { ...baseCartUIProps.business, tax_type: 0 }
}

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  Cart: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={cart}
      changeQuantity={vi.fn()}
      getProductMax={vi.fn()}
      offsetDisabled={false}
      removeProduct={vi.fn()}
      onClickCheckout={vi.fn()}
      isCheckout={false}
      isCartPending={false}
      isStore
      handleChangeComment={vi.fn()}
      handleRemoveOfferClick={vi.fn()}
      handleChangeCartView={vi.fn()}
      commentState={{}}
      loyaltyRewardRate={0}
      hideDetails={false}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useOrder: () => [{ options: { type: 1 }, carts: { 'businessId:1': cart } }, {}],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseNumber: (v) => v }],
  useConfig: () => [{ configs: {} }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }],
  useCustomer: () => [{ user: null }],
  useApi: () => [{ project: 'demo' }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  ProductItemAccordion: ({ product }) => <div>{product?.name}</div>,
  ProductForm: () => null,
  UpsellingPage: () => null,
  CartStoresListing: () => null,
  ServiceForm: () => null,
  TaxInformation: () => null,
  TextArea: (props) => <textarea placeholder={props.placeholder} onChange={props.onChange} />,
  CouponControl: () => <div>Coupon</div>,
  capitalize: (value) => value,
  verifyDecimals: (v) => v
}))

describe('CartFirstView', () => {
  it('renders my order heading and product name', () => {
    uiPropsRef.current = { ...baseCartUIProps, cart }
    const { getByText } = renderWithProviders(<CartFirstView cart={cart} isStore />)
    expect(getByText('My order')).toBeInTheDocument()
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('shows invalid products warning in first view', () => {
    const invalidCart = { ...cart, valid_products: false }
    uiPropsRef.current = { cart: invalidCart }
    const { getByText } = renderWithProviders(<CartFirstView cart={invalidCart} isStore />)
    expect(getByText(/please remove from your cart the products that are not available/i)).toBeInTheDocument()
  })

  it('renders subtotal row when products are valid', () => {
    uiPropsRef.current = { cart, hideDetails: false }
    const { getByText } = renderWithProviders(<CartFirstView cart={cart} isStore />)
    expect(getByText('Subtotal')).toBeInTheDocument()
  })

  it('renders checkout add products button', () => {
    uiPropsRef.current = { cart, isCheckout: true }
    const { getByText } = renderWithProviders(<CartFirstView cart={cart} isStore />)
    expect(getByText('Add items')).toBeInTheDocument()
  })

  it('renders total, comments and checkout action', () => {
    uiPropsRef.current = {
      ...baseCartUIProps,
      cart: { ...cart, total: 12.99, comment: '' },
      handleChangeComment: vi.fn(),
      handleChangeCartView: vi.fn()
    }
    const { getByText } = renderWithProviders(
      <CartFirstView cart={{ ...cart, total: 12.99 }} isStore />
    )
    expect(getByText('Total')).toBeInTheDocument()
    expect(getByText('Checkout')).toBeInTheDocument()
  })

  it('renders delivery fee and wallet payment remainder', () => {
    const pricedCart = {
      ...cart,
      delivery_price: 3.5,
      payment_events: [{ id: 1, wallet_id: 9, amount: 2 }],
      wallets: [{ id: 9, type: 'cash' }],
      balance: 10.99
    }
    uiPropsRef.current = { ...baseCartUIProps, cart: pricedCart }
    const { getByText } = renderWithProviders(<CartFirstView cart={pricedCart} isStore />)
    expect(getByText('Delivery Fee')).toBeInTheDocument()
    expect(getByText('Total to pay')).toBeInTheDocument()
  })
})
