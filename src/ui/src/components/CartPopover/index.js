import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Cart3 } from 'react-bootstrap-icons'
import { usePopper } from 'react-popper'
import AiOutlineClose from '@meronex/icons/ai/AiOutlineClose'

import {
  HeaderItem,
  PopoverBody,
  PopoverArrow,
  TitleContainer,
  Title
} from './styles'

import { useOrder, useEvent, useLanguage } from '~components'
import {
  CartContent,
  Modal,
  Button,
  generalUtilities
} from '~ui'

export const CartPopover = (props) => {
  const { open, auth, location, isCustomerMode, setPreorderBusiness } = props
  const [orderState] = useOrder()
  const theme = useTheme()
  const [events] = useEvent()
  const [, t] = useLanguage()
  const { handleCreateGuestUser } = generalUtilities()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()
  const wasOpen = useRef(false)
  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: theme?.rtl ? 'bottom' : 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement.current } },
      {
        name: 'offset',
        options: {
          offset: [0, 12]
        }
      }
    ]
  })

  const { styles, attributes } = popper

  const isSlideBar = theme?.header?.components?.cart?.components?.open_strategy?.type === 'slide'

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    const outsideModal = !window.document.getElementById('app-modals') || !window.document.getElementById('app-modals').contains(e.target)
    if (outsidePopover && outsidePopoverMenu && outsideModal) {
      events.emit('cart_popover_closed')
      props.onClose && props.onClose()
    }
  }

  const handleClickCheckout = () => {
    const cartsAvailable = Object.values(orderState?.carts)?.filter(cart => cart?.valid && cart?.status !== 2)
    if (cartsAvailable.length === 1) {
      events.emit('go_to_page', { page: 'checkout', params: { cartUuid: cartsAvailable[0]?.uuid } })
      events.emit('cart_popover_closed')
      props.onClose && props.onClose()
    } else {
      props?.onClick && props.onClick()
    }
  }

  const handleCartOnClick = async () => {
    if (!auth) {
      await handleCreateGuestUser()
      events.emit('go_to_page', { page: 'order_types' })
    } else {
      props.carts?.length === 1 ? handleClickCheckout() : props?.onClick && props.onClick()
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [open])

  useEffect(() => {
    props.onClose()
  }, [auth])

  useEffect(() => {
    if (open && !wasOpen.current) events.emit('cart_viewed', props.carts)
    wasOpen.current = open
  }, [open, props.carts, events])

  useEffect(() => {
    if (location && location.pathname.includes('/checkout/')) {
      props.onClose && props.onClose()
    }
  }, [location])

  const getScrollTop = () => {
    if (document.documentElement?.scrollTop > 80) {
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    if (location && location.pathname.includes('/store/') && isCustomerMode) {
      window.addEventListener('scroll', getScrollTop)
    }
    return () => {
      window.removeEventListener('scroll', getScrollTop)
    }
  }, [])

  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', width: '450px', maxHeight: '70vh', overflowY: 'auto', translate3d: '-9px, 95px, 0px' }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  } else {
    popStyle.transform = 'translate3d(-9px, 95px, 0px)'
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <HeaderItem ref={referenceElement} onClick={handleCartOnClick} name='cart-popover' className='header-cart'>
        <span>
          <div>
            <Cart3 />
            {props.carts?.length > 1 && <span>{props.carts?.length}</span>}
            {props.carts?.length === 1 && <span>{props.carts[0].products.length}</span>}
          </div>
          <span className='cart-popover-text'>{t('ORDER', 'Order')}</span>
        </span>
      </HeaderItem>
      {isSlideBar
        ? (open
            ? <Modal
                open={open}
                onClose={props.onClose}
                hideCloseDefault
                isSlideBar
                slideBarPosition={theme?.header?.components?.cart?.components?.open_strategy?.position}
              >
                <TitleContainer>
                  <Title>{t('YOUR_ORDER', 'Your order')}</Title>
                  <Button outline color='primary' onClick={props.onClose}>
                    <AiOutlineClose /> {t('CLOSE', 'Close')}
                  </Button>
                </TitleContainer>
                <CartContent
                  isCartPopover
                  carts={props.carts}
                  isOrderStateCarts={!!orderState.carts}
                  onClose={props.onClose}
                  setPreorderBusiness={setPreorderBusiness}
                  isOpenCart={open}
                  onClick={props.onClick}
                  isSlideBar={isSlideBar}
                  isCustomerMode={isCustomerMode}
                />
              </Modal>
            : null)
        : (
        <PopoverBody className='cart-popover' ref={popperElement} style={popStyle} {...attributes.popper}>
          <CartContent
            isCartPopover
            hideProducts
            hideBusinessArrow
            carts={props.carts}
            isOrderStateCarts={!!orderState.carts}
            onClose={props.onClose}
            setPreorderBusiness={setPreorderBusiness}
            isOpenCart={open}
            onClick={props.onClick}
            isCustomerMode={isCustomerMode}
          />
          <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
        </PopoverBody>
          )}
    </div>
  )
}
