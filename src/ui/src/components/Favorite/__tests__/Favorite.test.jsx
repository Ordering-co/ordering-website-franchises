import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Favorite } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { address: { location: { lat: 1, lng: 2 } } } }, {}]
}))
vi.mock('~ui', () => ({
  FavoriteList: ({ favoriteURL }) => <div data-testid='favorite-list' data-url={favoriteURL} />,
  Tabs: ({ children }) => <div data-testid='tabs'>{children}</div>,
  Tab: ({ children, onClick, active }) => (
    <button type='button' data-active={String(!!active)} onClick={onClick}>{children}</button>
  )
}))

describe('Favorite', () => {
  it('renders favorite tabs and business list by default', () => {
    const { getByText, getByTestId } = renderWithProviders(<Favorite />)
    expect(getByText('Businesses')).toBeInTheDocument()
    expect(getByTestId('favorite-list')).toHaveAttribute('data-url', 'favorite_businesses')
  })

  it('switches to products tab', () => {
    const { getByText, getByTestId } = renderWithProviders(<Favorite />)
    fireEvent.click(getByText('Products'))
    expect(getByTestId('favorite-list')).toHaveAttribute('data-url', 'favorite_products')
  })
})
