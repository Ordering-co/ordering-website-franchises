import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Switch,
  Route,
  Redirect,
  Link,
  useLocation,
  useHistory
} from 'react-router-dom'
import parse from 'html-react-parser'
import { useTheme } from 'styled-components'
// PWA disabled
// import PWAPrompt from 'react-ios-pwa-prompt'
import loadable from '@loadable/component'
import settings from './config'
import { firebasePushSetup, getFirebaseWebConfig, isFirebasePushEnabled, getOpenedPushOrderUuid } from './utils/firebaseWebPush'
import { getSiteFaviconUrl, getSiteLogoUrl } from './utils/siteBranding'
import { shouldShowPoweredByForClient } from './utils/poweredByVisibility'
import { stripSpoonityTokenFromHistory } from './utils/stripSpoonityIntegrationToken'
import { parseOrderTypesAllowed } from './utils/parseOrderTypesAllowed'

import {
  useSession,
  useApi,
  useLanguage,
  useOrder,
  FacebookPixel,
  useConfig,
  AnalyticsSegment,
  useEvent,
  useOrderingTheme,
  useSite
} from '~components'

import {
  Alert,
  useWindowSize,
  useOnlineStatus,
  ThemeProvider,
  CancellationComponent,
  SmartAppBanner,
  SpinnerLoader,
  Header,
  Modal,
  Button,
  Input,
  Footer,
  NotNetworkConnectivity,
  ReviewTrigger,
  ReviewOrder,
  ReviewProduct,
  ReviewDriver,
  SignUpApproval,
  QueryLoginSpoonity,
  NavigationBar
} from '~ui'

import { lazyRetry } from './components/LazyRetry'
import GoogleAnalytics from './components/GoogleAnalytics'

const AddressList = loadable(() => lazyRetry(() => import('./pages/AddressList')))
const BusinessProductsList = loadable(() => lazyRetry(() => import('./pages/BusinessProductsList')))
const CheckoutPage = loadable(() => lazyRetry(() => import('./pages/Checkout')))
const Cms = loadable(() => lazyRetry(() => import('./pages/Cms')))
const HomePage = loadable(() => lazyRetry(() => import('./pages/Home')))
const MyOrders = loadable(() => lazyRetry(() => import('./pages/MyOrders')))
const OrderDetailsPage = loadable(() => lazyRetry(() => import('./pages/OrderDetails')))
const PageNotFound = loadable(() => lazyRetry(() => import('./pages/PageNotFound')))
const PagesList = loadable(() => lazyRetry(() => import('./pages/PagesList')))

const ScrollToTop = loadable(() => lazyRetry(() => import('./components/ScrollToTop')))
const ListenPageChanges = loadable(() => lazyRetry(() => import('./components/ListenPageChanges')))
const HelmetTags = loadable(() => lazyRetry(() => import('./components/HelmetTags')))
const Account = loadable(() => lazyRetry(() => import('./pages/Account')))
const Login = loadable(() => lazyRetry(() => import('./pages/Login')))
const Profile = loadable(() => lazyRetry(() => import('./pages/Profile')))
const Wallets = loadable(() => lazyRetry(() => import('./pages/Wallets')))
const MessagesList = loadable(() => lazyRetry(() => import('./pages/MessagesList')))
const Help = loadable(() => lazyRetry(() => import('./pages/Help')))
const Favorite = loadable(() => lazyRetry(() => import('./pages/Favorite')))
const RewardTransactions = loadable(() => lazyRetry(() => import('./pages/RewardTransactions')))
const SessionsList = loadable(() => lazyRetry(() => import('./pages/SessionsList')))
const SignUpBusiness = loadable(() => lazyRetry(() => import('./pages/SignUpBusiness')))
const SignUpDriver = loadable(() => lazyRetry(() => import('./pages/SignUpDriver')))
const UserVerification = loadable(() => lazyRetry(() => import('./pages/UserVerification')))
const Promotions = loadable(() => lazyRetry(() => import('./pages/Promotions')))
const ResetPassword = loadable(() => lazyRetry(() => import('./pages/ResetPassword')))
const MultiCheckout = loadable(() => lazyRetry(() => import('./pages/MultiCheckout')))
const MultiCart = loadable(() => lazyRetry(() => import('./pages/MultiCart')))
const MultiOrdersDetails = loadable(() => lazyRetry(() => import('./pages/MultiOrdersDetails')))
const OrderTypes = loadable(() => lazyRetry(() => import('./pages/OrderTypes')))

export const App = () => {
  const history = useHistory()
  const [{ auth, user, token }, { login }] = useSession()
  const [events] = useEvent()
  const [ordering] = useApi()
  const theme = useTheme()
  const [orderStatus, { changeType, getLastOrderHasNoReview }] = useOrder()
  const [{ configs, loading: configLoading }] = useConfig()
  const [{ loading: siteLoading, site }] = useSite()
  const [languageState, t] = useLanguage()
  const [orderingTheme] = useOrderingTheme()
  const [loaded, setLoaded] = useState(false)
  const onlineStatus = useOnlineStatus()
  const location = useLocation()
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const windowSize = useWindowSize()
  const [businessSignUpSuccessed, setBusinessSignUpSuccessed] = useState({ open: false, content: {} })
  const [searchValue, setSearchValue] = useState('')
  const [lastOrderReview, setLastOrderReview] = useState({
    isReviewOpen: false,
    order: null,
    defaultStar: 5,
    reviewStatus: { trigger: false, order: false, product: false, driver: false },
    reviewed: { isOrderReviewed: false, isProductReviewed: false, isDriverReviewed: false }
  })
  const [oneSignalState, setOneSignalState] = useState({
    notification_app: settings.notification_app
  })
  const firebasePushSetupRef = useRef(false)

  const isShowReviewsPopupEnabled = configs?.show_reviews_popups_enabled?.value === '1'
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'
  const hashKey = new URLSearchParams(useLocation()?.search)?.get('hash') || null
  const isKioskApp = settings?.use_kiosk
  const enabledPoweredByOrdering = shouldShowPoweredByForClient(configs)

  let queryIntegrationToken
  let queryIntegrationCode
  if (location.search) {
    const query = new URLSearchParams(location.search)
    queryIntegrationCode = query.get('integration_code')
    queryIntegrationToken = query.get('integration_token')
  }

  const themeUpdated = useMemo(() => ({
    ...theme,
    ...orderingTheme?.theme,
    colors: {
      ...theme.colors,
      ...(orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.primary_btn_color && { primary: orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.primary_btn_color }),
      ...(orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.primary_link_color && { links: orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.primary_link_color }),
      ...(orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.background_page && { backgroundPage: orderingTheme?.theme?.my_products?.components?.theme_settings?.components?.style?.background_page })
    },
    fonts: {
      ...theme.fonts,
      primary: {
        ...theme.fonts.primary,
        ...({ name: orderingTheme?.theme?.general?.components?.fonts?.primary?.name })
      }
    },
    images: {
      ...theme.images,
      general: {
        ...theme.images.general,
        homeHero: orderingTheme?.theme?.homepage_view?.components?.homepage_header?.components?.image || theme.images?.general?.homeHero,
        businessHero: orderingTheme?.theme?.business_listing_view?.components?.business_hero?.components?.image || theme.images?.general?.businessHero,
        notFound: orderingTheme?.theme?.business_listing_view?.components?.not_found_source?.components?.image || theme.images?.general?.notFound,
        emptyActiveOrders: orderingTheme?.theme?.orders?.components?.active_orders?.components?.not_found_source?.components?.image || theme.images?.general?.emptyActiveOrders,
        emptyPastOrders: orderingTheme?.theme?.orders?.components?.past_orders?.components?.not_found_source?.components?.image,
        notNetwork: orderingTheme?.theme?.no_internet?.components?.image || theme.images?.general?.notNetwork,
        businessSignUpHero: orderingTheme?.theme?.business_signup?.components?.icon?.components?.image || theme.images?.general?.businessSignUpHero,
        driverSignUpHero: orderingTheme?.theme?.driver_signup?.components?.icon?.components?.image || theme.images?.general?.driverSignUpHero
      },
      categories: {
        ...theme.images.categories,
        food: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.food?.image || theme.images.categories.categoryFood,
        groceries: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.groceries?.image || theme.images.categories.categoryGroceries,
        alcohol: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.alcohol?.image || theme.images.categories.categoryAlcohol,
        laundry: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.laundry?.image || theme.images.categories.categoryLaundry,
        all: orderingTheme?.theme?.business_listing_view?.components?.categories?.components?.all?.image || theme.images.categories.categoryAll
      },
      dummies: {
        ...theme.images.dummies,
        businessHeader: orderingTheme?.theme?.business_view?.components?.header?.components?.dummy_image || theme.images.dummies.businessHeader,
        businessLogo: orderingTheme?.theme?.business_view?.components?.header?.components?.logo?.dummy_image || theme.images.dummies.businessLogo,
        product: orderingTheme?.theme?.business_view?.components?.products?.components?.photo?.components?.dummy_image || theme.images.dummies.product,
        category: orderingTheme?.theme?.business_view?.components?.categories?.components?.photo?.components?.dummy_image || theme.images.dummies.product
      },
      logos: {
        ...theme.images.logos,
        logotype: getSiteLogoUrl(
          orderingTheme?.theme?.header?.components?.logo?.components?.image ||
            orderingTheme?.theme?.my_products?.components?.images?.components?.logo?.components?.image,
          theme.images.logos.logotype
        )
      }
    },
    utils: {
      tsize: {
        xxl: 48,
        xl: 32,
        l: 24,
        m: 20,
        s: 16,
        xs: 14,
        xxs: 12
      },
      radius: {
        s: 5,
        m: 10
      },
      margins: {
        t: 20,
        b: 10,
        r: 10,
        l: 10
      },
      zi: {
        l: 99999,
        m: 9999
      }
    }
  }), [theme, orderingTheme])

  const websiteThemeType = themeUpdated?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = themeUpdated?.my_products?.components?.website_theme?.components?.business_slug
  const updatedBusinessSlug = (websiteThemeType === 'single_store' && websiteThemeBusinessSlug) || settings?.businessSlug
  const businessesSlug = {
    marketplace: 'marketplace',
    kiosk: updatedBusinessSlug,
    business: updatedBusinessSlug
  }

  const singleBusinessConfig = {
    isActive: settings?.use_marketplace || updatedBusinessSlug || isKioskApp,
    businessSlug: businessesSlug[isKioskApp ? 'kiosk' : 'marketplace']
  }
  const googleAnalyticsMeasurementId = singleBusinessConfig?.isActive
    ? settings?.store_google_analytics_id
    : configs?.track_id_google_analytics?.value

  const signUpBusinesslayout = themeUpdated?.business_signup?.components?.layout?.type === 'old'
    ? 'old'
    : 'new'

  const signUpDriverlayout = themeUpdated?.driver_signup?.components?.layout?.type === 'old'
    ? 'old'
    : 'new'

  const orderTypeSearchParam = parseInt(new URLSearchParams(location.search)?.get('order_type') ?? '0', 10)
  const configTypes = parseOrderTypesAllowed(configs?.order_types_allowed?.value)

  const isWalletEnabled = (configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')) && !isKioskApp
  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified
  const isUserVerifyRequired = (isEmailVerifyRequired || isPhoneVerifyRequired) && !isKioskApp
  const isHideFooter = themeUpdated?.footer?.hidden

  const guestCheckoutEnabled = false
  // configs?.guest_checkout_enabled?.value === '1' &&
  // (!orderTypeList[orderStatus?.options?.type - 1] || configs?.allowed_order_types_guest_checkout?.value?.includes(orderTypeList[orderStatus?.options?.type - 1]))

  const isHome = location.pathname === '/' || location.pathname === '/home'
  const isFooterPage = location.pathname === '/pages/footer' || (!isHome && windowSize?.width < 576) || isKioskApp || isHideFooter

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const acceptAlert = () => {
    window.localStorage.setItem('front_version', configs?.front_version?.value)
    window.location.reload()
  }

  const handleSuccessSignup = (user) => {
    if (!user?.enabled && (configs?.business_signup_enabled_default?.value === '0' || configs?.driver_signup_enabled_default?.value === '0')) {
      signUpBusinesslayout === 'new'
        ? setBusinessSignUpSuccessed({
          open: true,
          content: {
            approvalType: 'no_automatic',
            businessType: user?.level,
            project: settings.project,
            dashboardUrl: settings.url_dashboard,
            dashboardLoginUrl: `${settings.url_dashboard}/login/?project=${settings.project}&token=${user?.session?.access_token}`,
            contactEmail: settings.contact_email
          }
        })
        : setAlertState({
          open: true,
          content: [t('BUSINESS_SIGNUP_MESSAGE', 'We will contact you as soon as possible')]
        })
      return
    }

    if (configs?.business_signup_enabled_default?.value === '1' || configs?.driver_signup_enabled_default?.value === '1') {
      signUpBusinesslayout === 'new'
        ? setBusinessSignUpSuccessed({
          open: true,
          content: {
            approvalType: 'automatic',
            businessType: user?.level,
            project: settings.project,
            dashboardUrl: settings.url_dashboard,
            dashboardLoginUrl: `${settings.url_dashboard}/login/?project=${settings.project}&token=${user?.session?.access_token}`,
            contactEmail: settings.contact_email
          }
        })
        : setAlertState({
          open: true,
          content: [
            `${t('PROJECT', 'Project')}: ${settings.project}`
          ],
          links: [
            <span key='url dashboard'>
              {`${t('DASHBOARD_WEBPAGE_MESSAGE', 'Dashboard webpage')}: `}
              <a
                target='blank'
                href={`${settings.url_dashboard}/login/?project=${settings.project}&token=${user?.session?.access_token}`}
              >
                <span style={{ color: theme.colors.links }}>{settings.url_dashboard}</span>
              </a>
            </span>
          ],
          isOnlyAlert: true
        })

      login({
        user,
        token: user?.session?.access_token
      })
    }
  }

  const goToPage = (page, params) => {
    events.emit('go_to_page', { page, params })
  }

  const _getLastOrderHasNoReview = async () => {
    const lastOrderHasNoReview = await getLastOrderHasNoReview()
    lastOrderHasNoReview && OrderReviewRequired(lastOrderHasNoReview)
  }

  const reviewModalTitle = () => {
    if (lastOrderReview?.reviewStatus?.trigger) return t('HOW_WAS_YOUR_ORDER', 'How was your order?')
    if (lastOrderReview?.reviewStatus?.order) return t('REVIEW_ORDER', 'Review order')
    if (lastOrderReview?.reviewStatus?.product) return t('REVIEW_PRODUCT', 'Review Product')
    return t('REVIEW_DRIVER', 'Review Driver')
  }

  const OrderReviewRequired = (order) => {
    setLastOrderReview({
      isReviewOpen: !!((location?.pathname === '/' || location?.pathname === '/order_types' || location?.pathname === '/home')),
      order,
      defaultStar: 5,
      reviewStatus: { trigger: true, order: false, product: false, driver: false },
      reviewed: { isOrderReviewed: false, isProductReviewed: false, isDriverReviewed: false }
    })
  }

  const handleOpenOrderReview = (star) => {
    setLastOrderReview({
      ...lastOrderReview,
      defaultStar: star,
      reviewStatus: { trigger: false, order: true, product: false, driver: false }
    })
  }

  const handleCloseReivew = () => {
    setLastOrderReview({
      ...lastOrderReview,
      isReviewOpen: false,
      reviewStatus: { trigger: false, order: false, product: false, driver: false }
    })
  }

  const setIsReviewed = (reviewType) => {
    const _reviewStatus = { ...lastOrderReview?.reviewed }
    setLastOrderReview({
      ...lastOrderReview,
      reviewed: { ..._reviewStatus, [reviewType]: true }
    })
  }

  const closeReviewOrder = () => {
    const enableProduct = lastOrderReview?.order?.products.some(product => !product?.deleted)
    if (!lastOrderReview?.reviewed?.isProductReviewed && enableProduct) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: true, driver: false } })
    else if ((lastOrderReview?.order?.driver || enableProduct) && !lastOrderReview?.order?.user_review && !lastOrderReview?.reviewed?.isDriverReviewed) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: false, driver: true } })
    else handleCloseReivew()
  }

  const closeReviewProduct = () => {
    if (lastOrderReview?.order?.driver && !lastOrderReview?.order?.user_review && !lastOrderReview?.reviewed?.isDriverReviewed) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: false, driver: true } })
    else {
      setIsReviewed('isDriverReviewed')
      handleCloseReivew()
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    stripSpoonityTokenFromHistory({
      href: window.location.href,
      historyState: window.history.state,
      replaceState: window.history.replaceState.bind(window.history)
    })
  }, [queryIntegrationToken])

  useEffect(() => {
    const hasThemeFavicon = themeUpdated?.general?.components?.favicon?.components.image
    const faviconHref = getSiteFaviconUrl(hasThemeFavicon, site?.logo)
    let favicon = document.getElementById('favicon')
    if (!favicon) {
      if (orderingTheme?.loading) return
      favicon = document.createElement('link')
      favicon.id = 'favicon'
      favicon.rel = 'icon'
      favicon.type = 'image/png'
      document.head.appendChild(favicon)
    }

    if (favicon.getAttribute('href') !== faviconHref) {
      favicon.setAttribute('href', faviconHref)
    }

    const fonts = Object.entries(themeUpdated?.general?.components?.fonts || {})
    fonts.forEach(([name, fontFamily]) => {
      const fontElement = window.document.getElementById(`${name}-font-styles`)
      if (
        (fontElement?.name !== fontFamily.name && fontFamily.name) ||
        (fontElement?.href !== fontFamily?.href && fontFamily?.href) ||
        (JSON.stringify(fontElement?.weights) !== JSON.stringify(fontFamily?.weights) && fontFamily?.weights)
      ) {
        window.document.body.removeChild(window.document.getElementById(`${name}-font-styles`))
        const font = window.document.createElement('link')
        font.id = `${name}-font-styles`
        font.rel = 'stylesheet'
        font.async = true
        font.defer = true
        font.name = fontFamily.name
        const weights = typeof fontFamily?.weights === 'number' ? fontFamily?.weights : JSON.parse(fontFamily?.weights)?.join?.(';')
        font.href = fontFamily.href || `https://fonts.googleapis.com/css2?family=${fontFamily?.name}:wght@${weights || [400]}&display=swap`

        window.document.body.appendChild(font)
        if (name === 'primary') {
          window.document.body.style.fontFamily = fontFamily.name
        }
      }
    })
  }, [themeUpdated, site?.logo])

  useEffect(() => {
    if (!isShowReviewsPopupEnabled) return
    const _user = window.localStorage.getItem('user')
    const _token = window.localStorage.getItem('token')
    const _reviewRequired = window.sessionStorage.getItem('review-required')
    if (((_user || _token) && auth) && _reviewRequired !== '1') {
      window.sessionStorage.setItem('review-required', '1')
      _getLastOrderHasNoReview()
    }
    if (!(_user || _token)) {
      window.sessionStorage.removeItem('review-required')
    }
  }, [auth, isShowReviewsPopupEnabled, location.pathname])

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !configLoading && !siteLoading && !orderingTheme?.loading) {
      if (orderTypeSearchParam && configTypes.includes(orderTypeSearchParam)) {
        changeType(parseInt(orderTypeSearchParam, 10))
        if (orderStatus?.options?.type === parseInt(orderTypeSearchParam, 10)) {
          setLoaded(true)
        }
        return
      }
      setLoaded(true)
    }
  }, [orderStatus, configLoading, siteLoading, orderingTheme])

  useEffect(() => {
    if (configs?.front_version?.value && loaded) {
      const localStorageFrontVersion = window.localStorage.getItem('front_version')
      if (localStorageFrontVersion && localStorageFrontVersion !== configs?.front_version?.value) {
        setAlertState({
          open: true,
          content: [t('RELOAD_FRONT_QUESTION', 'There is a new version of Ordering! Do you want to update it?')]
        })
      }
    }
  }, [configs, loaded])

  useEffect(() => {
    if (isHome && (settings?.use_marketplace || updatedBusinessSlug)) {
      goToPage('business', { store: settings?.use_marketplace ? 'marketplace' : updatedBusinessSlug })
    }
  }, [])

  useEffect(() => {
    if (!orderStatus.loading) {
      const localCountryCode = orderStatus?.options?.address?.country_code ??
        window.localStorage.getItem('country-code')

      if (localCountryCode) {
        ordering?.setCountryCode && ordering.setCountryCode(localCountryCode)
      }
    }
  }, [orderStatus])

  useEffect(() => {
    if (
      languageState?.error &&
      languageState?.error?.includes('This project does not exist') &&
      settings?.use_project_subdomain
    ) {
      window.open('https://www.orderingplus.com', '_self')
    }
  }, [languageState])

  const oneSignalSetup = () => {
    const OneSignal = window.OneSignal || []
    const hostname = window.location.hostname
    const initConfig = {
      appId: configs?.onesignal_orderingweb_id?.value,
      allowLocalhostAsSecureOrigin: hostname === 'localhost',
      notificationClickHandlerAction: 'navigate'
    }

    OneSignal?.push?.(function () {
      OneSignal.SERVICE_WORKER_PARAM = { scope: '/push/onesignal/' }
      OneSignal.SERVICE_WORKER_PATH = 'push/onesignal/OneSignalSDKWorker.js'
      OneSignal.SERVICE_WORKER_UPDATER_PATH = 'push/onesignal/OneSignalSDKWorker.js'
      if (!OneSignal?._initCalled) {
        OneSignal?.init?.(initConfig)
      }

      const onNotificationClicked = function (data) {
        if (data?.data?.order_uuid) {
          history.push(`/orders/${data?.data?.order_uuid}`)
        }
      }
      const handler = function (data) {
        onNotificationClicked(data)
        OneSignal.addListenerForNotificationOpened(handler)
      }
      OneSignal.addListenerForNotificationOpened(handler)

      OneSignal.on('subscriptionChange', function (isSubscribed) {
        if (isSubscribed) {
          OneSignal.getUserId((userId) => {
            const data = {
              ...oneSignalState,
              notification_token: userId
            }
            setOneSignalState(data)
          })
        }
      })

      OneSignal.getUserId((userId) => {
        const data = {
          ...oneSignalState,
          notification_token: userId
        }
        setOneSignalState(data)
      })
    })
  }

  const firebaseWebPushSetup = () => {
    if (firebasePushSetupRef.current) return
    firebasePushSetupRef.current = true
    firebasePushSetup({
      config: getFirebaseWebConfig(configs),
      onToken: (fcmToken) => {
        setOneSignalState({
          ...oneSignalState,
          notification_token: fcmToken,
          notification_provider: 'fcm'
        })
      },
      onNotificationClick: (data) => {
        const orderUuid = getOpenedPushOrderUuid(data)
        if (orderUuid) {
          history.push(`/orders/${orderUuid}`)
        }
      }
    }).catch((error) => {
      firebasePushSetupRef.current = false
      console.log('Firebase push setup error:', error)
    })
  }

  const subscribePushNotifications = async () => {
    try {
      await fetch(`${ordering.root}/users/${user?.id}/notification_tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          token: oneSignalState.notification_token,
          user_id: user?.id,
          app: oneSignalState.notification_app,
          provider: oneSignalState.notification_provider
        })
      })
    } catch (error) {
      console.log('Firebase push subscribe error:', error)
    }
  }

  useEffect(() => {
    if (!auth || !oneSignalState?.notification_token || !oneSignalState?.notification_provider) return
    subscribePushNotifications()
  }, [auth, oneSignalState?.notification_token])

  useEffect(() => {
    if (configLoading) return
    if (isFirebasePushEnabled(configs)) {
      firebaseWebPushSetup()
      return
    }
    oneSignalSetup()
  }, [configLoading, events])

  useEffect(() => {
    if (!themeUpdated?.third_party_code?.body) return

    if (document.getElementById('third-party-body-scripts-loaded')) return

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = themeUpdated.third_party_code.body

    const scripts = tempDiv.querySelectorAll('script')
    scripts.forEach(script => {
      const newScript = document.createElement('script')
      if (script.src) {
        newScript.src = script.src
      } else {
        newScript.innerHTML = script.innerHTML
      }
      if (script.type) {
        newScript.type = script.type
      }
      document.body.appendChild(newScript)
    })

    const marker = document.createElement('div')
    marker.id = 'third-party-body-scripts-loaded'
    marker.style.display = 'none'
    document.body.appendChild(marker)
  }, [themeUpdated?.third_party_code?.body])

  return settings.isCancellation
    ? (
      <CancellationComponent
        ButtonComponent={Button}
        InputComponent={Input}
      />
      )
    : (
      <>
        <div style={{ marginBottom: windowSize.width < 576 && onlineStatus ? 80 : 0 }}>
          <GoogleAnalytics
            measurementId={googleAnalyticsMeasurementId}
            currency={configs?.stripe_currency?.value}
            affiliation={site?.name || settings?.app_name}
          />
          {(!!configs?.segment_track_id?.value || !!settings?.store_segment_id) && (
            <AnalyticsSegment writeKey={singleBusinessConfig?.isActive ? settings?.store_segment_id : configs?.segment_track_id?.value} />
          )}
          {(!!configs?.facebook_id?.value || !!settings?.store_facebook_pixel_id) && FacebookPixel && (
            <FacebookPixel trackId={singleBusinessConfig?.isActive ? settings?.store_facebook_pixel_id : configs?.facebook_id?.value} />
          )}
          {!loaded && <SpinnerLoader />}
          {!siteLoading && !orderingTheme?.loading && (
            <SmartAppBanner
              appName={site?.name || settings?.app_name}
              description={site?.description}
              storeAndroidId={themeUpdated?.smart_banner_settings?.android_id ?? settings?.store_android_id}
              storeAppleId={themeUpdated?.smart_banner_settings?.apple_id ?? settings?.store_apple_id}
              logo={getSiteLogoUrl(
                themeUpdated?.my_products?.components?.images?.components?.logo_mobile?.components?.image ||
                themeUpdated?.my_products?.components?.images?.components?.logo?.components?.image,
                themeUpdated?.images?.logos?.logotype
              )}
            />
          )}
          {
            loaded && (
              <ThemeProvider
                theme={themeUpdated}
              >
                <ListenPageChanges />
                {!(isKioskApp && isHome) && (
                  <Header
                    isHome={isHome}
                    location={location}
                    isCustomLayout={singleBusinessConfig.isActive}
                    singleBusinessConfig={singleBusinessConfig}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    notificationState={oneSignalState}
                    businessSlug={updatedBusinessSlug}
                    useModalMode
                  />
                )}
                <NotNetworkConnectivity />
                {onlineStatus && (
                  <ScrollToTop>
                    <HelmetTags />
                    <Switch>
                      <Route exact path='/home'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? (
                            <Redirect to='/verify' />
                            )
                          : (
                            <HomePage notificationState={oneSignalState} />
                            )}
                      </Route>
                      <Route exact path='/'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? (
                            <Redirect to='/verify' />
                            )
                          : (
                            <HomePage notificationState={oneSignalState} />
                            )
                        }
                      </Route>
                      <Route exact path='/order_types'>
                        {auth
                          ? <OrderTypes />
                          : <Redirect to='/' />
                        }
                      </Route>
                      {!isDisabledRewards && (
                        <Route exact path='/wallets'>
                        {(auth && !user?.guest_id)
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : isWalletEnabled
                              ? <Wallets />
                              : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                          : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/account'} />}
                      </Route>
                      )}
                      <Route exact path='/signup_business'>
                        {!auth && !isKioskApp
                          ? (
                            <SignUpBusiness
                              elementLinkToLogin={<Link to='/'>{t('LOGIN', 'Login')}</Link>}
                              useLoginByCellphone
                              useChekoutFileds
                              handleSuccessSignup={handleSuccessSignup}
                              layout={signUpBusinesslayout}
                              isRecaptchaEnable
                            />
                            )
                          : (
                            <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                            )}
                      </Route>
                      <Route exact path='/signup-driver'>
                        {!auth && !isKioskApp
                          ? (
                            <SignUpDriver
                              layout={signUpDriverlayout}
                              elementLinkToLogin={<Link to='/'>{t('LOGIN', 'Login')}</Link>}
                              useLoginByCellphone
                              useChekoutFileds
                              handleSuccessSignup={handleSuccessSignup}
                              isRecaptchaEnable
                            />
                            )
                          : (
                            <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                            )}
                      </Route>
                      <Route exact path='/password/reset'>
                        {auth
                          ? (
                            <Redirect to='/' />
                            )
                          : (
                              isKioskApp
                                ? <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                                : <ResetPassword />
                            )}
                      </Route>
                      <Route exact path='/reset_password'>
                        {auth
                          ? (
                            <Redirect to='/' />
                            )
                          : (
                              isKioskApp
                                ? <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                                : <ResetPassword />
                            )}
                      </Route>
                      <Route exact path='/account'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? <Redirect to='/verify' />
                          : (<Account userCustomer={user} auth={auth} notificationState={oneSignalState} />)
                        }
                      </Route>
                      <Route exact path='/profile'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : (<Profile userId={user?.id} accessToken={user?.session?.access_token} useValidationFields />)
                          : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />}
                      </Route>
                      <Route exact path='/verify'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? <UserVerification />
                          : <Redirect to={(auth || isKioskApp) ? singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/order_types' : '/'} />}
                      </Route>
                      <Route exact path='/profile/orders'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : (<MyOrders />)
                          : queryIntegrationToken && queryIntegrationCode === 'spoonity'
                            ? <QueryLoginSpoonity token={queryIntegrationToken} notificationState={oneSignalState} />
                            : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />}
                      </Route>
                      <Route exact path='/profile/addresses'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : (<AddressList />)
                          : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />}
                      </Route>
                      <Route exact path='/messages'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <MessagesList />
                          : (
                              isKioskApp
                                ? <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />
                                : <Redirect to={{ pathname: '/order_types' }} />
                            )}
                      </Route>
                      <Route exact path='/help'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : (<Help />)
                          : <Redirect to={singleBusinessConfig.isActive ? `/${singleBusinessConfig.businessSlug}` : '/'} />}
                      </Route>
                      <Route exact path='/promotions'>
                        {orderStatus.loading && !orderStatus.options?.address?.location
                          ? (
                            <SpinnerLoader />
                            )
                          : (
                              isUserVerifyRequired && !guestCheckoutEnabled
                                ? (
                                <Redirect to='/verify' />
                                  )
                                : (
                                    (auth || hashKey) || (orderStatus.options?.address?.location && !isKioskApp)
                                      ? <Promotions />
                                      : (
                                      <Redirect to={{
                                        pathname: singleBusinessConfig.isActive
                                          ? `/${singleBusinessConfig.businessSlug}`
                                          : '/',
                                        state: { from: location.pathname || null }
                                      }}
                                      />
                                        )
                                  )
                            )}
                      </Route>
                      <Route path='/checkout/:cartUuid?'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <CheckoutPage />
                          : (
                            <Redirect to={{
                              pathname: singleBusinessConfig.isActive
                                ? `/${singleBusinessConfig.businessSlug}`
                                : '/',
                              state: { from: location.pathname || null }
                            }}
                            />
                            )}
                      </Route>
                      <Route exact path='/multi-checkout/:cartUuid?'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <MultiCheckout />
                          : (
                            <Redirect to={{
                              pathname: singleBusinessConfig.isActive
                                ? `/${singleBusinessConfig.businessSlug}`
                                : '/',
                              state: { from: location.pathname || null }
                            }}
                            />
                            )}
                      </Route>
                      <Route exact path='/multi-cart'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <MultiCart />
                          : (
                            <Redirect to={{
                              pathname: singleBusinessConfig.isActive
                                ? `/${singleBusinessConfig.businessSlug}`
                                : '/',
                              state: { from: location.pathname || null }
                            }}
                            />
                            )}
                      </Route>
                      <Route exact path='/multi-orders/:orderId'>
                        {auth
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <MultiOrdersDetails />
                          : (
                            <Redirect to={{
                              pathname: singleBusinessConfig.isActive
                                ? `/${singleBusinessConfig.businessSlug}`
                                : '/',
                              state: { from: location.pathname || null }
                            }}
                            />
                            )}
                      </Route>
                      <Route exact path='/orders/:orderId'>
                        {(auth || hashKey)
                          ? isUserVerifyRequired && !guestCheckoutEnabled
                            ? <Redirect to='/verify' />
                            : <OrderDetailsPage />
                          : (
                            <Redirect to={{
                              pathname: singleBusinessConfig.isActive
                                ? `/${singleBusinessConfig.businessSlug}`
                                : '/',
                              state: { from: location.pathname || null }
                            }}
                            />
                            )}
                      </Route>
                      <Route exact path='/pages/:pageSlug'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? (
                            <Redirect to='/verify' />
                            )
                          : (
                            <Cms />
                            )}
                      </Route>
                      <Route exact path='/pages'>
                        {isUserVerifyRequired && !guestCheckoutEnabled
                          ? (
                            <Redirect to='/verify' />
                            )
                          : (
                            <PagesList />
                            )}
                      </Route>
                      <Route exact path='/favorite'>
                        {auth && !isKioskApp
                          ? <Favorite />
                          : (
                            <Redirect to='/' />
                            )}
                      </Route>
                      <Route exact path='/login/:cartUuid'>
                        {((auth && user?.guest_id)) && !isKioskApp
                          ? <Login notificationState={oneSignalState} />
                          : <Redirect to='/login' />
                        }
                      </Route>
                      <Route exact path='/login'>
                        {((auth && user?.guest_id) || !auth) && !isKioskApp
                          ? <Login notificationState={oneSignalState} />
                          : <Redirect to='/' />
                        }
                      </Route>
                      {!isDisabledRewards && (
                        <Route exact path='/reward/transactions'>
                          {auth && !isKioskApp
                            ? <RewardTransactions />
                            : (
                              <Redirect to='/' />
                              )}
                        </Route>
                      )}
                      <Route exact path='/sessions'>
                        {auth && !isKioskApp
                          ? <SessionsList />
                          : (
                            <Redirect to='/' />
                            )}
                      </Route>
                      {/*
                        Single Route for all business/product URL templates so path-style
                        product URLs (/:business/:category/:product) do not remount the
                        listing (same behavior as /store/:slug?category=&product=).
                      */}
                      <Route
                        exact
                        path={[
                          '/store',
                          '/store/:business_slug',
                          '/store/:business_slug/:category_slug/:product_slug',
                          '/store/:category_slug/:product_slug',
                          '/:business_slug',
                          '/:business_slug/:category_slug/:product_slug',
                          '/:business_slug/:category_slug'
                        ]}
                      >
                        {queryIntegrationToken && queryIntegrationCode === 'spoonity'
                          ? <QueryLoginSpoonity token={queryIntegrationToken} notificationState={oneSignalState} />
                          : isUserVerifyRequired && !guestCheckoutEnabled
                            ? (
                              <Redirect to='/verify' />
                              )
                            : <BusinessProductsList />}
                      </Route>
                      <Route path='*'>
                        <PageNotFound />
                      </Route>
                    </Switch>
                  </ScrollToTop>
                )}
                {/* PWA disabled */}
                {/* {!navigator.userAgent.match('CriOS') && (
                  <PWAPrompt promptOnVisit={1} timesToShow={100} copyClosePrompt='Close' permanentlyHideOnDismiss={false} />
                )} */}
                {(!isFooterPage || enabledPoweredByOrdering) && (
                  <Footer isFooterPage={isFooterPage} />
                )}
                {(windowSize.width < 576 && onlineStatus) && (
                  <NavigationBar />
                )}
                <Alert
                  title={t('INFORMATION', 'Information')}
                  content={alertState.content}
                  links={alertState.links}
                  acceptText={t('ACCEPT', 'Accept')}
                  open={alertState.open}
                  onClose={() => closeAlert()}
                  onCancel={() => closeAlert()}
                  onAccept={() => alertState?.isOnlyAlert ? closeAlert() : acceptAlert()}
                  closeOnBackdrop={false}
                />
                {lastOrderReview?.isReviewOpen && (
                  <Modal
                    open={lastOrderReview?.isReviewOpen}
                    onClose={handleCloseReivew}
                    title={lastOrderReview?.order && reviewModalTitle()}
                    width={lastOrderReview?.reviewStatus?.trigger ? '680px' : null}
                  >
                    <div>
                      {
                        lastOrderReview?.reviewStatus?.trigger
                          ? <ReviewTrigger order={lastOrderReview?.order} handleOpenOrderReview={handleOpenOrderReview} />
                          : lastOrderReview?.reviewStatus?.order
                            ? <ReviewOrder order={lastOrderReview?.order} defaultStar={lastOrderReview?.defaultStar} closeReviewOrder={closeReviewOrder} setIsReviewed={() => setIsReviewed('isOrderReviewed')} />
                            : (lastOrderReview?.reviewStatus?.product
                                ? <ReviewProduct order={lastOrderReview?.order} closeReviewProduct={closeReviewProduct} setIsProductReviewed={() => setIsReviewed('isProductReviewed')} />
                                : <ReviewDriver order={lastOrderReview?.order} closeReviewDriver={handleCloseReivew} setIsDriverReviewed={() => setIsReviewed('isDriverReviewed')} />)
                      }
                    </div>
                  </Modal>
                )}
                {businessSignUpSuccessed?.open && (
                  <Modal
                    open={businessSignUpSuccessed?.open}
                    onClose={() => setBusinessSignUpSuccessed({ open: false, content: {} })}
                    title={t('CONGRATULATIONS', 'Congratulations')}
                    width='990px'
                  >
                    <SignUpApproval
                      content={businessSignUpSuccessed?.content}
                      onAccept={() => acceptAlert()}
                      onCancel={() => setBusinessSignUpSuccessed({ open: false, content: {} })}
                    />
                  </Modal>
                )}
              </ThemeProvider>
            )
          }
        </div>
        {themeUpdated?.third_party_code?.body && parse(themeUpdated?.third_party_code?.body)}
      </>
      )
}
