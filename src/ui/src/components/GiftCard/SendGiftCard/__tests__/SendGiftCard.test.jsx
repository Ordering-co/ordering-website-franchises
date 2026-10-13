import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { SendGiftCard } from '../index'

const sendPropsRef = { current: null }
const handleSendGiftCard = vi.fn()

vi.mock('~components', () => ({
  ...require('../../../../../../test/giftCardUiTestUtils').baseGiftCardHooks,
  SendGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../../test/giftCardUiTestUtils').baseSendGiftCardUIProps}
      handleSendGiftCard={handleSendGiftCard}
      {...rest}
      {...sendPropsRef.current}
    />
  )
}))
vi.mock('~ui', () => {
  const React = require('react')
  return {
    ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
    generalUtilities: () => ({ handleGoToPage: () => {} }),
    TextArea: React.forwardRef((props, ref) => React.createElement('textarea', { ...props, ref })),
    Alert: ({ open, title, content, onClose, onAccept, acceptText }) => (
      open
        ? (
          <div data-testid='alert'>
            <span>{title}</span>
            <span>{Array.isArray(content) ? content.join(' ') : content}</span>
            <button type='button' onClick={onAccept || onClose}>{acceptText || 'Accept'}</button>
          </div>
          )
        : null
    )
  }
})

describe('SendGiftCard', () => {
  it('renders gift card details fields', () => {
    sendPropsRef.current = null
    const { getByText, getByPlaceholderText } = renderWithProviders(<SendGiftCard />)
    expect(getByText('Gift Card details')).toBeInTheDocument()
    expect(getByText('To')).toBeInTheDocument()
    expect(getByPlaceholderText('Enter an email')).toBeInTheDocument()
    expect(getByPlaceholderText('Write a name')).toBeInTheDocument()
    expect(getByPlaceholderText('Title')).toBeInTheDocument()
    expect(getByPlaceholderText('Type your message here')).toBeInTheDocument()
    expect(getByText('Send gift card')).toBeInTheDocument()
  })

  it('shows a validation alert when email is missing', async () => {
    sendPropsRef.current = null
    const { getByText, getByTestId } = renderWithProviders(<SendGiftCard />)
    fireEvent.click(getByText('Send gift card'))
    await waitFor(() => {
      expect(getByTestId('alert')).toHaveTextContent('To email is required')
    })
  })

  it('submits the gift card details', async () => {
    sendPropsRef.current = null
    const { getByText, getByPlaceholderText } = renderWithProviders(<SendGiftCard />)
    fireEvent.change(getByPlaceholderText('Enter an email'), {
      target: { value: 'jane@example.com' }
    })
    fireEvent.change(getByPlaceholderText('Write a name'), {
      target: { value: 'Jane' }
    })
    fireEvent.change(getByPlaceholderText('Title'), {
      target: { value: 'Congrats' }
    })
    fireEvent.change(getByPlaceholderText('Type your message here'), {
      target: { value: 'Enjoy' }
    })
    fireEvent.click(getByText('Send gift card'))
    await waitFor(() => {
      expect(handleSendGiftCard).toHaveBeenCalledWith(expect.objectContaining({
        email: 'jane@example.com',
        user_name: 'Jane',
        title: 'Congrats',
        message: 'Enjoy'
      }))
    })
  })

  it('shows a loading label while sending', () => {
    sendPropsRef.current = {
      actionState: { loading: true }
    }
    const { getByText } = renderWithProviders(<SendGiftCard />)
    expect(getByText('Loading')).toBeInTheDocument()
    expect(getByText('Loading')).toBeDisabled()
    sendPropsRef.current = null
  })
})
