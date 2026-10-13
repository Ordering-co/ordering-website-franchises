const React = require('react')

const passthrough = (name) => {
  const Component = ({ UIComponent, children, ...rest }) => (
    UIComponent
      ? React.createElement(UIComponent, rest, children)
      : null
  )
  Component.displayName = name
  return Component
}

const franchiseComponentsMock = {
  useLanguage: () => [{}, (key, fallback) => fallback ?? key],
  useConfig: () => [{ configs: {} }],
  useSession: () => [{ auth: false, user: {} }, { login: () => {} }],
  useToast: () => [null, { showToast: () => {} }],
  useEvent: () => [{ emit: () => {} }],
  useApi: () => [{}, {}],
  useSite: () => [{ site: {} }],
  useOrder: () => [{}, {}],
  useOptimizationLoad: () => [{ loading: false, result: { configs: {} } }],
  ToastType: { Error: 'error', Success: 'success' },
  ReCaptcha: () => null
}

module.exports = new Proxy(franchiseComponentsMock, {
  get (target, prop) {
    if (prop in target) return target[prop]
    if (prop === '__esModule') return true
    if (typeof prop === 'symbol') return target[prop]
    return passthrough(String(prop))
  }
})
