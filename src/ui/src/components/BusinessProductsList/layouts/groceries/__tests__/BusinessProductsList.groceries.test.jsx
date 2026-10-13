import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { BusinessProductsList } from '../index'
import { sampleCategory, sampleCategoryState } from '../../../../../../../test/productUiTestUtils'

vi.mock('~components', () => ({
  ProductsList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessId={1}
      category={{ id: 10, name: 'Burgers' }}
      categories={[{ id: 10, name: 'Burgers' }]}
      categoryState={{ loading: false, products: [{ id: 100, name: 'Cheeseburger' }], pagination: { currentPage: 1, totalPages: 1 } }}
      business={{ food: true }}
      onProductClick={vi.fn()}
      handleSearchRedirect={vi.fn()}
      handleClearSearch={vi.fn()}
      currentCart={{ products: [] }}
      isBusinessLoading={false}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useConfig: () => [{ configs: {} }]
}))
vi.mock('~ui', () => ({
  SingleProductCard: ({ product }) => <div data-testid='product-card'>{product?.name}</div>,
  NotFoundSource: ({ content }) => <div>{content}</div>,
  Modal: () => null,
  Button: ({ children }) => <button type='button'>{children}</button>,
  shape: {}
}))

describe('BusinessProductsList groceries layout', () => {
  it('renders grocery product card', () => {
    const { getByText } = renderWithProviders(
      <BusinessProductsList
        businessId={1}
        category={sampleCategory}
        categories={[sampleCategory]}
        categoryState={sampleCategoryState}
        business={{ food: true }}
        onProductClick={vi.fn()}
        handleSearchRedirect={vi.fn()}
        handleClearSearch={vi.fn()}
        currentCart={{ products: [] }}
        isBusinessLoading={false}
      />
    )
    expect(getByText('Cheeseburger')).toBeInTheDocument()
  })
})
