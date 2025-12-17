import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARS_k_0M_cdC-x9RC7cozz3v6eYHhMfnw",
  authDomain: "iacg-psychometric-test-admin.firebaseapp.com",
  projectId: "iacg-psychometric-test-admin",
  storageBucket: "iacg-psychometric-test-admin.firebasestorage.app",
  messagingSenderId: "1020025340550",
  appId: "1:1020025340550:web:2e1cf7d7311d2417a38707"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

