import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseLevelList, baseLoyaltyLevel, baseWalletList } from '../../../../../test/accountUiTestUtils'
import { Wallets } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('../../GiftCard/GiftCardUI', () => ({
  GiftCardUI: () => <div data-testid='gift-card-ui' />
}))
vi.mock('~components', () => ({
  WalletList: ({ UIComponent, ...rest }) => (
    <UIComponent
      walletList={baseWalletList}
      userLoyaltyLevel={baseLoyaltyLevel}
      levelList={baseLevelList}
      transactionsList={{ loading: false }}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{
    configs: {
      wallet_cash_enabled: { value: '1' },
      wallet_credit_point_enabled: { value: '1' },
      stripe_currency: { value: 'USD' },
      platform_store_giftcard_enabled: { value: '0' }
    }
  }],
  useUtils: () => [{ parsePrice: (value) => `$${value}` }],
  useEvent: () => [{ emit: vi.fn() }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  Promotions: () => <div data-testid='promotions'>Offers list</div>
}))

describe('Wallets', () => {
  it('renders the redeem tab by default', () => {
    const { getByText } = renderWithProviders(<Wallets />)
    expect(getByText('Redeem')).toBeInTheDocument()
    expect(getByText('My Status')).toBeInTheDocument()
    expect(getByText('Offers')).toBeInTheDocument()
    expect(getByText('SPECIAL MEMBER')).toBeInTheDocument()
  })

  it('switches to status and offers tabs', () => {
    const { getByText, getByTestId } = renderWithProviders(<Wallets />)
    fireEvent.click(getByText('My Status'))
    expect(getByText('Gold')).toBeInTheDocument()
    fireEvent.click(getByText('Offers'))
    expect(getByTestId('promotions')).toBeInTheDocument()
  })
})
