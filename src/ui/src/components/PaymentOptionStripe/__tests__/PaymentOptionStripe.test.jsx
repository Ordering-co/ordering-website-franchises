import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { basePaymentOptionProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptionStripe } from '../index'

const uiPropsRef = { current: null }
const sessionRef = { current: { token: 'token' } }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  PaymentOptionStripe: ({ UIComponent, ...rest }) => (
    <UIComponent
      cardsList={{ loading: false, cards: [{ id: 1, brand: 'visa', last4: '4242' }] }}
      gateway='stripe'
      handleCardClick={vi.fn()}
      handleNewCard={vi.fn()}
      deleteCard={vi.fn()}
      paymethodSelected={1}
      {...basePaymentOptionProps}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useSession: () => [sessionRef.current],
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useValidationFields: () => [{ fields: { card: { zipcode: { enabled: false, required: false } } } }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  StripeElementsForm: () => <div data-testid='stripe-elements-form' />,
  NotFoundSource: () => null,
  generalUtilities: () => ({ getIconCard: () => 'card.png' })
}))

describe('PaymentOptionStripe', () => {
  it('renders saved card row', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<PaymentOptionStripe />)
    expect(getByText(/4242/)).toBeInTheDocument()
  })

  it('shows login warning when token is missing', () => {
    sessionRef.current = { token: null }
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<PaymentOptionStripe />)
    expect(getByText(/you need to login to use this method/i)).toBeInTheDocument()
    sessionRef.current = { token: 'token' }
  })

  it('renders add new card action', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<PaymentOptionStripe />)
    expect(getByText('Add new card')).toBeInTheDocument()
  })
})
