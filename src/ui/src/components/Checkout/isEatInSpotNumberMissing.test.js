import { describe, expect, it } from 'vitest'

import { isEatInSpotNumberMissing } from './isEatInSpotNumberMissing'

describe('isEatInSpotNumberMissing', () => {
  it('stays missing when only the unsaved keystroke value is present', () => {
    expect(isEatInSpotNumberMissing({
      tableNumberEnabled: '1',
      orderType: 3,
      cartSpotNumber: null,
      cartStateSpotNumber: null,
      placeSpotNumber: 12
    })).toBe(true)
  })

  it('is not missing when the cart has a saved spot number', () => {
    expect(isEatInSpotNumberMissing({
      tableNumberEnabled: '1',
      orderType: 3,
      cartSpotNumber: 4,
      cartStateSpotNumber: null,
      placeSpotNumber: null
    })).toBe(false)
  })

  it('is not missing when cart state has a saved spot number', () => {
    expect(isEatInSpotNumberMissing({
      tableNumberEnabled: '1',
      orderType: 3,
      cartSpotNumber: null,
      cartStateSpotNumber: 7,
      placeSpotNumber: null
    })).toBe(false)
  })

  it('does not block delivery or when table numbers are disabled', () => {
    expect(isEatInSpotNumberMissing({
      tableNumberEnabled: '1',
      orderType: 1,
      cartSpotNumber: null,
      cartStateSpotNumber: null
    })).toBe(false)
    expect(isEatInSpotNumberMissing({
      tableNumberEnabled: '0',
      orderType: 3,
      cartSpotNumber: null,
      cartStateSpotNumber: null
    })).toBe(false)
  })
})
