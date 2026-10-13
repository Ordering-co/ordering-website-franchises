import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { basePaymentOptionProps } from '../../../../../test/cartUiTestUtils'
import { PaymentOptionSquare } from '../index'

const uiPropsRef = { current: null }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  PaymentOptionSquare: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymentMethods={[{ name: 'Card', value: 'card_payments' }]}
      methodSelected='card_payments'
      handleChangeMethodSelected={vi.fn()}
      isLoading={false}
      isLoadingMethod={false}
      isLoadingPlace={false}
      alertState={{ open: false, content: [] }}
      setAlertState={vi.fn()}
      {...basePaymentOptionProps}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('PaymentOptionSquare', () => {
  it('renders square card payment container', () => {
    uiPropsRef.current = {}
    const { getByText } = renderWithProviders(<PaymentOptionSquare />)
    expect(getByText('Card')).toBeInTheDocument()
    expect(document.getElementById('card-container')).toBeInTheDocument()
  })
})
