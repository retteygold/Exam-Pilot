import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { saveUser, getUser, type FirestoreUser } from '../services/firebaseQuestions'

export interface UserProfile {
  name?: string
  gender: string
  age: string
  grade: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | ''
  exam: string
}

interface UserState {
  firebaseUser: FirebaseUser | null
  profile: UserProfile | null
  isSetupComplete: boolean
  hasHydrated: boolean
  isSyncing: boolean
  lastSyncAt: Date | null
  
  setProfile: (profile: UserProfile) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  clearProfile: () => Promise<void>
  setFirebaseUser: (user: FirebaseUser | null) => void
  setHasHydrated: (value: boolean) => void
  syncToFirebase: () => Promise<void>
  loadFromFirebase: () => Promise<void>
  
  // Helper to get recommended difficulty
  getRecommendedDifficulty: () => 'easy' | 'medium' | 'hard'
  // Helper to check if user can access exam
  canAccessExam: (examCode: string) => boolean
  // Get user ID (Firebase UID or null)
  getUserId: () => string | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      firebaseUser: null,
      profile: null,
      isSetupComplete: false,
      hasHydrated: false,
      isSyncing: false,
      lastSyncAt: null,

      setProfile: async (profile) => {
        set({
          profile,
          isSetupComplete: true
        })
        // Sync to Firebase
        await get().syncToFirebase()
      },

      updateProfile: async (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null
        }))
        // Sync to Firebase
        await get().syncToFirebase()
      },

      clearProfile: async () => {
        set({
          firebaseUser: null,
          profile: null,
          isSetupComplete: false,
          lastSyncAt: null
        })
      },

      setFirebaseUser: (user) => set({ firebaseUser: user }),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      syncToFirebase: async () => {
        const { firebaseUser, profile, isSyncing } = get()
        
        if (!firebaseUser?.uid || !profile || isSyncing) return
        
        set({ isSyncing: true })
        
        try {
          const firestoreUser: FirestoreUser = {
            id: firebaseUser.uid,
            name: profile.name || '',
            grade: profile.grade || '',
            role: 'student'
          }
          
          if (profile.skillLevel) firestoreUser.skillLevel = profile.skillLevel
          if (profile.exam) firestoreUser.exam = profile.exam
          if (profile.gender) firestoreUser.gender = profile.gender
          if (profile.age) firestoreUser.age = profile.age
          
          await saveUser(firestoreUser)
          set({ lastSyncAt: new Date(), isSyncing: false })
        } catch (error) {
          console.error('Failed to sync user to Firebase:', error)
          set({ isSyncing: false })
        }
      },

      loadFromFirebase: async () => {
        const { firebaseUser } = get()
        
        if (!firebaseUser?.uid) return
        
        try {
          const firestoreUser = await getUser(firebaseUser.uid)
          
          if (firestoreUser) {
            const profile: UserProfile = {
              name: firestoreUser.name || '',
              gender: firestoreUser.gender || '',
              age: firestoreUser.age || '',
              grade: firestoreUser.grade || '',
              skillLevel: firestoreUser.skillLevel || '',
              exam: firestoreUser.exam || ''
            }
            
            set({
              profile,
              isSetupComplete: true,
              lastSyncAt: new Date()
            })
          }
        } catch (error) {
          console.error('Failed to load user from Firebase:', error)
        }
      },

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
      },

      getUserId: () => {
        const { firebaseUser } = get()
        return firebaseUser?.uid || null
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
          
          // Listen for Firebase auth state changes
          onAuthStateChanged(auth, (user) => {
            state.setFirebaseUser(user)
            if (user) {
              // User is signed in, load profile from Firebase
              state.loadFromFirebase()
            }
          })
        }
      }
    }
  )
)
