import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { OriginalBusinessesListing } from '../index'

vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2, 3]
}))
vi.mock('~components', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesList={{ loading: false, businesses: [{ id: 1, name: 'Store A', open: true, enabled: true, reviews: { total: 1 } }] }}
      paginationProps={{ currentPage: 1, totalPages: 1, nextPageItems: 0 }}
      handleBusinessClick={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1, address: { address: '123 Main', location: { lat: 1, lng: 2 } } }, loading: false, carts: {} }, {}],
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useConfig: () => [{ configs: {} }],
  useUtils: () => [{ parsePrice: (v) => '$' + v, parseDistance: (v) => v, parseTime: (v) => v, parseDate: () => 'Jan 1' }],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', async () => {
  const actual = await vi.importActual('~ui')
  return {
    ...actual,
    BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>,
    AutoScroll: ({ children }) => <div>{children}</div>,
    NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
    Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
    Modal: () => null,
    Alert: () => null,
    generalUtilities: () => ({ getOrderStatus: () => 'pending', convertHoursToMinutes: (v) => v }),
    getCateringValues: () => ({}),
    CitiesControl: () => null,
    AddressList: () => null,
    AddressForm: () => null,
    Pagination: () => null,
    BusinessesMap: () => null,
    SearchBar: () => null
  }
})

describe('OriginalBusinessesListing', () => {
  it('renders business cards from listing controller', () => {
    const { getAllByTestId } = renderWithProviders(<OriginalBusinessesListing />)
    expect(getAllByTestId('business-card')[0]).toHaveTextContent('Store A')
  })
})
