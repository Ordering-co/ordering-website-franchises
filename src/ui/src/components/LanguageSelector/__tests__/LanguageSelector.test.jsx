import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { LanguageSelector } from '../index'

const languagePropsRef = { current: null }
const handleChangeLanguage = vi.fn()

vi.mock('~components', () => ({
  LanguageSelector: ({ UIComponent, ...rest }) => (
    <UIComponent
      languagesState={{
        loading: false,
        languages: [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' }
        ]
      }}
      currentLanguage='en'
      handleChangeLanguage={handleChangeLanguage}
      {...rest}
      {...languagePropsRef.current}
    />
  ),
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => ({
  ...require('../../../../../test/franchiseUiMock').franchiseUiMock,
  generalUtilities: () => ({ handleGoToPage: () => {} }),
  Select: ({ options, defaultValue, onChange }) => (
    <select
      data-testid='language-select'
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
    >
      {(options || []).map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.content}</option>
      ))}
    </select>
  )
}))

describe('LanguageSelector', () => {
  it('renders a language select when more than one language exists', () => {
    const setShowLanguageSelector = vi.fn()
    const { getByTestId, getByText } = renderWithProviders(
      <LanguageSelector showTitle setShowLanguageSelector={setShowLanguageSelector} />
    )
    expect(getByText('Language')).toBeInTheDocument()
    expect(getByTestId('language-select')).toBeInTheDocument()
    fireEvent.change(getByTestId('language-select'), { target: { value: 'es' } })
    expect(handleChangeLanguage).toHaveBeenCalledWith('es')
    expect(setShowLanguageSelector).toHaveBeenCalledWith(true)
  })

  it('hides the selector when only one language is available', () => {
    languagePropsRef.current = {
      languagesState: { loading: false, languages: [{ code: 'en', name: 'English' }] }
    }
    const { queryByTestId } = renderWithProviders(<LanguageSelector />)
    expect(queryByTestId('language-select')).not.toBeInTheDocument()
    languagePropsRef.current = null
  })
})
