import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTheme } from 'styled-components'
import RiRadioButtonFill from '@meronex/icons/ri/RiRadioButtonFill'
import MdRadioButtonUnchecked from '@meronex/icons/md/MdRadioButtonUnchecked'

import {
  Container,
  GiftCardsListContainer,
  GiftCardsWrapper,
  GiftCardItem,
  IconControl,
  ActionButtonContainer,
  CardImage,
  CardImageStyled
} from './styles'

import { useLanguage, useUtils, PurchaseGiftCard as PurchaseGiftCardController } from '~components'
import { Button, NotFoundSource } from '~ui'

const PurchaseGiftCardUI = (props) => {
  const {
    productsListState,
    selectedProduct,
    setSelectedProduct,
    handleAccept
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const hideGiftCardImages = true

  return (
    <Container>
      <h2>{t('GIFT_CARD', 'Gift card')}</h2>
      <GiftCardsListContainer>
        <p>{t('SELECT_ONE_OPTION', 'Select one option')}</p>
        <GiftCardsWrapper>
          {productsListState.loading && (
            [...Array(4).keys()].map(i => (
              <GiftCardItem key={i}>
                <IconControl>
                  <Skeleton width={16} height={16} />
                </IconControl>
                {!hideGiftCardImages && (
                  <CardImageStyled>
                    <Skeleton width={38} height={38} />
                  </CardImageStyled>
                )}
                <Skeleton width={100} />
              </GiftCardItem>
            ))
          )}
          {productsListState.products.map(product => (
            <GiftCardItem
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <IconControl>
                {selectedProduct?.id === product.id
                  ? (
                  <RiRadioButtonFill />
                    )
                  : (
                  <MdRadioButtonUnchecked disabled />
                    )}
              </IconControl>
              {!hideGiftCardImages && (
                <CardImage
                  bgimage={optimizeImage(product?.image || theme?.images?.dummies?.product, 'h_86,c_limit')}
                />
              )}
              <span>{product.name}</span>
            </GiftCardItem>
          ))}
          {!productsListState.loading && productsListState.products.length === 0 && (
            <NotFoundSource />
          )}
        </GiftCardsWrapper>
      </GiftCardsListContainer>
      <ActionButtonContainer>
        <Button
          type='button'
          color='primary'
          disabled={!selectedProduct}
          onClick={() => handleAccept()}
        >
          {t('ACCEPT', 'Accept')}
        </Button>
      </ActionButtonContainer>
    </Container>
  )
}

export const PurchaseGiftCard = (props) => {
  const purchaseGiftCardProps = {
    ...props,
    UIComponent: PurchaseGiftCardUI
  }
  return <PurchaseGiftCardController {...purchaseGiftCardProps} />
}
