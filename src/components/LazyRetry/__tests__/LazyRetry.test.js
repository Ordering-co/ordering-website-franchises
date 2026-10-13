import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { lazyRetry } from '../index'

describe('lazyRetry', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('resolves when dynamic import succeeds', async () => {
    const module = { default: () => null }
    await expect(lazyRetry(() => Promise.resolve(module))).resolves.toBe(module)
    expect(window.sessionStorage.getItem('retry-lazy-refreshed')).toBe('false')
  })

  it('triggers reload on first import failure', async () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })
    lazyRetry(() => Promise.reject(new Error('chunk failed')))
    await waitFor(() => {
      expect(window.sessionStorage.getItem('retry-lazy-refreshed')).toBe('true')
    })
    expect(reload).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it('rejects when import fails after refresh flag is set', async () => {
    window.sessionStorage.setItem('retry-lazy-refreshed', 'true')
    await expect(lazyRetry(() => Promise.reject(new Error('chunk failed')))).rejects.toThrow('chunk failed')
  })
})
