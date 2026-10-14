import { describe, expect, it } from 'vitest'

import { parseOrderTypesAllowed } from './parseOrderTypesAllowed'

describe('parseOrderTypesAllowed', () => {
  it('does not throw when the config value is missing and returns', () => {
    expect(() => parseOrderTypesAllowed(undefined)).not.toThrow()
    expect(parseOrderTypesAllowed(undefined)).toEqual([])
    expect(parseOrderTypesAllowed(null)).toEqual([])
    expect(parseOrderTypesAllowed('')).toEqual([])
  })

  it('parses pipe-separated values into numbers', () => {
    expect(parseOrderTypesAllowed('1|2|5')).toEqual([1, 2, 5])
    expect(parseOrderTypesAllowed('3')).toEqual([3])
  })
})
