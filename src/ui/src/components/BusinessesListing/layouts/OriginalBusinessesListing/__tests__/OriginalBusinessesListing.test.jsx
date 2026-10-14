import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { OriginalBusinessesListing } from '../index'

const state = vi.hoisted(() => ({ options: { type: 1, address: { address: '123 Main', location: { lat: 1, lng: 2 } } }, maps: vi.fn(() => <div data-testid='map' />), changeCity: vi.fn(), configs: {} }))

vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2, 3]
}))
vi.mock('~components', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesList={{ loading: false, fetched: true, businesses: [{ id: 1, name: 'Store A', open: true, enabled: true, reviews: { total: 1 } }] }}
      paginationProps={{ currentPage: 1, totalPages: 1, nextPageItems: 0 }}
      handleBusinessClick={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: state.options, loading: false, carts: {} }, { changeCityFilter: state.changeCity }],
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useConfig: () => [{ configs: state.configs }],
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
    BusinessesMap: state.maps,
    SearchBar: () => null
  }
})

describe('OriginalBusinessesListing', () => {
  beforeEach(() => {
    state.options = { type: 1, address: { address: '123 Main', location: { lat: 1, lng: 2 } } }
    state.configs = {}
    vi.clearAllMocks()
  })
  it('shows the real controller list without address or Maps in a local catalogue and never auto-selects a store', () => {
    const existing = state.options
    state.options = { type: 1, moment: 'preserve', city_id: 77 }
    state.configs = { activate_single_store_automatically: { value: '1' } }
    state.maps.mockClear()
    const onBusinessClick = vi.fn()
    const { getByTestId, queryByTestId } = renderWithProviders(<OriginalBusinessesListing isLocalCatalogue initialOrderType={2} onBusinessClick={onBusinessClick} />)
    expect(getByTestId('business-card')).toHaveTextContent('Store A')
    expect(queryByTestId('map')).toBeNull()
    expect(state.maps).not.toHaveBeenCalled()
    expect(onBusinessClick).not.toHaveBeenCalled()
    expect(state.options).toEqual({ type: 1, moment: 'preserve', city_id: 77 })
    expect(state.changeCity).not.toHaveBeenCalled()
    state.options = existing
    state.configs = {}
  })

  it('renders business cards from listing controller', () => {
    const { getAllByTestId } = renderWithProviders(<OriginalBusinessesListing />)
    expect(getAllByTestId('business-card')[0]).toHaveTextContent('Store A')
  })
})
