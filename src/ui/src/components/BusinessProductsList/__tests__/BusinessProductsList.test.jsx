import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessProductsList } from '../index'
import { sampleCategory, sampleCategoryState } from '../../../../../test/productUiTestUtils'

const mockState = vi.hoisted(() => ({
  categoryState: {
    loading: false,
    products: [{ id: 100, name: 'Cheeseburger' }],
    pagination: { currentPage: 1, totalPages: 1, nextPageItems: 3 }
  },
  isBusinessLoading: false,
  searchValue: ''
}))

vi.mock('~components', () => ({
  ProductsList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessId={1}
      category={{ id: 10, name: 'Burgers' }}
      categories={[{ id: 10, name: 'Burgers' }]}
      categoryState={mockState.categoryState}
      subcategoriesSelected={[]}
      setSubcategoriesSelected={vi.fn()}
      onProductClick={vi.fn()}
      handleSearchRedirect={vi.fn()}
      handleClearSearch={vi.fn()}
      currentCart={{ products: [] }}
      isBusinessLoading={mockState.isBusinessLoading}
      searchValue={mockState.searchValue}
      featured={false}
      isLazy={false}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useConfig: () => [{ configs: {} }]
}))
vi.mock('~ui', () => ({
  SingleProductCard: ({ product, isSkeleton }) => (
    isSkeleton
      ? <div data-testid='product-skeleton' />
      : <div data-testid='product-card'>{product?.name}</div>
  ),
  NotFoundSource: ({ content }) => <div>{content}</div>,
  Modal: () => null,
  AutoScroll: ({ children }) => <div>{children}</div>,
  Button: ({ children }) => <button type='button'>{children}</button>,
  shape: {}
}))

describe('BusinessProductsList', () => {
  beforeEach(() => {
    mockState.categoryState = {
      loading: false,
      products: [{ id: 100, name: 'Cheeseburger' }],
      pagination: { currentPage: 1, totalPages: 1, nextPageItems: 3 }
    }
    mockState.isBusinessLoading = false
    mockState.searchValue = ''
  })

  it('renders product card from category state', () => {
    const { getByText } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={sampleCategory}
        categories={[sampleCategory]}
        categoryState={sampleCategoryState}
        subcategoriesSelected={[]}
        setSubcategoriesSelected={vi.fn()}
        onProductClick={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleClearSearch={vi.fn()}
        currentCart={{ products: [] }}
        isBusinessLoading={false}
      />
    )
    expect(getByText('Cheeseburger')).toBeInTheDocument()
  })

  it('renders skeleton cards while category is loading', () => {
    mockState.categoryState = {
      loading: true,
      products: [],
      pagination: { currentPage: 1, totalPages: 1, nextPageItems: 3 }
    }
    const { getAllByTestId } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={sampleCategory}
        categories={[sampleCategory]}
        categoryState={mockState.categoryState}
        subcategoriesSelected={[]}
        setSubcategoriesSelected={vi.fn()}
        onProductClick={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleClearSearch={vi.fn()}
        currentCart={{ products: [] }}
        isBusinessLoading={false}
      />
    )
    expect(getAllByTestId('product-skeleton').length).toBeGreaterThan(0)
  })

  it('shows not found message when search returns no products', () => {
    mockState.categoryState = {
      loading: false,
      products: [],
      pagination: { currentPage: 1, totalPages: 1, nextPageItems: 3 }
    }
    mockState.searchValue = 'pizza'
    const { getByText } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={sampleCategory}
        categories={[sampleCategory]}
        categoryState={mockState.categoryState}
        searchValue='pizza'
        subcategoriesSelected={[]}
        setSubcategoriesSelected={vi.fn()}
        onProductClick={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleClearSearch={vi.fn()}
        currentCart={{ products: [] }}
        isBusinessLoading={false}
      />
    )
    expect(getByText('No products found, please change filters.')).toBeInTheDocument()
  })
})
