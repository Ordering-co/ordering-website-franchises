import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { BusinessPreorder } from '../index'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ pathname: '/store/demo' })
  }
})
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { type: 1 } }, { changeMoment: vi.fn() }],
  useUtils: () => [{ optimizeImage: (url) => url, parseTime: (v) => String(v), parseDate: () => 'Jan 1' }],
  useConfig: () => [{ configs: { max_days_preorder: { value: '7' } } }],
  MomentOption: ({ UIComponent, business, ...rest }) => (
    <UIComponent
      business={business}
      datesList={[{ date: '2024-01-01', day: 'Mon', dayNumber: 1 }]}
      dateSelected='2024-01-01'
      timeSelected='12:00'
      hoursList={[]}
      getActualSchedule={() => ({ enabled: true, lapses: [] })}
      handleChangeDate={vi.fn()}
      handleChangeTime={vi.fn()}
      showButton
      isAsap={false}
      handleAsap={vi.fn()}
      {...rest}
    />
  )
}))
vi.mock('~ui', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>,
  Select: ({ options }) => <div data-testid='select'>{options?.length || 0}</div>,
  useWindowSize: () => ({ width: 1200, height: 800 }),
  SpinnerLoader: () => null,
  getTimes: () => ['12:00'],
  BusinessMenuList: () => null
}))

const defaultSchedule = Object.fromEntries(
  Array.from({ length: 7 }, (_, day) => [String(day), { enabled: true, lapses: [] }])
)

describe('BusinessPreorder', () => {
  it('renders preorder flow for a business', () => {
    const { getByText } = renderWithProviders(
      <BusinessPreorder
        business={{ id: 1, name: 'Demo Store', logo: 'logo.png', schedule: defaultSchedule, timezone: 'UTC' }}
        handleClick={vi.fn()}
        showButton
      />
    )
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
