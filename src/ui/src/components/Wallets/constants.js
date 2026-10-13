import { useLanguage } from '~components'

export const Utils = () => {
  const [, t] = useLanguage()

  const walletName = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet')
    },
    credit_point: {
      name: t('POINTS_WALLET', 'Points Wallet')
    }
  }

  const TABS_OPTIONS = {
    REDEEM: 'redeem',
    STATUS: 'status',
    OFFERS: 'offers'
  }

  const TABS = [
    { type: TABS_OPTIONS.REDEEM, text: t('REDEEM_TAB', 'Redeem'), enabled: true },
    { type: TABS_OPTIONS.STATUS, text: t('MY_STATUS_TAB', 'My Status'), enabled: true },
    { type: TABS_OPTIONS.OFFERS, text: t('OFFERS_TAB', 'Offers'), enabled: true }
  ]

  const getTransactionsTabs = (wallets) => {
    const list = {
      cash: t('TRANSACTION_CASH_SHORT', 'Cash'),
      points: t('TRANSACTION_POINTS_SHORT', 'Points')
    }
    return wallets?.length > 1
      ? wallets.map((wallet) => ({
        type: wallet?.id,
        text: list[wallet?.type],
        enabled: true
      }))
      : []
  }

  return {
    TABS_OPTIONS,
    TABS,
    walletName,
    getTransactionsTabs
  }
}
