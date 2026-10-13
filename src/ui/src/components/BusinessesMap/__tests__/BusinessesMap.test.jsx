import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessesMap } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~components', () => ({
  BusinessesMap: ({ UIComponent, ...rest }) => (
    <UIComponent
      userLocation={{ lat: 1, lng: 2 }}
      businessLocations={[{ id: 1, name: 'Map Store', open: true, enabled: true, delivery_price: 5, delivery_time: 30, pickup_time: 15, distance: 1, today: { enabled: true, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }] }, timezone: 'UTC' }]}
      onBusinessCustomClick={vi.fn()}
      {...rest}
    />
  ),
  GoogleMapsMap: () => <div data-testid='google-map' />,
  useLanguage: () => [{}, (_k, f) => f],
  useConfig: () => [{ configs: { google_maps_api_key: { value: 'key' }, meters_to_change_address: { value: '100' } } }],
  useOrder: () => [{ options: { type: 1 }, loading: false }, {}],
  useUtils: () => [{ parsePrice: (v) => `$${v}`, parseDistance: (v) => `${v} mi`, parseTime: (v) => String(v) }]
}))
vi.mock('~ui', () => ({
  generalUtilities: () => ({ convertHoursToMinutes: (v) => v }),
  Button: ({ children }) => <button type='button'>{children}</button>
}))

describe('BusinessesMap', () => {
  it('renders google map wrapper', () => {
    const { getByTestId } = renderWithProviders(<BusinessesMap />)
    expect(getByTestId('google-map')).toBeInTheDocument()
  })
})
