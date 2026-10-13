import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Cart3 } from 'react-bootstrap-icons'
import { usePopper } from 'react-popper'
import AiOutlineClose from '@meronex/icons/ai/AiOutlineClose'

import {
  HeaderItem,
  PopoverBody,
  PopoverArrow,
  TitleContainer
} from './styles'

import { useLanguage } from '~components'
import {
  Modal,
  Button,
  useWindowSize
} from '~ui'

export const CategoriesPopover = (props) => {
  const { open, CategoriesPopoverUI, isHideHeader } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const windowSize = useWindowSize()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()
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

  const isSlideBar = windowSize.width < 993

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    const outsideModal = !window.document.getElementById('app-modals') || !window.document.getElementById('app-modals').contains(e.target)
    if (outsidePopover && outsidePopoverMenu && outsideModal) {
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [open])

  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', width: '450px', maxHeight: '70vh', overflowY: 'auto', top: '440px', left: '20px' }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }

  const handleScroll = () => {
    const wrapperCategories = document.getElementById('wrapper-categories')
    const categoriesPopoverElement = document.getElementById('categories-popover')
    if (wrapperCategories && categoriesPopoverElement) {
      let limit
      if (windowSize.width >= 993) {
        limit = window.pageYOffset >= wrapperCategories?.offsetTop && window.pageYOffset > 0
      } else {
        limit = window.pageYOffset >= (wrapperCategories?.offsetTop - 56) && window.pageYOffset > 0
      }
      if (limit) {
        const classAdded = categoriesPopoverElement?.classList?.contains('categories-popover-fixed')
        !classAdded && categoriesPopoverElement?.classList?.add('categories-popover-fixed')
      } else {
        categoriesPopoverElement && categoriesPopoverElement?.classList?.remove('categories-popover-fixed')
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [windowSize?.width])

  return (
    <div style={{ overflow: 'hidden' }}>
      {!isHideHeader && (
        <HeaderItem ref={referenceElement} onClick={props?.onClick} name='categories-popover' className='header-cart'>
          <span>
            <div>
              <Cart3 />
              {props.carts?.length > 1 && <span>{props.carts?.length}</span>}
              {props.carts?.length === 1 && <span>{props.carts[0].products.length}</span>}
            </div>
            <span>{t('ORDER', 'Order')}</span>
          </span>
        </HeaderItem>
      )}
      {isSlideBar
        ? (open
            ? <Modal
                open={open}
                onClose={props?.onClose}
                hideCloseDefault
                isSlideBar
                slideBarPosition={theme?.header?.components?.cart?.components?.open_strategy?.position}
              >
                <TitleContainer>
                  <Button outline color='primary' onClick={props?.onClose}>
                    <AiOutlineClose /> {t('CLOSE', 'Close')}
                  </Button>
                </TitleContainer>
                <CategoriesPopoverUI />
              </Modal>
            : null)
        : (
            <PopoverBody onClick={props?.onClose} id='categories-popover' className='categories-popover' ref={popperElement} style={popStyle} {...attributes.popper}>
              <CategoriesPopoverUI />
              <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
            </PopoverBody>
          )}
    </div>
  )
}
