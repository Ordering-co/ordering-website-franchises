import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseSignupUIProps } from '../../../../../test/authTestUtils'
import { SignUpDriver } from '../index'

const signupPropsRef = { current: null }

vi.mock('~components', () => ({
  SignupForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...signupPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{ configs: {} }],
  ReCaptcha: () => null
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))

describe('SignUpDriver', () => {
  it('renders the driver sign up title', () => {
    signupPropsRef.current = { ...baseSignupUIProps, isDriverSignup: true }
    const { getByText } = renderWithProviders(<SignUpDriver />)
    expect(getByText('Sign up now')).toBeInTheDocument()
  })
})
