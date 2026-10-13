import React from 'react'
import { renderToString } from 'react-dom/server'
import { useTheme } from 'styled-components'
import moment from 'moment'
import dayjs from 'dayjs'
import GoPrimitiveDot from '@meronex/icons/go/GoPrimitiveDot'
import Skeleton from 'react-loading-skeleton'

import { /* BusinessContainer, */
  WrapperMap,
  ContainerCard,
  WrapperBusinessCard,
  BusinessHero,
  BusinessContent,
  BusinessInfo,
  BusinessInfoItem,
  BusinessName,
  Medadata,
  BusinessNameContainer,
  BusinessNameContainerRight,
  OpenAtContainer,
  BusinessAddress
} from './styles'

import { BusinessesMap as BusinessesMapController, GoogleMapsMap, useConfig, useOrder, useUtils, useLanguage } from '~components'
import { generalUtilities, Button } from '~ui'
/* import { BusinessController } from '../BusinessController' */

const BusinessesMapUI = (props) => {
  const {
    userLocation,
    businessLocations,
    setErrors,
    /* businessControllerProps, */
    onBusinessCustomClick,
    avoidFitBounds
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [configState] = useConfig()
  const [orderState] = useOrder()
  const [{ parsePrice, parseDistance, parseTime }] = useUtils()
  const { convertHoursToMinutes } = generalUtilities()
  const hideBusinessFee = theme?.business_listing_view?.components?.business?.components?.fee?.hidden
  const hideBusinessTime = theme?.business_listing_view?.components?.business?.components?.time?.hidden
  const hideBusinessDistance = theme?.business_listing_view?.components?.business?.components?.distance?.hidden
  const checkTime = (val) => val < 10 ? `0${val}` : val

  const findTodayLapse = (business) => {
    if (business?.today?.enabled) {
      const currentDate = dayjs().tz(business?.timezone)
      const lapse = business?.today?.lapses?.find((lapse) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
      return lapse || business?.today?.lapses?.[0]
    }
  }

  const googleMapsControls = {
    defaultZoom: 15,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    },
    isMarkerDraggable: true
  }

  const locations = businessLocations?.map(business => ({
    ...business,
    icon: theme?.images?.general?.mapPin,
    markerPopup: renderToString(
      <ContainerCard
        disabled={business?.enabled === false}
      >
        <WrapperBusinessCard className='card-wrapper' disabled={business?.enabled === false}>
          <BusinessHero>
            <BusinessNameContainer>
              <BusinessName>{business?.name}</BusinessName>
              <BusinessContent>
                <BusinessAddress>
                  {business?.address}
                </BusinessAddress>
                <BusinessInfo className='info'>
                  <BusinessInfoItem>
                    <Medadata>
                      {!hideBusinessFee && orderState?.options?.type === 1 && (business?.delivery_price) >= 0 && (
                        <p>
                          <span>{t('DELIVERY_FEE', 'Delivery fee')}</span>
                          {business && parsePrice((business?.delivery_price))}
                          <GoPrimitiveDot />
                        </p>
                      )}
                      {!hideBusinessTime && (
                        <p className='bullet'>
                          {convertHoursToMinutes(orderState?.options?.type === 1 ? (business?.delivery_time) : (business?.pickup_time)) || <Skeleton width={100} />}
                        </p>
                      )}
                      {!hideBusinessDistance && (
                        <p className='bullet'>
                          <GoPrimitiveDot />
                          {parseDistance && parseDistance(business?.distance || 0)}
                        </p>
                      )}
                    </Medadata>
                  </BusinessInfoItem>
                </BusinessInfo>
                <OpenAtContainer isClosed={!(business?.open && business?.today?.enabled)}>
                  <p>
                    {business?.open && business?.today?.enabled
                      ? `${t('OPEN_AT', 'OPEN AT')} ${parseTime && parseTime(moment(`${checkTime(findTodayLapse(business)?.open?.hour)}:${checkTime(findTodayLapse(business)?.open?.minute)}`, 'HH:mm'))} - ${parseTime && parseTime(moment(`${checkTime(findTodayLapse(business)?.close?.hour)}:${checkTime(findTodayLapse(business)?.close?.minute)}`, 'HH:mm'))}`
                      : t('STORE_CLOSED', 'Store closed')}
                  </p>
                </OpenAtContainer>
              </BusinessContent>
            </BusinessNameContainer>
            <BusinessNameContainerRight>
              {business?.open && business?.today?.enabled && (
                <Button
                  id={`order-now-${business.id}`}
                  className='business-button'
                  bgtransparent
                  disableHover
                >
                  {t('ORDER_NOW', 'Order Now')}
                </Button>
              )}
            </BusinessNameContainerRight>
          </BusinessHero>
        </WrapperBusinessCard>
      </ContainerCard>
    ),
    /* markerPopup: renderToString(
      <div>
        <h3>{business.name}</h3>
        <span id='order-now'> Order Now</span>
      </div>
    ), */
    onBusinessCustomClick: () => onBusinessCustomClick(business)
  }))

  return (
    <WrapperMap disabled={orderState.loading}>
      <GoogleMapsMap
        noDistanceValidation
        apiKey={configState?.configs?.google_maps_api_key?.value}
        location={userLocation}
        locations={locations}
        mapControls={googleMapsControls}
        maxLimitLocation={parseInt(configState?.configs?.meters_to_change_address?.value)}
        businessMap
        setErrors={setErrors}
        allowMarkerPopups
        avoidFitBounds={avoidFitBounds}
      />
    </WrapperMap>
  )
}

export const BusinessesMap = (props) => {
  const businessMapController = {
    ...props,
    UIComponent: BusinessesMapUI,
    conserveAllBusinessProps: true
  }
  return <BusinessesMapController {...businessMapController} />
}
