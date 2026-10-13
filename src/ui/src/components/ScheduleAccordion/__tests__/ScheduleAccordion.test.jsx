import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { ScheduleAccordion } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f]
}))

describe('ScheduleAccordion', () => {
  it('renders schedule day label', () => {
    const { getByText } = renderWithProviders(
      <ScheduleAccordion
        weekIndex={1}
        schedule={{ enabled: true, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }] }}
        timeFormated={() => '09:00 AM'}
        isDisableAccordion={false}
      />
    )
    expect(getByText('Monday')).toBeInTheDocument()
  })
})
