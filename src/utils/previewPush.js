export const webPushAllowed = settings => !settings.localProjectPinned

// The SDK is loaded only for production push initialization. Local preview must
// not request notification permission, register workers or subscribe a user.
export const getProductionOneSignal = (settings, browser, document) => {
  if (!webPushAllowed(settings)) return null
  const oneSignal = browser.OneSignal = browser.OneSignal || []
  if (!document.querySelector('script[data-ordering-push-sdk]')) {
    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    script.async = true
    script.dataset.orderingPushSdk = 'onesignal'
    document.head.appendChild(script)
  }
  return oneSignal
}
