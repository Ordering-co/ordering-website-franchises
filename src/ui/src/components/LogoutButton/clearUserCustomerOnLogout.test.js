import { describe, expect, it, vi } from 'vitest'

import { clearUserCustomerOnLogout } from './clearUserCustomerOnLogout'

describe('clearUserCustomerOnLogout', () => {
  it('clears user-customer from storage the same way UserPopover does', () => {
    const deleteUserCustomer = vi.fn()
    clearUserCustomerOnLogout(deleteUserCustomer)
    expect(deleteUserCustomer).toHaveBeenCalledWith(true)
  })

  it('does not throw when deleteUserCustomer is missing', () => {
    expect(() => clearUserCustomerOnLogout(undefined)).not.toThrow()
  })
})
