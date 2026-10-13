import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CitiesControl } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { city_id: 1 }, loading: false }, {}]
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  SearchBar: ({ placeholder, onSearch }) => (
    <input data-testid='search' placeholder={placeholder} onChange={(e) => onSearch?.(e.target.value)} />
  )
}))

describe('CitiesControl', () => {
  it('renders city list and continues with selected city', () => {
    const onClose = vi.fn()
    const handleChangeCity = vi.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <CitiesControl
        cities={[{ id: 1, name: 'Miami', enabled: true }, { id: 2, name: 'Orlando', enabled: true }]}
        onClose={onClose}
        handleChangeCity={handleChangeCity}
      />
    )
    expect(getByText('Select a store')).toBeInTheDocument()
    fireEvent.click(getByText('Orlando'))
    fireEvent.click(getByText('Continue'))
    expect(handleChangeCity).toHaveBeenCalledWith(2)
    expect(onClose).toHaveBeenCalled()
  })
})
