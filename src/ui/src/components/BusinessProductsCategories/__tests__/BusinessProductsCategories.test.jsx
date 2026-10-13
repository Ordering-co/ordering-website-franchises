import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessProductsCategories } from '../index'
import { ensureStylesElement } from '../../../../../test/productUiTestUtils'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessProductsCategories: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSkeleton={false}
      categories={[{ id: null, name: 'All' }, { id: 10, name: 'Burgers' }]}
      handlerClickCategory={vi.fn()}
      handleTogglePopover={vi.fn()}
      categorySelected={{ id: null }}
      featured={false}
      openBusinessInformation
      business={{ lazy_load_products_recommended: false }}
      {...rest}
    />
  )
}))
vi.mock('~ui', () => ({
  Tabs: ({ children }) => <div data-testid='tabs'>{children}</div>,
  Tab: ({ children }) => <div>{children}</div>,
  useWindowSize: () => ({ width: 1200, height: 800 }),
  AutoScroll: ({ children }) => <div>{children}</div>
}))

describe('BusinessProductsCategories', () => {
  beforeEach(() => {
    ensureStylesElement()
  })

  it('renders category tabs', () => {
    const { getByText } = renderWithProviders(<BusinessProductsCategories businessId={1} />)
    expect(getByText('Burgers')).toBeInTheDocument()
  })
})
