// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBQ0F0cuCl3_NRrC6QRRDpjj_GgjiqIuhA",
  authDomain: "notifpractice-ae5d9.firebaseapp.com",
  projectId: "notifpractice-ae5d9",
  messagingSenderId: "321401518633",
  appId: "1:1:321401518633:web:2982477f6924629c317a38",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // payload.notification OR payload.data
  const title =
    payload.notification?.title || payload.data?.title || "Notification";
  const body = payload.notification?.body || payload.data?.message || "";
  const opts = {
    body,
    icon: "/notification-icon.png",
    data: payload.data || {},
  };
  self.registration.showNotification(title, opts);
});
