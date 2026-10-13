import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from 'styled-components'
import FaRegUser from '@meronex/icons/fa/FaRegUser'
import { Award, ChevronLeft } from 'react-bootstrap-icons'

import {
  Header as HeaderContainer,
  InnerHeader,
  LogoHeader,
  LeftHeader,
  RightHeader,
  Menu,
  BackButtonWrapper,
  MiddleTitleWrapper,
  UserEdit,
  AddressFormWrapper,
  LeftSide,
  LanguageSelectorWrapper
} from './styles'

import { useSession, useLanguage, useOrder, useEvent, useConfig, useCustomer, useBusiness } from '~components'
import { getSiteLogoUrl } from '~/utils/siteBranding'
import { parseJsonStorage } from '~/utils/parseJsonStorage'
import { parseOrderTypesAllowed } from '~/utils/parseOrderTypesAllowed'
import {
  useWindowSize,
  useOnlineStatus,
  getDistance,
  getCateringValues,
  Confirm,
  Modal,
  OrderTypeSelectorContent,
  CartPopover,
  CartContent,
  MomentContent,
  AddressList,
  AddressForm,
  HeaderOption,
  SidebarMenu,
  UserDetails,
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  BusinessPreorder,
  Button,
  LanguageSelector
} from '~ui'

export const Header = (props) => {
  props = { ...defaultProps, ...props }
  const {
    location,
    isShowOrderOptions,
    isHideSignup,
    isCustomerMode,
    businessSlug,
    notificationState,
    singleBusinessConfig
  } = props

  const isSingleBusiness = !!singleBusinessConfig?.isActive
  const { pathname } = useLocation()
  const [events] = useEvent()
  const [, t] = useLanguage()
  const [{ auth }, { login }] = useSession()
  const [orderState, { refreshOrderOptions }] = useOrder()
  const [openPopover, setOpenPopover] = useState({})
  const theme = useTheme()
  const [configState] = useConfig()
  const [customerState, { deleteUserCustomer }] = useCustomer()
  const [{ business }] = useBusiness()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [modalSelected, setModalSelected] = useState(null)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const [preorderBusiness, setPreorderBusiness] = useState(null)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [isOpenUserData, setIsOpenUserData] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, content: null, handleOnAccept: null })
  const [/* isFarAway */, setIsFarAway] = useState(false)

  const isMulticheckoutPage = window.location.pathname?.includes('/multi-checkout')
  const hideBackButton = window.location.pathname?.includes('/checkout/')
  const isDisabledRewards = configState?.configs?.disabled_rewards?.value === '1'

  const cartsWithProducts = (orderState?.carts && Object.values(orderState?.carts).filter(cart => cart.products && cart.products?.length > 0)) || null
  const carts = businessSlug
    ? cartsWithProducts.filter((cart) => cart?.business?.slug === businessSlug || businessSlug === cart?.business_id)
    : cartsWithProducts

  const windowSize = useWindowSize()
  const onlineStatus = useOnlineStatus()
  const apiLogo = theme?.my_products?.components?.images?.components?.logo?.components?.image
  const apiMobileLogo = theme?.my_products?.components?.images?.components?.logo_mobile?.components?.image
  const isMobileLogo = windowSize.width <= 768
  const logotypeSrc = getSiteLogoUrl(apiLogo, theme?.images?.logos?.logotype)
  const isotypeSrc = getSiteLogoUrl(
    isMobileLogo ? apiMobileLogo : apiLogo,
    isMobileLogo ? theme?.images?.logos?.isotypeInvert : theme?.images?.logos?.isotype
  )

  const userCustomer = parseJsonStorage(window.localStorage.getItem('user-customer'))

  const configTypes = parseOrderTypesAllowed(configState?.configs?.order_types_allowed?.value)
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null

  const cateringValues = getCateringValues(cateringTypeString, pathname.includes('store') && Object?.keys(business || {})?.length > 0 ? business?.configs : configState?.configs)

  const isWalletEnabled = configState?.configs?.cash_wallet?.value && configState?.configs?.wallet_enabled?.value === '1' && (configState?.configs?.wallet_cash_enabled?.value === '1' || configState?.configs?.wallet_credit_point_enabled?.value === '1')
  const isHideLanguages = theme?.header?.components?.language_selector?.hidden

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  const openModal = (opt) => {
    setModalSelected(opt)
    setModalIsOpen(true)
  }

  const handleTogglePopover = (type) => {
    setOpenPopover({
      ...openPopover,
      [type]: !openPopover[type]
    })
  }

  const handleClosePopover = (type) => {
    setOpenPopover({
      ...openPopover,
      [type]: false
    })
  }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
    if (isCustomerMode && pathname.includes('/orders')) {
      deleteUserCustomer(true)
      refreshOrderOptions()
    }
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
  }

  const handleClosePreorder = () => {
    setPreorderBusiness(null)
  }

  const handleBusinessClick = (business) => {
    events.emit('go_to_page', { page: 'business', params: { business_slug: business?.slug || business?.id }, replace: true })
  }

  useEffect(() => {
    if (isCustomerMode) {
      setCustomerModalOpen(false)
    }
  }, [customerState?.user?.address])

  useEffect(() => {
    if (!(pathname.includes('/search') || pathname.includes('/checkout'))) {
      setIsFarAway(false)
      return
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
      if (distance > 20) setIsFarAway(true)
      else setIsFarAway(false)
    }, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }, [orderState?.options?.address?.location, pathname])

  const returnHeaderTitle = () => {
    const { pathname, search } = window.location
    const homePathnames = ['/', '/home']

    // Map of paths to their corresponding titles
    const pathTitles = {
      '/order_types': orderState?.options?.type === 1 ? t('DELIVERING_TO', 'Delivering to') : t('PICKING_UP_FROM', 'Picking up from'),
      '/profile/orders': t('ORDERS', 'Orders'),
      '/messages': t('MESSAGES', 'Messages'),
      '/favorite': t('FAVORITES', 'Favorites'),
      '/wallets': t('REWARDS', 'Rewards'),
      '/reward/transactions': t('TRANSACTIONS_LIST', 'Transactions list'),
      '/sessions': t('SESSIONS', 'Sessions')
    }

    // Special case for profile with search parameter
    if (pathname === '/profile' && search === '?view=savedPlaces') {
      return t('MY_SAVED_PLACES', 'My saved places')
    }

    // Check if path exists in our map
    if (pathTitles[pathname]) {
      return pathTitles[pathname]
    }

    // Check if it's a home pathname
    if (homePathnames.includes(pathname)) {
      return t('HOME', 'Home')
    }

    // Default: return logo
    return (
      <LogoHeader
        center
        onClick={() => handleGoToPage({ page: 'home' })}
      >
        <img
          alt='Logotype'
          width='170px'
          height='45px'
          src={logotypeSrc}
          loading='lazy'
        />
        <img
          alt='Isotype'
          width='35px'
          height='45px'
          loading='lazy'
          src={isotypeSrc}
        />
      </LogoHeader>
    )
  }

  const isShowLeftLogo = () => {
    const pathNames = ['/', '/home']
    return pathNames.includes(window.location.pathname) || windowSize.width < 769
  }

  const handleGoBack = () => {
    const pathsToHome = ['/order_types', '/account', '/orders/']
    const orderRedirect = JSON.parse(window.sessionStorage.getItem('order-redirect') ?? false)
    if (orderRedirect) {
      window.sessionStorage.removeItem('order-redirect')
      handleGoToPage({ page: 'orders', replace: true })
    }

    if (pathsToHome.some(path => window.location.pathname.includes(path))) {
      handleGoToPage({ page: 'home', replace: true })
      return
    }
    const pathsToOrderTypes = ['/store']
    if (pathsToOrderTypes.some(path => window.location.pathname.includes(path))) {
      handleGoToPage({ page: 'order_types', replace: true })
      return
    }
    const pathsToBusiness = ['/checkout/']
    if (pathsToBusiness.some(path => window.location.pathname.includes(path) && window.location.search === '?view=checkout') && window.location.search !== '?view=paymethods' && (business?.slug || business?.id)) {
      handleBusinessClick(business)
      return
    } else if (window.location.pathname.includes('/checkout') && !(business?.slug || business?.id)) {
      handleGoToPage({ page: 'home', replace: true })
      return
    }
    window.history.back()
  }

  return (
    <HeaderContainer>
      <InnerHeader>
        <LeftSide avoidBackButton={windowSize.width < 769}>
          <LeftHeader id='left-side'>
            {window.location.pathname !== '/account' && (
              <SidebarMenu
                notificationState={notificationState}
                auth={auth}
                isHideSignup={isHideSignup}
                userCustomer={userCustomer}
                isCustomerMode={isCustomerMode}
              />
            )}
            {(isShowLeftLogo()) && (
              <LogoHeader
                onClick={() => handleGoToPage({ page: 'home' })}
              >
                <img
                  alt='Logotype'
                  width='170px'
                  height='45px'
                  src={logotypeSrc}
                  loading='lazy'
                />
                <img
                  alt='Isotype'
                  width='35px'
                  height='45px'
                  loading='lazy'
                  src={isotypeSrc}
                />
              </LogoHeader>
            )}
            {!isShowLeftLogo() && !hideBackButton && (
              <BackButtonWrapper onClick={handleGoBack}>
                <ChevronLeft />
                <h2>{t('BACK', 'Back')}</h2>
              </BackButtonWrapper>
            )}
          </LeftHeader>
          {!isShowLeftLogo() && (window.location.pathname !== '/account' || (window.location.pathname === '/account' && windowSize.width > 768)) && (
            <MiddleTitleWrapper id='center-side'>
              {returnHeaderTitle()}
            </MiddleTitleWrapper>
          )}
        </LeftSide>
        {onlineStatus && (
          <RightHeader id='right-side'>
            <Menu isCustomerMode={isCustomerMode}>
              {windowSize.width > 768 && (
                <>
                  <Button
                    color='primary'
                    outline={!(['/account', '/profile', '/messages', '/favorite', '/help', '/sessions', '/orders/', '/profile/orders'].includes(window.location.pathname))}
                    disabled={window.location.pathname === '/account'}
                    onClick={() => handleGoToPage({ page: 'account' })}
                  >
                    <FaRegUser />
                    {t('ACCOUNT', 'Account')}
                  </Button>
                  {!isDisabledRewards && isWalletEnabled && (
                    <Button
                      className='reward-btn'
                      color='primary'
                      outline={!['/wallets', '/reward/transactions'].includes(window.location.pathname)}
                      disabled={window.location.pathname === '/wallets'}
                      onClick={() => handleGoToPage({ page: 'wallets' })}
                    >
                      <Award />
                      {t('REWARDS', 'Rewards')}
                    </Button>
                  )}
                </>
              )}
              {isShowOrderOptions && (
                windowSize.width > 768
                  ? (
                    <>
                      {!isMulticheckoutPage
                        ? (
                          <CartPopover
                            open={openPopover.cart}
                            carts={carts}
                            onClick={() => handleTogglePopover('cart')}
                            onClose={() => handleClosePopover('cart')}
                            auth={auth}
                            location={location}
                            isCustomerMode={isCustomerMode}
                            setPreorderBusiness={setPreorderBusiness}
                          />
                          )
                        : null}
                    </>
                    )
                  : (
                    <HeaderOption
                      variant='cart'
                      totalCarts={carts?.length}
                      onClick={(variant) => openModal(variant)}
                    />
                    )
              )}
              {!isHideLanguages && (
                <LanguageSelectorWrapper>
                  <LanguageSelector />
                </LanguageSelectorWrapper>
              )}
            </Menu>
          </RightHeader>
        )}
      </InnerHeader>
      {modalIsOpen && (
        <Modal
          {...(!auth && modalSelected === 'address' && { title: t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?') })}
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          width={modalSelected === 'address' ? orderState?.options?.user_id ? '70%' : '50%' : '700px'}
        >
          {modalSelected === 'cart' && (
            <CartContent
              hideProducts
              hideBusinessArrow
              carts={carts}
              isOrderStateCarts={!!orderState.carts}
              onClose={() => setModalIsOpen(false)}
            />
          )}
          {modalSelected === 'address' && (
            auth
              ? (
                <AddressList
                  isModal
                  changeOrderAddressWithDefault
                  userId={isNaN(userCustomer?.id) ? null : userCustomer?.id}
                  onCancel={() => setModalIsOpen(false)}
                  isCustomerMode={isCustomerMode}
                />
                )
              : (
                <AddressFormWrapper>
                  <AddressForm
                    useValidationFileds
                    address={orderState?.options?.address || {}}
                    onCancel={() => setModalIsOpen(false)}
                    onSaveAddress={() => setModalIsOpen(false)}
                    isCustomerMode={isCustomerMode}
                  />
                </AddressFormWrapper>
                )
          )}
          {modalSelected === 'moment' && (
            <MomentContent
              onClose={() => setModalIsOpen(false)}
              cateringPreorder={!!cateringTypeString}
              isHeader
              business={(pathname.includes('store') && business) || isSingleBusiness}
              {...cateringValues}
            />
          )}
          {modalSelected === 'delivery' && (
            <OrderTypeSelectorContent
              onClose={() => setModalIsOpen(false)}
              configTypes={!configState?.loading && configTypes?.length > 0 ? configTypes : null}
              defaultValue={!(!configState?.loading && configTypes?.length > 0) && 1}
            />
          )}
        </Modal>
      )}
      {isCustomerMode && customerModalOpen && (
        <Modal
          open={customerModalOpen}
          width='80%'
          onClose={() => setCustomerModalOpen(false)}
          padding='20px'
          hideCloseDefault
        >
          <UserEdit>
            {!customerState?.loading && (
              <>
                <UserDetails
                  isAddressFormOpen={isAddressFormOpen}
                  userData={customerState?.user}
                  userId={customerState?.user?.id}
                  isOpenUserData={isOpenUserData}
                  isCustomerMode
                  isModal
                  setIsOpenUserData={setIsOpenUserData}
                  onClose={() => setCustomerModalOpen(false)}
                />
                <AddressList
                  isModal
                  userId={customerState?.user?.id}
                  changeOrderAddressWithDefault
                  userCustomerSetup={customerState.user}
                  isOpenUserData={isOpenUserData}
                  setCustomerModalOpen={setCustomerModalOpen}
                  setIsOpenUserData={setIsOpenUserData}
                  setIsAddressFormOpen={setIsAddressFormOpen}
                  isHeader
                  isCustomerMode={isCustomerMode}
                />
              </>
            )}
          </UserEdit>
        </Modal>
      )}
      {authModalOpen && !auth && (
        <Modal
          open={authModalOpen}
          onRemove={() => closeAuthModal()}
          onClose={() => closeAuthModal()}
          width='50%'
          authModal
          closeOnBackdrop
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              notificationState={notificationState}
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'signup' })
                  } href='#'
                >{t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
                  } href='#'
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {modalPageToShow === 'signup' && (
            <SignUpForm
              notificationState={notificationState}
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
              handleSuccessSignup={handleSuccessSignup}
              isPopup
              closeModal={() => closeAuthModal()}
            />
          )}
          {modalPageToShow === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
      <Confirm
        title={t('CUSTOMER', theme?.defaultLanguages?.CUSTOMER || 'Customer')}
        content={confirm.content}
        acceptText={t('ACCEPT', theme?.defaultLanguages?.ACCEPT || 'Accept')}
        open={isCustomerMode && confirm.open}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onCancel={() => setConfirm({ ...confirm, open: false })}
        onAccept={confirm.handleOnAccept}
        closeOnBackdrop={false}
      />
      {!!preorderBusiness && (
        <Modal
          open={!!preorderBusiness}
          width='760px'
          onClose={() => handleClosePreorder()}
        >
          <BusinessPreorder
            business={preorderBusiness}
            handleClick={handleBusinessClick}
            showButton
          />
        </Modal>
      )}
    </HeaderContainer>
  )
}

const defaultProps = {
  isShowOrderOptions: true
}

export default Header
