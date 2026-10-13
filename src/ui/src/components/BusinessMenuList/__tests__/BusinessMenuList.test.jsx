import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessMenuList } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessMenuListing: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessMenuList={{ loading: false, menus: [{ id: 1, name: 'Lunch', enabled: true }] }}
      setMenu={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f]
}))
vi.mock('~ui', () => ({
  Select: ({ options, placeholder }) => (
    <div data-testid='select' data-placeholder={placeholder}>{options?.length || 0}</div>
  )
}))

describe('BusinessMenuList', () => {
  it('renders menu selector with enabled menus', () => {
    const { getByText, getByTestId } = renderWithProviders(<BusinessMenuList businessId={1} />)
    expect(getByText('Menu')).toBeInTheDocument()
    expect(getByTestId('select')).toHaveAttribute('data-placeholder', 'Menu name')
  })
})
