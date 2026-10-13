import React, { useState } from 'react'
import AiOutlineGift from '@meronex/icons/ai/AiOutlineGift'
import FaTag from '@meronex/icons/fa/FaTag'
import HiOutlineChevronRight from '@meronex/icons/hi/HiOutlineChevronRight'
import MdCloseCircle from '@meronex/icons/ios/MdCloseCircle'
import MdErrorOutline from '@meronex/icons/md/MdErrorOutline'

import {
  AppliedOfferIcon,
  AppliedCoupon,
  CouponContainer,
  CouponEntryButton,
  CouponEntryContent,
  CouponEntryIcon,
  CouponForm,
  CouponModalContent,
  CouponSection,
  CouponSectionHeader,
  OfferCard,
  OfferCardContent,
  OfferCode,
  OfferList,
  OfferLoadingState,
  OfferRate,
  OfferSpinner,
  OfferState,
  OfferTab,
  OfferTabCount,
  OfferTabDescription,
  OfferTabs,
  RemoveOfferButton
} from './styles'

import { CouponControl as CouponController, useLanguage, useOrder } from '~components'
import { Input, Button, Confirm, Modal } from '~ui'

const CouponOfferCard = (props) => {
  const {
    offer,
    cartHasOffers,
    applyingOfferId,
    onApply,
    t
  } = props

  const isApplying = applyingOfferId === offer.id
  const isUnavailable = offer.applicable === false
  const shouldReplace = !offer.stackable && cartHasOffers
  const rate = offer.rate_type === 1 && offer.rate
    ? `${offer.rate}%`
    : null

  return (
    <OfferCard $unavailable={isUnavailable}>
      {rate && <OfferRate>{rate}</OfferRate>}
      <OfferCardContent>
        <h3>{offer.name}</h3>
        {(offer.coupon || offer.code) && <OfferCode>{offer.coupon || offer.code}</OfferCode>}
        {offer.description && <p>{offer.description}</p>}
        {isUnavailable && (
          <small>
            {t('OFFER_REQUIREMENTS_NOT_MET', "This cart doesn't meet this offer's requirements yet.")}
          </small>
        )}
      </OfferCardContent>
      <Button
        color='primary'
        disabled={isUnavailable || Boolean(applyingOfferId)}
        onClick={() => onApply(offer)}
      >
        {isApplying
          ? t('APPLYING', 'Applying...')
          : shouldReplace
            ? t('REPLACE', 'Replace')
            : t('APPLY', 'Apply')}
      </Button>
    </OfferCard>
  )
}

const CurrentOfferCard = (props) => {
  const {
    isCoupon,
    offer,
    onRemove,
    removingOfferId,
    t
  } = props

  const rate = offer.rate_type === 1 && offer.rate
    ? `${offer.rate}%`
    : null
  const isRemoving = removingOfferId === offer.id
  const canRemove = isCoupon || Boolean(offer.id)

  return (
    <OfferCard>
      {rate
        ? <OfferRate>{rate}</OfferRate>
        : (
          <AppliedOfferIcon>
            <FaTag />
          </AppliedOfferIcon>
          )}
      <OfferCardContent>
        <h3>{offer.name || t('APPLIED_OFFER', 'Applied offer')}</h3>
        {(offer.coupon || offer.code) && <OfferCode>{offer.coupon || offer.code}</OfferCode>}
        {offer.description && <p>{offer.description}</p>}
      </OfferCardContent>
      {canRemove && (
        <RemoveOfferButton
          type='button'
          disabled={Boolean(removingOfferId)}
          onClick={() => onRemove(offer, isCoupon)}
          aria-label={`${t('REMOVE', 'Remove')} ${offer.name || offer.coupon || t('OFFER', 'Offer')}`}
        >
          <MdCloseCircle aria-hidden='true' />
          <span>{isRemoving ? t('REMOVING', 'Removing...') : t('REMOVE', 'Remove')}</span>
        </RemoveOfferButton>
      )}
    </OfferCard>
  )
}

const CouponControlUI = (props) => {
  const {
    applyingOfferId,
    canLoadOffers,
    cart,
    couponDefault,
    couponInput,
    handleButtonApplyClick,
    handleLoadOffers,
    handleOfferApplyClick,
    handleOfferRemoveClick,
    handleRemoveCouponClick,
    onChangeInputCoupon,
    offersState,
    removingOfferId,
    confirm,
    setConfirm
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('available')
  const [pendingRemoval, setPendingRemoval] = useState(null)
  const couponLabel = typeof couponDefault === 'object'
    ? couponDefault?.coupon || couponDefault?.code || ''
    : couponDefault
  const appliedOffers = Array.isArray(cart?.offers) ? cart.offers : []
  const normalizedCouponLabel = String(couponLabel || '').trim().toLowerCase()
  const couponIsListedAsOffer = appliedOffers.some(offer => (
    normalizedCouponLabel &&
    String(offer?.coupon || offer?.code || '').trim().toLowerCase() === normalizedCouponLabel
  ))
  const currentOffers = [
    ...appliedOffers,
    ...(couponDefault && !couponIsListedAsOffer
      ? [{
          id: `coupon:${couponLabel}`,
          coupon: couponLabel,
          name: t('APPLIED_COUPON', 'Applied coupon'),
          isCoupon: true
        }]
      : [])
  ]
  const appliedOffersCount = currentOffers.length

  const handleOpen = () => {
    setOpen(true)
    if (canLoadOffers) handleLoadOffers()
  }

  const handleManualApply = async (event) => {
    event.preventDefault()
    const applied = await handleButtonApplyClick()
    if (applied === true) setOpen(false)
  }

  const handleOfferApply = async (offer) => {
    const applied = await handleOfferApplyClick(offer)
    if (applied) setOpen(false)
  }

  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const nextTab = activeTab === 'available' ? 'current' : 'available'
    setActiveTab(nextTab)
    event.currentTarget.parentElement
      ?.querySelector(`#${nextTab}-offers-tab`)
      ?.focus()
  }

  const onRemoveCoupon = () => {
    setPendingRemoval({ type: 'coupon' })
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')
    })
  }

  const onRemoveOffer = (offer, isCoupon) => {
    if (isCoupon) {
      onRemoveCoupon()
      return
    }
    setPendingRemoval({ type: 'offer', id: offer.id })
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')
    })
  }

  const handleOnAccept = async () => {
    if (!confirm.error) {
      if (pendingRemoval?.type === 'offer') {
        await handleOfferRemoveClick?.(pendingRemoval.id)
      } else {
        await handleRemoveCouponClick?.()
        onChangeInputCoupon('')
      }
    }
    setConfirm({ ...confirm, open: false, error: false })
    setPendingRemoval(null)
  }

  const handleClose = () => {
    setConfirm({ ...confirm, open: false, error: false })
    setPendingRemoval(null)
  }

  return (
    <CouponContainer>
      <CouponEntryButton type='button' onClick={handleOpen}>
        <CouponEntryIcon>
          <FaTag />
        </CouponEntryIcon>
        <CouponEntryContent>
          <strong>{t('OFFERS_AND_COUPONS', 'Offers and coupons')}</strong>
          <span>
            {appliedOffersCount
              ? `${appliedOffersCount} ${t('APPLIED', 'applied')}`
              : t('ADD_A_COUPON_OR_OFFER', 'Add a coupon or offer')}
          </span>
        </CouponEntryContent>
        <HiOutlineChevronRight />
      </CouponEntryButton>

      {open && (
        <Modal
          open
          title={t('OFFERS_AND_COUPONS', 'Offers and coupons')}
          onClose={() => setOpen(false)}
          width='620px'
          padding='30px 24px 24px'
          disableOverflowX
        >
          <CouponModalContent>
            <CouponSection>
              <CouponSectionHeader>
                <h3>{t('ENTER_A_COUPON_CODE', 'Enter a coupon code')}</h3>
                <p>{t('ENTER_COUPON_HELP', 'Enter your code below to apply it to this cart.')}</p>
              </CouponSectionHeader>
              {couponDefault
                ? (
                  <AppliedCoupon>
                    <div>
                      <FaTag />
                      <span>
                        <small>{t('APPLIED_COUPON', 'Applied coupon')}</small>
                        <strong>{couponLabel}</strong>
                      </span>
                    </div>
                    <Button
                      outline
                      color={canLoadOffers ? 'primary' : 'red'}
                      onClick={canLoadOffers ? () => setActiveTab('current') : onRemoveCoupon}
                    >
                      {canLoadOffers ? t('MANAGE', 'Manage') : t('REMOVE', 'Remove')}
                    </Button>
                  </AppliedCoupon>
                  )
                : (
                  <CouponForm onSubmit={handleManualApply}>
                    <Input
                      value={couponInput ?? ''}
                      aria-label={t('DISCOUNT_COUPON', 'Discount coupon')}
                      placeholder={t('DISCOUNT_COUPON', 'Discount coupon')}
                      onChange={(event) => onChangeInputCoupon(event.target.value)}
                      autoComplete='off'
                    />
                    <Button
                      type='submit'
                      color='primary'
                      disabled={!couponInput || orderState.loading || Boolean(applyingOfferId) || Boolean(removingOfferId)}
                    >
                      {t('APPLY', 'Apply')}
                    </Button>
                  </CouponForm>
                  )}
            </CouponSection>

            {canLoadOffers && (
              <CouponSection>
                <OfferTabs
                  role='tablist'
                  aria-label={t('OFFERS_AND_COUPONS', 'Offers and coupons')}
                >
                  <OfferTab
                    type='button'
                    role='tab'
                    id='available-offers-tab'
                    aria-controls='available-offers-panel'
                    aria-selected={activeTab === 'available'}
                    $active={activeTab === 'available'}
                    tabIndex={activeTab === 'available' ? 0 : -1}
                    onClick={() => setActiveTab('available')}
                    onKeyDown={handleTabKeyDown}
                  >
                    {t('AVAILABLE_OFFERS', 'Available offers')}
                    {!offersState.loading && offersState.offers.length > 0 && (
                      <OfferTabCount>{offersState.offers.length}</OfferTabCount>
                    )}
                  </OfferTab>
                  <OfferTab
                    type='button'
                    role='tab'
                    id='current-offers-tab'
                    aria-controls='current-offers-panel'
                    aria-selected={activeTab === 'current'}
                    $active={activeTab === 'current'}
                    tabIndex={activeTab === 'current' ? 0 : -1}
                    onClick={() => setActiveTab('current')}
                    onKeyDown={handleTabKeyDown}
                  >
                    {t('CURRENT_OFFERS', 'Current offers')}
                    <OfferTabCount>{appliedOffersCount}</OfferTabCount>
                  </OfferTab>
                </OfferTabs>

                {activeTab === 'available' && (
                  <div
                    role='tabpanel'
                    id='available-offers-panel'
                    aria-labelledby='available-offers-tab'
                  >
                    <OfferTabDescription>
                      {t('AVAILABLE_OFFERS_HELP', 'Choose an offer and apply it instantly.')}
                    </OfferTabDescription>
                    <OfferList aria-busy={offersState.loading}>
                      {offersState.loading && (
                        <OfferLoadingState role='status' aria-live='polite'>
                          <OfferSpinner aria-hidden='true' />
                          <span>{t('LOADING', 'Loading...')}</span>
                        </OfferLoadingState>
                      )}

                      {!offersState.loading && offersState.error && (
                        <OfferState role='alert'>
                          <MdErrorOutline />
                          <strong>{t('OFFERS_COULD_NOT_LOAD', "We couldn't load your offers")}</strong>
                          <span>{t('OFFERS_LOAD_RETRY_HELP', 'Check your connection and try again.')}</span>
                          <Button outline color='primary' onClick={handleLoadOffers}>
                            {t('TRY_AGAIN', 'Try again')}
                          </Button>
                        </OfferState>
                      )}

                      {!offersState.loading && !offersState.error && offersState.offers.length === 0 && (
                        <OfferState>
                          <AiOutlineGift />
                          <strong>{t('NO_OFFERS_AVAILABLE', 'No offers available right now')}</strong>
                          <span>{t('NO_OFFERS_AVAILABLE_HELP', 'You can still enter a coupon code above.')}</span>
                        </OfferState>
                      )}

                      {!offersState.loading && !offersState.error && offersState.offers.map(offer => (
                        <CouponOfferCard
                          key={offer.id}
                          offer={offer}
                          cartHasOffers={Boolean(cart?.offers?.length)}
                          applyingOfferId={applyingOfferId}
                          onApply={handleOfferApply}
                          t={t}
                        />
                      ))}
                    </OfferList>
                  </div>
                )}

                {activeTab === 'current' && (
                  <div
                    role='tabpanel'
                    id='current-offers-panel'
                    aria-labelledby='current-offers-tab'
                  >
                    <OfferTabDescription>
                      {t('CURRENT_OFFERS_HELP', 'Review or remove discounts applied to this cart.')}
                    </OfferTabDescription>
                    <OfferList>
                      {currentOffers.length === 0 && (
                        <OfferState>
                          <FaTag />
                          <strong>{t('NO_CURRENT_OFFERS', 'No offers applied yet')}</strong>
                          <span>{t('NO_CURRENT_OFFERS_HELP', 'Choose an available offer or enter a coupon code above.')}</span>
                        </OfferState>
                      )}

                      {currentOffers.map(offer => (
                        <CurrentOfferCard
                          key={offer.id || offer.coupon || offer.code || offer.name}
                          offer={offer}
                          isCoupon={Boolean(offer.isCoupon)}
                          removingOfferId={removingOfferId}
                          onRemove={onRemoveOffer}
                          t={t}
                        />
                      ))}
                    </OfferList>
                  </div>
                )}
              </CouponSection>
            )}
          </CouponModalContent>
        </Modal>
      )}
      <Confirm
        title={pendingRemoval?.type === 'offer' ? t('OFFER', 'Offer') : t('COUPON', 'Coupon')}
        content={confirm?.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={confirm?.open}
        onClose={handleClose}
        onCancel={!confirm?.error ? handleClose : null}
        onAccept={handleOnAccept}
        closeOnBackdrop={false}
      />
    </CouponContainer>
  )
}

export const CouponControl = (props) => {
  const couponProp = {
    ...props,
    UIComponent: CouponControlUI
  }
  return (
    <CouponController {...couponProp} />
  )
}
