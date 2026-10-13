import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CartPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {}, arrow: {} }
  })
}))
vi.mock('~components', () => ({
  useOrder: () => [{ carts: { 'businessId:1': { uuid: 'cart-1', products: [{ id: 1 }] } } }, {}],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }],
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  CartContent: () => <div data-testid='cart-content' />,
  generalUtilities: () => ({ handleCreateGuestUser: vi.fn().mockResolvedValue(undefined) })
}))

describe('CartPopover', () => {
  it('renders cart trigger and popover body', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <CartPopover open auth location={{ pathname: '/' }} onClose={vi.fn()} carts={[{ uuid: 'cart-1', products: [{ id: 1 }] }]} />
    )
    expect(getByTestId('cart-content')).toBeInTheDocument()
    expect(getByText('Order')).toBeInTheDocument()
  })
})
