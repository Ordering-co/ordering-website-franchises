import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseCartUIProps } from '../../../../../test/cartUiTestUtils'
import { CartSidebar } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useOrder: () => [{ carts: { 'businessId:1': baseCartUIProps.cart } }, {}],
  useEvent: () => [{ emit: vi.fn(), on: vi.fn(), off: vi.fn() }]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  CartContent: ({ isOpenCart }) => <div data-testid='cart-content' data-open={String(isOpenCart)} />
}))

describe('CartSidebar', () => {
  it('marks persistent cart content inactive until the drawer opens', () => {
    const { getByTestId, getByText, getByLabelText } = renderWithProviders(<CartSidebar carts={[{ uuid: 'test-cart' }]} onClose={vi.fn()} />)
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'false')
    fireEvent.click(getByText('1'))
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'true')
    fireEvent.click(getByLabelText('close'))
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'false')
  })
  it('opens sidebar and shows cart title', () => {
    const onClose = vi.fn()
    const { getByText, container } = renderWithProviders(
      <CartSidebar open carts={[baseCartUIProps.cart]} onClose={onClose} />
    )
    const icon = container.querySelector('[class*="IconContent"]') || container.firstChild?.firstChild
    if (icon) fireEvent.click(icon)
    expect(getByText('My cart')).toBeInTheDocument()
    expect(getByText('close')).toBeInTheDocument()
  })
})
