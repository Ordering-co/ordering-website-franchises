import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { NavigationBar } from '../index'

const emit = vi.fn()
const login = vi.fn()
const sessionRef = { current: { auth: true } }
const orderRef = {
  current: {
    carts: {
      1: { products: [{ id: 10 }] }
    },
    options: { address: { address: '123 Main' } }
  }
}

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useEvent: () => [{ emit }],
  useOrder: () => [orderRef.current],
  useSession: () => [sessionRef.current, { login }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({}),
  CartContent: ({ carts }) => (
    <div data-testid='cart-content'>carts:{carts?.length || 0}</div>
  ),
  AddressForm: () => <div data-testid='address-form' />,
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
      <button type='button' onClick={() => handleSuccessSignup({ session: { access_token: 'tok' } })}>
        finish-signup
      </button>
    </div>
  ),
  ForgotPasswordForm: ({ elementLinkToLogin }) => (
    <div data-testid='forgot-form'>{elementLinkToLogin}</div>
  )
}))

describe('NavigationBar', () => {
  beforeEach(() => {
    emit.mockClear()
    login.mockClear()
    sessionRef.current = { auth: true }
    orderRef.current = {
      carts: {
        1: { products: [{ id: 10 }] }
      },
      options: { address: { address: '123 Main' } }
    }
  })

  it('navigates authenticated tabs and opens the cart modal', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <NavigationBar />,
      { route: '/home' }
    )
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('My cart')).toBeInTheDocument()
    expect(getByText('Orders')).toBeInTheDocument()
    expect(getByText('Account')).toBeInTheDocument()

    fireEvent.click(getByText('Home'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
    fireEvent.click(getByText('Orders'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'orders' })
    fireEvent.click(getByText('Account'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'account' })
    fireEvent.click(getByText('My cart'))
    expect(getByTestId('cart-content')).toHaveTextContent('carts:1')
    fireEvent.click(getByText('close'))
  })

  it('opens auth flows for guests and can finish login or signup', () => {
    sessionRef.current = { auth: false }
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <NavigationBar />,
      { route: '/profile/orders' }
    )
    fireEvent.click(getByText('Orders'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('Create account'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
    fireEvent.click(getByText('Login'))
    expect(getByTestId('login-form')).toBeInTheDocument()
    fireEvent.click(getByText('Reset password'))
    expect(getByTestId('forgot-form')).toBeInTheDocument()
    fireEvent.click(getByText('Login'))
    fireEvent.click(getByText('finish-login'))
    expect(queryByTestId('login-form')).not.toBeInTheDocument()

    fireEvent.click(getByText('Account'))
    fireEvent.click(getByText('Create account'))
    fireEvent.click(getByText('finish-signup'))
    expect(login).toHaveBeenCalledWith({
      user: { session: { access_token: 'tok' } },
      token: 'tok'
    })
  })

  it('marks account as active on the account route', () => {
    const { getByText } = renderWithProviders(
      <NavigationBar />,
      { route: '/account' }
    )
    expect(getByText('Account')).toBeInTheDocument()
  })
})
