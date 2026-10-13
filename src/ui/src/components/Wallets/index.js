import React, { useState } from 'react'

import {
  Container,
  TabsContainer
} from './styles'

import {
  WalletList,
  useConfig
} from '~components'

import { Tabs, Tab, Promotions } from '~ui'
import { Redeem } from './Redeem'
import { Utils } from './constants'
import { Status } from './Status'

const WalletsUI = (props) => {
  const {
    walletList,
    userLoyaltyLevel
  } = props

  const { TABS, TABS_OPTIONS } = Utils()
  const [tabState, setTabState] = useState(TABS_OPTIONS.REDEEM)

  return (
    <Container>
      <TabsContainer>
        <Tabs withBackground variant='primary' className='tabs'>
          {TABS.map(tab => (
            <Tab
              withBackground
              className='tab'
              key={tab.type}
              active={tabState === tab.type}
              onClick={() => setTabState(tab.type)}
            >
              {tab?.text}
            </Tab>
          ))}
        </Tabs>
      </TabsContainer>
      {tabState === TABS_OPTIONS.REDEEM && (
        <Redeem
          walletList={walletList}
          isWalletCashEnabled={props.isWalletCashEnabled}
          isWalletPointsEnabled={props.isWalletPointsEnabled}
          transactionsList={props.transactionsList}
        />
      )}
      {tabState === TABS_OPTIONS.STATUS && (
        <Status
          userLoyaltyLevel={userLoyaltyLevel}
          levelList={props.levelList}
        />
      )}
      {tabState === TABS_OPTIONS.OFFERS && (
        <Promotions hideTitle />
      )}
    </Container>
  )
}

export const Wallets = (props) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: WalletsUI,
    notFetchTransactionsInWallets: true,
    fetchLevels: true,
    isWalletCashEnabled,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
