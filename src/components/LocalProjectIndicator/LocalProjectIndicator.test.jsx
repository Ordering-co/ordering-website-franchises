import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocalProjectIndicator } from './index'

vi.mock('../../config', () => ({ default: {}, selectedProjectSettings: {} }))

describe('local selected project indicator', () => {
  it('shows the public selected project and slug while SDK has the numeric ID', () => {
    render(<LocalProjectIndicator selected={{ project: 'selected-project', franchiseSlug: 1 }} runtime={{ localProjectPinned: true, franchiseSlug: 1, localFranchiseSlug: 'chosen-franchise' }} />)
    expect(screen.getByRole('status')).toHaveTextContent('Project: selected-project · Franchise: chosen-franchise')
  })

  it('is absent in production', () => {
    render(<LocalProjectIndicator selected={{ project: 'selected-project', franchiseSlug: 'chosen-franchise' }} runtime={{ localProjectPinned: false }} />)
    expect(screen.queryByRole('status')).toBeNull()
  })
})
