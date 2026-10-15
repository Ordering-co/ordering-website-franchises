import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import {
  HeroContainer,
  UseAccount,
  HeroContent,
  BannerContainer,
  ImageWrapper
} from './styles'
import {
  useSite,
  useSession,
  useOrder,
  useLanguage,
  useEvent,
  PageBanner as HomeHeroController
} from '~components'

import {
  Modal,
  Button,
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  useWindowSize,
  checkSiteUrl,
  OrderProgress,
  useConfigFile,
  generalUtilities
} from '~ui'

const OrderNowComponent = (props) => {
  const {
    hasBanners,
    franchiseId,
    user,
    handleOpenLoginSignUp,
    handleGoToOrderTypes
  } = props

  const [, t] = useLanguage()

  return (
    <HeroContent hasBanners={hasBanners}>
      <UseAccount>
        <Button
          color='primary'
          onClick={() => handleGoToOrderTypes()}>
          {t('ORDER_NOW', 'Order Now')}
        </Button>
        <OrderProgress
          franchiseId={franchiseId}
          userCustomerId={user?.id}
          handleOpenLoginSignUp={handleOpenLoginSignUp}
          hasBanners={hasBanners}
          isGetOrdersFromHome
        />
      </UseAccount>
    </HeroContent>
  )
}

const HomeHeroUI = (props) => {
  const { notificationState, pageBannerState } = props

  const [{ auth, user }, { login }] = useSession()
  const [{ options }, { changeType }] = useOrder()
  const [configFile] = useConfigFile()
  const [, t] = useLanguage()
  const [events] = useEvent()
  const { handleCreateGuestUser } = generalUtilities()
  const [{ site }] = useSite()
  const theme = useTheme()
  const windowSize = useWindowSize()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)

  const bgImg = theme?.my_products?.components?.images?.components?.homepage_background?.components?.image
  const mobileBgImg = theme?.my_products?.components?.images?.components?.homepage_mobile_background?.components?.image
  const isFullScreen = theme?.my_products?.components?.images?.components?.homepage_image_fullscreen

  const handleOpenLoginSignUp = (index) => {
    setModalPageToShow(index)
    setAuthModalOpen(true)
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

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  const handleGoToOrderTypes = async (orderType) => {
    // A local catalogue preview does not create a guest user in the backend.
    if (configFile.localProjectPinned) {
      events.emit('go_to_page', { page: 'search' })
      return
    }
    await changeType(options.type ?? orderType)
    if (!auth && !user?.guestId) {
      await handleCreateGuestUser()
    }
    events.emit('go_to_page', { page: 'order_types' })
  }

  const businessUrlTemplate = checkSiteUrl(site?.business_url_template, '/store/:business_slug')
  const productUrlTemplate = checkSiteUrl(site?.product_url_template, '/store/:business_slug?category=:category_id&product=:product_id')

  const onProductRedirect = ({ slug, category, product }) => {
    if (!category && !product) {
      if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
        return events.emit('go_to_page', { page: 'business', params: { business_slug: slug }, replace: false })
      } else {
        return events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${slug}`, replace: false })
      }
    }
    events.emit('product_banner_clicked')
    if (productUrlTemplate === '/store/:business_slug/:category_slug/:product_slug' || productUrlTemplate === '/:business_slug/:category_slug/:product_slug') {
      return events.emit('go_to_page', {
        page: 'product',
        params: {
          business_slug: slug,
          category_slug: category,
          product_slug: product
        },
        replace: false
      })
    }
    if (productUrlTemplate.includes('/store/:category_slug/:product_slug')) {
      const businessParameter = businessUrlTemplate.replace('/store?', '').replace('=:business_slug', '')
      return events.emit('go_to_page', {
        page: 'product',
        params: {
          category_slug: category,
          product_slug: product
        },
        search: `?${businessParameter}=${slug}`,
        replace: false
      })
    }
    if (productUrlTemplate.includes('/store/:business_slug') && productUrlTemplate.includes('category_id')) {
      const ids = productUrlTemplate.split('?')[1].split('&')
      const categoryParameter = ids[0].replace('=:category_id', '')
      const productParameter = ids[1].replace('=:product_id', '')
      return events.emit('go_to_page', {
        page: 'product',
        params: {
          business_slug: slug
        },
        search: `?${categoryParameter}=${category}&${productParameter}=${product}`,
        replace: false
      })
    }
    if (productUrlTemplate.includes('/:business_slug') && !productUrlTemplate.includes('store')) {
      const ids = productUrlTemplate.split('?')[1].split('&')
      const categoryParameter = ids[0].replace('=:category_id', '')
      const productParameter = ids[1].replace('=:product_id', '')
      return events.emit('go_to_page', {
        page: 'product',
        params: {
          business_slug: slug
        },
        search: `?${categoryParameter}=${category}&${productParameter}=${product}`,
        replace: false
      })
    }
  }

  const handleGoToPage = (action) => {
    if (!action?.url) return
    let slug
    if (action.type === 'business') {
      slug = action.url.split('store/')[1]
      onProductRedirect({ slug })
    }
    if (action.type === 'product') {
      slug = action.url.split('store/')[1]?.split('?')[0]
      const paramString = action.url.split('?')[1]
      const urlParams = new URLSearchParams(paramString)
      const productId = urlParams.get('product')
      const categoryId = urlParams.get('category')
      onProductRedirect({ slug, category: categoryId, product: productId })
    }
  }

  return (
    <>
      {pageBannerState.banner?.items?.length > 0 && !pageBannerState.error && windowSize.width > 576 && (
        <BannerContainer>
          <Swiper
            navigation={pageBannerState.banner?.items?.length > 1}
            spaceBetween={0}
            modules={[Navigation]}
            shortSwipes={false}
            loop={pageBannerState.banner?.items.length > 1}
            touchStartPreventDefault={false}
            slidesPerView={1}
          >
            {pageBannerState.banner?.items.map((img, i) => (
              <SwiperSlide
                key={i}
                onClick={() => handleGoToPage()}
              >
                <ImageWrapper>
                  <img src={img.url} className='banner-img' alt='' />
                </ImageWrapper>
              </SwiperSlide>
            ))}
          </Swiper>
          <OrderNowComponent
            hasBanners
            isGetOrdersFromHome
            franchiseId={configFile?.franchiseSlug}
            userCustomerId={user?.id}
            handleGoToOrderTypes={() => handleGoToOrderTypes()}
            handleOpenLoginSignUp={handleOpenLoginSignUp}
          />
        </BannerContainer>
      )}
      {(pageBannerState.banner?.items?.length === 0 || pageBannerState.error || windowSize.width <= 576) && (
        <HeroContainer
          bgimage={windowSize.width < 576
            ? (mobileBgImg || theme.images?.general?.homeHeroMobile)
            : (bgImg || theme.images?.general?.homeHero)}
          isFullScreen={isFullScreen}
        >
          <OrderNowComponent
            isGetOrdersFromHome
            franchiseId={configFile?.franchiseSlug}
            userCustomerId={user?.id}
            handleGoToOrderTypes={() => handleGoToOrderTypes()}
            handleOpenLoginSignUp={handleOpenLoginSignUp}
          />
        </HeroContainer>
      )}
      {authModalOpen && !auth && (
        <Modal
          open={authModalOpen}
          onClose={() => closeAuthModal()}
          width='50%'
          authModal
          closeIconRight
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
                >{t('FORGOT_YOUR_PASSWORD', 'Forgot your password?')}
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
              hideBusinessDriverSignup
              isPopup
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
    </>
  )
}

export const HomeHero = (props) => {
  const homeHeroProps = {
    ...props,
    UIComponent: HomeHeroUI,
    position: 'web_home_page'
  }
  return <HomeHeroController {...homeHeroProps} />
}
