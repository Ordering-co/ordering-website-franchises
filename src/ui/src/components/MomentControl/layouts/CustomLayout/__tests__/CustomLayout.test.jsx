import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../test/renderWithProviders'
import { momentDatesList, momentTimeList } from '../../../../../../../test/addressUiTestUtils'
import { CustomLayout } from '../index'

const handleChangeDate = vi.fn()
const handleChangeTime = vi.fn()

vi.mock('react-calendar/dist/Calendar.css', () => ({}))
vi.mock('react-calendar', () => ({
  default: (props) => {
    const date = new Date(2026, 8, 8)
    return (
      <div>
        <span data-testid='month-label'>{props.formatMonthYear?.('en', date)}</span>
        <span data-testid='weekday-label'>{props.formatShortWeekday?.('en', date)}</span>
        <span data-testid='day-label'>{props.formatDay?.('en', date)}</span>
        <button type='button' data-testid='calendar' onClick={() => props.onChange(date)}>
          pick-day
        </button>
      </div>
    )
  }
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{ configs: { max_days_preorder: { value: '6' } } }]
}))

describe('CustomLayout', () => {
  it('picks a calendar day and time', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CustomLayout
        datesList={momentDatesList}
        handleChangeDate={handleChangeDate}
        isEnabled
        timeList={momentTimeList}
        timeSelected='10:00'
        handleChangeTime={handleChangeTime}
      />
    )
    expect(getByTestId('month-label')).toHaveTextContent('September')
    expect(getByTestId('weekday-label')).toBeInTheDocument()
    expect(getByTestId('day-label')).toBeInTheDocument()
    fireEvent.click(getByText('pick-day'))
    expect(handleChangeDate).toHaveBeenCalledWith('2026-09-08')
    fireEvent.click(getByText('12:00'))
    expect(handleChangeTime).toHaveBeenCalledWith('12:00')
  })

  it('shows a closed message when no times exist', () => {
    const { getByText } = renderWithProviders(
      <CustomLayout
        datesList={[]}
        isEnabled={false}
        timeList={[]}
        handleChangeTime={handleChangeTime}
      />
    )
    expect(getByText('The business is closed at the moment')).toBeInTheDocument()
  })
})
