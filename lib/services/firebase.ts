import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase (only once): guard prevents re-initialization in Next.js where modules can be evaluated multiple times
// exports the raw Firebase app instance. Rarely used directly, but needed as a dependency by the other services.
export const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0]

// Export auth service
export const auth = getAuth(app)  //Firebase Auth service for the browser. Use this anywhere you need to sign users in, sign them out, or watch auth state on the client side.
export const db = getFirestore(app)  //Firestore database client for the browser. Use this to read/write documents from client components.
