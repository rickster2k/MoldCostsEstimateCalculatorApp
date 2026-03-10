// lib/services/firebaseAdmin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// key is Lazy initialization - only runs when called, never at build time. As Firebase Admin is never initialized at build time, which prevents deployment failures when environment variables aren't present during the Next.js build step.
function initializeFirebaseAdmin() {
  // Already initialized - return early
  if (getApps().length > 0) {
    return
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY'
    )
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
    storageBucket,
  })
}

// Functions instead of top-level exports
// Each function initializes Firebase Admin on demand

//Function: Returns the Admin Auth service. Use this server-side to verify ID tokens, look up users by UID, set custom claims, etc.
export function getAdminAuth() {
  initializeFirebaseAdmin()
  return getAuth()
}
//Function: Returns the admin firestore instance. Use this in api routes or server actions when needed to read/write to firestore with elevated priveleges
export function getAdminDb() {
  initializeFirebaseAdmin()
  return getFirestore()
}
//Function: Returns the Admin Cloud Storage instance. Use this server-side to upload, delete, or generate signed URLs for files.
export function getAdminStorage() {
  initializeFirebaseAdmin()
  return getStorage()
}