import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question } from '../types'
import { saveExamResult } from '../services/firebaseQuestions'
import { useUserStore } from './userStore'

interface ExamState {
  // Current exam
  examMode: 'practice' | 'exam' | null
  selectedPaper: string | null
  questions: Question[]
  currentIndex: number
  answers: Record<string, { selected: number; correct: boolean; timeSpent: number }>
  startTime: number | null
  isComplete: boolean
  
  // Completed papers tracking
  completedPapers: string[]  // Array of paper IDs that have been completed
  
  // Actions
  startExam: (questions: Question[], mode: 'practice' | 'exam', paper: string) => void
  answerQuestion: (questionId: string, selected: number, correct: boolean) => void
  nextQuestion: () => void
  prevQuestion: () => void
  finishExam: () => void
  resetExam: () => void
  markPaperCompleted: (paperId: string) => void
  
  // Stats
  getScore: () => { correct: number; total: number; percentage: number }
  getTimeSpent: () => number
  getCompletedCount: () => number
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
      completedPapers: [],

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

      finishExam: async () => {
        const state = get()
        const userId = useUserStore.getState().userId
        
        // Save to local state
        set({ isComplete: true })
        
        // Save to Firebase if user is logged in
        if (userId && state.selectedPaper && state.examMode) {
          try {
            const score = state.getScore()
            const timeSpent = state.getTimeSpent()
            
            // Extract paper info from selectedPaper
            const paperParts = state.selectedPaper.split('_')
            const [subject, year, session, paper] = paperParts
            
            await saveExamResult({
              userId,
              paperId: state.selectedPaper,
              subject: subject || 'unknown',
              year: parseInt(year) || new Date().getFullYear(),
              session: session || 'unknown',
              paper: paper || '1',
              mode: state.examMode,
              score: score.correct,
              totalMarks: score.total,
              percentage: score.percentage,
              timeSpent,
              answers: state.answers,
              completedAt: new Date()
            })
          } catch (error) {
            console.error('Failed to save exam result to Firebase:', error)
          }
        }
      },

      resetExam: () => set({
        examMode: null,
        selectedPaper: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        startTime: null,
        isComplete: false
      }),

      markPaperCompleted: (paperId) => set((state) => ({
        completedPapers: state.completedPapers.includes(paperId)
          ? state.completedPapers
          : [...state.completedPapers, paperId]
      })),

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
      },

      getCompletedCount: () => {
        return get().completedPapers.length
      }
    }),
    {
      name: 'exam-storage'
    }
  )
)
