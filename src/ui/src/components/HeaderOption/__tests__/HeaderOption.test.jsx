import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import {
  headerAddress,
  headerConfigs,
  headerOrderState,
  headerOrderTypeList
} from '../../../../../test/headerUiTestUtils'
import { HeaderOption } from '../index'

const parseDate = vi.fn((value) => `parsed:${value}`)
const orderRef = { current: headerOrderState }
const configRef = { current: headerConfigs }

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parseDate }],
  useConfig: () => [{ configs: configRef.current }],
  useOrder: () => [orderRef.current]
}))

describe('HeaderOption', () => {
  beforeEach(() => {
    parseDate.mockClear()
    orderRef.current = {
      ...headerOrderState,
      options: { ...headerOrderState.options, type: 1 }
    }
    configRef.current = { ...headerConfigs }
  })

  it('renders the cart count and calls onClick with cart', () => {
    const onClick = vi.fn()
    const { getByText } = renderWithProviders(
      <HeaderOption variant='cart' totalCarts={3} onClick={onClick} />
    )
    expect(getByText('3')).toBeInTheDocument()
    fireEvent.click(getByText('3'))
    expect(onClick).toHaveBeenCalledWith('cart')
  })

  it('shows zero when the cart total is empty', () => {
    const onClick = vi.fn()
    const { getByText } = renderWithProviders(
      <HeaderOption variant='cart' totalCarts={0} onClick={onClick} isHome />
    )
    expect(getByText('0')).toBeInTheDocument()
    fireEvent.click(getByText('0'))
    expect(onClick).toHaveBeenCalledWith('cart')
  })

  it('renders a saved address or the empty address prompt', () => {
    const onClick = vi.fn()
    const { getByText, rerender } = renderWithProviders(
      <HeaderOption
        variant='address'
        addressState={headerAddress.address}
        onClick={onClick}
      />
    )
    expect(getByText(headerAddress.address)).toBeInTheDocument()
    fireEvent.click(getByText(headerAddress.address))
    expect(onClick).toHaveBeenCalledWith('address')

    rerender(
      <HeaderOption variant='address' onClick={onClick} />
    )
    expect(getByText("What's your address?")).toBeInTheDocument()
  })

  it('renders a parsed moment or the ASAP fallback', () => {
    const onClick = vi.fn()
    const { getByText, rerender } = renderWithProviders(
      <HeaderOption
        variant='moment'
        momentState='2026-01-01 12:00'
        onClick={onClick}
      />
    )
    expect(parseDate).toHaveBeenCalledWith(
      '2026-01-01 12:00',
      { outputFormat: headerConfigs.dates_moment_format.value }
    )
    expect(getByText('parsed:2026-01-01 12:00')).toBeInTheDocument()
    fireEvent.click(getByText('parsed:2026-01-01 12:00'))
    expect(onClick).toHaveBeenCalledWith('moment')

    rerender(
      <HeaderOption variant='moment' onClick={onClick} />
    )
    expect(getByText('ASAP')).toBeInTheDocument()
  })

  it('renders the matching order type or the delivery fallback', () => {
    const onClick = vi.fn()
    const { getByText, rerender } = renderWithProviders(
      <HeaderOption
        variant='delivery'
        orderTypeList={headerOrderTypeList}
        onClick={onClick}
      />
    )
    expect(getByText('Delivery')).toBeInTheDocument()
    fireEvent.click(getByText('Delivery'))
    expect(onClick).toHaveBeenCalledWith('delivery')

    orderRef.current = {
      ...headerOrderState,
      options: { ...headerOrderState.options, type: 2 }
    }
    rerender(
      <HeaderOption
        variant='delivery'
        orderTypeList={headerOrderTypeList}
        onClick={onClick}
      />
    )
    expect(getByText('Pickup')).toBeInTheDocument()

    rerender(
      <HeaderOption variant='delivery' onClick={onClick} />
    )
    expect(getByText('Delivery')).toBeInTheDocument()
  })
})
