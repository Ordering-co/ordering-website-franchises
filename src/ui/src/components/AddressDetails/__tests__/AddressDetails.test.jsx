import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { nearbyBusiness, savedAddress } from '../../../../../test/addressUiTestUtils'
import { AddressDetails } from '../index'

const configRef = {
  current: { use_alternative_to_google_maps: { value: '0' } }
}
const orderRef = {
  current: { options: { type: 1, address: savedAddress } }
}

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: (value) => {
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
}))
vi.mock('~components', () => ({
  AddressDetails: ({ UIComponent, ...rest }) => <UIComponent {...rest} />,
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [orderRef.current],
  useConfig: () => [{ configs: configRef.current }],
  useCustomer: () => [{ user: { id: 1, name: 'Jane' } }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  AddressList: (props) => (
    <div data-testid='address-list' data-checkout={String(!!props.isFromCheckout)} />
  )
}))

describe('AddressDetails', () => {
  it('renders the current address and can show the map', () => {
    configRef.current = { use_alternative_to_google_maps: { value: '0' } }
    orderRef.current = { options: { type: 1, address: savedAddress } }
    const { getByText, getByAltText, queryByAltText } = renderWithProviders(
      <AddressDetails
        addressToShow='9 Pine St'
        apiKey='test-key'
        googleMapsUrl='https://maps.example/static.png'
      />
    )
    expect(getByText('9 Pine St')).toBeInTheDocument()
    expect(getByText('Change address')).toBeInTheDocument()
    expect(queryByAltText('google-maps-location')).not.toBeInTheDocument()
    fireEvent.click(getByText('Show map'))
    expect(getByAltText('google-maps-location')).toHaveAttribute('src', 'https://maps.example/static.png')
  })

  it('opens the address list from checkout and hides map when alternative maps are on', () => {
    configRef.current = { use_alternative_to_google_maps: { value: '1' } }
    orderRef.current = { options: { type: 1, address: savedAddress } }
    const { getByText, getByTestId, queryByText } = renderWithProviders(
      <AddressDetails isFromCheckout apiKey='test-key' />
    )
    expect(getByText('123 Main St')).toBeInTheDocument()
    expect(queryByText('Show map')).not.toBeInTheDocument()
    fireEvent.click(getByText('Change address'))
    expect(getByTestId('address-list')).toHaveAttribute('data-checkout', 'true')
    fireEvent.click(getByText('close'))
    expect(queryByText('close')).not.toBeInTheDocument()
  })

  it('hides change address for pickup carts', () => {
    orderRef.current = { options: { type: 2, address: savedAddress } }
    const { queryByText, getByText } = renderWithProviders(
      <AddressDetails isCartPending={false} />
    )
    expect(getByText('123 Main St')).toBeInTheDocument()
    expect(queryByText('Change address')).not.toBeInTheDocument()
  })
})
