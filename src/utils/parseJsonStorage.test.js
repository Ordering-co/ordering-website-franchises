import { describe, expect, it } from 'vitest'

import { parseJsonStorage } from './parseJsonStorage'

describe('parseJsonStorage', () => {
  it('returns null for missing or empty storage values', () => {
    expect(parseJsonStorage(null)).toBeNull()
    expect(parseJsonStorage('')).toBeNull()
  })

  it('does not throw when stored JSON is invalid', () => {
    expect(() => parseJsonStorage('{not-json')).not.toThrow()
    expect(parseJsonStorage('{not-json')).toBeNull()
    expect(parseJsonStorage('undefined')).toBeNull()
  })

  it('returns parsed objects and arrays', () => {
    expect(parseJsonStorage('{"id":9}')).toEqual({ id: 9 })
    expect(parseJsonStorage('[{"enabled":true}]')).toEqual([{ enabled: true }])
  })
})
