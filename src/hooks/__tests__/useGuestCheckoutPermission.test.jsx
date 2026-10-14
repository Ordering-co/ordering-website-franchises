import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useGuestCheckoutPermission } from '../useGuestCheckoutPermission'

describe('useGuestCheckoutPermission', () => {
  const allowedConfigs = {
    guest_checkout_enabled: { value: '1' },
    allowed_order_types_guest_checkout: { value: 'delivery' }
  }
  const initialGuestProps = {
    configs: allowedConfigs,
    orderType: 1,
    user: { guest_id: 'guest' }
  }

  it('rechecks retained guest callbacks after permission is revoked', () => {
    const { result, rerender } = renderHook(
      ({ configs, orderType, user }) => useGuestCheckoutPermission({ configs, orderType, user }),
      { initialProps: initialGuestProps }
    )
    const retained = result.current.canPlaceOrder
    expect(retained()).toBe(true)
    rerender({ ...initialGuestProps, configs: {} })
    expect(retained()).toBe(false)
    rerender({ ...initialGuestProps, configs: {}, user: { id: 1 } })
    expect(retained(true)).toBe(true)
  })

  it('keeps registered checkout available and rejects guest placement without permission', () => {
    const { result, unmount } = renderHook(() => useGuestCheckoutPermission({
      configs: {},
      orderType: 1,
      user: { id: 1 }
    }))
    const retained = result.current.canPlaceOrder
    expect(retained()).toBe(true)
    expect(retained(true)).toBe(true)
    unmount()
    act(() => {
      expect(retained()).toBe(false)
    })
  })
})
