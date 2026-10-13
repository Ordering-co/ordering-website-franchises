import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { RenderProductsLayout } from '../index'
import { sampleCategory, sampleCategoryState } from '../../../../../test/productUiTestUtils'

const mockState = vi.hoisted(() => ({
  isLoading: false,
  isError: false,
  viewport: { width: 1200, height: 800 }
}))

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ parsePrice: amount => `$${amount}` }],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}]
}))
vi.mock('~ui', () => ({
  useWindowSize: () => mockState.viewport,
  SpinnerLoader: () => <div data-testid='spinner' />,
  Modal: () => null,
  Button: ({ children }) => <button type='button'>{children}</button>,
  Cart: () => null,
  BusinessBasicInformation: ({ isSkeleton }) => (
    <div data-testid={isSkeleton ? 'basic-info-skeleton' : 'basic-info'} />
  ),
  BusinessProductsCategories: ({ isSkeleton }) => (
    <div data-testid={isSkeleton ? 'categories-skeleton' : 'categories'} />
  ),
  BusinessProductsList: ({ isBusinessLoading }) => (
    <div data-testid={isBusinessLoading ? 'products-list-loading' : 'products-list'} />
  ),
  SearchProducts: () => null,
  CategoriesLayoutGroceries: () => null,
  CategoriesPopover: () => null,
  scrollTo: vi.fn()
}))

describe('RenderProductsLayout', () => {
  beforeEach(() => {
    mockState.isLoading = false
    mockState.isError = false
    mockState.viewport = { width: 1200, height: 800 }
  })

  const baseProps = {
    isError: false,
    business: { id: 1, name: 'Demo', slug: 'demo', categories: [sampleCategory] },
    businessState: { business: { id: 1 }, loading: false },
    categoryState: sampleCategoryState,
    categorySelected: { id: null, name: 'All' },
    currentCart: { products: [] },
    featuredProducts: false,
    openCategories: { values: [] },
    openBusinessInformation: false,
    onClickCategory: vi.fn(),
    onProductClick: vi.fn(),
    handler: vi.fn(),
    handleChangeSearch: vi.fn(),
    handleSearchRedirect: vi.fn(),
    setOpenBusinessInformation: vi.fn(),
    setSubcategoriesSelected: vi.fn(),
    subcategoriesSelected: [],
    sortByOptions: [],
    handleChangeSortBy: vi.fn(),
    handleUpdateProducts: vi.fn(),
    isCartOnProductsList: false,
    isLazy: false,
    isCustomerMode: false
  }

  it('renders products list layout', () => {
    const { getByTestId } = renderWithProviders(
      <RenderProductsLayout {...baseProps} isLoading={false} />
    )
    expect(getByTestId('products-list')).toBeInTheDocument()
  })

  it.each([false, true])('shows one pre-cart awareness module with groceries=%s', groceries => {
    const { getAllByText } = renderWithProviders(
      <RenderProductsLayout {...baseProps} isLoading={false} freeDeliveryProgress={{ status: 'awareness', minimum: 30 }} />,
      { themeOverrides: { business_view: { components: { categories: { components: { show_first_categories: { hidden: !groceries } } } } } } }
    )
    expect(getAllByText('Free delivery on orders $30+')).toHaveLength(1)
  })

  it('places phone awareness below business information', () => {
    mockState.viewport = { width: 390, height: 844 }
    const { getByTestId, getByText } = renderWithProviders(<RenderProductsLayout {...baseProps} isLoading={false} freeDeliveryProgress={{ status: 'awareness', minimum: 30 }} />)
    expect(getByTestId('basic-info').compareDocumentPosition(getByText('Free delivery on orders $30+')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders loading skeleton layout while business is loading', () => {
    const { getByTestId } = renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        isLoading
        categoryState={{ ...sampleCategoryState, loading: true }}
      />
    )
    expect(getByTestId('basic-info-skeleton')).toBeInTheDocument()
    expect(getByTestId('categories-skeleton')).toBeInTheDocument()
    expect(getByTestId('products-list-loading')).toBeInTheDocument()
  })
})
