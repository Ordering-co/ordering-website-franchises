import React, { useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import { Heart as DisLike, HeartFill as Like, Plus } from 'react-bootstrap-icons'

import {
  CardContainer,
  CardInfo,
  WrapLogo,
  CardLogo,
  SoldOut,
  PriceWrapper,
  QuantityContainer,
  RibbonBox,
  TitleWrapper,
  LastOrder
} from './styles'

import { useLanguage, useConfig, useOrder, useUtils, useSession, SingleProductCard as SingleProductCardController } from '~components'

import {
  Button,
  Alert,
  shape,
  useIntersectionObserver,
  Modal,
  LoginForm,
  SignUpForm,
  ForgotPasswordForm
} from '~ui'

const singleProductCardPropsAreEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product) &&
    prevProps.isSkeleton === nextProps.isSkeleton &&
    prevProps.isSoldOut === nextProps.isSoldOut &&
    prevProps.isCartOnProductsList === nextProps.isCartOnProductsList &&
    prevProps.productAddedToCartLength === nextProps.productAddedToCartLength
}

const SingleProductCardUI = React.memo((props) => {
  const {
    product,
    isSoldOut,
    isSkeleton,
    onProductClick,
    isCartOnProductsList,
    useCustomFunctionality,
    onCustomClick,
    customText,
    customStyle,
    useKioskApp,
    productAddedToCartLength,
    handleFavoriteProduct,
    isFavorite,
    isPreviously,
    fromOrders,
    viewString,
    isCustomerMode,
    minHeight,
    showFirstCategories
  } = props

  const [, t] = useLanguage()
  const [$element, isObserved] = useIntersectionObserver()
  const [stateConfig] = useConfig()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()
  const [orderState] = useOrder()
  const [{ auth }, { login }] = useSession()
  const theme = useTheme()
  const favoriteRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const [alertState, setAlertState] = useState({ open: false, content: [] })

  const editMode = typeof product?.code !== 'undefined'
  const isObservedValidation = isObserved || useKioskApp

  const removeToBalance = editMode ? product?.quantity : 0

  const cartProducts = Object.values(orderState.carts).reduce((products, _cart) => [...products, ..._cart?.products], [])
  const productBalance = cartProducts.reduce((sum, _product) => sum + (_product.id === product?.id ? _product.quantity : 0), 0)

  const totalBalance = (productBalance || 0) - removeToBalance

  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance
  const hideAddButton = !!theme?.business_view?.components?.products?.components?.add_to_cart_button?.hidden || isPreviously || isFavorite || fromOrders
  const hideProductDescription = theme?.business_view?.components?.products?.components?.product?.components?.description?.hidden
  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
  const hideProductLogo = viewString
    ? theme?.[viewString]?.components?.cart?.components?.products?.image?.hidden
    : theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden
  const hideFavoriteIcon = theme?.business_view?.components?.products?.components?.product?.components?.favorite?.hidden

  // const productsRows = theme?.layouts?.business_view?.components?.products?.components?.layout?.rows

  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - totalBalance
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig

  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory)

  const handleClickProduct = (e) => {
    if (favoriteRef?.current?.contains(e.target)) return
    if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
      setAlertState({
        open: true,
        content: [t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order')]
      })
      return
    }

    if (isFavorite) {
      onProductClick && onProductClick()
      return
    }
    (!isSkeleton && !useCustomFunctionality && onProductClick && onProductClick(product, product?.business?.slug)) ||
      (useCustomFunctionality && onCustomClick && onCustomClick())
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProduct && handleFavoriteProduct(!product?.favorite)
    } else {
      setModalPageToShow('login')
      setIsModalOpen(true)
    }
  }

  const closeAuthModal = () => {
    setIsModalOpen(false)
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  return (
    <>
      <CardContainer
        ref={$element}
        soldOut={isSoldOut || maxProductQuantity <= 0}
        onClick={handleClickProduct}
        isCartOnProductsList={isCartOnProductsList}
        style={useCustomFunctionality && customStyle}
        className='product-card'
        isShowAddButt={!useCustomFunctionality && !hideAddButton && !isSkeleton}
        isImageRight
        showFirstCategories={showFirstCategories}
      >
        {isObservedValidation && (
          <div>
            {!useCustomFunctionality && (
              <>
                {!isSkeleton && productAddedToCartLength > 0 && (
                  <QuantityContainer>
                    <span>{productAddedToCartLength}</span>
                  </QuantityContainer>
                )}
                {!showFirstCategories && (
                  <CardInfo
                    isFavorite={isFavorite}
                    minHeight={minHeight}
                    soldOut={isSoldOut || maxProductQuantity <= 0}
                    isBgimage={optimizeImage(product?.images || theme?.images?.dummies?.product, 'h_86,c_limit')}
                    oneLine={isPreviously}
                  >
                    <TitleWrapper isFavorite={isFavorite}>
                      {!isSkeleton
                        ? <div className='title-description'>
                            <div className={`${isFavorite ? 'wrapper-title' : ''}`}>
                              <h1>{product?.name}</h1>
                              {(isFavorite || (!useKioskApp && !isPreviously && isCustomerMode && !hideFavoriteIcon)) && (
                                !isSkeleton
                                  ? (
                                    <span onClick={() => handleChangeFavorite()} ref={favoriteRef}>
                                      {product?.favorite ? <Like /> : <DisLike />}
                                    </span>
                                    )
                                  : (<Skeleton className='favorite' width={16} height={16} />)
                              )}
                            </div>
                            {!hideProductDescription && (
                              <p>{product?.description}</p>
                            )}
                          </div>
                        : <Skeleton width={200} />}
                    </TitleWrapper>
                    {isPreviously && (!isSkeleton ? (<LastOrder>{t('LAST_ORDERED_ON', 'Last ordered on')} {parseDate(product?.last_ordered_date, { outputFormat: 'MMM DD, YYYY' })}</LastOrder>) : (<Skeleton width={80} />))}
                  </CardInfo>
                )}
                {!isSkeleton
                  ? (<WrapLogo
                      showFirstCategories={showFirstCategories}
                      isFavorite={isFavorite}
                      minHeight={minHeight}
                      isBgimage={optimizeImage(!hideProductLogo ? product?.images || theme?.images?.dummies?.product : '', 'h_86,c_limit')}
                    >
                      {product?.ribbon?.enabled && (
                        <RibbonBox
                          bgColor={product?.ribbon?.color}
                          isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
                          isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
                          productAddedToCartLength={productAddedToCartLength}
                        >
                          {product?.ribbon?.text}
                        </RibbonBox>
                      )}
                      <CardLogo
                        className='image'
                        soldOut={isSoldOut || maxProductQuantity <= 0}
                        bgimage={optimizeImage(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product), 'h_86,c_limit')}
                        showFirstCategories={showFirstCategories}
                      />
                    </WrapLogo>)
                  : <Skeleton height={120} width={120} />}
                {(isSoldOut || maxProductQuantity <= 0) && (
                  <SoldOut isBottom={product?.ribbon?.enabled}>{t('SOLD_OUT', 'Sold out')}</SoldOut>
                )}
              </>
            )}
            {useCustomFunctionality && customText && (
              <span style={{ fontSize: 16, fontWeight: 500 }}>{customText}</span>
            )}
          </div>
        )}

        {!showFirstCategories && !useCustomFunctionality && !isSkeleton && (
          <div className='wrapper-price-add'>
            {!isSkeleton
              ? (<PriceWrapper isOffPrice={product?.offer_price && product?.in_offer}>
                  <span className='current-price'>{product?.price ? parsePrice(product?.price) : ''}</span>
                  {!(isSoldOut || maxProductQuantity <= 0) && (
                    <span className='off-price'>{product?.offer_price && product?.in_offer ? parsePrice(product?.offer_price) : ''}</span>
                  )}
                </PriceWrapper>)
              : <Skeleton width={100} />
            }
            {!hideAddButton && (
              <Button outline color='primary' disabled={productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order}>
                {t('ADD', 'Add')}
              </Button>
            )}
          </div>
        )}
        {showFirstCategories && !useCustomFunctionality && (
          <div className='title-add-icon'>
            {!isSkeleton && isObservedValidation
              ? (
                <>
                  <h1>{product?.name}</h1>
                  <Plus />
                </>)
              : <Skeleton width={200} />}
          </div>
        )}
      </CardContainer>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onRemove={() => closeAuthModal()}
          onClose={() => closeAuthModal()}
          width='50%'
          authModal
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'signup' })
                  } href='#'
                >{t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
                  } href='#'
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset Password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {modalPageToShow === 'signup' && (
            <SignUpForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              useLoginByCellphone
              useChekoutFileds
              handleSuccessSignup={handleSuccessSignup}
              isPopup
              closeModal={() => closeAuthModal()}
            />
          )}
          {modalPageToShow === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
      <Alert
        title={t('PRODUCT', 'Product')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </>
  )
}, singleProductCardPropsAreEqual)

export const SingleProductCard = (props) => {
  const singleProductCardProps = {
    ...props,
    UIComponent: SingleProductCardUI
  }
  return <SingleProductCardController {...singleProductCardProps} />
}
