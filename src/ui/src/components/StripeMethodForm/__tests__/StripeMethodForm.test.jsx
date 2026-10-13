import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { stripeCart, stripeCartGroup } from '../../../../../test/addressUiTestUtils'
import { StripeMethodForm } from '../index'

const methodPropsRef = { current: {} }
const handleSource = vi.fn()
const handleCancel = vi.fn()
let paymentRequestApi

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({
    paymentRequest: (options) => {
      paymentRequestApi.lastOptions = options
      return paymentRequestApi
    }
  }),
  PaymentRequestButtonElement: () => <div data-testid='payment-request-button' />
}))
vi.mock('~components', () => ({
  CardForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleSource={handleSource}
      handleCancel={handleCancel}
      cart={stripeCart}
      paymethod='apple_pay'
      {...rest}
      {...methodPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{ configs: { stripe_currency: { value: 'USD' } } }]
}))

describe('StripeMethodForm', () => {
  beforeEach(() => {
    handleSource.mockClear()
    handleCancel.mockClear()
    paymentRequestApi = {
      canMakePayment: vi.fn().mockResolvedValue({ applePay: true }),
      on: vi.fn()
    }
    methodPropsRef.current = {}
  })

  it('renders the payment request button when the method is available', async () => {
    const { getByTestId } = renderWithProviders(<StripeMethodForm />)
    await waitFor(() => {
      expect(getByTestId('payment-request-button')).toBeInTheDocument()
    })
    expect(paymentRequestApi.lastOptions.currency).toBe('usd')
    expect(paymentRequestApi.lastOptions.total.label).toBe('Demo Store')
  })

  it('shows apple pay unavailable when the wallet cannot pay', async () => {
    paymentRequestApi.canMakePayment.mockResolvedValue(null)
    const { getByText } = renderWithProviders(<StripeMethodForm />)
    await waitFor(() => {
      expect(getByText('Apple pay unavailable')).toBeInTheDocument()
    })
  })

  it('shows google pay unavailable and completes a grouped payment', async () => {
    let onPayment
    paymentRequestApi = {
      canMakePayment: vi.fn().mockResolvedValue({ googlePay: true }),
      on: vi.fn((event, cb) => {
        if (event === 'paymentmethod') onPayment = cb
      })
    }
    methodPropsRef.current = {
      paymethod: 'google_pay',
      cartGroup: stripeCartGroup,
      cart: stripeCart
    }
    const { getByTestId } = renderWithProviders(<StripeMethodForm />)
    await waitFor(() => {
      expect(getByTestId('payment-request-button')).toBeInTheDocument()
    })
    const complete = vi.fn()
    onPayment({
      complete,
      paymentMethod: {
        id: 'pm_1',
        type: 'card',
        card: { brand: 'visa', last4: '4242' }
      }
    })
    expect(complete).toHaveBeenCalledWith('success')
    expect(handleCancel).toHaveBeenCalled()
    expect(handleSource).toHaveBeenCalled()
    expect(JSON.parse(handleSource.mock.calls[0][0]).id).toBe('pm_1')
  })
})
