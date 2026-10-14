import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import settings, { selectedProjectSettings } from '../../../config'
import { ConfigFileProvider, useConfigFile } from '../../../ui/contexts/ConfigFileContext'
import { SubdomainComponent } from '../index'

const chosen = vi.hoisted(() => ({ project: 'testproject', franchiseSlug: 'chosen', api: { url: 'https://api.example.com', language: 'en', version: 'v400' } }))

vi.mock('../../../config', () => ({
  selectedProjectSettings: chosen,
  setRuntimeFranchise: (selection, catalogueOptions) => { settings.franchiseSlug = selection.id; settings.localFranchiseSlug = selection.slug; settings.localCatalogueOptions = catalogueOptions },
  default: {
    project: 'testproject',
    use_project_domain: true,
    use_project_subdomain: false,
    project_error_redirect_url: 'https://error.example.com',
    api: { url: 'https://api.example.com', language: 'en', version: 'v1' }
  }
}))

const Child = ({ settings }) => {
  const [configFile] = useConfigFile()
  return <div data-testid='child-project' data-franchise={settings?.franchiseSlug} data-context-franchise={configFile.franchiseSlug}>{settings?.project ?? 'null'}</div>
}

describe('SubdomainComponent', () => {
  beforeEach(() => {
    window.localStorage.clear()
    settings.localProjectPinned = false
    settings.franchiseSlug = 'chosen'
    chosen.franchiseSlug = 'chosen'
    settings.localStorageError = false
    global.fetch = vi.fn(() => Promise.resolve({
      json: async () => ({ error: false, result: { code: 'resolved-project' } })
    }))
  })

  it('clones the child with the project returned by /current', async () => {
    render(
      <SubdomainComponent>
        <Child />
      </SubdomainComponent>
    )
    await waitFor(() => {
      expect(screen.getByTestId('child-project').textContent).toBe('resolved-project')
    })
  })

  it('falls back to the configured project when /current fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network')))
    render(
      <SubdomainComponent>
        <Child />
      </SubdomainComponent>
    )
    await waitFor(() => {
      expect(['testproject', '_']).toContain(screen.getByTestId('child-project').textContent)
    })
  })
  it('mounts providers only after exact project/slug validation and passes numeric ID', async () => {
    settings.localProjectPinned = true
    window.localStorage.setItem('project', 'old-project')
    global.fetch = vi.fn(async url => ({
      ok: true,
      json: async () => ({ error: false, result: url.endsWith('/current') ? { code: 'testproject' } : url.includes('/configs?') ? { order_types_allowed: { value: '1|2' }, unaddressed_order_types_allowed: { value: '2' }, location_default_latitude: { value: '38' }, location_default_longitude: { value: '-97' } } : [{ slug: 'chosen', id: 23, enabled: true }] })
    }))
    render(<ConfigFileProvider settings={settings}><SubdomainComponent><Child /></SubdomainComponent></ConfigFileProvider>)
    expect(screen.queryByTestId('child-project')).toBeNull()
    await waitFor(() => expect(screen.getByTestId('child-project')).toHaveAttribute('data-franchise', '23'))
    expect(screen.getByTestId('child-project')).toHaveTextContent('testproject')
    expect(screen.getByTestId('child-project')).toHaveAttribute('data-context-franchise', '23')
    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(selectedProjectSettings.franchiseSlug).toBe('chosen')
    expect(settings.localFranchiseSlug).toBe('chosen')
    expect(settings.localCatalogueOptions).toEqual({ type: 2, location: { lat: 38, lng: -97 } })
    expect(window.localStorage.getItem('project')).toBe('old-project')
  })

  it('fails closed on storage isolation failure without reading a global session', async () => {
    settings.localProjectPinned = true
    settings.localStorageError = true
    render(<SubdomainComponent><Child /></SubdomainComponent>)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Unable to open'))
    expect(screen.queryByTestId('child-project')).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('blocks storefront fetches until a franchise has been explicitly chosen', () => {
    settings.localProjectPinned = true
    settings.franchiseSlug = null
    chosen.franchiseSlug = null
    render(<SubdomainComponent><Child /></SubdomainComponent>)
    expect(screen.getByRole('alert')).toHaveTextContent('Configure your franchise storefront')
    expect(screen.queryByTestId('child-project')).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

})
