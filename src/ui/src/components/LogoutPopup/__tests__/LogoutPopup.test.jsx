import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LogoutPopup } from '../index'

const handleLogoutClick = vi.fn()
const onClose = vi.fn()

vi.mock('~components', () => ({
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={handleLogoutClick} onClose={onClose} {...rest} />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ token: 'session-token' }],
  useApi: () => [{ root: 'https://api.example.com', appId: 'franchise-app' }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({})
}))

describe('LogoutPopup', () => {
  beforeEach(() => {
    handleLogoutClick.mockClear()
    onClose.mockClear()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  it('renders the manager password form', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LogoutPopup />)
    expect(getByText('Logout')).toBeInTheDocument()
    expect(getByText('Only the manager has the password to sign out this App.')).toBeInTheDocument()
    expect(getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
    expect(getByText('Sign out')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    const { getByPlaceholderText, container } = renderWithProviders(<LogoutPopup />)
    const input = getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')
    const toggle = input.parentElement.querySelector('span')
    fireEvent.click(toggle)
    expect(getByPlaceholderText('Password')).toHaveAttribute('type', 'text')
    fireEvent.click(toggle)
    expect(getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
    expect(container.querySelector('input[name="password"]')).not.toBeNull()
  })

  it('shows a validation error when the password is missing', async () => {
    const { getByText, findByText } = renderWithProviders(<LogoutPopup />)
    fireEvent.click(getByText('Sign out'))
    expect(await findByText(/The field Password is required/)).toBeInTheDocument()
    expect(handleLogoutClick).not.toHaveBeenCalled()
  })

  it('signs out when the password check succeeds', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ error: false, result: 'OK' })
    })
    const { getByPlaceholderText, getByText } = renderWithProviders(<LogoutPopup />)
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.click(getByText('Sign out'))
    await waitFor(() => {
      expect(handleLogoutClick).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users/check_password',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer session-token',
          'X-App-X': 'franchise-app'
        })
      })
    )
  })

  it('shows an API error and clears it when the password changes', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ error: true, result: ['Wrong password'] })
    })
    const { getByPlaceholderText, getByText, queryByText } = renderWithProviders(<LogoutPopup />)
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'bad' } })
    fireEvent.click(getByText('Sign out'))
    await waitFor(() => {
      expect(getByText('Wrong password')).toBeInTheDocument()
    })
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'next' } })
    expect(queryByText('Wrong password')).not.toBeInTheDocument()
  })

  it('shows a network error when the password check fails', async () => {
    global.fetch.mockRejectedValue(new Error('offline'))
    const { getByPlaceholderText, getByText } = renderWithProviders(<LogoutPopup />)
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'secret' } })
    fireEvent.click(getByText('Sign out'))
    await waitFor(() => {
      expect(getByText('offline')).toBeInTheDocument()
    })
    expect(handleLogoutClick).not.toHaveBeenCalled()
  })
})
