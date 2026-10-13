import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptionWallet } from '../index'

const uiPropsRef = { current: null }

const walletFixture = {
  id: 1,
  type: 'cash',
  balance: 25,
  valid: true,
  redemption_rate: 1
}

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  PaymentOptionWallet: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={{ ...baseCartUIProps.cart, wallets: [] }}
      walletsState={{ loading: false, error: null, result: [walletFixture] }}
      businessConfigs={[
        { key: 'wallet_cash_enabled', value: '1' },
        { key: 'wallet_credit_point_enabled', value: '1' }
      ]}
      selectWallet={vi.fn()}
      deletetWalletSelected={vi.fn()}
      setErrorState={vi.fn()}
      errorState={null}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{
    configs: {
      wallet_cash_enabled: { value: '1' },
      wallet_credit_point_enabled: { value: '1' }
    }
  }],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('PaymentOptionWallet', () => {
  it('renders wallet payment option', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<PaymentOptionWallet />)
    expect(getByText('Pay with Wallet credits')).toBeInTheDocument()
  })
})
