import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseSignupUIProps } from '../../../../../test/authTestUtils'
import { SignUpBusiness } from '../index'

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

describe('SignUpBusiness', () => {
  it('renders the business sign up title', () => {
    signupPropsRef.current = { ...baseSignupUIProps }
    const { getByText } = renderWithProviders(<SignUpBusiness />)
    expect(getByText('Sign up now')).toBeInTheDocument()
  })
})
