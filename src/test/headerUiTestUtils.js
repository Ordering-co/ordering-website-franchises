import { vi } from 'vitest'

export const headerUser = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe'
}

export const headerSession = {
  auth: true,
  user: headerUser
}

export const headerAddress = {
  address: '123 Main',
  location: { lat: 25.7, lng: -80.1 }
}

export const headerCart = {
  uuid: 'cart-1',
  products: [{ id: 10 }],
  business: { slug: 'demo-store', id: 7 },
  business_id: 7
}

export const otherCart = {
  uuid: 'cart-2',
  products: [{ id: 11 }],
  business: { slug: 'other-store', id: 8 },
  business_id: 8
}

export const headerOrderState = {
  carts: {
    1: headerCart,
    2: otherCart
  },
  options: {
    type: 1,
    address: headerAddress
  }
}

export const headerConfigs = {
  cash_wallet: { value: '1' },
  wallet_enabled: { value: '1' },
  wallet_cash_enabled: { value: '1' },
  wallet_credit_point_enabled: { value: '1' },
  disabled_rewards: { value: '0' },
  order_types_allowed: { value: '1,2' },
  dates_moment_format: { value: 'YYYY-MM-DD HH:mm' }
}

export const headerThemeLogos = {
  logotype: 'logotype.png',
  isotype: 'isotype.png',
  isotypeInvert: 'isotype-invert.png'
}

export const headerThemeOverrides = {
  images: {
    logos: headerThemeLogos
  }
}

export const headerOrderTypeList = ['Delivery', 'Pickup', 'Eat in', 'Drive thru', 'Curbside']

export const stubWindowLocation = ({
  pathname = '/',
  search = '',
  reload = vi.fn()
} = {}) => {
  const locationStub = {
    pathname,
    search,
    href: `http://localhost${pathname}${search}`,
    origin: 'http://localhost',
    reload,
    assign: vi.fn()
  }
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: locationStub
  })
  return locationStub
}

export const resetHeaderFixtures = ({
  sessionRef,
  orderRef,
  configRef,
  customerRef,
  businessRef
}) => {
  sessionRef.current = { ...headerSession }
  orderRef.current = {
    carts: { ...headerOrderState.carts },
    options: { ...headerOrderState.options, address: { ...headerAddress } }
  }
  configRef.current = { ...headerConfigs }
  customerRef.current = { user: null, loading: false }
  businessRef.current = { business: { id: 7, slug: 'demo-store', configs: {} } }
}
