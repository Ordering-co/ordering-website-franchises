import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { stripePaymethods, stripeUser } from '../../../../../test/addressUiTestUtils'
import { StripeRedirectForm } from '../index'

const formStateRef = {
  current: {
    errors: {},
    formState: { isSubmitting: false }
  }
}
const handleSubmitPaymentMethod = vi.fn()

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (onSubmit) => (event) => {
      event?.preventDefault?.()
      onSubmit({ type: 'ideal', name: 'Jane Doe', email: 'jane@example.com' })
    },
    register: () => ({}),
    errors: formStateRef.current.errors,
    formState: formStateRef.current.formState
  })
}))
vi.mock('~components', () => ({
  StripeRedirectForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymethods={stripePaymethods}
      handleSubmitPaymentMethod={handleSubmitPaymentMethod}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ user: stripeUser }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('StripeRedirectForm', () => {
  it('renders fields and submits the selected method', () => {
    formStateRef.current = { errors: {}, formState: { isSubmitting: false } }
    const { getByText, getAllByText, getByPlaceholderText, container } = renderWithProviders(
      <StripeRedirectForm />
    )
    expect(getAllByText('Select a payment method').length).toBeGreaterThan(0)
    expect(getByText('Account holder')).toBeInTheDocument()
    expect(getByPlaceholderText('Type an Account holder')).toHaveAttribute('name', 'name')
    expect(getByPlaceholderText('Type an email')).toHaveAttribute('name', 'email')
    expect(container.querySelector('option[value="ideal"]')).toHaveTextContent('iDEAL')
    fireEvent.click(getByText('OK'))
    expect(handleSubmitPaymentMethod).toHaveBeenCalledWith({
      type: 'ideal',
      name: 'Jane Doe',
      email: 'jane@example.com'
    })
  })

  it('shows required field errors and a loading submit label', () => {
    formStateRef.current = {
      errors: {
        type: { type: 'required' },
        name: { type: 'required' },
        email: { type: 'required' }
      },
      formState: { isSubmitting: true }
    }
    const { getAllByText, getByText } = renderWithProviders(<StripeRedirectForm />)
    expect(getAllByText('This field is required')).toHaveLength(3)
    expect(getByText('Loading...')).toBeInTheDocument()
  })
})
