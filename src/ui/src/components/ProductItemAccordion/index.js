import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Pencil, Trash } from 'react-bootstrap-icons'
import IosArrowDown from '@meronex/icons/ios/IosArrowDown'

import {
  AccordionSection,
  Accordion,
  WrapperProductImage,
  ProductImage,
  ContentInfo,
  ProductComment,
  ProductInfo,
  ProductError,
  ProductActions,
  ProductActionsEdit,
  ProductActionsDelete,
  ProductNotAvailable,
  ProductOptionsList,
  ProductQuantity,
  ProductSelectWrapper,
  ScheduleInfoWrapper,
  ScheduleInfo,
  ProductInfoQuantity,
  Price,
  ProductContentInfo,
  AccordionContent,
  ProductInfoContainer,
  ProductInfoWrapper,
  ProductContainer
} from './styles'

import {
  ProductItemAccordion as ProductItemAccordionController,
  useUtils,
  useLanguage,
  useOrder,
  useConfig
} from '~components'

import BsPlusCircle from '@meronex/icons/bs/BsPlusCircle'
import BsDashCircle from '@meronex/icons/bs/BsDashCircle'

const ProductItemAccordionUI = (props) => {
  const {
    isDisabledEdit,
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    isCheckout,
    isStore,
    isConfirmationPage,
    toppingsRemoved,
    productInfo,
    isOrderDetails,
    isFirstCheckoutView,
    isOrderSummary,
    showPriceInOrderSummary,
    orderCompleted
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice, parseDate }] = useUtils()
  const [{ configs }] = useConfig()
  const [setActive, setActiveState] = useState('')
  const [setHeight, setHeightState] = useState('0px')
  const [setRotate, setRotateState] = useState('accordion__icon')

  const content = useRef(null)
  const productSelect = useRef(null)
  const productActionsEdit = useRef(null)
  const productActionsDelete = useRef(null)

  const viewString = isConfirmationPage ? 'confirmation' : isStore ? 'business_view' : 'header'
  const showProductImage = !theme?.[viewString]?.components?.cart?.components?.products?.components?.image?.hidden
  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden

  const showArrowIcon = props.showArrowIcon && (productInfo?.ingredients?.length > 0 || productInfo?.options?.length > 0 || product?.comment)

  const toggleAccordion = (e) => {
    const isActionsClick = productSelect?.current?.contains(e?.target) || productActionsEdit?.current?.contains(e?.target) || productActionsDelete?.current?.contains(e?.target)
    if ((!product?.valid_menu && isCartProduct) || isActionsClick || isOrderDetails) return
    setActiveState(setActive === '' ? 'active' : '')
    setHeightState(
      setActive === 'active' ? '0px' : `${content.current.scrollHeight}px`
    )
    setRotateState(
      setActive === 'active' ? 'accordion__icon' : 'accordion__icon rotate'
    )
  }

  const handleIncrement = () => {
    changeQuantity(product, product?.quantity + 1)
  }

  const handleDecrement = () => {
    changeQuantity(product, product?.quantity - 1)
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  useEffect(() => {
    if (setActive === 'active') {
      setHeightState(
        `${content.current.scrollHeight}px`
      )
    }
  }, [product, setActive])

  useEffect(() => {
    if (!isOrderSummary) return
    toggleAccordion(null)
  }, [isOrderSummary])

  return (
    <>
      {isFirstCheckoutView && (
        <ProductContainer isCheckout={isCheckout}>
          <ProductInfoWrapper isValid={product?.valid ?? true}>
            <div className='left-product-info'>
              <div className='content-info'>
                <h3>{product.name}</h3>
                <div className='product-info-content'>
                  <div className='product-options'>
                    <span>{product.description}</span>
                    {productInfo.ingredients.length > 0 && productInfo.ingredients.some(ingredient => !ingredient.selected) && (
                      <div className='ingredients'>
                        <p>{t('INGREDIENTS', 'Ingredients')}</p>
                        {productInfo.ingredients.map(ingredient => !ingredient.selected && (
                          <li className='ingredient' key={ingredient.id}>
                            <span>{t('NO', 'No')} {ingredient.name}</span>
                          </li>
                        ))}
                      </div>
                    )}
                    {productInfo.options.length > 0 && (
                      <ProductOptionsList>
                        {productInfo.options.map(option => (
                          <li key={option.id}>
                            <p>{option.name}</p>
                            <ProductOptionsList className='suboption'>
                              {option?.suboptions?.sort((a, b) => a.rank - b.rank).map(suboption => (
                                <div key={suboption.id}>
                                  <span>
                                    {getFormattedSubOptionName({
                                      quantity: suboption.quantity,
                                      name: suboption.name,
                                      position: (suboption?.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                                      price: (['left', 'right'].includes(suboption.position)) ? parsePrice(suboption.half_price ?? suboption.price) : parsePrice(suboption.price)
                                    })}
                                  </span>
                                </div>
                              ))}
                            </ProductOptionsList>
                          </li>
                        ))}
                      </ProductOptionsList>
                    )}
                    {toppingsRemoved?.removed?.length > 0 && (
                      <ProductOptionsList>
                        <li>
                          <p>{t('TOPPINGS_REMOVED', 'Toppings removed')}</p>
                          <ProductOptionsList className='suboption'>
                            {toppingsRemoved?.removed.map(topping => (
                              <div key={topping.code}>
                                <span>{topping.name}</span>
                              </div>
                            ))}
                          </ProductOptionsList>
                        </li>
                      </ProductOptionsList>
                    )}
                    {product.comment && (
                      <ProductComment>
                        <p>{t('SPECIAL_COMMENT', 'Special Comment')}</p>
                        <h3>{product.comment}</h3>
                      </ProductComment>
                    )}
                  </div>
                </div>
                <div className='price'>
                  <p>{parsePrice(product.total || product.price)}</p>
                  <div>
                    {!isDisabledEdit && onEditProduct && !isCartPending && (
                      <span ref={productActionsEdit}>
                        <Pencil className='pencil' onClick={() => onEditProduct(product)} />
                      </span>
                    )}
                    <span ref={productActionsDelete}>
                      <Trash className='trash' onClick={() => onDeleteProduct(product)} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && showProductImage && (
                <div className='wrapper-product-image'>
                  <ProductImage bgimage={product?.images || theme?.images?.dummies?.product} />
                </div>
              )}
            </div>
          </ProductInfoWrapper>
        </ProductContainer>
      )}
      {!isFirstCheckoutView && (
        <AccordionSection isCheckout={isCheckout} isOrderDetails={isOrderDetails}>

            <ProductInfo className='info' isValid={product?.valid ?? true}>

              {product?.calendar_event
                ? (
                  <>
                    {(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && showProductImage && (
                      <WrapperProductImage>
                        <ProductImage bgimage={product?.images || theme?.images?.dummies?.product} />
                      </WrapperProductImage>
                    )}
                    <ScheduleInfoWrapper>
                      <h3>{product.name}</h3>
                      <ScheduleInfo>
                        <span>
                          {parseDate(product?.calendar_event?.start, { outputFormat: (configs?.format_time?.value === '12') ? 'hh:mm a' : 'HH:mm' })}
                          {' '}-{' '}
                          {parseDate(product?.calendar_event?.end, { outputFormat: (configs?.format_time?.value === '12') ? 'hh:mm a' : 'HH:mm' })}
                        </span>
                      </ScheduleInfo>
                    </ScheduleInfoWrapper>
                  </>
                  )
                : (
                  <ProductInfoContainer center={isOrderDetails} orderCompleted={orderCompleted}>
                    <div className='info-product'>
                      {isOrderDetails && (
                        <ProductQuantity className='product-quantity'>
                          {product?.quantity}
                        </ProductQuantity>
                      )}
                      {!isOrderSummary && (product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && showProductImage && (
                        <WrapperProductImage>
                          <ProductImage bgimage={product?.images || theme?.images?.dummies?.product} />
                        </WrapperProductImage>
                      )}
                      <ContentInfo>
                        <div>
                          <Accordion
                            className={`product accordion ${setActive}`}
                            onClick={(e) => toggleAccordion(e)}
                          >
                            <ProductContentInfo activeAccordion={setActive === 'active'} isOrderSummary={isOrderSummary}>
                              <h3 className='title'>{product.name}</h3>
                              <span>{product.description}</span>
                              <AccordionContent
                                className='accordion-content'
                                ref={content}
                                style={{ maxHeight: `${setHeight}` }}
                              >
                                {productInfo.ingredients.length > 0 && productInfo.ingredients.some(ingredient => !ingredient.selected) && (
                                  <ProductOptionsList>
                                    <p>{t('INGREDIENTS', 'Ingredients')}</p>
                                    {productInfo.ingredients.map(ingredient => !ingredient.selected && (
                                      <li className='ingredient' key={ingredient.id}>
                                        <span>{t('NO', 'No')} {ingredient.name}</span>
                                      </li>
                                    ))}
                                  </ProductOptionsList>
                                )}
                                {productInfo.options.length > 0 && (
                                  <ProductOptionsList>
                                    {productInfo.options.map(option => (
                                      <li key={option.id}>
                                        <p>{option.name}</p>
                                        <ProductOptionsList className='suboption'>
                                          {option?.suboptions?.sort((a, b) => a.rank - b.rank).map(suboption => (
                                            <div key={suboption.id}>
                                              <span>
                                                {getFormattedSubOptionName({
                                                  quantity: suboption.quantity,
                                                  name: suboption.name,
                                                  position: (suboption?.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                                                  price: (['left', 'right'].includes(suboption.position)) ? parsePrice(suboption.half_price ?? suboption.price) : parsePrice(suboption.price)
                                                })}
                                              </span>
                                            </div>
                                          ))}
                                        </ProductOptionsList>
                                      </li>
                                    ))}
                                  </ProductOptionsList>
                                )}
                                {toppingsRemoved?.removed?.length > 0 && (
                                  <ProductOptionsList>
                                    <li>
                                      <p>{t('TOPPINGS_REMOVED', 'Toppings removed')}</p>
                                      <ProductOptionsList className='suboption'>
                                        {toppingsRemoved?.removed.map(topping => (
                                          <div key={topping.code}>
                                            <span>{topping.name}</span>
                                          </div>
                                        ))}
                                      </ProductOptionsList>
                                    </li>
                                  </ProductOptionsList>
                                )}
                                {product.comment && (
                                  <ProductComment>
                                    <p>{t('SPECIAL_COMMENT', 'Special Comment')}</p>
                                    <h3>{product.comment}</h3>
                                  </ProductComment>
                                )}
                              </AccordionContent>
                            </ProductContentInfo>
                            {!isOrderSummary && showArrowIcon && <IosArrowDown className={`${setRotate}`} />}
                          </Accordion>
                        </div>
                      </ContentInfo>
                      <ProductInfoQuantity $isOrderDetails={isOrderDetails}>
                        {!isOrderSummary && onDeleteProduct && product?.quantity === 1 && (
                          <span ref={productActionsDelete}>
                            <Trash className='trash' onClick={() => onDeleteProduct(product)} />
                          </span>
                        )}
                        {!isOrderSummary && !isDisabledEdit && isCartProduct && !isCartPending && getProductMax
                          ? (
                            <>
                              <ProductSelectWrapper>
                                {product?.quantity > 1 && (
                                  <BsDashCircle
                                    onClick={handleDecrement}
                                  />
                                )}
                              </ProductSelectWrapper>
                              <ProductQuantity>
                                {product?.quantity}
                              </ProductQuantity>
                              <ProductSelectWrapper>
                                <BsPlusCircle
                                  onClick={handleIncrement}
                                />
                              </ProductSelectWrapper>
                            </>
                            )
                          : !isOrderSummary && (
                              <ProductQuantity>
                                {product?.quantity}
                              </ProductQuantity>
                            )
                          }
                      </ProductInfoQuantity>
                      {isOrderDetails && (
                        <Price orderCompleted={orderCompleted}>
                          <p>{parsePrice(product.total || product.price)}</p>
                        </Price>
                      )}
                    </div>
                    <Price>
                      {(!isOrderSummary || showPriceInOrderSummary) && (
                        <p>{parsePrice(product.total || product.price)}</p>
                      )}
                    </Price>
                  </ProductInfoContainer>
                  )}
            </ProductInfo>

            {isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity && (
              <ProductError>
                <ProductActions>
                  {!isDisabledEdit && (
                    <ProductActionsEdit
                      ref={productActionsEdit}
                      onClick={() => onEditProduct(product)}
                      disabled={orderState.loading}
                    >
                      <Pencil className='pencil' />
                    </ProductActionsEdit>
                  )}
                  {onDeleteProduct && (
                    <ProductActionsDelete
                      ref={productActionsDelete}
                      onClick={() => onDeleteProduct(product)}
                      disabled={orderState.loading}
                    >
                      <Trash className='trash' />
                    </ProductActionsDelete>
                  )}
                </ProductActions>
                <ProductNotAvailable>
                  {t('NOT_AVAILABLE', 'Not available')}
                </ProductNotAvailable>
              </ProductError>
            )}

            {!product?.valid_menu && isCartProduct && !isCartPending && (
              <ProductError isStore={isStore}>
                <ProductActions>
                </ProductActions>
                <ProductNotAvailable>
                  {t('NOT_AVAILABLE', 'Not available')}
                </ProductNotAvailable>
              </ProductError>
            )}

        </AccordionSection>
      )}
    </>
  )
}

export const ProductItemAccordion = (props) => {
  const productItemAccordion = {
    ...props,
    UIComponent: ProductItemAccordionUI
  }
  return (
    <ProductItemAccordionController {...productItemAccordion} />
  )
}
