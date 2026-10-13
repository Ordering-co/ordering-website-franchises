import React, { useState } from 'react'
import { useTheme } from 'styled-components'

import {
  Container,
  NoOrdersWrapper,
  MyOrdersMenuContainer,
  Divider
} from './styles'

import { useConfig, useLanguage } from '~components'

import { Tab, Tabs, Button, OrdersOption, generalUtilities } from '~ui'
import { GiftCardOrdersList } from '../GiftCard/GiftCardOrdersList'

export const MyOrders = (props) => {
  const {
    hideOrders,
    isFromBusinessListingSearch,
    businessesSearchList,
    onProductRedirect,
    onRedirectPage
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const { handleGoToPage } = generalUtilities()
  const layout = theme?.orders?.components?.layout?.type || 'original'

  const [isEmptyActive, setIsEmptyActive] = useState(false)
  const [isEmptyPast, setIsEmptyPast] = useState(false)
  const [isEmptyPreorder, setIsEmptyPreorder] = useState(false)
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')
  const [isEmptyBusinesses, setIsEmptyBusinesses] = useState(false)
  const [businessOrderIds, setBusinessOrderIds] = useState([])

  const hidePreviousOrders = theme?.orders?.components?.past_orders?.hidden
  const hideProductsTab = theme?.orders?.components?.products_tab?.hidden
  const hideBusinessTab = theme?.orders?.components?.business_tab?.hidden
  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')
  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const MyOrdersMenu = [
    { key: 'orders', value: t('ORDERS_MENU_PAGE', 'Orders'), disabled: false },
    { key: 'business', value: t('BUSINESS_MENU_PAGE', 'Business'), disabled: hideBusinessTab },
    { key: 'products', value: t('PRODUCTS_MENU_PAGE', 'Products'), disabled: hideProductsTab },
    { key: 'giftCards', value: t('GIFT_CARD_MENU_PAGE', 'Gift card'), disabled: !isWalletEnabled || isGiftCardDisabled }
  ]

  const notOrderOptions = ['business', 'products', 'professionals']
  const allEmpty = (isEmptyActive && isEmptyPast && isEmptyPreorder) || ((isEmptyBusinesses || businessOrderIds?.length === 0) && hideOrders)

  return (
    <>
      {hideOrders && !allEmpty && (
        <h2>{t('PREVIOUSLY_ORDERED', 'Previously ordered')}</h2>
      )}
      <Container hideOrders={hideOrders} initialHeight={isFromBusinessListingSearch}>
        {!hideOrders && layout === 'appointments' && (
          <h1>{t('MY_APPOINTMENTS', 'My appointments')}</h1>
        )}
        {!allEmpty && (
          <MyOrdersMenuContainer className='category-lists'>
            <Tabs className='tabs' variant='primary' withBackground>
              {MyOrdersMenu.filter(option => (!hideOrders || option.key !== 'orders') && !option.disabled).map((option, i) => (
                <Tab
                  className={`tab ${i === MyOrdersMenu.length - 1 ? 'last' : ''}`}
                  key={option.key}
                  onClick={() => setSelectedOption(option.key)}
                  active={selectedOption === option.key}
                  withBackground
                >
                  {option?.value}
                </Tab>
              ))}
              {layout === 'appointments' && (
                <Tab
                  onClick={() => setSelectedOption('professionals')}
                  active={selectedOption === 'professionals'}
                  borderBottom
                >
                  {t('PROFESSIONALS', 'Professionals')}
                </Tab>
              )}
            </Tabs>
          </MyOrdersMenuContainer>
        )}
        {selectedOption === 'orders' && (
          <>
            {(isEmptyActive && isEmptyPast && isEmptyPreorder)
              ? (
                  <NoOrdersWrapper allEmpty>
                    <p>{t('YOU_DONT_HAVE_ORDERS', 'You don\'t have any orders')}</p>
                    <Button
                      color='primary'
                      onClick={() => handleGoToPage({ page: 'order_types' })}
                    >
                      {t('ORDER_NOW', 'Order now')}
                    </Button>
                  </NoOrdersWrapper>
                )
              : (
              <>
                <OrdersOption
                  {...props}
                  preOrders
                  setIsEmptyPreorder={setIsEmptyPreorder}
                />
                <OrdersOption
                  {...props}
                  activeOrders
                  setIsEmptyActive={setIsEmptyActive}
                />
                {!isEmptyPast && (!isEmptyActive || !isEmptyPreorder) && (
                  <Divider />
                )}
                <OrdersOption
                  {...props}
                  pastOrders
                  setIsEmptyPast={setIsEmptyPast}
                  handleRedirectToCheckout={uuid => {
                    onRedirectPage && onRedirectPage({ page: 'checkout', params: { cartUuid: uuid } })
                  }}
                />
              </>
                )}
          </>
        )}
        {notOrderOptions.includes(selectedOption) && !hidePreviousOrders
          ? (<OrdersOption
              {...props}
              titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
              hideOrders
              isBusiness={selectedOption === 'business'}
              isProducts={selectedOption === 'products'}
              isProfessionals={selectedOption === 'professionals'}
              activeOrders
              pastOrders
              preOrders
              businessesSearchList={businessesSearchList}
              setIsEmptyBusinesses={setIsEmptyBusinesses}
              businessOrderIds={businessOrderIds}
              setBusinessOrderIds={setBusinessOrderIds}
              onProductRedirect={onProductRedirect}
            />)
          : selectedOption !== 'giftCards' && selectedOption !== 'orders' && (
            <NoOrdersWrapper>
              <p>{t('NOTHING_TO_SHOW', 'Nothing to show')}</p>
            </NoOrdersWrapper>
          )}
        {selectedOption === 'giftCards' && (
          <GiftCardOrdersList />
        )}
      </Container>
    </>
  )
}
