import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseSignupUIProps } from '../../../../../test/authTestUtils'
import { SignUpForm } from '../index'

const { signupPropsRef, configTuple } = vi.hoisted(() => ({
  signupPropsRef: { current: null },
  configTuple: [{ configs: {} }]
}))

const setSocialLoginConfigs = ({ facebookFlag, googleFlag, includeGoogleCredentials = true }) => {
  const configs = {
    business_signup_allow: { value: '1' },
    driver_signup_allow: { value: '0' },
    terms_and_conditions: { value: 'true' },
    facebook_id: { value: 'facebook-id' },
    apple_login_enabled: { value: '0', enabled: true }
  }

  if (includeGoogleCredentials) {
    Object.assign(configs, {
      google_login_client_id: { value: 'google-id' },
      google_login_auth_domain: { value: 'google.example.com' },
      google_login_api_key: { value: 'google-api-key' }
    })
  }
  if (facebookFlag !== undefined) configs.facebook_login_enabled = facebookFlag
  if (googleFlag !== undefined) configs.google_login_enabled = googleFlag

  configTuple[0].configs = configs
}

vi.mock('~components', () => ({
  SignupForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...signupPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => configTuple,
  useSession: () => [{ auth: false }, { login: vi.fn() }],
  useToast: () => [null, { showToast: vi.fn() }],
  ToastType: { Error: 'error', Success: 'success' },
  ReCaptcha: () => null,
  useEvent: () => [{ emit: vi.fn() }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('react-phone-number-input', () => ({
  formatPhoneNumber: (value) => value || ''
}))
vi.mock('libphonenumber-js', () => ({
  default: () => null
}))
vi.mock('react-otp-input', () => ({
  default: () => <input data-testid='otp-input' />
}))
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (onSubmit) => (event) => {
      event?.preventDefault?.()
      onSubmit({})
    },
    register: () => ({}),
    formState: { errors: {} }
  })
}))

describe('SignUpForm', () => {
  afterEach(() => {
    signupPropsRef.current = null
    setSocialLoginConfigs({
      facebookFlag: { value: '0' },
      googleFlag: { value: '0' }
    })
  })

  it('renders the default sign up form', () => {
    signupPropsRef.current = { ...baseSignupUIProps }
    const { getAllByText } = renderWithProviders(<SignUpForm />)
    expect(getAllByText('Sign up').length).toBeGreaterThan(0)
  })

  it.each([
    ['0', '0', false, false],
    ['0', '1', false, true],
    ['1', '0', true, false],
    ['1', '1', true, true]
  ])("gates Facebook and Google independently for flags %s/%s", (facebookValue, googleValue, showFacebook, showGoogle) => {
    setSocialLoginConfigs({
      facebookFlag: { value: facebookValue },
      googleFlag: { value: googleValue }
    })
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(Boolean(queryByText('fb'))).toBe(showFacebook)
    expect(Boolean(queryByText('google'))).toBe(showGoogle)
    expect(queryByText('apple')).not.toBeInTheDocument()
  })

  it.each([
    ['reduced zero', { value: '0' }],
    ['dictionary zero', { value: '0', enabled: true }],
    ['missing flags', undefined]
  ])("keeps Facebook and Google disabled for %s", (_label, flag) => {
    setSocialLoginConfigs({ facebookFlag: flag, googleFlag: flag })
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(queryByText('fb')).not.toBeInTheDocument()
    expect(queryByText('google')).not.toBeInTheDocument()
    expect(queryByText('apple')).not.toBeInTheDocument()
  })

  it("removes Facebook and Google after their flags change from on to off", () => {
    setSocialLoginConfigs({
      facebookFlag: { value: '1' },
      googleFlag: { value: '1' }
    })
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }
    const view = renderWithProviders(<SignUpForm />)
    expect(view.getByText('fb')).toBeInTheDocument()
    expect(view.getByText('google')).toBeInTheDocument()

    setSocialLoginConfigs({
      facebookFlag: { value: '0', enabled: true },
      googleFlag: { value: '0', enabled: true }
    })
    view.rerender(<SignUpForm />)

    expect(view.queryByText('fb')).not.toBeInTheDocument()
    expect(view.queryByText('google')).not.toBeInTheDocument()
  })

  it.each([
    ['reduced zero', { value: '0' }, false],
    ['dictionary zero', { value: '0', enabled: true }, false],
    ['missing flag', undefined, false],
    ['reduced one', { value: '1' }, true]
  ])("gates Apple by its saved value for %s", (_label, appleFlag, showApple) => {
    setSocialLoginConfigs({
      facebookFlag: { value: '0' },
      googleFlag: { value: '0' }
    })
    configTuple[0].configs.apple_login_client_id = { value: 'apple-id' }
    if (appleFlag) {
      configTuple[0].configs.apple_login_enabled = appleFlag
    } else {
      delete configTuple[0].configs.apple_login_enabled
    }
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(Boolean(queryByText('apple'))).toBe(showApple)
    expect(Boolean(queryByText('or'))).toBe(showApple)
  })

  it("does not render a social divider when the only remaining credential is disabled Facebook", () => {
    setSocialLoginConfigs({
      facebookFlag: { value: '0', enabled: true },
      googleFlag: { value: '1' },
      includeGoogleCredentials: false
    })
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(queryByText('fb')).not.toBeInTheDocument()
    expect(queryByText('google')).not.toBeInTheDocument()
    expect(queryByText('or')).not.toBeInTheDocument()
  })

  it.each([
    ['off', { value: '0' }],
    ['missing', undefined]
  ])("shows Facebook when the legacy flag is %s and facebook_login_enabled is on", (_label, legacyFlag) => {
    setSocialLoginConfigs({
      facebookFlag: { value: '1' },
      googleFlag: { value: '0' }
    })
    if (legacyFlag) configTuple[0].configs.facebook_login = legacyFlag
    signupPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(queryByText('fb')).toBeInTheDocument()
  })
})
