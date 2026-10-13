import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import {
  momentDatesList,
  momentHoursList,
  momentTimeList
} from '../../../../../test/addressUiTestUtils'
import { MomentControl } from '../index'

const handleAsap = vi.fn()
const handleChangeDate = vi.fn()
const handleChangeTime = vi.fn()
const onCloseMoment = vi.fn()

const momentPropsRef = { current: {} }
const locationRef = { current: { pathname: '/home' } }
const configRef = {
  current: {
    max_days_preorder: { value: '6' },
    general_hour_format: { value: 'HH:mm' }
  }
}
const orderRef = { current: { loading: false, options: { type: 1 } } }

vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}))
vi.mock('react-calendar/dist/Calendar.css', () => ({}))
vi.mock('react-calendar', () => ({
  default: ({ onChange }) => (
    <button type='button' data-testid='custom-calendar' onClick={() => onChange(new Date(2026, 8, 8))}>
      custom-day
    </button>
  )
}))
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => locationRef.current
  }
})
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: (value) => {
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
}))
vi.mock('~components', () => ({
  MomentOption: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../test/addressUiTestUtils').baseMomentControlProps}
      handleAsap={handleAsap}
      handleChangeDate={handleChangeDate}
      handleChangeTime={handleChangeTime}
      onClose={onCloseMoment}
      {...rest}
      {...momentPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback ?? _key],
  useUtils: () => [{
    parseTime: (value, opts) => {
      if (value && typeof value.format === 'function') {
        return value.format(opts?.outputFormat || 'HH:mm')
      }
      return String(value ?? '')
    }
  }],
  useConfig: () => [{ configs: configRef.current }],
  useOrder: () => [orderRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  getMomentCalendarLocale: () => ({}),
  getTimes: () => require('../../../../../test/addressUiTestUtils').momentTimeList
}))

if (!Element.prototype.scroll) {
  Element.prototype.scroll = function () {}
}

const renderMoment = (overrides) => {
  momentPropsRef.current = overrides || {}
  return renderWithProviders(<MomentControl />)
}

describe('MomentControl', () => {
  beforeEach(() => {
    momentPropsRef.current = {}
    locationRef.current = { pathname: '/home' }
    configRef.current = {
      max_days_preorder: { value: '6' },
      general_hour_format: { value: 'HH:mm' }
    }
    orderRef.current = { loading: false, options: { type: 1 } }
    handleAsap.mockClear()
    handleChangeDate.mockClear()
    handleChangeTime.mockClear()
    onCloseMoment.mockClear()
  })

  it('renders delivering copy and continues from ASAP', () => {
    const { getByText } = renderMoment()
    expect(getByText('Delivering to')).toBeInTheDocument()
    expect(getByText('Date & time')).toBeInTheDocument()
    expect(getByText(/ASAP/)).toBeInTheDocument()
    fireEvent.click(getByText('Continue'))
    expect(onCloseMoment).toHaveBeenCalled()
  })

  it('schedules a later date and time', () => {
    const { getByText } = renderMoment({ isAsap: false })
    expect(getByText('10:00')).toBeInTheDocument()
    fireEvent.click(getByText('14:00'))
    expect(handleChangeTime).toHaveBeenCalledWith('14:00')
    fireEvent.click(getByText('08'))
    expect(handleChangeDate).toHaveBeenCalledWith('2026-09-08')
  })

  it('uses the custom layout and appoint mode', () => {
    const custom = renderMoment({
      isCustomLayout: true,
      isAsap: false,
      datesList: momentDatesList
    })
    fireEvent.click(custom.getByTestId('custom-calendar'))
    expect(handleChangeDate).toHaveBeenCalledWith('2026-09-08')
    expect(custom.queryByText('Delivering to')).toBeInTheDocument()
    custom.unmount()
    const appoint = renderMoment({ isAppoint: true, isAsap: false })
    expect(appoint.queryByText('Delivering to')).not.toBeInTheDocument()
    expect(appoint.getByText('10:00')).toBeInTheDocument()
  })

  it('shows closed copy and cart-only times', () => {
    const closed = renderMoment({
      isAsap: false,
      hoursList: [],
      business: null,
      timeSelected: null
    })
    expect(closed.getByText('There are no schedules for this date')).toBeInTheDocument()
    closed.unmount()

    const cart = renderMoment({
      isCart: true,
      isAsap: false,
      hoursList: momentHoursList,
      business: {}
    })
    expect(cart.queryByText('Delivering to')).not.toBeInTheDocument()
    expect(cart.queryByText('Continue')).not.toBeInTheDocument()
    expect(cart.getByText('10:00')).toBeInTheDocument()
  })

  it('filters catering hours and uses stored business schedules', () => {
    configRef.current = {
      max_days_preorder: { value: '6' },
      general_hour_format: { value: 'hh:mm' }
    }
    const catering = renderMoment({
      isAsap: true,
      cateringPreorder: true,
      dateSelected: '2026-12-15',
      preorderLeadTime: 0,
      preorderMinimumDays: 0,
      preorderMaximumDays: 6,
      hoursList: momentHoursList,
      business: { id: 1, name: 'Demo' },
      getActualSchedule: () => ({
        lapses: [{ open: { hour: 8, minute: 0 }, close: { hour: 22, minute: 0 } }]
      })
    })
    fireEvent.click(catering.getByText(/ASAP/))
    expect(handleAsap).toHaveBeenCalled()
    fireEvent.click(catering.getByText('Schedule for later'))
    expect(catering.getByText(/10:00/)).toBeInTheDocument()
    catering.unmount()

    locationRef.current = { pathname: '/store/demo' }
    window.localStorage.setItem('business_schedule', JSON.stringify({
      0: { enabled: true, lapses: [] },
      1: { enabled: true, lapses: [] },
      2: { enabled: true, lapses: [] },
      3: { enabled: true, lapses: [] },
      4: { enabled: true, lapses: [] },
      5: { enabled: true, lapses: [] },
      6: { enabled: true, lapses: [] }
    }))
    const scheduled = renderMoment({
      isAsap: false,
      isCart: true,
      business: { id: 1 }
    })
    expect(scheduled.getByText('10:00')).toBeInTheDocument()
  })
})
