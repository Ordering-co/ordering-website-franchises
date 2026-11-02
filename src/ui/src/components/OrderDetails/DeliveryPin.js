import React from 'react'

import { DeliveryPinContainer } from './styles'
import { useLanguage } from '~components'

export const DeliveryPin = (props) => {
  const { order } = props
  const [, t] = useLanguage()

  if (!order?.delivery_pin || order?.delivery_pin_status !== 'requested') return null

  return (
    <DeliveryPinContainer data-testid='delivery-pin'>
      <h3>{t('DELIVERY_PIN', 'Delivery PIN')}</h3>
      <span className='pin'>{order.delivery_pin}</span>
      <span className='help'>{t('DELIVERY_PIN_HELP', 'Give this code to the driver when you receive your order')}</span>
    </DeliveryPinContainer>
  )
}
