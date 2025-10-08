// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Request permission & return FCM token (or null)
 */
export async function requestFcmToken() {
  try {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers not supported");
      return null;
    }

    // Register service worker (must be at /firebase-messaging-sw.js)
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const currentToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
    return currentToken || null;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}

/**
 * Foreground message listener (use to show in-app toast)
 * usage: onMessageListener(payload => { ... })
 */

export function onMessageListener(callback) {
  return onMessage(messaging, (payload) => callback(payload));
}
