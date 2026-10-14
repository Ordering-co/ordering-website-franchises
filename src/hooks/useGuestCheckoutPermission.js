import { useCallback, useEffect, useRef } from 'react'
import { isGuestCheckoutAllowed } from '~/utils/guestCheckout'

export const useGuestCheckoutPermission = ({ configs, orderType, user }) => {
  const guestCheckoutAllowed = isGuestCheckoutAllowed(configs, orderType)
  const guestOrderBlocked = !!user?.guest_id && !guestCheckoutAllowed
  const permission = useRef({ guestCheckoutAllowed, guestOrderBlocked, user })
  const mounted = useRef(true)
  permission.current = { guestCheckoutAllowed, guestOrderBlocked, user }

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const canUseGuestCheckout = useCallback(() => mounted.current && permission.current.guestCheckoutAllowed, [])
  const canPlaceOrder = useCallback((asGuest = false) => {
    if (!mounted.current || permission.current.guestOrderBlocked) return false
    if (asGuest && (!permission.current.user || permission.current.user?.guest_id)) {
      return permission.current.guestCheckoutAllowed
    }
    return true
  }, [])

  return { guestCheckoutAllowed, guestOrderBlocked, canUseGuestCheckout, canPlaceOrder }
}
