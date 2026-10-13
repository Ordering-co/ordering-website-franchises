import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { ActionsSection } from './ActionsSection'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('@meronex/icons/ai/AiFillExclamationCircle', () => ({ default: () => <span>exclaim</span> }))
vi.mock('@meronex/icons/bs/BsPhone', () => ({ default: () => <span>phone</span> }))
vi.mock('@meronex/icons/bi/BiMessageRounded', () => ({ default: () => <span>message</span> }))

describe('ActionsSection', () => {
  it('opens business messages and clears unread', () => {
    window.scrollTo = () => {}
    const setOpenMessages = vi.fn()
    const readMessages = vi.fn()
    const setUnreadAlert = vi.fn()
    const { getByText } = renderWithProviders(
      <ActionsSection
        actionType='business'
        order={{ business: { phone: '555' }, unread_count: 2 }}
        unreadAlert={{ business: true }}
        setOpenMessages={setOpenMessages}
        readMessages={readMessages}
        setUnreadAlert={setUnreadAlert}
        showPhone
        showMessages
      />
    )
    expect(getByText('phone')).toBeInTheDocument()
    fireEvent.click(getByText('message'))
    expect(setOpenMessages).toHaveBeenCalledWith({ driver: false, business: true })
    expect(readMessages).toHaveBeenCalled()
    expect(setUnreadAlert).toHaveBeenCalled()
  })
})
