import baseSettings from './config.json'
import { isLocalProject, mergeRuntimeSettings, installLocalProjectStorage } from './utils/localProject'

const runtimeOverride =
  typeof window !== 'undefined' &&
  window.__CONFIG__ &&
  typeof window.__CONFIG__ === 'object' &&
  !Array.isArray(window.__CONFIG__)
    ? window.__CONFIG__
    : {}

const pinned = isLocalProject(import.meta.env.DEV, typeof window !== 'undefined' ? window.location.hostname : '', baseSettings)
const settings = mergeRuntimeSettings(baseSettings, runtimeOverride, pinned)

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

// Preserve the configured selector separately from resolved runtime metadata.
export const selectedProjectSettings = {
  ...settings,
  api: { ...settings.api },
  socket: { ...settings.socket }
}
export const setRuntimeFranchise = (selection, catalogueOptions) => {
  settings.franchiseSlug = selection.id
  settings.localFranchiseSlug = selection.slug
  settings.localCatalogueOptions = catalogueOptions
}

if (pinned && typeof window !== 'undefined') {
  try {
    installLocalProjectStorage(selectedProjectSettings, window)
  } catch (error) {
    settings.localStorageError = true
    console.warn('Ordering local storage isolation failed', error.name)
  }
}

export default settings
