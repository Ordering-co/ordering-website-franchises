import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { MomentPopover } from '../index'

const configRef = { current: { max_days_preorder: { value: 6 }, dates_moment_format: { value: 'MMM D' } } }
const orderRef = { current: { options: { moment: null } } }

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {} }
  })
}))
vi.mock('~components', () => ({
  useConfig: () => [{ configs: configRef.current }],
  useOrder: () => [orderRef.current],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parseDate: (value) => `when-${value}` }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  MomentContent: () => <div data-testid='moment-content'>Moment</div>
}))

describe('MomentPopover', () => {
  it('shows ASAP and opens the popover content', () => {
    const onClick = vi.fn()
    configRef.current = { max_days_preorder: { value: 6 }, dates_moment_format: { value: 'MMM D' } }
    orderRef.current = { options: { moment: null } }
    const { getByText, getByTestId } = renderWithProviders(
      <MomentPopover open onClick={onClick} isHome />
    )
    expect(getByText('ASAP')).toBeInTheDocument()
    expect(getByTestId('moment-content')).toBeInTheDocument()
    fireEvent.click(getByText('ASAP'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows a scheduled moment and closes from outside or escape', () => {
    const onClose = vi.fn()
    orderRef.current = { options: { moment: '2026-09-08 10:00' } }
    const { getByText } = renderWithProviders(
      <MomentPopover open onClose={onClose} />
    )
    expect(getByText('when-2026-09-08 10:00')).toBeInTheDocument()
    fireEvent.mouseUp(document.body)
    expect(onClose).toHaveBeenCalled()
    fireEvent.keyDown(window, { keyCode: 27 })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('does not open when preorder days are disabled', () => {
    const onClick = vi.fn()
    configRef.current = { max_days_preorder: { value: 0 } }
    orderRef.current = { options: { moment: null } }
    const first = renderWithProviders(
      <MomentPopover open={false} onClick={onClick} />
    )
    fireEvent.click(first.getByText('ASAP'))
    expect(onClick).not.toHaveBeenCalled()
    first.unmount()
    configRef.current = { max_days_preorder: { value: -1 } }
    const again = renderWithProviders(
      <MomentPopover open={false} onClick={onClick} />
    )
    fireEvent.click(again.getByText('ASAP'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
