// backend/services/firebaseAdmin.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  // Option A: use local serviceAccount.json (development)
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // Option B: use base64-encoded JSON from env (useful for deploy)
    serviceAccount = JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString()
    );
  } else {
    serviceAccount = require("./serviceAccount.json"); // dev ONLY
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
