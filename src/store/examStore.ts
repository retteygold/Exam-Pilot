import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question } from '../types'

interface ExamState {
  // Current exam
  examMode: 'practice' | 'exam' | null
  selectedPaper: string | null
  questions: Question[]
  currentIndex: number
  answers: Record<string, { selected: number; correct: boolean; timeSpent: number }>
  startTime: number | null
  isComplete: boolean
  
  // Actions
  startExam: (questions: Question[], mode: 'practice' | 'exam', paper: string) => void
  answerQuestion: (questionId: string, selected: number, correct: boolean) => void
  nextQuestion: () => void
  prevQuestion: () => void
  finishExam: () => void
  resetExam: () => void
  
  // Stats
  getScore: () => { correct: number; total: number; percentage: number }
  getTimeSpent: () => number
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      examMode: null,
      selectedPaper: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      startTime: null,
      isComplete: false,

      startExam: (questions, mode, paper) => set({
        examMode: mode,
        selectedPaper: paper,
        questions,
        currentIndex: 0,
        answers: {},
        startTime: Date.now(),
        isComplete: false
      }),

      answerQuestion: (questionId, selected, correct) => set((state) => {
        const now = Date.now()
        const timeSpent = state.startTime ? Math.floor((now - state.startTime) / 1000) : 0
        return {
          answers: {
            ...state.answers,
            [questionId]: { selected, correct, timeSpent }
          }
        }
      }),

      nextQuestion: () => set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1)
      })),

      prevQuestion: () => set((state) => ({
        currentIndex: Math.max(state.currentIndex - 1, 0)
      })),

      finishExam: () => set({ isComplete: true }),

      resetExam: () => set({
        examMode: null,
        selectedPaper: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        startTime: null,
        isComplete: false
      }),

      getScore: () => {
        const state = get()
        const answers = Object.values(state.answers)
        const correct = answers.filter(a => a.correct).length
        const total = state.questions.length
        return {
          correct,
          total,
          percentage: total > 0 ? Math.round((correct / total) * 100) : 0
        }
      },

      getTimeSpent: () => {
        const state = get()
        if (!state.startTime) return 0
        return Math.floor((Date.now() - state.startTime) / 1000)
      }
    }),
    {
      name: 'exam-storage'
    }
  )
)
