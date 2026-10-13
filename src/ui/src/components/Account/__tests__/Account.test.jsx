import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Account } from '../index'

const emit = vi.fn()
const login = vi.fn()
const sessionRef = { current: { auth: true, user: { id: 1 } } }
const configRef = {
  current: {
    cash_wallet: { value: '1' },
    wallet_enabled: { value: '1' },
    wallet_cash_enabled: { value: '1' },
    wallet_credit_point_enabled: { value: '1' },
    disabled_rewards: { value: '0' },
    advanced_offers_module: { value: '0' }
  }
}

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current, { login }],
  useEvent: () => [{ emit }],
  useConfig: () => [{ configs: configRef.current }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  useIsMounted: () => true,
  LogoutButton: () => <button type='button' data-testid='logout-button'>Logout</button>,
  LanguageSelector: ({ setShowLanguageSelector }) => {
    setShowLanguageSelector?.(true)
    return <div data-testid='language-selector' />
  },
  LoginForm: ({ handleSuccessLogin, elementLinkToForgotPassword, elementLinkToSignup }) => (
    <div data-testid='login-form'>
      <button type='button' onClick={() => handleSuccessLogin({ id: 9 })}>finish-login</button>
      {elementLinkToSignup}
      {elementLinkToForgotPassword}
    </div>
  ),
  SignUpForm: ({ handleSuccessSignup, elementLinkToLogin }) => (
    <div data-testid='signup-form'>
      <button
        type='button'
        onClick={() => handleSuccessSignup({ id: 8, session: { access_token: 'tok' } })}
      >
        finish-signup
      </button>
      {elementLinkToLogin}
    </div>
  ),
  ForgotPasswordForm: ({ elementLinkToLogin }) => (
    <div data-testid='forgot-form'>{elementLinkToLogin}</div>
  )
}))

describe('Account', () => {
  beforeEach(() => {
    emit.mockClear()
    login.mockClear()
    sessionRef.current = { auth: true, user: { id: 1 } }
    window.scrollTo = vi.fn()
    const locationStub = {
      href: 'http://localhost/',
      origin: 'http://localhost',
      reload: vi.fn(),
      assign: vi.fn()
    }
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: locationStub
    })
  })

  it('renders authenticated menu links and emits page changes', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <Account auth userCustomer={{ name: 'Pat', lastname: 'Lee' }} />
    )
    expect(getByText('Pat Lee')).toBeInTheDocument()
    expect(getByText('My saved places')).toBeInTheDocument()
    expect(getByText('My favorites')).toBeInTheDocument()
    expect(getByText('My Orders')).toBeInTheDocument()
    expect(getByText('Messages')).toBeInTheDocument()
    expect(getByText('Wallets')).toBeInTheDocument()
    expect(getByText('View account')).toBeInTheDocument()
    expect(getByText('Security')).toBeInTheDocument()
    expect(getByText('help')).toBeInTheDocument()
    expect(getByTestId('language-selector')).toBeInTheDocument()
    expect(getByTestId('logout-button')).toBeInTheDocument()

    fireEvent.click(getByText('My saved places'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'profile', search: '?view=savedPlaces' })
    fireEvent.click(getByText('My favorites'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'favorite' })
    fireEvent.click(getByText('My Orders'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders' })
    fireEvent.click(getByText('Messages'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'messages' })
    fireEvent.click(getByText('Wallets'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'wallets' })
    fireEvent.click(getByText('View account'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'profile' })
    fireEvent.click(getByText('Security'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'sessions' })
    fireEvent.click(getByText('help'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'help' })
  })

  it('opens login and signup modals for guests', () => {
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <Account auth={false} />
    )
    fireEvent.click(getByText('Sign in'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('Create account'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
    fireEvent.click(getByText('finish-signup'))
    expect(login).toHaveBeenCalled()
    expect(queryByTestId('signup-form')).not.toBeInTheDocument()
  })

  it('reloads the page after a successful login', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <Account auth={false} />
    )
    fireEvent.click(getByText('Sign in'))
    fireEvent.click(getByTestId('login-form').querySelector('button'))
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('opens forgot password from the login modal', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <Account auth={false} />
    )
    fireEvent.click(getByText('Sign in'))
    fireEvent.click(getByText('Reset password'))
    expect(getByTestId('forgot-form')).toBeInTheDocument()
    fireEvent.click(getByText('Login'))
    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('hides wallet and favorites when theme and config disable them', () => {
    configRef.current = {
      ...configRef.current,
      wallet_enabled: { value: '0' }
    }
    const { queryByText } = renderWithProviders(
      <Account auth />,
      {
        themeOverrides: {
          bar_menu: {
            components: {
              favorites: { hidden: true },
              wallet: { hidden: true },
              messages: { hidden: true },
              help: { hidden: true },
              sessions: { hidden: true },
              orders: { hidden: true },
              profile: { hidden: true }
            }
          }
        }
      }
    )
    expect(queryByText('Wallets')).not.toBeInTheDocument()
    expect(queryByText('My favorites')).not.toBeInTheDocument()
    expect(queryByText('Messages')).not.toBeInTheDocument()
    configRef.current = {
      cash_wallet: { value: '1' },
      wallet_enabled: { value: '1' },
      wallet_cash_enabled: { value: '1' },
      wallet_credit_point_enabled: { value: '1' },
      disabled_rewards: { value: '0' },
      advanced_offers_module: { value: '0' }
    }
  })
})
