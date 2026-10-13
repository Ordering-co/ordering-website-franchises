import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { MultiCartsPaymethodsAndWallets } from '../index'

const uiPropsRef = { current: null }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  MultiCartsPaymethodsAndWallets: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymethodsAndWallets={{
        loading: false,
        paymethods: [{ id: 1, name: 'Cash', gateway: 'cash', enabled: true }]
      }}
      paymethodSelected={null}
      handleSelectPaymethod={vi.fn()}
      openCarts={[baseCartUIProps.cart]}
      cartGroup={{ carts: [baseCartUIProps.cart.uuid], result: { balance: 10 } }}
      walletsState={[]}
      balance={10}
      handleSelectWallet={vi.fn()}
      handlePaymethodDataChange={vi.fn()}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{ configs: {} }],
  useUtils: () => [{ parsePrice: (v) => `$${v}` }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  PaymentOptionStripe: () => null,
  StripeElementsForm: () => null,
  PaymentOptionEpayco: () => null,
  generalUtilities: () => ({ getIconCard: () => '' })
}))

describe('MultiCartsPaymethodsAndWallets', () => {
  it('renders available paymethods', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<MultiCartsPaymethodsAndWallets />)
    expect(getByText('Cash')).toBeInTheDocument()
  })
})
