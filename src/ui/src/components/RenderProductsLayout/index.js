import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import CgSearch from '@meronex/icons/cg/CgSearch'
import { Cart3, ArrowLeft, List } from 'react-bootstrap-icons'

import {
  Title,
  WrappLayout,
  WrapContent,
  BusinessContent,
  BusinessCategoryProductWrapper,
  BusinessCategoriesContainer,
  BusinessCartContainer,
  BusinessCartContent,
  EmptyCart,
  WrapperSearchAbsolute,
  BackButton
} from './styles'

import { useLanguage, useOrder } from '~components'
import { FreeDeliveryProgress } from '../FreeDeliveryProgress'
import { SpinnerCart } from '../Cart/styles'
import { SearchIconWrapper } from '../BusinessBasicInformation/styles'

import {
  useWindowSize,
  scrollTo,
  SpinnerLoader,
  Modal,
  Button,
  Cart,
  BusinessBasicInformation,
  BusinessProductsCategories,
  BusinessProductsList,
  SearchProducts as SearchProductsOriginal,
  CategoriesLayoutGroceries,
  CategoriesPopover
} from '~ui'

export const RenderProductsLayout = (props) => {
  const {
    errors,
    isError,
    isLoading,
    business,
    categoryId,
    searchValue,
    sortByValue,
    currentCart,
    businessState,
    sortByOptions,
    categoryState,
    categorySelected,
    openCategories,
    openBusinessInformation,
    isCartOnProductsList,
    handleChangeSortBy,
    errorQuantityProducts,
    handler,
    onClickCategory,
    featuredProducts,
    onProductClick,
    handleSearchRedirect,
    handleChangeSearch,
    setOpenBusinessInformation,
    handleCartOpen,
    isCustomLayout,
    useKioskApp,
    setSubcategoriesSelected,
    subcategoriesSelected,
    isLazy,
    handleUpdateProducts,
    handleChangeProfessionalSelected,
    professionalSelected,
    isCustomerMode,
    productLoading,
    setProductLoading
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const windowSize = useWindowSize()
  const [isCartModal, setisCartModal] = useState(false)
  const [openSearchProducts, setOpenSearchProducts] = useState(false)
  const [categoryClicked, setCategoryClicked] = useState(false)
  const [openPopover, setOpenPopover] = useState(false)

  const businessLayout = {
    showFirstCategories: !(theme?.business_view?.components?.categories?.components?.show_first_categories?.hidden ?? true)
  }
  const showCartOnProductList = !theme?.business_view?.components?.cart?.components?.hidden
  const hasDesktopCart = windowSize.width >= 1000 && windowSize.height >= 600 && showCartOnProductList
  const awareness = !useKioskApp && !isError && !currentCart?.products?.length && props.freeDeliveryProgress?.status === 'awareness'
    ? <FreeDeliveryProgress {...props.freeDeliveryProgress} />
    : null

  const BusinessLayoutCategories = businessLayout.showFirstCategories
    ? CategoriesLayoutGroceries
    : BusinessProductsCategories

  const CategoriesPopoverUI = <CategoriesLayoutGroceries
    component='categories'
    categories={[
      ...(business?.categories ? business.categories.sort((a, b) => a.rank - b.rank) : [])
    ]}
    categorySelected={categorySelected}
    onClickCategory={onClickCategory}
    featured={featuredProducts}
    openBusinessInformation={openBusinessInformation}
    openCategories={openCategories}
    business={business}
    currentCart={currentCart}
    setCategoryClicked={setCategoryClicked}
  />

  const handleTogglePopover = () => {
    setOpenPopover(!openPopover)
  }

  const handleSaveProduct = () => {
    if (windowSize.width < 993) {
      return
    }
    const productContainer = document.getElementsByClassName('bp-list')[0]
    scrollTo(productContainer, 500, 1250)
  }

  useEffect(() => {
    handleSaveProduct()
  }, [categorySelected])

  useEffect(() => {
    if (windowSize.width < 993 && categoryClicked && document.getElementsByClassName('category-title')) {
      const extraHeight = 80
      const top = document?.getElementsByClassName('category-title')[0]?.offsetTop - extraHeight
      window.scrollTo({
        top,
        behavior: 'smooth'
      })
    } else {
      window.scroll(0, 0)
    }
  }, [categoryClicked])

  return (
    <>
      {!isLoading && business?.id && (
        <WrappLayout isCartOnProductsList={isCartOnProductsList}>
          <div className='bp-list'>
            {!useKioskApp && !showCartOnProductList && (
              <BusinessBasicInformation
                {...props}
                showCartOnProductList
                businessState={businessState}
                setOpenBusinessInformation={setOpenBusinessInformation}
                openBusinessInformation={openBusinessInformation}
                handleChangeSearch={handleChangeSearch}
                searchValue={searchValue}
                sortByOptions={sortByOptions}
                handleChangeSortBy={handleChangeSortBy}
                categoryState={categoryState}
                errorQuantityProducts={errorQuantityProducts}
                sortByValue={sortByValue}
                categoryClicked={categoryClicked}
                categorySelected={categorySelected}
                setCategoryClicked={setCategoryClicked}
              />
            )}
            {!showCartOnProductList && awareness}
            {!businessLayout.showFirstCategories && (
              <BusinessContent isCustomLayout={isCustomLayout || useKioskApp} id='wrapper-categories'>
                <BusinessCategoryProductWrapper showCartOnProductList={showCartOnProductList}>
                  {!useKioskApp && showCartOnProductList && (
                    <BusinessBasicInformation
                      {...props}
                      showCartOnProductList
                      businessState={businessState}
                      setOpenBusinessInformation={setOpenBusinessInformation}
                      openBusinessInformation={openBusinessInformation}
                      handleChangeSearch={handleChangeSearch}
                      searchValue={searchValue}
                      sortByOptions={sortByOptions}
                      handleChangeSortBy={handleChangeSortBy}
                      categoryState={categoryState}
                      errorQuantityProducts={errorQuantityProducts}
                      sortByValue={sortByValue}
                      categoryClicked={categoryClicked}
                      categorySelected={categorySelected}
                      setCategoryClicked={setCategoryClicked}
                    />
                  )}
                  {showCartOnProductList && !hasDesktopCart && awareness}
                  <CategoriesPopover
                    isHideHeader
                    CategoriesPopoverUI={() => CategoriesPopoverUI}
                    open={openPopover}
                    onClick={() => handleTogglePopover()}
                    onClose={() => setOpenPopover(false)}
                  />
                  <div style={{ position: 'relative', marginRight: 5 }}>
                    {!(business?.categories?.length === 0 && !categoryId) && !categorySelected?.id && (
                      <BusinessLayoutCategories
                        categories={[
                          { id: -1, name: <List />, isList: true },
                          { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                          { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') },
                          ...business?.categories.sort((a, b) => a.rank - b.rank)
                        ]}
                        categorySelected={categorySelected}
                        onClickCategory={onClickCategory}
                        handleTogglePopover={handleTogglePopover}
                        featured={featuredProducts}
                        useKioskApp={useKioskApp}
                        openBusinessInformation={openBusinessInformation}
                        business={business}
                        currentCart={currentCart}
                        wContainerStyle={useKioskApp && 'calc(100% - 50px)'}
                        isProfessional={business?.professionals?.length > 0 && !useKioskApp}
                      />
                    )}
                    {!(business?.categories?.length === 0 && !categoryId) && categorySelected?.id && (
                      <BackButton>
                        <Button
                          color='primary'
                          initialIcon
                          onClick={() => onClickCategory({ id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') })}
                        >
                          <ArrowLeft />
                          <div>{t('GO_TO_ALL_CATEGORIES', 'Go to all categories')}</div>
                        </Button>
                      </BackButton>
                    )}
                    {useKioskApp && (
                      <WrapperSearchAbsolute id='WrapperSearchAbsolute'>
                        <SearchIconWrapper
                          onClick={() => setOpenSearchProducts(true)}
                        >
                          <CgSearch />
                        </SearchIconWrapper>
                        {openSearchProducts && (
                          <SearchProductsOriginal
                            {...props}
                            businessState={businessState}
                            setOpenBusinessInformation={setOpenBusinessInformation}
                            openBusinessInformation={openBusinessInformation}
                            handleChangeSearch={handleChangeSearch}
                            searchValue={searchValue}
                            sortByOptions={sortByOptions}
                            handleChangeSortBy={handleChangeSortBy}
                            categoryState={categoryState}
                            errorQuantityProducts={errorQuantityProducts}
                            sortByValue={sortByValue}
                            onChange={(val) => handleChangeSortBy && handleChangeSortBy(val)}
                            business={businessState.business}
                            onClose={() => {
                              handleChangeSearch('')
                              setOpenSearchProducts(false)
                            }}
                          />
                        )}
                      </WrapperSearchAbsolute>
                    )}
                  </div>
                  <WrapContent id='businessProductList'>
                    <BusinessProductsList
                      categories={[
                        { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                        { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') },
                        ...business?.categories.sort((a, b) => a.rank - b.rank)
                      ]}
                      isLazy={isLazy}
                      category={categorySelected}
                      categoryState={categoryState}
                      useKioskApp={useKioskApp}
                      businessId={business?.id}
                      errors={errors}
                      onProductClick={onProductClick}
                      handleSearchRedirect={handleSearchRedirect}
                      featured={featuredProducts}
                      searchValue={searchValue}
                      isCartOnProductsList={isCartOnProductsList}
                      handleClearSearch={handleChangeSearch}
                      errorQuantityProducts={errorQuantityProducts}
                      business={business}
                      currentCart={currentCart}
                      setSubcategoriesSelected={setSubcategoriesSelected}
                      subcategoriesSelected={subcategoriesSelected}
                      onClickCategory={onClickCategory}
                      handleUpdateProducts={handleUpdateProducts}
                      professionalSelected={professionalSelected}
                      handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                      previouslyProducts={businessState?.business?.previously_products}
                    />
                  </WrapContent>
                </BusinessCategoryProductWrapper>
                {(windowSize.width >= 1000 && windowSize.height >= 600) && showCartOnProductList && (
                  <BusinessCartContainer isProfessional={business?.professionals?.length > 0 && !useKioskApp}>
                    <BusinessCartContent maxHeight={window.innerHeight - 100}>
                      {currentCart?.products?.length > 0 || (currentCart?.reservation && orderState?.options?.type === 9)
                        ? (
                            <>
                              <Title>{t('YOUR_ORDER', 'Your order')}</Title>
                              <Cart
                                isStore
                                isForceOpenCart
                                useKioskApp={useKioskApp}
                                cart={currentCart}
                                freeDeliveryProgress={props.freeDeliveryProgress}
                                isCartPending={currentCart?.status === 2}
                                isProducts={currentCart.products.length}
                                isCartOnProductsList={isCartOnProductsList}
                                handleCartOpen={handleCartOpen}
                                businessConfigs={business?.configs}
                                productLoading={productLoading}
                                setProductLoading={setProductLoading}
                                hideBusinessDetails
                              />
                            </>
                          )
                        : (
                            <EmptyCart>
                              {awareness}
                              <div className='empty-content'>
                                <h2>{t('YOUR_ORDER', 'Your order')}</h2>
                                <div className='empty-cart'>
                                  <Cart3 />
                                  <p>{t('YOUR_CART_IS_EMPTY', 'Your cart is empty')}</p>
                                </div>
                              </div>
                              {productLoading && (
                                <SpinnerCart emptyCart>
                                  <SpinnerLoader
                                    style={{ height: 100 }}
                                  />
                                </SpinnerCart>
                              )}
                            </EmptyCart>
                          )}
                    </BusinessCartContent>
                  </BusinessCartContainer>
                )}
              </BusinessContent>
            )}

            {businessLayout.showFirstCategories && (
              <>
                <BusinessContent>
                  <BusinessCategoriesContainer offSticky showCartOnProductList={showCartOnProductList}>
                    {!useKioskApp && showCartOnProductList && (
                      <BusinessBasicInformation
                        {...props}
                        businessState={businessState}
                        setOpenBusinessInformation={setOpenBusinessInformation}
                        openBusinessInformation={openBusinessInformation}
                        handleChangeSearch={handleChangeSearch}
                        searchValue={searchValue}
                        sortByOptions={sortByOptions}
                        handleChangeSortBy={handleChangeSortBy}
                        categoryState={categoryState}
                        errorQuantityProducts={errorQuantityProducts}
                        sortByValue={sortByValue}
                        categoryClicked={categoryClicked}
                        categorySelected={categorySelected}
                        setCategoryClicked={setCategoryClicked}
                      />
                    )}
                    {showCartOnProductList && !hasDesktopCart && awareness}
                    {!(business?.categories?.length === 0 && !categoryId) && (
                      <>
                        {(!categoryClicked) && (
                          <BusinessLayoutCategories
                            component='categories'
                            categories={[
                              ...business?.categories.sort((a, b) => a.rank - b.rank)
                            ]}
                            categorySelected={categorySelected}
                            onClickCategory={onClickCategory}
                            handleTogglePopover={handleTogglePopover}
                            featured={featuredProducts}
                            openBusinessInformation={openBusinessInformation}
                            openCategories={openCategories}
                            business={business}
                            currentCart={currentCart}
                            setCategoryClicked={setCategoryClicked}
                            avoidAllLevelsSubCategories
                          />
                        )}
                      </>
                    )}
                    {!(business?.categories?.length === 0 && !categoryId) && categoryClicked && (
                      <BackButton>
                        <Button
                          color='primary'
                          initialIcon
                          onClick={() => {
                            setCategoryClicked(false)
                            onClickCategory({ id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') })
                          }}
                        >
                          <ArrowLeft />
                          <div>{t('GO_TO_ALL_CATEGORIES', 'Go to all categories')}</div>
                        </Button>
                      </BackButton>
                    )}
                    {(categoryClicked || business?.categories?.length === 0) && (
                      <BusinessCategoryProductWrapper>
                        <WrapContent id='businessProductList' isCategoryLayout>
                          <BusinessProductsList
                            categories={[
                              { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                              ...business?.categories.sort((a, b) => a.rank - b.rank)
                            ]}
                            isLazy={isLazy}
                            category={categorySelected}
                            categoryState={categoryState}
                            useKioskApp={useKioskApp}
                            businessId={business?.id}
                            errors={errors}
                            onProductClick={onProductClick}
                            handleSearchRedirect={handleSearchRedirect}
                            featured={featuredProducts}
                            searchValue={searchValue}
                            isCartOnProductsList={isCartOnProductsList}
                            handleClearSearch={handleChangeSearch}
                            errorQuantityProducts={errorQuantityProducts}
                            business={business}
                            currentCart={currentCart}
                            setSubcategoriesSelected={setSubcategoriesSelected}
                            subcategoriesSelected={subcategoriesSelected}
                            onClickCategory={onClickCategory}
                            handleUpdateProducts={handleUpdateProducts}
                            professionalSelected={professionalSelected}
                            handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                            previouslyProducts={businessState?.business?.previously_products}
                            showFirstCategories
                          />
                        </WrapContent>
                      </BusinessCategoryProductWrapper>
                    )}
                  </BusinessCategoriesContainer>
                  {(windowSize.width >= 1000 && windowSize.height >= 600) && showCartOnProductList && (
                    <BusinessCartContainer isProfessional={business?.professionals?.length > 0 && !useKioskApp}>
                      <BusinessCartContent maxHeight={window.innerHeight - 100}>
                        {currentCart?.products?.length > 0 || (currentCart?.reservation && orderState?.options?.type === 9)
                          ? (
                              <>
                                <Title>{t('YOUR_ORDER', 'Your order')}</Title>
                                <Cart
                                  isStore
                                  isForceOpenCart
                                  useKioskApp={useKioskApp}
                                  cart={currentCart}
                                  freeDeliveryProgress={props.freeDeliveryProgress}
                                  isCartPending={currentCart?.status === 2}
                                  isProducts={currentCart.products.length}
                                  isCartOnProductsList={isCartOnProductsList}
                                  handleCartOpen={handleCartOpen}
                                  businessConfigs={business?.configs}
                                  productLoading={productLoading}
                                  setProductLoading={setProductLoading}
                                  hideBusinessDetails
                                />
                              </>
                            )
                          : (
                              <EmptyCart>
                                {awareness}
                                <div className='empty-content'>
                                  <h2>{t('YOUR_ORDER', 'Your order')}</h2>
                                  <div className='empty-cart'>
                                    <Cart3 />
                                    <p>{t('YOUR_CART_IS_EMPTY', 'Your cart is empty')}</p>
                                  </div>
                                </div>
                                {productLoading && (
                                  <SpinnerCart emptyCart>
                                    <SpinnerLoader
                                      style={{ height: 100 }}
                                    />
                                  </SpinnerCart>
                                )}
                              </EmptyCart>
                            )}
                      </BusinessCartContent>
                    </BusinessCartContainer>
                  )}
                </BusinessContent>
              </>
            )}
          </div>
        </WrappLayout>
      )}

      {isLoading && !isError && (
        <>
          {!isCustomLayout && !useKioskApp && (
            <BusinessBasicInformation
              isSkeleton
              handler={handler}
              businessState={{ business: {}, loading: true }}
              openBusinessInformation={openBusinessInformation}
            />
          )}
          <BusinessContent isCustomLayout={isCustomLayout || useKioskApp} id='wrapper-categories'>
            <BusinessCategoryProductWrapper showCartOnProductList={showCartOnProductList}>
              <div style={{ position: 'relative' }}>
                <BusinessProductsCategories
                  isSkeleton
                  categories={[]}
                  openBusinessInformation={openBusinessInformation}
                  isCustomerMode={isCustomerMode}
                />
              </div>
            </BusinessCategoryProductWrapper>
          </BusinessContent>
          {(categoryClicked || windowSize.width >= 993) && (
            <WrapContent>
              <BusinessProductsList
                categories={[]}
                useKioskApp={useKioskApp}
                category={categorySelected}
                categoryState={categoryState}
                isBusinessLoading={isLoading}
                handleUpdateProducts={handleUpdateProducts}
                errorQuantityProducts={errorQuantityProducts}
              />
            </WrapContent>
          )}
        </>
      )}
      {isCartModal && (
        <Modal
          width='40%'
          open={isCartModal}
          onClose={() => setisCartModal(false)}
          padding='0'
        >
          <BusinessCartContent isModal>
            <Title style={{ textAlign: 'center', marginTop: '5px' }}>{t('YOUR_CART', 'Your cart')}</Title>
            {currentCart?.products?.length > 0
              ? (
              <>
                <Cart
                  isStore
                  isCustomMode
                  isForceOpenCart
                  cart={currentCart}
                  freeDeliveryProgress={props.freeDeliveryProgress}
                  useKioskApp={useKioskApp}
                  isCartPending={currentCart?.status === 2}
                  isProducts={currentCart.products.length}
                  isCartOnProductsList={isCartOnProductsList}
                  handleCartOpen={handleCartOpen}
                  businessConfigs={business?.configs}
                  productLoading={productLoading}
                  setProductLoading={setProductLoading}
                />
              </>
                )
              : (
                  <EmptyCart>
                    {awareness}
                    <div className='empty-content'>
                      <h2>{t('YOUR_ORDER', 'Your order')}</h2>
                      <div className='empty-cart'>
                        <Cart3 />
                        <p>{t('YOUR_CART_IS_EMPTY', 'Your cart is empty')}</p>
                      </div>
                    </div>
                    {productLoading && (
                      <SpinnerCart emptyCart>
                        <SpinnerLoader
                          style={{ height: 100 }}
                        />
                      </SpinnerCart>
                    )}
                  </EmptyCart>
                )}
          </BusinessCartContent>
        </Modal>
      )}
    </>
  )
}
