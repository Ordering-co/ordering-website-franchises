import { describe, expect, it } from 'vitest'

import { parseWalletsIdsQuery } from './parseWalletsIdsQuery'

describe('parseWalletsIdsQuery', () => {
  it('returns an empty array when walletsIds is missing', () => {
    expect(parseWalletsIdsQuery('/reward/transactions')).toEqual([])
    expect(parseWalletsIdsQuery('')).toEqual([])
  })

  it('returns an empty array when walletsIds is empty or invalid JSON', () => {
    expect(() => parseWalletsIdsQuery('?walletsIds=')).not.toThrow()
    expect(parseWalletsIdsQuery('?walletsIds=')).toEqual([])
    expect(parseWalletsIdsQuery('?walletsIds=not-json')).toEqual([])
  })

  it('returns an empty array when walletsIds is not a JSON array', () => {
    expect(parseWalletsIdsQuery('?walletsIds=%7B%22id%22%3A1%7D')).toEqual([])
  })

  it('returns the parsed wallet list when walletsIds is a JSON array', () => {
    const wallets = [{ id: 7, type: 'cash', active: true }]
    expect(parseWalletsIdsQuery(`?walletsIds=${encodeURIComponent(JSON.stringify(wallets))}`)).toEqual(wallets)
  })
})
