import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '../renderWithProviders'
import { createHistoryStub, renderPage } from '../renderPage'

const Probe = () => <p>harness-ok</p>
const PageProbe = () => <p>page-ok</p>

describe('F1 harness', () => {
  it('renders with theme and router providers', () => {
    const { getByText } = renderWithProviders(<Probe />)
    expect(getByText('harness-ok')).toBeTruthy()
  })

  it('renders a page with a history stub', () => {
    const { getByText, history } = renderPage(PageProbe)
    expect(getByText('page-ok')).toBeTruthy()
    expect(typeof history.push).toBe('function')
  })

  it('creates a history stub with overrides', () => {
    const push = vi.fn()
    const history = createHistoryStub({ push })
    expect(history.push).toBe(push)
    expect(history.location.pathname).toBe('/')
  })
})
