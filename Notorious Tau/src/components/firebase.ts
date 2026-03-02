// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx8TVYlhiiB5X1IROarLSg3QeqJi5vDME",
  authDomain: "notorious-tau-website.firebaseapp.com",
  projectId: "notorious-tau-website",
  storageBucket: "notorious-tau-website.firebasestorage.app",
  messagingSenderId: "820551362442",
  appId: "1:820551362442:web:9ce7037c0c0423feae8a73",
  measurementId: "G-THBEC9WRDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);