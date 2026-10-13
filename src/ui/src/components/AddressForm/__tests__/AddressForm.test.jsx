import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { savedAddress } from '../../../../../test/addressUiTestUtils'
import { AddressForm } from '../index'

const saveAddress = vi.fn()
const handleChangeInput = vi.fn()
const updateChanges = vi.fn()
const setIsEdit = vi.fn()

const addressPropsRef = { current: {} }
const sessionRef = { current: { auth: true, user: { id: 1, name: 'Jane' } } }
const orderRef = {
  current: { loading: false, options: { type: 1, address: savedAddress } }
}
const configRef = {
  current: {
    loading: false,
    configs: {
      google_maps_api_key: { value: 'test-key' },
      google_autocomplete_selection_required: { value: '0' },
      meters_to_change_address: { value: '1000' },
      country_autocomplete: { value: '*' }
    }
  }
}
const formErrorsRef = { current: {} }

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
    errors: formErrorsRef.current
  })
}))
vi.mock('~components', () => ({
  AddressForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...require('../../../../../test/addressUiTestUtils').baseAddressFormProps}
      saveAddress={saveAddress}
      handleChangeInput={handleChangeInput}
      updateChanges={updateChanges}
      setIsEdit={setIsEdit}
      {...rest}
      {...addressPropsRef.current}
    />
  ),
  GoogleAutocompleteInput: ({ onChangeAddress, onChange, placeholder, defaultValue, childRef }) => (
    <div>
      <input
        data-testid='google-autocomplete'
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={(node) => childRef?.(node)}
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
  GoogleMapsMap: ({ setErrors }) => (
    <div data-testid='google-map'>
      <button type='button' onClick={() => setErrors('ERROR_MAX_LIMIT_LOCATION')}>map-limit</button>
    </div>
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current],
  useOrder: () => [orderRef.current],
  useConfig: () => [configRef.current]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  TextArea: (props) => <textarea data-testid='address-notes' {...props} />,
  GoogleGpsButton: ({ onAddress, onError }) => (
    <div>
      <button
        type='button'
        onClick={() => onAddress({ address: 'GPS Street', location: { lat: 3, lng: 4 } })}
      >
        gps
      </button>
      <button type='button' onClick={() => onError('ERROR_NOT_FOUND_ADDRESS')}>gps-error</button>
      <button type='button' onClick={() => onError('plain text', true)}>gps-text</button>
    </div>
  )
}))

const renderAddress = (overrides) => {
  addressPropsRef.current = overrides || {}
  return renderWithProviders(<AddressForm />)
}

describe('AddressForm', () => {
  beforeEach(() => {
    addressPropsRef.current = {}
    sessionRef.current = { auth: true, user: { id: 1, name: 'Jane' } }
    orderRef.current = { loading: false, options: { type: 1, address: savedAddress } }
    configRef.current = {
      loading: false,
      configs: {
        google_maps_api_key: { value: 'test-key' },
        google_autocomplete_selection_required: { value: '0' },
        meters_to_change_address: { value: '1000' },
        country_autocomplete: { value: '*' }
      }
    }
    formErrorsRef.current = {}
    saveAddress.mockClear()
    handleChangeInput.mockClear()
    updateChanges.mockClear()
    setIsEdit.mockClear()
  })

  it('renders autocomplete and cancels when there are no changes', () => {
    const onCancel = vi.fn()
    const { getByPlaceholderText, getByText } = renderAddress({ onCancel })
    expect(getByPlaceholderText('Address')).toBeInTheDocument()
    fireEvent.click(getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows skeletons while config loads', () => {
    configRef.current = { ...configRef.current, loading: true }
    const { getAllByTestId } = renderAddress()
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('selects an autocomplete address, tags it, and saves', () => {
    const { getByTestId, getByText, getByPlaceholderText, container } = renderAddress({
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: 'selected street', location: { lat: 10, lng: 20 } }
      }
    })
    fireEvent.change(getByTestId('google-autocomplete'), { target: { value: 'selected street' } })
    fireEvent.click(getByText('pick-address'))
    expect(updateChanges).toHaveBeenCalled()
    fireEvent.change(getByPlaceholderText('Zipcode'), { target: { value: '33102' } })
    fireEvent.change(getByTestId('address-notes'), { target: { value: 'Gate code' } })
    expect(handleChangeInput).toHaveBeenCalled()
    const tagButtons = Array.from(container.querySelectorAll('button')).filter((button) => (
      button.querySelector('svg') && !['gps', 'gps-error', 'gps-text', 'pick-address', 'map-limit'].includes(button.textContent)
    ))
    tagButtons.forEach((button) => fireEvent.click(button))
    expect(handleChangeInput).toHaveBeenCalledWith({ target: { name: 'tag', value: expect.any(String) } })
    fireEvent.click(getByText('Add address'))
    expect(saveAddress).toHaveBeenCalled()
  })

  it('alerts when the address already exists', () => {
    const { getByText, getByTestId } = renderAddress({
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
    fireEvent.click(getByText('Add address'))
    expect(getByTestId('alert')).toHaveTextContent('The address already exists')
  })

  it('requires a suggested location when configured', () => {
    configRef.current = {
      loading: false,
      configs: {
        google_maps_api_key: { value: 'test-key' },
        google_autocomplete_selection_required: { value: '1' },
        meters_to_change_address: { value: '1000' },
        country_autocomplete: { value: '*' }
      }
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

  it('updates an existing address and shows map errors', () => {
    const { getByText, getByTestId } = renderAddress({
      addressState: {
        loading: false,
        address: { id: 5, address: 'Saved', location: { lat: 8, lng: 9 }, tag: 'home' }
      },
      formState: {
        loading: false,
        result: { error: false },
        changes: { address: 'Saved 2', location: { lat: 8.1, lng: 9.1 } }
      }
    })
    expect(setIsEdit).toHaveBeenCalledWith(true)
    expect(getByTestId('google-map')).toBeInTheDocument()
    fireEvent.click(getByText('Update'))
    expect(saveAddress).toHaveBeenCalled()
    fireEvent.click(getByText('map-limit'))
    expect(getByTestId('alert')).toHaveTextContent('meters')
  })

  it('uses gps, shows form errors, and validates guest address', () => {
    sessionRef.current = { auth: false, user: {} }
    const { getByText, getByTestId, container } = renderAddress({
      formState: {
        loading: false,
        result: { error: true, result: ['Save failed'] },
        changes: { address: '', location: null },
        error: 'Inline fail'
      },
      addressState: { loading: false, address: { address: 'Old guest' } }
    })
    expect(getByText('Inline fail')).toBeInTheDocument()
    fireEvent.click(getByText('gps-error'))
    expect(getByTestId('alert')).toHaveTextContent('Sorry, we couldn\'t find an address')
    fireEvent.click(getByText('gps'))
    expect(updateChanges).toHaveBeenCalled()
    fireEvent.click(getByText('gps-text'))
    fireEvent.submit(container.querySelector('form'))
    expect(getByTestId('alert')).toBeInTheDocument()
  })

  it('alerts hook form errors and blocks enter from submitting twice', () => {
    formErrorsRef.current = { address: { message: 'The field Address is required' } }
    const { getByTestId, container } = renderAddress()
    expect(getByTestId('alert')).toHaveTextContent('The field Address is required')
    fireEvent.keyDown(container.querySelector('form'), { key: 'Enter', keyCode: 13, which: 13 })
  })
})
