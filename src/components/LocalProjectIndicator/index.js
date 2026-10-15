import React from 'react'
import settings, { selectedProjectSettings } from '../../config'

// Local setup status only; production renders no badge or development copy.
export const LocalProjectIndicator = ({ selected = selectedProjectSettings, runtime = settings }) => {
  if (!runtime.localProjectPinned) return null
  return (
    <div role='status' aria-label='Selected Ordering project and franchise' style={{ padding: '8px 16px', background: '#f4f4f4', color: '#333', font: '14px sans-serif' }}>
      Project: <strong>{selected.project}</strong> · Franchise: <strong>{runtime.localFranchiseSlug || selected.franchiseSlug}</strong>
    </div>
  )
}
