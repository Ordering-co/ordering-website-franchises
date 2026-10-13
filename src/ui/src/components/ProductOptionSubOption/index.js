import React, { useState, useEffect, useRef } from 'react'
import BsCircleFill from '@meronex/icons/bs/BsCircleFill'
import BsCircleHalf from '@meronex/icons/bs/BsCircleHalf'
import BsDashCircle from '@meronex/icons/bs/BsDashCircle'
import BsPlusCircle from '@meronex/icons/bs/BsPlusCircle'
import MdCheckBox from '@meronex/icons/md/MdCheckBox'
import MdCheckBoxOutlineBlank from '@meronex/icons/md/MdCheckBoxOutlineBlank'
import RiRadioButtonFill from '@meronex/icons/ri/RiRadioButtonFill'
import MdRadioButtonUnchecked from '@meronex/icons/md/MdRadioButtonUnchecked'

import {
  Container,
  SuboptionPrice,
  QuantityControl,
  PositionControl,
  IconControl,
  Text,
  SubOptionThumbnail,
  LeftOptionContainer,
  RightOptionContainer,
  ExtraControl,
  ExtraItem
} from './styles'

import {
  ProductOptionSuboption as ProductSubOptionController,
  useUtils,
  useLanguage
} from '~components'

import { Alert } from '~ui'

const ProductOptionSubOptionPropsAreEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.state) === JSON.stringify(nextProps.state) &&
    JSON.stringify(prevProps.pizzaState) === JSON.stringify(nextProps.pizzaState) &&
    prevProps.balance === nextProps.balance &&
    JSON.stringify(prevProps.productCart) === JSON.stringify(nextProps.productCart)
}

const ProductOptionSubOptionUI = React.memo((props) => {
  const {
    state,
    increment,
    decrement,
    balance,
    option,
    suboption,
    toggleSelect,
    changePosition,
    isSoldOut,
    setIsScrollAvailable,
    usePizzaValidation,
    pizzaState,
    changeQuantity
  } = props

  const maxByPosition = state.position === 'whole'
    ? suboption?.max
    : suboption?.max * 2

  const shouldApplyHalfLogic = option?.with_half_option && option?.allow_suboption_quantity && option?.limit_suboptions_by_max

  const wouldExceedMaxInWhole = shouldApplyHalfLogic && state.position === 'whole'
    ? (balance - state.quantity + (state.quantity + 1)) > option?.max
    : false

  const disableIncrement =
    option?.with_half_option
      ? shouldApplyHalfLogic
        ? state.quantity === maxByPosition || pizzaState?.[`option:${option?.id}`]?.value >= option?.max || wouldExceedMaxInWhole
        : pizzaState?.[`option:${option?.id}`]?.value >= option?.max
      : option?.limit_suboptions_by_max
        ? (balance === option?.max || state.quantity === suboption.max)
        : state.quantity === suboption?.max || (!state.selected && balance === option?.max)

  const disableExtraCheckbox = true
  const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [showMessage, setShowMessage] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const dirtyRef = useRef(null)

  const handleIncrement = (e) => {
    e.stopPropagation()
    increment()
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    decrement()
  }

  const handlePosition = (e, position) => {
    e.stopPropagation && e.stopPropagation()
    changePosition(position)
  }

  const handleSuboptionClick = () => {
    dirtyRef.current = true
    toggleSelect()
    const minMaxValidation = option?.with_half_option ? usePizzaValidation : (balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))
    if (!state.selected && minMaxValidation) {
      setShowMessage(true)
      setShowAlert(true)
    }
  }

  const handleChangeQuantity = (e, quantity) => {
    e.stopPropagation()
    changeQuantity(quantity)
  }

  useEffect(() => {
    const minMaxValidation = option?.with_half_option ? usePizzaValidation : (!state.selected && balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))
    if (!minMaxValidation) {
      setShowMessage(false)
    }
  }, [balance, pizzaState?.[`option:${option?.id}`]?.value])

  useEffect(() => {
    if (balance === option?.max && state?.selected && dirtyRef) {
      if (dirtyRef?.current !== null) {
        dirtyRef.current = false
        setIsScrollAvailable(true)
      }
    }
  }, [state?.selected])

  return (
    <>
      <Container onClick={() => handleSuboptionClick()}>
        <div className='option-container'>
          <LeftOptionContainer>
            {suboption.image && suboption.image !== '-' && (
              <SubOptionThumbnail src={suboption.image} />
            )}
            <div>
              <Text>
                <div>{suboption?.name}</div>
              </Text>
              <SuboptionPrice>
                {price > 0 && (
                  <>+ {parsePrice(price)}</>
                )}
              </SuboptionPrice>
            </div>
          </LeftOptionContainer>
          <RightOptionContainer>
              {
                option?.with_half_option && state?.selected && (
                  <PositionControl>
                    <div className={[
                      'reverse',
                      state.selected && state.position === 'left' ? 'selected' : null].filter(classname => classname).join(' ')}
                      onClick={(e) => handlePosition(e, 'left')}
                    >
                      <BsCircleHalf
                        className={[
                          'reverse',
                          state.selected && state.position === 'left' ? 'selected' : null].filter(classname => classname).join(' ')}
                      />
                      {t('LEFT_HALF', 'Left half')}
                    </div>
                    <div
                      className={[
                        state.selected && state.position === 'right' ? 'selected' : null].filter(classname => classname).join(' ')}
                      onClick={(e) => handlePosition(e, 'right')}
                    >
                      <BsCircleHalf
                        className={[
                          state.selected && state.position === 'right' ? 'selected' : null].filter(classname => classname).join(' ')}
                      />
                      {t('RIGHT_HALF', 'Right half')}
                    </div>
                    <div
                      className={[
                        'whole',
                        state.selected && state.position === 'whole' ? 'selected' : null].filter(classname => classname).join(' ')}
                        onClick={(e) => handlePosition(e, 'whole')}
                    >
                      <BsCircleFill
                        className={[
                          state.selected && state.position === 'whole' ? 'selected' : null].filter(classname => classname).join(' ')}
                      />
                        {t('WHOLE', 'Whole')}
                    </div>
                  </PositionControl>
                )
              }
            {!disableExtraCheckbox && option?.with_half_option && state?.selected && state.quantity > 0 && (
              <ExtraControl>
                {(state.quantity >= 2)
                  ? (<ExtraItem onClick={(e) => handleChangeQuantity(e, 1)}>
                      <Text><div>{t('EXTRA', 'Extra')}</div></Text> <MdCheckBox />
                    </ExtraItem>)
                  : (<ExtraItem
                      onClick={(e) => handleChangeQuantity(e, 2)}
                      className={(pizzaState?.[`option:${option?.id}`]?.value >= option?.max) && !(option?.max === 1 && option?.min === 1) ? 'disabled' : ''}
                    >
                      <Text><div>{t('EXTRA', 'Extra')}</div></Text> <MdCheckBoxOutlineBlank disabled />
                    </ExtraItem>)}
              </ExtraControl>
            )}
          </RightOptionContainer>
        </div>
        <div className='control-container'>

          {!(option?.max === 1 && option?.min === 1) && option?.allow_suboption_quantity && state?.selected && (
            <QuantityControl>
                <>
                  <BsDashCircle
                    disabled={state.quantity === 0 || isSoldOut}
                    onClick={handleDecrement}
                  />
                  {state.quantity}
                  <BsPlusCircle
                    disabled={disableIncrement || isSoldOut || usePizzaValidation}
                    onClick={handleIncrement}
                  />
                </>
            </QuantityControl>
          )}
          {((!state?.selected) || (state?.selected && !option?.allow_suboption_quantity) || (option?.max === 1 && option?.min === 1)) && (
            <IconControl>
              {((option?.min === 0 && option?.max === 1) || option?.max > 1)
                ? (state?.selected
                    ? <MdCheckBox />
                    : <MdCheckBoxOutlineBlank disabled />)
                : (state?.selected
                    ? <RiRadioButtonFill />
                    : <MdRadioButtonUnchecked disabled />
                  )
              }
            </IconControl>
          )}
        </div>
      </Container>
      {showMessage && (
        <Text noMargin>
          <span>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</span>
        </Text>
      )}
      <Alert
        title={t('PRODUCT_FORM', 'Product form')}
        content={`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}
        open={showAlert && showMessage}
        acceptText={t('ACCEPT', 'Accept')}
        onClose={() => setShowAlert(false)}
        onAccept={() => setShowAlert(false)}
        closeOnBackdrop={false}
      />
    </>
  )
}, ProductOptionSubOptionPropsAreEqual)

export const ProductOptionSubOption = (props) => {
  const productOptionSubOptionProps = {
    ...props,
    UIComponent: ProductOptionSubOptionUI,
    isOrigin: true
  }

  return (
    <ProductSubOptionController {...productOptionSubOptionProps} />
  )
}
