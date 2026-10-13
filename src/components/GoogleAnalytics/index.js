import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { useEvent, useOrder } from '~components'
import {
  createGa4Tracker,
  initializeGa4,
  normalizeMeasurementId
} from './ga4'

const getCarts = (orderState) => Object.values(orderState?.carts || {})

const findCart = (carts, reference = {}) => carts.find(cart => (
  (reference?.business_id && String(cart?.business_id) === String(reference.business_id)) ||
  (reference?.cartUuid && cart?.uuid === reference.cartUuid) ||
  (reference?.uuid && cart?.uuid === reference.uuid)
))

const findProduct = (cart, product) => cart?.products?.find(item => (
  (product?.code && item?.code === product.code) ||
  String(item?.product_id ?? item?.id) === String(product?.product_id ?? product?.id)
))

export const GoogleAnalytics = ({ measurementId, currency, affiliation }) => {
  const [events] = useEvent()
  const [orderState] = useOrder()
  const orderStateRef = useRef(orderState)
  const cartCacheRef = useRef({})
  const lastPagePathRef = useRef(null)
  const id = normalizeMeasurementId(measurementId)
  const [gtag, setGtag] = useState(null)
  const tracker = useMemo(
    () => createGa4Tracker({ measurementId: id, currency, affiliation, gtag }),
    [id, currency, affiliation, gtag]
  )

  useEffect(() => {
    if (!id) {
      setGtag(null)
      return
    }
    const nextGtag = initializeGa4({ measurementId: id })
    setGtag(() => nextGtag)
  }, [id])

  useEffect(() => {
    orderStateRef.current = orderState
    getCarts(orderState).forEach(cart => {
      if (cart?.business_id) cartCacheRef.current[cart.business_id] = cart
    })
  }, [orderState])

  useEffect(() => {
    if (!tracker.enabled) return

    const cacheCart = (cart) => {
      if (cart?.business_id) cartCacheRef.current[cart.business_id] = cart
    }
    const currentCarts = () => {
      const stateCarts = getCarts(orderStateRef.current)
      return stateCarts.length ? stateCarts : Object.values(cartCacheRef.current)
    }
    const cartWithOrderType = (cart) => cart && ({
      ...cart,
      order_type: cart?.delivery_type ?? cart?.order_type ?? orderStateRef.current?.options?.type
    })
    const cartFor = (reference) => (
      findCart(currentCarts(), reference) ??
      findCart(Object.values(cartCacheRef.current), reference)
    )
    const cachedCartFor = (reference) => (
      (reference?.business_id != null
        ? cartCacheRef.current[reference.business_id]
        : undefined) ?? cartFor(reference)
    )
    const trackCurrentPage = () => {
      if (lastPagePathRef.current === window.location.pathname) return
      lastPagePathRef.current = window.location.pathname
      tracker.pageView(window.location)
    }
    const handlePageView = ({ page, params } = {}) => {
      trackCurrentPage()
      const carts = currentCarts()
      if (page === 'multi_cart') carts.forEach(cart => tracker.viewCart(cartWithOrderType(cart)))
      if (page === 'checkout' || page === 'multi_checkout') {
        const selectedCarts = page === 'multi_checkout'
          ? carts
          : [cartFor(params)].filter(Boolean)
        selectedCarts.forEach(cart => {
          const checkoutCart = cartWithOrderType(cart)
          tracker.beginCheckout(checkoutCart)
          if (checkoutCart?.order_type !== undefined) {
            tracker.addShippingInfo(checkoutCart)
          }
        })
      }
    }
    const handleProductListViewed = (payload) => tracker.viewItemList(payload)
    const handleProductClicked = (product) => {
      tracker.selectItem(product)
      tracker.viewItem(product)
    }
    const handleProductAdded = (product, cart) => {
      cacheCart(cart)
      tracker.addToCart(product, cart)
    }
    const handleProductRemoved = (product, cart) => {
      tracker.removeFromCart(product, cart)
      cacheCart(cart)
    }
    const handleProductUpdated = (product, cart) => {
      const previousCart = cachedCartFor(cart)
      const previousProduct = findProduct(previousCart, product)
      const updatedProduct = findProduct(cart, product)
      const previousQuantity = Number(previousProduct?.quantity) || 0
      const updatedQuantity = Number(updatedProduct?.quantity) || 0
      const quantityDifference = updatedQuantity - previousQuantity

      if (quantityDifference > 0) {
        tracker.addToCart({ ...updatedProduct, quantity: quantityDifference }, cart)
      } else if (quantityDifference < 0) {
        tracker.removeFromCart({ ...previousProduct, quantity: Math.abs(quantityDifference) }, cart)
      }
      cacheCart(cart)
    }
    const handleCartUpdated = (cart) => cacheCart(cart)
    const handleCartViewed = (carts) => {
      const viewedCarts = Array.isArray(carts) ? carts : [carts]
      viewedCarts.filter(Boolean).forEach(cart => {
        cacheCart(cart)
        tracker.viewCart(cartWithOrderType(cart))
      })
    }
    const handlePayment = (paymethod) => {
      const cartUuid = window.location.pathname.match(/^\/checkout\/([^/]+)/)?.[1]
      const checkoutCarts = cartUuid
        ? [cartFor({ cartUuid })].filter(Boolean)
        : currentCarts()
      checkoutCarts.forEach(cart => tracker.addPaymentInfo(cartWithOrderType(cart), paymethod))
    }
    const handleOrderPlaced = (order) => {
      const cart = cachedCartFor(order)
      tracker.purchase(order, cartWithOrderType(cart))
      if (order?.business_id) delete cartCacheRef.current[order.business_id]
    }
    const handleLogin = () => tracker.login('ordering')
    const handleSignUp = () => tracker.signUp('ordering')

    lastPagePathRef.current = null
    trackCurrentPage()
    events.on('change_view', handlePageView)
    events.on('product_list_viewed', handleProductListViewed)
    events.on('product_clicked', handleProductClicked)
    events.on('product_added', handleProductAdded)
    events.on('cart_product_removed', handleProductRemoved)
    events.on('cart_product_updated', handleProductUpdated)
    events.on('cart_updated', handleCartUpdated)
    events.on('cart_viewed', handleCartViewed)
    events.on('add_payment_option', handlePayment)
    events.on('order_placed', handleOrderPlaced)
    events.on('userLogin', handleLogin)
    events.on('singup_user', handleSignUp)

    return () => {
      events.off('change_view', handlePageView)
      events.off('product_list_viewed', handleProductListViewed)
      events.off('product_clicked', handleProductClicked)
      events.off('product_added', handleProductAdded)
      events.off('cart_product_removed', handleProductRemoved)
      events.off('cart_product_updated', handleProductUpdated)
      events.off('cart_updated', handleCartUpdated)
      events.off('cart_viewed', handleCartViewed)
      events.off('add_payment_option', handlePayment)
      events.off('order_placed', handleOrderPlaced)
      events.off('userLogin', handleLogin)
      events.off('singup_user', handleSignUp)
    }
  }, [events, tracker])

  return null
}

GoogleAnalytics.propTypes = {
  measurementId: PropTypes.string,
  currency: PropTypes.string,
  affiliation: PropTypes.string
}

export default GoogleAnalytics
