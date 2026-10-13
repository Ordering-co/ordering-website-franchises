import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { UserPopover } from '../index'

const emit = vi.fn()
const handleLogoutClick = vi.fn()
const deleteUserCustomer = vi.fn()
const sessionRef = {
  current: { user: { id: 1, name: 'Jane', photo: 'jane.png' } }
}
const configRef = {
  current: {}
}
const orderRef = {
  current: { options: { address: { location: { lat: 1, lng: 2 } } } }
}

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current],
  useEvent: () => [{ emit }],
  useCustomer: () => [{}, { deleteUserCustomer }],
  useConfig: () => [{ configs: configRef.current }],
  useOrder: () => [orderRef.current],
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={handleLogoutClick} {...rest} />
  )
}))

describe('UserPopover', () => {
  beforeEach(() => {
    emit.mockClear()
    handleLogoutClick.mockClear()
    deleteUserCustomer.mockClear()
    sessionRef.current = { user: { id: 1, name: 'Jane', photo: 'jane.png' } }
    configRef.current = {}
    orderRef.current = { options: { address: { location: { lat: 1, lng: 2 } } } }
    window.gapi = undefined
  })

  afterEach(() => {
    delete window.gapi
  })

  it('hides the menu when closed and opens default options when open', () => {
    const onClick = vi.fn()
    const { getByText, container } = renderWithProviders(
      <UserPopover open onClick={onClick} />
    )
    fireEvent.click(container.querySelector('.menu-list').parentElement)
    expect(onClick).toHaveBeenCalled()
    expect(getByText('My home')).toBeInTheDocument()
    expect(getByText('Orders')).toBeInTheDocument()
    expect(getByText('View account')).toBeInTheDocument()
    fireEvent.click(getByText('My home'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('asks for an address on promotions when no location exists', () => {
    configRef.current = { advanced_offers_module: { value: '1' } }
    orderRef.current = { options: { address: {} } }
    const handleOpenAddressModal = vi.fn()
    const { getByText } = renderWithProviders(
      <UserPopover
        open
        handleOpenAddressModal={handleOpenAddressModal}
      />
    )
    fireEvent.click(getByText('Promotions'))
    expect(handleOpenAddressModal).toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('shows wallet and extra options from configs and logs out', async () => {
    configRef.current = {
      cash_wallet: { value: true },
      wallet_enabled: { value: '1' },
      wallet_cash_enabled: { value: '1' }
    }
    const disconnect = vi.fn()
    window.gapi = {
      auth2: {
        getAuthInstance: () => ({
          isSignedIn: { get: () => true },
          signOut: vi.fn().mockResolvedValue(),
          disconnect
        })
      }
    }
    const onClose = vi.fn()
    const { getByText } = renderWithProviders(
      <UserPopover open withLogout onClose={onClose} />
    )
    expect(getByText('Wallets')).toBeInTheDocument()
    expect(getByText('Messages')).toBeInTheDocument()
    expect(getByText('Help')).toBeInTheDocument()
    fireEvent.click(getByText('Logout'))
    expect(deleteUserCustomer).toHaveBeenCalledWith(true)
    expect(handleLogoutClick).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
    await vi.waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('closes from outside clicks and escape, and honors hidden theme items', () => {
    const onClose = vi.fn()
    const { queryByText } = renderWithProviders(
      <UserPopover open onClose={onClose} isHome />,
      {
        themeOverrides: {
          bar_menu: {
            components: {
              orders: { hidden: true },
              profile: { hidden: true },
              messages: { hidden: true },
              help: { hidden: true },
              favorites: { hidden: true },
              sessions: { hidden: true },
              promotions: { hidden: true },
              wallet: { hidden: true }
            }
          },
          profile: {
            components: {
              address_list: {
                components: { layout: { position: 'new_page' } }
              }
            }
          }
        }
      }
    )
    expect(queryByText('Orders')).not.toBeInTheDocument()
    expect(queryByText('Places')).toBeInTheDocument()
    fireEvent.mouseUp(document.body)
    fireEvent.keyDown(window, { keyCode: 27 })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('accepts a custom options list in customer mode', () => {
    const { getByText, queryByText } = renderWithProviders(
      <UserPopover
        open
        isCustomerMode
        optionsList={[
          { name: 'profile', pathname: '/profile', displayName: 'view account', key: 'view_account', isActive: true }
        ]}
      />
    )
    expect(queryByText('My home')).not.toBeInTheDocument()
    expect(getByText('Help')).toBeInTheDocument()
  })
})
