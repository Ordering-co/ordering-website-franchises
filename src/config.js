import baseSettings from './config.json'

const runtimeOverride =
  typeof window !== 'undefined' &&
  window.__CONFIG__ &&
  typeof window.__CONFIG__ === 'object' &&
  !Array.isArray(window.__CONFIG__)
    ? window.__CONFIG__
    : {}

const settings = {
  ...baseSettings,
  ...runtimeOverride,
  api: {
    ...(baseSettings.api || {}),
    ...(runtimeOverride.api || {})
  },
  socket: {
    ...(baseSettings.socket || {}),
    ...(runtimeOverride.socket || {})
  }
}

const keysToNull = [
  'franchiseSlug',
  'businessSlug',
  'store_facebook_pixel_id',
  'store_google_analytics_id',
  'store_segment_id',
  'store_android_id',
  'store_apple_id',
  'store_kindle_id'

]

keysToNull.forEach((key) => {
  if (settings[key] === '0' || settings[key] === 'null') {
    settings[key] = null
  }
})

export default settings
