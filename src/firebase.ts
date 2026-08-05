import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq8A1ufUs2rbKiig9h6OH0B-ametdtXzI",
  authDomain: "elite-logs-market.firebaseapp.com",
  projectId: "elite-logs-market",
  storageBucket: "elite-logs-market.firebasestorage.app",
  messagingSenderId: "985924627673",
  appId: "1:985924627673:web:13c7266b16383bae2ee2c8",
  measurementId: "G-85PJW4MSXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with strict session persistence (expires when browser window/tab closes)
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.warn("Failed to set Firebase Auth browserSessionPersistence on initialization:", err);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;

