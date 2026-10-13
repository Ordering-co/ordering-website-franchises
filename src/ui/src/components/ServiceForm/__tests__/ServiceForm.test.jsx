import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ServiceForm } from '../index'

const mockState = vi.hoisted(() => ({
  productObject: {
    product: { id: 100, name: 'Haircut', price: 25, type: 'service' },
    loading: false,
    error: null
  },
  professionalListState: {
    loading: false,
    professionals: [{ id: 1, name: 'Jane', enabled: true }]
  }
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('nanoid', () => ({ nanoid: () => 'test-id' }))
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~components', () => ({
  ProductForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessId={1}
      isService
      product={mockState.productObject.product}
      productObject={mockState.productObject}
      productCart={{ quantity: 1 }}
      professionalList={[{ id: 1, name: 'Jane', enabled: true }]}
      professionalSelected={null}
      professionalListState={mockState.professionalListState}
      handleSave={vi.fn()}
      onSave={vi.fn()}
      isSoldOut={false}
      maxProductQuantity={1}
      handleCreateGuestUser={vi.fn()}
      actionStatus={{ loading: false }}
      {...rest}
    />
  ),
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 }, loading: false }, {}],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDate: () => 'Jan 1' }],
  useConfig: () => [{ configs: { guest_checkout_enabled: { value: '0' }, format_time: { value: '12' }, allowed_order_types_guest_checkout: { value: '' } } }]
}))
vi.mock('~ui', () => ({
  Alert: () => null,
  Modal: () => null,
  LoginForm: () => null,
  SignUpForm: () => null,
  ForgotPasswordForm: () => null,
  Button: ({ children }) => <button type='button'>{children}</button>,
  getTimes: () => ['09:00'],
  orderTypeList: ['delivery'],
  NotFoundSource: ({ content }) => <div>{content}</div>
}))

describe('ServiceForm', () => {
  beforeEach(() => {
    mockState.productObject = {
      product: { id: 100, name: 'Haircut', price: 25, type: 'service' },
      loading: false,
      error: null
    }
    mockState.professionalListState = {
      loading: false,
      professionals: [{ id: 1, name: 'Jane', enabled: true }]
    }
  })

  it('renders service product name', () => {
    const { getByText } = renderWithProviders(
      <ServiceForm businessId={1} product={{ id: 100, name: 'Haircut', price: 25, type: 'service' }} />
    )
    expect(getByText('Haircut')).toBeInTheDocument()
  })

  it('shows skeleton while service product is loading', () => {
    mockState.productObject = { product: null, loading: true, error: null }
    const { getAllByTestId } = renderWithProviders(
      <ServiceForm businessId={1} product={null} />
    )
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
