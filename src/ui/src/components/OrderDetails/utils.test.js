import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test/renderWithProviders'
import { getUtils } from './utils'

vi.mock('~/utils/parseJsonStorage', () => ({
  parseJsonStorage: () => null
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  getMomentCalendarLocale: () => ({ lastDay: '[Yesterday]' })
}))

describe('OrderDetails utils', () => {
  it('exposes setLocalMoment', () => {
    const Probe = () => {
      const { setLocalMoment } = getUtils()
      setLocalMoment()
      return <div>utils ready</div>
    }
    const { getByText } = renderWithProviders(<Probe />)
    expect(getByText('utils ready')).toBeInTheDocument()
  })
})
