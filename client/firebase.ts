// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRERMAmlI7gT4PMcubcrSfdqSQaC0ynO8",
  authDomain: "structura-a2de0.firebaseapp.com",
  projectId: "structura-a2de0",
  storageBucket: "structura-a2de0.firebasestorage.app",
  messagingSenderId: "369540200963",
  appId: "1:369540200963:web:7e9287b648bea1703eac36",
  measurementId: "G-2F6HHE5YZ4"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db } ;