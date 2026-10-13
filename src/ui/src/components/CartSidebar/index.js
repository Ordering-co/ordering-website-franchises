import React, { useEffect, useRef, useState } from 'react'
import MdClose from '@meronex/icons/md/MdClose'
import MdCart from '@meronex/icons/ios/MdCart'

import {
  Container,
  BackDropContainer,
  TopContainer,
  IconContent,
  SidebarContent,
  MenuClose,
  CartContentWrapper
} from './styles'

import { useEvent, useLanguage, useOrder } from '~components'
import { useWindowSize, CartContent } from '~ui'

export const CartSidebar = (props) => {
  const {
    open,
    carts
  } = props

  const [, t] = useLanguage()
  const { width } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [orderState] = useOrder()
  const [events] = useEvent()
  const wasMenuOpen = useRef(false)

  const actionSidebar = (value) => {
    if (!value) {
      props.onClose()
    }
    setIsMenuOpen(value)
    document.getElementById('cartSidebar').style.width = value
      ? width > 489 ? '500px' : '100vw'
      : '0'
  }

  useEffect(() => {
    if (isMenuOpen) {
      if (width <= 500) {
        document.getElementById('cartSidebar').style.width = '100vw'
      } else {
        document.getElementById('cartSidebar').style.width = '500px'
      }
    }
  }, [width])

  useEffect(() => {
    if (!open) return
    actionSidebar(true)
  }, [open])

  useEffect(() => {
    if (isMenuOpen && !wasMenuOpen.current) events.emit('cart_viewed', carts)
    wasMenuOpen.current = isMenuOpen
  }, [isMenuOpen, carts, events])

  return (
    <>
      <Container>
        <IconContent
          onClick={() => actionSidebar(true)}
        >
          <MdCart />
          {carts?.length > 0 && <span>{props.carts?.length}</span>}
        </IconContent>
        {isMenuOpen && (
          <BackDropContainer onClick={() => actionSidebar(false)} />
        )}
        <SidebarContent
          id='cartSidebar'
        >
          <TopContainer>
            <h2>{t('MY_CART', 'My cart')}</h2>
            <MenuClose
              aria-label='close'
              onClick={() => actionSidebar(false)}
            >
              <MdClose />
              {t('CLOSE', 'close')}
            </MenuClose>
          </TopContainer>
          <CartContentWrapper>
            <CartContent
              isOpenCart={isMenuOpen}
              isCartPopover
              isSidebar
              carts={props.carts}
              isOrderStateCarts={!!orderState.carts}
              onClose={() => actionSidebar(false)}
            />
          </CartContentWrapper>
        </SidebarContent>
      </Container>
    </>
  )
}
