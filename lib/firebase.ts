// Single Firebase client module for the whole app.
// Replaces the 7+ duplicated inline configs from the vanilla site.
// These NEXT_PUBLIC_* values are public-by-design Firebase web keys —
// real protection comes from Firestore Security Rules, not secrecy.
//
// LAZY BY DESIGN: the SDK is initialized on first use (always in the browser), never at
// module import. Importing this file during server prerender/SSR must not call getAuth()/
// getFirestore(), because when the NEXT_PUBLIC_* keys are absent at build time getAuth()
// throws `auth/invalid-api-key` — and a throw during static generation fails the ENTIRE
// `next build`, leaving no deployment so every route (even `/`) returns a platform 404.
// Deferring init keeps prerender safe; the keys are only ever needed by client code.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // Correct bucket: r7nttconaf.firebasestorage.app
  // (the legacy dashboard.js had a "r7nttcmis" typo — fixed here once and for all).
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

function firebaseApp(): FirebaseApp {
  return (appInstance ??= getApps().length ? getApp() : initializeApp(firebaseConfig));
}

/** Firebase Auth handle — initialized lazily on first call (browser only). */
export function getAuthClient(): Auth {
  return (authInstance ??= getAuth(firebaseApp()));
}

/** Firestore handle — initialized lazily on first call (browser only). */
export function getDb(): Firestore {
  return (dbInstance ??= getFirestore(firebaseApp()));
}
