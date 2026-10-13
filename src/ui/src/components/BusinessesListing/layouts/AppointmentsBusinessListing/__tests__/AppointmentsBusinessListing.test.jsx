import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { AppointmentsBusinessListing } from '../index'

vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2, 3]
}))
vi.mock('~components', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesList={{ loading: false, businesses: [{ id: 2, name: 'Appt Store', open: true, enabled: true }] }}
      paginationProps={{ currentPage: 1, totalPages: 1, nextPageItems: 0 }}
      handleBusinessClick={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 }, loading: false, carts: {} }, {}],
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useConfig: () => [{ configs: { max_days_preorder: { value: '7' }, order_types_allowed: { value: '1,2,3' } } }],
  useUtils: () => [{ parsePrice: (v) => '$' + v, parseDistance: (v) => v, parseTime: (v) => v, parseDate: () => 'Jan 1' }],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', () => ({
  MomentControl: () => null,
  HighestRated: () => null,
  SearchBar: () => null,
  BusinessPreorder: () => null,
  BusinessTypeFilter: () => <div data-testid='type-filter' />,
  priceList: [{ level: '1', content: '$' }],
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  Modal: () => null,
  AddressList: () => null,
  AddressForm: () => null,
  BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>,
  OrderTypeSelectorHeader: () => null
}))

describe('AppointmentsBusinessListing', () => {
  it('renders appointment business cards', () => {
    const { getByTestId } = renderWithProviders(<AppointmentsBusinessListing />)
    expect(getByTestId('business-card')).toHaveTextContent('Appt Store')
  })
})
