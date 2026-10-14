import React, { useState, useMemo, useEffect } from 'react'
import { useTheme } from 'styled-components'
import parsePhoneNumber from 'libphonenumber-js'

import {
  Container,
  QuestionContainer
} from './styles'

import { LoginGuest as LoginGuestController, useLanguage, useSession, useEvent, useOrder, useConfig } from '~components'
import { useGuestCheckoutPermission } from '~/hooks/useGuestCheckoutPermission'

import {
  UserDetails,
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  Button,
  Alert
} from '~ui'

const LoginGuestUI = (props) => {
  const {
    notificationState,
    title,
    cartUuid,
    checkoutFieldsState
  } = props
  const [{ user, loading: userLoading }, { login }] = useSession()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [events] = useEvent()
  const theme = useTheme()
  const [{ carts, options }] = useOrder()
  const { guestCheckoutAllowed, canUseGuestCheckout, canPlaceOrder } = useGuestCheckoutPermission({
    configs,
    orderType: options?.type,
    user
  })

  const [pageToShow, setPageToShow] = useState(cartUuid ? 'question' : 'login')
  const [requiredFields, setRequiredFields] = useState([])
  const [userErrors, setUserErrors] = useState([])
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']

  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter(field => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const cart = carts?.[`uuid:${cartUuid}`]

  const checkGuestValidationFields = () => {
    const userSelected = user
    const _requiredFields = checkoutFieldsState?.fields
      .filter((field) => field?.enabled && field?.required_with_guest &&
        !notFields.includes(field?.validation_field?.code) &&
        field?.validation_field?.code !== 'email' &&
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field) => field?.validation_field?.code === 'mobile_phone')
    const guestCheckoutEmail = checkoutFieldsState?.fields?.find((field) => field?.validation_field?.code === 'email')

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
  console.log('checkoutFieldsState', requiredFields)
  const checkValidationFields = () => {
    setUserErrors([])
    const errors = []
    const userSelected = user
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

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      const isGoToPayments = !cart?.paymethod_id && !user?.guest_id
      handleGoToPage({ page: 'checkout', params: { cartUuid }, search: `?view=${isGoToPayments ? 'paymethods' : 'checkout'}` })
      !user?.guest_id && window.location.reload()
    }
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
    if (user) {
      const isGoToPayments = !cart?.paymethod_id && !user?.guest_id
      handleGoToPage({ page: 'checkout', params: { cartUuid }, search: `?view=${isGoToPayments ? 'paymethods' : 'checkout'}` })
    }
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    if (page === 'guest_signup' && !canUseGuestCheckout()) return
    setPageToShow(page)
  }

  useEffect(() => {
    if (checkoutFieldsState?.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, options?.type])

  useEffect(() => {
    if (!userErrors.length) return
    setAlertState({
      open: true,
      content: Object.values(userErrors).map(error => error)
    })
  }, [userErrors])

  useEffect(() => {
    window?.scrollTo(0, 0)
  }, [pageToShow])

  useEffect(() => {
    if (pageToShow === 'guest_signup' && !guestCheckoutAllowed) setPageToShow(cartUuid ? 'question' : 'login')
  }, [pageToShow, guestCheckoutAllowed, cartUuid])

  return (
    <Container>
      {pageToShow === 'question' && (
        <QuestionContainer>
          <h1>{t('HOW_WOULD_YOU_LIKE_TO_CHECKOUT', 'How would you like to checkout today?')}</h1>
          <div className={`info-container ${configs?.guest_checkout_enabled?.value === '0' ? 'center' : ''}`}>
            <div className='box-container'>
              <h2>{t('YOUR_ACCOUNT', 'Your account')}</h2>
              <p>{t('YOUR_ACCOUNT_DES', 'Log in to access your stored payment methods and receive points for every qualifying purchase')}</p>
              <Button color='primary' onClick={(e) => handleCustomModalClick(e, { page: 'login' })}>{t('LOGIN', 'Log in')}</Button>
              <Button color='primary' outline onClick={(e) => handleCustomModalClick(e, { page: 'signup' })}>{t('SIGN_UP', 'Sign up')}</Button>
            </div>
            {guestCheckoutAllowed && (
            <div className='box-container'>
              <h2>{t('GUEST_CHECKOUT', 'Guest Checkout')}</h2>
              <p>{t('GUEST_CHECKOUT_DES', 'Guests can still receive points for today’s purchase.')}</p>
              <Button color='primary' outline onClick={(e) => handleCustomModalClick(e, { page: 'guest_signup' })}>{t('GUEST_CHECKOUT_BUTTON', 'Guest checkout')}</Button>
            </div>
            )}
          </div>
        </QuestionContainer>
      )}
      {pageToShow === 'login' && (
        <LoginForm
          title={title}
          cartUuid={cartUuid}
          notificationState={notificationState}
          handleSuccessLogin={handleSuccessLogin}
          elementLinkToForgotPassword={
            <a
              onClick={
                (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
              } href='#'
            >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset password')}
            </a>
          }
          fromGuestLogin={!!cartUuid}
          useLoginByCellphone
          isGuest
        />
      )}
      {pageToShow === 'signup' && (
        <SignUpForm
          title={title}
          cartUuid={cartUuid}
          notificationState={notificationState}
          handleSuccessSignup={handleSuccessSignup}
          elementLinkToLogin={
            <a
              onClick={
                (e) => handleCustomModalClick(e, { page: 'login' })
              } href='#'
            >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
            </a>
          }
          useLoginByCellphone
          useChekoutFileds
          isGuest
        />
      )}
      {pageToShow === 'guest_signup' && guestCheckoutAllowed && (
        <>
          <UserDetails
            isUserDetailsEdit
            cartStatus={cart?.status}
            businessId={cart?.business_id}
            requiredFields={requiredFields}
            checkoutFields={checkoutFields}
            handleSuccessUpdate={(updatedUser) => {
              if (!canPlaceOrder(true)) {
                setPageToShow(cartUuid ? 'question' : 'login')
                return
              }
              handleSuccessLogin(updatedUser)
            }}
            cartUuid={cartUuid}
            notificationState={notificationState}
            useDefualtSessionManager
            useSessionUser
            isOrderTypeValidationField
            fromGuestLogin
            isCheckout
          />
        </>
      )}
      {pageToShow === 'forgotpassword' && (
        <ForgotPasswordForm
          elementLinkToLogin={
            <a
              onClick={
                (e) => handleCustomModalClick(e, { page: 'login' })
              } href='#'
            >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
            </a>
          }
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
    </Container>
  )
}

export const LoginGuest = (props) => {
  const loginProps = {
    ...props,
    UIComponent: LoginGuestUI
  }

  return (
    <LoginGuestController {...loginProps} />
  )
}
