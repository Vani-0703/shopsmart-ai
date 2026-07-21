import admin from "firebase-admin";

// Initializes Firebase Admin using service account credentials from env vars.
// This is used server-side to verify ID tokens issued by Firebase Auth on the frontend.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Render escaped newlines from the .env value into real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;
