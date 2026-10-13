import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { accountUser, accountWalletConfigs, baseAddressFormProps } from '../../../../../test/accountUiTestUtils'
import { AdvancedAddressForm } from '../index'

const addressPropsRef = { current: {} }
const sessionRef = { current: { auth: true, user: accountUser } }
const orderStateRef = {
  current: { loading: false, options: { type: 1, address: {}, address_id: null } }
}
const configRef = {
  current: { loading: false, configs: accountWalletConfigs }
}
const showToast = vi.fn()
const onChangeBusinessSelected = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (onSubmit) => (event) => {
      event?.preventDefault?.()
      onSubmit()
    },
    register: () => ({}),
    setValue: vi.fn(),
    errors: {}
  })
}))
vi.mock('~components', () => ({
  AddressForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...baseAddressFormProps}
      {...rest}
      {...addressPropsRef.current}
    />
  ),
  GoogleAutocompleteInput: ({ onChangeAddress, onChange, placeholder, defaultValue }) => (
    <div>
      <input
        data-testid='google-autocomplete'
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e)}
      />
      <button
        type='button'
        onClick={() => onChangeAddress?.({
          address: 'selected street',
          location: { lat: 10, lng: 20 },
          zipcode: '33101'
        })}
      >
        pick-address
      </button>
    </div>
  ),
  GoogleMapsMap: () => <div data-testid='google-map' />,
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current],
  useOrder: () => [orderStateRef.current],
  useConfig: () => [configRef.current],
  useToast: () => [null, { showToast }],
  ToastType: { Error: 'error', Success: 'success' }
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({
    handleGoToPage: () => {},
    getOrderType: (type) => (type === 1 ? 'Delivery' : 'Pickup')
  }),
  useConfigFile: () => [{ franchiseSlug: 'demo-franchise' }],
  useBusinessSelected: () => [{}, { onChangeBusinessSelected }],
  TextArea: (props) => <textarea data-testid='address-notes' {...props} />,
  AddressList: ({ setAddingNewAddress }) => (
    <div data-testid='address-list'>
      <button type='button' onClick={() => setAddingNewAddress?.(false)}>use saved</button>
    </div>
  ),
  BusinessesListing: () => <div data-testid='businesses-listing' />,
  GoogleGpsButton: ({ onAddress, onError }) => (
    <div>
      <button
        type='button'
        onClick={() => onAddress({ address: 'GPS Street', location: { lat: 3, lng: 4 } })}
      >
        gps
      </button>
      <button type='button' onClick={() => onError('ERROR_NOT_FOUND_ADDRESS')}>gps-error</button>
    </div>
  )
}))

const renderAddress = (overrides) => {
  addressPropsRef.current = overrides || {}
  return renderWithProviders(<AdvancedAddressForm />)
}

describe('AdvancedAddressForm', () => {
  beforeEach(() => {
    addressPropsRef.current = {}
    sessionRef.current = { auth: true, user: accountUser }
    orderStateRef.current = { loading: false, options: { type: 1, address: {}, address_id: null } }
    configRef.current = { loading: false, configs: { ...accountWalletConfigs } }
    showToast.mockClear()
    onChangeBusinessSelected.mockClear()
  })

  it('renders the address autocomplete and list', () => {
    const { getByTestId, getByPlaceholderText } = renderAddress()
    expect(getByTestId('address-list')).toBeInTheDocument()
    expect(getByPlaceholderText('Address')).toBeInTheDocument()
  })

  it('shows skeletons while config loads', () => {
    configRef.current = { loading: true, configs: accountWalletConfigs }
    const { getAllByTestId } = renderAddress()
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('selects an autocomplete address and saves it', async () => {
    const saveAddress = vi.fn()
    const updateChanges = vi.fn()
    const handleChangeInput = vi.fn()
    const onBusinessClick = vi.fn()
    const { getByTestId, getByText, findByText, container } = renderAddress({
      saveAddress,
      updateChanges,
      handleChangeInput,
      onBusinessClick,
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: 'selected street', location: { lat: 10, lng: 20 } }
      }
    })
    fireEvent.change(getByTestId('google-autocomplete'), { target: { value: 'selected street' } })
    fireEvent.click(getByText('pick-address'))
    expect(updateChanges).toHaveBeenCalled()
    const tagButtons = Array.from(container.querySelectorAll('button')).filter((button) => (
      button.querySelector('svg') && !['gps', 'gps-error', 'use saved'].includes(button.textContent)
    ))
    tagButtons.forEach((button) => fireEvent.click(button))
    expect(handleChangeInput).toHaveBeenCalledWith({ target: { name: 'tag', value: expect.any(String) } })
    fireEvent.click(await findByText('CONTINUE'))
    expect(saveAddress).toHaveBeenCalled()
    await waitFor(() => {
      expect(onBusinessClick).toHaveBeenCalled()
    })
  })

  it('fills extra fields and notes after a location exists', () => {
    const handleChangeInput = vi.fn()
    const { getByPlaceholderText, getByTestId } = renderAddress({
      handleChangeInput,
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: '9 Pine', location: { lat: 1, lng: 2 }, zipcode: '33101' }
      }
    })
    fireEvent.change(getByPlaceholderText('Zipcode'), { target: { value: '33102' } })
    fireEvent.change(getByTestId('address-notes'), { target: { value: 'Gate code 1' } })
    expect(handleChangeInput).toHaveBeenCalled()
  })

  it('alerts when the address already exists', async () => {
    const { getByTestId, getByText } = renderAddress({
      addressesList: [{
        id: 2,
        address: '9 Pine',
        zipcode: '33101',
        location: { lat: 1, lng: 2 }
      }],
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: '9 Pine', zipcode: '33101', location: { lat: 1, lng: 2 } }
      }
    })
    fireEvent.click(getByText('CONTINUE'))
    expect(getByTestId('alert')).toHaveTextContent('The address already exists')
  })

  it('requires a suggested location when configured', async () => {
    configRef.current = {
      loading: false,
      configs: { ...accountWalletConfigs, google_autocomplete_selection_required: { value: '1' } }
    }
    const { getByTestId, container } = renderAddress({
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: 'typed only' }
      }
    })
    fireEvent.submit(container.querySelector('form'))
    expect(getByTestId('alert')).toHaveTextContent('The address needs a location, please select one of the suggested')
  })

  it('continues from a saved address', () => {
    const { getByText } = renderAddress({
      addressState: {
        loading: false,
        address: { id: 5, address: 'Saved', location: { lat: 8, lng: 9 } }
      },
      formState: { loading: false, changes: {}, result: { error: false } }
    })
    fireEvent.click(getByText('use saved'))
    fireEvent.click(getByText('Continue'))
    expect(onChangeBusinessSelected).toHaveBeenCalled()
  })

  it('shows a map error from the gps button', () => {
    const { getByText, getByTestId } = renderAddress()
    fireEvent.click(getByText('gps-error'))
    expect(getByTestId('alert')).toBeInTheDocument()
  })

  it('toasts when no nearby business exists', () => {
    const { getByText } = renderAddress({
      businessNearestState: { loading: false, business: null },
      addressState: {
        loading: false,
        address: { id: 5, address: 'Saved', location: { lat: 8, lng: 9 } }
      }
    })
    fireEvent.click(getByText('use saved'))
    fireEvent.click(getByText('Continue'))
    expect(showToast).toHaveBeenCalled()
  })

  it('shows the business listing and form errors', () => {
    const { getByTestId } = renderAddress({
      openBusinessList: true,
      formState: { loading: false, changes: {}, result: { error: true, result: ['Save failed'] } }
    })
    expect(getByTestId('businesses-listing')).toBeInTheDocument()
  })

  it('uses gps address and guest address state', () => {
    sessionRef.current = { auth: false, user: {} }
    const updateChanges = vi.fn()
    const { getByText, getByTestId, container } = renderAddress({
      updateChanges,
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: '', location: null }
      },
      addressState: { loading: false, address: { address: 'Old guest' } }
    })
    fireEvent.click(getByText('gps'))
    expect(updateChanges).toHaveBeenCalled()
    fireEvent.submit(container.querySelector('form'))
    expect(getByTestId('alert')).toBeInTheDocument()
  })
})
