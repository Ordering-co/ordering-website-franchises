import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LoginGuest } from '../index'

vi.mock('~components', () => ({
  LoginGuest: ({ UIComponent, ...rest }) => <UIComponent {...rest} />,
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ user: null, loading: false }, { login: vi.fn() }],
  useEvent: () => [{ emit: vi.fn() }],
  useOrder: () => [{ carts: {}, options: { type: 1 } }],
  useConfig: () => [{
    configs: {
      guest_checkout_enabled: { value: '1' },
      allowed_order_types_guest_checkout: { value: ['delivery'] }
    }
  }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('LoginGuest', () => {
  it('renders the guest question when a cart uuid is present', () => {
    const { getByText } = renderWithProviders(
      <LoginGuest cartUuid='cart-1' title='Log in' checkoutFieldsState={{ fields: [] }} />
    )
    expect(getByText('Your account')).toBeInTheDocument()
    expect(getByText('Guest Checkout')).toBeInTheDocument()
  })

  it('opens the login form from the question screen', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <LoginGuest cartUuid='cart-1' title='Log in' checkoutFieldsState={{ fields: [] }} />
    )
    fireEvent.click(getByText('Log in'))
    expect(getByTestId('login-form')).toBeInTheDocument()
  })
})
