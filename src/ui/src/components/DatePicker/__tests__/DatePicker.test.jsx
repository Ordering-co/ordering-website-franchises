import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { DatePickerUI } from '../index'

const onChange = vi.fn()

vi.mock('react-date-range/dist/styles.css', () => ({}))
vi.mock('react-date-range/dist/theme/default.css', () => ({}))
vi.mock('react-date-range', () => ({
  Calendar: ({ onChange: onPick, date, name }) => (
    <button
      type='button'
      data-testid='date-picker'
      data-name={name}
      onClick={() => onPick(new Date('2020-01-15'))}
    >
      {date ? 'has-date' : 'no-date'}
    </button>
  )
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  getDatePickerLocale: () => ({ code: 'en' })
}))

describe('DatePicker', () => {
  it('renders the calendar and forwards a date change', () => {
    const { getByTestId } = renderWithProviders(
      <DatePickerUI value={new Date('2020-01-01')} onChange={onChange} />
    )
    expect(getByTestId('date-picker')).toHaveAttribute('data-name', 'date')
    expect(getByTestId('date-picker')).toHaveTextContent('has-date')
    fireEvent.click(getByTestId('date-picker'))
    expect(onChange).toHaveBeenCalled()
  })
})
