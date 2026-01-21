const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

if (!admin.apps.length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn("Firebase Admin Credentials missing in .env. Auth verification might fail.");
  } else {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin Initialized");
  }
}

module.exports = admin;
