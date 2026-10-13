import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps, basePaymentOptionProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptions } from '../index'

const uiPropsRef = { current: null }

const paymethodFixture = { id: 1, name: 'Cash', gateway: 'cash' }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  PaymentOptions: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={{ ...baseCartUIProps.cart, balance: 20 }}
      paymethodsList={{ loading: false, paymethods: [paymethodFixture, { id: 2, name: 'Card', gateway: 'stripe' }] }}
      paymethodSelected={paymethodFixture}
      paymethodData={{}}
      isOpenMethod={{}}
      handlePaymethodClick={vi.fn()}
      handlePaymethodDataChange={vi.fn()}
      isLoading={false}
      isDisabled={false}
      errorCash={false}
      setErrorCash={vi.fn()}
      requiredFields={[]}
      {...basePaymentOptionProps}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ token: 'token', user: { id: 1 } }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  PaymentOptionCash: () => <div data-testid='payment-cash'>Cash</div>,
  PaymentOptionStripe: () => <div data-testid='payment-stripe'>Stripe</div>,
  PaymentOptionCard: () => <div data-testid='payment-card'>Card</div>,
  PaymentOptionPaypal: () => null,
  PaymentOptionSquare: () => null,
  PaymentOptionEpayco: () => null,
  StripeElementsForm: () => null,
  StripeRedirectForm: () => null,
  NotFoundSource: () => null,
  generalUtilities: () => ({ getIconCard: () => '' }),
  capitalize: (v) => v
}))

describe('PaymentOptions', () => {
  it('renders payment methods list', () => {
    uiPropsRef.current = {}
    const { getAllByText, getByText } = renderWithProviders(<PaymentOptions businessId={1} />)
    expect(getAllByText('Cash').length).toBeGreaterThan(0)
    expect(getByText('Card')).toBeInTheDocument()
  })

  it('renders loading skeleton when paymethods are loading', () => {
    uiPropsRef.current = {
      paymethodsList: { loading: true, paymethods: [] }
    }
    const { getAllByTestId } = renderWithProviders(<PaymentOptions businessId={1} />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('shows cash payment panel when cash is selected', () => {
    uiPropsRef.current = {
      paymethodSelected: { id: 1, name: 'Cash', gateway: 'cash' }
    }
    const { getByTestId } = renderWithProviders(<PaymentOptions businessId={1} />)
    expect(getByTestId('payment-cash')).toBeInTheDocument()
  })
})
