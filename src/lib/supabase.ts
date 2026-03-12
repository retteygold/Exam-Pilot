import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

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
