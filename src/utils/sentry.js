import settings from '../config'

const ALLOWED_DOMAIN = 'orderingplus.com'

export const isAllowedDomain = () => {
  const hostname = window.location.hostname
  return hostname.endsWith(ALLOWED_DOMAIN) && hostname !== 'localhost'
}

export const initSentry = () => {
  try {
    if (!import.meta.env.VITE_SENTRY_RELEASE || !settings.sentry_key || !isAllowedDomain()) return
    return import('./sentrySdk')
      .then((Sentry) => {
        Sentry.init({
          dsn: settings.sentry_key,
          environment: 'production',
          release: `website-franchises@${import.meta.env.VITE_SENTRY_RELEASE}`,
          integrations: [Sentry.browserTracingIntegration()],
          tracesSampleRate: 0.1
        })
      })
      .catch(() => {})
  } catch (_) {}
}
