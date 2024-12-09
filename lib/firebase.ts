import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDYeGFkjxbd0yDlUPD4yfLLh9A78WcyP84",
  authDomain: "maanikya1-b7c41.firebaseapp.com",
  projectId: "maanikya1-b7c41",
  storageBucket: "maanikya1-b7c41.appspot.com",
  messagingSenderId: "484337219690",
  appId: "1:484337219690:web:abc25b74f6dcf3f0fa3213",
  measurementId: "G-630BGQ3NDE"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }

