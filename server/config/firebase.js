const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Construct the credentials object safely
// In production, you might want to use a serviceAccount.json file or specific env variables
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIT_CLIENT_EMAIL,
    // Handle private key newlines correctly
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

if (serviceAccount.projectId && serviceAccount.privateKey) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized");
} else {
    console.warn("Firebase Admin Credentials missing in .env. Auth verification might fail.");
}

module.exports = admin;
