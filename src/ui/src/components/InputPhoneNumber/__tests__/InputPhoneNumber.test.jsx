import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { accountUser } from '../../../../../test/accountUiTestUtils'
import { InputPhoneNumber } from '../index'

const sessionRef = { current: { auth: true } }
const configRef = { current: { validation_phone_number_lib: { value: '1' }, default_country_code: { value: 'US' } } }

vi.mock('~ui/utils', () => ({
  transformCountryCode: () => 'US',
  findExitingCode: (code) => code || 'US'
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [sessionRef.current],
  useConfig: () => [{ configs: configRef.current }]
}))
vi.mock('react-phone-number-input', () => ({
  default: ({ value, onChange, placeholder, disabled, defaultCountry }) => (
    <input
      data-testid='phone-number-input'
      value={value || ''}
      placeholder={placeholder}
      disabled={disabled}
      data-country={defaultCountry}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}))
vi.mock('libphonenumber-js', () => {
  const parsePhoneNumber = (number) => {
    if (!number) return null
    return { isValid: () => String(number).startsWith('+1555') }
  }
  return { default: parsePhoneNumber, parsePhoneNumber }
})

describe('InputPhoneNumber', () => {
  it('renders a phone input and reports validity on change', () => {
    const setValue = vi.fn()
    const handleIsValid = vi.fn()
    const { getByTestId, getByPlaceholderText } = renderWithProviders(
      <InputPhoneNumber
        user={accountUser}
        value='+15551234567'
        setValue={setValue}
        handleIsValid={handleIsValid}
        showPhoneIcon
      />
    )
    expect(getByPlaceholderText('Phone number')).toBeInTheDocument()
    expect(getByTestId('phone-number-input')).toHaveAttribute('data-country', 'US')
    fireEvent.change(getByTestId('phone-number-input'), { target: { value: '+15559876543' } })
    expect(setValue).toHaveBeenCalled()
    expect(handleIsValid).toHaveBeenCalled()
  })

  it('shows an invalid phone message for authenticated users', () => {
    const { getByText } = renderWithProviders(
      <InputPhoneNumber
        user={accountUser}
        value='123'
        setValue={vi.fn()}
        handleIsValid={vi.fn()}
      />
    )
    expect(getByText('The Phone Number field is invalid')).toBeInTheDocument()
  })

  it('shows a country code error when the number has no plus prefix', () => {
    const { getByText } = renderWithProviders(
      <InputPhoneNumber
        user={{ ...accountUser, country_phone_code: null }}
        value='5551234567'
        setValue={vi.fn()}
        handleIsValid={vi.fn()}
      />
    )
    expect(getByText('The country code of the phone number is invalid')).toBeInTheDocument()
  })

  it('skips library validation when the config disables it', () => {
    configRef.current = { validation_phone_number_lib: { value: '0' }, default_country_code: { value: '+1' } }
    const handleIsValid = vi.fn()
    renderWithProviders(
      <InputPhoneNumber
        user={{ id: 2 }}
        value='555'
        setValue={vi.fn()}
        handleIsValid={handleIsValid}
        disabled
      />
    )
    expect(handleIsValid).toHaveBeenCalledWith(true)
    configRef.current = { validation_phone_number_lib: { value: '1' }, default_country_code: { value: 'US' } }
  })
})
