import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { accountUser, baseUserFormProps, baseValidationFields } from '../../../../../test/accountUiTestUtils'
import { UserFormDetailsUI } from '../index'

const sessionRef = { current: { user: accountUser } }
const configRef = {
  current: {
    verification_phone_required: { value: '0' },
    validation_phone_number_lib: { value: '1' }
  }
}
const setUserCustomer = vi.fn()
const login = vi.fn()

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
vi.mock('libphonenumber-js', () => {
  const parsePhoneNumber = (number) => ({
    countryCallingCode: '1',
    nationalNumber: String(number || '').replace(/\D/g, '').slice(-10)
  })
  return { default: parsePhoneNumber, parsePhoneNumber }
})
vi.mock('react-phone-number-input', () => ({
  formatPhoneNumber: (value) => value || ''
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useConfig: () => [{ configs: configRef.current }],
  useSession: () => [sessionRef.current, { login }],
  useCustomer: () => [{}, { setUserCustomer }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  LanguageSelector: ({ showTitle }) => <div data-testid='language-selector'>{showTitle ? 'Language' : null}</div>,
  DatePickerUI: ({ onChange }) => (
    <button type='button' onClick={() => onChange(new Date('1995-05-05'))}>pick-date</button>
  ),
  Switch: ({ onChange, defaultChecked }) => (
    <input
      type='checkbox'
      data-testid='notification-switch'
      defaultChecked={defaultChecked}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
  InputPhoneNumber: ({ value, setValue, handleIsValid, disabled }) => (
    <input
      data-testid='user-phone-input'
      value={value || ''}
      disabled={disabled}
      onChange={(e) => {
        const next = e.target.value
        const valid = next.startsWith('+1')
        handleIsValid?.(valid)
        setValue?.(next, valid)
      }}
    />
  ),
  SignUpForm: ({ handleSuccessSignup }) => (
    <div data-testid='signup-form'>
      <button
        type='button'
        onClick={() => handleSuccessSignup?.({ id: 3, session: { access_token: 'tok' } })}
      >
        guest-signup
      </button>
    </div>
  )
}))

const renderForm = (overrides = {}) => renderWithProviders(
  <UserFormDetailsUI
    {...baseUserFormProps}
    handleChangeInput={vi.fn()}
    handleButtonUpdateClick={vi.fn()}
    cleanFormState={vi.fn()}
    handleChangeNotifications={vi.fn()}
    {...overrides}
  />
)

describe('UserFormDetails', () => {
  beforeEach(() => {
    configRef.current = {
      verification_phone_required: { value: '0' },
      validation_phone_number_lib: { value: '1' }
    }
    sessionRef.current = { user: accountUser }
  })

  it('renders profile fields, language and notifications', () => {
    const handleChangeNotifications = vi.fn()
    const { getByPlaceholderText, getByTestId, getAllByTestId } = renderForm({
      handleChangeNotifications
    })
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
    expect(getByPlaceholderText('Name')).toBeInTheDocument()
    expect(getByTestId('user-phone-input')).toBeInTheDocument()
    expect(getByPlaceholderText('Password')).toBeInTheDocument()
    expect(getByTestId('language-selector')).toBeInTheDocument()
    fireEvent.click(getAllByTestId('notification-switch')[0])
    expect(handleChangeNotifications).toHaveBeenCalled()
  })

  it('updates email and submits profile changes', () => {
    const handleChangeInput = vi.fn()
    const handleButtonUpdateClick = vi.fn()
    const { getByPlaceholderText, getByText, getByTestId } = renderForm({
      handleChangeInput,
      handleButtonUpdateClick,
      isCheckout: true,
      formState: { loading: false, changes: { name: 'Jane' }, result: { error: false } }
    })
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'Jane@Example.com' } })
    fireEvent.change(getByTestId('user-phone-input'), { target: { value: '+15551234567' } })
    expect(handleChangeInput).toHaveBeenCalled()
    fireEvent.click(getByText('Update'))
    expect(handleButtonUpdateClick).toHaveBeenCalled()
  })

  it('shows skeletons while validation fields load', () => {
    const { getAllByTestId } = renderForm({
      validationFields: { loading: true, fields: { checkout: {} } }
    })
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('requires a phone number when verification is enabled', () => {
    configRef.current.verification_phone_required = { value: '1' }
    const { getByText, getByTestId } = renderForm({
      isCheckout: true,
      userData: { ...accountUser, cellphone: null, guest_id: null },
      formState: { loading: false, changes: { name: 'Jane' }, result: { error: false } }
    })
    fireEvent.click(getByText('Update'))
    expect(getByTestId('alert')).toHaveTextContent('The field Phone Number is required.')
  })

  it('alerts when a phone number is invalid', () => {
    const { getByTestId, getByText } = renderForm({
      isCheckout: true,
      formState: { loading: false, changes: { name: 'Jane' }, result: { error: false } }
    })
    fireEvent.change(getByTestId('user-phone-input'), { target: { value: '555' } })
    fireEvent.click(getByText('Update'))
    expect(getByTestId('alert')).toHaveTextContent('The Phone Number field is invalid')
  })

  it('sets a birthdate and continues with required fields', () => {
    const handleChangeInput = vi.fn()
    const { getByPlaceholderText, getByText } = renderForm({
      handleChangeInput,
      requiredFields: ['email', 'birthdate'],
      isRequiredField: (code) => code === 'birthdate'
    })
    fireEvent.focus(getByPlaceholderText('Birthdate'))
    fireEvent.click(getByText('pick-date'))
    expect(handleChangeInput).toHaveBeenCalled()
    expect(getByText('Continue')).toBeInTheDocument()
  })

  it('renders guest checkout and a form error alert', () => {
    const { getByText, getByTestId } = renderForm({
      fromGuestLogin: true,
      handleSuccessUpdate: vi.fn(),
      formState: { loading: false, changes: {}, result: { error: true, result: ['Server error'] } }
    })
    expect(getByText('Guest Checkout')).toBeInTheDocument()
    expect(getByTestId('signup-form')).toBeInTheDocument()
    expect(getByTestId('alert')).toHaveTextContent('Server error')
  })

  it('uses checkout validation fields and optional customer email', () => {
    const { getByPlaceholderText } = renderForm({
      isOrderTypeValidationField: true,
      isCustomerMode: true,
      checkoutFields: [
        { enabled: true, validation_field: { id: 9, code: 'email', name: 'Email', type: 'email' } },
        { enabled: true, validation_field: { id: 10, code: 'mobile_phone', name: 'Phone', type: 'text' } }
      ]
    })
    expect(getByPlaceholderText('Email (Optional)')).toBeInTheDocument()
  })

  it('cancels an old layout form', () => {
    const onCancel = vi.fn()
    const { getByText } = renderForm({
      onCancel,
      isOldLayout: true
    })
    fireEvent.click(getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledWith(false)
  })
})
