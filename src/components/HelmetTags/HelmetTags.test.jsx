/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'

import { HelmetTags } from './index'

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
  useConfig: () => [configState]
}))

const theme = {
  my_products: {
    components: {
      website_settings: {
        components: {
          values: {
            name: 'CloudyJAYS',
            description: 'Franchise site'
          }
        }
      }
    }
  }
}

describe('HelmetTags white label', () => {
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
    delete window.__SEO__
    delete window.__FIRST_LOAD__
  })

  it('does not append Powered by Orderingplus when white label is on', async () => {
    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <HelmetTags page='home' />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toContain('Home')
    })

    expect(document.title).not.toContain('Powered by Orderingplus')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content') || '')
      .not.toContain('Powered by Orderingplus')
  })

  it('keeps Powered by Orderingplus on title and meta when white label is off', async () => {
    configState.configs = { ...enterpriseWhiteLabelOff }

    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <HelmetTags page='home' />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toContain('Powered by Orderingplus')
    })

    expect(document.querySelector('meta[name="description"]')?.getAttribute('content') || '')
      .toContain('Powered by Orderingplus')
  })

  it('replaces the default Ordering tab title with My Brand when white label is on and the site has no name', async () => {
    document.title = 'Ordering'

    await act(async () => {
      root.render(
        <ThemeProvider theme={{}}>
          <HelmetTags />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toBe('My Brand')
    })
  })

  it('uses worker SEO title once and strips Powered by when white label is on', async () => {
    window.history.replaceState({}, '', '/')
    window.__SEO__ = {
      title: 'CloudyJAYS - Home - Powered by Orderingplus',
      description: 'CMS description Powered by Orderingplus',
      pathname: '/'
    }

    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <HelmetTags page='home' />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toContain('Home')
    })

    expect(document.title.match(/CloudyJAYS/g)).toHaveLength(1)
    expect(document.title).not.toContain('Powered by Orderingplus')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content') || '')
      .toBe('CMS description')
  })

  it('ignores worker SEO after client-side navigation', async () => {
    window.history.replaceState({}, '', '/login')
    window.__SEO__ = {
      title: 'Stale SEO Title',
      description: 'Stale SEO description',
      pathname: '/'
    }

    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <HelmetTags page='login' />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toContain('Login')
    })

    expect(document.title).not.toContain('Stale SEO Title')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content') || '')
      .not.toContain('Stale SEO description')
  })

  it('does not append Powered by when only first-load features enable white label', async () => {
    configState.configs = { powered_by_ordering_module: { value: true } }
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: { value: true } }
    }

    await act(async () => {
      root.render(
        <ThemeProvider theme={theme}>
          <HelmetTags page='home' />
        </ThemeProvider>
      )
    })

    await vi.waitFor(() => {
      expect(document.title).toContain('Home')
    })

    expect(document.title).not.toContain('Powered by Orderingplus')
  })
})
