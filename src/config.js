// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  startAfter,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA6fI-AowLHQAWBHRh2zT1qK7uHvmlNFCw',

  authDomain: 'webchats-8067b.firebaseapp.com',

  databaseURL: 'https://webchats-8067b-default-rtdb.firebaseio.com',

  projectId: 'webchats-8067b',

  storageBucket: 'webchats-8067b.appspot.com',

  messagingSenderId: '317012666683',

  appId: '1:317012666683:web:e421f4ca9e53dcdb06ef1e',

  measurementId: 'G-7TJ2H7CGEX',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage(app)

// Export Firebase variables and functions
export {
  app,
  auth,
  firestore,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  doc,
  setDoc,
  getDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  onSnapshot,
  startAfter,
}

// You can also export your own functions here if needed
console.log('Welcome to Vite + JS + Webflow!')
