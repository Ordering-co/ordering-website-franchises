import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { professionalSortOptions } from '../../../../../test/addressUiTestUtils'
import { ProfessionalBusinessFilter } from '../index'

const handleChangeSearch = vi.fn()
const handleChangeSortBy = vi.fn()
const handleChangePriceFilterValues = vi.fn()
const windowSizeRef = { current: { width: 1024, height: 768 } }

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  useWindowSize: () => windowSizeRef.current,
  SearchBar: ({ placeholder, onSearch, search }) => (
    <input
      data-testid='search-products'
      placeholder={placeholder}
      value={search || ''}
      onChange={(e) => onSearch?.(e.target.value)}
    />
  )
}))

describe('ProfessionalBusinessFilter', () => {
  it('searches, filters prices, and sorts', () => {
    windowSizeRef.current = { width: 1024, height: 768 }
    const { getByTestId, getByPlaceholderText } = renderWithProviders(
      <ProfessionalBusinessFilter
        sortByValue='name'
        sortByOptions={professionalSortOptions}
        handleChangeSortBy={handleChangeSortBy}
        handleChangeSearch={handleChangeSearch}
        searchValue='cut'
        business={{ lazy_load_products_recommended: true }}
        handleChangePriceFilterValues={handleChangePriceFilterValues}
        priceFilterValues={{ min: '10', max: '40' }}
      />
    )
    expect(getByTestId('search-products')).toHaveAttribute('placeholder', 'Search Products')
    fireEvent.change(getByTestId('search-products'), { target: { value: 'fade' } })
    expect(handleChangeSearch).toHaveBeenCalledWith('fade')
    fireEvent.change(getByPlaceholderText('Min'), { target: { value: '15' } })
    expect(handleChangePriceFilterValues).toHaveBeenCalledWith('min', '15')
    fireEvent.change(getByPlaceholderText('Max'), { target: { value: '50' } })
    expect(handleChangePriceFilterValues).toHaveBeenCalledWith('max', '50')
    fireEvent.change(getByTestId('language-select'), { target: { value: 'price' } })
    expect(handleChangeSortBy).toHaveBeenCalledWith('price')
  })

  it('blocks non numeric price keys on narrow screens', () => {
    windowSizeRef.current = { width: 400, height: 700 }
    const { getByPlaceholderText } = renderWithProviders(
      <ProfessionalBusinessFilter
        sortByOptions={professionalSortOptions}
        handleChangePriceFilterValues={handleChangePriceFilterValues}
        priceFilterValues={{}}
      />
    )
    const min = getByPlaceholderText('Min')
    fireEvent.keyPress(min, { key: 'a', preventDefault: () => {} })
    fireEvent.keyPress(min, { key: '3' })
    expect(handleChangePriceFilterValues).not.toHaveBeenCalled()
  })
})
