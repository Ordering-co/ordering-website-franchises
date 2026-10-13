import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessBasicInformation } from '../index'

vi.mock('../SearchComponent', () => ({
  SearchComponent: () => <div data-testid='search-component' />
}))
vi.mock('../BusinessInfoComponent', () => ({
  BusinessInfoComponent: ({ business }) => <div data-testid='business-info'>{business?.name}</div>
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useUtils: () => [{ optimizeImage: (url) => url, parseTime: (v) => String(v) }],
  useOrder: () => [{ options: { type: 1 } }, {}],
  useConfig: () => [{ configs: { preorder_status_enabled: { value: '0' } } }]
}))
vi.mock('~ui', () => ({
  useWindowSize: () => ({ width: 1200, height: 800 }),
  generalUtilities: () => ({ convertHoursToMinutes: (v) => v, getOrderStatus: () => 'pending' }),
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null),
  BusinessInformation: () => <div data-testid='business-information' />,
  BusinessReviews: () => <div data-testid='business-reviews' />,
  MomentContent: () => <div data-testid='moment-content' />,
  SearchProducts: () => <div data-testid='search-products' />,
  BusinessPreorder: () => <div data-testid='business-preorder' />
}))

describe('BusinessBasicInformation', () => {
  beforeEach(() => {
    window.scroll = vi.fn()
  })

  it('renders business info component with business name', () => {
    const { getByTestId } = renderWithProviders(
      <BusinessBasicInformation
        isSkeleton={false}
        businessState={{ business: { name: 'Demo Store', open: true, today: { enabled: true }, timezone: 'UTC' } }}
        openBusinessInformation={false}
        setOpenBusinessInformation={vi.fn()}
        categoryState={{ categories: [] }}
      />
    )
    expect(getByTestId('business-info')).toHaveTextContent('Demo Store')
  })
})
