import React from 'react'
import { vi } from 'vitest'

import { renderWithProviders } from './renderWithProviders'

export const createHistoryStub = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  goBack: vi.fn(),
  listen: vi.fn(() => () => {}),
  location: { pathname: '/', search: '', hash: '', state: null },
  ...overrides
})

export const renderPage = (
  Page,
  { route = '/', history, pageProps = {}, ...options } = {}
) => {
  const historyStub = createHistoryStub(history)
  const result = renderWithProviders(
    <Page history={historyStub} {...pageProps} />,
    { route, ...options }
  )
  return { ...result, history: historyStub }
}
