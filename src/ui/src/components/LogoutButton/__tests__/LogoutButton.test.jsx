import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LogoutButton } from '../index'

const deleteUserCustomer = vi.fn()
const handleLogoutClick = vi.fn()

vi.mock('~components', () => ({
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={handleLogoutClick} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useCustomer: () => [{}, { deleteUserCustomer }]
}))

describe('LogoutButton', () => {
  beforeEach(() => {
    handleLogoutClick.mockClear()
    deleteUserCustomer.mockClear()
    window.FB = {
      getLoginStatus: (cb) => cb({ status: 'unknown' }),
      logout: vi.fn()
    }
    window.gapi = undefined
  })

  afterEach(() => {
    delete window.FB
    delete window.gapi
  })

  it('renders logout copy and clears the session on click', () => {
    const onCustomClick = vi.fn()
    const { getByText } = renderWithProviders(
      <LogoutButton onCustomClick={onCustomClick} />
    )
    expect(getByText('Logout')).toBeInTheDocument()
    fireEvent.click(getByText('Logout'))
    expect(deleteUserCustomer).toHaveBeenCalledWith(true)
    expect(handleLogoutClick).toHaveBeenCalled()
    expect(onCustomClick).toHaveBeenCalled()
  })

  it('logs out connected Facebook and Google sessions', async () => {
    const disconnect = vi.fn()
    const signOut = vi.fn().mockResolvedValue()
    window.FB = {
      getLoginStatus: (cb) => cb({ status: 'connected' }),
      logout: vi.fn()
    }
    window.gapi = {
      auth2: {
        getAuthInstance: () => ({
          isSignedIn: { get: () => true },
          signOut,
          disconnect
        })
      }
    }
    renderWithProviders(<LogoutButton hideText />)
    expect(document.getElementById('logoutbtn')).not.toBeNull()
    fireEvent.click(document.getElementById('logoutbtn'))
    expect(window.FB.logout).toHaveBeenCalled()
    expect(signOut).toHaveBeenCalled()
    await vi.waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('skips Google sign out when the user is not signed in', () => {
    window.gapi = {
      auth2: {
        getAuthInstance: () => ({
          isSignedIn: { get: () => false },
          signOut: vi.fn(),
          disconnect: vi.fn()
        })
      }
    }
    renderWithProviders(<LogoutButton hideText />)
    fireEvent.click(document.getElementById('logoutbtn'))
    expect(handleLogoutClick).toHaveBeenCalled()
    expect(window.gapi.auth2.getAuthInstance().signOut).not.toHaveBeenCalled()
  })
})
