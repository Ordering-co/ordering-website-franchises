/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'

import { Footer } from './index'

const whiteLabelOn = {
  white_label_franchise_module: { value: true },
  powered_by_ordering_module: { value: true }
}

const enterpriseWhiteLabelOff = {
  white_label_franchise_module: { value: false },
  powered_by_ordering_module: { value: true },
  plan_enterprise: { value: true }
}

const configState = {
  configs: { ...whiteLabelOn }
}

vi.mock('~components', () => ({
  useConfig: () => [configState],
  useApi: () => [{
    project: 'cloudyjays',
    pages: () => ({
      get: () => Promise.resolve({ content: { error: true, result: [] } })
    })
  }],
  useLanguage: () => [{ language: {} }, (key, fallback) => fallback]
}))

describe('Footer white label', () => {
  let container
  let root

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    configState.configs = { ...whiteLabelOn }
    window.__CONFIG__ = { disable_powered_by: false }
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
    delete window.__CONFIG__
    delete window.__FIRST_LOAD__
  })

  it('does not render the Orderingplus footer link when white label is on', async () => {
    await act(async () => {
      root.render(
        <ThemeProvider theme={{}}>
          <Footer />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(container.querySelector('a[href="https://www.orderingplus.com/"]')).toBeNull()
    })
  })

  it('renders the Orderingplus footer link when white label is off on an enterprise tenant', async () => {
    configState.configs = { ...enterpriseWhiteLabelOff }

    await act(async () => {
      root.render(
        <ThemeProvider theme={{}}>
          <Footer />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(container.querySelector('a[href="https://www.orderingplus.com/"]')).not.toBeNull()
    })
  })

  it('does not render the Orderingplus footer link when only first-load features enable white label', async () => {
    configState.configs = { powered_by_ordering_module: { value: true } }
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: { value: true } }
    }

    await act(async () => {
      root.render(
        <ThemeProvider theme={{}}>
          <Footer />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(container.querySelector('a[href="https://www.orderingplus.com/"]')).toBeNull()
    })
  })
})
