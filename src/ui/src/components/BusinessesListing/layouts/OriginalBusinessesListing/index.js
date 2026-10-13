import React, { useEffect, useState } from 'react'
import {
  Pencil
} from 'react-bootstrap-icons'
import {
  BusinessContainer,
  BusinessList,
  AddressFormWrapper,
  AddressMenu,
  PaginationWrapper,
  BusinessListingContainer,
  SearchBarWrapper,
  BusinessesWrapper
} from './styles'

import {
  useOrder,
  useSession,
  useLanguage,
  useConfig,
  BusinessList as BusinessListController
} from '~components'
import { parseOrderTypesAllowed } from '~/utils/parseOrderTypesAllowed'

import {
  NotFoundSource,
  Modal,
  Alert,
  getCateringValues,
  BusinessController,
  BusinessPreorder,
  CitiesControl,
  AddressList,
  AddressForm,
  Pagination,
  BusinessesMap,
  /* useBusinessSelected, */
  SearchBar
} from '~ui'

const BusinessesListingUI = (props) => {
  const {
    searchValue,
    businessesList,
    paginationProps,
    getBusinesses,
    isCustomLayout,
    isCustomerMode,
    handleBusinessClick,
    onBusinessClick,
    handleUpdateBusinessList,
    handleChangeSearch,
    citiesState
  } = props
  const [, t] = useLanguage()
  const [orderState, { changeCityFilter }] = useOrder()
  const [{ auth }] = useSession()
  const [{ configs }] = useConfig()

  const unaddressedTypes = parseOrderTypesAllowed(configs?.unaddressed_order_types_allowed?.value)
  const isAllowUnaddressOrderType = unaddressedTypes.includes(orderState?.options?.type)
  /* const [, { onChangeBusinessSelected }] = useBusinessSelected() */

  const [modals, setModals] = useState({ listOpen: false, formOpen: false, citiesOpen: false })
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [mapErrors, setMapErrors] = useState('')
  const [isPreorder, setIsPreorder] = useState(false)
  const [preorderBusiness, setPreorderBusiness] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState([])

  const defaultLatitude = Number(configs?.location_default_latitude?.value)
  const defaultLongitude = Number(configs?.location_default_longitude?.value)
  const isInvalidDefaultLocation = isNaN(defaultLatitude) || isNaN(defaultLongitude)
  const defaultLocation = {
    lat: !isInvalidDefaultLocation ? defaultLatitude : 40.7744146,
    lng: !isInvalidDefaultLocation ? defaultLongitude : -73.9678064
  }

  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const cateringValues = preorderBusiness?.configs && getCateringValues(cateringTypeString, preorderBusiness?.configs)

  const handleClickAddress = (e) => {
    if (auth && orderState.options?.address?.address) {
      setModals({ ...modals, listOpen: true })
    } else {
      setModals({ ...modals, formOpen: true })
    }
  }

  const handleCloseAlerts = () => {
    setAlertState({ open: false, content: [] })
    setMapErrors('')
  }

  const handleMapErrors = (errKey) => {
    setAlertState({
      open: true,
      content: [t(errKey, mapErrors[errKey])]
    })
  }

  useEffect(() => {
    if (mapErrors) {
      handleMapErrors(mapErrors)
    }
  }, [mapErrors])

  const handleClosePreorder = () => {
    setIsPreorder(false)
    setPreorderBusiness(null)
  }

  const handleChangeCity = (cityId) => {
    changeCityFilter(cityId === orderState?.options?.city_id ? null : cityId)
  }

  const businessControllerProps = {
    className: 'card',
    handleCustomClick: handleBusinessClick,
    orderType: orderState?.options?.type,
    onPreorderBusiness: setPreorderBusiness,
    handleUpdateBusinessList,
    favoriteIds,
    setFavoriteIds
  }

  useEffect(() => {
    if (preorderBusiness) setIsPreorder(true)
  }, [preorderBusiness])

  useEffect(() => {
    if (!businessesList?.businesses?.length) return
    if (businessesList?.businesses?.length === 1 && configs?.activate_single_store_automatically?.value === '1') {
      onBusinessClick(businessesList?.businesses[0])
      window.localStorage.setItem('single_business', true)
      return
    }
    window.localStorage.removeItem('single_business')
    const ids = [...favoriteIds]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  useEffect(() => {
    if (!citiesState?.cities?.length || !orderState?.options?.city_id) return
    const selectedCity = citiesState?.cities?.find(city => city?.id === orderState?.options?.city_id)
    if (!selectedCity || !selectedCity?.enabled) changeCityFilter(null)
  }, [citiesState, orderState?.options?.city_id])

  return (
    <BusinessContainer noAddress={!orderState.options?.address?.address && !isAllowUnaddressOrderType}>
      <BusinessListingContainer>

        <AddressMenu onClick={() => handleClickAddress()}>
          <span>
            {orderState.options?.address?.address || t('WHERE_DO_WE_DELIVERY', 'Where do we delivery?')}
          </span>
          <Pencil />
        </AddressMenu>
        {!orderState.options?.address?.address && !isAllowUnaddressOrderType && (
          <NotFoundSource
            content={t('NO_BUSINESSES_TO_SHOW', 'No businesses to show')}
          />
        )}
        {(orderState.options?.address?.address || isAllowUnaddressOrderType) && (
          <BusinessesWrapper className='businesses-wrapper'>
            <SearchBarWrapper>
              <SearchBar
                lazyLoad
                search={searchValue}
                onSearch={handleChangeSearch}
                placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
              />
            </SearchBarWrapper>
            <>
              <BusinessList className='business-list'>
                {
                  !businessesList.loading && businessesList.businesses.length === 0 && businessesList?.fetched && (
                    <NotFoundSource
                      content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
                    >
                    </NotFoundSource>
                  )
                }
                {
                  businessesList?.businesses?.sort((a, b) => a?.distance - b?.distance)?.map((business) => (
                    <BusinessController
                      key={business.id}
                      className='card'
                      business={business}
                      isBusinessOpen={business.open && business?.enabled !== false}
                      handleCustomClick={handleBusinessClick}
                      orderType={orderState?.options?.type}
                      isCustomLayout={isCustomLayout}
                      isCustomerMode={isCustomerMode}
                      onPreorderBusiness={setPreorderBusiness}
                      businessHeader={business?.header}
                      businessFeatured={business?.featured}
                      businessOffers={business?.offers}
                      businessLogo={business?.logo}
                      businessReviews={business?.reviews?.total}
                      businessDeliveryPrice={business?.delivery_price}
                      businessDeliveryTime={business?.delivery_time}
                      businessPickupTime={business?.pickup_time}
                      businessDistance={business?.distance}
                      handleUpdateBusinessList={handleUpdateBusinessList}
                      favoriteIds={favoriteIds}
                      setFavoriteIds={setFavoriteIds}
                    />
                  ))
                }
                {(businessesList.loading || !businessesList?.fetched) && (
                  [...Array(paginationProps?.nextPageItems > 4 ? paginationProps.nextPageItems : 8).keys()].map(i => (
                    <BusinessController
                      key={i}
                      className='card'
                      business={{}}
                      isSkeleton
                      orderType={orderState?.options?.type}
                    />
                  ))
                )}
              </BusinessList>
              <PaginationWrapper>
                <Pagination
                  currentPage={paginationProps.currentPage}
                  totalPages={Math.ceil(paginationProps?.totalPages)}
                  handleChangePage={(page) => getBusinesses(true, page)}
                />
              </PaginationWrapper>
            </>
          </BusinessesWrapper>
        )}
      </BusinessListingContainer>
      {!businessesList.loading && !orderState.loading && (
        <BusinessesMap
          businessControllerProps={businessControllerProps}
          businessList={(orderState.options?.address?.address || isAllowUnaddressOrderType) ? (businessesList.businesses ?? []) : []}
          userLocation={orderState?.options?.address?.location ?? defaultLocation}
          onBusinessCustomClick={(business) => handleBusinessClick(business)}
          avoidFitBounds={!orderState.options?.address?.address && !isAllowUnaddressOrderType}
        />
      )}
      {isPreorder && (
        <Modal
          open={isPreorder}
          width='760px'
          onClose={() => handleClosePreorder()}
        >
          <BusinessPreorder
            business={preorderBusiness}
            handleClick={handleBusinessClick}
            showButton
            cateringPreorder={!!cateringTypeString}
            {...cateringValues}
          />
        </Modal>
      )}
      {modals.citiesOpen && (
        <Modal
          open={modals.citiesOpen}
          width='70%'
          onClose={() => setModals({ ...modals, citiesOpen: false })}
          padding='0px'
          hideCloseDefault
        >
          <CitiesControl
            cities={citiesState?.cities}
            handleChangeCity={handleChangeCity}
            onClose={() => setModals({ ...modals, citiesOpen: false })}
          />
        </Modal>
      )}
      {(modals.formOpen || modals.listOpen) && (
        <Modal
          {...(!auth && { title: t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?') })}
          open={modals.formOpen || modals.listOpen}
          onClose={() => setModals({ ...modals, formOpen: false, listOpen: false })}
          width='40%'
          minHeight='90vh'
          closeIconRight
        >
          {modals.listOpen
            ? (
                <AddressList
                  isHideTitle
                  isModal
                  changeOrderAddressWithDefault
                  onCancel={() => setModals({ ...modals, listOpen: false })}
                  onAccept={() => setModals({ ...modals, listOpen: false })}
                  isMobile
                />
              )
            : (
              <AddressFormWrapper>
                <AddressForm
                  useValidationFileds
                  address={orderState?.options?.address || {}}
                  onCancel={() => setModals({ ...modals, formOpen: false })}
                  onSaveAddress={() => setModals({ ...modals, formOpen: false })}
                  isCustomerMode={isCustomerMode}
                />
              </AddressFormWrapper>
              )}
        </Modal>
      )}

      <Alert
        title={!mapErrors ? t('SEARCH', 'Search') : t('BUSINESSES_MAP', 'Businesses Map')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => handleCloseAlerts()}
        onAccept={() => handleCloseAlerts()}
        closeOnBackdrop={false}
      />
    </BusinessContainer>
  )
}

export const OriginalBusinessesListing = (props) => {
  const [, t] = useLanguage()
  const businessListingProps = {
    ...props,
    UIComponent: BusinessesListingUI,
    paginationSettings: { initialPage: 1, pageSize: 5, controlType: 'infinity' },
    orderTypes: props.orderTypes || [
      {
        value: 1,
        text: t('DELIVERY', 'Delivery'),
        description: t('ORDERTYPE_DESCRIPTION_DELIVERY', 'Delivery description')
      },
      {
        value: 2,
        text: t('PICKUP', 'Pickup'),
        description: t('ORDERTYPE_DESCRIPTION_PICKUP', 'Pickup description')
      },
      {
        value: 3,
        text: t('EAT_IN', 'Eat in'),
        description: t('ORDERTYPE_DESCRIPTION_EATIN', 'Eat in description')
      },
      {
        value: 4,
        text: t('CURBSIDE', 'Curbside'),
        description: t('ORDERTYPE_DESCRIPTION_CURBSIDE', 'Curbside description')
      },
      {
        value: 5,
        text: t('DRIVE_THRU', 'Drive thru'),
        description: t('ORDERTYPE_DESCRIPTION_DRIVETHRU', 'Drive Thru description')
      }
    ]
  }
  return <BusinessListController {...businessListingProps} />
}
