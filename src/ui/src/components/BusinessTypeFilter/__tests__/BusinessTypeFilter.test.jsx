import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessTypeFilter } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessTypeFilter: ({ UIComponent, ...rest }) => (
    <UIComponent
      typesState={{ loading: false, types: [{ id: 1, name: 'Food', enabled: true }, { id: 2, name: 'Drinks', enabled: true }] }}
      currentTypeSelected={1}
      handleChangeBusinessType={vi.fn()}
      filters={{ business_types: [] }}
      handleChangeFilters={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Tabs: ({ children }) => <div>{children}</div>,
  Tab: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))

describe('BusinessTypeFilter', () => {
  it('renders business type tabs', () => {
    const { getByText } = renderWithProviders(<BusinessTypeFilter />)
    expect(getByText('Food')).toBeInTheDocument()
    fireEvent.click(getByText('Drinks'))
  })
})
