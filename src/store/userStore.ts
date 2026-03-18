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
  userId: string | null
  profile: UserProfile | null
  isSetupComplete: boolean
  hasHydrated: boolean
  
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  clearProfile: () => void
  setUserId: (userId: string | null) => void
  setHasHydrated: (value: boolean) => void
  
  // Helper to get recommended difficulty
  getRecommendedDifficulty: () => 'easy' | 'medium' | 'hard'
  // Helper to check if user can access exam
  canAccessExam: (examCode: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      profile: null,
      isSetupComplete: false,
      hasHydrated: false,

      setProfile: (profile) => set({
        profile,
        isSetupComplete: true
      }),

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),

      clearProfile: () => set({
        userId: null,
        profile: null,
        isSetupComplete: false
      }),

      setUserId: (userId) => set({ userId }),

      setHasHydrated: (value) => set({ hasHydrated: value }),

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
      name: 'user-profile',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const p = state.profile
          const derivedComplete =
            !!p &&
            !!p.gender &&
            !!p.age &&
            !!p.grade &&
            !!p.skillLevel &&
            !!p.exam

          if (derivedComplete && !state.isSetupComplete) {
            state.isSetupComplete = true
          }
          state.setHasHydrated(true)
        }
      }
    }
  )
)
