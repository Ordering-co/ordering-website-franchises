import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseForgotPasswordUIProps } from '../../../../../test/authTestUtils'
import { ForgotPasswordForm } from '../index'

const forgotPropsRef = { current: null }

vi.mock('~components', () => ({
  ForgotPasswordForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...forgotPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  ReCaptcha: () => <div data-testid='recaptcha' />
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('ForgotPasswordForm', () => {
  it('renders the recover password form', () => {
    forgotPropsRef.current = { ...baseForgotPasswordUIProps }
    const { getByPlaceholderText, getByText } = renderWithProviders(<ForgotPasswordForm />)
    expect(getByText('Forgot your password?')).toBeInTheDocument()
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
    expect(getByText('Recover Password')).toBeInTheDocument()
  })
})
