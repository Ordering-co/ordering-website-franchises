import React, { useEffect } from 'react'
import { useTheme } from 'styled-components'
import { withRouter } from 'react-router-dom'

/**
 * First path segments that belong to app pages (not path-style business URLs).
 * Keep in sync with top-level routes in App.js.
 */
const RESERVED_PATH_SEGMENTS = new Set([
  'home',
  'order_types',
  'wallets',
  'signup_business',
  'signup-driver',
  'password',
  'reset_password',
  'account',
  'profile',
  'verify',
  'messages',
  'help',
  'promotions',
  'checkout',
  'multi-checkout',
  'multi-cart',
  'multi-orders',
  'orders',
  'pages',
  'favorite',
  'login',
  'reward',
  'sessions',
  'store',
  'business_search'
])

/**
 * Business / product listing paths where scroll position must be preserved
 * (including path-style templates without the `/store` prefix).
 */
const isBusinessStorePath = (pathname = '') => {
  if (pathname === '/store' || pathname.startsWith('/store/')) return true

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0 || segments.length > 3) return false
  return !RESERVED_PATH_SEGMENTS.has(segments[0])
}

export const ScrollToTop = withRouter(({ history, children }) => {
  const theme = useTheme()
  const pathsToAvoid = ['/messages']
  const isAvoidMinHeight = pathsToAvoid.some(path => window.location.pathname.includes(path))
  const isStaticPage = window.location.pathname.includes('/help')
  const styles = {
    minHeight: isAvoidMinHeight ? 'auto' : '100vh'
  }
  if (isStaticPage) {
    styles.backgroundColor = theme?.colors?.backgroundPage ?? '#FFF'
  }
  useEffect(() => {
    const unlisten = history.listen((location) => {
      const pathname = location?.pathname || window.location.pathname
      // Preserve scroll on store/product navigation for both:
      // /store/:slug?... and /:business_slug/:category_slug/:product_slug
      if (isBusinessStorePath(pathname)) return
      if (document.querySelector('title#route-business')) return
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return <div style={styles}>{children}</div>
})

export default ScrollToTop
