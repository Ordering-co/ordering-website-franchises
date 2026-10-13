import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../test/renderWithProviders'
import { baseWalletList } from '../../../../../../test/accountUiTestUtils'
import { Redeem } from '../index'

const emit = vi.fn()
const giftCardEnabledRef = { current: '0' }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('../../../GiftCard/GiftCardUI', () => ({
  GiftCardUI: () => <div data-testid='gift-card-ui' />
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{
    configs: {
      stripe_currency: { value: 'USD' },
      platform_store_giftcard_enabled: { value: giftCardEnabledRef.current }
    }
  }],
  useUtils: () => [{ parsePrice: (value) => `$${value}` }],
  useEvent: () => [{ emit }]
}))

describe('Redeem', () => {
  it('renders cash and points balances and opens the transaction list', () => {
    const { getByText } = renderWithProviders(
      <Redeem
        walletList={baseWalletList}
        isWalletCashEnabled
        isWalletPointsEnabled
      />
    )
    expect(getByText('SPECIAL MEMBER')).toBeInTheDocument()
    expect(getByText('120')).toBeInTheDocument()
    expect(getByText('Cash Wallet')).toBeInTheDocument()
    expect(getByText('$25.5 USD')).toBeInTheDocument()
    fireEvent.click(getByText('Transaction List'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'reward_transanctions'
    }))
  })

  it('shows a skeleton while wallets load', () => {
    const { getByTestId, queryByText } = renderWithProviders(
      <Redeem
        walletList={{ loading: true, wallets: [] }}
        isWalletCashEnabled
        isWalletPointsEnabled
      />
    )
    expect(getByTestId('skeleton')).toBeInTheDocument()
    expect(queryByText('SPECIAL MEMBER')).not.toBeInTheDocument()
  })

  it('renders gift cards when the platform store is enabled', () => {
    giftCardEnabledRef.current = '1'
    const { getByTestId } = renderWithProviders(
      <Redeem
        walletList={baseWalletList}
        isWalletCashEnabled={false}
        isWalletPointsEnabled={false}
      />
    )
    expect(getByTestId('gift-card-ui')).toBeInTheDocument()
    giftCardEnabledRef.current = '0'
  })
})
