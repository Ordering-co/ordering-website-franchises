import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SingleProductCard } from '../index'

const mockState = vi.hoisted(() => ({
  isSkeleton: false,
  isSoldOut: false,
  isCustomerMode: false,
  product: { id: 100, name: 'Cheeseburger', price: 9.99 },
  auth: false
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  SingleProductCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSkeleton={mockState.isSkeleton}
      product={mockState.product}
      businessId={1}
      onProductClick={vi.fn()}
      isSoldOut={mockState.isSoldOut}
      handleFavoriteProduct={vi.fn()}
      isCustomerMode={mockState.isCustomerMode}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useConfig: () => [{ configs: { max_product_amount: '100' } }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, optimizeImage: (url) => url, parseDate: () => 'Jan 1' }],
  useSession: () => [{ auth: mockState.auth }, { login: vi.fn() }]
}))
vi.mock('~ui', () => ({
  Button: ({ children }) => <button type='button'>{children}</button>,
  Alert: ({ open, content }) => (open ? <div>{content?.[0]}</div> : null),
  Modal: ({ open, children }) => (open ? <div data-testid='auth-modal'>{children}</div> : null),
  LoginForm: () => <div>Login form</div>,
  SignUpForm: () => null,
  ForgotPasswordForm: () => null,
  useIntersectionObserver: () => [vi.fn(), true]
}))

describe('SingleProductCard', () => {
  beforeEach(() => {
    mockState.isSkeleton = false
    mockState.isSoldOut = false
    mockState.product = { id: 100, name: 'Cheeseburger', price: 9.99 }
    mockState.auth = false
  })

  it('renders product name', () => {
    const { getByText } = renderWithProviders(
      <SingleProductCard businessId={1} product={mockState.product} />
    )
    expect(getByText('Cheeseburger')).toBeInTheDocument()
  })

  it('renders skeleton placeholder when loading', () => {
    mockState.isSkeleton = true
    const { getAllByTestId } = renderWithProviders(
      <SingleProductCard businessId={1} isSkeleton />
    )
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('shows sold out label when product is unavailable', () => {
    mockState.isSoldOut = true
    const { getByText } = renderWithProviders(
      <SingleProductCard businessId={1} product={mockState.product} isSoldOut />
    )
    expect(getByText('Sold out')).toBeInTheDocument()
  })

  it('opens login modal when guest taps favorite in customer mode', () => {
    mockState.isCustomerMode = true
    mockState.product = { id: 100, name: 'Cheeseburger', price: 9.99, favorite: false }
    const { container, getByTestId } = renderWithProviders(
      <SingleProductCard businessId={1} product={mockState.product} isCustomerMode />
    )
    const favorite = container.querySelector('span svg')?.parentElement
    expect(favorite).toBeTruthy()
    fireEvent.click(favorite)
    expect(getByTestId('auth-modal')).toBeInTheDocument()
  })
})
