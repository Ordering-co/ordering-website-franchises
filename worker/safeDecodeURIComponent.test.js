import { describe, expect, it } from 'vitest'
import { safeDecodeURIComponent } from './safeDecodeURIComponent.js'

describe('safeDecodeURIComponent', () => {
  it('decodes valid URI components', () => {
    expect(safeDecodeURIComponent('hello%20world')).toBe('hello world')
  })

  it('returns the original value when decoding fails', () => {
    expect(safeDecodeURIComponent('%E0%A4%A')).toBe('%E0%A4%A')
  })
})
