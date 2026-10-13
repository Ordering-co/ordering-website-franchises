import React, { useState } from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useTheme } from 'styled-components'
import MdClose from '@meronex/icons/md/MdClose'

import {
  BusinessInformationContainer,
  BusinessContent,
  SectionTitle,
  Map,
  ScheduleSection,
  ScheduleContainer,
  DeliveryInfo,
  BusinessMediaContent,
  ModalIcon,
  Description,
  ImageContainer,
  BusinessTitle,
  BusinessAddress,
  BusinessAddressNotes,
  Divider
} from './styles'

import {
  BusinessInformation as BusinessInformationController,
  GoogleMapsMap,
  useLanguage,
  useConfig
} from '~components'

import {
  formatUrlVideo,
  generalUtilities,
  Modal,
  ScheduleAccordion
} from '~ui'

dayjs.extend(timezone)

export const BusinessInformationUI = (props) => {
  const {
    business,
    businessLocation,
    businessSchedule,
    businessPhotos,
    businessVideos,
    onClose
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const { convertHoursToMinutes } = generalUtilities()

  const [modalImage, setModalImage] = useState(false)
  const [image, setImage] = useState('')
  const theme = useTheme()

  const hideLocation = theme?.business_view?.components?.information?.components?.location?.hidden
  const hideSchedule = theme?.business_view?.components?.information?.components?.schedule?.hidden
  const hideDescription = theme?.business_view?.components?.information?.components?.description?.hidden
  const hideAbout = theme?.business_view?.components?.information?.components?.about?.hidden
  const hideVideos = theme?.business_view?.components?.information?.components?.videos?.hidden
  const hideDeliveryTime = theme?.business_view?.components?.information?.components?.delivery_time?.hidden
  const hidePickupTime = theme?.business_view?.components?.information?.components?.pickup_time?.hidden
  const hideImages = theme?.business_view?.components?.information?.components?.images?.hidden
  const hideAddress = theme?.business_view?.components?.information?.components?.address?.hidden
  const formatTime = configs?.general_hour_format?.value

  const fillStyle = {
    fillColor: theme.colors.primary,
    strokeColor: theme.colors.darkPrimaryColor,
    fillOpacity: 0.2,
    strokeWeight: 2,
    editable: false
  }

  const checkTime = (val) => (val < 10 ? `0${val}` : val)
  const timeFormated = (time) => {
    const now = dayjs().format('YYYY-MM-DD')
    const storeTime = dayjs
      .tz(`${now}T${checkTime(time.hour)}:${checkTime(time.minute)}`, business?.timezone || dayjs.tz.guess())
    const localTime = storeTime.tz(dayjs.tz.guess())
    return localTime.format(formatTime)
  }

  const handleModalImage = (src) => {
    setImage(src)
    setModalImage(true)
  }

  return (
    <BusinessInformationContainer>
      {onClose && (
        <ModalIcon>
          <MdClose onClick={() => onClose(false)} />
        </ModalIcon>
      )}
      <BusinessContent>
        <BusinessTitle>{business?.name}</BusinessTitle>
        {!hideAbout && business.about && (
          <>
            <SectionTitle>{t('BUSINESS_ABOUT', 'Business short description')}</SectionTitle>
            <Description>{business.about}</Description>
          </>
        )}
        {!hideDescription && business.description && (
          <>
            <SectionTitle>{t('BUSINESS_DESCRIPTION', 'Business description')}</SectionTitle>
            <Description>{business.description}</Description>
          </>
        )}
        {
          !hideLocation && (
            <>
              {businessLocation.location && (
                <>
                  {businessLocation.location && (
                    <Map>
                      <GoogleMapsMap
                        apiKey={configs?.google_maps_api_key?.value}
                        location={businessLocation.location}
                        mapControls={businessLocation.googleMapsControls || business.googleMapsControls}
                        businessZones={business?.zones}
                        fillStyle={fillStyle}
                      />
                    </Map>
                  )}
                </>
              )}
              {
                !hideAddress && business?.address && <BusinessAddress>{business?.address}</BusinessAddress>
              }
              {business?.address_notes && <BusinessAddressNotes>{business?.address_notes}</BusinessAddressNotes>}
              <Divider />
            </>
          )
        }

        {!hideVideos && businessVideos?.length > 0 && (
          <BusinessMediaContent>
            <SectionTitle>{t('VIDEOS', 'Videos')}</SectionTitle>
            <div>
              {businessVideos.map((video, i) => (
                <iframe key={i} src={formatUrlVideo(video.video)} width='191' height='128' frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
              ))}
            </div>
          </BusinessMediaContent>
        )}
        {!hideImages && businessPhotos?.length > 0 && (
          <BusinessMediaContent>
            <SectionTitle>{t('IMAGES', 'Images')}</SectionTitle>
            <div>
              {
                businessPhotos.map((photo, i) => (
                  <img key={i} src={photo.file} alt={`photo-${i}`} width='191' height='128' onClick={() => handleModalImage(photo.file)} loading='lazy' />
                ))
              }
            </div>
          </BusinessMediaContent>
        )}
      </BusinessContent>
      {businessSchedule?.length > 0 && (
        <>
          {!hideSchedule && (
            <>
              <SectionTitle>{t('OPENING_TIME', 'Opening time')}</SectionTitle>
              <ScheduleSection>
                <ScheduleContainer>
                  {businessSchedule.map((schedule, i) => (
                    <ScheduleAccordion
                      isDisableAccordion
                      key={i}
                      weekIndex={i}
                      timeFormated={timeFormated}
                      schedule={schedule}
                    />
                  ))}
                </ScheduleContainer>
              </ScheduleSection>
            </>
          )}
          <DeliveryInfo>
            <div>
              {!hideDeliveryTime && !hidePickupTime && (
                <Divider className='time-wrapper' />
              )}
              {!hideDeliveryTime && (
                  <h5>{t('DELIVERY_TIME', 'Delivery Time')}: {convertHoursToMinutes(business?.delivery_time)}</h5>
              )}
              {!hidePickupTime && (
                <h5>{t('PICKUP_TIME', 'Pickup Time')}: {convertHoursToMinutes(business?.pickup_time)}</h5>
              )}
            </div>
          </DeliveryInfo>
        </>
      )}
      {modalImage && (
        <Modal
          onClose={() => setModalImage(false)}
          open={modalImage}
          padding='0'
          isTransparent
          height='auto'
          closeIconRight
        >
          <ImageContainer>
            <img src={image} width='320px' height='180px' loading='lazy' />
          </ImageContainer>
        </Modal>
      )}
    </BusinessInformationContainer>
  )
}

export const BusinessInformation = (props) => {
  const googleMapsControls = {
    defaultZoom: 15,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    }
  }

  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI,
    googleMapsControls
  }
  return <BusinessInformationController {...BusinessInformationProps} />
}
