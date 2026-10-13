import React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { getUtils } from './utils'

describe('Account utils', () => {
  it('returns a TagOrders svg icon', () => {
    const { TagOrders } = getUtils()
    const { container } = render(<TagOrders />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
