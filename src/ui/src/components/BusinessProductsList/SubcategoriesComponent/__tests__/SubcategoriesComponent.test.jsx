import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { SubcategoriesComponent } from '../index'
import { sampleCategory } from '../../../../../../test/productUiTestUtils'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>,
  Button: ({ children }) => <button type='button'>{children}</button>
}))

describe('SubcategoriesComponent', () => {
  it('renders all subcategory chips', () => {
    const { getByText } = renderWithProviders(
      <SubcategoriesComponent
        category={sampleCategory}
        subcategoriesSelected={[]}
        onClickSubcategory={vi.fn()}
      />
    )
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Beef')).toBeInTheDocument()
  })
})
