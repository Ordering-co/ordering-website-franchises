import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import {
  activatedGiftCard,
  giftCardThemeOverrides,
  pendingGiftCard,
  sentGiftCard
} from '../../../../../../test/giftCardUiTestUtils'
import { SingleGiftCard } from '../index'

const emit = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value,
    optimizeImage: (value) => value
  }],
  useEvent: () => [{ emit }]
}))

const renderCard = (props) => renderWithProviders(
  <SingleGiftCard {...props} />,
  { themeOverrides: giftCardThemeOverrides }
)

describe('SingleGiftCard', () => {
  it('renders a pending card and opens the order detail', () => {
    const { getByText } = renderCard({ card: pendingGiftCard })
    expect(getByText('Gift Card $25')).toBeInTheDocument()
    expect(getByText('$25')).toBeInTheDocument()
    expect(getByText('2026-01-01T12:00:00Z')).toBeInTheDocument()
    expect(getByText('Pending')).toBeInTheDocument()
    fireEvent.click(getByText('Gift Card $25'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 101 }
    })
  })

  it('maps sent and redeemed statuses', () => {
    const sent = renderCard({ card: sentGiftCard })
    expect(sent.getByText('Sent')).toBeInTheDocument()
    sent.unmount()
    const activated = renderCard({ card: activatedGiftCard })
    expect(activated.getByText('Redeemed')).toBeInTheDocument()
    expect(activated.getByText('Gift Card $100')).toBeInTheDocument()
  })

  it('falls back to the raw status when it is unknown', () => {
    const { getByText } = renderCard({
      card: {
        ...pendingGiftCard,
        status: 'expired'
      }
    })
    expect(getByText('expired')).toBeInTheDocument()
  })

  it('renders skeletons when the card is a placeholder', () => {
    const { getAllByTestId, queryByText } = renderCard({ isSkeleton: true })
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
    expect(queryByText('Pending')).not.toBeInTheDocument()
  })
})
