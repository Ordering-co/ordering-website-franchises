import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CardForm } from '../index'

const uiPropsRef = { current: null }

vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div data-testid='card-element' />,
  CardNumberElement: () => <div data-testid='card-number' />,
  CardExpiryElement: () => <div data-testid='card-expiry' />,
  CardCvcElement: () => <div data-testid='card-cvc' />
}))
vi.mock('~components', () => ({
  CardForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      error={null}
      errorExpiry={null}
      errorCvc={null}
      loading={false}
      handleSubmit={(e) => e?.preventDefault?.()}
      handleChange={vi.fn()}
      isSplitForm
      handleChangeExpiry={vi.fn()}
      handleChangeCvc={vi.fn()}
      errorZipcode={null}
      {...rest}
      {...uiPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useValidationFields: () => [{ fields: { card: { zipcode: { enabled: false, required: false } } } }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('CardForm', () => {
  it('renders split card form fields', () => {
    uiPropsRef.current = {}
    const { getByText, getByTestId } = renderWithProviders(<CardForm />)
    expect(getByTestId('card-number')).toBeInTheDocument()
    expect(getByText('Save')).toBeInTheDocument()
  })
})
