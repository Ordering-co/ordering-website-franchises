import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { handleChangeOrderType, savedAddress } from '../../../../../test/addressUiTestUtils'
import { AddressOrderType } from '../index'

const sessionRef = { current: { auth: true } }
const orderRef = {
  current: {
    loading: false,
    options: { type: 1, address_id: 1, address: savedAddress }
  }
}
const configRef = {
  current: { order_types_allowed: { value: '1|2' } }
}
const typeSelectedRef = { current: 1 }

vi.mock('~components', () => ({
  OrderTypeControl: ({ UIComponent, orderTypes, ...rest }) => (
    <UIComponent
      handleChangeOrderType={handleChangeOrderType}
      orderTypes={orderTypes}
      typeSelected={typeSelectedRef.current}
      setOrderTypeValue={vi.fn()}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [orderRef.current],
  useSession: () => [sessionRef.current],
  useConfig: () => [{ configs: configRef.current }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  AddressForm: () => <div data-testid='address-form'>Address form</div>,
  AddressList: ({ onAccept, onCancel }) => (
    <div data-testid='address-list'>
      <button type='button' onClick={onAccept}>accept-list</button>
      <button type='button' onClick={onCancel}>cancel-list</button>
    </div>
  )
}))

describe('AddressOrderType', () => {
  beforeEach(() => {
    handleChangeOrderType.mockClear()
    sessionRef.current = { auth: true }
    orderRef.current = {
      loading: false,
      options: { type: 1, address_id: 1, address: savedAddress }
    }
    configRef.current = { order_types_allowed: { value: '1|2' } }
    typeSelectedRef.current = 1
  })

  it('renders the current address and switches order type', () => {
    const { getByText } = renderWithProviders(<AddressOrderType />)
    expect(getByText('123 Main St')).toBeInTheDocument()
    expect(getByText('Home')).toBeInTheDocument()
    fireEvent.click(getByText('Pickup'))
    expect(handleChangeOrderType).toHaveBeenCalledWith(2)
  })

  it('opens the saved address list and alerts when no location exists', () => {
    orderRef.current = {
      loading: false,
      options: { type: 1, address_id: 1, address: { address: 'No pin', tag: 'other' } }
    }
    const { getByText, getByTestId } = renderWithProviders(<AddressOrderType />)
    fireEvent.click(getByText('No pin'))
    expect(getByTestId('address-list')).toBeInTheDocument()
    fireEvent.click(getByText('accept-list'))
    expect(getByTestId('alert')).toHaveTextContent('Select or add an address to search')
    fireEvent.click(getByText('cancel-list'))
  })

  it('opens the address form for guests and shows extra pickup types', () => {
    sessionRef.current = { auth: false }
    orderRef.current = {
      loading: false,
      options: { type: 2, address_id: null, address: {} }
    }
    configRef.current = { order_types_allowed: { value: '1|2|3|4|5' } }
    typeSelectedRef.current = 2
    const { getByText, getByTestId } = renderWithProviders(<AddressOrderType />)
    expect(getByText('Where do we delivery?')).toBeInTheDocument()
    expect(getByText('Eat in')).toBeInTheDocument()
    fireEvent.click(getByText('Where do we delivery?'))
    expect(getByTestId('address-form')).toBeInTheDocument()
    fireEvent.click(getByText('close'))
    fireEvent.click(getByText('Curbside'))
    expect(handleChangeOrderType).toHaveBeenCalledWith(4)
  })
})
