/* global firebase, clients */

self.addEventListener('notificationclick', function (event) {
  var notificationData = event.notification && event.notification.data
  var data = (notificationData && notificationData.FCM_MSG && notificationData.FCM_MSG.data) || notificationData || {}
  event.notification.close()

  var orderUuid = data.order_uuid && data.order_uuid !== 'null' ? data.order_uuid : null
  var targetUrl = orderUuid ? '/orders/' + orderUuid : '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      var client = windowClients.find(function (windowClient) { return 'focus' in windowClient })
      if (client) {
        client.postMessage({ type: 'FIREBASE_PUSH_CLICK', data: data })
        return client.focus()
      }
      return clients.openWindow(targetUrl)
    })
  )
})

importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js')

var config = null
try {
  config = JSON.parse(new URLSearchParams(self.location.search).get('config'))
} catch (error) {
  config = null
}

if (config && config.apiKey) {
  firebase.initializeApp(config)
  firebase.messaging().onBackgroundMessage(function () {})
}
