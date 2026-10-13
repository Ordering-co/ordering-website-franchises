import { describe, expect, it } from 'vitest'
import { deliveryTypes, orderStatuesList, statusToShow } from './constants'

describe('OrderProgress constants', () => {
  it('lists delivery, completed and visible statuses', () => {
    expect(deliveryTypes).toEqual([1, 7])
    expect(orderStatuesList.completed).toEqual([1, 11, 15])
    expect(orderStatuesList.pending).toContain(0)
    expect(orderStatuesList.inProgress).toContain(7)
    expect(orderStatuesList.cancelled).toContain(2)
    expect(statusToShow).toContain(0)
    expect(statusToShow).toContain(26)
  })
})
