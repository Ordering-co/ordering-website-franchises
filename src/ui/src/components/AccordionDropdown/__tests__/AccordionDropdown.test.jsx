import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { AccordionDropdown } from '../index'

const windowSizeRef = { current: { width: 800, height: 600 } }

vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  useWindowSize: () => windowSizeRef.current
}))

const IterateCategories = ({ list, isSub, currentCat }) => (
  <div data-testid='iterate-categories'>
    {currentCat.name}:{isSub ? 'sub' : 'root'}:{list?.length || 0}
  </div>
)

describe('AccordionDropdown', () => {
  beforeEach(() => {
    windowSizeRef.current = { width: 800, height: 600 }
  })

  it('renders the category name and selects it from the title', () => {
    const handleClickItem = vi.fn()
    const { getByText, queryByTestId } = renderWithProviders(
      <AccordionDropdown
        item={{ name: 'Pizza', subcategories: [{ id: 2 }] }}
        spaceTab={12}
        isOpen={false}
        isSelected
        handleClickItem={handleClickItem}
        IterateCategories={IterateCategories}
      />
    )
    expect(getByText('Pizza')).toBeInTheDocument()
    expect(queryByTestId('iterate-categories')).not.toBeInTheDocument()
    fireEvent.click(getByText('Pizza'))
    expect(handleClickItem).toHaveBeenCalledWith(false)
  })

  it('shows nested categories when open and selects from the check control', () => {
    const handleClickItem = vi.fn()
    const { getByTestId, container } = renderWithProviders(
      <AccordionDropdown
        item={{ name: 'Drinks', subcategories: [{ id: 3 }, { id: 4 }] }}
        isOpen
        handleClickItem={handleClickItem}
        IterateCategories={IterateCategories}
      />
    )
    expect(getByTestId('iterate-categories')).toHaveTextContent('Drinks:sub:2')
    fireEvent.click(container.querySelector('.accordion-title'))
    expect(handleClickItem).toHaveBeenCalledWith(false)
    const selectCategory = container.querySelector('.accordion-title > div > div')
    fireEvent.click(selectCategory)
    expect(handleClickItem).toHaveBeenCalledWith(true)
  })

  it('hides the check control on wide screens unless allowAllClick is set', () => {
    windowSizeRef.current = { width: 1200, height: 800 }
    const handleClickItem = vi.fn()
    const { container, rerender } = renderWithProviders(
      <AccordionDropdown
        item={{ name: 'Sides' }}
        handleClickItem={handleClickItem}
        IterateCategories={IterateCategories}
      />
    )
    expect(container.querySelector('.accordion-title > div > div')).toBeNull()

    rerender(
      <AccordionDropdown
        item={{ name: 'Sides' }}
        allowAllClick
        handleClickItem={handleClickItem}
        IterateCategories={IterateCategories}
      />
    )
    fireEvent.click(container.querySelector('.accordion-title > div > div'))
    expect(handleClickItem).toHaveBeenCalledWith(true)
  })
})
