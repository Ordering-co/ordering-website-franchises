import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessInformation } from '../index'

vi.mock('~components', () => ({
  BusinessInformation: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={{ name: 'Demo Store', address: '123 Main', open: true, today: { enabled: true }, timezone: 'UTC' }}
      businessLocation={{ lat: 1, lng: 2 }}
      businessSchedule={[]}
      businessPhotos={[]}
      businessVideos={[]}
      onClose={vi.fn()}
      {...rest}
    />
  ),
  GoogleMapsMap: () => <div data-testid='google-map' />,
  useLanguage: () => [{}, (_k, f) => f],
  useConfig: () => [{ configs: { google_maps_api_key: { value: 'key' } } }]
}))
vi.mock('~ui', () => ({
  formatUrlVideo: (url) => url,
  generalUtilities: () => ({ convertHoursToMinutes: (v) => v }),
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null),
  ScheduleAccordion: () => <div data-testid='schedule' />
}))

describe('BusinessInformation', () => {
  it('renders business information content', () => {
    const { getByText } = renderWithProviders(<BusinessInformation businessId={1} />)
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
