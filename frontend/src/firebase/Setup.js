import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyDShCH3KACf7kMufW-onFzb0c7SvXHb-bs",
    authDomain: "vconnect-963a7.firebaseapp.com",
    projectId: "vconnect-963a7",
    storageBucket: "vconnect-963a7.firebasestorage.app",
    messagingSenderId: "456710168425",
    appId: "1:456710168425:web:be9c031bab9e50182427f8"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
