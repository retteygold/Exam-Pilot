import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createKidProfile,
  validateKidLogin,
  recordSession as recordSessionDB,
  recordAchievement as recordAchievementDB,
  getKidSessions,
  getKidAchievements,
  deleteKidProfile,
  updateKidProfile
} from '../services/kidsFirestore'

export interface KidsProfile {
  id: string
  name: string
  nameKey: string
  secretCode: string
  grade: string
  avatar: string
  createdAt: number
}

export interface GameSession {
  id: string
  kidId: string
  gameType: string
  score: number
  starsEarned: number
  correctAnswers: number
  totalQuestions: number
  durationSeconds: number
  playedAt: number
}

// Active game progress that can be resumed
export interface ActiveGameProgress {
  gameType: string
  level: number
  score: number
  startTime: number
  extraData?: Record<string, any>
}

export interface Achievement {
  id: string
  kidId: string
  code: string
  title: string
  description: string
  starsReward: number
  unlockedAt: number
}

export interface KidsState {
  currentKid: KidsProfile | null
  isKidsLoggedIn: boolean
  profiles: KidsProfile[]
  sessions: GameSession[]
  achievements: Achievement[]
  activeGame: ActiveGameProgress | null  // Track ongoing game
  
  login: (name: string, secretCode: string) => Promise<KidsProfile | null>
  register: (name: string, secretCode: string, grade: string, avatar: string) => Promise<KidsProfile | null>
  logout: () => void
  recordSession: (session: Omit<GameSession, 'id' | 'kidId' | 'playedAt'>) => void
  unlockAchievement: (achievementCode: string, title: string, description: string, starsReward: number) => void
  getKidStats: (kidId: string) => { totalStars: number; totalSessions: number; bestStreak: number }
  getLeaderboard: () => Array<{ kid: KidsProfile; totalStars: number; sessions: number }>
  // Game session management
  startGameSession: (gameType: string, level: number, extraData?: Record<string, any>) => void
  updateGameProgress: (level: number, score: number, extraData?: Record<string, any>) => void
  clearActiveGame: () => void
  getActiveGame: () => ActiveGameProgress | null
  // Admin functions
  deleteKid: (kidId: string) => void
  resetKidStats: (kidId: string) => void
  updateKid: (kidId: string, updates: Partial<KidsProfile>) => void
  getAllSessions: () => GameSession[]
  getKidAchievements: (kidId: string) => Achievement[]
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useKidsStore = create<KidsState>()(
  persist(
    (set, get) => ({
      currentKid: null,
      isKidsLoggedIn: false,
      profiles: [],
      sessions: [],
      achievements: [],
      activeGame: null,

      login: async (name: string, secretCode: string) => {
        const profile = await validateKidLogin(name, secretCode)
        if (profile) {
          // Load this kid's sessions and achievements from Firestore
          const sessions = await getKidSessions(profile.id)
          const achievements = await getKidAchievements(profile.id)
          
          set(state => ({
            currentKid: profile,
            isKidsLoggedIn: true,
            sessions: [...state.sessions.filter((s: GameSession) => s.kidId !== profile.id), ...sessions],
            achievements: [...state.achievements.filter((a: Achievement) => a.kidId !== profile.id), ...achievements]
          }))
          return profile
        }
        return null
      },

      register: async (name: string, secretCode: string, grade: string, avatar: string) => {
        const normalizedName = name.trim()
        const normalizedCode = secretCode.trim()

        if (!/^\d{4}$/.test(normalizedCode)) return null
        
        const newProfile = await createKidProfile({
          name: normalizedName,
          nameKey: normalizedName.toLowerCase(),
          secretCode: normalizedCode,
          grade,
          avatar,
          createdAt: Date.now()
        })
        
        if (newProfile) {
          set(state => ({
            profiles: [...state.profiles, newProfile],
            currentKid: newProfile,
            isKidsLoggedIn: true
          }))
        }
        
        return newProfile
      },

      logout: () => {
        set({ currentKid: null, isKidsLoggedIn: false })
      },

      recordSession: async (session) => {
        const currentKid = get().currentKid
        if (!currentKid) return
        
        const newSession: GameSession = {
          ...session,
          id: generateId(),
          kidId: currentKid.id,
          playedAt: Date.now()
        }
        
        // Save to Firestore
        await recordSessionDB({
          kidId: currentKid.id,
          gameType: session.gameType,
          score: session.score,
          starsEarned: session.starsEarned,
          correctAnswers: session.correctAnswers,
          totalQuestions: session.totalQuestions,
          durationSeconds: session.durationSeconds,
          playedAt: Date.now()
        })
        
        set(state => ({
          sessions: [...state.sessions, newSession]
        }))
      },

      startGameSession: (gameType: string, level: number, extraData?: Record<string, any>) => {
        const currentKid = get().currentKid
        if (!currentKid) return
        
        set({
          activeGame: {
            gameType,
            level,
            score: 0,
            startTime: Date.now(),
            extraData
          }
        })
      },

      updateGameProgress: (level: number, score: number, extraData?: Record<string, any>) => {
        const currentKid = get().currentKid
        if (!currentKid || !get().activeGame) return
        
        set(state => ({
          activeGame: state.activeGame ? {
            ...state.activeGame,
            level,
            score,
            extraData: { ...state.activeGame.extraData, ...extraData }
          } : null
        }))
      },

      clearActiveGame: () => {
        set({ activeGame: null })
      },

      getActiveGame: () => {
        return get().activeGame
      },

      unlockAchievement: async (code, title, description, starsReward) => {
        const currentKid = get().currentKid
        if (!currentKid) return
        
        const existing = get().achievements.find(
          a => a.kidId === currentKid.id && a.code === code
        )
        if (existing) return
        
        const newAchievement: Achievement = {
          id: generateId(),
          kidId: currentKid.id,
          code,
          title,
          description,
          starsReward,
          unlockedAt: Date.now()
        }
        
        // Save to Firestore
        await recordAchievementDB({
          kidId: currentKid.id,
          code,
          title,
          description,
          starsReward,
          unlockedAt: Date.now()
        })
        
        set(state => ({
          achievements: [...state.achievements, newAchievement]
        }))
      },

      getKidStats: (kidId: string) => {
        const sessions = get().sessions.filter(s => s.kidId === kidId)
        const kidAchievements = get().achievements.filter(a => a.kidId === kidId)
        
        const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0) + 
                          kidAchievements.reduce((sum, a) => sum + a.starsReward, 0)
        
        const dates = [...new Set(sessions.map(s => new Date(s.playedAt).toDateString()))].sort()
        let bestStreak = 0
        let currentStreak = 0
        let lastDate: Date | null = null
        
        for (const dateStr of dates) {
          const date = new Date(dateStr)
          if (lastDate) {
            const diffDays = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            if (diffDays === 1) {
              currentStreak++
            } else {
              bestStreak = Math.max(bestStreak, currentStreak)
              currentStreak = 1
            }
          } else {
            currentStreak = 1
          }
          lastDate = date
        }
        bestStreak = Math.max(bestStreak, currentStreak)
        
        return {
          totalStars,
          totalSessions: sessions.length,
          bestStreak
        }
      },

      getLeaderboard: () => {
        const { profiles, sessions } = get()
        
        const kidStats = profiles.map(kid => {
          const kidSessions = sessions.filter(s => s.kidId === kid.id)
          const totalStars = kidSessions.reduce((sum, s) => sum + s.starsEarned, 0)
          return {
            kid,
            totalStars,
            sessions: kidSessions.length
          }
        })
        
        return kidStats.sort((a, b) => b.totalStars - a.totalStars)
      },

      // Admin functions
      deleteKid: async (kidId: string) => {
        await deleteKidProfile(kidId)
        set(state => ({
          profiles: state.profiles.filter(p => p.id !== kidId),
          sessions: state.sessions.filter(s => s.kidId !== kidId),
          achievements: state.achievements.filter(a => a.kidId !== kidId)
        }))
      },

      resetKidStats: (kidId: string) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.kidId !== kidId),
          achievements: state.achievements.filter(a => a.kidId !== kidId)
        }))
      },

      updateKid: async (kidId: string, updates: Partial<KidsProfile>) => {
        await updateKidProfile(kidId, updates)
        set(state => ({
          profiles: state.profiles.map(p => 
            p.id === kidId ? { ...p, ...updates } : p
          )
        }))
      },

      getAllSessions: () => {
        return get().sessions
      },

      getKidAchievements: (kidId: string) => {
        return get().achievements.filter(a => a.kidId === kidId)
      }
    }),
    {
      name: 'exam-pilot-kids-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        sessions: state.sessions,
        achievements: state.achievements,
        currentKid: state.currentKid,
        isKidsLoggedIn: state.isKidsLoggedIn,
        activeGame: state.activeGame
      })
    }
  )
)
