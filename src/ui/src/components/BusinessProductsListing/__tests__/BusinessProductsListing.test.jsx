import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { fireEvent, screen } from '@testing-library/react'
import { BusinessProductsListing } from '../index'

const mockState = vi.hoisted(() => ({
  progress: vi.fn(() => ({ status: 'hidden' })),
  carts: {},
  viewport: { width: 1200, height: 800 },
  businessState: {
    business: { id: 1, name: 'Demo', slug: 'demo', categories: [], description: 'Desc' },
    loading: false,
    error: null
  },
  categoryState: {
    loading: false,
    products: [{ id: 100, name: 'Cheeseburger' }],
    pagination: { currentPage: 1, totalPages: 1 }
  }
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ pathname: '/store/demo', search: '' })
  }
})
vi.mock('~components', () => ({
  useFreeDeliveryProgress: mockState.progress,
  BusinessAndProductList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessState={mockState.businessState}
      categoryState={mockState.categoryState}
      categorySelected={{ id: null, name: 'All' }}
      productModal={{ loading: false, error: null, product: null }}
      alertState={{ open: false, content: [] }}
      setAlertState={vi.fn()}
      handleChangeCategory={vi.fn()}
      onProductRedirect={vi.fn()}
      onCheckoutRedirect={vi.fn()}
      loadedFirstTime
      isInitialRender={false}
      handleUpdateInitialRender={vi.fn()}
      openCategories={{ values: [] }}
      updateProductModal={vi.fn()}
      onChangeMetaTag={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 }, carts: mockState.carts }, {}],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, optimizeImage: (url) => url }],
  useSession: () => [{ auth: false }, {}],
  useSite: () => [{ site: { product_url_template: '/store/:business_slug/:category_slug/:product_slug' } }],
  useConfig: () => [{ configs: {} }],
  useBusiness: () => [{ business: { id: 1 } }, { setBusiness: vi.fn() }],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', () => ({
  checkSiteUrl: (_template, fallback) => fallback,
  RenderProductsLayout: ({ isLoading }) => (
    <div data-testid={isLoading ? 'products-layout-loading' : 'products-layout'} />
  ),
  AddressOrderType: () => null,
  Modal: ({ children, open }) => open ? <div>{children}</div> : null,
  Cart: ({ freeDeliveryProgress }) => <div data-testid='modal-cart' data-status={freeDeliveryProgress?.status} />,
  ProductForm: () => null,
  ServiceForm: () => null,
  UpsellingPage: () => null,
  Alert: () => null,
  NotFoundSource: ({ content }) => <div>{content}</div>,
  PageNotFound: () => <div>Page not found</div>,
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  useWindowSize: () => mockState.viewport,
  useIsMounted: () => true
}))

describe('BusinessProductsListing', () => {
  beforeEach(() => {
    mockState.progress.mockClear()
    mockState.progress.mockReturnValue({ status: 'hidden' })
    mockState.carts = {}
    mockState.viewport = { width: 1200, height: 800 }
    window.scrollTo = vi.fn()
    mockState.businessState = {
      business: { id: 1, name: 'Demo', slug: 'demo', categories: [], description: 'Desc' },
      loading: false,
      error: null
    }
    mockState.categoryState = {
      loading: false,
      products: [{ id: 100, name: 'Cheeseburger' }],
      pagination: { currentPage: 1, totalPages: 1 }
    }
  })

  it('renders products layout from listing controller', () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsListing />)
    expect(getByTestId('products-layout')).toBeInTheDocument()
  })

  it('scopes one hook to the business and franchise', () => {
    renderWithProviders(<BusinessProductsListing franchiseId='brand' />)
    expect(mockState.progress).toHaveBeenCalledWith({
      business: mockState.businessState.business, cart: {}, franchiseId: 'brand', enabled: true
    })
  })

  it('shares compact progress with the opened mobile cart', () => {
    mockState.viewport = { width: 390, height: 844 }
    mockState.carts = { one: { business: { slug: 'demo' }, products: [{ id: 100 }], total: 10 } }
    mockState.progress.mockReturnValue({ status: 'progress', minimum: 30, currentAmount: 10, remainingAmount: 20, progressPercent: 33 })
    renderWithProviders(<BusinessProductsListing />)
    const message = screen.getByText('Add $20 for free delivery')
    const button = screen.getByRole('button', { name: 'View cart' })
    expect(message.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    fireEvent.click(button)
    expect(screen.getByTestId('modal-cart')).toHaveAttribute('data-status', 'progress')
    expect(screen.queryByText('Add $20 for free delivery')).not.toBeInTheDocument()
  })

  it('keeps the unconfirmed offer visible above the mobile cart CTA', () => {
    mockState.viewport = { width: 390, height: 844 }
    mockState.carts = { one: { business: { slug: 'demo' }, products: [{ id: 100 }], total: 35 } }
    mockState.progress.mockReturnValue({ status: 'unconfirmed', minimum: 30 })
    renderWithProviders(<BusinessProductsListing />)
    const message = screen.getByText('Free delivery has not been applied to this cart yet')
    const viewCart = screen.getByRole('button', { name: 'View cart' })
    expect(message.compareDocumentPosition(viewCart) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('reserves the measured mobile cart footer height below the last product', () => {
    mockState.viewport = { width: 390, height: 844 }
    mockState.carts = { one: { business: { slug: 'demo' }, products: [{ id: 100 }], total: 35 } }
    mockState.progress.mockReturnValue({ status: 'unconfirmed', minimum: 30 })
    const measure = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ height: 116 })

    try {
      renderWithProviders(<BusinessProductsListing />)
      expect(screen.getByTestId('products-layout').parentElement).toHaveStyle({ paddingBottom: '132px' })
    } finally {
      measure.mockRestore()
    }
  })

  it('shows a message without adding a desktop cart action when the theme hides the inline cart', () => {
    mockState.carts = { one: { business: { slug: 'demo' }, products: [{ id: 100 }], total: 35 } }
    mockState.progress.mockReturnValue({ status: 'unlocked' })
    renderWithProviders(<BusinessProductsListing />, { themeOverrides: { business_view: { components: { cart: { components: { hidden: true } } } } } })

    expect(screen.getByText('Free delivery unlocked')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View cart' })).not.toBeInTheDocument()
  })

  it('disables lookup for kiosks and loading businesses', () => {
    const { rerender } = renderWithProviders(<BusinessProductsListing useKioskApp />)
    expect(mockState.progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    mockState.businessState.loading = true
    rerender(<BusinessProductsListing />)
    expect(mockState.progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
  })

  it('renders loading layout while business is loading', () => {
    mockState.businessState = { business: {}, loading: true, error: null }
    const { getByTestId } = renderWithProviders(<BusinessProductsListing />)
    expect(getByTestId('products-layout-loading')).toBeInTheDocument()
  })

  it('shows store not found message when business fetch fails on store route', () => {
    mockState.businessState = { business: null, loading: false, error: null }
    const { getByText } = renderWithProviders(<BusinessProductsListing />)
    expect(getByText(/Sorry, an error has occurred with business selected/)).toBeInTheDocument()
  })
})
