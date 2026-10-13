import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import theme from '../theme.json'

export const defaultTestTheme = {
  colors: {
    gray200: '#DEE2E6',
    gray300: '#E9ECEF',
    white: '#FFFFFF',
    black: '#000000',
    lightGray: '#F5F5F5',
    darkGray: '#333333',
    error: '#DC3545',
    success: '#28A745',
    links: '#0066CC'
  },
  utils: {
    radius: { s: 4, m: 8, l: 12, xl: 16 },
    tsize: { s: 12, m: 14, l: 16, xl: 24 },
    margins: { t: 8, r: 8, b: 8, l: 8 }
  },
  images: {
    general: {},
    logos: {},
    dummies: { businessLogo: 'logo.png' }
  }
}

export const renderWithProviders = (
  ui,
  { themeOverrides, route = '/', ...options } = {}
) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider
        theme={{
          ...defaultTestTheme,
          ...theme,
          ...themeOverrides,
          colors: {
            ...defaultTestTheme.colors,
            ...theme?.colors,
            ...themeOverrides?.colors
          },
          utils: {
            ...defaultTestTheme.utils,
            ...theme?.utils,
            ...themeOverrides?.utils
          },
          images: {
            ...defaultTestTheme.images,
            ...theme?.images,
            ...themeOverrides?.images
          }
        }}
      >
        {children}
      </ThemeProvider>
    </MemoryRouter>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}
