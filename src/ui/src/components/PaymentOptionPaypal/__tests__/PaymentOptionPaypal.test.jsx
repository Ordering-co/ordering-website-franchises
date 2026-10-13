import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PaymentOptionPaypal } from '../index'

const uiPropsRef = { current: null }
const PaypalButton = vi.hoisted(() => () => <div data-testid='paypal-button'>PayPal</div>)

vi.mock('~components', () => ({
  PaymentOptionPaypal: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSdkReady
      PaypalButton={PaypalButton}
      paypalButtonProps={{}}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useConfig: () => [{ configs: { stripe_currency: { value: 'USD' } } }],
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('PaymentOptionPaypal', () => {
  it('renders PayPal button when SDK is ready', () => {
    uiPropsRef.current = {}
    const { getByTestId } = renderWithProviders(<PaymentOptionPaypal />)
    expect(getByTestId('paypal-button')).toBeInTheDocument()
  })
})
