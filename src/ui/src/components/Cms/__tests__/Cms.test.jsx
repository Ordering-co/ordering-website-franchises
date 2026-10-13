import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { Cms } from '../index'

const cmsPropsRef = { current: {} }
const handleCmsRedirect = vi.fn()

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  CmsContent: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleCmsRedirect={handleCmsRedirect}
      {...rest}
      {...cmsPropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  NotFoundSource: ({ content, btnTitle, onClickButton }) => (
    <div data-testid='not-found'>
      <span>{content}</span>
      <button type='button' onClick={onClickButton}>{btnTitle}</button>
    </div>
  )
}))

describe('Cms', () => {
  it('shows skeletons while the page loads', () => {
    cmsPropsRef.current = { cmsState: { loading: true, error: null, body: null } }
    const { getAllByTestId } = renderWithProviders(<Cms />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('renders cms html body', () => {
    cmsPropsRef.current = { cmsState: { loading: false, error: null, body: '<p>About us</p>' } }
    const { getByText } = renderWithProviders(<Cms />)
    expect(getByText('About us')).toBeInTheDocument()
  })

  it('shows a not found action when cms fails', () => {
    cmsPropsRef.current = { cmsState: { loading: false, error: true, body: null } }
    const { getByTestId, getByText } = renderWithProviders(<Cms />)
    expect(getByTestId('not-found')).toHaveTextContent('Sorry, the selected page was not found.')
    fireEvent.click(getByText('Go to pages list'))
    expect(handleCmsRedirect).toHaveBeenCalled()
  })
})
