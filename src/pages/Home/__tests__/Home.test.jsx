import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { HomePage } from '../index'

const push = vi.fn()
const mockPagesGet = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~components', () => ({
  useApi: () => [{
    pages: vi.fn(() => ({ get: mockPagesGet }))
  }]
}))
vi.mock('~ui', () => ({
  HomeHero: ({ onFindBusiness }) => (
    <div data-testid='home-hero'>
      <button type='button' onClick={onFindBusiness}>find-business</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push })
  }
})

const themeWithHomeContent = {
  my_products: {
    components: {
      theme_settings: {
        components: {
          values: {
            homepage_content: '<p>Theme home content</p>'
          }
        }
      }
    }
  }
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPagesGet.mockResolvedValue({
      content: {
        error: null,
        result: { body: '<p>API home content</p>' }
      }
    })
  })

  it('renders HomeHero and helmet tags', () => {
    const { getByTestId } = renderWithProviders(<HomePage />, {
      themeOverrides: themeWithHomeContent
    })
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'home')
    expect(getByTestId('home-hero')).toBeInTheDocument()
  })

  it('loads CMS home content from the API', async () => {
    const { container } = renderWithProviders(<HomePage />, {
      themeOverrides: { my_products: { components: { theme_settings: { components: { values: {} } } } } }
    })
    await waitFor(() => {
      expect(container.innerHTML).toContain('API home content')
    })
    expect(mockPagesGet).toHaveBeenCalled()
  })

  it('falls back to theme homepage content when the API has no body', async () => {
    mockPagesGet.mockResolvedValue({
      content: { error: true, result: null }
    })
    const { container } = renderWithProviders(<HomePage />, {
      themeOverrides: themeWithHomeContent
    })
    await waitFor(() => {
      expect(container.innerHTML).toContain('Theme home content')
    })
  })

  it('navigates to search when find business is clicked', () => {
    const { getByText } = renderWithProviders(<HomePage />, {
      themeOverrides: themeWithHomeContent
    })
    getByText('find-business').click()
    expect(push).toHaveBeenCalledWith('/search')
  })
})
