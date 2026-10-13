import { describe, expect, it, vi } from 'vitest'

import {
  getUrlWithoutSpoonityToken,
  stripSpoonityTokenFromHistory
} from './stripSpoonityIntegrationToken'

describe('getUrlWithoutSpoonityToken', () => {
  it('removes integration_token and keeps other query params', () => {
    expect(getUrlWithoutSpoonityToken(
      'https://store.example.com/profile/orders?integration_code=spoonity&integration_token=secret'
    )).toBe('/profile/orders?integration_code=spoonity')
  })

  it('keeps hash and unrelated params', () => {
    expect(getUrlWithoutSpoonityToken(
      'https://store.example.com/store/pizza?lat=1&integration_token=secret&lng=2#menu'
    )).toBe('/store/pizza?lat=1&lng=2#menu')
  })

  it('returns the current path when the token is absent', () => {
    expect(getUrlWithoutSpoonityToken(
      'https://store.example.com/profile/orders?view=past'
    )).toBe('/profile/orders?view=past')
  })

  it('does not throw on invalid href', () => {
    expect(() => getUrlWithoutSpoonityToken('not a url')).not.toThrow()
    expect(getUrlWithoutSpoonityToken('not a url')).toBe('not a url')
  })
})

describe('stripSpoonityTokenFromHistory', () => {
  it('replaceState removes integration_token from the current history entry', () => {
    const replaceState = vi.fn()
    stripSpoonityTokenFromHistory({
      href: 'https://store.example.com/profile/orders?integration_code=spoonity&integration_token=secret',
      historyState: { page: 1 },
      replaceState
    })
    expect(replaceState).toHaveBeenCalledWith(
      { page: 1 },
      '',
      '/profile/orders?integration_code=spoonity'
    )
  })

  it('does not replaceState when integration_token is missing', () => {
    const replaceState = vi.fn()
    stripSpoonityTokenFromHistory({
      href: 'https://store.example.com/profile/orders',
      historyState: null,
      replaceState
    })
    expect(replaceState).not.toHaveBeenCalled()
  })
})
