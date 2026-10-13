import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import MdClose from '@meronex/icons/md/MdClose'
import Skeleton from 'react-loading-skeleton'
import {
  Container,
  UpsellingContainer,

  CloseUpselling,
  SkeletonContainer,
  HorizontalUpsellingContainer,
  HorizontalItem,
  HorizontalImage,
  HorizontalDetails,
  WrapAutoScroll,
  UpsellingPageTitleWrapper,
  Divider,
  EmptyCart,
  SubtitleContainer,
  OrderBillContainer,
  OrderDetailsTitle,
  CheckProductsContainer,
  UpsellingTitle,
  ButtonWrapper
} from './styles'

import { UpsellingPage as UpsellingPageController, useLanguage, useUtils } from '~components'

import {
  Button,
  Modal,
  AutoScroll,
  ProductForm,
  Cart,
  SingleProductCard
} from '~ui'
import { Cart3 } from 'react-bootstrap-icons'

const UpsellingPageUI = (props) => {
  const {
    title,
    upsellingProducts,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling,
    business,
    isCustomMode,
    currentCart,
    productLoading,
    isCartOnProductsList,
    handleCartOpen,
    showCancelButton,
    hideDivider,
    disableHorizontalScroll,
    handleStoreRedirect
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const theme = useTheme()

  const [actualProduct, setActualProduct] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [showUpselling, setShowUpSelling] = useState(false)

  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden

  useEffect(() => {
    if (!isCustomMode) {
      setCanOpenUpselling && setCanOpenUpselling(true)
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  useEffect(() => {
    if (upsellingProducts?.products.length > 0) setShowUpSelling(true)
    else setShowUpSelling(false)
  }, [upsellingProducts?.products.length])

  const handleFormProduct = (product) => {
    setActualProduct(product)
    setModalIsOpen(true)
  }

  const handleSaveProduct = () => {
    setActualProduct(null)
    setModalIsOpen(false)
  }

  const UpsellingLayout = () => {
    return (
      <Container>
        <UpsellingContainer>
          {
            !upsellingProducts.loading && (
              <>
                {
                  (!upsellingProducts.error && upsellingProducts.products?.length > 0)
                    ? upsellingProducts.products.map((product, i) => (
                      <SingleProductCard
                        key={'prod_' + product.id + `_${i}`}
                        isSoldOut={product.inventoried && !product.quantity}
                        product={product}
                        businessId={business?.id}
                        productsList={upsellingProducts.products}
                        onProductClick={() => handleFormProduct(product)}
                      // handleUpdateProducts={handleUpdateProducts}
                      // navigation={navigation}
                      />
                    ))
                    : (
                      <h4>
                        {upsellingProducts.message}
                      </h4>
                      )
                }
              </>
            )
          }
        </UpsellingContainer>
      </Container>
    )
  }

  return (
    <>
      {isCustomMode
        ? (
            showUpselling
              ? (
              <>
                {!hideDivider && (<Divider />)}
                <UpsellingPageTitleWrapper>
                  <p>{title || t('UPSELLING_QUESTION', 'Do you want something else?')}</p>
                  {!showCancelButton && (<MdClose onClick={() => setShowUpSelling(false)} />)}
                </UpsellingPageTitleWrapper>
                <WrapAutoScroll disableHorizontalScroll={disableHorizontalScroll}>
                  <HorizontalUpsellingContainer disableHorizontalScroll={disableHorizontalScroll}>
                    {
                      !upsellingProducts.loading
                        ? (
                          <>
                            <AutoScroll disableHorizontalScroll={disableHorizontalScroll} scrollId='upSelling' isColumnMode={upsellingProducts.products.length === 1}>
                              {
                                (!upsellingProducts.error && upsellingProducts.products.length > 0)
                                  ? upsellingProducts.products.map((product, i) => (
                                    <HorizontalItem key={product.id} name={product.name}>
                                      {(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && (
                                        <HorizontalImage>
                                          <img src={product.images} alt={`product-${i}`} loading='lazy' />
                                        </HorizontalImage>
                                      )}
                                      <HorizontalDetails>
                                        <div>
                                          <h3 title={product.name}>{product.name}</h3>
                                        </div>
                                        <div>
                                          <span>{parsePrice(product.price)}</span>
                                        </div>
                                      </HorizontalDetails>
                                      <Button outline color='primary' onClick={() => handleFormProduct(product)}>{t('ADD', 'Add')}</Button>
                                    </HorizontalItem>
                                  ))
                                  : (
                                    <div>
                                      {upsellingProducts.message || t('NO_UPSELLING_PRODUCTS', 'There are no upselling products')}
                                    </div>
                                    )
                              }
                            </AutoScroll>
                          </>
                          )
                        : [...Array(8)].map((item, i) => (
                          <SkeletonContainer key={i}>
                            <Skeleton width={250} height={100} />
                          </SkeletonContainer>
                          ))
                    }
                  </HorizontalUpsellingContainer>
                </WrapAutoScroll>
                {showCancelButton && (
                  <ButtonWrapper>
                    <Button
                      color='primary'
                      outline
                      onClick={() => handleStoreRedirect && business?.slug ? handleStoreRedirect(business?.slug) : setShowUpSelling(false)}
                    >
                      {t('CANCEL', 'Cancel')}
                    </Button>
                  </ButtonWrapper>
                )}
              </>
                )
              : null
          )
        : (
          <>
            {canOpenUpselling
              ? openUpselling
                ? (
                  <Modal
                    open={openUpselling}
                    onClose={() => handleUpsellingPage(false)}
                    width='70%'
                    padding='0px'
                  >
                    {currentCart?.products?.length > 0
                      ? (
                        <>
                          <UpsellingTitle>{t('CART', 'Cart')}</UpsellingTitle>
                          <OrderDetailsTitle>
                            <p>{t('ORDER_DETAILS', 'Order details')}</p>
                          </OrderDetailsTitle>
                          <CheckProductsContainer>
                            <p>{t('CHECK_AND_MODIFY_PRODUCTS', 'Check and modify your products here')}</p>
                            <Button
                              color='primary'
                              onClick={() => handleUpsellingPage(false)}
                            >
                              {t('ADD_MORE_PRODUCTS', 'Add more products')}
                            </Button>
                          </CheckProductsContainer>
                          <SubtitleContainer>
                            <p>{t('CONFIRM_YOUR_SELECTION', 'Corfirm your selection')}</p>
                          </SubtitleContainer>
                          <Cart
                            isStore
                            isForceOpenCart
                            hideDetails
                            hideCheckoutButtons
                            cart={currentCart}
                            isCartPending={currentCart?.status === 2}
                            isProducts={currentCart.products.length}
                            isCartOnProductsList={isCartOnProductsList}
                            handleCartOpen={handleCartOpen}
                            businessConfigs={business?.configs}
                            productLoading={productLoading}
                            hideBusinessDetails
                          />
                        </>
                        )
                      : (
                        <EmptyCart>
                          <div className='empty-content'>
                            <Cart3 />
                            <p>{t('ADD_PRODUCTS_IN_YOUR_CART', 'Add products in your cart')}</p>
                          </div>
                        </EmptyCart>
                        )}
                    <SubtitleContainer>
                      <p>{t('SELECT_YOUR_ADDITIONALS', 'Select your additionals')}</p>
                    </SubtitleContainer>
                    <UpsellingLayout />
                    {currentCart?.products?.length > 0 && (
                      <OrderBillContainer>
                        <Divider />
                        <Cart
                          isStore
                          isForceOpenCart
                          hideProducts
                          hideCheckoutButtons
                          cart={currentCart}
                          isCartPending={currentCart?.status === 2}
                          isProducts={currentCart.products.length}
                          isCartOnProductsList={isCartOnProductsList}
                          handleCartOpen={handleCartOpen}
                          businessConfigs={business?.configs}
                          productLoading={productLoading}
                          hideBusinessDetails
                        />
                      </OrderBillContainer>
                    )}
                    <CloseUpselling>
                      {currentCart?.products?.length > 0 && (
                        <Button
                          color='primary'
                          onClick={() => handleUpsellingPage(true)}
                        >
                          {t('PAY', 'Pay')}
                        </Button>
                      )}
                      <Button
                        color='secondary'
                        onClick={() => handleUpsellingPage(false)}
                      >
                        {t('ADD_ARTICLES', 'Add articles')}
                      </Button>
                    </CloseUpselling>
                  </Modal>
                  )
                : null
              : null}
          </>
          )}
      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          width='900px'
          padding='0'
          closeOnBackdrop
          isProductForm
          hideCloseDefault
          disableOverflowX
          disableHeader
        >
          {actualProduct && (
            <ProductForm
              isHideShare
              useKioskApp={props.useKioskApp}
              product={actualProduct}
              businessId={actualProduct.api.businessId}
              businessSlug={business.slug}
              onSave={() => handleSaveProduct()}
              closeModalProductForm={() => setModalIsOpen(false)}
            />
          )}
        </Modal>
      )}
    </>
  )
}

export const UpsellingPage = (props) => {
  const UpsellingPageProps = {
    ...props,
    UIComponent: UpsellingPageUI
  }

  return <UpsellingPageController {...UpsellingPageProps} />
}
