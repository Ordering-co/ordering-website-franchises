import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { SignUpApproval } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

const baseProps = {
  content: {
    project: 'demo',
    dashboardUrl: 'https://dashboard.example.com',
    dashboardLoginUrl: 'https://dashboard.example.com/login',
    approvalType: 'automatic',
    businessType: 2,
    contactEmail: 'support@example.com'
  },
  onAccept: vi.fn(),
  onCancel: vi.fn()
}

describe('SignUpApproval', () => {
  it('renders automatic business approval content', () => {
    const { getByText } = renderWithProviders(<SignUpApproval {...baseProps} />)
    expect(getByText(/Get in our Dashboard/)).toBeInTheDocument()
    expect(getByText('(demo)')).toBeInTheDocument()
  })

  it('fires accept and cancel callbacks', () => {
    const onAccept = vi.fn()
    const onCancel = vi.fn()
    const { getByText } = renderWithProviders(
      <SignUpApproval {...baseProps} onAccept={onAccept} onCancel={onCancel} />
    )
    fireEvent.click(getByText('Cancel'))
    fireEvent.click(getByText('Accept'))
    expect(onCancel).toHaveBeenCalled()
    expect(onAccept).toHaveBeenCalled()
  })
})
