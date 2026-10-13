const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/i
const CURRENCY_PATTERN = /^[A-Z]{3}$/
const PURCHASE_STORAGE_PREFIX = 'ordering:ga4:purchase:'
const ORDER_TYPES = {
  1: 'delivery',
  2: 'pickup',
  3: 'eatin',
  4: 'curbside',
  5: 'drivethru',
  7: 'catering_delivery',
  8: 'catering_pickup',
  9: 'reservation'
}

const toFiniteNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

const compact = (object) => Object.fromEntries(
  Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== '')
)

export const normalizeMeasurementId = (value) => {
  if (typeof value !== 'string') return null
  const measurementId = value.trim().toUpperCase()
  return GA4_ID_PATTERN.test(measurementId) ? measurementId : null
}

export const normalizeCurrency = (value) => {
  if (typeof value !== 'string') return undefined
  const currency = value.trim().toUpperCase()
  return CURRENCY_PATTERN.test(currency) ? currency : undefined
}

export const normalizeOrderType = (value) => {
  if (value === undefined || value === null || value === '') return undefined
  return ORDER_TYPES[value] ?? String(value).trim().toLowerCase().replace(/\s+/g, '_')
}

const normalizePaymentType = (value) => {
  if (typeof value !== 'string') return undefined
  return value.trim().toLowerCase().replace(/\s+/g, '_') || undefined
}

const getProductId = (product) => product?.product_id ?? product?.id

const getUnitPrice = (product) => {
  const price = toFiniteNumber(
    product?.price_with_discount ??
    product?.price ??
    product?.product?.price
  )
  if (price !== undefined) return price

  const total = toFiniteNumber(product?.total)
  const quantity = toFiniteNumber(product?.quantity) || 1
  return total !== undefined ? total / quantity : undefined
}

export const mapProductToGa4Item = (product, context = {}) => {
  if (!product) return null

  const itemId = getProductId(product)
  const itemName = product?.name ?? product?.product?.name
  if (itemId === undefined && !itemName) return null

  const quantity = toFiniteNumber(product?.quantity) || 1
  const originalPrice = toFiniteNumber(product?.price)
  const currentPrice = getUnitPrice(product)
  const discount = originalPrice !== undefined && currentPrice !== undefined
    ? Math.max(originalPrice - currentPrice, 0)
    : toFiniteNumber(product?.discount)

  return compact({
    item_id: itemId !== undefined ? String(itemId) : undefined,
    item_name: itemName,
    affiliation: context.affiliation,
    item_brand: product?.brand ?? product?.business?.name ?? context.businessName ?? context.affiliation,
    item_category: product?.category?.name ?? product?.category_name,
    item_category2: product?.subcategory?.name ?? product?.subcategory_name,
    item_variant: product?.variant?.name ?? product?.variant_name,
    coupon: product?.coupon ?? context.coupon,
    discount,
    price: currentPrice,
    quantity,
    index: context.index,
    item_list_id: context.itemListId,
    item_list_name: context.itemListName
  })
}

export const mapProductsToGa4Items = (products = [], context = {}) => (
  products
    .map((product, index) => mapProductToGa4Item(product, { ...context, index }))
    .filter(Boolean)
)

const calculateItemsValue = (items) => {
  if (!items.length) return undefined
  return items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0)
}

const getCartCurrency = (cart, configuredCurrency) => normalizeCurrency(
  cart?.currency ?? cart?.currency_code ?? configuredCurrency
)

const getDefaultStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch (error) {
    return null
  }
}

export const mapCartToGa4 = (cart, context = {}) => {
  const items = mapProductsToGa4Items(cart?.products, {
    affiliation: context.affiliation,
    businessName: cart?.business?.name,
    coupon: cart?.coupon
  })
  const currency = getCartCurrency(cart, context.currency)
  const explicitValue = toFiniteNumber(
    cart?.subtotal_with_discount ??
    cart?.subtotal
  )
  const value = explicitValue ?? calculateItemsValue(items)

  return compact({
    currency,
    value: currency ? value : undefined,
    coupon: cart?.coupon,
    items,
    affiliation: cart?.business?.name ?? context.affiliation,
    store_id: cart?.business_id ?? cart?.business?.id,
    order_type: normalizeOrderType(cart?.delivery_type ?? cart?.order_type ?? context.orderType)
  })
}

export const mapOrderToGa4 = (order, cart, context = {}) => {
  const cartParams = mapCartToGa4(cart, context)
  const currency = normalizeCurrency(
    order?.currency ?? order?.currency_code ?? cartParams.currency ?? context.currency
  )
  const transactionId = order?.transaction_id ?? order?.uuid ?? order?.id

  return compact({
    transaction_id: transactionId !== undefined ? String(transactionId) : undefined,
    affiliation: order?.affiliation ?? order?.business?.name ?? context.affiliation,
    currency,
    value: currency ? cartParams.value : undefined,
    tax: toFiniteNumber(order?.tax_total ?? order?.tax),
    shipping: toFiniteNumber(
      order?.delivery_zone_price ??
      order?.delivery_price_with_discount ??
      order?.delivery_price
    ),
    coupon: order?.coupon ?? cartParams.coupon,
    items: cartParams.items,
    store_id: order?.business_id ?? cartParams.store_id,
    order_type: normalizeOrderType(order?.delivery_type ?? cartParams.order_type),
    payment_type: normalizePaymentType(order?.paymethod?.gateway ?? order?.paymethod)
  })
}

export const initializeGa4 = ({ measurementId, windowObject = window, documentObject = document }) => {
  const id = normalizeMeasurementId(measurementId)
  if (!id || !windowObject || !documentObject) return null

  windowObject.dataLayer = windowObject.dataLayer || []
  windowObject.gtag = windowObject.gtag || function () {
    windowObject.dataLayer.push(arguments)
  }

  const scriptId = `ordering-ga4-${id}`
  if (!documentObject.getElementById(scriptId)) {
    const script = documentObject.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    documentObject.head.appendChild(script)
  }

  windowObject.__orderingGa4Configured = windowObject.__orderingGa4Configured || {}
  if (!windowObject.__orderingGa4Configured[id]) {
    windowObject.gtag('js', new Date())
    windowObject.gtag('config', id, { send_page_view: false })
    windowObject.__orderingGa4Configured[id] = true
  }
  return windowObject.gtag
}

export const createGa4Tracker = ({
  measurementId,
  currency,
  affiliation,
  gtag,
  storage = getDefaultStorage()
}) => {
  const id = normalizeMeasurementId(measurementId)
  const sentPurchases = new Set()

  const send = (eventName, params = {}) => {
    if (!id || typeof gtag !== 'function') return false
    try {
      gtag('event', eventName, compact({ ...params, send_to: id }))
      return true
    } catch (error) {
      return false
    }
  }

  const wasPurchaseSent = (transactionId) => {
    const key = `${PURCHASE_STORAGE_PREFIX}${id}:${transactionId}`
    if (sentPurchases.has(key)) return true
    try {
      return storage?.getItem(key) === '1'
    } catch (error) {
      return false
    }
  }

  const markPurchaseSent = (transactionId) => {
    const key = `${PURCHASE_STORAGE_PREFIX}${id}:${transactionId}`
    sentPurchases.add(key)
    try {
      storage?.setItem(key, '1')
    } catch (error) {
      // In-memory deduplication remains active when browser storage is unavailable.
    }
  }

  const cartParams = (cart, extra = {}) => ({
    ...mapCartToGa4(cart, { currency, affiliation, orderType: extra.orderType }),
    ...compact(extra)
  })

  return {
    enabled: Boolean(id && typeof gtag === 'function'),
    pageView: (location) => send('page_view', compact({
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      page_location: location ? `${location.origin}${location.pathname}` : undefined,
      page_path: location?.pathname
    })),
    viewItemList: ({ products, business, listId, listName }) => send('view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items: mapProductsToGa4Items(products, {
        affiliation,
        businessName: business?.name,
        itemListId: listId,
        itemListName: listName
      })
    }),
    selectItem: (product) => {
      const item = mapProductToGa4Item(product, { affiliation })
      return item && send('select_item', {
        item_list_id: product?.category_id,
        item_list_name: product?.category?.name,
        items: [item]
      })
    },
    viewItem: (product) => {
      const item = mapProductToGa4Item(product, { affiliation })
      const itemCurrency = normalizeCurrency(product?.currency ?? currency)
      return item && send('view_item', compact({
        currency: itemCurrency,
        value: itemCurrency ? (item.price || 0) * (item.quantity || 1) : undefined,
        items: [item]
      }))
    },
    addToCart: (product, cart) => {
      const currentProduct = cart?.products?.find(item => String(getProductId(item)) === String(getProductId(product))) ?? product
      const item = mapProductToGa4Item(currentProduct, {
        affiliation,
        businessName: cart?.business?.name
      })
      const itemCurrency = getCartCurrency(cart, currency)
      return item && send('add_to_cart', compact({
        currency: itemCurrency,
        value: itemCurrency ? (item.price || 0) * (toFiniteNumber(product?.quantity) || 1) : undefined,
        items: [{ ...item, quantity: toFiniteNumber(product?.quantity) || 1 }]
      }))
    },
    removeFromCart: (product, cart) => {
      const item = mapProductToGa4Item(product, {
        affiliation,
        businessName: cart?.business?.name
      })
      const itemCurrency = getCartCurrency(cart, currency)
      return item && send('remove_from_cart', compact({
        currency: itemCurrency,
        value: itemCurrency ? (item.price || 0) * (item.quantity || 1) : undefined,
        items: [item]
      }))
    },
    viewCart: (cart) => send('view_cart', cartParams(cart)),
    beginCheckout: (cart) => send('begin_checkout', cartParams(cart)),
    addShippingInfo: (cart) => send(
      'add_shipping_info',
      cartParams(cart, {
        shipping_tier: normalizeOrderType(cart?.delivery_type ?? cart?.order_type)
      })
    ),
    addPaymentInfo: (cart, paymethod) => send(
      'add_payment_info',
      cartParams(cart, {
        payment_type: normalizePaymentType(paymethod?.gateway ?? paymethod?.name)
      })
    ),
    login: (method) => send('login', { method }),
    signUp: (method) => send('sign_up', { method }),
    purchase: (order, cart) => {
      const params = mapOrderToGa4(order, cart, { currency, affiliation })
      if (!params.transaction_id || !params.items?.length || wasPurchaseSent(params.transaction_id)) return false
      const sent = send('purchase', params)
      if (sent) markPurchaseSent(params.transaction_id)
      return sent
    }
  }
}
