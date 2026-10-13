import React, { useEffect, useState } from 'react'
import {
  OrderTypeSelectorContainer,
  OrderTypesContainer,
  MoreOrderTypeSelectorContainer
} from './styles'

import { useConfig, useLanguage, useOrder, OrderTypeControl, useSession } from '~components'
import { parseOrderTypesAllowed } from '~/utils/parseOrderTypesAllowed'
import Button from '../../styles/Buttons'
import { AdvancedAddressForm } from '../AdvancedAddressForm'
import { SpinnerLoader } from '../SpinnerLoader'

export const OrderTypeSelectorUI = (props) => {
  const {
    handleChangeOrderType,
    orderTypes,
    configTypes,
    typeSelected,
    setOrderTypeValue,
    onBusinessClick,
    propsToFetch
  } = props

  const [orderState] = useOrder()
  const [{ user }] = useSession()
  const [openBusinessList, setOpenBusinessList] = useState(orderState?.options?.type !== 1)

  const selectAsPickup = [2, 3, 4, 5]
  const orderTypesAllowed = orderTypes && (configTypes ? orderTypes.filter(type => configTypes?.includes(type.value)) : orderTypes)

  const handleChangeOrderTypeCallback = async (orderType) => {
    if (!orderState.loading) {
      setOrderTypeValue && setOrderTypeValue(orderType)
      await handleChangeOrderType(orderType)
    }
  }

  useEffect(() => {
    if (!orderState?.options?.address?.location) return
    if (selectAsPickup?.includes(typeSelected)) {
      setOpenBusinessList(true)
    } else if (typeSelected === 1) {
      setOpenBusinessList(false)
    }
  }, [orderState?.options?.address?.location, typeSelected])

  return (
    <>
      {orderState?.loading && !selectAsPickup?.includes(typeSelected) && (
        <SpinnerLoader/>
      )}
      {(!orderState?.loading || selectAsPickup?.includes(typeSelected)) && (
        <OrderTypesContainer
          className='order-type'
          style={{ overflow: 'hidden' }}
          openBusinessList={openBusinessList}
        >
          {orderTypesAllowed && orderTypesAllowed.length <= 2 && (
            <OrderTypeSelectorContainer openBusinessList={openBusinessList}>
              {orderTypesAllowed.map((orderType, i) => (
                <Button
                  disabled={orderState?.loading}
                  key={i}
                  initialIcon
                  onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                  className={typeSelected === orderType.value ? 'selected' : ''}
                >
                  <p>{orderType.text}</p>
                </Button>
              ))}
            </OrderTypeSelectorContainer>
          )}
          {orderTypesAllowed && orderTypesAllowed.length > 2 && (
            <div>
              <OrderTypeSelectorContainer>
                {orderTypesAllowed.slice(0, 2).map((orderType, i) => (
                    <Button
                      key={i}
                      disabled={orderState?.loading}
                      initialIcon
                      onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                      className={(typeSelected === orderType.value) || (orderType.value === 2 && selectAsPickup.includes(typeSelected)) ? 'selected' : ''}
                    >
                      <p>{orderType.text}</p>
                    </Button>
                ))}
              </OrderTypeSelectorContainer>
              {selectAsPickup.includes(typeSelected) && (
                <MoreOrderTypeSelectorContainer>
                  <div className='more-order-type-wrapper'>
                    {orderTypesAllowed.slice(1).map((orderType, i) => (
                        <Button
                          key={i}
                          disabled={orderState?.loading}
                          initialIcon
                          onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                          className={(typeSelected === orderType.value) ? 'selected' : ''}
                        >
                          <p>{orderType.text}</p>
                        </Button>
                    ))}
                  </div>
                </MoreOrderTypeSelectorContainer>
              )}
            </div>
          )}
          <AdvancedAddressForm
            propsToFetch={propsToFetch}
            isSelectedAfterAdd
            userId={user?.id}
            addressId={orderState?.options?.address?.id}
            onBusinessClick={onBusinessClick}
            openBusinessList={openBusinessList}
            setOpenBusinessList={setOpenBusinessList}
          />
        </OrderTypesContainer>
      )}
    </>
  )
}

export const OrderTypeSelector = (props) => {
  const [, t] = useLanguage()
  const [configState] = useConfig()

  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorUI,
    configTypes: parseOrderTypesAllowed(configState?.configs?.order_types_allowed?.value),
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

  return <OrderTypeControl {...orderTypeProps} />
}
