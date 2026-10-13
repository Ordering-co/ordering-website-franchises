import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { FreeDeliveryProgress } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useUtils: () => [{ parsePrice: amount => `$${amount}` }]
}))

describe('FreeDeliveryProgress', () => {
  it.each(['awareness', 'progress', 'unconfirmed', 'unlocked'])('shows %s without an icon', status => {
    const { container } = renderWithProviders(
      <FreeDeliveryProgress status={status} minimum={30} currentAmount={12} remainingAmount={18} progressPercent={40} />
    )

    expect(container.querySelector('svg')).toBeNull()
  })

  it('allows copy and amounts to wrap independently on narrow screens', () => {
    renderWithProviders(<FreeDeliveryProgress status='progress' minimum={30} currentAmount={12} remainingAmount={18} progressPercent={40} variant='compact' />)
    expect(window.getComputedStyle(screen.getByText('$12 / $30').parentElement).flexWrap).toBe('wrap')
  })
  it('does not render hidden eligibility', () => {
    const { container } = renderWithProviders(<FreeDeliveryProgress status='hidden' />)
    expect(container).toBeEmptyDOMElement()
  })

  it('formats the awareness minimum', () => {
    renderWithProviders(<FreeDeliveryProgress status='awareness' minimum={30} />)
    expect(screen.getByText('Free delivery on orders $30+')).toBeInTheDocument()
  })

  it.each(['compact', 'full'])('renders semantic progress in the %s variant', variant => {
    renderWithProviders(<FreeDeliveryProgress status='progress' minimum={30} currentAmount={12} remainingAmount={18} progressPercent={40} variant={variant} />)
    expect(screen.getByText('Add $18 for free delivery')).toBeInTheDocument()
    expect(screen.getByText('$12 / $30')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
  })

  it('announces unlocked and returns to progress when eligibility drops', () => {
    const { rerender } = renderWithProviders(<FreeDeliveryProgress status='unlocked' />)
    expect(screen.getByRole('status')).toHaveTextContent('Free delivery unlocked')
    expect(window.getComputedStyle(screen.getByRole('status')).backgroundColor).toBe('rgb(245, 249, 255)')
    rerender(<FreeDeliveryProgress status='progress' minimum={30} currentAmount={20} remainingAmount={10} progressPercent={66.67} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Add $10 for free delivery')).toBeInTheDocument()
  })

  it('warns without claiming free delivery when the cart has not confirmed the offer', () => {
    renderWithProviders(<FreeDeliveryProgress status='unconfirmed' minimum={30} />)
    expect(screen.getByRole('status')).toHaveTextContent('Free delivery has not been applied to this cart yet')
    expect(screen.queryByText('Free delivery unlocked')).not.toBeInTheDocument()
  })
})
