import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import {
  headerConfigs,
  headerUser,
  stubWindowLocation
} from '../../../../../test/headerUiTestUtils'
import { SidebarMenu } from '../index'

const emit = vi.fn()
const login = vi.fn()
const sessionRef = {
  current: { auth: true, user: { ...headerUser } }
}
const configRef = { current: { ...headerConfigs } }
const windowSizeRef = { current: { width: 1024, height: 768 } }

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current, { login }],
  useEvent: () => [{ emit }],
  useConfig: () => [{ configs: configRef.current }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  useWindowSize: () => windowSizeRef.current,
  LogoutButton: ({ onCustomClick }) => (
    <button type='button' data-testid='logout-button' onClick={onCustomClick}>
      Logout
    </button>
  ),
  LoginForm: ({ handleSuccessLogin, elementLinkToSignup, elementLinkToForgotPassword }) => (
    <div data-testid='login-form'>
      {elementLinkToSignup}
      {elementLinkToForgotPassword}
      <button type='button' onClick={() => handleSuccessLogin({ id: 1 })}>finish-login</button>
    </div>
  ),
  SignUpForm: ({ handleSuccessSignup, elementLinkToLogin }) => (
    <div data-testid='signup-form'>
      {elementLinkToLogin}
      <button
        type='button'
        onClick={() => handleSuccessSignup({ id: 8, session: { access_token: 'tok' } })}
      >
        finish-signup
      </button>
    </div>
  ),
  ForgotPasswordForm: ({ elementLinkToLogin }) => (
    <div data-testid='forgot-form'>{elementLinkToLogin}</div>
  )
}))

const openMenu = (view) => {
  fireEvent.click(view.getByLabelText('menu'))
}

describe('SidebarMenu', () => {
  beforeEach(() => {
    emit.mockClear()
    login.mockClear()
    sessionRef.current = { auth: true, user: { ...headerUser } }
    configRef.current = { ...headerConfigs }
    windowSizeRef.current = { width: 1024, height: 768 }
    window.scrollTo = vi.fn()
    stubWindowLocation({ pathname: '/', search: '' })
  })

  it('opens authenticated links and emits page changes', () => {
    const view = renderWithProviders(<SidebarMenu auth />)
    expect(view.getByLabelText('menu')).toBeInTheDocument()
    openMenu(view)
    expect(document.getElementById('sidebar_menu').style.width).toBe('340px')
    expect(view.getByText('Jane Doe')).toBeInTheDocument()
    expect(view.getByText('Home')).toBeInTheDocument()
    expect(view.getByText('Orders')).toBeInTheDocument()
    expect(view.getByText('View account')).toBeInTheDocument()
    expect(view.getByText('Wallets')).toBeInTheDocument()
    expect(view.getByText('Messages')).toBeInTheDocument()
    expect(view.getByText('Sessions')).toBeInTheDocument()
    expect(view.getByText('help')).toBeInTheDocument()
    expect(view.getByTestId('logout-button')).toBeInTheDocument()

    fireEvent.click(view.getByText('Home'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
    expect(['0', '0px']).toContain(document.getElementById('sidebar_menu').style.width)

    openMenu(view)
    fireEvent.click(view.getByText('Orders'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders' })
    openMenu(view)
    fireEvent.click(view.getByText('View account'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'profile' })
    openMenu(view)
    fireEvent.click(view.getByText('Wallets'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'wallets' })
    openMenu(view)
    fireEvent.click(view.getByText('Messages'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'messages' })
    openMenu(view)
    fireEvent.click(view.getByText('Sessions'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'sessions' })
    openMenu(view)
    fireEvent.click(view.getByText('help'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'help' })
    openMenu(view)
    fireEvent.click(view.getByTestId('logout-button'))
    expect(['0', '0px']).toContain(document.getElementById('sidebar_menu').style.width)
    openMenu(view)
    fireEvent.click(view.getByLabelText('close'))
    expect(['0', '0px']).toContain(document.getElementById('sidebar_menu').style.width)
  })

  it('opens login, signup, and forgot password for guests', () => {
    sessionRef.current = { auth: false, user: null }
    const location = stubWindowLocation({ pathname: '/' })
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <SidebarMenu auth={false} notificationState={{ permission: true }} />
    )
    fireEvent.click(getByText('Sign in'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('Create account'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
    fireEvent.click(getByText('Login'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('Reset password'))
    expect(getByTestId('forgot-form')).toBeInTheDocument()
    fireEvent.click(getByText('Login'))
    fireEvent.click(getByText('finish-login'))
    expect(location.reload).toHaveBeenCalled()
    expect(queryByTestId('login-form')).not.toBeInTheDocument()

    fireEvent.click(getByText('Sign up'))
    fireEvent.click(getByText('finish-signup'))
    expect(login).toHaveBeenCalledWith({
      user: { id: 8, session: { access_token: 'tok' } },
      token: 'tok'
    })
  })

  it('hides signup and uses the customer name in customer mode', () => {
    sessionRef.current = { auth: false, user: null }
    const { queryByText, getByText } = renderWithProviders(
      <SidebarMenu
        auth={false}
        isHideSignup
        isCustomerMode
        userCustomer={{ name: 'Pat', lastname: 'Lee' }}
      />
    )
    expect(getByText('Pat Lee')).toBeInTheDocument()
    expect(getByText('Sign in')).toBeInTheDocument()
    expect(queryByText('Sign up')).not.toBeInTheDocument()
  })

  it('shows guest auth actions when the user has a guest id', () => {
    sessionRef.current = {
      auth: true,
      user: { ...headerUser, guest_id: 'guest-1' }
    }
    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <SidebarMenu auth />
    )
    expect(queryByText('Orders')).not.toBeInTheDocument()
    expect(queryByText('View account')).not.toBeInTheDocument()
    fireEvent.click(getByText('Sign in'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
  })

  it('hides theme items and resizes the open drawer', () => {
    stubWindowLocation({ pathname: '/profile/orders' })
    const { queryByText, rerender, getByLabelText } = renderWithProviders(
      <SidebarMenu auth />,
      {
        themeOverrides: {
          bar_menu: {
            components: {
              orders: { hidden: true },
              profile: { hidden: true },
              wallet: { hidden: true },
              messages: { hidden: true },
              help: { hidden: true },
              sessions: { hidden: true }
            }
          }
        }
      }
    )
    expect(queryByText('Orders')).not.toBeInTheDocument()
    expect(queryByText('View account')).not.toBeInTheDocument()
    expect(queryByText('Wallets')).not.toBeInTheDocument()
    expect(queryByText('Messages')).not.toBeInTheDocument()
    expect(queryByText('Sessions')).not.toBeInTheDocument()
    expect(queryByText('help')).not.toBeInTheDocument()

    fireEvent.click(getByLabelText('menu'))
    expect(document.getElementById('sidebar_menu').style.width).toBe('340px')
    windowSizeRef.current = { width: 400, height: 700 }
    rerender(<SidebarMenu auth />)
    expect(document.getElementById('sidebar_menu').style.width).toBe('100vh')
    windowSizeRef.current = { width: 800, height: 700 }
    rerender(<SidebarMenu auth />)
    expect(document.getElementById('sidebar_menu').style.width).toBe('340px')
  })
})
