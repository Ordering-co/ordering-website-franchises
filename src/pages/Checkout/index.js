import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { loadStripe } from '@stripe/stripe-js/pure'
import { useParams, useLocation } from 'react-router-dom'

import settings from '../../config'
import { HelmetTags } from '../../components/HelmetTags'

import { useEvent, useOrder, useLanguage, useSite, useBusiness } from '~components'
import { checkSiteUrl, Checkout } from '~ui'

const methodsWithoutAction = ['stripe_checkout', 'checkout_pro_mercadopago', 'epayco', 'interswitch']

export const CheckoutPage = (props) => {
  const { cartUuid } = useParams()
  const { search } = useLocation()
  const checkOutView = new URLSearchParams(search).get('view') || ''

  const [events] = useEvent()
  const [errors, setErrors] = useState([])
  const [orderState, { confirmCart, changeMoment }] = useOrder()
  const [, t] = useLanguage()
  const [{ site }] = useSite()
  const theme = useTheme()
  const [, { setBusiness }] = useBusiness()
  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const updatedBusinessSlug = (websiteThemeType === 'single_store' && websiteThemeBusinessSlug) || settings?.businessSlug

  const stripePayments = ['stripe', 'stripe_connect', 'stripe_direct', 'google_pay', 'apple_pay']
  const businessUrlTemplate = checkSiteUrl(site?.business_url_template, '/store/:business_slug')

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }

  const handleOrderRedirect = (uuid) => {
    events.emit('go_to_page', { page: 'order_detail', params: { orderId: uuid }, replace: true })
  }

  const actionsBeforePlace = async (paymethod, cart) => {
    if (stripePayments.includes(paymethod.gateway)) {
      try {
        const stripe = await loadStripe(paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key)
        const result = await stripe.confirmCardPayment(cart.paymethod_data.result.client_secret)
        if (result?.paymentIntent?.status === 'succeeded') {
          try {
            const confirmCartRes = await confirmCart(cartUuid)
            if (confirmCartRes.error) {
              setErrors(typeof confirmCartRes.result === 'string'
                ? [confirmCartRes.result]
                : confirmCartRes.result)
            }
            if (confirmCartRes.result.order?.uuid) {
              events.emit('go_to_page', { page: 'order_detail', params: { orderId: confirmCartRes.result.order.uuid }, replace: true })
            }
          } catch (error) {
            setErrors([error.message])
          }
        }
        if (result?.error?.code === 'payment_intent_authentication_failure') {
          setErrors([t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')])
        }
        return true
      } catch (error) {
        setErrors([error.message])
      }
    } else if (paymethod.gateway === 'stripe_redirect') {
      const stripe = await loadStripe(paymethod.paymethod?.credentials?.publishable)
      const confirmOption = {
        bancontact: {
          name: 'confirmBancontactPayment',
          type: 1
        },
        alipay: {
          name: 'confirmAlipayPayment',
          type: 2
        },
        giropay: {
          name: 'confirmGiropayPayment',
          type: 1
        },
        ideal: {
          name: 'confirmIdealPayment',
          type: 2
        }
      }
      const params = {
        1: {
          payment_method: {
            billing_details: cart.paymethod_data.data.owner
          },
          return_url: `${window.location.origin}/checkout/${cartUuid}`
        },
        2: {
          return_url: `${window.location.origin}/checkout/${cartUuid}`
        }
      }
      stripe[confirmOption[paymethod.data.type]?.name](
        cart.paymethod_data.result.client_secret,
        params[confirmOption[paymethod.data.type]?.type]
      ).then((result) => {
        if (result?.error) {
          setErrors([...errors, result?.error?.message])
        }
      }).catch((e) => {
        setErrors([...errors, e?.message || e?.toString()])
      })
    } else {
      if (cart?.paymethod_data?.result?.action?.type === 'redirect') {
        window.scrollTo(0, 0, { behavior: 'smooth' })
        window.location.replace(cart?.paymethod_data.result?.action?.redirect_url)
        return
      }
      if (methodsWithoutAction.includes(paymethod.gateway)) {
        window.scrollTo(0, 0, { behavior: 'smooth' })
        window.location.replace(cart?.paymethod_data.result?.redirect_url)
      }
    }
  }

  const checkoutProps = {
    ...props,
    propsToFetch: [
      'id',
      'name',
      'slug',
      'logo',
      'name',
      'email',
      'cellphone',
      'address',
      'address_notes',
      'paymethods',
      'open',
      'description',
      'location',
      'timezone',
      'schedule',
      'distance',
      'zones',
      'city',
      'city_id',
      'today',
      'valid_service',
      'configs'
    ],
    cartUuid,
    checkOutView,
    actionsBeforePlace,
    query: useQuery(),
    errors,
    clearErrors: () => setErrors([]),
    useValidationFields: true,
    validationFieldsType: 'checkout',
    useKioskApp: settings?.use_kiosk,
    businessSlug: updatedBusinessSlug,
    isListenOrderUpdate: true,
    returnUrl: `${window.location.origin}/checkout/${cartUuid}`,
    onPlaceOrderClick: (data, paymethod, cart) => {
      if (cart?.order?.uuid) {
        if (orderState?.options?.moment) {
          changeMoment(null)
        }
        if (cart?.business_id) {
          setBusiness({ ...cart?.business, id: cart?.business_id })
        }
        events.emit('go_to_page', { page: 'order_detail', params: { orderId: cart.order?.uuid }, replace: true })
      }
    },
    handleCheckoutRedirect: (uuid) => {
      events.emit('go_to_page', { page: 'checkout', params: { cartUuid: uuid } })
    },
    handleSearchRedirect: () => {
      events.emit('go_to_page', { page: 'order_types' })
    },
    handleCheckoutListRedirect: () => {
      events.emit('go_to_page', { page: 'checkout_list' })
    },
    handleStoreRedirect: (slug) => {
      if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
        events.emit('go_to_page', { page: 'business', params: { business_slug: slug } })
      } else {
        events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${slug}` })
      }
    },
    handleOrderRedirect
  }
  return (
    <>
      <HelmetTags page='checkout' />
      <Checkout {...checkoutProps} />
    </>
  )
}

export default CheckoutPage
