import { describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { GiftCardOrdersList } from '../index'

const emptyLayoutsRef = { current: false }

vi.mock('../../VerticalGiftCardOrdersLayout', () => {
  const React = require('react')
  return {
    VerticalGiftCardOrdersLayout: ({ title, defaultStatus, setIsEmpty, scrollId }) => {
      React.useEffect(() => {
        if (emptyLayoutsRef.current) setIsEmpty(true)
      }, [setIsEmpty])
      return (
        <div data-testid={`gift-layout-${defaultStatus}`} data-scroll-id={scrollId}>
          {title}
        </div>
      )
    }
  }
})
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('GiftCardOrdersList', () => {
  it('renders pending, sent, and redeemed layouts', () => {
    emptyLayoutsRef.current = false
    const { getByTestId, getByText, queryByText } = renderWithProviders(<GiftCardOrdersList />)
    expect(getByTestId('gift-layout-pending')).toHaveAttribute('data-scroll-id', 'pendingGifts')
    expect(getByTestId('gift-layout-sent')).toHaveAttribute('data-scroll-id', 'sentGifts')
    expect(getByTestId('gift-layout-activated')).toHaveAttribute('data-scroll-id', 'redeemedgGifts')
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Sent')).toBeInTheDocument()
    expect(getByText('Redeemed')).toBeInTheDocument()
    expect(queryByText('You don\'t have cards')).not.toBeInTheDocument()
  })

  it('shows empty copy when all layouts report empty', async () => {
    emptyLayoutsRef.current = true
    const { getByText } = renderWithProviders(<GiftCardOrdersList />)
    await waitFor(() => {
      expect(getByText('You don\'t have cards')).toBeInTheDocument()
    })
    emptyLayoutsRef.current = false
  })
})
