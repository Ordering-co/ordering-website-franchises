import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SubdomainComponent } from '../index'

vi.mock('../../../config', () => ({
  default: {
    project: 'testproject',
    use_project_domain: true,
    use_project_subdomain: false,
    project_error_redirect_url: 'https://error.example.com',
    api: { url: 'https://api.example.com', language: 'en', version: 'v1' }
  }
}))

const Child = ({ settings }) => (
  <div data-testid='child-project'>{settings?.project ?? 'null'}</div>
)

describe('SubdomainComponent', () => {
  beforeEach(() => {
    window.localStorage.clear()
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
})
