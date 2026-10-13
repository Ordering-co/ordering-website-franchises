import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import BsInfoCircle from '@meronex/icons/bs/BsInfoCircle'
import MdCloseCircle from '@meronex/icons/ios/MdCloseCircle'
import { TrophyFill } from 'react-bootstrap-icons'

import {
  CartContainer,
  OrderBill,
  CouponContainer,
  Spinner,
  CommentContainer,
  IconContainer,
  NoValidProductMessage,
  SpinnerCart,
  LineDivider,
  LoyaltyContainer,
  AddMoreProducts
} from './styles'

import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useEvent,
  useUtils,
  useConfig,
  useSite,
  useCustomer,
  useApi
} from '~components'

import {
  Button,
  Confirm,
  Modal,
  TextArea,
  SpinnerLoader,
  verifyDecimals,
  useWindowSize,
  ProductItemAccordion,
  CouponControl,
  ProductForm,
  UpsellingPage,
  CartStoresListing,
  ServiceForm,
  TaxInformation,
  capitalize
} from '~ui'

const CartFirstViewUI = (props) => {
  const {
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    onClickCheckout,
    isCheckout,
    useKioskApp,
    isCartPending,
    isCartPopover,
    isCustomMode,
    isStore,
    handleChangeComment,
    commentState,
    handleRemoveOfferClick,
    handleChangeCartView,
    cart: cartMulticart,
    hideDeliveryFee,
    hideDriverTip,
    hideCouponInput,
    loyaltyRewardRate,
    isCustomerMode,
    productLoading,
    setProductLoading,
    hideCommentsByValidationCheckout,
    hideDetails
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const [{ parsePrice, parseNumber }] = useUtils()
  const [{ configs }] = useConfig()
  const [{ site }] = useSite()
  const windowSize = useWindowSize()
  const [{ user }] = useCustomer()
  const [ordering] = useApi()
  const isArchiesColombia = String(ordering?.project || '').trim().toLowerCase() === 'archiescolombia'

  const [confirm, setConfirm] = useState({ open: false, content: null, handleOnAccept: null })
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState({})
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState({ open: false, tax: null })
  const [isUpselling, setIsUpselling] = useState(false)
  const [openChangeStore, setOpenChangeStore] = useState(false)

  const businessUrlTemplate = site?.business_url_template || '/store/:business_slug'

  const isCouponEnabled = false
  const isMultiCheckout = false
  const cart = cartMulticart || orderState?.carts?.[`businessId:${props.cart?.business_id}`]
  const viewString = isStore ? 'business_view' : 'header'
  const hideCartComments = true
  const hideCartDiscount = false
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'

  const extraValueAdjustment = cart?.metafields?.filter?.(meta => meta?.key?.includes('extra_value') && ![0, -0].includes(parseFloat(meta?.value)))
  const showSubtotalDivider = cart?.delivery_price > 0 ||
    (cart?.fees?.length > 0 && cart?.fees?.filter(fee => (!(fee.fixed === 0 && fee.percentage === 0) || (fee?.fee_id === null && fee?.type === 'product' && fee?.percentage > 0))).length > 0) ||
    (cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').length > 0) ||
    (cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 3)?.length > 0)
  const walletName = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet')
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet')
    }
  }

  const getIncludedTaxes = (isDeliveryFee, taxProperty = 'tax') => {
    if (cart?.taxes === null) {
      return cart?.business.tax_type === 1 ? cart?.[taxProperty] : 0
    } else {
      return cart?.taxes.reduce((taxIncluded, tax) => {
        return taxIncluded + (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') || (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.[taxProperty] : 0)
      }, 0)
    }
  }

  const clearAmount = (value) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))
  const loyaltyRewardValue = clearAmount((cart?.subtotal_with_discount + getIncludedTaxes(false, 'tax_after_discount')) * loyaltyRewardRate)

  const handleDeleteClick = (product) => {
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?'),
      handleOnAccept: () => {
        removeProduct(product, cart)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const handleEditProduct = (product) => {
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handleClickCheckout = (uuid) => {
    const cartsAvailable = Object.values(orderState?.carts)?.filter(cart => cart?.valid && cart?.status !== 2)
    if (cartsAvailable.length === 1 || !isMultiCheckout || !cart?.business_id) {
      events.emit('go_to_page', { page: 'checkout', params: { cartUuid: uuid } })
    } else {
      const groupKeys = {}
      cartsAvailable.forEach(_cart => {
        groupKeys[_cart?.group?.uuid]
          ? groupKeys[_cart?.group?.uuid] += 1
          : groupKeys[_cart?.group?.uuid ?? 'null'] = 1
      })

      if (
        (Object.keys(groupKeys).length === 1 && Object.keys(groupKeys)[0] === 'null') ||
        Object.keys(groupKeys).length > 1
      ) {
        events.emit('go_to_page', { page: 'multi_cart' })
      } else {
        events.emit('go_to_page', {
          page: 'multi_checkout',
          params: {
            cartUuid: cartsAvailable[0]?.group?.uuid
          }
        })
      }
    }
    events.emit('cart_popover_closed')
    onClickCheckout && onClickCheckout()
  }

  const handleStoreRedirect = (slug) => {
    if (isCustomerMode) {
      events.emit('go_to_page', { page: 'business', params: { store: slug } })
    } else {
      if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
        events.emit('go_to_page', { page: 'business', params: { business_slug: slug } })
      } else {
        events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${slug}` })
      }
    }

    if (windowSize.width <= 768) {
      onClickCheckout && onClickCheckout()
    }
  }

  useEffect(() => {
    events.emit('get_current_view')
    return () => {
      setConfirm({ ...confirm, open: false })
    }
  }, [])

  const handlerProductAction = (product) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
    }
  }

  const handleUpsellingPage = (goToCheckout) => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    if (goToCheckout) {
      handleClickCheckout()
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter(tax => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry, tax) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const onRemoveOffer = (id) => {
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?'),
      title: t('OFFER', 'Offer'),
      handleOnAccept: () => {
        setConfirm({ ...confirm, open: false })
        handleRemoveOfferClick(id, user?.id)
      }
    })
  }

  useEffect(() => {
    if (isCustomMode) setIsUpselling(true)
  }, [isCustomMode])

  return (
    <>
      {productLoading && (
        <SpinnerCart>
          <SpinnerLoader
            style={{ height: 100 }}
          />
        </SpinnerCart>
      )}
      <CartContainer className='cart'>
        <div>
          <div className='left-wrapper'>
            {cart?.products?.length > 0 && cart?.products.map(product => (
              <ProductItemAccordion
                key={product.code}
                isCartPending={isCartPending}
                isCartProduct
                isDisabledEdit={!cart?.business_id}
                product={product}
                isCheckout={isCheckout}
                toppingsRemoved={cart?.toppings_removed?.[product?.code]}
                changeQuantity={changeQuantity}
                getProductMax={getProductMax}
                offsetDisabled={offsetDisabled}
                onDeleteProduct={handleDeleteClick}
                onEditProduct={handleEditProduct}
                isStore={isStore}
                viewString={viewString}
                showArrowIcon
                isFirstCheckoutView
              />
            ))}
            {!cart?.valid_products && (
              <NoValidProductMessage>
                {t('REMOVE_NOT_AVAILABLE_CART_PRODUCTS', 'To continue with your checkout, please remove from your cart the products that are not available.')}
              </NoValidProductMessage>
            )}
            {(openUpselling || isUpselling) && (
              <UpsellingPage
                handleStoreRedirect={handleStoreRedirect}
                disableHorizontalScroll
                hideDivider
                title={t('RECOMMENDED_FOR_YOU', 'Recommended for you')}
                useKioskApp={useKioskApp}
                businessId={cart?.business_id}
                isCustomMode={isCustomMode}
                cartProducts={cart?.products}
                business={cart?.business}
                handleUpsellingPage={handleUpsellingPage}
                openUpselling={openUpselling}
                canOpenUpselling={canOpenUpselling}
                setCanOpenUpselling={setCanOpenUpselling}
              />
            )}
          </div>
        </div>
        <div className='right-container'>
          <div className='right-wrapper'>
            <h2>{t('MY_ORDER', 'My order')}</h2>
            {cart?.valid_products && !hideDetails && (
              <OrderBill isCheckout={isCheckout}>
                <table className='order-info'>
                  <tbody>
                    {isArchiesColombia
                      ? (
                        <>
                          <tr className={`${showSubtotalDivider ? 'add-divider' : ''}`}>
                            <td>{t('SUBTOTAL', 'Subtotal')}</td>
                            <td>{parsePrice(cart?.subtotal)}</td>
                          </tr>
                          {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
                            <tr>
                              {cart?.discount_type === 1
                                ? (
                                  <td>
                                    {t('DISCOUNT', 'Discount')}{' '}
                                    <span>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</span>
                                  </td>
                                  )
                                : (
                                  <td>{t('DISCOUNT', 'Discount')}</td>
                                  )}
                              <td>- {parsePrice(cart?.discount || 0)}</td>
                            </tr>
                          )}
                          {
                            cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 1)?.map(offer => (
                              <tr key={offer.id}>
                                <td className='icon'>
                                  {offer.name}
                                  {offer.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {
                            cart?.offers?.filter(offer => offer?.target === 1)?.length > 0 &&
                            cart?.subtotal_with_discount > 0 &&
                            cart?.discount > 0 &&
                            cart?.total >= 0 &&
                            (
                              <tr>
                                <td>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</td>
                                <td>{parsePrice(cart?.subtotal_with_discount ?? 0)}</td>
                              </tr>
                            )
                          }
                          {isStore && showSubtotalDivider && (
                            <tr>
                              <td><LineDivider /></td>
                            </tr>
                          )}
                          {cart?.taxes === null && cart?.business?.tax_type === 1 && !!cart?.tax && (
                            <tr>
                              <td>{t('TAX', 'Tax')}</td>
                              <td>{parsePrice(cart?.tax)}</td>
                            </tr>
                          )}
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 1 && tax?.target === 'product').map(tax => (
                              <tr key={`archies-tax1-prod-${tax?.id}`}>
                                <td className='icon'>
                                  {t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), tax?.name) || tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  {typeof tax?.rate === 'number' && tax?.rate !== 0 && (
                                    <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  )}
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map(tax => (
                              <tr key={`archies-tax2-prod-${tax?.id}`}>
                                <td className='icon'>
                                  {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 1 && tax?.target === 'delivery_fee').map(tax => (
                              <tr key={`archies-tax1-del-${tax?.id}`}>
                                <td className='icon'>
                                  {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  {typeof tax?.rate === 'number' && tax?.rate !== 0 && (
                                    <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  )}
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map(tax => (
                              <tr key={`archies-tax2-del-${tax?.id}`}>
                                <td className='icon'>
                                  {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.fees?.length > 0 && cart?.fees?.filter(fee => (!(fee.fixed === 0 && fee.percentage === 0) || (fee?.fee_id === null && fee?.type === 'product' && fee?.percentage > 0))).map((fee, i) => (
                              <tr key={`archies-fee-${fee.id ?? i}`}>
                                <td className='icon'>
                                  {t(fee?.name?.toUpperCase()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  {!(fee.fixed === 0 && fee.percentage === 0) && (
                                    <>
                                      ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`})
                                      <IconContainer onClick={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                                        <BsInfoCircle size='20' color={theme.colors.primary} />
                                      </IconContainer>
                                    </>
                                  )}
                                </td>
                                <td>{parsePrice(fee?.summary?.amount ?? (fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage)) ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 3)?.map(offer => (
                              <tr key={`archies-offer3-${offer.id}`}>
                                <td className='icon'>
                                  {t(offer?.name?.toUpperCase()?.replace(/ /g, '_'), offer?.name)}
                                  {offer?.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {orderState?.options?.type === 1 && cart?.delivery_price > 0 && !hideDeliveryFee && (
                            <tr>
                              <td>{t('DELIVERY_FEE', 'Delivery Fee')}</td>
                              <td>{parsePrice(cart?.delivery_price)}</td>
                            </tr>
                          )}
                          {cart?.extra_value_checkprice && cart?.extra_value_checkprice > 0 && (
                            <tr>
                              <td>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</td>
                              <td>{parsePrice(cart?.extra_value_checkprice)}</td>
                            </tr>
                          )}
                          {
                            !hideCartDiscount && cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 2)?.map(offer => (
                              <tr key={`archies-offer2-${offer.id}`}>
                                <td className='icon'>
                                  {offer.name}
                                  {offer?.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {cart?.driver_tip > 0 && !hideDriverTip && (
                            <tr>
                              <td>
                                {t('DRIVER_TIP', 'Driver tip')}{' '}
                                {cart?.driver_tip_rate > 0 &&
                                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                                  (
                                    <span>{`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`}</span>
                                  )}
                              </td>
                              <td>{parsePrice(cart?.driver_tip)}</td>
                            </tr>
                          )}
                          {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map(extra => (
                            <tr key={extra?.key}>
                              <td>
                                {t(extra?.key?.toUpperCase(), extra?.key)}{' '}
                              </td>
                              <td>{parseFloat(extra?.value) > 0 ? parsePrice(parseFloat(extra?.value)) : `- ${parsePrice(parseFloat(extra?.value) * -1)}`}</td>
                            </tr>
                          ))}
                        </>
                        )
                      : (
                        <>
                          <tr className={`${showSubtotalDivider ? 'add-divider' : ''}`}>
                            <td>{t('SUBTOTAL', 'Subtotal')}</td>
                            <td>{parsePrice(cart?.subtotal + getIncludedTaxes())}</td>
                          </tr>

                          {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
                            <tr>
                              {cart?.discount_type === 1
                                ? (
                                  <td>
                                    {t('DISCOUNT', 'Discount')}{' '}
                                    <span>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</span>
                                  </td>
                                  )
                                : (
                                  <td>{t('DISCOUNT', 'Discount')}</td>
                                  )}
                              <td>- {parsePrice(cart?.discount || 0)}</td>
                            </tr>
                          )}
                          {
                            cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 1)?.map(offer => (
                              <tr key={offer.id}>
                                <td className='icon'>
                                  {offer.name}
                                  {offer.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {
                            cart?.offers?.filter(offer => offer?.target === 1)?.length > 0 &&
                            cart?.subtotal_with_discount > 0 &&
                            cart?.discount > 0 &&
                            cart?.total >= 0 &&
                            (
                              <tr>
                                <td>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</td>
                                {cart?.business?.tax_type === 1
                                  ? (
                                    <td>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</td>
                                    )
                                  : (
                                    <td>{parsePrice(cart?.subtotal_with_discount ?? 0)}</td>
                                    )}
                              </tr>
                            )
                          }
                          {isStore && (
                            <tr>
                              <td><LineDivider /></td>
                            </tr>
                          )}
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map(tax => (
                              <tr key={tax?.id}>
                                <td className='icon'>
                                  {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.fees?.length > 0 && cart?.fees?.filter(fee => (!(fee.fixed === 0 && fee.percentage === 0) || (fee?.fee_id === null && fee?.type === 'product' && fee?.percentage > 0))).map((fee, i) => (
                              <tr key={fee.id ?? i}>
                                <td className='icon'>
                                  {t(fee?.name?.toUpperCase()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  {!(fee.fixed === 0 && fee.percentage === 0) && (
                                    <>
                                      ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`})
                                      <IconContainer onClick={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                                        <BsInfoCircle size='20' color={theme.colors.primary} />
                                      </IconContainer>
                                    </>
                                  )}
                                </td>
                                <td>{parsePrice(fee?.summary?.amount ?? (fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage)) ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 3)?.map(offer => (
                              <tr key={offer.id}>
                                <td className='icon'>
                                  {t(offer?.name?.toUpperCase()?.replace(/ /g, '_'), offer?.name)}
                                  {offer?.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {orderState?.options?.type === 1 && cart?.delivery_price > 0 && !hideDeliveryFee && (
                            <tr>
                              <td>{t('DELIVERY_FEE', 'Delivery Fee')}</td>
                              <td>{parsePrice(cart?.delivery_price + getIncludedTaxes(true))}</td>
                            </tr>
                          )}
                          {cart?.extra_value_checkprice && cart?.extra_value_checkprice > 0 && (
                            <tr>
                              <td>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</td>
                              <td>{parsePrice(cart?.extra_value_checkprice)}</td>
                            </tr>
                          )}
                          {
                            cart?.taxes?.length > 0 && cart?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map(tax => (
                              <tr key={tax?.id}>
                                <td className='icon'>
                                  {tax?.name ? t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(tax?.name?.replace(/_/g, ' ')?.toLowerCase())) : t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                                  <span>{`(${verifyDecimals(tax?.rate, parseNumber)}%)`}</span>
                                  <IconContainer onClick={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                                    <BsInfoCircle size='20' color={theme.colors.primary} />
                                  </IconContainer>
                                </td>
                                <td>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</td>
                              </tr>
                            ))
                          }
                          {
                            !hideCartDiscount && cart?.offers?.length > 0 && cart?.offers?.filter(offer => offer?.target === 2)?.map(offer => (
                              <tr key={offer.id}>
                                <td className='icon'>
                                  {offer.name}
                                  {offer?.rate_type === 1 && (
                                    <span>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</span>
                                  )}
                                  <IconContainer>
                                    <BsInfoCircle size='20' color={theme.colors.primary} onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })} />
                                    {!!offer?.id && (
                                      <MdCloseCircle size='24' color={theme.colors.primary} onClick={() => onRemoveOffer(offer?.id)} />
                                    )}
                                  </IconContainer>
                                </td>
                                <td>
                                  - {parsePrice(offer?.summary?.discount)}
                                </td>
                              </tr>
                            ))
                          }
                          {cart?.driver_tip > 0 && !hideDriverTip && (
                            <tr>
                              <td>
                                {t('DRIVER_TIP', 'Driver tip')}{' '}
                                {cart?.driver_tip_rate > 0 &&
                                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                                  (
                                    <span>{`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`}</span>
                                  )}
                              </td>
                              <td>{parsePrice(cart?.driver_tip)}</td>
                            </tr>
                          )}
                          {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map(extra => (
                            <tr key={extra?.key}>
                              <td>
                                {t(extra?.key?.toUpperCase(), extra?.key)}{' '}
                              </td>
                              <td>{parseFloat(extra?.value) > 0 ? parsePrice(parseFloat(extra?.value)) : `- ${parsePrice(parseFloat(extra?.value) * -1)}`}</td>
                            </tr>
                          ))}
                        </>
                        )}
                  </tbody>
                </table>
                {isCouponEnabled && !isCartPending &&
                  ((isCheckout || isCartPopover || isMultiCheckout) &&
                    !(isCheckout && isCartPopover)) && !hideCartDiscount && !hideCouponInput &&
                  (
                    <CouponContainer>
                      <CouponControl
                        businessId={cart?.business_id}
                        price={cart?.total}
                        cart={cart}
                      />
                    </CouponContainer>
                  )}
                <table className='total'>
                  <tbody>
                    <tr>
                      <td>{t('TOTAL', 'Total')}</td>
                      <td>{parsePrice(cart?.total >= 0 ? cart?.total : 0)}</td>
                    </tr>
                  </tbody>
                </table>
                {cart?.status !== 2 && !hideCartComments && !hideCommentsByValidationCheckout && (
                  <table className='comments'>
                    <tbody>
                      <tr>
                        <td>{t('COMMENTS', 'Comments')}</td>
                      </tr>
                      <tr>
                        <CommentContainer>
                          <TextArea
                            defaultValue={cart?.comment}
                            placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                            onChange={(e) => handleChangeComment(e.target.value, user?.id)}
                          />
                          {commentState?.loading && (
                            <Spinner>
                              <SpinnerLoader
                                style={{ height: 100 }}
                              />
                            </Spinner>
                          )}
                        </CommentContainer>
                      </tr>
                    </tbody>
                  </table>
                )}

                {cart?.payment_events?.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: 10
                    }}
                  >
                    {cart?.payment_events?.map(event => (
                      <div
                        key={event.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 10
                        }}
                      >
                        <span>
                          {walletName[cart?.wallets?.find(wallet => wallet.id === event.wallet_id)?.type]?.name}
                        </span>
                        <span>
                          -{parsePrice(event.amount, { isTruncable: true })}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10
                      }}
                    >
                      <span
                        style={{ fontWeight: 'bold' }}
                      >
                        {t('TOTAL_TO_PAY', 'Total to pay')}
                      </span>
                      <span
                        style={{ fontWeight: 'bold' }}
                      >
                        {parsePrice(cart?.balance)}
                      </span>
                    </div>
                  </div>
                )}
              </OrderBill>
            )}

            <AddMoreProducts>
              {cart?.business?.slug && (
                <Button
                  className='add'
                  onClick={() => cart?.business?.slug && handleStoreRedirect && handleStoreRedirect(cart?.business?.slug)}
                >
                  {t('ADD_ITEMS', 'Add items')}
                </Button>
              )}
              <Button
                color='primary'
                onClick={() => handleChangeCartView && handleChangeCartView()}
              >
                {t('CHECKOUT', 'Checkout')}
              </Button>
            </AddMoreProducts>
            {!isDisabledRewards && !!loyaltyRewardValue && isFinite(loyaltyRewardValue) && isCheckout && (
              <LoyaltyContainer>
                <div className='icon'>
                  <TrophyFill />
                </div>
                <div>
                  <span>
                    {t('RECEIVE_LOYALTY_POINT', 'You could receive :amount: points for this purchase.')
                      .split(':amount:')[0]}
                    <span className='red'>{loyaltyRewardValue}</span>
                    {t('RECEIVE_LOYALTY_POINT', 'You could receive :amount: points for this purchase.')
                      .split(':amount:')[1]}
                  </span>
                </div>
              </LoyaltyContainer>
            )}
            <Confirm
              title={t('PRODUCT', 'Product')}
              content={confirm.content}
              acceptText={t('ACCEPT', 'Accept')}
              open={confirm.open}
              onClose={() => setConfirm({ ...confirm, open: false })}
              onCancel={() => setConfirm({ ...confirm, open: false })}
              onAccept={confirm.handleOnAccept}
              closeOnBackdrop={false}
            />
            {openProduct && (
              <Modal
                width='900px'
                open={openProduct}
                padding='0'
                closeOnBackdrop
                onClose={() => setModalIsOpen(false)}
                disableOverflowX
                isProductForm
                hideCloseDefault
              >
                {!curProduct?.calendar_event
                  ? (
                    <ProductForm
                      isCartProduct
                      productCart={curProduct}
                      businessSlug={cart?.business?.slug}
                      businessId={cart?.business_id}
                      categoryId={curProduct?.category_id}
                      productId={curProduct?.id}
                      onSave={handlerProductAction}
                      viewString={viewString}
                      setProductLoading={setProductLoading}
                      closeModalProductForm={() => setModalIsOpen(false)}
                      isHideShare
                    />
                    )
                  : (
                    <ServiceForm
                      isCartProduct
                      isService
                      productCart={curProduct}
                      businessSlug={cart?.business?.slug}
                      businessId={cart?.business_id}
                      categoryId={curProduct?.category_id}
                      productId={curProduct?.id}
                      onSave={handlerProductAction}
                      professionalSelected={curProduct?.calendar_event?.professional}
                      setProductLoading={setProductLoading}
                    />
                    )}
              </Modal>
            )}
            {openTaxModal.open && (
              <Modal
                width='70%'
                open={openTaxModal.open}
                padding='20px'
                closeOnBackdrop
                title={`${openTaxModal?.data?.name
                  ? t(openTaxModal?.data?.name?.toUpperCase()?.replace(/ /g, '_'), capitalize(openTaxModal?.data?.name?.replace(/_/g, ' ')?.toLowerCase()))
                  : (t('INHERIT_FROM_BUSINESS', 'Inherit from business'))} ${openTaxModal.data?.rate_type !== 2 ? `(${typeof openTaxModal.data?.rate === 'number' ? `${openTaxModal.data?.rate}%` : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})` : ''}  `}
                onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
                modalTitleStyle={{ display: 'flex', justifyContent: 'center' }}
              >
                <TaxInformation
                  type={openTaxModal.type}
                  data={openTaxModal.data}
                  products={cart?.products}
                  useKioskApp={useKioskApp}
                />
              </Modal>
            )}
          </div>
        </div>

        {openChangeStore && (
          <Modal
            width='70%'
            title={t('CHANGE_STORE', 'Change store')}
            open={openChangeStore}
            padding='20px'
            closeOnBackdrop
            modalTitleStyle={{ display: 'flex', justifyContent: 'center' }}
            onClose={() => setOpenChangeStore(false)}
          >
            <CartStoresListing
              isStore={isStore}
              pageChangeStore='business'
              cartuuid={cart?.uuid}
              onClose={() => setOpenChangeStore(false)}
              handleCustomStoreRedirect={handleStoreRedirect}
            />
          </Modal>
        )}
      </CartContainer>
    </>
  )
}

export const CartFirstView = (props) => {
  const cartProps = {
    ...props,
    UIComponent: CartFirstViewUI
  }

  return (
    <CartController {...cartProps} />
  )
}
