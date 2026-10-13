import React from 'react'

import { useLanguage, useUtils } from '~components'

import {
  Amounts,
  Content,
  Message,
  Progress,
  ProgressDetails,
  Wrapper
} from './styles'

export const FreeDeliveryProgress = ({
  status = 'hidden',
  minimum,
  currentAmount,
  remainingAmount,
  progressPercent,
  variant = 'full'
}) => {
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  if (status === 'hidden') return null

  if (status === 'awareness') {
    const minimumText = parsePrice(minimum)
    const message = t('FREE_DELIVERY_MINIMUM', 'Free delivery on orders :amount+')
      .replace(':amount', minimumText)

    return (
      <Wrapper data-variant={variant} $variant={variant}>
        <Message>{message}</Message>
      </Wrapper>
    )
  }

  if (status === 'unlocked') {
    return (
      <Wrapper data-variant={variant} $variant={variant} $unlocked role='status' aria-live='polite'>
        <Message>{t('FREE_DELIVERY_UNLOCKED', 'Free delivery unlocked')}</Message>
      </Wrapper>
    )
  }

  if (status === 'unconfirmed') {
    return (
      <Wrapper data-variant={variant} $variant={variant} role='status' aria-live='polite'>
        <Message>{t('FREE_DELIVERY_NOT_APPLIED', 'Free delivery has not been applied to this cart yet')}</Message>
      </Wrapper>
    )
  }

  if (status !== 'progress') return null

  const remainingText = parsePrice(remainingAmount)
  const message = t('ADD_AMOUNT_FOR_FREE_DELIVERY', 'Add :amount for free delivery')
    .replace(':amount', remainingText)

  return (
    <Wrapper data-variant={variant} $variant={variant}>
      <Content>
        <ProgressDetails>
          <Message>{message}</Message>
          <Amounts>{parsePrice(currentAmount)} / {parsePrice(minimum)}</Amounts>
        </ProgressDetails>
        <Progress
          value={progressPercent}
          max='100'
          aria-label={message}
          aria-valuemin='0'
          aria-valuemax='100'
          aria-valuenow={progressPercent}
        />
      </Content>
    </Wrapper>
  )
}
