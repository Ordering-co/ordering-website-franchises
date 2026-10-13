import React, { useEffect, useState } from 'react'

import { AddNewCard } from '../PaymentOptionStripe/styles'

import { PaymentOptionStripe, useLanguage, useSession } from '~components'
import { Modal, CardFormCustom, PaymentOptionStripeUI } from '~ui'

const iframeCardForm = ['globalpay', 'cybersource']

const PaymentOptionCardUI = (props) => {
  const {
    deleteCard,
    cardsList,
    handleCardClick,
    handleNewCard,
    paymethodSelected,
    cardSelected,
    gateway,
    paymethodsWithoutSaveCards,
    onSelectCard,
    paymethodSelectedInfo,
    paymethodV2Featured,
    deleteUserCard,
    setOpenModal,
    deleteBusinessUserPaymethod
  } = props

  const [, t] = useLanguage()
  const [{ token }] = useSession()

  const [addCardOpen, setAddCardOpen] = useState(false)

  useEffect(() => {
    if (cardsList?.cards?.length > 0 && !paymethodV2Featured) {
      setAddCardOpen(true)
    }
  }, [cardsList?.cards, paymethodSelectedInfo?.paymethod?.gateway])

  return (
    <>
      <PaymentOptionStripeUI
        deleteCard={deleteCard}
        cardsList={cardsList}
        handleCardClick={handleCardClick}
        handleNewCard={handleNewCard}
        paymethodSelected={paymethodSelected}
        cardSelected={cardSelected}
        gateway={gateway}
        onSelectCard={onSelectCard}
        paymethodV2Featured={paymethodV2Featured}
        deleteUserCard={deleteUserCard}
        deleteBusinessUserPaymethod={deleteBusinessUserPaymethod}
      />
      {token &&
        !cardsList.loading &&
        (!cardSelected || !paymethodsWithoutSaveCards.includes(gateway)) &&
        ((!paymethodV2Featured || (paymethodV2Featured.includes('get_cards') && paymethodV2Featured.includes('register_cards')))) && (
          <AddNewCard>
            <span onClick={() => {
              iframeCardForm.includes(gateway) ? setOpenModal((prev) => ({ ...prev, iframe: true })) : setAddCardOpen(true)
            }}>{t('ADD_NEW_CARD', 'Add new card')}</span>
          </AddNewCard>
      )}
      {addCardOpen && (
        <Modal
          open={addCardOpen}
          onClose={() => setAddCardOpen(false)}
          title={t('ADD_NEW_CARD', 'Add new card')}
        >
          <CardFormCustom handleNewCard={handleNewCard} setAddCardOpen={setAddCardOpen} />
        </Modal>
      )}
    </>
  )
}

export const PaymentOptionCard = (props) => {
  const paymentOptionStripeProps = {
    ...props,
    UIComponent: PaymentOptionCardUI
  }
  return (
    <PaymentOptionStripe {...paymentOptionStripeProps} />
  )
}
