import { describe, expect, it } from 'vitest'

import { isCombinedDeliveryFeeEnabled, parseDriverTipOptions } from './parseDriverTipOptions'

describe('parseDriverTipOptions', () => {
  it("does not throw when config JSON is invalid and returns", () => {
    expect(() => parseDriverTipOptions('{not-json')).not.toThrow()
    expect(parseDriverTipOptions('{not-json')).toEqual([])
    expect(parseDriverTipOptions('')).toEqual([])
    expect(parseDriverTipOptions(undefined)).toEqual([])
  })

  it('returns a JSON array or an in-memory array', () => {
    expect(parseDriverTipOptions('[0,10,15]')).toEqual([0, 10, 15])
    expect(parseDriverTipOptions([0, 10, 15])).toEqual([0, 10, 15])
  })

  it("returns when parsed JSON is not an array", () => {
    expect(parseDriverTipOptions('{"tip":10}')).toEqual([])
    expect(parseDriverTipOptions('null')).toEqual([])
  })
})

describe('isCombinedDeliveryFeeEnabled', () => {
  it('is true only for the combined delivery fee flag value 1', () => {
    expect(isCombinedDeliveryFeeEnabled('1')).toBe(true)
    expect(isCombinedDeliveryFeeEnabled('0')).toBe(false)
    expect(isCombinedDeliveryFeeEnabled(undefined)).toBe(false)
  })
})
