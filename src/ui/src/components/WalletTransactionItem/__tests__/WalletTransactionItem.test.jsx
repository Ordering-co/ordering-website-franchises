import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { walletTransactionItem } from '../../../../../test/accountUiTestUtils'
import { WalletTransactionItem } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{
    parsePrice: (value) => `$${value}`,
    parseDate: (value) => value
  }]
}))

describe('WalletTransactionItem', () => {
  it('renders a positive cash transaction with description and code', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactionItem
        item={walletTransactionItem}
        idx={0}
        type='cash'
      />
    )
    expect(getByText('2026-01-01T12:00:00Z')).toBeInTheDocument()
    expect(getByText(/\+ \$10/)).toBeInTheDocument()
    expect(getByText(/Accumulation credit point by order 101/)).toBeInTheDocument()
    expect(getByText(/PROMO10/)).toBeInTheDocument()
  })

  it('renders a negative credit point movement without a price format', () => {
    const { getByText, queryByText } = renderWithProviders(
      <WalletTransactionItem
        item={{
          ...walletTransactionItem,
          amount: -5,
          event: 'manual',
          description: null,
          code: null
        }}
        idx={1}
        type='credit_point'
      />
    )
    expect(getByText('-5')).toBeInTheDocument()
    expect(queryByText('Code:')).not.toBeInTheDocument()
  })
})
