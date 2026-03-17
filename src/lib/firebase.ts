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

if (typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1') {
  console.log('[KidsAuth] firebase config', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId
  })
}

// Storage is optional - only export if configured
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null

// Helper to check if storage is available
export const isStorageAvailable = (): boolean => !!storage

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
