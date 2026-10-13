import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { baseSessionsUIProps } from '../../../../../test/authTestUtils'
import { SessionsList } from '../index'

const sessionsPropsRef = { current: null }
let sessionsListState = { loading: false, sessions: [] }

vi.mock('~components', () => ({
  Sessions: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...baseSessionsUIProps}
      {...sessionsPropsRef.current}
      sessionsList={sessionsListState}
      {...rest}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback],
  useSession: () => [{ user: { session_strategy: 'jwt_session' } }],
  useUtils: () => [{ parseDate: (value) => value }]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('SessionsList', () => {
  beforeEach(() => {
    sessionsListState = { loading: false, sessions: [] }
    sessionsPropsRef.current = {
      handleDeleteSession: vi.fn(),
      handleDeleteAllSessions: vi.fn()
    }
  })

  it('renders the empty sessions message for jwt strategy', () => {
    const { getByText } = renderWithProviders(<SessionsList />)
    expect(getByText("You don't have any sessions")).toBeInTheDocument()
  })

  it('lists sessions and wires delete all', () => {
    sessionsListState = {
      loading: false,
      sessions: [{ id: 1, created_at: '2026-01-01', valid_thru: '2026-02-01', current: true }]
    }
    const { getByText } = renderWithProviders(<SessionsList />)
    fireEvent.click(getByText('Delete all sessions'))
    fireEvent.click(getByText('Accept'))
    expect(sessionsPropsRef.current.handleDeleteAllSessions).toHaveBeenCalledWith(true)
  })
})
