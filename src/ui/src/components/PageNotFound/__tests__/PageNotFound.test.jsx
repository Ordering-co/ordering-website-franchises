import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { PageNotFound } from '../index'

vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} })
}))

describe('PageNotFound', () => {
  it('always renders the page not found title', () => {
    const { getByText, queryByAltText } = renderWithProviders(<PageNotFound />)
    expect(getByText('PAGE NOT FOUND')).toBeInTheDocument()
    expect(queryByAltText('lighting')).not.toBeInTheDocument()
    expect(queryByAltText('error404')).not.toBeInTheDocument()
  })

  it('renders optional theme images', () => {
    const { getByAltText, getByText } = renderWithProviders(
      <PageNotFound />,
      {
        themeOverrides: {
          images: {
            general: {
              notFound404: '404.png',
              notFoundLighting: 'light.png'
            }
          }
        }
      }
    )
    expect(getByText('PAGE NOT FOUND')).toBeInTheDocument()
    expect(getByAltText('lighting')).toHaveAttribute('src', 'light.png')
    expect(getByAltText('error404')).toHaveAttribute('src', '404.png')
  })
})
