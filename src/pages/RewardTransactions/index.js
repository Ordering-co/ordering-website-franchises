import React from 'react'
import { useLocation } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'

import { Transactions as TransactionsController } from '~ui'
import { parseWalletsIdsQuery } from './parseWalletsIdsQuery'

export const RewardTransactions = (props) => {
  const { search } = useLocation()
  const walletsIds = parseWalletsIdsQuery(search)

  const transactionsProps = {
    ...props,
    walletsIds
  }

  return (
    <>
      <HelmetTags page='reward_transactions' />
      <TransactionsController {...transactionsProps} />
    </>
  )
}

export default RewardTransactions
