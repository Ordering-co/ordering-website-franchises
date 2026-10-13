import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { AddressesPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {} }
  })
}))
vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => ({ id: 1 })
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_k, f) => f],
  useOrder: () => [{ options: { address: { address: '123 Main St, Miami' } } }, {}],
  useEvent: () => [{ on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', () => ({
  AddressList: () => <div data-testid='address-list' />,
  AddressForm: () => <div data-testid='address-form' />
}))

describe('AddressesPopover', () => {
  it('renders address header and authenticated address list when open', () => {
    window.localStorage.setItem('user-customer', JSON.stringify({ id: 1 }))
    const { getByText, getByTestId } = renderWithProviders(
      <AddressesPopover open auth onClick={vi.fn()} onClose={vi.fn()} />
    )
    expect(getByText('123 Main St')).toBeInTheDocument()
    expect(getByTestId('address-list')).toBeInTheDocument()
  })

  it('renders guest address form when not authenticated', () => {
    const { getByTestId } = renderWithProviders(
      <AddressesPopover open auth={false} onClick={vi.fn()} onClose={vi.fn()} addressState={{}} />
    )
    expect(getByTestId('address-form')).toBeInTheDocument()
  })
})
