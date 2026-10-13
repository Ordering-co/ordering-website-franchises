import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessListingSearch } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~ui/utils', () => ({
  checkSiteUrl: (_u, f) => f,
  removeQueryToUrl: vi.fn(),
  capitalize: (s) => s,
  getCateringValues: () => ({})
}))
vi.mock('~ui', () => ({
  generalUtilities: () => ({ getOrderStatus: () => 'pending', convertHoursToMinutes: (v) => v }),
  useWindowSize: () => ({ width: 1200, height: 800 }),
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  MyOrders: () => null,
  Modal: () => null,
  ProductForm: () => null,
  SingleProductCard: () => null,
  AutoScroll: ({ children }) => <div data-testid='auto-scroll'>{children}</div>,
  BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>,
  BusinessTypeFilter: () => <div data-testid='type-filter' />,
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  SearchBar: ({ placeholder, onSearch }) => (
    <input data-testid='search' placeholder={placeholder} onChange={(e) => onSearch?.(e.target.value)} />
  )
}))
vi.mock('~components', () => ({
  BusinessSearchList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesSearchList={{ loading: false, businesses: [{ id: 1, name: 'Search Store', open: true, enabled: true }] }}
      productsList={{ loading: false, products: [] }}
      termValue='pizza'
      auth={false}
      noResults={false}
      filterOptionsEnabled={[]}
      filters={{}}
      handleChangeTermValue={vi.fn()}
      onBusinessClick={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 }, carts: {} }, {}],
  useUtils: () => [{ parsePrice: (v) => '$' + v, parseDistance: (v) => v }],
  useConfig: () => [{ configs: {} }],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }],
  useSession: () => [{ auth: false }, {}]
}))

describe('BusinessListingSearch', () => {
  it('renders search results with business cards', () => {
    const { getByTestId, getByText } = renderWithProviders(<BusinessListingSearch />)
    expect(getByTestId('search')).toBeInTheDocument()
    expect(getByTestId('business-card')).toHaveTextContent('Search Store')
    fireEvent.change(getByTestId('search'), { target: { value: 'burger' } })
    expect(getByText('Search Store')).toBeInTheDocument()
  })
})
