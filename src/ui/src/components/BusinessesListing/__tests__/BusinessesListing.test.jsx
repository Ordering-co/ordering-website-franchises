import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessesListing } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1, address: { address: '123 Main', location: { lat: 1, lng: 2 } } }, loading: false }, {}],
  useSession: () => [{ auth: false, user: null }, { login: vi.fn() }],
  useConfig: () => [{ configs: {} }],
  useUtils: () => [{ parsePrice: (v) => '$' + v, parseDistance: (v) => v, parseTime: (v) => v, parseDate: () => 'Jan 1' }],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('../layouts/OriginalBusinessesListing', () => ({
  OriginalBusinessesListing: () => <div data-testid='original-listing' />
}))
vi.mock('../layouts/AppointmentsBusinessListing', () => ({
  AppointmentsBusinessListing: () => <div data-testid='appointments-listing' />
}))

describe('BusinessesListing', () => {
  it('renders smoke test', () => {
    const { getByTestId } = renderWithProviders(<BusinessesListing />)
    expect(getByTestId('original-listing')).toBeInTheDocument()
  })
})
