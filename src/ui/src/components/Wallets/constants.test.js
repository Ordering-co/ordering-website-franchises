import { describe, expect, it, vi } from 'vitest'
import { Utils } from './constants'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('Wallets constants', () => {
  it('exposes tab labels and wallet names', () => {
    const utils = Utils()
    expect(utils.TABS_OPTIONS.REDEEM).toBe('redeem')
    expect(utils.TABS.map((tab) => tab.type)).toEqual(['redeem', 'status', 'offers'])
    expect(utils.walletName.cash.name).toBe('Cash Wallet')
    expect(utils.walletName.credit_point.name).toBe('Points Wallet')
  })

  it('builds transaction tabs only when more than one wallet exists', () => {
    const { getTransactionsTabs } = Utils()
    expect(getTransactionsTabs([{ id: 10, type: 'cash' }])).toEqual([])
    expect(getTransactionsTabs([
      { id: 10, type: 'cash' },
      { id: 11, type: 'points' }
    ])).toEqual([
      { type: 10, text: 'Cash', enabled: true },
      { type: 11, text: 'Points', enabled: true }
    ])
  })
})
