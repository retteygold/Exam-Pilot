import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  gender: string
  age: string
  grade: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | ''
  exam: string
}

interface UserState {
  profile: UserProfile | null
  isSetupComplete: boolean
  
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  clearProfile: () => void
  
  // Helper to get recommended difficulty
  getRecommendedDifficulty: () => 'easy' | 'medium' | 'hard'
  // Helper to check if user can access exam
  canAccessExam: (examCode: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isSetupComplete: false,

      setProfile: (profile) => set({
        profile,
        isSetupComplete: true
      }),

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),

      clearProfile: () => set({
        profile: null,
        isSetupComplete: false
      }),

      getRecommendedDifficulty: () => {
        const { profile } = get()
        if (!profile) return 'medium'
        
        // Based on skill level
        switch (profile.skillLevel) {
          case 'Beginner': return 'easy'
          case 'Advanced': return 'hard'
          default: return 'medium'
        }
      },

      canAccessExam: (examCode) => {
        const { profile } = get()
        if (!profile) return false
        return profile.exam === examCode || profile.exam === ''
      }
    }),
    {
      name: 'user-profile'
    }
  )
)
