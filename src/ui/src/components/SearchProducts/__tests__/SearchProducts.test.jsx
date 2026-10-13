import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SearchProducts } from '../index'
import { sampleCategory } from '../../../../../test/productUiTestUtils'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', () => ({
  SearchBar: ({ placeholder }) => <input data-testid='search-bar' placeholder={placeholder} />,
  BusinessProductsList: () => <div data-testid='products-list' />
}))

describe('SearchProducts', () => {
  it('renders cancel action and products list when searching', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <SearchProducts
        onClose={vi.fn()}
        searchValue='burger'
        handleChangeSearch={vi.fn()}
        business={{ id: 1, categories: [sampleCategory], lazy_load_products_recommended: false }}
        featuredProducts={false}
        categorySelected={{ id: null }}
      />
    )
    expect(getByText('Cancel')).toBeInTheDocument()
    expect(getByTestId('products-list')).toBeInTheDocument()
  })
})
