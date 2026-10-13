import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { savedAddress, secondAddress } from '../../../../../test/addressUiTestUtils'
import { AddressList } from '../index'

const emit = vi.fn()
const handleSetDefault = vi.fn()
const handleDeleteAddress = vi.fn()
const setAddressList = vi.fn()
const setAddingNewAddress = vi.fn()
const onCancel = vi.fn()

const listPropsRef = { current: {} }
const orderRef = {
  current: { loading: false, options: { address: savedAddress } }
}
const windowSizeRef = { current: { width: 1024, height: 768 } }

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  AddressList: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../test/addressUiTestUtils').baseAddressListProps}
      handleSetDefault={handleSetDefault}
      handleDelete={handleDeleteAddress}
      setAddressList={setAddressList}
      setAddingNewAddress={setAddingNewAddress}
      onCancel={onCancel}
      {...rest}
      {...listPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [orderRef.current],
  useCustomer: () => [{ user: { id: 1, name: 'Jane' } }],
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  useWindowSize: () => windowSizeRef.current,
  scrollTo: vi.fn(),
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>,
  AddressForm: ({ onSaveAddress, onCancel, address }) => (
    <div data-testid='address-form'>
      <span>{address?.address || 'new'}</span>
      <button
        type='button'
        onClick={() => onSaveAddress({
          id: address?.id || 3,
          address: 'New Place',
          default: true,
          location: { lat: 1, lng: 1 }
        })}
      >
        save-address
      </button>
      <button type='button' onClick={onCancel}>cancel-form</button>
    </div>
  )
}))

const renderList = (overrides) => {
  listPropsRef.current = overrides || {}
  return renderWithProviders(<AddressList />)
}

describe('AddressList', () => {
  beforeEach(() => {
    listPropsRef.current = {}
    orderRef.current = { loading: false, options: { address: savedAddress } }
    windowSizeRef.current = { width: 1024, height: 768 }
    emit.mockClear()
    handleSetDefault.mockClear()
    handleDeleteAddress.mockClear()
    setAddressList.mockClear()
    setAddingNewAddress.mockClear()
    onCancel.mockClear()
  })

  it('renders saved places and selects another address', async () => {
    const { getByText } = renderList({ isModal: true })
    expect(getByText('What\'s your address?')).toBeInTheDocument()
    expect(getByText('Select one of your saved places')).toBeInTheDocument()
    expect(getByText('123 Main St')).toBeInTheDocument()
    fireEvent.click(getByText('456 Oak Ave'))
    expect(handleSetDefault).toHaveBeenCalled()
    await waitFor(() => expect(onCancel).toHaveBeenCalled())
  })

  it('opens the form, saves, and confirms delete', () => {
    const { getByText, getByTestId } = renderList({
      isModal: true
    })
    fireEvent.click(getByText('Add New Address'))
    expect(getByTestId('address-form')).toBeInTheDocument()
    fireEvent.click(getByText('save-address'))
    expect(setAddressList).toHaveBeenCalled()
    fireEvent.click(getByText('Add New Address'))
    const trash = document.querySelector('.red-trash')
    fireEvent.click(trash)
    expect(getByTestId('confirm')).toHaveTextContent('Are you sure that you want to delete the address?')
    fireEvent.click(getByText('Accept'))
    expect(handleDeleteAddress).toHaveBeenCalled()
  })

  it('shows empty, error, loading, and network states', () => {
    const empty = renderList({
      isModal: true,
      addressList: { loading: false, error: null, addresses: [] }
    })
    expect(empty.getByText('Sorry, You don\'t seem to have any addresses.')).toBeInTheDocument()
    empty.unmount()

    const errored = renderList({
      isModal: true,
      addressList: { loading: false, error: [{ message: 'Failed to load' }], addresses: [] }
    })
    expect(errored.getByTestId('not-found')).toHaveTextContent('Failed to load')
    errored.unmount()

    const loading = renderList({
      isModal: true,
      addressList: { loading: true, error: null, addresses: [] }
    })
    expect(loading.getAllByTestId('skeleton').length).toBeGreaterThan(0)
    loading.unmount()

    orderRef.current = { loading: false, options: { address: 'bad' } }
    const network = renderList({
      isModal: true,
      addressList: { loading: false, error: null, addresses: [savedAddress] }
    })
    expect(network.getByTestId('not-found')).toHaveTextContent('Network error, please reload the page')
  })

  it('continues with the default address and adds from a hidden title', () => {
    const { getByText } = renderList({
      isModal: true,
      isHideTitle: true,
      isEnableContinueButton: true,
      addressList: { loading: false, error: null, addresses: [savedAddress, secondAddress] }
    })
    fireEvent.click(getByText(/Continue with/))
    expect(handleSetDefault).toHaveBeenCalled()
    fireEvent.click(getByText('Add New Address'))
    expect(getByText('save-address')).toBeInTheDocument()
  })

  it('emits search in customer mode and order types from profile', () => {
    windowSizeRef.current = { width: 500, height: 800 }
    const customer = renderList({
      isModal: true,
      isProfile: true,
      isCustomerMode: true,
      isEnableContinueButton: true,
      userCustomerSetup: { id: 1 },
      addressList: { loading: false, error: null, addresses: [savedAddress] }
    })
    fireEvent.click(customer.getByText(/Continue with/))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
    customer.unmount()

    emit.mockClear()
    const profile = renderList({
      isProfile: true,
      isModal: false,
      isCustomerMode: false,
      addressList: { loading: false, error: null, addresses: [] }
    })
    fireEvent.click(profile.getByText('Add New Address'))
    fireEvent.click(profile.getByText('save-address'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'order_types' })
  })

  it('renders the popover form and auto-opens for an empty customer list', () => {
    windowSizeRef.current = { width: 500, height: 800 }
    const { getByTestId } = renderList({
      isPopover: true,
      isModal: false,
      isCustomerMode: true,
      addressList: { loading: false, error: null, addresses: [] }
    })
    expect(getByTestId('address-form')).toBeInTheDocument()
    fireEvent.click(getByTestId('address-form').querySelector('button'))
    expect(setAddressList).toHaveBeenCalled()
  })
})
