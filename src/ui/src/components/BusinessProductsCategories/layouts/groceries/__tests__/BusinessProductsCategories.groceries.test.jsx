import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { BusinessProductsCategories } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessProductsCategories: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSkeleton={false}
      categories={[{ id: 10, name: 'Produce', level: 1 }]}
      handlerClickCategory={vi.fn()}
      categorySelected={{ id: 10 }}
      openCategories={[]}
      setCategoryClicked={vi.fn()}
      featured={false}
      avoidAllLevelsSubCategories
      {...rest}
    />
  )
}))
vi.mock('~ui', () => ({
  AccordionDropdown: ({ item }) => <div data-testid='accordion-item'>{item?.name}</div>
}))

describe('BusinessProductsCategories groceries layout', () => {
  it('renders grocery category name', () => {
    const { getByText } = renderWithProviders(<BusinessProductsCategories businessId={1} />)
    expect(getByText('Produce')).toBeInTheDocument()
  })
})
