import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { stripeCart, stripeCartGroup } from '../../../../../test/addressUiTestUtils'
import { StripeElementsForm } from '../index'

const formPropsRef = { current: {} }

vi.mock('@stripe/stripe-js/pure', () => ({
  loadStripe: vi.fn(() => Promise.resolve({}))
}))
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid='stripe-elements'>{children}</div>
}))
vi.mock('~components', () => ({
  StripeElementsForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...formPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  CardForm: () => <div data-testid='card-form'>Card form</div>,
  StripeMethodForm: ({ paymethod }) => (
    <div data-testid='stripe-method-form'>{paymethod}</div>
  )
}))

describe('StripeElementsForm', () => {
  it('shows an error when the public key is missing', () => {
    formPropsRef.current = {}
    const { getByText } = renderWithProviders(<StripeElementsForm />)
    expect(getByText('Something is wrong!')).toBeInTheDocument()
  })

  it('renders a wallet method form when the paymethod is supported', () => {
    formPropsRef.current = {
      publicKey: 'pk_test',
      methodsPay: ['google_pay', 'apple_pay'],
      paymethod: 'google_pay',
      cart: stripeCart,
      cartGroup: stripeCartGroup
    }
    const { getByTestId } = renderWithProviders(<StripeElementsForm />)
    expect(getByTestId('stripe-elements')).toBeInTheDocument()
    expect(getByTestId('stripe-method-form')).toHaveTextContent('google_pay')
  })

  it('renders the card form for other methods', () => {
    formPropsRef.current = {
      publicKey: 'pk_test',
      methodsPay: ['google_pay'],
      paymethod: 'stripe',
      cart: stripeCart
    }
    const { getByTestId } = renderWithProviders(<StripeElementsForm />)
    expect(getByTestId('card-form')).toBeInTheDocument()
  })
})
