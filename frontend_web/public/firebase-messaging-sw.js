importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDnyge9nwe2AxIYn9Ld9uPGaH0DLXBN6wI",
    authDomain: "projectsync-42056.firebaseapp.com",
    projectId: "projectsync-42056",
    storageBucket: "projectsync-42056.firebasestorage.app",
    messagingSenderId: "281199652070",
    appId: "1:281199652070:web:baf3cd6af4ff1cb2d41f27"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle =
    payload.notification.title || "ProjectSync Notification";
  const notificationOptions = {
    body: payload.notification.body || "New update in ProjectSync",
    icon: "/icons/notification-icon.png",
    badge: "/icons/badge-icon.png", 
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker activated");
  return self.clients.claim();
});
