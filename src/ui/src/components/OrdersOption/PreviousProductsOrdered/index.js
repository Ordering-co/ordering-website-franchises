import React, { useState } from 'react'

import {
  ProductsList,
  ProductsListContainer
} from './styles'

import {
  AutoScroll,
  SingleProductCard,
  Modal,
  ProductForm
} from '~ui'

export const PreviousProductsOrdered = (props) => {
  const {
    products,
    handleUpdateProducts,
    onBusinessClick,
    horizontal
  } = props
  const [curProduct, setCurProduct] = useState(null)

  const closeModalProductForm = () => {
    setCurProduct(null)
  }

  const handleRedirectToCart = () => {
    onBusinessClick(curProduct?.business)
    setCurProduct(null)
  }

  const onProductClick = (product) => {
    setCurProduct(product)
  }

  const AutoScrollContainer = (props) => (!horizontal ? <div className='vertical'>{props.children}</div> : <AutoScroll>{props.children}</AutoScroll>)

  return (
    <ProductsListContainer horizontal={horizontal} isLoading={products?.length < 1}>
      <ProductsList horizontal={horizontal}>
        <AutoScrollContainer>
          {products?.filter(product => product?.business?.available)?.map(product => (
            <SingleProductCard
              key={product?.id}
              isSoldOut={(product.inventoried && !product.quantity)}
              product={product}
              businessId={product?.business?.id}
              handleUpdateProducts={handleUpdateProducts}
              onProductClick={(product) => onProductClick(product)}
              isProductId
              minHeight={!horizontal && '120px'}
              fromOrders
            />
          ))}
        </AutoScrollContainer>
      </ProductsList>
      {!!curProduct && (
        <Modal
          width={props?.useKioskApp ? '80%' : '900px'}
          open={!!curProduct}
          closeOnBackdrop
          onClose={() => closeModalProductForm()}
          padding='0'
          isProductForm
          disableOverflowX
          hideCloseDefault
        >
          {(!!curProduct) && (
            <ProductForm
              businessSlug={curProduct?.business?.slug}
              useKioskApp={props?.useKioskApp}
              businessId={curProduct?.businessId}
              categoryId={curProduct?.category_id}
              productId={curProduct?.product_id}
              onSave={handleRedirectToCart}
              closeModalProductForm={closeModalProductForm}
              isHideShare
            />
          )}
        </Modal>
      )}
    </ProductsListContainer>
  )
}
