import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PhoneAutocomplete } from '../index'

const phonePropsRef = { current: {} }
const userCustomerRef = { current: null }
const changeType = vi.fn()
const orderStateRef = {
  current: { loading: false, options: { type: 1, address: {} } }
}
const onRedirectPage = vi.fn()
const setOpenModal = vi.fn()
const setCustomerState = vi.fn()
const setCustomersPhones = vi.fn()
const onChangeNumber = vi.fn()
const deleteUserCustomer = vi.fn()

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => userCustomerRef.current
}))
vi.mock('~/utils/parseOrderTypesAllowed', () => ({
  parseOrderTypesAllowed: () => [1, 2, 3, 4, 5]
}))
vi.mock('react-select', () => ({
  default: ({ options, onChange, onInputChange, inputValue, placeholder, value }) => (
    <div data-testid='phone-select'>
      <input
        data-testid='phone-select-input'
        value={inputValue || ''}
        placeholder={placeholder}
        onChange={(e) => onInputChange?.(e.target.value, { action: 'input-change' })}
      />
      {(options || []).map((opt) => (
        <button key={opt.value} type='button' onClick={() => onChange(opt)}>{opt.label}</button>
      ))}
      <button type='button' onClick={() => onChange(null)}>clear-phone</button>
      {value ? <span>{value.label || value.value}</span> : null}
    </div>
  )
}))
vi.mock('../../Modal', () => ({
  Modal: ({ open, children, onClose }) => (
    open
      ? (
        <div data-testid='modal'>
          <button type='button' onClick={onClose}>close</button>
          {children}
        </div>
        )
      : null
  )
}))
vi.mock('../../SignUpForm', () => ({
  SignUpForm: () => <div data-testid='signup-form' />
}))
vi.mock('../../Confirm', () => ({
  Alert: ({ open, content, onClose, title }) => (
    open
      ? (
        <div data-testid='alert'>
          {title}
          {Array.isArray(content) ? content.join(' ') : content}
          <button type='button' onClick={onClose}>close-alert</button>
        </div>
        )
      : null
  )
}))
vi.mock('../../AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('../../UserDetails', () => ({
  UserDetails: () => <div data-testid='user-details' />
}))
vi.mock('~components', () => ({
  PhoneAutocomplete: ({ UIComponent, ...rest }) => (
    <UIComponent
      phone=''
      customerState={{ loading: false, result: {} }}
      customersPhones={{ users: [], loading: false, error: null }}
      setCustomersPhones={setCustomersPhones}
      openModal={{ signup: false, customer: false }}
      setOpenModal={setOpenModal}
      onChangeNumber={onChangeNumber}
      setCustomerState={setCustomerState}
      countryCallingCode='1'
      onRedirectPage={onRedirectPage}
      limitPhoneLength={10}
      localPhoneCode='1'
      orderTypes={[
        { value: 1, text: 'Delivery', description: 'Delivery description' },
        { value: 2, text: 'Pickup', description: 'Pickup description' },
        { value: 3, text: 'Eat in', description: 'Eat in description' },
        { value: 4, text: 'Curbside', description: 'Curbside description' },
        { value: 5, text: 'Drive thru', description: 'Drive Thru description' }
      ]}
      {...rest}
      {...phonePropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [orderStateRef.current, { changeType }],
  useCustomer: () => [{}, { deleteUserCustomer }],
  useConfig: () => [{ configs: { order_types_allowed: { value: '1,2,3,4,5' } } }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('PhoneAutocomplete', () => {
  beforeEach(() => {
    phonePropsRef.current = {}
    userCustomerRef.current = null
    orderStateRef.current = { loading: false, options: { type: 1, address: {} } }
    changeType.mockClear()
    onRedirectPage.mockClear()
    setOpenModal.mockClear()
    setCustomerState.mockClear()
    onChangeNumber.mockClear()
  })

  it('renders call center types and changes delivery mode', () => {
    const { getByText } = renderWithProviders(<PhoneAutocomplete />)
    expect(getByText('Welcome to your Ordering Call Center.')).toBeInTheDocument()
    expect(getByText('Adding the customers’ phone number')).toBeInTheDocument()
    fireEvent.click(getByText('Pickup'))
    expect(changeType).toHaveBeenCalled()
    fireEvent.click(getByText('Delivery'))
    expect(changeType).toHaveBeenCalledWith(1)
  })

  it('shows extra pickup types and validates create customer length', () => {
    orderStateRef.current = { loading: false, options: { type: 2, address: {} } }
    const { getByText, getByTestId } = renderWithProviders(<PhoneAutocomplete />)
    expect(getByText('What kind of pickup do you need?')).toBeInTheDocument()
    expect(getByText('Eat in')).toBeInTheDocument()
    fireEvent.change(getByTestId('phone-select-input'), { target: { value: '555' } })
    fireEvent.mouseDown(getByText('Create new customer'))
    expect(getByTestId('alert')).toHaveTextContent('The Phone / Mobile must be 10 characters')
    fireEvent.click(getByText('close-alert'))
  })

  it('creates a customer when the phone length is valid', () => {
    phonePropsRef.current = { phone: '5551234567' }
    const { getByText, getByTestId } = renderWithProviders(<PhoneAutocomplete />)
    fireEvent.change(getByTestId('phone-select-input'), { target: { value: '5551234567' } })
    fireEvent.mouseDown(getByText('Create new customer'))
    expect(setOpenModal).toHaveBeenCalledWith(expect.objectContaining({ signup: true }))
  })

  it('selects an existing customer and opens the customer modal', () => {
    phonePropsRef.current = {
      customersPhones: {
        loading: false,
        error: null,
        users: [{ id: 4, name: 'Pat', cellphone: '5551112222', country_phone_code: '1' }]
      }
    }
    const { getByText } = renderWithProviders(<PhoneAutocomplete />)
    fireEvent.click(getByText(/Pat/))
    expect(setCustomerState).toHaveBeenCalled()
    expect(setOpenModal).toHaveBeenCalledWith({ signup: false, customer: true })
  })

  it('hides type pickers when a customer and address are already selected', () => {
    userCustomerRef.current = { id: 7, name: 'Jane', lastname: 'Doe' }
    orderStateRef.current = {
      loading: false,
      options: { type: 1, address: { address: '123 Main St' } }
    }
    const { queryByText } = renderWithProviders(<PhoneAutocomplete />)
    expect(queryByText('Create new customer')).not.toBeInTheDocument()
    expect(queryByText('Delivery')).not.toBeInTheDocument()
  })

  it('shows customer and signup modals and phone errors', () => {
    phonePropsRef.current = {
      openModal: { signup: true, customer: true },
      customerState: { loading: false, result: { id: 4, name: 'Pat' } },
      customersPhones: { users: [], loading: false, error: 'Lookup failed' }
    }
    const { getByTestId, getAllByTestId, getByText } = renderWithProviders(<PhoneAutocomplete />)
    expect(getByTestId('signup-form')).toBeInTheDocument()
    expect(getByTestId('user-details')).toBeInTheDocument()
    expect(getByTestId('address-list')).toBeInTheDocument()
    expect(getByTestId('alert')).toHaveTextContent('Lookup failed')
    fireEvent.click(getAllByTestId('modal')[1].querySelector('button'))
    expect(deleteUserCustomer).toHaveBeenCalled()
    fireEvent.click(getByText('close-alert'))
  })
})
