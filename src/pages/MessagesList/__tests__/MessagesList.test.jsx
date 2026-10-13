import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { MessagesList } from '../index'

const emit = vi.fn()

vi.mock('../../../config', () => ({
  default: { franchiseSlug: 'franchise-a' }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui', () => ({
  MessagesListing: (props) => (
    <div
      data-testid='messages-listing-ui'
      data-franchise-id={String(props.franchiseId)}
      data-disable-filters={String(!!props.disableFilters)}
    >
      <button type='button' onClick={() => props.onRedirectPage({ page: 'messages', params: { id: 1 } })}>redirect</button>
    </div>
  )
}))

describe('MessagesList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders messages helmet tags and wires listing props', () => {
    const { getByTestId } = renderWithProviders(<MessagesList />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'messages')
    expect(getByTestId('messages-listing-ui')).toHaveAttribute('data-franchise-id', 'franchise-a')
    expect(getByTestId('messages-listing-ui')).toHaveAttribute('data-disable-filters', 'true')
  })

  it('emits redirect page event from listing callback', () => {
    const { getByText } = renderWithProviders(<MessagesList />)
    getByText('redirect').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'messages',
      params: { id: 1 }
    })
  })
})
