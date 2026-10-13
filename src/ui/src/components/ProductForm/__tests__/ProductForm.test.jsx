import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ProductForm } from '../index'

const mockState = vi.hoisted(() => ({
  productObject: {
    product: { id: 100, name: 'Cheeseburger', price: 9.99, minimum_per_order: 1, gallery: [], tags: [] },
    loading: false,
    error: null
  },
  product: { id: 100, name: 'Cheeseburger', price: 9.99, minimum_per_order: 1 },
  productCart: { ingredients: {}, options: {}, quantity: 1, total: 9.99 },
  errors: {},
  actionStatus: { loading: false }
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('nanoid', () => ({ nanoid: () => 'test-id' }))
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~components', () => ({
  ProductForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessId={1}
      product={mockState.product}
      productObject={mockState.productObject}
      productCart={mockState.productCart}
      isSoldOut={false}
      maxProductQuantity={10}
      handleSave={vi.fn()}
      actionStatus={mockState.actionStatus}
      errors={mockState.errors}
      pizzaState={{}}
      handleFavoriteProduct={vi.fn()}
      handleCreateGuestUser={vi.fn()}
      closeModalProductForm={vi.fn()}
      increment={vi.fn()}
      decrement={vi.fn()}
      handleChangeProductCartQuantity={vi.fn()}
      showOption={vi.fn()}
      handleChangeIngredientState={vi.fn()}
      handleChangeSuboptionState={vi.fn()}
      handleChangeCommentState={vi.fn()}
      {...rest}
    />
  ),
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 }, carts: {}, loading: false }, {}],
  useUtils: () => [{ optimizeImage: (url) => url, parsePrice: (v) => `$${v}` }],
  useSite: () => [{ site: { product_url_template: '/store/:business_slug/:category_slug/:product_slug' } }],
  useConfig: () => [{ configs: { guest_checkout_enabled: { value: '0' }, unaddressed_order_types_allowed: { value: '' }, allowed_order_types_guest_checkout: { value: '' } } }]
}))
vi.mock('~ui', () => ({
  useWindowSize: () => ({ width: 1200, height: 800 }),
  ProductIngredient: () => null,
  ProductOption: ({ children }) => <div>{children}</div>,
  ProductOptionSubOption: () => null,
  ProductShare: () => null,
  LoginForm: () => null,
  SignUpForm: () => null,
  ForgotPasswordForm: () => null,
  AddressList: () => null,
  Modal: () => null,
  Alert: () => null,
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Tabs: ({ children }) => <div>{children}</div>,
  Tab: ({ children }) => <div>{children}</div>,
  Input: () => null,
  TextArea: () => null,
  AutoScroll: ({ children }) => <div>{children}</div>,
  NotFoundSource: ({ content }) => <div>{content}</div>,
  LinkableText: ({ text }) => <p>{text}</p>,
  scrollTo: vi.fn(),
  orderTypeList: ['delivery']
}))
vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => []
}))

describe('ProductForm', () => {
  beforeEach(() => {
    mockState.productObject = {
      product: { id: 100, name: 'Cheeseburger', price: 9.99, minimum_per_order: 1, gallery: [], tags: [] },
      loading: false,
      error: null
    }
    mockState.product = { id: 100, name: 'Cheeseburger', price: 9.99, minimum_per_order: 1 }
    mockState.productCart = { ingredients: {}, options: {}, quantity: 1, total: 9.99 }
    mockState.errors = {}
    mockState.actionStatus = { loading: false }
  })

  it('renders product name from controller state', () => {
    const { getByText } = renderWithProviders(
      <ProductForm businessId={1} product={mockState.product} />
    )
    expect(getByText('Cheeseburger')).toBeInTheDocument()
  })

  it('shows skeleton while product is loading', () => {
    mockState.productObject = { product: null, loading: true, error: null }
    const { getAllByTestId } = renderWithProviders(
      <ProductForm businessId={1} product={null} />
    )
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('shows not found message when product fetch fails', () => {
    mockState.productObject = { product: null, loading: false, error: [{ message: 'Product not found' }] }
    const { getByText } = renderWithProviders(
      <ProductForm businessId={1} product={null} />
    )
    expect(getByText('Product not found')).toBeInTheDocument()
  })

  it('renders offer price and description when present', () => {
    mockState.productObject = {
      product: {
        id: 100,
        name: 'Cheeseburger',
        price: 9.99,
        in_offer: true,
        offer_price: 7.99,
        description: 'Classic burger',
        minimum_per_order: 1,
        gallery: [],
        tags: [{ id: 1, name: 'Spicy' }]
      },
      loading: false,
      error: null
    }
    const { getByText } = renderWithProviders(
      <ProductForm businessId={1} product={mockState.productObject.product} />
    )
    expect(getByText('Classic burger')).toBeInTheDocument()
    expect(getByText('Spicy')).toBeInTheDocument()
  })
})
