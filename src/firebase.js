import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCL9qVj0XKo8y2QQRoKwvXcJhLVQUUkQJw',
  authDomain: 'tooltracker-63d64.firebaseapp.com',
  projectId: 'tooltracker-63d64',
  storageBucket: 'tooltracker-63d64.firebasestorage.app',
  messagingSenderId: '135028995684',
  appId: '1:135028995684:web:289653b67e7dd7bae69171',
}

export const app = initializeApp(firebaseConfig, 'qasim-lms')
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
