import React from 'react'
import Skeleton from 'react-loading-skeleton'

import {
  TransactionsContainer,
  TabsContainer,
  Header,
  ItemContainer,
  ItemDateBlock,
  ItemIcon,
  ItemContent,
  ItemRight
} from './styles'
import { TransactionsController } from './functions'
import { Utils } from '../constants'
import { TransactionItem } from './Item'

import { useLanguage } from '~components'
import { Tabs, Tab, NotFoundSource } from '~ui'

const TransactionsUI = (props) => {
  const {
    walletsIds,
    transactions,
    walletSelected,
    setWalletSelected
  } = props

  const [, t] = useLanguage()
  const { getTransactionsTabs } = Utils()

  const tabs = getTransactionsTabs(walletsIds)

  return (
    <>
      {tabs?.length > 1 && (
        <Header>
          <TabsContainer>
            <Tabs withBackground variant='primary' className='tabs'>
              {tabs.map(tab => (
                <Tab
                  withBackground
                  className='tab'
                  key={tab?.type}
                  active={walletSelected === tab?.type}
                  onClick={() => transactions?.loading ? null : setWalletSelected(tab?.type)}
                >
                  {tab?.text}
                </Tab>
              ))}
            </Tabs>
          </TabsContainer>
        </Header>
      )}
      <TransactionsContainer>
        {!transactions?.loading && !!transactions.list?.[`wallet:${walletSelected}`]?.length && (
          <div className="transaction-list">
            {transactions.list[`wallet:${walletSelected}`].map((item, index) => (
                <TransactionItem
                  key={index}
                  item={item}
                  withFormatPrice={walletsIds?.find((w) => w.id === walletSelected)?.type === 'cash'}
                />
            ))}
          </div>
        )}

        {transactions?.loading && (
          [...Array(6)].map((_, i) => (
            <LoadingComponent key={i} />
          ))
        )}

        {!transactions?.loading && (
          !transactions.list?.[`wallet:${walletSelected}`]?.length ||
          transactions?.error
        ) && (
            <NotFoundSource
              content={transactions?.error
                ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
                : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
              }
            />
        )}
      </TransactionsContainer>
    </>
  )
}

const LoadingComponent = () => {
  return (
    <div className="transaction-list">
      <ItemContainer>
        <ItemDateBlock>
          <div className='left-wrapper'>
            <ItemIcon>
              <Skeleton width={53} height={53} />
            </ItemIcon>
            <ItemRight>
              <ItemContent>
                <Skeleton width={'25vw'} height={40} />
              </ItemContent>
            </ItemRight>
          </div>
          <ItemRight>
            <ItemContent>
              <Skeleton width={'6vw'} height={40} />
            </ItemContent>
          </ItemRight>
        </ItemDateBlock>
      </ItemContainer>
    </div>
  )
}

export const Transactions = (props) => {
  const transactionsProps = {
    ...props,
    UIComponent: TransactionsUI
  }
  return (
    <TransactionsController {...transactionsProps} />
  )
}
