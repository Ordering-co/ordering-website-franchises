import React, { useEffect, useMemo, useState, useRef } from 'react'
import VscWarning from '@meronex/icons/vsc/VscWarning'
import { ChevronUp, ChevronLeft } from 'react-bootstrap-icons'
import Skeleton from 'react-loading-skeleton'
import { useTheme } from 'styled-components'
import parsePhoneNumber from 'libphonenumber-js'
import moment from 'moment'

import {
  Container,
  WrapperLeftContainer,
  UserDetailsContainer,
  BusinessDetailsContainer,
  PaymentMethodContainer,
  DriverTipContainer,
  CartContainer,
  WrapperPlaceOrderButton,
  WarningMessage,
  CartsList,
  WarningText,
  WrapperUserDetails,
  WrapperRightContainer,
  WrapperLeftContent,
  DriverTipDivider,
  DeliveryOptionsContainer,
  WalletPaymentOptionContainer,
  CartHeader,
  SelectSpotContainer,
  WrapperActionsInput,
  MobileWrapperPlaceOrderButton,
  AuthButtonList,
  SectionTitleContainer,
  FirstViewContainer,
  AddressOrderTypeContainer,
  CartInfoWrapper,
  Accordion,
  AccordionContent,
  CommentContainer,
  Spinner,
  MomentContainer,
  OrderInfoWrapper,
  PayCardSelected,
  CardItemContent,
  OrderBill,
  BackButtonWrapper,
  AddressInfoWrapper
} from './styles'

import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useConfig,
  useCustomer,
  useEvent,
  useBusiness,
  useToast,
  ToastType
} from '~components'

import { OrderDetail } from './OrderDetail'
import {
  createConfirmCartLock,
  isTrustedPaymentPluginOrigin,
  parsePaymentPluginMessage,
  shouldIgnoreIframePayment
} from './iframePaymentMessage'
import { getCheckoutCartFetchPlan } from './getCheckoutCartFetchPlan'
import { shouldSkipPlaceOrderAsGuest } from './guestPlaceOrder'
import { isEatInSpotNumberMissing } from './isEatInSpotNumberMissing'
import { parseJsonStorage } from '~/utils/parseJsonStorage'
import { parseDriverTipOptions } from '~/utils/parseDriverTipOptions'

import {
  Modal,
  useWindowSize,
  Button,
  Input,
  Alert,
  Select,
  NotFoundSource,
  SignUpForm,
  LoginForm,
  UpsellingPage,
  AddressDetails,
  UserDetails,
  PaymentOptions,
  PaymentOptionWallet,
  DriverTips,
  Cart,
  CartFirstView,
  CartContent,
  PlaceSpot,
  MomentContent,
  OrderTypeSelector,
  AddressOrderType,
  TextArea,
  SpinnerLoader,
  generalUtilities,
  capitalize,
  verifyDecimals,
  BusinessInformation,
  CouponControl
} from '~ui'

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
}

const methodsWithRequiredCards = ['globalpay', 'cybersource']
const methodsWithIframeCards = ['globalpay', 'cybersource']

const CheckoutUI = (props) => {
  const {
    cart,
    errors,
    placing,
    cartState,
    useKioskApp,
    loyaltyPlansState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    handleOrderRedirect,
    isCustomerMode,
    isResetPaymethod,
    setIsResetPaymethod,
    handleChangeDeliveryOption,
    handleChangeComment,
    instructionsOptions,
    deliveryOptionSelected,
    handleStoreRedirect,
    onPlaceOrderClick,
    setPlaceSpotNumber,
    checkoutFieldsState,
    commentState,
    returnUrl,
    checkOutView,
    hideDeliveryFee,
    globalPayIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod
  } = props

  const theme = useTheme()
  const [{ options, loading }, { confirmCart }] = useOrder()
  const [, t] = useLanguage()
  const [{ parsePrice, parseDate, parseNumber }] = useUtils()
  const [{ user, loading: userLoading }, { login }] = useSession()
  const [ordering] = useApi()
  const isArchiesColombia = String(ordering?.project || '').trim().toLowerCase() === 'archiescolombia'
  const [{ configs }] = useConfig()
  const [, { setBusiness }] = useBusiness()
  const [, { showToast }] = useToast()
  const [customerState] = useCustomer()
  const [events] = useEvent()
  const content = useRef(null)
  const windowSize = useWindowSize()
  const { getIconCard, addQueryToUrl, walletName } = generalUtilities()

  const [errorCash, setErrorCash] = useState(false)
  const [userErrors, setUserErrors] = useState([])
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(null)
  const [behalfName, setBehalfName] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [requiredFields, setRequiredFields] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false, iframe: false, loading: false })
  const [allowedGuest, setAllowedGuest] = useState(false)
  const [cardList, setCardList] = useState([])
  const [paymethodClicked, setPaymethodClicked] = useState(null)
  const [productLoading, setProductLoading] = useState(false)
  const [firstViewCheckout, setFirstViewCheckout] = useState(checkOutView === 'cart' || !checkOutView)
  const [showPaymentMethods, setShowPaymentMethods] = useState(checkOutView === 'paymethods')
  const [accordionOrderSummary, setAccordionOrderSummary] = useState('')
  const [accordionAddInstructions, setAccordionAddInstructions] = useState('')
  const [setHeight] = useState('0px')
  const [setRotate, setRotateState] = useState('accordion-icon')

  const cardsMethods = ['stripe', 'credomatic']
  const stripePaymethods = ['stripe', 'stripe_connect', 'stripe_redirect']
  const businessConfigs = businessDetails?.business?.configs ?? []
  const isTableNumberEnabled = configs?.table_numer_enabled?.value
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'
  const isWalletCashEnabled = businessConfigs.find(config => config.key === 'wallet_cash_enabled')?.value === '1'
  const isWalletCreditPointsEnabled = businessConfigs.find(config => config.key === 'wallet_credit_point_enabled')?.value === '1'
  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' &&
    (isWalletCashEnabled || isWalletCreditPointsEnabled) && !useKioskApp && !isCustomerMode
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
  const hexTest = /[0-9A-Fa-f]{6}/g
  const primaryColor = theme?.colors?.primary?.split?.('#')?.[1]
  const placeSpotTypes = [3, 4, 5]
  const placeSpotsEnabled = placeSpotTypes.includes(options?.type) && !useKioskApp
  const isGiftCardCart = !cart?.business_id
  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter(field => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const guestCheckoutDriveTip = useMemo(() => checkoutFields?.find(field => field.order_type_id === 1 && field?.validation_field?.code === 'driver_tip'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutComment = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'comments'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutCoupon = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'coupon'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutZipcode = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'zipcode'), [JSON.stringify(checkoutFields), options])
  const extraValueAdjustment = cart?.metafields?.filter?.(meta => meta?.key?.includes('extra_value') && ![0, -0].includes(parseFloat(meta?.value)))

  // const [hasBusinessPlaces, setHasBusinessPlaces] = useState(null)
  const validateCommentsCartField = (guestCheckoutComment?.enabled && (user?.guest_id ? guestCheckoutComment?.required_with_guest : guestCheckoutComment?.required)) && (cart?.comment === null || cart?.comment?.trim().length === 0)
  const validateDriverTipField = options.type === 1 && (guestCheckoutDriveTip?.enabled && (user?.guest_id ? guestCheckoutDriveTip?.required_with_guest : guestCheckoutDriveTip?.required)) && (Number(cart?.driver_tip) <= 0)
  const validateCouponField = (guestCheckoutCoupon?.enabled && (user?.guest_id ? guestCheckoutCoupon?.required_with_guest : guestCheckoutCoupon?.required)) && !cart?.offers?.some(offer => offer?.type === 2)
  const validateZipcodeCard = (guestCheckoutZipcode?.enabled && (user?.guest_id ? guestCheckoutZipcode?.required_with_guest : guestCheckoutZipcode?.required)) && paymethodSelected?.gateway === 'stripe' && paymethodSelected?.data?.card && !paymethodSelected?.data?.card?.zipcode
  const validateRequiredCardField = methodsWithRequiredCards.includes(paymethodSelected?.gateway) && (
    paymethodSelected?.gateway === 'cybersource'
      ? !(paymethodSelected?.data?.card_token || paymethodSelected?.data?.transient_token)
      : !(paymethodSelected?.data?.card_token && cardList?.cards?.some(card => card?.id === paymethodSelected?.data?.id && card?.card_token === paymethodSelected?.data?.card_token))
  )
  const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true')
  const eatInSpotNumberMissing = isEatInSpotNumberMissing({
    tableNumberEnabled: isTableNumberEnabled,
    orderType: options?.type,
    cartSpotNumber: cart?.spot_number,
    cartStateSpotNumber: cartState?.cart?.spot_number
  })
  const isDisablePlaceOrderButton = !cart?.valid ||
    ((!paymethodSelected || ((!cart?.paymethod_id && cart?.business_id) || (!paymethodSelected && !cart?.business_id))) && cart?.balance > 0) ||
    (cardsMethods.includes(paymethodSelected?.gateway) && cardList?.cards?.length === 0) ||
    placing ||
    errorCash ||
    loading ||
    eatInSpotNumberMissing ||
    !cart?.valid_maximum ||
    (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100)) ||
    // (((placeSpotTypes.includes(options?.type) && !cart?.place) && hasBusinessPlaces)) ||
    validateCommentsCartField ||
    validateDriverTipField ||
    validateCouponField ||
    validateZipcodeCard ||
    (!cart?.reservation && options?.type === 9) ||
    validateRequiredCardField

  const driverTipsOptions = parseDriverTipOptions(configs?.driver_tip_options?.value)

  const deliveryOptions = instructionsOptions?.result && Array.isArray(instructionsOptions?.result) && instructionsOptions?.result?.filter(option => option?.enabled)?.map(option => {
    return {
      value: option?.id, content: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name), showOnSelected: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name)
    }
  })

  const paymentSelectedName = businessDetails?.business?.paymethods?.find(({ paymethod }) => paymethod?.id === cart?.paymethod_id)?.paymethod?.gateway
  const hideBusinessAddress = true
  const hideBusinessDetails = true
  const hideBusinessMap = true
  const hideCustomerDetails = true
  const driverTipsField = !cartState.loading && cart && cart?.business_id && options.type === 1 && cart?.status !== 2 && (guestCheckoutDriveTip?.enabled) && driverTipsOptions.length > 0 && !useKioskApp

  const creditPointPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'credit_point')
  const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find(b => b.business_id === cart?.business_id && b.accumulates)

  const getIncludedTaxes = (isDeliveryFee) => {
    if (cart?.taxes === null) {
      return cart?.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded, tax) => {
        return taxIncluded + (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') || (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter(tax => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry, tax) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  const handleChangeCartView = (view = null) => {
    window?.scrollTo(0, 0)
    if (view) {
      addQueryToUrl({ view })
      return
    }
    if (user?.guest_id) {
      handleGoToPage({ page: 'login', params: { cartUuid: cart?.uuid } })
      return
    }
    addQueryToUrl({ view: 'checkout' })
    setFirstViewCheckout(!firstViewCheckout)
  }

  const handleChangeShowPaymentMethods = () => {
    window?.scrollTo(0, 0)
    addQueryToUrl({ view: 'paymethods' })
    setShowPaymentMethods(!showPaymentMethods)
  }

  const handleChangeToCheckoutView = () => {
    window?.scrollTo(0, 0)
    addQueryToUrl({ view: 'checkout' })
    setShowPaymentMethods(false)
    setFirstViewCheckout(false)
  }

  const handlePlaceOrder = () => {
    if (placing) return
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
      setOpenModal({ ...openModal, signup: true, isGuest: true })
      return
    }

    if ((!userErrors.length && !requiredFields?.length) || (requiredFields?.length === 1 && isCustomerMode && requiredFields?.includes('email'))) {
      const body = {}
      if (behalfName) {
        body.on_behalf_of = behalfName
      }
      handlerClickPlaceOrder && handlerClickPlaceOrder(null, body)
      return
    }
    if (requiredFields?.length) {
      setIsOpen(true)
      return
    }
    setAlertState({
      open: true,
      content: Object.values(userErrors).map(error => error)
    })
    setIsUserDetailsEdit(true)
  }

  const handleOpenGuestSignup = () => {
    setOpenModal({ ...openModal, signup: true, isGuest: true })
  }

  const handlePlaceOrderAsGuest = () => {
    if (shouldSkipPlaceOrderAsGuest(placing)) return
    setIsOpen(false)
    const body = {}
    if (behalfName) {
      body.on_behalf_of = behalfName
    }
    handlerClickPlaceOrder && handlerClickPlaceOrder(null, body)
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
    setIsUserDetailsEdit(false)
  }

  const checkGuestValidationFields = () => {
    const userSelected = isCustomerMode ? customerState.user : user
    const _requiredFields = checkoutFieldsState?.fields
      .filter((field) => (field?.order_type_id === options?.type) && field?.enabled && field?.required_with_guest &&
        !notFields.includes(field?.validation_field?.code) &&
        field?.validation_field?.code !== 'email' &&
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field) => field.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    const guestCheckoutEmail = checkoutFieldsState?.fields?.find((field) => field.order_type_id === options?.type && field?.validation_field?.code === 'email')
    if (
      userSelected &&
      !userSelected?.guest_cellphone &&
      ((guestCheckoutCellPhone?.enabled &&
        guestCheckoutCellPhone?.required_with_guest) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      requiredFieldsCode.push('cellphone')
    }
    if (
      userSelected &&
      !userSelected?.guest_email &&
      guestCheckoutEmail?.enabled &&
      guestCheckoutEmail?.required_with_guest
    ) {
      requiredFieldsCode.push('email')
    }
    setRequiredFields(requiredFieldsCode)
  }

  const checkValidationFields = () => {
    setUserErrors([])
    const errors = []
    const userSelected = isCustomerMode ? customerState.user : user
    const _requiredFields = []
    Object.values(checkoutFieldsState?.fields).map(field => {
      if (options?.type === field?.order_type_id &&
        field?.enabled &&
        field?.required &&
        !notFields.includes(field?.validation_field?.code)
      ) {
        if (userSelected && !userSelected[field?.validation_field?.code]) {
          _requiredFields.push(field?.validation_field?.code)
        }
      }
    })
    const mobilePhoneField = Object.values(checkoutFieldsState?.fields)?.find(field => field?.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    if (
      userSelected &&
      !userSelected?.cellphone &&
      ((mobilePhoneField?.enabled &&
        mobilePhoneField?.required) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      _requiredFields.push('cellphone')
    }
    setRequiredFields(_requiredFields)
    if (userSelected && userSelected?.cellphone) {
      if (userSelected?.country_phone_code) {
        let phone = null
        phone = `+${userSelected?.country_phone_code}${userSelected?.cellphone.replace(`+${userSelected?.country_phone_code}`, '')}`
        const phoneNumber = parsePhoneNumber(phone)
        if (parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10) && !phoneNumber?.isValid()) {
          errors.push(t('VALIDATION_ERROR_MOBILE_PHONE_INVALID', 'The field Phone number is invalid.'))
        }
      } else {
        errors.push(t('INVALID_ERROR_COUNTRY_CODE_PHONE_NUMBER', 'The country code of the phone number is invalid'))
      }
    }

    setUserErrors(errors)
  }

  const handleSuccessSignup = async (user) => {
    await login({
      user,
      token: user?.session?.access_token
    })
    if (openModal?.isGuest && requiredFields?.length === 0 && !isDisablePlaceOrderButton) {
      handlePlaceOrderAsGuest()
    }
    setOpenModal({ ...openModal, signup: false, isGuest: false })
  }

  const handleSuccessLogin = (user) => {
    if (user) setOpenModal({ ...openModal, login: false })
  }

  const handleScrollTo = () => {
    if (!((!paymethodSelected && cart?.balance > 0) && cart?.status !== 2)) return
    const scrollElement = document.querySelector('.paymentsContainer')
    window.scrollTo(0, scrollElement.offsetTop - 20)
  }

  const toggleAccordion = (e, type) => {
    if (type === 'orderSummary') {
      setAccordionOrderSummary(accordionOrderSummary === '' ? 'active' : '')
      setRotateState(
        accordionOrderSummary === 'active' ? 'accordion-icon' : 'accordion-icon rotate'
      )
    }
    if (type === 'addInstructions') {
      setAccordionAddInstructions(accordionAddInstructions === '' ? 'active' : '')
    }
  }

  const handleGoBack = () => {
    window?.scrollTo(0, 0)
    if (window.location.search.includes('view=paymethods')) {
      addQueryToUrl({ view: 'checkout' })
      setShowPaymentMethods(false)
      setFirstViewCheckout(false)
    } else if (window.location.search.includes('view=checkout')) {
      addQueryToUrl({ view: 'cart' })
      setShowPaymentMethods(false)
      setFirstViewCheckout(true)
    } else {
      if (cart?.business_id !== null) {
        handleStoreRedirect(cart?.business?.slug)
      } else {
        events.emit('go_to_page', { page: 'wallets' })
      }
    }
  }

  const handleCloseIframe = async () => {
    setOpenModal((prev) => ({ ...prev, loading: true, iframe: false }))
    if (!methodsWithIframeCards.includes(paymethodSelected?.gateway)) {
      await confirmCart(cart?.uuid, {})
    }
    setOpenModal((prev) => ({ ...prev, loading: false }))
  }

  useEffect(() => {
    if (checkoutFieldsState?.loading || customerState.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, customerState, options?.type])

  useEffect(() => {
    if (errors) {
      setAlertState({
        open: true,
        content: errors
      })
    }
  }, [errors])

  useEffect(() => {
    if (isResetPaymethod) {
      handlePaymethodChange(null)
      setIsResetPaymethod(true)
      // changePaymethod(cart?.business_id, null, null)
    }
  }, [isResetPaymethod])

  useEffect(() => {
    if (cart?.products?.length || !userLoading) return
    if (cart?.business_id !== null) {
      handleStoreRedirect(cart?.business?.slug)
    } else {
      events.emit('go_to_page', { page: 'wallets' })
    }
  }, [JSON.stringify(cart?.products)])

  useEffect(() => {
    setShowPaymentMethods(checkOutView === 'paymethods')
    setFirstViewCheckout(checkOutView === 'cart' || !checkOutView)
  }, [checkOutView])

  useEffect(() => {
    if (!businessDetails?.business?.id) return
    setBusiness(businessDetails?.business)
  }, [businessDetails?.business])

  useEffect(() => {
    if (!isGiftCardCart || cart?.products?.length > 0 || !cart?.paymethod_data?.result?.action?.iframe_url) return
    events.emit('go_to_page', { page: 'home' })
  }, [isGiftCardCart, JSON.stringify(cart?.products), cart?.paymethod_data?.result?.action?.iframe_url])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const confirmLock = createConfirmCartLock()
    const handleMessage = async (event) => {
      if (!isTrustedPaymentPluginOrigin(event?.origin)) return
      const payment = parsePaymentPluginMessage(event.data)
      if (!payment || shouldIgnoreIframePayment(payment)) return
      if (!confirmLock.tryAcquire()) return
      try {
        const paymentData = {
          [`${cart?.paymethod_data?.gateway}_data`]: {
            ...payment?.data
          }
        }
        const confirmCartRes = await confirmCart(cart?.uuid, paymentData)
        if (confirmCartRes.error) {
          showToast(ToastType.Error, confirmCartRes.error.message)
        }
        if (confirmCartRes?.result?.order?.uuid) {
          handleOrderRedirect(confirmCartRes.result.order?.uuid)
        }
        setOpenModal((prev) => ({ ...prev, iframe: false }))
      } catch (error) {
        showToast(ToastType.Error, error?.message)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [cart?.paymethod_data?.gateway, cart?.uuid])

  useEffect(() => {
    if (cart?.paymethod_data?.result?.action?.type === 'iframe' && cart?.status === 2) {
      setOpenModal((prev) => ({ ...prev, iframe: true }))
    } else {
      setOpenModal((prev) => ({ ...prev, iframe: false }))
    }
  }, [cart?.paymethod_data?.result?.action])

  return (
    <div>
      <BackButtonWrapper onClick={handleGoBack}>
        <ChevronLeft />
        <h2>{t('BACK', 'Back')}</h2>
      </BackButtonWrapper>
      {!showPaymentMethods && (
        <AddressOrderTypeContainer>
          <AddressOrderType />
        </AddressOrderTypeContainer>
      )}
      <Container>
        {firstViewCheckout && (
          <FirstViewContainer>
            <CartInfoWrapper>
              <CartFirstView
                isCustomMode
                isCartPending={cart?.status === 2}
                cart={cart}
                isCheckout
                isProducts={cart?.products?.length || 0}
                viewString='checkout'
                businessConfigs={businessConfigs}
                handleChangeCartView={handleChangeCartView}
                loyaltyRewardRate={
                  creditPointPlanOnBusiness?.accumulation_rate ??
                  (!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
                }
                productLoading={productLoading}
                setProductLoading={setProductLoading}
                hideDriverTip
                hideCouponByValidationCheckout
                hideCommentsByValidationCheckout
                hideCouponInput
              />
            </CartInfoWrapper>
          </FirstViewContainer>
        )}
        {!firstViewCheckout && (
          <>
            {showPaymentMethods && (
              <>
                {!cartState.loading && cart && (
                  <PaymentMethodContainer className='paymentsContainer'>
                    <SectionTitleContainer>
                      <h1 className='title'>{t('SELECT_PAYMENT_METHOD', 'Select payment method')}</h1>
                    </SectionTitleContainer>
                    <PaymentOptions
                      showPaymentMethods={showPaymentMethods}
                      cart={cart}
                      useKioskApp={useKioskApp}
                      isDisabled={cart?.status === 2}
                      businessId={!isGiftCardCart ? businessDetails?.business?.id : -1}
                      isLoading={!isGiftCardCart ? businessDetails.loading : false}
                      paymethods={businessDetails?.business?.paymethods}
                      onPaymentChange={handlePaymethodChange}
                      errorCash={errorCash}
                      setErrorCash={setErrorCash}
                      handleOrderRedirect={handleOrderRedirect}
                      isCustomerMode={isCustomerMode}
                      paySelected={paymethodSelected}
                      handlePlaceOrder={handlePlaceOrder}
                      onPlaceOrderClick={onPlaceOrderClick}
                      setCardList={setCardList}
                      setShowPaymentMethods={setShowPaymentMethods}
                      requiredFields={requiredFields}
                      openUserModal={setIsOpen}
                      paymethodClicked={paymethodClicked}
                      setPaymethodClicked={setPaymethodClicked}
                      handleOpenGuestSignup={handleOpenGuestSignup}
                      validateDriverTipField={validateDriverTipField}
                      returnUrl={returnUrl}
                      createBusinessUserPaymethod={createBusinessUserPaymethod}
                      setOpenModal={setOpenModal}
                      handleChangeToCheckoutView={handleChangeToCheckoutView}
                    />
                    {((cart?.paymethod_id && paymethodSelected) || (!cart?.business_id && paymethodSelected)) && (
                      <Button
                        color='primary'
                        disabled={validateRequiredCardField}
                        onClick={() => {
                          setShowPaymentMethods(false)
                          handleChangeCartView('checkout')
                        }}
                      >
                        {t('CONTINUE', 'Continue')}
                      </Button>
                    )}
                  </PaymentMethodContainer>
                )}
              </>
            )}
            {!showPaymentMethods && (
              <>
                <WrapperLeftContainer>
                  <WrapperLeftContent>
                    {!cartState.loading && cart?.status === 2 && (
                      <WarningMessage>
                        <VscWarning />
                        <h1>
                          {t('CART_STATUS_PENDING_MESSAGE', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the page')}
                        </h1>
                      </WarningMessage>
                    )}
                    {!cartState.loading && cart?.status === 4 && (
                      <WarningMessage style={{ marginTop: 20 }}>
                        <VscWarning />
                        <h1>
                          {t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')}
                        </h1>
                      </WarningMessage>
                    )}
                    <Accordion
                      className={`accordion ${accordionOrderSummary}`}
                    >
                      <div className='order-summary'>
                        {t('ORDER_SUMMARY', 'Order summary')}
                        <span onClick={(e) => toggleAccordion(e, 'orderSummary')}>
                          {t('VIEW_DETAILS', 'View details')}
                          <span className='arrow'>
                            <ChevronUp className={`${setRotate}`} />
                          </span>
                        </span>
                      </div>
                      <AccordionContent
                        ref={content}
                        style={{ minHeight: `${setHeight}`, maxHeight: !accordionOrderSummary && '0px' }}
                      >
                        <Cart
                          isOrderSummary
                          hideDetails
                          isCartPending={cart?.status === 2}
                          cart={cart}
                          useKioskApp={useKioskApp}
                          isCheckout
                          isProducts={cart?.products?.length || 0}
                          viewString='checkout'
                          businessConfigs={businessConfigs}
                          hideCommentsByValidationCheckout
                          hideCouponByValidationCheckout
                          productLoading={productLoading}
                          setProductLoading={setProductLoading}
                          forceHideCheckoutButton
                        />
                      </AccordionContent>
                    </Accordion>
                    <AddressInfoWrapper>
                      <MomentContainer>
                        <div>
                          {t('STORE_DETAILS', 'Store Details')}
                          <p>{businessDetails?.business?.address}</p>
                        </div>
                        <span onClick={() => setOpenModal({ ...openModal, information: true })}><p>{t('VIEW_DETAILS', 'View details')}</p></span>
                      </MomentContainer>
                    </AddressInfoWrapper>
                    <OrderInfoWrapper>
                      <MomentContainer>
                        {options?.moment
                          ? parseDate(options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                          : (`${t('ASAP_ABBREVIATION', 'ASAP')} ${t('TODAY_AT', 'Today at')} (${moment(new Date()).format(configs?.general_hour_format?.value)} + ${options?.type > 1 ? t('PICKUP_TIME', 'Pickup Time') : t('DELIVERY_TIME', 'delivery time')})`)
                        }
                        {isPreorderEnabled && (
                          <span onClick={() => setOpenModal({ ...openModal, moment: true })}><p>{t('CHANGE', 'Change')}</p></span>
                        )}
                      </MomentContainer>
                      <Accordion
                        className={`accordion ${accordionAddInstructions}`}
                      >
                        <div className='add-instructions' onClick={(e) => toggleAccordion(e, 'addInstructions')}>
                          {t('ADD_SPECIAL_INSTRUCTIONS', 'Add special instructions')}
                        </div>
                        <AccordionContent
                          ref={content}
                          style={{ minHeight: `${setHeight}`, maxHeight: !accordionAddInstructions && '0px' }}
                        >
                          {!useKioskApp && cart?.business_id && (
                            <>
                              {!cartState.loading && deliveryOptionSelected !== undefined && options?.type === 1 && (
                                <DeliveryOptionsContainer>
                                  <Select
                                    defaultValue={deliveryOptionSelected}
                                    options={deliveryOptions}
                                    onChange={(val) => handleChangeDeliveryOption(val)}
                                  />
                                </DeliveryOptionsContainer>
                              )}
                            </>
                          )}
                          {cart?.status !== 2 && (
                            <CommentContainer>
                              <TextArea
                                defaultValue={cart?.comment}
                                placeholder={t('ADD_INSTRUCTIONS', 'Add instructions')}
                                onChange={(e) => handleChangeComment(e.target.value, user?.id)}
                              />
                              {commentState?.loading && (
                                <Spinner>
                                  <SpinnerLoader
                                    style={{ height: 100 }}
                                  />
                                </Spinner>
                              )}
                            </CommentContainer>
                          )}
                        </AccordionContent>
                      </Accordion>
                    </OrderInfoWrapper>

                    {!useKioskApp
                      ? (
                        <>
                          {cart?.business_id && !hideBusinessMap && (
                            <>
                              {(businessDetails?.loading || cartState.loading)
                                ? (
                                  <div style={{ width: '100%', marginBottom: '20px' }}>
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={150} />
                                  </div>
                                  )
                                : (
                                  <AddressDetails
                                    location={cart?.business?.location}
                                    businessLogo={businessDetails?.business?.logo || theme.images?.dummies?.businessLogo}
                                    isCartPending={cart?.status === 2}
                                    businessId={cart?.business_id}
                                    apiKey={configs?.google_maps_api_key?.value}
                                    mapConfigs={mapConfigs}
                                    isCustomerMode={isCustomerMode}
                                    cart={cart}
                                    primaryColor={hexTest.test(primaryColor || '') ? `0x${primaryColor}` : 'red'}
                                  />
                                  )}
                            </>
                          )}
                          {!hideCustomerDetails && (
                            <UserDetailsContainer>
                              <WrapperUserDetails>
                                {cartState.loading || (isCustomerMode && !customerState?.user?.id)
                                  ? (<div>
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                  </div>)
                                  : ((user?.guest_id && !allowedGuest)
                                      ? (<AuthButtonList>
                                      <h2>{t('CUSTOMER_DETAILS', 'Customer details')}</h2>
                                      <Button color='primary' onClick={() => setOpenModal({ ...openModal, signup: true })}>
                                        {t('SIGN_UP', 'Sign up')}
                                      </Button>
                                      <Button color='primary' outline onClick={() => setOpenModal({ ...openModal, login: true })}>
                                        {t('LOGIN', 'Login')}
                                      </Button>
                                      <Button color='black' outline onClick={() => setAllowedGuest(true)}>
                                        {t('CONTINUE_AS_GUEST', 'Continue as guest')}
                                      </Button>
                                    </AuthButtonList>)
                                      : (<UserDetails
                                      isUserDetailsEdit={isUserDetailsEdit}
                                      cartStatus={cart?.status}
                                      businessId={cart?.business_id}
                                      useDefualtSessionManager
                                      useSessionUser={!isCustomerMode}
                                      isCustomerMode={isCustomerMode}
                                      userData={isCustomerMode && customerState.user}
                                      userId={isCustomerMode && customerState?.user?.id}
                                      isOrderTypeValidationField
                                      requiredFields={requiredFields}
                                      checkoutFields={checkoutFields}
                                      isSuccess={isSuccess}
                                      isCheckout
                                    />)
                                    )}
                              </WrapperUserDetails>
                            </UserDetailsContainer>
                          )}
                          {cart?.business_id && !hideBusinessDetails && (
                            <BusinessDetailsContainer>
                              {(businessDetails?.loading || cartState.loading) && !businessDetails?.error && (
                                <div>
                                  <div>
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                    <Skeleton height={35} style={{ marginBottom: '10px' }} />
                                  </div>
                                </div>
                              )}
                              {!cartState.loading && businessDetails?.business && Object.values(businessDetails?.business)?.length > 0 && (
                                <div>
                                  <h1>{t('BUSINESS_DETAILS', 'Business Details')}</h1>
                                  <div>
                                    {!hideBusinessAddress && (
                                      <p>{businessDetails?.business?.address}</p>
                                    )}
                                    <p>{businessDetails?.business?.name}</p>
                                    <p>{businessDetails?.business?.email}</p>
                                    <p>{businessDetails?.business?.cellphone}</p>
                                    {businessDetails?.business?.address_notes && <p>{businessDetails?.business?.address_notes}</p>}
                                  </div>
                                </div>
                              )}
                              {businessDetails?.error && businessDetails?.error?.length > 0 && (
                                <div>
                                  <h1>{t('BUSINESS_DETAILS', 'Business Details')}</h1>
                                  <NotFoundSource
                                    content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
                                  />
                                </div>
                              )}
                            </BusinessDetailsContainer>
                          )}
                        </>
                        )
                      : (
                        <WrapperActionsInput>
                          <h1>
                            {t('WHATS_YOUR_NAME', "What's your name?")}
                          </h1>
                          <Input
                            placeholder={t('WRITE_YOUR_NAME', 'Write your name')}
                            autoComplete='off'
                            onChange={(e) => setBehalfName(e?.target?.value)}
                          />
                        </WrapperActionsInput>
                        )
                    }
                    <PayCardSelected>
                      {(!cart?.paymethod_id || (cart?.paymethod_id && !cart?.paymethod_data?.card)) && (
                        <div className='required-payment'>
                          <SectionTitleContainer>
                            <h1>
                              {(cart?.paymethod_id || paymethodSelected?.id)
                                ? t(paymentSelectedName?.toUpperCase() ?? 'PAYMENT', capitalize(paymentSelectedName?.replace(/_/g, ' ')?.toLowerCase() || 'Payment'))
                                : t('SELECT_PAYMENT', 'Select payment')}
                            </h1>
                          </SectionTitleContainer>
                          <span className='change-payment' onClick={() => handleChangeShowPaymentMethods()}>
                            <p>{t('CHANGE', 'Change')}</p>
                          </span>
                        </div>
                      )}

                      {cart?.paymethod_id && cart?.paymethod_data?.card && (
                        <CardItemContent>
                          <span className='brand'>
                            <img src={getIconCard(cart?.paymethod_data?.card?.brand)} alt={cart?.paymethod_data?.card?.brand} />
                          </span>
                          <div className='payment-container'>
                            <div className='payment-wrapper'>
                              <span>
                                {t(`${cart?.paymethod_data?.card?.brand?.toUpperCase() || 'PAYMENT_CARD'}`, capitalize(cart?.paymethod_data?.card?.brand) || 'Payment card')}
                              </span>
                              <span className='change-payment' onClick={() => handleChangeShowPaymentMethods()}><p>{t('CHANGE', 'Change')}</p></span>
                            </div>
                            <span className='card-number'>
                              ••••{cart?.paymethod_data?.card?.last4}
                            </span>
                          </div>
                        </CardItemContent>
                      )}
                    </PayCardSelected>

                    {!isDisabledRewards && isWalletEnabled && !businessDetails?.loading && (
                      <WalletPaymentOptionContainer>
                        <PaymentOptionWallet
                          cart={cart}
                          loyaltyPlansState={loyaltyPlansState}
                          businessConfigs={businessDetails?.business?.configs}
                        />
                      </WalletPaymentOptionContainer>
                    )}
                    {
                      !!driverTipsField &&
                      <>
                        <DriverTipContainer>
                          <h1>{t('DRIVER_TIPS', 'Driver Tips')}</h1>
                          <p>{t('100%_OF_THE_TIP_YOUR_DRIVER', '100% of the tip goes to your driver')}</p>
                          <DriverTips
                            businessId={cart?.business_id}
                            driverTipsOptions={driverTipsOptions}
                            isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                            isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                            driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                              ? cart?.driver_tip
                              : cart?.driver_tip_rate}
                            cart={cart}
                            useOrderContext
                          />
                        </DriverTipContainer>
                        <DriverTipDivider />
                      </>
                    }
                    {cartState.loading && (
                      <div>
                        <div>
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={55} style={{ marginBottom: '10px' }} />
                        </div>
                      </div>
                    )}
                    <OrderBill>
                      <table className='order-info'>
                        <tbody>
                          {isArchiesColombia
                            ? (
                              <>
                                <tr>
                                  <td>{t('SUBTOTAL', 'Subtotal')}</td>
                                  <td>{parsePrice(cart?.subtotal)}</td>
                                </tr>
                                {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
                                  <tr>
                                    {cart?.discount_type === 1
                                      ? (
                                        <td>
                                          {t('DISCOUNT', 'Discount')}{' '}
                                          <span>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</span>
                                        </td>
                                        )
                                      : (
                                        <td>{t('DISCOUNT', 'Discount')}</td>
                                        )}
                                    <td>- {parsePrice(cart?.discount || 0)}</td>
                                  </tr>
                                )}
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 1)?.map(offer => (
                                    <tr key={`archies-checkout-offer1-${offer.id}`}>
                                      <td className='icon'>
                                        {offer.name}
                                        {offer.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.offers?.filter(offer => offer?.target === 1)?.length > 0 &&
                                  cart?.subtotal_with_discount > 0 &&
                                  cart?.discount > 0 &&
                                  cart?.total >= 0 &&
                                  (
                                    <tr>
                                      <td>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</td>
                                      <td>{parsePrice(cart?.subtotal_with_discount ?? 0)}</td>
                                    </tr>
                                  )
                                }
                                {cart?.taxes === null && cart?.business?.tax_type === 1 && !!cart?.tax && (
                                  <tr>
                                    <td>{t('TAX', 'Tax')}</td>
                                    <td>{parsePrice(cart?.tax)}</td>
                                  </tr>
                                )}
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 1 && tax?.target === 'product').map(tax => (
                                    <tr key={`archies-checkout-tax1-prod-${tax?.id}`}>
                                      <td className='icon'>
                                        {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : (tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business'))}
                                        {typeof tax?.rate === 'number' && tax?.rate !== 0 && (
                                          <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                        )}
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map(tax => (
                                    <tr key={`archies-checkout-tax2-prod-${tax?.id}`}>
                                      <td className='icon'>
                                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 1 && tax?.target === 'delivery_fee').map(tax => (
                                    <tr key={`archies-checkout-tax1-del-${tax?.id}`}>
                                      <td className='icon'>
                                        {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        {typeof tax?.rate === 'number' && tax?.rate !== 0 && (
                                          <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                        )}
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map(tax => (
                                    <tr key={`archies-checkout-tax2-del-${tax?.id}`}>
                                      <td className='icon'>
                                        {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.fees?.length > 0 && cart?.fees?.filter(fee => (!(fee.fixed === 0 && fee.percentage === 0) || (fee?.id === null && fee?.type === 'product' && fee?.percentage > 0))).map((fee, i) => (
                                    <tr key={`archies-checkout-fee-${fee.id ?? i}`}>
                                      <td className='icon'>
                                        {t(fee?.name?.toUpperCase()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`})
                                      </td>
                                      <td>{parsePrice(fee?.summary?.amount ?? (fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage)) ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 3)?.map(offer => (
                                    <tr key={`archies-checkout-offer3-${offer.id}`}>
                                      <td className='icon'>
                                        {t(offer?.name?.toUpperCase()?.replace(/ /g, '_'), offer?.name)}
                                        {offer?.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {options?.type === 1 && cart?.delivery_price > 0 && !hideDeliveryFee && (
                                  <tr>
                                    <td>{t('DELIVERY_FEE', 'Delivery Fee')}</td>
                                    <td>{parsePrice(cart?.delivery_price)}</td>
                                  </tr>
                                )}
                                {cart?.extra_value_checkprice && cart?.extra_value_checkprice > 0 && (
                                  <tr>
                                    <td>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</td>
                                    <td>{parsePrice(cart?.extra_value_checkprice)}</td>
                                  </tr>
                                )}
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 2)?.map(offer => (
                                    <tr key={`archies-checkout-offer2-${offer.id}`}>
                                      <td className='icon'>
                                        {offer.name}
                                        {offer?.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {cart?.driver_tip > 0 && (
                                  <tr>
                                    <td>
                                      {t('DRIVER_TIP', 'Driver tip')}{' '}
                                      {cart?.driver_tip_rate > 0 &&
                                        parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                                        !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                                        (
                                          <span>{`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`}</span>
                                        )}
                                    </td>
                                    <td>{parsePrice(cart?.driver_tip)}</td>
                                  </tr>
                                )}
                                {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map(extra => (
                                  <tr key={extra?.key}>
                                    <td>
                                      {t(extra?.key?.toUpperCase(), extra?.key)}{' '}
                                    </td>
                                    <td>{parseFloat(extra?.value) > 0 ? parsePrice(parseFloat(extra?.value)) : `- ${parsePrice(parseFloat(extra?.value) * -1)}`}</td>
                                  </tr>
                                ))}
                              </>
                              )
                            : (
                              <>
                                <tr>
                                  <td>{t('SUBTOTAL', 'Subtotal')}</td>
                                  <td>{parsePrice(cart?.subtotal + getIncludedTaxes())}</td>
                                </tr>
                                {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
                                  <tr>
                                    {cart?.discount_type === 1
                                      ? (
                                        <td>
                                          {t('DISCOUNT', 'Discount')}{' '}
                                          <span>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</span>
                                        </td>
                                        )
                                      : (
                                        <td>{t('DISCOUNT', 'Discount')}</td>
                                        )}
                                    <td>- {parsePrice(cart?.discount || 0)}</td>
                                  </tr>
                                )}
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 1)?.map(offer => (
                                    <tr key={offer.id}>
                                      <td className='icon'>
                                        {offer.name}
                                        {offer.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.offers?.filter(offer => offer?.target === 1)?.length > 0 &&
                                  cart?.subtotal_with_discount > 0 &&
                                  cart?.discount > 0 &&
                                  cart?.total >= 0 &&
                                  (
                                    <tr>
                                      <td>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</td>
                                      {cart?.business?.tax_type === 1
                                        ? (
                                          <td>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</td>
                                          )
                                        : (
                                          <td>{parsePrice(cart?.subtotal_with_discount ?? 0)}</td>
                                          )}
                                    </tr>
                                  )
                                }
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map(tax => (
                                    <tr key={tax?.id}>
                                      <td className='icon'>
                                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.fees?.length > 0 && cart?.fees?.filter(fee => !(fee.fixed === 0 && fee.percentage === 0)).map((fee, i) => (
                                    <tr key={fee.id ?? i}>
                                      <td className='icon'>
                                        {t(fee?.name?.toUpperCase()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`})
                                      </td>
                                      <td>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 3)?.map(offer => (
                                    <tr key={offer.id}>
                                      <td className='icon'>
                                        {t(offer?.name?.toUpperCase()?.replace(/ /g, '_'), offer?.name)}
                                        {offer?.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {options?.type === 1 && cart?.delivery_price > 0 && !hideDeliveryFee && (
                                  <tr>
                                    <td>{t('DELIVERY_FEE', 'Delivery Fee')}</td>
                                    <td>{parsePrice(cart?.delivery_price + getIncludedTaxes(true))}</td>
                                  </tr>
                                )}
                                {cart?.extra_value_checkprice && cart?.extra_value_checkprice > 0 && (
                                  <tr>
                                    <td>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</td>
                                    <td>{parsePrice(cart?.extra_value_checkprice)}</td>
                                  </tr>
                                )}
                                {
                                  cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map(tax => (
                                    <tr key={tax?.id}>
                                      <td className='icon'>
                                        {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                        <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                      </td>
                                      <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                                    </tr>
                                  ))
                                }
                                {
                                  cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 2)?.map(offer => (
                                    <tr key={offer.id}>
                                      <td className='icon'>
                                        {offer.name}
                                        {offer?.rate_type === 1 && (
                                          <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                        )}
                                      </td>
                                      <td>
                                        - {parsePrice(offer?.summary?.discount)}
                                      </td>
                                    </tr>
                                  ))
                                }
                                {cart?.driver_tip > 0 && (
                                  <tr>
                                    <td>
                                      {t('DRIVER_TIP', 'Driver tip')}{' '}
                                      {cart?.driver_tip_rate > 0 &&
                                        parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                                        !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                                        (
                                          <span>{`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`}</span>
                                        )}
                                    </td>
                                    <td>{parsePrice(cart?.driver_tip)}</td>
                                  </tr>
                                )}
                                {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map(extra => (
                                  <tr key={extra?.key}>
                                    <td>
                                      {t(extra?.key?.toUpperCase(), extra?.key)}{' '}
                                    </td>
                                    <td>{parseFloat(extra?.value) > 0 ? parsePrice(parseFloat(extra?.value)) : `- ${parsePrice(parseFloat(extra?.value) * -1)}`}</td>
                                  </tr>
                                ))}
                              </>
                              )}
                        </tbody>
                      </table>
                    </OrderBill>
                  </WrapperLeftContent>
                </WrapperLeftContainer>
                <WrapperRightContainer>
                  {!cartState.loading && placeSpotsEnabled && cart?.business_id && (
                    <SelectSpotContainer>
                      <PlaceSpot
                        isCheckout
                        isInputMode
                        isHomeStyle
                        cart={cart}
                        spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
                        vehicleDefault={cart?.vehicle}
                        setPlaceSpotNumber={setPlaceSpotNumber}
                      />
                    </SelectSpotContainer>
                  )}
                  {!cartState.loading && cart && !cart?.reservation && (
                    <CartContainer>
                      <CartHeader>
                        <h1>{t('MY_ORDER', 'My order')}</h1>
                      </CartHeader>
                      <table className='total'>
                        <tbody>
                          <tr>
                            <td>{t('ORDER_TOTAL', 'Order total')}</td>
                            <td>{parsePrice(cart?.total >= 0 ? cart?.total : 0)}</td>
                          </tr>
                        </tbody>
                      </table>
                      {(guestCheckoutCoupon?.enabled || validateCouponField) &&
                        (
                          <CouponControl
                            businessId={cart?.business_id}
                            price={cart?.total}
                            cart={cart}
                          />
                        )}
                    </CartContainer>
                  )}
                  {cart?.payment_events?.length > 0 && (
                    <div
                      style={{
                        width: '100%',
                        marginTop: 10
                      }}
                    >
                      {cart?.payment_events?.map(event => (
                        <div
                          key={event.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10
                          }}
                        >
                          <span>
                            {walletName[cart?.wallets?.find(wallet => wallet.id === event.wallet_id)?.type]?.name}
                          </span>
                          <span>
                            -{parsePrice(event.amount, { isTruncable: true })}
                          </span>
                        </div>
                      ))}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 10
                        }}
                      >
                        <span
                          style={{ fontWeight: 'bold' }}
                        >
                          {t('TOTAL_TO_PAY', 'Total to pay')}
                        </span>
                        <span
                          style={{ fontWeight: 'bold' }}
                        >
                          {parsePrice(cart?.balance)}
                        </span>
                      </div>
                    </div>
                  )}

                  {windowSize.width >= 576 && !cartState.loading && cart && cart?.status !== 2 && (
                    <WrapperPlaceOrderButton>
                      <Button
                        color={(!cart?.valid_maximum || (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))) ? 'secundary' : 'primary'}
                        disabled={isDisablePlaceOrderButton}
                        onClick={() => handlePlaceOrder()}
                      >
                        {!cart?.valid_maximum
                          ? (
                            `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
                            )
                          : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
                              ? (
                              `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                                )
                              : placing ? t('PLACING_ORDER', 'Placing order') : t('COMPLETE_MY_ORDER', 'Complete my order')}
                      </Button>
                    </WrapperPlaceOrderButton>
                  )}

                  {!cart?.valid_address && cart?.status !== 2 && (
                    <WarningText>
                      {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
                    </WarningText>
                  )}

                  {((!paymethodSelected || ((!cart?.paymethod_id && cart?.business_id) || (!paymethodSelected && !cart?.business_id))) && cart?.balance > 0) && cart?.status !== 2 && (
                    <WarningText>
                      {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
                    </WarningText>
                  )}

                  {validateRequiredCardField && cart?.status !== 2 && (
                    <WarningText>
                      {t('WARNING_NOT_CARD_SELECTED', 'Please, select or add a card to continue.')}
                    </WarningText>
                  )}

                  {!cart?.valid_products && cart?.status !== 2 && (
                    <WarningText>
                      {t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
                    </WarningText>
                  )}

                  {eatInSpotNumberMissing && (
                    <WarningText>
                      {t('WARNING_PLACE_SPOT', 'Please, select your spot to place order.')}
                    </WarningText>
                  )}

                  {validateDriverTipField && !isGiftCardCart &&
                    (
                      <WarningText>
                        {t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.')}
                      </WarningText>
                    )}
                  {validateCouponField &&
                    (
                      <WarningText>
                        {t('WARNING_INVALID_COUPON_FIELD', 'Coupon is required.')}
                      </WarningText>
                    )}
                  {validateCommentsCartField && (
                    <WarningText>
                      {t('WARNING_INVALID_CART_COMMENTS', 'Cart comments is required.')}
                    </WarningText>
                  )}

                  {validateZipcodeCard && (
                    <WarningText>
                      {t('WARNING_CARD_ZIPCODE_REQUIRED', 'Your card selected has not zipcode')}
                    </WarningText>
                  )}

                  {cart?.valid_preorder !== undefined && !cart?.valid_preorder && (
                    <WarningText>
                      {t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
                    </WarningText>
                  )}

                  {!cart?.reservation && options?.type === 9 && (
                    <WarningText>
                      {t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
                    </WarningText>
                  )}
                </WrapperRightContainer>
                {windowSize.width < 576 && !cartState.loading && cart && cart?.status !== 2 && (
                  <MobileWrapperPlaceOrderButton>
                    <span>{parsePrice(cart?.total)}</span>
                    <Button
                      color={(!cart?.valid_maximum || (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))) ? 'secundary' : 'primary'}
                      disabled={isDisablePlaceOrderButton}
                      onClick={() => isDisablePlaceOrderButton
                        ? handleScrollTo('.paymentsContainer')
                        : handlePlaceOrder()}
                    >
                      {!cart?.valid_maximum
                        ? (
                          `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
                          )
                        : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
                            ? (
                            `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                              )
                            : placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')}
                    </Button>
                  </MobileWrapperPlaceOrderButton>
                )}
              </>
            )}
          </>
        )}
      </Container>
      <Alert
        title={t('CUSTOMER_DETAILS', 'Customer Details')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
      {isOpen && (
        <Modal
          open={isOpen}
          width='760px'
          padding='30px'
          height='auto'
          onClose={() => setIsOpen(false)}
          closeIconRight
        >
          <UserDetails
            isUserDetailsEdit={isUserDetailsEdit}
            cartStatus={cart?.status}
            businessId={cart?.business_id}
            useDefualtSessionManager
            useSessionUser={!isCustomerMode}
            isCustomerMode={isCustomerMode}
            userData={isCustomerMode && customerState.user}
            userId={isCustomerMode && customerState?.user?.id}
            requiredFields={requiredFields}
            setIsSuccess={setIsSuccess}
            isCheckout
            isCheckoutPlace
            isEdit
            isModal
            handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
            isOrderTypeValidationField
            checkoutFields={checkoutFields}
            isAllowGuest={paymethodSelected?.gateway === 'cash' || paymethodSelected?.gateway === 'card_delivery'}
            onClose={() => {
              setIsOpen(false)
              if (paymethodClicked) {
                setPaymethodClicked({
                  ...paymethodClicked,
                  confirmed: true
                })
              } else {
                handlePlaceOrder()
              }
            }}
          />
        </Modal>
      )}
      {openModal.signup && (
        <Modal
          open={openModal.signup}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, signup: false, isGuest: false })}
          closeIconRight
        >
          <SignUpForm
            useLoginByCellphone
            useChekoutFileds
            handleSuccessSignup={handleSuccessSignup}
            isPopup
            isGuest
          />
        </Modal>
      )}
      {openModal.login && (
        <Modal
          open={openModal.login}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, login: false })}
          closeIconRight
        >
          <LoginForm
            handleSuccessLogin={handleSuccessLogin}
            isPopup
            isGuest
          />
        </Modal>
      )}
      {openModal.orderDetail && (
        <Modal
          open={openModal.orderDetail}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, orderDetail: false })}
        >
          <OrderDetail
            item={cart}
            placingOrder={placing}
            orderType={options?.type}
            customerAddress={options?.address?.address}
            onClick={handlePlaceOrder}
          />
        </Modal>
      )}
      <Modal
        open={openModal.moment}
        onClose={() => setOpenModal({ ...openModal, moment: false })}
        width={'50%'}
        height='auto'
        padding='20px 60px 30px'
        closeIconRight
      >
        <MomentContent
          isHeader
          onClose={() => setOpenModal({ ...openModal, moment: false })}
        />
      </Modal>
      <Modal
        open={openModal.delivery}
        onClose={() => setOpenModal({ ...openModal, delivery: false })}
        width={options?.user_id ? '70%' : '50%'}
        padding='20px 0px'
      >
        <OrderTypeSelector
          isCheckout
          onBusinessClick={() => setOpenModal({ ...openModal, delivery: false })}
        />
      </Modal>
      <Modal
        open={openModal.information}
        onClose={() => setOpenModal({ ...openModal, information: false })}
        closeIconRight
        width='70%'
        padding='0 5vw 20px'
        closeOnBackdrop={false}
      >
        <BusinessInformation business={businessDetails?.business} />
      </Modal>
      <Modal
        open={openModal.iframe && (cart?.paymethod_data?.result?.action?.iframe_url || methodsWithIframeCards.includes(paymethodSelected?.gateway))}
        onClose={() => openModal.loading ? null : handleCloseIframe()}
        onRemove={() => openModal.loading ? null : handleCloseIframe()}
        closeIconRight
      >
        <div style={{ height: paymethodSelected?.gateway === 'globalpay' ? '45vh' : '70vh', marginTop: paymethodSelected?.gateway === 'globalpay' ? 60 : 20 }}>
          <iframe
            width='100%'
            height='100%'
            src={paymethodSelected?.gateway === 'globalpay' ? globalPayIFrameUrl : (paymethodSelected?.gateway === 'cybersource' ? cybersourceIFrameUrl : cart?.paymethod_data?.result?.action?.iframe_url)}
            style={{ border: 'none' }}
          />
        </div>
      </Modal>
    </div>
  )
}

export const Checkout = (props) => {
  const {
    errors,
    clearErrors,
    // query,
    cartUuid,
    handleOrderRedirect,
    handleCheckoutRedirect,
    handleSearchRedirect,
    handleCheckoutListRedirect,
    businessSlug,
    isCustomerMode
  } = props

  const [orderState, { confirmCart }] = useOrder()
  const [{ token }] = useSession()
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [customerState] = useCustomer()

  const [cartState, setCartState] = useState({ loading: true, error: null, cart: null })

  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [currentCart, setCurrentCart] = useState(null)
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isResetPaymethod, setIsResetPaymethod] = useState(false)

  const cartsWithProducts = orderState?.carts && (Object.values(orderState?.carts)?.filter(cart => cart?.products && cart?.products?.length) || null)
  const carts = businessSlug
    ? cartsWithProducts.filter((cart) => cart?.business?.slug === businessSlug || businessSlug === cart?.business_id)
    : cartsWithProducts
  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
    clearErrors && clearErrors()
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCurrentCart(null)
    setCanOpenUpselling(false)
    handleCheckoutRedirect(currentCart.uuid)
  }

  useEffect(() => {
    if (!orderState.loading && currentCart?.business_id) {
      setCurrentCart(...Object.values(orderState.carts)?.filter(cart => cart?.business_id === currentCart?.business_id))
    }
  }, [orderState.loading])

  useEffect(() => {
    if (currentCart?.products) {
      setOpenUpselling(true)
    }
  }, [currentCart])

  useEffect(() => {
    if (errors?.length) {
      setAlertState({
        open: true,
        content: errors
      })
    }
  }, [errors])

  const getOrder = async (cartId) => {
    try {
      let result = {}
      const cart = carts.find(cart => cart.uuid === cartId)
      const { useLocalCart, url } = getCheckoutCartFetchPlan({
        root: ordering.root,
        cartId,
        hasLocalCart: Boolean(cart),
        isCustomerMode,
        customerStateUser: customerState?.user,
        storedUserCustomerRaw: window.localStorage.getItem('user-customer')
      })
      if (useLocalCart) {
        result = { ...cart }
      } else {
        setCartState({ ...cartState, loading: true })
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-X': ordering.appId
          }
        })
        const content = await response.json()
        result = content.result
      }

      if (result.status === 1 && result.order?.uuid) {
        handleOrderRedirect(result.order.uuid)
        setCartState({ ...cartState, loading: false })
      } else if (result.status === 2) {
        let paymentData = null
        if (['credomatic', 'computop'].includes(result?.paymethod_data?.gateway)) {
          const urlParams = new URLSearchParams(window.location.search)
          const paramsObj = Object.fromEntries(urlParams.entries())
          paymentData = {
            [result?.paymethod_data?.gateway]: {
              ...paramsObj
            }
          }
        }
        try {
          const confirmCartRes = await confirmCart(cartUuid, paymentData)
          if (confirmCartRes.error) {
            setAlertState({
              open: true,
              content: typeof confirmCartRes.result === 'string'
                ? [confirmCartRes.result]
                : confirmCartRes.result
            })
            setIsResetPaymethod(true)
          }
          if (confirmCartRes.result.order?.uuid) {
            handleOrderRedirect(confirmCartRes.result.order.uuid)
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error) {
          setAlertState({
            open: true,
            content: [error.message]
          })
        }
      } else {
        let cart = Array.isArray(result) ? null : result
        const spotNumberFromStorage = parseJsonStorage(window.localStorage.getItem('table_number'))
        if (spotNumberFromStorage) {
          const spotNumber = spotNumberFromStorage?.tableNumber
          const slug = spotNumberFromStorage?.slug
          if (cart?.business?.slug === slug) {
            cart = {
              ...cart,
              spot_number: parseInt(spotNumber, 10)
            }
          }
        }
        setCartState({
          ...cartState,
          loading: false,
          cart,
          error: cart ? null : result
        })
      }
    } catch (e) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

  useEffect(() => {
    if (token && cartUuid) {
      getOrder(cartUuid)
    } else {
      setCartState({ ...cartState, loading: false })
    }
  }, [token, cartUuid])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    uuid: cartUuid,
    isResetPaymethod,
    setIsResetPaymethod
  }

  return (
    <>
      {!cartUuid && orderState.carts && carts && carts?.length === 0 && (
        <NotFoundSource
          content={t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.')}
          btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
          onClickButton={handleSearchRedirect}
        />
      )}
      {!cartUuid && orderState.carts && carts && carts?.length > 0 && (
        <CartsList>
          <CartContent
            carts={carts}
            isOrderStateCarts={!!orderState.carts}
            isForceOpenCart
          />
        </CartsList>
      )}

      {cartUuid && cartState.error && cartState.error?.length > 0 && (
        <NotFoundSource
          content={t('ERROR_CART_SELECTED', 'Sorry, the selected cart was not found.')}
          btnTitle={t('CHECKOUT_REDIRECT', 'Go to Checkout list')}
          onClickButton={handleCheckoutListRedirect}
        />
      )}

      {cartState.loading && !(window.location.pathname === '/checkout') && (
        <Container>
          <WrapperLeftContainer>
            <Skeleton height={30} />
            <Skeleton height={100} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={25} />
          </WrapperLeftContainer>
          <WrapperRightContainer>
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '20px' }} />
            <Skeleton height={25} />
            <Skeleton height={60} />
            <Skeleton height={80} style={{ marginBottom: '20px' }} />
            <Skeleton height={25} />
          </WrapperRightContainer>
        </Container>
      )}

      {cartUuid && cartState.cart && cartState.cart?.status !== 1 && <CheckoutController {...checkoutProps} />}

      {currentCart?.products && (
        <UpsellingPage
          businessId={currentCart?.business_id}
          cartProducts={currentCart?.products}
          business={currentCart?.business}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}

      <Alert
        title={t('CHECKOUT ', 'Checkout')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </>
  )
}
