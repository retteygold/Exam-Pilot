import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export type User = {
  id: string
  email: string
  name?: string
  grade?: number
  role: 'student' | 'admin'
  created_at: string
}

export type ExamResult = {
  id: string
  user_id: string
  subject: string
  paper: string
  year: number
  session: string
  score: number
  total_marks: number
  time_spent: number
  completed_at: string
  answers: Record<string, { selected: number; correct: boolean; timeSpent?: number }>
}

export type UserProgress = {
  user_id: string
  subject: string
  total_questions: number
  correct_answers: number
  streak_days: number
  last_study_date: string
  papers_completed: string[]
}
