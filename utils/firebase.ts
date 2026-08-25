import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCV8aTt2E-2D1d0SUIlrw0u1xkDwPnBK0M",
  authDomain: "iacg-mcq-assessment-test.firebaseapp.com",
  projectId: "iacg-mcq-assessment-test",
  storageBucket: "iacg-mcq-assessment-test.firebasestorage.app",
  messagingSenderId: "864524384081",
  appId: "1:864524384081:web:79e86410ebc264bb640570"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);