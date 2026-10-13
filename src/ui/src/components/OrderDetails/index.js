import React, { useState, useEffect, useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import RiUser2Fill from '@meronex/icons/ri/RiUser2Fill'
import FaUserAlt from '@meronex/icons/fa/FaUserAlt'

import {
  Container,
  WrapperContainer,
  OrderInfo,
  StatusBar,
  PhotoBlock,
  Map,
  OrderDriver,
  WrapperDriver,
  OrderProducts,
  SkeletonBlockWrapp,
  SkeletonBlock,
  WrapperLeftContainer,
  WrapperRightContainer,
  SkeletonWrapper,
  ReviewWrapper,
  TitleContainer,
  OrderPreferences,
  HeaderTitle,
  MapWrapper,
  ProfessionalWrapper,
  ProfessionalBlock,
  OrderClonnedMessage,
  OrderButtons,
  DirectionButtonWrapper
} from './styles'

import {
  OrderDetails as OrderDetailsController,
  useLanguage,
  useEvent,
  useUtils,
  useConfig,
  useOrder,
  useBusiness,
  GoogleMapsMap
} from '~components'
import { parseJsonStorage } from '~/utils/parseJsonStorage'

import { OrderEta } from './OrderEta'
import { OrderBillSection } from './OrderBillSection'
import { ActionsSection } from './ActionsSection'
import { OrderPreferencesSection } from './OrderPreferencesSections'
import { OrderHistory } from './OrderHistory'
import { getUtils } from './utils'
/* import { ReviewOrderSimple as ReviewOrder } from '../ReviewOrderSimple' */

import {
  getGoogleMapImage,
  Button,
  NotFoundSource,
  Modal,
  Confirm,
  ReviewOrder,
  ReviewProduct,
  ReviewDriver,
  ReviewProfessional,
  ProductItemAccordion,
  TaxInformation,
  Messages,
  SendGiftCard,
  generalUtilities
} from '~ui'

const OrderDetailsUI = (props) => {
  const {
    handleBusinessRedirect,
    handleOrderRedirect,
    googleMapsControls,
    driverLocation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    reorderState,
    handleReorder,
    orderTypes,
    handleRemoveCart
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [events] = useEvent()
  const [{ parsePrice, parseDate }] = useUtils()
  const [{ carts }] = useOrder()
  const { getStatusPrefix } = generalUtilities()
  const [, { setBusiness }] = useBusiness()
  const { setLocalMoment } = getUtils()

  const [openMessages, setOpenMessages] = useState({ business: false, driver: false })
  const [isOrderReviewed, setIsOrderReviewed] = useState(false)
  const [isProductReviewed, setIsProductReviewed] = useState(false)
  const [isDriverReviewed, setIsDriverReviewed] = useState(false)
  const [isProReviewed, setIsProReviewed] = useState(false)
  const [isGiftCardSent, setIsGiftCardSent] = useState(false)
  const [unreadAlert, setUnreadAlert] = useState({ business: false, driver: false })
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewStatus, setReviewStatus] = useState({ order: false, product: false, driver: false, professional: false })
  const [openTaxModal, setOpenTaxModal] = useState({ open: false, tax: null })
  const [isService, setIsService] = useState(false)
  const [isOrderHistory, setIsOrderHistory] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, content: null, handleOnAccept: null })

  const { order, loading, businessData, error } = props.order
  const acceptedStatus = [1, 2, 5, 6, 10, 11, 12, 15]
  const completedStatus = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]
  const placeSpotTypes = [3, 4, 5]
  const activeStatus = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26]
  const googleMapsApiKey = configs?.google_maps_api_key?.value
  const showStarbucksHeader = false
  const changeIdToExternalId = configs?.change_order_id?.value === '1'
  const cateringTypes = [7, 8]
  const deliveryTypes = [1, 7]

  const hideOrderActions = deliveryTypes?.includes(order?.delivery_type)
  const isGiftCardOrder = !order?.business_id
  const isReservation = order?.delivery_type === 9

  const hideDeliveryType = theme?.confirmation?.components?.order?.components?.delivery_type?.hidden
  const hideDeliveryDate = theme?.confirmation?.components?.order?.components?.date?.hidden || isReservation
  const hideDeliveryProgress = theme?.confirmation?.components?.order?.components?.progress?.hidden
  const hideBusinessMap = theme?.confirmation?.components?.business?.components?.map?.hidden
  const hideDriverName = theme?.confirmation?.components?.driver?.components?.name?.hidden
  const hideReviewOrderButton = theme?.orders?.components?.review_order_button?.hidden
  const hideDriverPhoto = theme?.confirmation?.components?.driver?.components?.photo?.hidden

  const validTrackingStatus = [9, 18, 19, 23, 26]
  const mapConfigs = { zoom: 15 }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  const unreadMessages = () => {
    const length = messages?.messages.length
    const unreadLength = order?.unread_count
    const unreadedMessages = messages.messages.slice(length - unreadLength, length)
    const business = unreadedMessages.some(message => message?.can_see?.includes(2))
    const driver = unreadedMessages.some(message => message?.can_see?.includes(4))
    setUnreadAlert({ business, driver })
  }

  const locations = [
    { ...order?.driver?.location, icon: order?.driver?.photo || theme.images?.general?.driverPng },
    { ...order?.business?.location, icon: order?.business?.logo || theme.images?.dummies?.businessLogo },
    { ...order?.customer?.location, icon: order?.customer?.photo || theme.images?.dummies?.customerPhoto }
  ]

  const handleOpenReview = () => {
    if (!order?.review && !isOrderReviewed) setReviewStatus({ order: true, product: false, driver: false, professional: false })
    else if (!isProductReviewed && order?.customer_id && order?.paymethod_id) setReviewStatus({ order: false, product: true, driver: false, professional: false })
    else if (order?.driver && !order?.user_review && !isDriverReviewed) setReviewStatus({ order: false, product: false, driver: true, professional: false })
    else if (isService && !isProReviewed) setReviewStatus({ order: false, product: false, driver: false, professional: true })
    else {
      setIsReviewOpen(false)
      return
    }
    setIsReviewOpen(true)
  }

  const handleCloseReivew = () => {
    setReviewStatus({ order: false, product: false, driver: false, professional: false })
    setIsReviewOpen(false)
  }

  const closeReviewOrder = () => {
    if (!isProductReviewed && order?.customer_id && order?.paymethod_id) setReviewStatus({ order: false, product: true, driver: false, professional: false })
    else if (order?.driver && !order?.user_review && !isDriverReviewed) setReviewStatus({ order: false, product: false, driver: true, professional: false })
    else handleCloseReivew()
  }

  const closeReviewProduct = () => {
    if (isService && !isProReviewed) setReviewStatus({ order: false, product: false, driver: false, professional: true })
    else if (order?.driver && !order?.user_review && !isDriverReviewed) setReviewStatus({ order: false, product: false, driver: true, professional: false })
    else {
      setIsDriverReviewed(true)
      handleCloseReivew()
    }
  }

  const closeOrderModal = (e) => {
    const outsideModal = !window.document.getElementById('app-modals') ||
      !window.document.getElementById('app-modals').contains(e.target)
    if (outsideModal) {
      const _businessId = 'businessId:' + businessData?.id
      sessionStorage.setItem('adjust-cart-products', _businessId)
      handleBusinessRedirect(businessData?.slug)
    }
  }

  const handleClickReorder = (order) => {
    if (carts[`businessId:${order?.business_id}`] && carts[`businessId:${order?.business_id}`]?.products?.length > 0) {
      setConfirm({
        open: true,
        content: t('QUESTION_DELETE_PRODUCTS_FROM_CART', 'Are you sure that you want to delete all products from cart?'),
        handleOnAccept: async () => {
          handleRemoveCart()
          setConfirm({ ...confirm, open: false })
        }
      })
    } else {
      handleReorder(order.id)
    }
  }

  const handleOriginalReorder = () => {
    setConfirm({ ...confirm, open: false })
    handleReorder(order.id)
  }

  const getProductList = (orderCompleted) => {
    const professionalList = order?.products.reduce((prev, current) => {
      const found = prev.find(item => item.id === current?.calendar_event?.professional?.id)
      if (found || !current?.calendar_event) {
        return prev
      }
      return [...prev, current?.calendar_event?.professional]
    }, [])

    return (
      <>
        {professionalList?.length > 0 && professionalList.map((professional, i) => (
          <ProfessionalBlock key={i}>
            <ProfessionalWrapper>
              {professional?.photo
                ? <img src={professional?.photo} alt='' />
                : <FaUserAlt />}
              <p>{professional?.name} {professional?.lastname}</p>
            </ProfessionalWrapper>
            {order?.products.filter(product => product?.calendar_event?.professional?.id === professional?.id).map(product => (
              <ProductItemAccordion
                key={product.id}
                product={product}
                showArrowIcon
                toppingsRemoved={order?.toppings_removed?.[product?.code]}
              />
            ))}
          </ProfessionalBlock>
        ))}
        {order?.products.filter(product => !product?.calendar_event).map(product => (
          <ProductItemAccordion
            key={product.id}
            product={product}
            showArrowIcon
            toppingsRemoved={order?.toppings_removed?.[product?.code]}
            isDisabledEdit={!order?.business_id}
            orderCompleted={completedStatus.includes(parseInt(order?.status, 10))}
            isCheckout
            isOrderSummary
            isOrderDetails
          />
        ))}
      </>
    )
  }

  const sortedProductList = useMemo(() => getProductList(), [order?.products])

  const ActionsSectionProps = {
    order,
    handleBusinessRedirect,
    businessData,
    unreadAlert,
    setOpenMessages,
    readMessages,
    setUnreadAlert
  }

  const driverLocationString = typeof order?.driver?.location?.location === 'string' && order?.driver?.location?.location?.split(',').map((l) => l.replace(/[^-.0-9]/g, ''))
  const parsedLocations = locations.map(location => typeof location?.location === 'string'
    ? {
        ...location,
        lat: parseFloat(location?.location?.split(',')[0].replace(/[^-.0-9]/g, '')),
        lng: parseFloat(location?.location?.split(',')[1].replace(/[^-.0-9]/g, ''))
      }
    : location)

  useEffect(() => {
    if (driverLocation) {
      parsedLocations[0] = {
        ...locations[0],
        ...driverLocation
      }
    }
  }, [driverLocation])

  useEffect(() => {
    unreadMessages()
  }, [messages?.messages])

  useEffect(() => {
    if (messagesReadList?.length) {
      openMessages.business ? setUnreadAlert({ ...unreadAlert, business: false }) : setUnreadAlert({ ...unreadAlert, driver: false })
    }
  }, [messagesReadList])

  useEffect(() => {
    if (reorderState?.error) {
      window.addEventListener('click', closeOrderModal)
      return () => {
        window.removeEventListener('click', closeOrderModal)
      }
    }

    if (!reorderState?.error && reorderState.loading === false && businessData?.id) {
      const _businessId = 'businessId:' + businessData?.id
      const products = carts?.[_businessId]?.products
      const available = products?.every(product => product.valid === true)
      if (available && reorderState?.result?.uuid && (products?.length === order?.products.length)) {
        handleGoToPage({ page: 'checkout', params: { cartUuid: reorderState?.result.uuid } })
      } else {
        sessionStorage.setItem('adjust-cart-products', _businessId)
        products?.length !== order?.products.length && sessionStorage.setItem('already-removed', 'removed')
        handleBusinessRedirect(businessData?.slug)
      }
    }
  }, [reorderState])

  useEffect(() => {
    if (!order) return
    const _isService = order.products.some(product => product.type === 'service')
    setIsService(_isService)
    props.openBChatByParam && setOpenMessages({
      ...openMessages,
      business: !!props.openBChatByParam
    })
  }, [order])

  useEffect(() => {
    window.scrollTo(0, 0)
    setLocalMoment()
    return () => {
      setBusiness({})
    }
  }, [])

  const isPickup = order?.delivery_type && order?.delivery_type === 2

  return (
    <Container>
      {!completedStatus.includes(parseInt(order?.status, 10)) && !loading && order && Object.keys(order).length > 0 && !(openMessages.driver || openMessages.business) && (
        <WrapperContainer>
          <OrderInfo>
            <TitleContainer>
              <div className='delivery-container'>
                {!hideDeliveryType && (
                  <p className='types'>
                    {isService
                      ? t('SERVICE_AT_HOME', 'Service at home')
                      : `${t('ESTIMATE_ORDER_TYPE_TIME', 'ESTIMATE :ordertype: TIME').replace(':ordertype:', orderTypes?.find(type => order?.delivery_type === type?.value)?.text?.toUpperCase())}`}
                  </p>
                )}
                {!hideDeliveryDate && (
                  <>
                    {cateringTypes.includes(order?.delivery_type) && (
                      <p className='date'>
                        {t('CREATED_AT', 'Created at')}: {parseDate(order?.created_at)}
                      </p>
                    )}
                    <p className='date'>
                      {activeStatus.includes(order?.status)
                        ? (
                          <>
                            {cateringTypes.includes(order?.delivery_type) ? `${t('PLACED_TO', 'Placed to')}:` : ''} <OrderEta order={order} outputFormat={'dddd, MMMM D YYYY'} />
                          </>
                          )
                        : (
                            parseDate(order?.reporting_data?.at[`status:${order.status}`], { outputFormat: `YYYY-MM-DD ${configs?.general_hour_format?.value}` })
                          )}
                    </p>
                  </>
                )}
              </div>
              <div className='time-container'>
                <OrderEta order={order} outputFormat={configs?.general_hour_format?.value} />
                <Button color='lightGray' onClick={() => handleGoToPage({ page: 'help' })}>
                  {t('HELP', 'Help')}
                </Button>
              </div>
              {order?.reservation && order?.delivery_type === 9 && (
                <>
                  <p className='date'>{t('RESERVATION_SCHEDULED_TO', 'Reservation scheduled to')}: {parseDate(order?.reservation?.reserve_date, { utc: false, outputFormat: `YYYY-MM-DD ${configs?.general_hour_format?.value}` })}</p>
                  <p>{order?.reservation?.guests_reservation} {t('GUESTS', 'Guests')}</p>
                </>
              )}
            </TitleContainer>
            {!!order?.cloned_order_id && (
              <OrderClonnedMessage>
                <p>{t('ORDER_CLONNED_INFORMATION', 'Your orden has been cloned due a missing item, no extra charges will be made, for more information, please contact the store')}</p>
              </OrderClonnedMessage>
            )}
            {!hideDeliveryProgress && !isGiftCardOrder && (
              <>
                <StatusBar percentage={getStatusPrefix({ status: order?.status, isPickup })?.percentage} />
              </>
            )}
            <div className='order-progress'>
              <span >{t('YOUR_ORDER_IS_IN_PROGRESS', 'Your order is in progress')}</span>
            </div>
          </OrderInfo>
          <WrapperLeftContainer>
            {!showStarbucksHeader && (
              <>
                {googleMapsApiKey && !hideBusinessMap && (
                  <div className='map-container'>
                    {(!order?.driver || !order?.driver?.location || !validTrackingStatus.includes(parseInt(order?.status)))
                      ? (
                          <MapWrapper>
                            <Map style={{ width: '100%' }}>
                              <img
                                src={getGoogleMapImage(order?.business?.location, googleMapsApiKey, mapConfigs)}
                                id='google-maps-image'
                                alt='google-maps-location'
                                width='100%'
                                height='100%'
                                loading='lazy'
                              />
                            </Map>
                          </MapWrapper>
                        )
                      : (
                          <Map style={{ width: '100%' }}>
                            <GoogleMapsMap
                              location={typeof order?.driver?.location?.location === 'string'
                                ? {
                                    lat: parseFloat(driverLocationString[0]),
                                    lng: parseFloat(driverLocationString[1])
                                  }
                                : driverLocation ?? order?.driver?.location}
                              locations={parsedLocations}
                              mapControls={googleMapsControls}
                              apiKey={configs?.google_maps_api_key?.value}
                              manualZoom
                            />
                          </Map>
                        )
                    }
                  </div>
                )}
              </>
            )}
            {!hideOrderActions && (
              <DirectionButtonWrapper>
                <Button
                  color='primary'
                  outline
                  onClick={() => window.open(`http://maps.google.com/?q=${order?.business?.address}`)}
                >
                  {t('GET_DIRECTIONS', 'Get Directions')}
                </Button>
              </DirectionButtonWrapper>
            )}
            {order?.driver && (
              <>
                <OrderDriver>
                  <WrapperDriver>
                    {!hideDriverPhoto && (
                      <div className='photo'>
                        {order?.driver?.photo
                          ? (
                            <PhotoBlock src={order?.driver?.photo} />
                            )
                          : (
                            <RiUser2Fill />
                            )}
                      </div>
                    )}
                    <div className='driver-info'>
                      <div className='driver-name-wrapper'>
                        {!hideDriverName && (
                          <h2>{order?.driver?.name} {order?.driver?.lastname}</h2>
                        )}
                        <ActionsSection
                          {...ActionsSectionProps}
                          actionType='driver'
                          showPhone
                          showMessages
                        />
                      </div>
                      <p>{t('YOUR_DRIVER', 'Your driver')}</p>
                    </div>
                  </WrapperDriver>
                </OrderDriver>
              </>
            )}
          </WrapperLeftContainer>
          <WrapperRightContainer>
            <OrderProducts orderCompleted={!isGiftCardOrder}>
              <HeaderTitle>
                <h1>{t('TOTAL', 'Total')}</h1>
                <h1 className='total-summary'>{parsePrice(order?.summary?.total ?? order?.total ?? 0)}</h1>
              </HeaderTitle>
              {!showStarbucksHeader && sortedProductList}
              <OrderBillSection
                order={order}
                setOpenTaxModal={setOpenTaxModal}
                showOnlyTotals={showStarbucksHeader}
                isGiftCardOrder={isGiftCardOrder}
                isHideTotal
              />
              {(order?.customer || order?.business) && (
                <OrderPreferences>
                  <div className='order-type-address'>
                    {t('ORDER_TYPE_ADDRESS', ':ordertype: Address').replace(':ordertype:', orderTypes?.find(type => order?.delivery_type === type?.value)?.text)}
                    <div className='order-type'>
                      <p>{order[order?.delivery_type === 1 ? 'customer' : 'business']?.address}</p>
                    </div>
                  </div>
                </OrderPreferences>
              )}
              {(deliveryTypes?.includes(order?.delivery_type) || order?.comment) && !isGiftCardOrder && !showStarbucksHeader && (
                <OrderPreferences>
                  <OrderPreferencesSection
                    order={order}
                    placeSpotTypes={placeSpotTypes}
                  />
                </OrderPreferences>
              )}
            </OrderProducts>
          </WrapperRightContainer>

          {isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent && (
            <SendGiftCard
              giftCardId={order?.products[0]?.gift_card?.id}
              setIsGiftCardSent={setIsGiftCardSent}
            />
          )}
        </WrapperContainer>
      )}

      {completedStatus.includes(parseInt(order?.status, 10)) && !loading && order && Object.keys(order).length > 0 && !(openMessages.driver || openMessages.business) && (
        <WrapperContainer orderCompleted>
          <OrderInfo className='order-info'>
            <TitleContainer orderCompleted>
              <div className='delivery-container'>
                {!hideDeliveryType && (
                  <div className='title-container'>
                    <p className='types'>
                      {order?.business?.name || (t('ORDER', theme?.defaultLanguages?.ORDER || 'Order'))}{(changeIdToExternalId && order?.external_id) || `#${order?.id}`}
                    </p>
                    <p
                      className={
                        `order-status ${getStatusPrefix({ status: order?.status, isPickup })?.percentage === 100 ? 'completed' : ''}`
                      }
                    >
                      {getStatusPrefix({ status: order?.status, isPickup })?.value}
                    </p>
                  </div>
                )}
                {!hideDeliveryDate && (
                  <>
                    {cateringTypes.includes(order?.delivery_type) && (
                      <p className='date'>
                        {t('CREATED_AT', 'Created at')}: {parseDate(order?.created_at)}
                      </p>
                    )}
                    <p className='date'>
                      {activeStatus.includes(order?.status)
                        ? (
                          <>
                            {cateringTypes.includes(order?.delivery_type) ? `${t('PLACED_TO', 'Placed to')}:` : ''} <OrderEta order={order} outputFormat={'dddd, MMMM D YYYY'} />
                          </>
                          )
                        : (
                            parseDate(order?.reporting_data?.at[`status:${order.status}`], { outputFormat: 'dddd, MMMM D YYYY' })
                          )}
                    </p>
                  </>
                )}
              </div>
              {order?.reservation && order?.delivery_type === 9 && (
                <>
                  <p className='date'>{t('RESERVATION_SCHEDULED_TO', 'Reservation scheduled to')}: {parseDate(order?.reservation?.reserve_date, { utc: false, outputFormat: `YYYY-MM-DD ${configs?.general_hour_format?.value}` })}</p>
                  <p>{order?.reservation?.guests_reservation} {t('GUESTS', 'Guests')}</p>
                </>
              )}
            </TitleContainer>
            {!!order?.cloned_order_id && (
              <OrderClonnedMessage>
                <p>{t('ORDER_CLONNED_INFORMATION', 'Your orden has been cloned due a missing item, no extra charges will be made, for more information, please contact the store')}</p>
              </OrderClonnedMessage>
            )}
          </OrderInfo>
          <WrapperRightContainer orderCompleted>
            <div className='order-progress'>
              <span >{t('YOUR_ORDER', 'Your order')}</span>
            </div>
            <OrderProducts orderCompleted>
              {!showStarbucksHeader && sortedProductList}
              <OrderBillSection
                order={order}
                setOpenTaxModal={setOpenTaxModal}
                showOnlyTotals={showStarbucksHeader}
                isGiftCardOrder={isGiftCardOrder}
                orderCompleted
              />
            </OrderProducts>
            {!isGiftCardOrder && (
              <OrderButtons showDivider={isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent}>
                {!isOrderReviewed && (!order?.review || (order.driver && !order?.user_review)) && !hideReviewOrderButton && (
                  <Button
                    color='primary'
                    outline
                    onClick={handleOpenReview}
                  >
                    {t('REVIEW', theme?.defaultLanguages?.REVIEW || 'Review')}
                  </Button>
                )}
                <Button
                  color='primary'
                  onClick={() => handleClickReorder(order)}
                  disabled={reorderState?.loading}
                >
                  {reorderState?.loading
                    ? t('LOADING', 'Loading...')
                    : t('ORDER_AGAIN', 'Order again')}
                </Button>
              </OrderButtons>
            )}
          </WrapperRightContainer>

          {isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent && (
            <SendGiftCard
              giftCardId={order?.products[0]?.gift_card?.id}
              setIsGiftCardSent={setIsGiftCardSent}
            />
          )}
        </WrapperContainer>
      )}

      {
        (openMessages.driver || openMessages.business) && (
          <Messages
            orderId={order?.id}
            order={order}
            business={openMessages.business}
            driver={openMessages.driver}
            messages={messages}
            setMessages={setMessages}
            readMessages={readMessages}
            onMessages={setOpenMessages}
            onClose={() => setOpenMessages({ driver: false, business: false })}
          />
        )
      }

      {loading && !error && (
        <SkeletonWrapper>
          <>
            <SkeletonBlockWrapp>
              <SkeletonBlock width={90}>
                <Skeleton height={40} width={'80vw'} />
                <Skeleton height={200} width={'80vw'} />
                <Skeleton height={15} />
                <Skeleton height={300} width={'80vw'} style={{ marginBottom: '50px' }} />
                <Skeleton height={60} width={'80vw'} />
                <Skeleton height={200} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} style={{ marginBottom: '50px' }} />
                <Skeleton height={40} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} />
                <Skeleton height={20} width={'80vw'} style={{ marginBottom: '50px' }} />
              </SkeletonBlock>
            </SkeletonBlockWrapp>
          </>
        </SkeletonWrapper>
      )}

      {!loading && error && (
        error.includes('ERROR_ACCESS_EXPIRED')
          ? (
            <NotFoundSource
              content={t(error[0], 'Sorry, the order has expired.')}
            />
            )
          : (
            <NotFoundSource
              content={t('NOT_FOUND_ORDER', theme?.defaultLanguages?.NOT_FOUND_ORDER || 'Sorry, we couldn\'t find the requested order.')}
              btnTitle={t('ORDERS_REDIRECT', theme?.defaultLanguages?.ORDERS_REDIRECT || 'Go to Orders')}
              onClickButton={handleOrderRedirect}
            />
            )
      )}
      {
        isReviewOpen && (
          <Modal
            closeIconRight
            closeOnBackdrop={false}
            open={isReviewOpen}
            onClose={handleCloseReivew}
            title={order
              ? t('REVIEWS', 'Reviews')
              : t('LOADING', theme?.defaultLanguages?.LOADING || 'Loading...')}
          >
            <ReviewWrapper>
              {
                reviewStatus?.order
                  ? (
                      <ReviewOrder
                        order={order}
                        hashKey={props.hashKey}
                        closeReviewOrder={closeReviewOrder}
                        setIsReviewed={setIsOrderReviewed}
                      />
                    )
                  : (reviewStatus?.product
                      ? (
                          <ReviewProduct
                            order={order}
                            hashKey={props.hashKey}
                            closeReviewProduct={closeReviewProduct}
                            setIsProductReviewed={setIsProductReviewed}
                          />
                        )
                      : (reviewStatus?.professional
                          ? (
                              <ReviewProfessional
                                order={order}
                                hashKey={props.hashKey}
                                closeReviewProfessional={handleCloseReivew}
                                setIsProfessionalReviewed={setIsProReviewed}
                                isProfessional
                              />
                            )
                          : (
                              <ReviewDriver
                                order={order}
                                hashKey={props.hashKey}
                                closeReviewDriver={handleCloseReivew}
                                setIsDriverReviewed={setIsDriverReviewed}
                              />
                            )
                        )
                    )
              }
            </ReviewWrapper>

          </Modal>
        )
      }
      {openTaxModal.open && (
        <Modal
          width='70%'
          open={openTaxModal.open}
          padding='20px'
          closeOnBackdrop
          title={`${openTaxModal.data?.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${openTaxModal.data?.rate_type !== 2
            ? `(${typeof openTaxModal.data?.rate === 'number'
              ? `${openTaxModal.data?.rate}%`
              : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})`
            : ''}
            `}
          onClose={() => setOpenTaxModal({ open: false, tax: null, type: '' })}
          modalTitleStyle={{ display: 'flex', justifyContent: 'center' }}
        >
          <TaxInformation
            type={openTaxModal.type}
            data={openTaxModal.data}
            products={order?.products}
          />
        </Modal>
      )}
      {isOrderHistory && (
        <Modal
          open={isOrderHistory}
          width='760px'
          onClose={() => setIsOrderHistory(false)}
          title={t('DETAILS_OF_ORDER', 'Details of Order_NUMBER_').replace('_NUMBER_', (changeIdToExternalId && order?.external_id) || `# ${order?.id}`)}
        >
          <OrderHistory
            messages={messages}
            order={order}
            handleOpenReview={handleOpenReview}
            onClose={() => setIsOrderHistory(false)}
            enableReview={
              acceptedStatus.includes(parseInt(order?.status, 10)) &&
              (!order?.review || (order.driver && !order?.user_review)) &&
              (!isOrderReviewed || !isProductReviewed || !isDriverReviewed)
            }
          />
        </Modal>
      )}
      <Confirm
        title={t('ORDER', 'Order')}
        content={confirm.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={confirm.open}
        onClose={() => handleOriginalReorder()}
        onCancel={() => handleOriginalReorder()}
        onAccept={confirm.handleOnAccept}
        closeOnBackdrop={false}
      />
    </Container>
  )
}

export const OrderDetails = (props) => {
  const [, t] = useLanguage()
  const userCustomer = parseJsonStorage(window.localStorage.getItem('user-customer'))
  const orderDetailsProps = {
    ...props,
    userCustomerId: userCustomer?.id,
    googleMapsControls: {
      defaultZoom: 15,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite']
      }
    },
    orderTypes: props.orderTypes || [
      {
        value: 1,
        text: t('DELIVERY', 'Delivery')
      },
      {
        value: 2,
        text: t('PICKUP', 'Pickup')
      },
      {
        value: 3,
        text: t('EAT_IN', 'Eat in')
      },
      {
        value: 4,
        text: t('CURBSIDE', 'Curbside')
      },
      {
        value: 5,
        text: t('DRIVE_THRU', 'Drive thru')
      },
      {
        value: 7,
        text: t('CATERING_DELIVERY', 'Catering Delivery')
      },
      {
        value: 8,
        text: t('CATERING_PICKUP', 'Catering Pickup')
      },
      {
        value: 9,
        text: t('RESERVATION', 'Reservation')
      }
    ],
    UIComponent: OrderDetailsUI
  }

  return (
    <OrderDetailsController {...orderDetailsProps} />
  )
}
