/**
 * @vitest-environment jsdom
 * @vitest-environment-options { "url": "http://localhost/" }
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createGa4Tracker,
  initializeGa4,
  mapCartToGa4,
  mapOrderToGa4,
  normalizeMeasurementId
} from './ga4'

const product = {
  id: 101,
  name: 'Sample product',
  price: 12,
  quantity: 2,
  category: { name: 'Sample category' }
}

const cart = {
  uuid: 'cart-1',
  business_id: 7,
  business: { name: 'Configured store' },
  delivery_type: 1,
  products: [product]
}

describe('GA4 configuration', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    window.dataLayer = []
    window.gtag = undefined
    window.__orderingGa4Configured = undefined
    try {
      window.localStorage?.clear()
    } catch {
      // jsdom can hide localStorage on opaque origins
    }
  })

  it('only enables valid GA4 IDs and never supplies a fallback', () => {
    expect(normalizeMeasurementId(' G-ABC123 ')).toBe('G-ABC123')
    expect(normalizeMeasurementId('UA-51635411-4')).toBeNull()
    expect(normalizeMeasurementId(undefined)).toBeNull()

    const tracker = createGa4Tracker({ measurementId: undefined, gtag: vi.fn() })
    expect(tracker.enabled).toBe(false)
    expect(tracker.pageView(window.location)).toBe(false)
  })

  it('loads and configures each project ID once without automatic page views', () => {
    const first = initializeGa4({ measurementId: 'G-PROJECTA' })
    const second = initializeGa4({ measurementId: 'G-PROJECTA' })

    expect(first).toBe(second)
    expect(document.querySelectorAll('script[src*="G-PROJECTA"]')).toHaveLength(1)
    const configCalls = window.dataLayer.filter(call => call[0] === 'config')
    expect(configCalls).toHaveLength(1)
    expect(configCalls[0][1]).toBe('G-PROJECTA')
    expect(configCalls[0][2]).toEqual({ send_page_view: false })
  })

  it('routes events to the configured project with no cross-project fallback', () => {
    const gtag = vi.fn()
    const projectA = createGa4Tracker({ measurementId: 'G-PROJECTA', gtag })
    const projectB = createGa4Tracker({ measurementId: 'G-PROJECTB', gtag })

    projectA.viewItem(product)
    projectB.viewItem(product)

    expect(gtag.mock.calls[0][2].send_to).toBe('G-PROJECTA')
    expect(gtag.mock.calls[1][2].send_to).toBe('G-PROJECTB')
  })
})

describe('GA4 ecommerce payloads', () => {
  it('uses configured brand and currency instead of client-specific defaults', () => {
    expect(mapCartToGa4(cart, {
      affiliation: 'Runtime project',
      currency: 'cad'
    })).toMatchObject({
      affiliation: 'Configured store',
      currency: 'CAD',
      value: 24,
      store_id: 7,
      order_type: 'delivery',
      items: [{
        item_id: '101',
        item_name: 'Sample product',
        item_brand: 'Configured store',
        price: 12,
        quantity: 2
      }]
    })

    expect(mapCartToGa4({ ...cart, business: undefined }, {
      affiliation: 'Runtime project',
      currency: 'cad'
    }).affiliation).toBe('Runtime project')
  })

  it('omits monetary value when currency is unavailable', () => {
    const payload = mapCartToGa4(cart)
    expect(payload.currency).toBeUndefined()
    expect(payload.value).toBeUndefined()
  })

  it('maps purchase value without tax and shipping', () => {
    expect(mapOrderToGa4({
      id: 'order-1',
      total: 30,
      tax_total: 2,
      delivery_zone_price: 4,
      business_id: 7,
      paymethod: 'card'
    }, cart, {
      affiliation: 'Runtime project',
      currency: 'mxn'
    })).toMatchObject({
      transaction_id: 'order-1',
      currency: 'MXN',
      value: 24,
      tax: 2,
      shipping: 4,
      store_id: 7,
      order_type: 'delivery',
      payment_type: 'card'
    })
  })

  it('sends the complete funnel with item arrays and no PII fields', () => {
    const gtag = vi.fn()
    const tracker = createGa4Tracker({
      measurementId: 'G-PROJECT',
      currency: 'mxn',
      affiliation: 'Runtime project',
      gtag
    })

    tracker.viewItemList({
      products: [product],
      business: cart.business,
      listId: 'featured',
      listName: 'Featured'
    })
    tracker.selectItem(product)
    tracker.viewItem(product)
    tracker.addToCart(product, cart)
    tracker.viewCart(cart)
    tracker.beginCheckout(cart)
    tracker.addShippingInfo(cart)
    tracker.addPaymentInfo(cart, { gateway: 'card' })
    tracker.removeFromCart(product, cart)
    tracker.login('ordering')
    tracker.signUp('ordering')

    const events = gtag.mock.calls.map(call => call[1])
    expect(events).toEqual([
      'view_item_list',
      'select_item',
      'view_item',
      'add_to_cart',
      'view_cart',
      'begin_checkout',
      'add_shipping_info',
      'add_payment_info',
      'remove_from_cart',
      'login',
      'sign_up'
    ])
    gtag.mock.calls.forEach(([, , payload]) => {
      expect(payload).not.toHaveProperty('email')
      expect(payload).not.toHaveProperty('phone')
      expect(payload).not.toHaveProperty('user_id')
    })
  })

  it('deduplicates successful purchases by project and transaction ID', () => {
    const gtag = vi.fn()
    const storage = {
      values: new Map(),
      getItem (key) {
        return this.values.get(key)
      },
      setItem (key, value) {
        this.values.set(key, value)
      }
    }
    const order = { id: 'order-1', business_id: 7, paymethod: 'card' }
    const tracker = createGa4Tracker({
      measurementId: 'G-PROJECT',
      currency: 'mxn',
      gtag,
      storage
    })

    expect(tracker.purchase(order, cart)).toBe(true)
    expect(tracker.purchase(order, cart)).toBe(false)

    const reloadedTracker = createGa4Tracker({
      measurementId: 'G-PROJECT',
      currency: 'mxn',
      gtag,
      storage
    })
    expect(reloadedTracker.purchase(order, cart)).toBe(false)
    expect(gtag.mock.calls.filter(call => call[1] === 'purchase')).toHaveLength(1)
  })

  it('does not mark a purchase when GA throws, allowing a retry', () => {
    const gtag = vi.fn(() => {
      throw new Error('blocked')
    })
    const tracker = createGa4Tracker({
      measurementId: 'G-PROJECT',
      currency: 'mxn',
      gtag
    })
    const order = { id: 'order-1', business_id: 7 }

    expect(tracker.purchase(order, cart)).toBe(false)
    expect(tracker.purchase(order, cart)).toBe(false)
    expect(gtag).toHaveBeenCalledTimes(2)
  })
})
