import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { TrophyFill } from 'react-bootstrap-icons'

import {
  TabContainer,
  RedeemHeader,
  RedeemContent,
  Divider
} from '../styles'
import { Utils } from '../constants'
import { GiftCardUI } from '../../GiftCard/GiftCardUI'

import { useConfig, useLanguage, useUtils, useEvent } from '~components'

export const Redeem = (props) => {
  const {
    walletList,
    isWalletCashEnabled,
    isWalletPointsEnabled
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice }] = useUtils()
  const [events] = useEvent()

  const { walletName } = Utils()

  const cashWallet = walletList?.wallets?.find(wallet => wallet.type === 'cash')
  const creditWallet = walletList?.wallets?.find(wallet => wallet.type === 'credit_point')
  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const walletsIds = [
    { type: 'cash', id: cashWallet?.id, active: isWalletCashEnabled },
    { type: 'points', id: creditWallet?.id, active: isWalletPointsEnabled }
  ]

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  return (
    <>
      <TabContainer>
        {!walletList?.loading && !walletList?.error && isWalletPointsEnabled && (
          <RedeemHeader>
            <div className='icon'>
              <TrophyFill />
            </div>
            <div>
              {t('SPECIAL_MEMBER', 'SPECIAL MEMBER')}
            </div>
            <div className='balance'>
              {creditWallet?.balance}
            </div>
            <div className='available-points'>
              {t('AVAILABLE_POINTS_TO_REDEEM', 'Available points to redeem')}
            </div>
          </RedeemHeader>
        )}
        {!walletList?.loading && !walletList?.error && (isWalletCashEnabled || isWalletPointsEnabled) && (
          <RedeemContent>
            {isWalletCashEnabled && (
              <div className='reedem-cash'>
                <div>
                  {walletName.cash.name}
                </div>
                <div>
                  {parsePrice(cashWallet?.balance)} {configs?.stripe_currency?.value}
                </div>
              </div>
            )}
            <div
              className='transaction-list'
              onClick={() =>
                handleGoToPage({
                  page: 'reward_transanctions',
                  search: `?walletsIds=${JSON.stringify(walletsIds.filter(wallet => wallet.active))}`
                })
              }
            >
              <div className='unterline-text'>
                {t('TRANSACTION_LIST', 'Transaction List')}
              </div>
            </div>
            <Divider />
          </RedeemContent>
        )}
        {walletList?.loading && (
          <div className='skeleton'>
            <div>
              <div>
                <Skeleton height={'30vh'} width={'55vw'} />
              </div>
            </div>
          </div>
        )}
        {!walletList?.loading && !walletList?.error && !isGiftCardDisabled && (
          <GiftCardUI />
        )}

      </TabContainer>
    </>
  )
}
