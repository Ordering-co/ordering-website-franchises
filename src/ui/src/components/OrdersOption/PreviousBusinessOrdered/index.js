import React from 'react'

import { BusinessList, BusinessListWrapper } from './styles'

import { useOrder } from '~components'
import { useWindowSize, AutoScroll, BusinessController } from '~ui'

export const PreviousBusinessOrdered = (props) => {
  const {
    isCustomLayout,
    isCustomerMode,
    onRedirectPage,
    handleUpdateBusinesses,
    businesses,
    horizontal
  } = props

  const [orderState] = useOrder()
  const { width } = useWindowSize()

  const onBusinessClick = (business) => {
    onRedirectPage({ page: 'business', params: { store: business.slug } })
  }

  const AutoScrollContainer = (props) => (!horizontal ? <div className='vertical'>{props.children}</div> : <AutoScroll scrollId='searchlistorder'>{props.children}</AutoScroll>)

  return (
    <BusinessListWrapper isLoading={businesses?.loading}>
      <BusinessList horizontal={horizontal}>
        <AutoScrollContainer>
          {
            businesses?.result?.map((business, i) => (
              <BusinessController
                hideRibbon
                key={business.id}
                className='card'
                business={business}
                isBusinessOpen={business.open}
                handleCustomClick={onBusinessClick}
                orderType={orderState?.options?.type}
                isCustomLayout={isCustomLayout}
                isCustomerMode={isCustomerMode}
                businessHeader={business?.header}
                businessFeatured={business?.featured}
                businessOffers={business?.offers}
                businessLogo={business?.logo}
                businessReviews={business?.reviews?.total}
                businessDeliveryPrice={business?.delivery_price}
                businessDeliveryTime={business?.delivery_time}
                businessPickupTime={business?.pickup_time}
                businessDistance={business?.distance}
                firstCard={i === 0 && width > 681}
                handleUpdateBusinessList={handleUpdateBusinesses}
              />
            ))
          }
        </AutoScrollContainer>
      </BusinessList>
    </BusinessListWrapper>
  )
}
