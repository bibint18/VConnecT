
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getMessaging,getToken} from 'firebase/messaging'
const firebaseConfig = {
  apiKey: "AIzaSyDShCH3KACf7kMufW-onFzb0c7SvXHb-bs",
  authDomain: "vconnect-963a7.firebaseapp.com",
  projectId: "vconnect-963a7",
  storageBucket: "vconnect-963a7.firebasestorage.app",
  messagingSenderId: "456710168425",
  appId: "1:456710168425:web:be9c031bab9e50182427f8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const messaging = getMessaging(app)
export const googleProvider = new GoogleAuthProvider()
export async function getPushToken(): Promise<string | null> {
  try {
    return await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY });
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}