import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessProductsCategoriesScroll } from '../index'
import { ensureStylesElement } from '../../../../../test/productUiTestUtils'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessProductsCategories: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSkeleton={false}
      categories={[{ id: 10, name: 'Burgers' }]}
      handlerClickCategory={vi.fn()}
      handleTogglePopover={vi.fn()}
      categorySelected={{ id: 10 }}
      featured={false}
      openBusinessInformation
      business={{ lazy_load_products_recommended: false }}
      selectedCategoryId={10}
      {...rest}
    />
  )
}))
vi.mock('~ui', () => ({
  Tabs: ({ children }) => <div>{children}</div>,
  Tab: ({ children }) => <div>{children}</div>,
  useWindowSize: () => ({ width: 1200, height: 800 }),
  AutoScroll: ({ children }) => <div>{children}</div>
}))

describe('BusinessProductsCategoriesScroll', () => {
  beforeEach(() => {
    ensureStylesElement()
  })

  it('renders scrollable category name', () => {
    const { getByText } = renderWithProviders(<BusinessProductsCategoriesScroll businessId={1} />)
    expect(getByText('Burgers')).toBeInTheDocument()
  })
})
