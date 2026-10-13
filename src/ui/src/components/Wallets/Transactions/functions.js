import React, { useEffect, useState } from 'react'

import { useApi, useSession, useWebsocket } from '~components'

export const TransactionsController = (props) => {
  const { UIComponent, walletsIds } = props

  const [ordering] = useApi()
  const [{ user, token }] = useSession()
  const socket = useWebsocket()

  const [walletSelected, setWalletSelected] = useState(walletsIds?.[0]?.id ?? null)
  const [transactions, setTransactions] = useState({
    list: null,
    loading: Boolean(walletsIds?.[0]?.id),
    error: null
  })

  const handleChangeOption = (val) => {
    setTransactions({ ...transactions, loading: !transactions.list?.[`wallet:${val}`] })
    setWalletSelected(val)
  }

  const getTransactions = async (walletId) => {
    if (transactions.list?.[`wallet:${walletId}`]) return
    try {
      setTransactions({ ...transactions, loading: true })
      const response = await fetch(
        `${ordering.root}/users/${user.id}/wallets/${walletId}/events?orderBy=-id`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-X': ordering.appId,
            'X-Socket-Id-X': socket?.getId()
          }
        }
      )
      const { error, result } = await response.json()

      setTransactions({
        ...transactions,
        error: error ? result : null,
        list: {
          ...transactions.list,
          [`wallet:${walletId}`]: error ? null : result
        },
        loading: false
      })
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setTransactions({
          ...transactions,
          loading: false,
          error: [err.message]
        })
      }
    }
  }

  useEffect(() => {
    if (walletSelected) {
      getTransactions(walletSelected)
    }
  }, [walletSelected])

  return (
    <UIComponent
      {...props}
      transactions={transactions}
      walletSelected={walletSelected}
      setWalletSelected={handleChangeOption}
    />
  )
}
