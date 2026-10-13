import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseLoginUIProps } from '../../../../../test/authTestUtils'
import { LoginForm } from '../index'

const { loginUIPropsRef, configTuple, optimizationTuple } = vi.hoisted(() => ({
  loginUIPropsRef: { current: null },
  configTuple: [{ configs: {} }],
  optimizationTuple: [{ loading: false, result: { configs: {} } }]
}))

const setSocialLoginConfigs = ({ facebookFlag, googleFlag, includeGoogleCredentials = true }) => {
  const configs = {
    facebook_id: { value: 'facebook-id' },
    apple_login_enabled: { value: '0', enabled: true }
  }
  const optimizationConfigs = {
    apple_login_enabled: { value: '0', enabled: true }
  }

  if (includeGoogleCredentials) {
    Object.assign(configs, {
      google_login_client_id: { value: 'google-id' },
      google_login_auth_domain: { value: 'google.example.com' },
      google_login_api_key: { value: 'google-api-key' }
    })
  }
  if (facebookFlag !== undefined) {
    configs.facebook_login_enabled = facebookFlag
    optimizationConfigs.facebook_login_enabled = facebookFlag
  }
  if (googleFlag !== undefined) {
    configs.google_login_enabled = googleFlag
    optimizationConfigs.google_login_enabled = googleFlag
  }

  configTuple[0].configs = configs
  optimizationTuple[0].result.configs = optimizationConfigs
}

vi.mock('~components', () => ({
  LoginForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...loginUIPropsRef.current} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => configTuple,
  useSession: () => [{ auth: false }, { login: vi.fn() }],
  useEvent: () => [{ emit: vi.fn() }],
  useToast: () => [null, { showToast: vi.fn() }],
  ToastType: { Error: 'error', Success: 'success' },
  ReCaptcha: () => null,
  useApi: () => [{ project: 'demo' }, { setOrdering: vi.fn() }],
  useOptimizationLoad: () => optimizationTuple
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))

describe('LoginForm', () => {
  afterEach(() => {
    loginUIPropsRef.current = null
    setSocialLoginConfigs({
      facebookFlag: { value: '0' },
      googleFlag: { value: '0' }
    })
  })

  it('renders email login fields', () => {
    loginUIPropsRef.current = { ...baseLoginUIProps }
    const { getByPlaceholderText, getAllByText } = renderWithProviders(<LoginForm useLoginByEmail />)
    expect(getAllByText('Login').length).toBeGreaterThan(0)
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
    expect(getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it.each([
    ['0', '0', false, false],
    ['0', '1', false, true],
    ['1', '0', true, false],
    ['1', '1', true, true]
  ])("gates Facebook and Google independently for optimized flags %s/%s", (facebookValue, googleValue, showFacebook, showGoogle) => {
    setSocialLoginConfigs({
      facebookFlag: { value: facebookValue },
      googleFlag: { value: googleValue }
    })
    loginUIPropsRef.current = { ...baseLoginUIProps, loginTab: 'email', isCustomerMode: false }

    const { queryByText } = renderWithProviders(<LoginForm useLoginByEmail />)

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
    loginUIPropsRef.current = { ...baseLoginUIProps, loginTab: 'email', isCustomerMode: false }

    const { queryByText } = renderWithProviders(<LoginForm useLoginByEmail />)

    expect(queryByText('fb')).not.toBeInTheDocument()
    expect(queryByText('google')).not.toBeInTheDocument()
    expect(queryByText('apple')).not.toBeInTheDocument()
  })

  it("removes Facebook and Google after their optimized flags change from on to off", () => {
    setSocialLoginConfigs({
      facebookFlag: { value: '1' },
      googleFlag: { value: '1' }
    })
    loginUIPropsRef.current = { ...baseLoginUIProps, loginTab: 'email', isCustomerMode: false }
    const view = renderWithProviders(<LoginForm useLoginByEmail />)
    expect(view.getByText('fb')).toBeInTheDocument()
    expect(view.getByText('google')).toBeInTheDocument()

    setSocialLoginConfigs({
      facebookFlag: { value: '0', enabled: true },
      googleFlag: { value: '0', enabled: true }
    })
    view.rerender(<LoginForm useLoginByEmail />)

    expect(view.queryByText('fb')).not.toBeInTheDocument()
    expect(view.queryByText('google')).not.toBeInTheDocument()
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
    loginUIPropsRef.current = { ...baseLoginUIProps, loginTab: 'email', isCustomerMode: false }

    const { queryByText } = renderWithProviders(<LoginForm useLoginByEmail />)

    expect(queryByText('fb')).toBeInTheDocument()
  })

  it("does not render a social divider when the only remaining credential is disabled Facebook", () => {
    setSocialLoginConfigs({
      facebookFlag: { value: '0', enabled: true },
      googleFlag: { value: '1' },
      includeGoogleCredentials: false
    })
    configTuple[0].configs.facebook_login = { value: '1' }
    loginUIPropsRef.current = { ...baseLoginUIProps, loginTab: 'email', isCustomerMode: false }

    const { queryByText } = renderWithProviders(<LoginForm useLoginByEmail />)

    expect(queryByText('fb')).not.toBeInTheDocument()
    expect(queryByText('google')).not.toBeInTheDocument()
    expect(queryByText('or')).not.toBeInTheDocument()
  })
})
