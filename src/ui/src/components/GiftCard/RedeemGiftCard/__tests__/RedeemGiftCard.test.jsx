import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { redeemedGiftCard } from '../../../../../../test/giftCardUiTestUtils'
import { RedeemGiftCard } from '../index'

const redeemPropsRef = { current: null }
const handleApply = vi.fn()
const onClose = vi.fn()

vi.mock('~components', () => ({
  ...require('../../../../../../test/giftCardUiTestUtils').baseGiftCardHooks,
  RedeemGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../../test/giftCardUiTestUtils').baseRedeemGiftCardUIProps}
      handleApply={handleApply}
      onClose={onClose}
      {...rest}
      {...redeemPropsRef.current}
    />
  )
}))
vi.mock('~ui', () => ({
  ...require('../../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
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
}))

describe('RedeemGiftCard', () => {
  it('renders the redeem form and formats the code', () => {
    redeemPropsRef.current = null
    const { getByText, getByPlaceholderText } = renderWithProviders(<RedeemGiftCard />)
    expect(getByText('Redeem a gift card')).toBeInTheDocument()
    expect(getByText('Gift card code')).toBeInTheDocument()
    expect(getByText('Gift card password')).toBeInTheDocument()
    expect(getByText('Apply to your balance')).toBeInTheDocument()
    const codeInput = getByPlaceholderText('XXXX-XXXX-XXXX-XXXX')
    fireEvent.change(codeInput, { target: { value: 'abcd1234' } })
    expect(codeInput.value).toBe('ABCD-1234')
  })

  it('shows validation errors when the form is empty', async () => {
    redeemPropsRef.current = null
    const { getByText, getByTestId } = renderWithProviders(<RedeemGiftCard />)
    fireEvent.click(getByText('Apply to your balance'))
    await waitFor(() => {
      expect(getByTestId('alert')).toHaveTextContent('Code is required')
    })
    expect(getByTestId('alert')).toHaveTextContent('Password is required')
  })

  it('submits code and password to handleApply', async () => {
    redeemPropsRef.current = null
    const { getByText, getByPlaceholderText, container } = renderWithProviders(<RedeemGiftCard />)
    fireEvent.change(getByPlaceholderText('XXXX-XXXX-XXXX-XXXX'), {
      target: { value: 'abcd1234efgh5678' }
    })
    fireEvent.change(container.querySelector('input[name="password"]'), {
      target: { value: 'secret' }
    })
    fireEvent.click(getByText('Apply to your balance'))
    await waitFor(() => {
      expect(handleApply).toHaveBeenCalled()
    })
    expect(handleApply.mock.calls[0][0]).toEqual(expect.objectContaining({
      password: 'secret'
    }))
  })

  it('shows a loading label and action errors', async () => {
    redeemPropsRef.current = {
      actionState: { loading: true, error: ['Invalid code'] }
    }
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(<RedeemGiftCard />)
    expect(getByText('Loading')).toBeInTheDocument()
    await waitFor(() => {
      expect(getByTestId('alert')).toHaveTextContent('Invalid code')
    })
    fireEvent.click(getByText('Accept'))
    expect(queryByTestId('alert')).not.toBeInTheDocument()
    expect(getByText('Loading')).toBeInTheDocument()
    redeemPropsRef.current = null
  })

  it('renders redeemed card details and closes', () => {
    redeemPropsRef.current = {
      redeemedGiftCard
    }
    const { getByText } = renderWithProviders(<RedeemGiftCard onClose={onClose} />)
    expect(getByText('Gift card')).toBeInTheDocument()
    expect(getByText(/Type: digital/)).toBeInTheDocument()
    expect(getByText(/Amount: \$25/)).toBeInTheDocument()
    expect(getByText(/From: Jane Doe/)).toBeInTheDocument()
    expect(getByText(/Title: Happy birthday/)).toBeInTheDocument()
    expect(getByText(/Messages: Enjoy your meal/)).toBeInTheDocument()
    fireEvent.click(getByText('Ok'))
    expect(onClose).toHaveBeenCalled()
    redeemPropsRef.current = null
  })
})
