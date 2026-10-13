import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import BsInfoCircle from '@meronex/icons/bs/BsInfoCircle'

import {
  BusinessContainer,
  BusinessContent,
  WrapperBusinessLogo,
  BusinessLogo,
  BusinessMoreDetail,
  SearchComponentContainer,
  BusinessInfoWrapper
} from './styles'
import { SearchComponent } from './SearchComponent'
import { BusinessInfoComponent } from './BusinessInfoComponent'

import { useUtils, useLanguage, useOrder, useConfig } from '~components'
import {
  useWindowSize,
  Modal,
  BusinessInformation,
  BusinessReviews,
  MomentContent,
  SearchProducts,
  BusinessPreorder
} from '~ui'
dayjs.extend(timezone)
dayjs.extend(isBetween)

const NO_PREORDER_TYPES = [7, 8, 9]

export const BusinessBasicInformation = (props) => {
  const {
    isSkeleton,
    showCartOnProductList,
    businessState,
    setOpenBusinessInformation,
    openBusinessInformation,
    handleChangeSearch,
    searchValue,
    sortByOptions,
    sortByValue,
    handleChangeSortBy,
    categoryState,
    errorQuantityProducts,
    isCustomerMode,
    isCustomLayout,
    handleFavoriteBusiness
  } = props
  const { business, loading } = businessState

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const windowSize = useWindowSize()
  const [isBusinessReviews, setIsBusinessReviews] = useState(false)
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [openSearchProducts, setOpenSearchProducts] = useState(false)

  const hideLogo = true
  const hideInfoIcon = theme?.business_view?.components?.header?.components?.business_info?.hidden
  const hideHeader = true

  const isInfoShrunken = theme?.business_view?.components?.header?.components?.business?.components?.layout?.position === 'shrunken'

  const businessInfoComponentProps = {
    loading,
    business,
    isInfoShrunken,
    isCustomerMode,
    isCustomLayout,
    setIsPreOrder,
    setIsBusinessReviews,
    categoryState,
    searchValue,
    errorQuantityProducts,
    setOpenSearchProducts,
    setOpenBusinessInformation,
    handleChangeSortBy,
    sortByValue,
    sortByOptions,
    showCartOnProductList,
    handleFavoriteBusiness
  }

  const preorderCheckedBusiness = useRef(null)
  const hasNothingToShow = errorQuantityProducts && !categoryState?.products?.length
  const isNoPreorderType = NO_PREORDER_TYPES.includes(orderState?.options?.type)
  const isAppointment = business?.professionals?.length > 0
  const isPreorderEnabled = configs?.preorder_status_enabled?.value === '1'

  useEffect(() => {
    if (isSkeleton || loading || categoryState?.loading || orderState?.loading) return
    if (!business?.id) return
    if (preorderCheckedBusiness.current === business.id) return
    preorderCheckedBusiness.current = business.id
    if (searchValue || orderState?.options?.moment) return
    if (isNoPreorderType || isAppointment || !isPreorderEnabled) return
    if (!hasNothingToShow) return
    setIsPreOrder(true)
  }, [
    business?.id,
    loading,
    categoryState?.loading,
    hasNothingToShow,
    searchValue,
    isNoPreorderType,
    isAppointment,
    isPreorderEnabled,
    orderState?.loading,
    orderState?.options?.moment
  ])

  useEffect(() => {
    if (businessState?.loading) return
    let timeout = null
    const currentDate = dayjs().tz(businessState?.business?.timezone)
    let lapse = null
    if (businessState?.business?.today?.enabled) {
      lapse = businessState?.business?.today?.lapses?.find(lapse => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
    }
    if (lapse) {
      const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
      const timeToClose = (to.unix() - currentDate.unix()) * 1000
      timeout = setTimeout(() => {
        setIsPreOrder(true)
      }, timeToClose)
    }
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [businessState?.business])

  useEffect(() => {
    document.body.style.overflowY = openSearchProducts ? 'hidden' : 'auto'
  }, [openSearchProducts])

  const handleScroll = () => {
    const searchElement = document.getElementById('search-component')
    if (searchElement) {
      const limit = window.scrollY >= searchElement?.offsetTop && window.scrollY > 0
      if (limit) {
        const classAdded = searchElement?.classList?.contains('fixed-search')
        !classAdded && searchElement?.classList?.add('fixed-search')
      } else {
        searchElement && searchElement?.classList?.remove('fixed-search')
      }
    }
    const backArrowElement = document.getElementById('back-arrow')

    const businessNameElement = document.getElementById('business_name')
    const businessNameFeedbackElement = document.getElementById('business_name_feedback')
    if (businessNameElement) {
      const limit = ((window.scrollY >= (businessNameElement?.offsetTop - 15) && businessNameFeedbackElement?.offsetTop === 0) || (businessNameElement?.offsetTop === 0 && window.scrollY >= businessNameFeedbackElement?.offsetTop - 15)) && window.scrollY > 0
      if (limit) {
        const classAdded = businessNameElement?.classList?.contains('fixed-name')
        !classAdded && businessNameElement?.classList?.add('fixed-name')
        const classAdded2 = backArrowElement?.classList?.contains?.('fixed-arrow')
        !classAdded2 && backArrowElement && backArrowElement?.classList?.add('fixed-arrow')
        if (businessNameFeedbackElement) businessNameFeedbackElement.style.display = 'block'
      } else {
        businessNameElement && businessNameElement?.classList?.remove('fixed-name')
        backArrowElement && backArrowElement?.classList?.remove('fixed-arrow')
        if (businessNameFeedbackElement) businessNameFeedbackElement.style.display = 'none'
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [windowSize?.width])

  useEffect(() => {
    window.scroll({
      top: window.scrollY - 1,
      left: 0
    })
  }, [sortByValue])

  return (
    <>
      {openSearchProducts && (
        <SearchProducts
          {...props}
          onClose={() => {
            handleChangeSearch && handleChangeSearch('')
            setOpenSearchProducts(false)
            window.scroll({
              top: window.scrollY - 1,
              left: 0
            })
          }}
          business={businessState.business}
        />
      )}
      <BusinessInfoWrapper>
        {(!isInfoShrunken) && (
          <BusinessInfoComponent {...businessInfoComponentProps} />
        )}
        {((business?.header || business?.logo || loading || isInfoShrunken) && !hideHeader) && (
          <BusinessContainer bgimage={business?.header} isSkeleton={isSkeleton} id='container' isClosed={!business?.open}>
            {(!loading && !business?.open) && <h1>{t('CLOSED', 'Closed')}</h1>}
            {(!hideLogo && business?.logo) && (
              <BusinessContent>
                <WrapperBusinessLogo>
                  {!loading && (
                    <BusinessLogo bgimage={optimizeImage(business?.logo, 'h_200,c_limit')} />
                  )}
                </WrapperBusinessLogo>
              </BusinessContent>
            )}
            {(isInfoShrunken) && (
              <BusinessInfoComponent {...businessInfoComponentProps} />
            )}
            {!loading && (
              <>
                {isInfoShrunken && (
                  <SearchComponentContainer>
                    <SearchComponent
                      setOpenSearchProducts={setOpenSearchProducts}
                      handleChangeSortBy={handleChangeSortBy}
                      sortByValue={sortByValue}
                      sortByOptions={sortByOptions}
                    />
                  </SearchComponentContainer>
                )}
                {!hideInfoIcon && (
                  <BusinessMoreDetail>
                    <BsInfoCircle onClick={() => setOpenBusinessInformation(true)} />
                  </BusinessMoreDetail>
                )}
              </>
            )}
          </BusinessContainer>
        )}
      </BusinessInfoWrapper>
      {openBusinessInformation && (
        <Modal
          closeIconRight
          width='70%'
          open={openBusinessInformation}
          onClose={() => setOpenBusinessInformation(false)}
          padding='0 5vw 20px'
          closeOnBackdrop={false}
        >
          <BusinessInformation business={business} />
        </Modal>
      )}
      {isBusinessReviews && (
        <Modal
          closeIconRight
          width='70%'
          open={isBusinessReviews}
          onClose={() => setIsBusinessReviews(false)}
          padding='10px 0 20px'
        >
          <BusinessReviews
            businessId={business.id}
            reviews={business.reviews?.reviews}
            businessName={business.name}
            stars={business.reviews?.total}
          />
        </Modal>
      )}
      {isPreOrder && (
        <Modal
          open={isPreOrder}
          width={isCustomerMode ? '700px' : '760px'}
          onClose={() => setIsPreOrder(false)}
          padding={isCustomerMode && '20px'}
        >
          {isCustomerMode
            ? (
            <MomentContent onClose={() => setIsPreOrder(false)} />
              )
            : (
            <BusinessPreorder
              business={business}
              handleClick={() => setIsPreOrder(false)}
            />
              )}
        </Modal>
      )}
    </>
  )
}
