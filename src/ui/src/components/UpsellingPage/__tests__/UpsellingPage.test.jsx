import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { UpsellingPage } from '../index'

const mockState = vi.hoisted(() => ({
  isCustomMode: true,
  upsellingProducts: { loading: false, products: [{ id: 100, name: 'Fries' }], error: false },
  openUpselling: true,
  canOpenUpselling: true,
  currentCart: { products: [] }
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  UpsellingPage: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessId={1}
      business={{ id: 1, name: 'Demo Store' }}
      cartProducts={[]}
      openUpselling={mockState.openUpselling}
      canOpenUpselling={mockState.canOpenUpselling}
      setCanOpenUpselling={vi.fn()}
      handleUpsellingPage={vi.fn()}
      upsellingProducts={mockState.upsellingProducts}
      isCustomMode={mockState.isCustomMode}
      currentCart={mockState.currentCart}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, optimizeImage: (url) => url }],
  useApi: () => [{}, {}],
  useOrder: () => [{ carts: {} }, {}],
  useSession: () => [{ auth: true }, {}]
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Modal: ({ open, children }) => (open ? <div data-testid='upselling-modal'>{children}</div> : null),
  AutoScroll: ({ children }) => <div>{children}</div>,
  SingleProductCard: ({ product }) => <div>{product?.name}</div>,
  ProductForm: () => null,
  Cart: () => <div data-testid='cart-panel' />
}))

describe('UpsellingPage', () => {
  beforeEach(() => {
    mockState.isCustomMode = true
    mockState.upsellingProducts = { loading: false, products: [{ id: 100, name: 'Fries' }], error: false }
    mockState.openUpselling = true
    mockState.canOpenUpselling = true
    mockState.currentCart = { products: [] }
  })

  it('renders upselling prompt in custom mode', () => {
    const { getByText } = renderWithProviders(
      <UpsellingPage businessId={1} business={{ id: 1, name: 'Demo Store' }} cartProducts={[]} />
    )
    expect(getByText('Do you want something else?')).toBeInTheDocument()
  })

  it('renders upselling product cards when loaded', () => {
    const { getByText } = renderWithProviders(
      <UpsellingPage businessId={1} business={{ id: 1, name: 'Demo Store' }} cartProducts={[]} />
    )
    expect(getByText('Fries')).toBeInTheDocument()
  })

  it('shows skeleton while upselling products are loading', async () => {
    mockState.upsellingProducts = {
      loading: true,
      products: [{ id: 100, name: 'Fries' }],
      error: false
    }
    const { getAllByTestId } = renderWithProviders(
      <UpsellingPage businessId={1} business={{ id: 1, name: 'Demo Store' }} cartProducts={[]} />
    )
    await waitFor(() => {
      expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
    })
  })

  it('opens cart modal flow in standard mode', () => {
    mockState.isCustomMode = false
    mockState.currentCart = { products: [{ id: 1, name: 'Burger' }], status: 1 }
    const { getByText, getByTestId } = renderWithProviders(
      <UpsellingPage businessId={1} business={{ id: 1, name: 'Demo Store' }} cartProducts={[]} />
    )
    expect(getByTestId('upselling-modal')).toBeInTheDocument()
    expect(getByText('Order details')).toBeInTheDocument()
  })
})
