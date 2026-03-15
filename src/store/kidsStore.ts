import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KidsProfile {
  id: string
  name: string
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
  
  login: (name: string, secretCode: string) => KidsProfile | null
  register: (name: string, secretCode: string, grade: string, avatar: string) => KidsProfile | null
  logout: () => void
  recordSession: (session: Omit<GameSession, 'id' | 'kidId' | 'playedAt'>) => void
  unlockAchievement: (achievementCode: string, title: string, description: string, starsReward: number) => void
  getKidStats: (kidId: string) => { totalStars: number; totalSessions: number; bestStreak: number }
  getLeaderboard: () => Array<{ kid: KidsProfile; totalStars: number; sessions: number }>
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

      login: (name: string, secretCode: string) => {
        const profile = get().profiles.find(
          p => p.name.toLowerCase() === name.toLowerCase() && p.secretCode === secretCode
        )
        if (profile) {
          set({ currentKid: profile, isKidsLoggedIn: true })
          return profile
        }
        return null
      },

      register: (name: string, secretCode: string, grade: string, avatar: string) => {
        const existing = get().profiles.find(p => p.name.toLowerCase() === name.toLowerCase())
        if (existing) return null
        if (!/^\d{4}$/.test(secretCode)) return null
        
        const newProfile: KidsProfile = {
          id: generateId(),
          name,
          secretCode,
          grade,
          avatar,
          createdAt: Date.now()
        }
        
        set(state => ({
          profiles: [...state.profiles, newProfile],
          currentKid: newProfile,
          isKidsLoggedIn: true
        }))
        
        return newProfile
      },

      logout: () => {
        set({ currentKid: null, isKidsLoggedIn: false })
      },

      recordSession: (session) => {
        const currentKid = get().currentKid
        if (!currentKid) return
        
        const newSession: GameSession = {
          ...session,
          id: generateId(),
          kidId: currentKid.id,
          playedAt: Date.now()
        }
        
        set(state => ({
          sessions: [...state.sessions, newSession]
        }))
      },

      unlockAchievement: (code, title, description, starsReward) => {
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
      }
    }),
    {
      name: 'exam-pilot-kids-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        sessions: state.sessions,
        achievements: state.achievements
      })
    }
  )
)
