import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  OrderProgressContainer,
  OrderInfoWrapper,
  ProgressDescriptionWrapper,
  OrderInfoRightWrapper,
  StatusWrapper,
  TimeWrapper,
  OrderProgressWrapper,
  NoOrderInfoWrapper
} from './styles'
import { orderStatuesList, deliveryTypes, statusToShow } from './constants'

import {
  useLanguage,
  useUtils,
  useEvent,
  useConfig,
  useSession,
  OrderList as OrderListController
} from '~components'

import { OrderEta } from '../OrderDetails/OrderEta'
import { Button, generalUtilities } from '~ui'

const OrderProgressUI = (props) => {
  const { orderList, handleOpenLoginSignUp, hasBanners } = props
  const [{ auth }] = useSession()
  const [, t] = useLanguage()
  const [{ parseTime, parseDate }] = useUtils()
  const [{ configs }] = useConfig()
  const [events] = useEvent()
  const { getStatusPrefix } = generalUtilities()

  const lastOrder = orderList.orders?.length ? orderList.orders?.find(order => !!order.business_id) : null
  const isPickup = lastOrder?.delivery_type && lastOrder?.delivery_type === 2

  const handleGoToPage = (index) => events.emit('go_to_page', { page: index })

  return (
    <>
      {orderList?.loading && (
        <OrderProgressWrapper>
          <Skeleton height={150} />
        </OrderProgressWrapper>
      )}
      {!orderList?.loading && !lastOrder && (
        <OrderProgressWrapper>
          {auth && hasBanners && (<h2>{t('YOUR_LAST_ORDER', 'Your last order')}</h2>)}
            <NoOrderInfoWrapper>
              {auth && !hasBanners && (<h2>{t('YOUR_LAST_ORDER', 'Your last order')}</h2>)}
              <div>
                {!auth && (
                  <>
                  {handleOpenLoginSignUp && (
                    <Button
                      color='primaryContrast'
                      naked
                      onClick={() => handleOpenLoginSignUp('login')}
                      >
                      {t('LOG_IN', 'Log in')}
                    </Button>
                  )}
                    <p>{t('AND_START_KEEPING_TRACK_OF_ORDERS', 'and start keeping track of all your orders.')}</p>
                  </>
                )}
                {auth && (<p>{t('YOU_HAVE_NO_PREVIOUS_ORDERS', 'You have no previous orders')}</p>)}
              </div>
            </NoOrderInfoWrapper>
        </OrderProgressWrapper>
      )}
      {!orderList?.loading && lastOrder && (
        <OrderProgressWrapper>
          {auth && hasBanners && (<h2>{t('YOUR_LAST_ORDER', 'Your last order')}</h2>)}
          <OrderProgressContainer>
            {auth && !hasBanners && (<h2>{t('YOUR_LAST_ORDER', 'Your last order')}</h2>)}
            <div>
              <OrderInfoWrapper>
                <ProgressDescriptionWrapper>
                  <h2>{lastOrder?.business?.name}</h2>
                  <TimeWrapper>
                    <span>{t('ORDER_NO', 'Order No.')} {lastOrder?.id}&nbsp;</span>
                    <span>{deliveryTypes?.includes(lastOrder?.delivery_type) ? t('ESTIMATED_DELIVERY', 'Estimated delivery') : t('ESTIMATED_TIME', 'Estimated time')}:&nbsp;</span>
                    <span>
                      {lastOrder?.delivery_datetime_utc
                        ? parseTime(lastOrder?.delivery_datetime_utc, { outputFormat: configs?.general_hour_format?.value || 'HH:mm' })
                        : parseTime(lastOrder?.delivery_datetime, { utc: false })}
                      &nbsp;-&nbsp;
                      {statusToShow.includes(lastOrder?.status)
                        ? <OrderEta order={lastOrder} outputFormat={configs?.general_hour_format?.value || 'HH:mm'} />
                        : parseDate(lastOrder?.reporting_data?.at[`status:${lastOrder.status}`], { outputFormat: configs?.general_hour_format?.value })}
                    </span>
                  </TimeWrapper>
                  <StatusWrapper isSuccess={orderStatuesList.completed.includes(lastOrder?.status)}>{getStatusPrefix({ status: lastOrder?.status, isPickup })?.value}</StatusWrapper>
                </ProgressDescriptionWrapper>
              </OrderInfoWrapper>
              <OrderInfoRightWrapper>
                <Button
                  color='primaryContrast'
                  naked
                  onClick={() => handleGoToPage('orders')}
                >
                  {t('VIEW_ALL_ORDERS', 'View all orders')}
                </Button>
              </OrderInfoRightWrapper>
            </div>
          </OrderProgressContainer>
        </OrderProgressWrapper>
      )}
    </>
  )
}

export const OrderProgress = (props) => {
  const propsToFetchBusiness = ['name', 'logo', 'slug', 'id']
  const propsToFetch = ['cart', 'business', 'status', 'id', 'uuid', 'cart_group_id', 'business_id', 'delivery_datetime', 'delivery_datetime_utc', 'total', 'summary', 'eta_current_status_time', 'eta_previous_status_times', 'eta_time', 'delivered_in', 'prepared_in', 'eta_drive_time']
  const orderProgressProps = {
    ...props,
    UIComponent: OrderProgressUI,
    orderStatus: [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    noGiftCardOrders: true,
    propsToFetchBusiness,
    propsToFetch,
    paginationSettings: {
      initialPage: 1,
      pageSize: props?.isCustomerMode ? 1 : 10,
      controlType: 'infinity'
    }
  }
  return <OrderListController {...orderProgressProps} />
}
