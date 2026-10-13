import React, { useState } from 'react'
import { useTheme } from 'styled-components'

import { PurchaseGiftCard } from '../PurchaseGiftCard'
import { RedeemGiftCard } from '../RedeemGiftCard'

import {
  Container,
  TitleWrapper,
  ActionWrapper
} from './styles'

import { useLanguage } from '~components'
import { Modal, Button } from '~ui'

export const GiftCardUI = (props) => {
  const [, t] = useLanguage()
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(null)

  return (
    <Container>
      <div className='left-container'>
        <img src={theme.images.general.giftCard} />
        <TitleWrapper>
          <h1>{t('GIFT_CARD', 'Gift card')}</h1>
        </TitleWrapper>
      </div>
      <ActionWrapper className='right-container'>
        <Button
          color='primary'
          onClick={() => setOpenModal('purchase')}
        >
          {t('PURCHASE_GIFT_CARD_SHORT', 'Purchase')}
        </Button>
        <Button
          outline
          color='lightGray'
          onClick={() => setOpenModal('redeem')}
        >
          {t('REDEEM_GIFT_CARD_SHORT', 'Redeem')}
        </Button>
      </ActionWrapper>

      {openModal === 'purchase' && (
        <Modal
          closeIconRight
          width='700px'
          padding='0px 30px 30px'
          open={openModal === 'purchase'}
          onClose={() => setOpenModal(null)}
        >
          <PurchaseGiftCard />
        </Modal>
      )}
      {openModal === 'redeem' && (
        <Modal
          closeIconRight
          width='700px'
          padding='20px 30px 30px'
          open={openModal === 'redeem'}
          onClose={() => setOpenModal(null)}
        >
          <RedeemGiftCard
            onClose={() => setOpenModal(null)}
          />
        </Modal>
      )}
    </Container>
  )
}
