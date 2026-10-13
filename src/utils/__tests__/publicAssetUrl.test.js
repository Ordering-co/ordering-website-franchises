import { describe, expect, it } from 'vitest'
import { publicAssetUrl } from '../publicAssetUrl'

describe('publicAssetUrl', () => {
  it('returns nullish paths unchanged', () => {
    expect(publicAssetUrl(null)).toBeNull()
    expect(publicAssetUrl('')).toBe('')
  })

  it('leaves absolute and data URLs unchanged', () => {
    expect(publicAssetUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
    expect(publicAssetUrl('//cdn.example.com/a.png')).toBe('//cdn.example.com/a.png')
    expect(publicAssetUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
    expect(publicAssetUrl('blob:abc')).toBe('blob:abc')
  })

  it('prefixes root-relative paths with base', () => {
    expect(publicAssetUrl('/assets/logo.svg')).toBe('/assets/logo.svg')
    expect(publicAssetUrl('assets/logo.svg')).toBe('/assets/logo.svg')
  })
})
