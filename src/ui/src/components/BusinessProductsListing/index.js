import React, { useState, useEffect, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import { useLocation } from 'react-router-dom'
import { Cart3 } from 'react-bootstrap-icons'
import settings from '~/config'
import { useFreeDeliveryProgress } from '~components/hooks/useFreeDeliveryProgress'
import { FreeDeliveryProgress } from '../FreeDeliveryProgress'

import {
  ProductsContainer,
  ProductLoading,
  SkeletonItem,
  MobileCartViewWrapper,
  MobileCartActions,
  BusinessCartContent,
  EmptyCart,
  Title,
  AddressOrderTypeContainer
} from './styles'

import {
  BusinessAndProductList,
  useEvent,
  useLanguage,
  useOrder,
  useUtils,
  useSession,
  useSite,
  useConfig,
  useBusiness
} from '~components'

import {
  Modal,
  Button,
  useWindowSize,
  useIsMounted,
  Alert,
  NotFoundSource,
  PageNotFound,
  Cart,
  ProductForm,
  ServiceForm,
  UpsellingPage,
  RenderProductsLayout,
  AddressOrderType,
  checkSiteUrl
} from '~ui'

const PIXELS_TO_SCROLL = 300

const BusinessProductsListingUI = (props) => {
  const {
    errors,
    openCategories,
    isInitialRender,
    businessState,
    categorySelected,
    searchValue,
    sortByValue,
    categoryState,
    categoryId,
    productId,
    productModal,
    getNextProducts,
    handleChangeCategory,
    handleUpdateInitialRender,
    updateProductModal,
    onProductRedirect,
    handleChangeSearch,
    handleSearchRedirect,
    featuredProducts,
    handleChangeSortBy,
    isCartOnProductsList,
    errorQuantityProducts,
    multiRemoveProducts,
    setAlertState,
    alertState,
    onCheckoutRedirect,
    handleUpdateProducts,
    professionalSelected,
    handleChangeProfessionalSelected,
    onChangeMetaTag,
    onBusinessClick,
    handleChangePriceFilterValues,
    priceFilterValues,
    handleUpdateProfessionals,
    isCustomerMode,
    isCustomLayout,
    notFound,
    setNotFound,
    loadedFirstTime,
    handleAddReservation,
    handleFavoriteBusiness
  } = props

  const { business, loading, error } = businessState
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ carts, options }, { addProduct, updateProduct }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [events] = useEvent()
  const location = useLocation()
  const windowSize = useWindowSize()
  const [{ auth }] = useSession()
  const [{ site }] = useSite()
  const productUrlTemplate = checkSiteUrl(
    site?.product_url_template,
    '/store/:business_slug?category=:category_id&product=:product_id'
  )
  const [, { setBusiness }] = useBusiness()
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState(props.product)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isCartModal, setisCartModal] = useState(false)
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const productListSignature = React.useRef(null)
  const mobileCartFooterRef = React.useRef(null)
  const [mobileCartFooterHeight, setMobileCartFooterHeight] = useState(0)
  const isMounted = useIsMounted()

  const isQuickAddProduct = configs?.add_product_with_one_click?.value === '1'
  const currentCart = Object.values(carts).find(cart => cart?.business?.slug === business?.slug) ?? {}
  const websiteTheme = theme?.my_products?.components?.website_theme?.components
  const effectiveFranchiseId = props.franchiseId || (websiteTheme?.type === 'franchise' && (websiteTheme?.franchise_slug || websiteTheme?.business_slug)) || settings?.franchiseSlug
  const hasBusinessError = Array.isArray(error) ? error.length > 0 : Boolean(error)
  const freeDeliveryProgress = useFreeDeliveryProgress({
    business,
    cart: currentCart,
    franchiseId: effectiveFranchiseId,
    enabled: !props.useKioskApp && !loading && !hasBusinessError
  })
  const mobileCartVisible = (windowSize.width < 1000 || windowSize.height < 600) &&
    currentCart?.products?.length > 0 && !isCartModal
  const isLazy = businessState?.business?.lazy_load_products_recommended

  const cateringTypes = [7, 8]
  const cateringPreorder = cateringTypes.includes(options?.type)
  const sortByOptions = [
    { value: null, content: t('SORT_BY', theme?.defaultLanguages?.SORT_BY || 'Sort By'), showOnSelected: t('SORT_BY', theme?.defaultLanguages?.SORT_BY || 'Sort By') },
    { value: 'rank', content: t('RANK', theme?.defaultLanguages?.RANK || 'Rank'), showOnSelected: t('RANK', theme?.defaultLanguages?.RANK || 'Rank') },
    { value: 'a-z', content: t('A_to_Z', theme?.defaultLanguages?.A_to_Z || 'A-Z'), showOnSelected: t('A_to_Z', theme?.defaultLanguages?.A_to_Z || 'A-Z') }
  ]

  const handler = () => {
    setOpenBusinessInformation(true)
  }

  const onProductClick = async (product) => {
    if (product.extras.length === 0 && !product.inventoried && auth && isQuickAddProduct) {
      setProductLoading(true)
      const isProductAddedToCart = currentCart?.products?.find(Cproduct => Cproduct.id === product.id)
      const productQuantity = isProductAddedToCart?.quantity
      const minimumPerOrder = product?.minimum_per_order || 1
      const addCurrentProduct = {
        ...product,
        quantity: minimumPerOrder
      }
      const updateCurrentProduct = {
        id: product.id,
        code: isProductAddedToCart?.code,
        quantity: productQuantity + 1
      }
      const cartData = currentCart?.business_id ? currentCart : { business_id: business.id }
      if (isProductAddedToCart) {
        await updateProduct(updateCurrentProduct, cartData, isQuickAddProduct)
      } else {
        await addProduct(addCurrentProduct, cartData, isQuickAddProduct)
      }
      setProductLoading(false)
    } else {
      const productSlug = product?.slug || product?.id
      const categorySlug = product?.category?.slug || product?.category_id
      if (!((product?.type === 'service') && business?.professionals?.length > 0)) {
        if (productUrlTemplate) {
          onProductRedirect({
            slug: business?.slug,
            product: productUrlTemplate.includes('product_slug') ? productSlug : product.id,
            category: productUrlTemplate.includes('category_slug') ? categorySlug : product.category_id
          })
        } else {
          onProductRedirect({
            slug: business?.slug,
            product: product.id,
            category: product.category_id
          })
        }
      }
      setCurProduct(product)
      setModalIsOpen(true)
      events.emit('product_clicked', product)
    }
  }

  const handleCustomProductBannerClick = (product) => {
    const productSlug = product?.slug || product?.id
    const categorySlug = product?.category?.slug || product?.category_id
    if (!((product?.type === 'service') && business?.professionals?.length > 0)) {
      if (productUrlTemplate) {
        onProductRedirect({
          slug: business?.slug,
          product: productUrlTemplate.includes('product_slug') ? productSlug : product.id,
          category: productUrlTemplate.includes('category_slug') ? categorySlug : product.category_id
        })
      } else {
        onProductRedirect({
          slug: business?.slug,
          product: product.id,
          category: product.category_id
        })
      }
    }
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
      onProductRedirect({
        slug: business?.slug
      })
    }
  }

  const closeModalProductForm = () => {
    setModalIsOpen(false)
    handleUpdateInitialRender(false)
    updateProductModal(null)
    setCurProduct(null)
    setNotFound(false)
    onProductRedirect({
      slug: business?.slug
    })
  }

  const handleScroll = useCallback(() => {
    const innerHeightScrolltop = window.innerHeight + document.documentElement?.scrollTop + PIXELS_TO_SCROLL
    const badScrollPosition = innerHeightScrolltop < document.documentElement?.offsetHeight
    const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
    if (badScrollPosition || categoryState.loading || !hasMore) return
    getNextProducts({ isNextPage: true })
  }, [categoryState, windowSize.width])

  const handleChangePage = (data) => {
    if (Object.entries(data.query).length === 0 && openProduct) {
      setModalIsOpen(false)
    }
  }

  const handleUpsellingPage = (goToCheckout) => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    if (goToCheckout) {
      onCheckoutRedirect(currentCart?.uuid)
    }
  }

  const adjustBusiness = async (adjustBusinessId) => {
    const _carts = carts?.[adjustBusinessId]
    const products = carts?.[adjustBusinessId]?.products || []
    const unavailableProducts = products.filter(product => product.valid !== true)
    const alreadyRemoved = sessionStorage.getItem('already-removed')
    sessionStorage.removeItem('already-removed')

    if (unavailableProducts.length > 0) {
      multiRemoveProducts && await multiRemoveProducts(unavailableProducts, _carts)
      return
    }

    if (alreadyRemoved === 'removed') {
      setAlertState({ open: true, content: [t('NOT_AVAILABLE_PRODUCT', 'This product is not available.')] })
    }
  }

  useEffect(() => {
    if (categoryId && productId && isInitialRender) {
      if (productModal?.product?.id) {
        setCurProduct(productModal.product)
      }
      setModalIsOpen(true)
    }
  }, [productModal, categoryId, productId, isInitialRender])

  useEffect(() => {
    // Path-style product URLs can remount this screen; keep scroll when opening a product.
    // Query-style /store/?product= stays on the same route instance and never hits this case.
    if (!(categoryId && productId)) {
      window.scrollTo(0, 0)
    }
    if (categoryId && productId) {
      handleUpdateInitialRender(true)
    }
    events.emit('get_current_view')
  }, [])

  useEffect(() => {
    const handleClickedBannerProduct = () => {
      handleUpdateInitialRender(true)
    }
    events.on('product_banner_clicked', handleClickedBannerProduct)
    return () => {
      events.off('product_banner_clicked', handleClickedBannerProduct)
    }
  }, [])

  useEffect(() => {
    if (!categoryId && !productId) {
      setModalIsOpen(false)
    }
  }, [categoryId, productId])

  useEffect(() => {
    if (loading) return
    if (openProduct) {
      onChangeMetaTag && onChangeMetaTag(curProduct?.seo_title, curProduct?.seo_description, curProduct?.seo_keywords)
    } else {
      onChangeMetaTag && onChangeMetaTag(business?.name, business?.description, business?.name)
      updateProductModal(null)
      setCurProduct(null)
    }
  }, [openProduct, loading, business, curProduct])

  useEffect(() => {
    if (loading || categoryState?.loading || !categoryState?.products?.length) return

    const listId = categorySelected?.id ?? 'all'
    const listName = categorySelected?.name ?? business?.name
    const signature = `${business?.id}:${listId}:${categoryState.products.map(product => product.id).join(',')}`
    if (productListSignature.current === signature) return

    productListSignature.current = signature
    events.emit('product_list_viewed', {
      business,
      products: categoryState.products,
      listId: String(listId),
      listName
    })
  }, [loading, categoryState?.loading, categoryState?.products, categorySelected, business, events])

  useEffect(() => {
    events.on('change_view', handleChangePage)
    return () => {
      events.off('change_view', handleChangePage)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (business?.schedule?.length) {
      window.localStorage.setItem('business_schedule', JSON.stringify(business?.schedule))
    }

    return () => {
      if (business?.schedule?.length) {
        window.localStorage.removeItem('business_schedule')
      }
    }
  }, [business?.schedule])

  useEffect(() => {
    const adjustBusinessId = sessionStorage.getItem('adjust-cart-products')
    if (currentCart && adjustBusinessId) {
      sessionStorage.removeItem('adjust-cart-products')
      adjustBusiness(adjustBusinessId)
    }
  }, [currentCart])

  useEffect(() => {
    if (cateringPreorder) {
      setBusiness(business)
    }
    return () => {
      setBusiness({})
    }
  }, [cateringPreorder, business])

  useEffect(() => {
    const footer = mobileCartFooterRef.current
    if (!mobileCartVisible || !footer) {
      setMobileCartFooterHeight(0)
      return
    }

    const measureFooter = () => setMobileCartFooterHeight(footer.getBoundingClientRect().height)
    measureFooter()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureFooter) : null
    observer?.observe(footer)
    window.addEventListener('resize', measureFooter)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measureFooter)
    }
  }, [mobileCartVisible, freeDeliveryProgress.status, freeDeliveryProgress.remainingAmount, currentCart?.total])

  return (
    <>
      <AddressOrderTypeContainer>
        <AddressOrderType />
      </AddressOrderTypeContainer>
      <ProductsContainer style={mobileCartVisible ? { paddingBottom: mobileCartFooterHeight + 16 } : undefined}>
        {theme?.business_view?.components?.cart?.components?.hidden &&
          windowSize.width >= 1000 && windowSize.height >= 600 &&
          currentCart?.products?.length > 0 && !isCartModal &&
          ['progress', 'unlocked', 'unconfirmed'].includes(freeDeliveryProgress.status) && (
            <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
        )}
        <RenderProductsLayout
          errors={errors}
          isError={error}
          isLoading={loading}
          isLazy={isLazy}
          business={business}
          categoryId={categoryId}
          searchValue={searchValue}
          sortByValue={sortByValue}
          currentCart={currentCart}
          freeDeliveryProgress={freeDeliveryProgress}
          businessState={businessState}
          sortByOptions={sortByOptions}
          categoryState={categoryState}
          isCustomLayout={isCustomLayout}
          categoriesState={props.categoriesState}
          useKioskApp={props.useKioskApp}
          categorySelected={categorySelected}
          openCategories={openCategories}
          openBusinessInformation={openBusinessInformation}
          forceShowNearBusiness={props.forceShowNearBusiness}
          isCartOnProductsList={isCartOnProductsList && currentCart?.products?.length > 0}
          handleChangeSortBy={handleChangeSortBy}
          errorQuantityProducts={errorQuantityProducts}
          onClickCategory={handleChangeCategory}
          featuredProducts={featuredProducts}
          subcategoriesSelected={subcategoriesSelected}
          handler={handler}
          onProductClick={onProductClick}
          handleSearchRedirect={handleSearchRedirect}
          handleChangeSearch={handleChangeSearch}
          setOpenBusinessInformation={setOpenBusinessInformation}
          setSubcategoriesSelected={setSubcategoriesSelected}
          handleUpdateProducts={handleUpdateProducts}
          professionalSelected={professionalSelected}
          handleChangeProfessionalSelected={handleChangeProfessionalSelected}
          onBusinessClick={onBusinessClick}
          priceFilterValues={priceFilterValues}
          handleChangePriceFilterValues={handleChangePriceFilterValues}
          productLoading={productLoading}
          setProductLoading={setProductLoading}
          handleUpdateProfessionals={handleUpdateProfessionals}
          isCustomerMode={isCustomerMode}
          handleCustomProductBannerClick={handleCustomProductBannerClick}
          handleAddReservation={handleAddReservation}
          handleFavoriteBusiness={handleFavoriteBusiness}
        />

        {
          isMounted && !loading && loadedFirstTime && business && !Object.keys(business).length && (
            <NotFoundSource
              content={t('NOT_FOUND_BUSINESS_PRODUCTS', theme?.defaultLanguages?.NOT_FOUND_BUSINESS_PRODUCTS || 'No products to show at this business, please try with other business.')}
              btnTitle={t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
            />
          )
        }

        {
          !loading && !business && location.pathname.includes('/store/') && (
            <NotFoundSource
              content={t('ERROR_NOT_FOUND_STORE', theme?.defaultLanguages?.ERROR_NOT_FOUND_STORE || 'Sorry, an error has occurred with business selected.')}
              btnTitle={t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
            />
          )
        }

        {
          !loading && !business && !location.pathname.includes('/store/') && (
            <PageNotFound />
          )
        }

        {error && error.length > 0 && Object.keys(business).length > 0 && (
          <NotFoundSource
            content={error[0]?.message || error[0]}
            btnTitle={t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
            onClickButton={handleSearchRedirect}
          />
        )}
      </ProductsContainer>
      {mobileCartVisible && (
        <MobileCartViewWrapper ref={mobileCartFooterRef}>
          {['progress', 'unlocked', 'unconfirmed'].includes(freeDeliveryProgress.status) && (
            <FreeDeliveryProgress {...freeDeliveryProgress} variant='compact' />
          )}
          <MobileCartActions>
            <span>{parsePrice(currentCart?.total)}</span>
            <Button
              color='primary'
              onClick={() => {
                events.emit('cart_viewed', currentCart)
                setisCartModal(true)
              }}
            >
              {t('VIEW_CART', 'View cart')}
            </Button>
          </MobileCartActions>
        </MobileCartViewWrapper>
      )}
      {isCartModal && (
        <Modal
          width='45%'
          open={isCartModal}
          onClose={() => setisCartModal(false)}
          padding='0'
        >
          <BusinessCartContent isModal>
            {currentCart?.products?.length > 0
              ? (
              <>
                <Title style={{ textAlign: 'center', marginTop: '5px' }}>{t('YOUR_ORDER', 'Your order')}</Title>
                <Cart
                  isStore
                  isForceOpenCart
                  forceHideCheckoutButton
                  cart={currentCart}
                  freeDeliveryProgress={freeDeliveryProgress}
                  isCartPending={currentCart?.status === 2}
                  isProducts={currentCart.products.length}
                  isCartOnProductsList={isCartOnProductsList}
                  businessConfigs={business?.configs}
                  productLoading={productLoading}
                  hideBusinessDetails
                />
              </>
                )
              : (
                <EmptyCart>
                  <div className='empty-content'>
                    <h2>{t('YOUR_ORDER', 'Your order')}</h2>
                    <div className='empty-cart'>
                      <Cart3 />
                      <p>{t('YOUR_CART_IS_EMPTY', 'Your cart is empty')}</p>
                    </div>
                  </div>
                </EmptyCart>
                )}
          </BusinessCartContent>
        </Modal>
      )}
      {openProduct && (
        <Modal
          width={props.useKioskApp ? '80%' : '900px'}
          open={openProduct}
          closeOnBackdrop
          onClose={() => closeModalProductForm()}
          padding='0'
          isProductForm
          hideCloseDefault
          disableOverflowX
          disableHeader
        >

          {productModal.loading && !productModal.error && !productModal.product && (
            <ProductLoading>
              <SkeletonItem>
                <Skeleton height={45} count={props.useKioskApp ? 12 : 8} />
              </SkeletonItem>
            </ProductLoading>
          )}

          {productModal.error && productModal.error.length > 0 && (
            <NotFoundSource
              content={productModal.error[0]?.message || productModal.error[0]}
            />
          )}
          {isInitialRender && !productModal.loading && !productModal.error && !productModal.product && notFound && (
            <NotFoundSource
              content={t('ERROR_GET_PRODUCT', theme?.defaultLanguages?.ERROR_GET_PRODUCT || 'Sorry, we couldn\'t find the requested product.')}
            />
          )}
          {(productModal.product || curProduct) && (
            <>
              {(((productModal?.product?.type === 'service') || (curProduct?.type === 'service')) && business?.professionals?.length > 0)
                ? (
                <ServiceForm
                  businessSlug={business?.slug}
                  useKioskApp={props.useKioskApp}
                  product={productModal.product || curProduct}
                  businessId={business?.id}
                  onSave={handlerProductAction}
                  professionalList={business?.professionals}
                  professionalSelected={professionalSelected}
                  handleChangeProfessional={handleChangeProfessionalSelected}
                  handleUpdateProfessionals={handleUpdateProfessionals}
                  productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === (productModal.product || curProduct)?.id ? Cproduct?.quantity : 0) }, 0) || 0}
                  setProductLoading={setProductLoading}
                />
                  )
                : (
                <ProductForm
                  businessSlug={business?.slug}
                  useKioskApp={props.useKioskApp}
                  product={productModal.product || curProduct}
                  businessId={business?.id}
                  categoryId={curProduct?.category_id}
                  productId={curProduct?.id}
                  handleUpdateProducts={handleUpdateProducts}
                  onSave={handlerProductAction}
                  isCustomerMode={isCustomerMode}
                  productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === (productModal.product || curProduct)?.id ? Cproduct?.quantity : 0) }, 0) || 0}
                  setProductLoading={setProductLoading}
                  closeModalProductForm={closeModalProductForm}
                  isHideShare
                />
                  )}
            </>
          )}
        </Modal>
      )}
      <Alert
        title={t('ERROR', 'Error')}
        open={alertState?.open}
        content={t('NOT_AVAILABLE_PRODUCTS', 'These products are not available.')}
        onClose={() => setAlertState({ open: false, content: [] })}
        onAccept={() => setAlertState({ open: false, content: [] })}
      />
      {currentCart?.products && openUpselling && (
        <UpsellingPage
          businessId={currentCart?.business_id}
          business={currentCart?.business}
          cartProducts={currentCart?.products}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}
    </>
  )
}

export const BusinessProductsListing = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(false)

  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI,
    isInitialRender,
    handleUpdateInitialRender: (val) => setIsInitialRender(val),
    isFetchAllProducts: true
  }

  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
