import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../test/renderWithProviders'
import { CardFormCustom } from '../index'

vi.mock('react-credit-cards-2/es/styles-compiled.css', () => ({}))
vi.mock('react-credit-cards-2', () => ({
  default: () => <div data-testid='credit-card-preview' />
}))
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => fn,
    register: () => null,
    errors: {},
    formState: { errors: {} }
  })
}))
vi.mock('~components', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui', () => require('../../../../../test/franchiseUiMock').franchiseUiMock)

describe('CardFormCustom', () => {
  it('renders custom card form fields', () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWithProviders(
      <CardFormCustom handleNewCard={vi.fn()} setAddCardOpen={vi.fn()} />
    )
    expect(getByTestId('credit-card-preview')).toBeInTheDocument()
    expect(getByPlaceholderText('Card number')).toBeInTheDocument()
    expect(getByText('Save')).toBeInTheDocument()
  })
})
