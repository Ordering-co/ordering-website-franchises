import React from 'react'
import { StarFill, Heart as DisLike, HeartFill as Like } from 'react-bootstrap-icons'

import Skeleton from 'react-loading-skeleton'
import { useTheme } from 'styled-components'

import {
  BusinessDetail,
  BusinessInfo,
  BusinessInfoContainer,
  BusinessInfoContent,
  BusinessInfoItem,
  TitleWrapper,
  MoreInfoContainer,
  FavoriteWrapper
} from './styles'

import { useLanguage, useOrder, useUtils, useConfig } from '~components'
import {
  Button,
  generalUtilities,
  useWindowSize
} from '~ui'

export const BusinessInfoComponent = (props) => {
  const {
    loading,
    business,
    isInfoShrunken,
    isCustomerMode,
    setIsBusinessReviews,
    setOpenBusinessInformation,
    isCustomLayout,
    showCartOnProductList,
    handleFavoriteBusiness,
    setIsPreOrder
  } = props
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const [{ parsePrice, parseDistance }] = useUtils()
  const [, t] = useLanguage()
  const windowSize = useWindowSize()
  const { convertHoursToMinutes } = generalUtilities()

  const hideDeliveryFee = theme?.business_view?.components?.header?.components?.business?.components?.fee?.hidden
  const hideTime = theme?.business_view?.components?.header?.components?.business?.components?.time?.hidden
  const hideReviews = theme?.business_view?.components?.header?.components?.business?.components?.reviews?.hidden
  const hideReviewsPopup = theme?.business_view?.components?.header?.components?.reviews?.hidden
  const hideDistance = theme?.business_view?.components?.header?.components?.business?.components?.distance?.hidden
  const hideCity = theme?.business_view?.components?.header?.components?.business?.components?.city?.hidden
  const hideBusinessFavorite = theme?.business_listing_view?.components?.business?.components?.favorite?.hidden

  const singleBusinessRedirect = window.localStorage.getItem('single_business')
  const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true')

  return (
    <BusinessInfoContainer showCartOnProductList={showCartOnProductList} isFlexEnd={windowSize.width >= 768}>
      <BusinessInfoContent>
        <BusinessInfo className='info'>
          <BusinessInfoItem isInfoShrunken={isInfoShrunken}>
            {!loading
              ? (
              <TitleWrapper isCustomLayout={isCustomLayout} disableLeftSpace={singleBusinessRedirect}>
                <h2 className='bold' id='business_name'>{business?.name}</h2>
                {!hideBusinessFavorite && !isCustomerMode && (
                  <FavoriteWrapper onClick={() => handleFavoriteBusiness(!business?.favorite)}>
                    {!loading
                      ? (
                        <>
                          {(business?.favorite) ? <Like /> : <DisLike />}
                        </>
                        )
                      : (
                        <Skeleton width={16} height={16} />
                        )}
                  </FavoriteWrapper>
                )}
                <span id='business_name_feedback' />
              </TitleWrapper>
                )
              : (
              <Skeleton width={isCustomerMode ? 100 : 150} height={isCustomerMode ? 35 : 'auto'} />
                )}
            {typeof hideCity !== 'undefined' && !hideCity && business?.city?.name && (
              <>
                {!loading
                  ? (
                  <p className='type'>{business?.city?.name}</p>
                    )
                  : (
                  <Skeleton width={isCustomerMode ? 100 : 150} />
                    )}
              </>
            )}
            <BusinessDetail isSkeleton={loading}>
              {orderState?.options.type === 1 && !hideDeliveryFee && (
                <>
                  {!loading
                    ? (
                    <>
                      <h5>
                        <span>{t('DELIVERY_FEE', 'Delivery fee')}</span>
                        {business && parsePrice(business?.delivery_price || 0)}
                      </h5>
                      <span className='dot'>•</span>
                    </>
                      )
                    : (
                    <Skeleton width={isCustomerMode ? 70 : 50} />
                      )}
                </>
              )}
              {!hideTime && (
                <>
                  {!loading
                    ? (
                    <>
                      {orderState?.options?.type === 1
                        ? (
                        <>
                          <h5>
                            {convertHoursToMinutes(business?.delivery_time)}
                          </h5>
                          <span className='dot'>•</span>
                        </>
                          )
                        : (
                        <>
                          <h5>
                            {convertHoursToMinutes(business?.pickup_time)}
                          </h5>
                          <span className='dot'>•</span>
                        </>
                          )}
                    </>
                      )
                    : (
                    <Skeleton width={isCustomerMode ? 70 : 50} />
                      )}
                </>
              )}
              {!hideDistance && (
                <>
                  {!loading
                    ? (
                    <>
                      <h5>
                        {parseDistance(business?.distance || 0)}
                      </h5>
                      <span className='dot'>•</span>
                    </>
                      )
                    : (
                    <Skeleton width={isCustomerMode ? 70 : 50} />
                      )}
                </>
              )}
              {!hideReviews && (
                <>
                  {!loading
                    ? (
                    <div className='review'>
                      <StarFill className='start' />
                      <p>{business?.reviews?.total}</p>
                    </div>
                      )
                    : (
                    <Skeleton width={isCustomerMode ? 100 : 50} />
                      )}
                </>
              )}
            </BusinessDetail>
            {!loading
              ? <div className='preorder-Reviews'>
                {business.reviews?.reviews && !hideReviewsPopup && !isCustomerMode && (
                  <>
                    <span onClick={() => setIsBusinessReviews(true)}>{t('REVIEWS', 'Reviews')}</span>
                    {business.reviews?.reviews && !hideReviewsPopup && !isCustomerMode && isPreorderEnabled && (
                      <span className='dot'>•</span>
                    )}
                  </>
                )}
                {isPreorderEnabled && (
                  <span onClick={() => setIsPreOrder(true)}>{t('PREORDER', 'Preorder')}</span>
                )}
              </div>
              : <Skeleton width={isCustomerMode ? 100 : 150} />
            }
          </BusinessInfoItem>
        </BusinessInfo>
      </BusinessInfoContent>
      <MoreInfoContainer position='relative'>
        <Button
          color='primary'
          outline
          onClick={() => setOpenBusinessInformation(true)}
        >
          {t('INFO', 'Info')}
        </Button>
      </MoreInfoContainer>
    </BusinessInfoContainer>
  )
}
