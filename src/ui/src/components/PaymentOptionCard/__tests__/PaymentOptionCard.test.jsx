import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { basePaymentOptionProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptionCard } from '../index'

const uiPropsRef = { current: null }

vi.mock('~components', () => ({
  PaymentOptionStripe: ({ UIComponent, ...rest }) => (
    <UIComponent
      cardsList={{ loading: false, cards: [] }}
      gateway='credomatic'
      handleNewCard={vi.fn()}
      paymethodSelected={{ paymethod: { gateway: 'credomatic' } }}
      token='test-token'
      paymethodsWithoutSaveCards={[]}
      setOpenModal={vi.fn()}
      {...basePaymentOptionProps}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ token: 'test-token' }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  PaymentOptionStripeUI: () => <div data-testid='stripe-ui'>Stripe UI</div>,
  CardFormCustom: () => <div data-testid='card-form-custom' />
}))

describe('PaymentOptionCard', () => {
  it('renders card payment shell', () => {
    uiPropsRef.current = {}
    const { getByTestId } = renderWithProviders(<PaymentOptionCard />)
    expect(getByTestId('stripe-ui')).toBeInTheDocument()
  })
})
