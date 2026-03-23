import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, signInWithRedirect, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import {
  createKidProfile,
  getKidProfileById,
  recordSession as recordSessionDB,
  recordAchievement as recordAchievementDB,
  getKidSessions,
  getKidAchievements,
  getKidGameProgress as getKidGameProgressDB,
  getKidSkillPath as getKidSkillPathDB,
  upsertKidGameProgress as upsertKidGameProgressDB,
  upsertKidBestScore as upsertKidBestScoreDB,
  upsertKidSkillPath as upsertKidSkillPathDB,
  getGameLeaderboard as getGameLeaderboardDB,
  upsertKidOverallScore as upsertKidOverallScoreDB,
  getOverallLeaderboard as getOverallLeaderboardDB,
  getGradeTopper as getGradeTopperDB,
  deleteKidProfile,
  updateKidProfile
} from '../services/kidsFirestore'

const kidsAuthErrorMessage = (err: unknown) => {
  const anyErr = err as any
  const code: string | undefined = typeof anyErr?.code === 'string' ? anyErr.code : undefined
  const message: string = anyErr instanceof Error ? anyErr.message : String(err)
  if (code) return code
  if (message.includes('auth/')) {
    const m = message.match(/auth\/[a-zA-Z0-9-]+/)
    if (m?.[0]) return m[0]
  }
  return message
}

const kidEmailFromNameKey = (nameKey: string) => {
  const safe = nameKey
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.\-]/g, '')
  return `${safe}@kids.exam-pilot.local`
}

export interface KidsProfile {
  id: string
  name: string
  nameKey: string
  secretCode: string
  grade: string
  avatar: string
  countryName?: string
  countryFlag?: string
  createdAt: number
}

export interface GameSession {
  id: string
  kidId: string
  gameType: string
  level?: number
  score: number
  starsEarned: number
  correctAnswers: number
  totalQuestions: number
  durationSeconds: number
  playedAt: number
}

export interface KidGameProgress {
  gameId: string
  highestLevelUnlocked: number
  lastPlayedLevel: number
  bestScore: number
  updatedAt: number
}

export interface GameLeaderboardEntry {
  kidId: string
  kidName: string
  kidAvatar: string
  kidFlag?: string
  kidGrade?: string
  gameId: string
  bestScore: number
  updatedAt: number
}

export interface KidSkillPath {
  mode: 'free' | 'skill_path_rotate'
  gameIds: string[]
  currentIndex: number
  updatedAt: number
}

const DEFAULT_SKILL_PATH_GAME_IDS = [
  'math-blaster',
  'times-table-tower',
  'spelling-sprint',
  'phonics-pop',
  'grammar-builder',
  'science-lab',
  'flag-capital-match',
  'geography-map-tap',
  'pattern-detective',
  'reading-comprehension',
  'revision-boss'
]

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
  kidsAuthReady: boolean
  profiles: KidsProfile[]
  sessions: GameSession[]
  achievements: Achievement[]
  gameProgress: Record<string, KidGameProgress>
  skillPath: KidSkillPath | null
  activeGame: ActiveGameProgress | null  // Track ongoing game
  
  bootstrapKidsAuth: () => Promise<void>
  login: (name: string, secretCode: string) => Promise<KidsProfile | null>
  register: (name: string, secretCode: string, grade: string, avatar: string, countryName?: string, countryFlag?: string) => Promise<KidsProfile | null>
  loginWithEmail: (email: string, password: string) => Promise<KidsProfile | null>
  registerWithEmail: (params: { name: string; email: string; password: string; grade: string; avatar: string; countryName?: string; countryFlag?: string }) => Promise<KidsProfile | null>
  loginWithGoogle: () => Promise<KidsProfile | null>
  finishGoogleRedirectLogin: () => Promise<KidsProfile | null>
  completeKidProfileForCurrentUser: (params: { name: string; grade: string; avatar: string; countryName?: string; countryFlag?: string; secretCode?: string }) => Promise<KidsProfile | null>
  logout: () => void
  recordSession: (session: Omit<GameSession, 'id' | 'kidId' | 'playedAt'>) => Promise<void>
  unlockAchievement: (achievementCode: string, title: string, description: string, starsReward: number) => void
  getKidStats: (kidId: string) => { totalStars: number; totalSessions: number; bestStreak: number }
  getLeaderboard: () => Array<{ kid: KidsProfile; totalStars: number; sessions: number }>

  getGameProgress: (gameId: string) => KidGameProgress | null
  getAllGameProgress: () => KidGameProgress[]
  getGameLeaderboard: (gameId: string, topN?: number) => Promise<GameLeaderboardEntry[]>

  getOverallLeaderboard: (topN?: number) => Promise<Array<{ kidId: string; kidName: string; kidAvatar: string; kidFlag?: string; kidGrade?: string; overallScore: number; updatedAt: number }>>
  getGradeTopper: (grade: string) => Promise<{ kidId: string; kidName: string; kidAvatar: string; kidFlag?: string; kidGrade?: string; overallScore: number; updatedAt: number } | null>

  setSkillPathMode: (mode: KidSkillPath['mode']) => Promise<void>
  setSkillPathGameIds: (gameIds: string[]) => Promise<void>
  getSkillPathCurrentGameId: () => string | null
  advanceSkillPath: () => Promise<string | null>
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
      kidsAuthReady: false,
      profiles: [],
      sessions: [],
      achievements: [],
      gameProgress: {},
      skillPath: null,
      activeGame: null,

      bootstrapKidsAuth: async () => {
        const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
        if (get().kidsAuthReady) {
          if (debugKidsAuth) console.log('[KidsAuth] store.bootstrapKidsAuth: already ready')
          return
        }

        if (debugKidsAuth) {
          console.log('[KidsAuth] store.bootstrapKidsAuth: starting', {
            hasAuthUserAtStart: !!auth.currentUser,
            uid: auth.currentUser?.uid,
            hasCurrentKid: !!get().currentKid
          })
        }

        await new Promise<void>((resolve) => {
          const unsub = onAuthStateChanged(auth, async (user) => {
            try {
              if (debugKidsAuth) console.log('[KidsAuth] store.bootstrapKidsAuth: onAuthStateChanged', { hasUser: !!user, uid: user?.uid })

              if (!user) {
                set({ kidsAuthReady: true, isKidsLoggedIn: false, currentKid: null })
                resolve()
                unsub()
                return
              }

              const uid = user.uid
              const profile = await getKidProfileById(uid)
              if (!profile) {
                set({ kidsAuthReady: true, isKidsLoggedIn: false, currentKid: null })
                resolve()
                unsub()
                return
              }

              const sessions = await getKidSessions(uid)
              const achievements = await getKidAchievements(uid)
              const progress = await getKidGameProgressDB(uid)
              const skillPathDB = await getKidSkillPathDB(uid)

              const progressByGame: Record<string, KidGameProgress> = {}
              for (const p of progress) {
                progressByGame[p.gameId] = {
                  gameId: p.gameId,
                  highestLevelUnlocked: p.highestLevelUnlocked ?? 1,
                  lastPlayedLevel: p.lastPlayedLevel ?? 1,
                  bestScore: p.bestScore ?? 0,
                  updatedAt: p.updatedAt ?? Date.now()
                }
              }

              const skillPath: KidSkillPath = skillPathDB
                ? {
                    mode: skillPathDB.mode,
                    gameIds: Array.isArray(skillPathDB.gameIds) && skillPathDB.gameIds.length > 0 ? skillPathDB.gameIds : DEFAULT_SKILL_PATH_GAME_IDS,
                    currentIndex: typeof skillPathDB.currentIndex === 'number' ? skillPathDB.currentIndex : 0,
                    updatedAt: skillPathDB.updatedAt ?? Date.now()
                  }
                : {
                    mode: 'free',
                    gameIds: DEFAULT_SKILL_PATH_GAME_IDS,
                    currentIndex: 0,
                    updatedAt: Date.now()
                  }

              set({
                kidsAuthReady: true,
                currentKid: profile,
                isKidsLoggedIn: true,
                sessions,
                achievements,
                gameProgress: progressByGame,
                skillPath
              })

              resolve()
              unsub()
            } catch (err: unknown) {
              if (debugKidsAuth) console.log('[KidsAuth] store.bootstrapKidsAuth: error', err)
              set({ kidsAuthReady: true, isKidsLoggedIn: false, currentKid: null })
              resolve()
              unsub()
            }
          })
        })
      },

      login: async (name: string, secretCode: string) => {
        const normalizedNameKey = name.trim().toLowerCase()
        const normalizedCode = secretCode.trim()
        const email = kidEmailFromNameKey(normalizedNameKey)

        try {
          const cred = await signInWithEmailAndPassword(auth, email, normalizedCode)
          const uid = cred.user.uid
          const profile = await getKidProfileById(uid)
          if (!profile) return null

          // Load this kid's sessions and achievements from Firestore
          const sessions = await getKidSessions(uid)
          const achievements = await getKidAchievements(uid)
          const progress = await getKidGameProgressDB(uid)
          const skillPathDB = await getKidSkillPathDB(uid)

          const progressByGame: Record<string, KidGameProgress> = {}
          for (const p of progress) {
            progressByGame[p.gameId] = {
              gameId: p.gameId,
              highestLevelUnlocked: p.highestLevelUnlocked ?? 1,
              lastPlayedLevel: p.lastPlayedLevel ?? 1,
              bestScore: p.bestScore ?? 0,
              updatedAt: p.updatedAt ?? Date.now()
            }
          }

          const skillPath: KidSkillPath = skillPathDB
            ? {
                mode: skillPathDB.mode,
                gameIds: Array.isArray(skillPathDB.gameIds) && skillPathDB.gameIds.length > 0 ? skillPathDB.gameIds : DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: typeof skillPathDB.currentIndex === 'number' ? skillPathDB.currentIndex : 0,
                updatedAt: skillPathDB.updatedAt ?? Date.now()
              }
            : {
                mode: 'free',
                gameIds: DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: 0,
                updatedAt: Date.now()
              }

          if (!skillPathDB) {
            await upsertKidSkillPathDB(profile.id, {
              mode: skillPath.mode,
              gameIds: skillPath.gameIds,
              currentIndex: skillPath.currentIndex
            })
          }
          
          set(state => ({
            currentKid: profile,
            isKidsLoggedIn: true,
            kidsAuthReady: true,
            sessions: [...state.sessions.filter((s: GameSession) => s.kidId !== profile.id), ...sessions],
            achievements: [...state.achievements.filter((a: Achievement) => a.kidId !== profile.id), ...achievements],
            gameProgress: progressByGame,
            skillPath
          }))
          return profile
        } catch (err: unknown) {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.finishGoogleRedirectLogin: error', err)
          return null
        }
      },
      register: async (name: string, secretCode: string, grade: string, avatar: string, countryName?: string, countryFlag?: string) => {
        const normalizedName = name.trim()
        const normalizedCode = secretCode.trim()

        if (!/^\d{4}$/.test(normalizedCode)) throw new Error('KID_SECRET_INVALID')

        const nameKey = normalizedName.toLowerCase()
        const email = kidEmailFromNameKey(nameKey)

        try {
          const cred = await createUserWithEmailAndPassword(auth, email, normalizedCode)
          const uid = cred.user.uid

          const newProfile = await createKidProfile(uid, {
            name: normalizedName,
            nameKey,
            secretCode: normalizedCode,
            grade,
            avatar,
            countryName,
            countryFlag,
            createdAt: Date.now()
          })

          set(state => ({
            profiles: [...state.profiles, newProfile],
            currentKid: newProfile,
            isKidsLoggedIn: true,
            kidsAuthReady: true
          }))

          return newProfile
        } catch (error: unknown) {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.registerWithEmail: error', { msg: kidsAuthErrorMessage(error), error })
          set({ kidsAuthReady: true })
          const message = error instanceof Error ? error.message : String(error)
          if (message.includes('email-already-in-use') || message.includes('KID_NAME_TAKEN')) throw new Error('KID_NAME_TAKEN')
          if (message.includes('auth/')) throw new Error(kidsAuthErrorMessage(error))
          throw new Error('KID_REGISTRATION_FAILED')
        }
      },

      loginWithEmail: async (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedPassword = password

        try {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.loginWithEmail: attempting signInWithEmailAndPassword', { email: normalizedEmail })
          const cred = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword)
          const uid = cred.user.uid
          const profile = await getKidProfileById(uid)
          if (!profile) return null

          const sessions = await getKidSessions(uid)
          const achievements = await getKidAchievements(uid)
          const progress = await getKidGameProgressDB(uid)
          const skillPathDB = await getKidSkillPathDB(uid)

          const progressByGame: Record<string, KidGameProgress> = {}
          for (const p of progress) {
            progressByGame[p.gameId] = {
              gameId: p.gameId,
              highestLevelUnlocked: p.highestLevelUnlocked ?? 1,
              lastPlayedLevel: p.lastPlayedLevel ?? 1,
              bestScore: p.bestScore ?? 0,
              updatedAt: p.updatedAt ?? Date.now()
            }
          }

          const skillPath: KidSkillPath = skillPathDB
            ? {
                mode: skillPathDB.mode,
                gameIds: Array.isArray(skillPathDB.gameIds) && skillPathDB.gameIds.length > 0 ? skillPathDB.gameIds : DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: typeof skillPathDB.currentIndex === 'number' ? skillPathDB.currentIndex : 0,
                updatedAt: skillPathDB.updatedAt ?? Date.now()
              }
            : {
                mode: 'free',
                gameIds: DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: 0,
                updatedAt: Date.now()
              }

          if (!skillPathDB) {
            await upsertKidSkillPathDB(profile.id, {
              mode: skillPath.mode,
              gameIds: skillPath.gameIds,
              currentIndex: skillPath.currentIndex
            })
          }

          set(state => ({
            currentKid: profile,
            isKidsLoggedIn: true,
            kidsAuthReady: true,
            sessions: [...state.sessions.filter((s: GameSession) => s.kidId !== profile.id), ...sessions],
            achievements: [...state.achievements.filter((a: Achievement) => a.kidId !== profile.id), ...achievements],
            gameProgress: progressByGame,
            skillPath
          }))

          return profile
        } catch (err: unknown) {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.loginWithEmail: error', { msg: kidsAuthErrorMessage(err), err })
          set({ kidsAuthReady: true })
          throw new Error(kidsAuthErrorMessage(err))
        }
      },

      registerWithEmail: async (params) => {
        const normalizedEmail = params.email.trim().toLowerCase()
        const password = params.password
        if (password.length < 6) throw new Error('KID_PASSWORD_TOO_SHORT')

        try {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.registerWithEmail: attempting createUserWithEmailAndPassword', { email: normalizedEmail })
          const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password)
          const uid = cred.user.uid

          const newProfile = await createKidProfile(uid, {
            name: params.name.trim(),
            nameKey: params.name.trim().toLowerCase(),
            secretCode: password,
            grade: params.grade,
            avatar: params.avatar,
            countryName: params.countryName,
            countryFlag: params.countryFlag,
            createdAt: Date.now()
          })

          set(state => ({
            profiles: [...state.profiles, newProfile],
            currentKid: newProfile,
            isKidsLoggedIn: true
          }))

          return newProfile
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error)
          if (message.includes('email-already-in-use') || message.includes('KID_NAME_TAKEN')) throw new Error('KID_NAME_TAKEN')
          throw new Error('KID_REGISTRATION_FAILED')
        }
      },

      loginWithGoogle: async () => {
        try {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.loginWithGoogle: calling signInWithRedirect')
          const provider = new GoogleAuthProvider()
          await signInWithRedirect(auth, provider)
          return null
        } catch (err: unknown) {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.loginWithGoogle: signInWithRedirect error', err)
          throw err
        }
      },

      finishGoogleRedirectLogin: async () => {
        try {
          const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
          if (debugKidsAuth) console.log('[KidsAuth] store.finishGoogleRedirectLogin: calling getRedirectResult', { hasAuthUser: !!auth.currentUser })
          const result = await getRedirectResult(auth)
          if (debugKidsAuth) console.log('[KidsAuth] store.finishGoogleRedirectLogin: getRedirectResult returned', { hasResult: !!result, uid: result?.user?.uid })
          if (!result?.user) return null

          const uid = result.user.uid
          const profile = await getKidProfileById(uid)
          if (!profile) return null

          const sessions = await getKidSessions(uid)
          const achievements = await getKidAchievements(uid)
          const progress = await getKidGameProgressDB(uid)
          const skillPathDB = await getKidSkillPathDB(uid)

          const progressByGame: Record<string, KidGameProgress> = {}
          for (const p of progress) {
            progressByGame[p.gameId] = {
              gameId: p.gameId,
              highestLevelUnlocked: p.highestLevelUnlocked ?? 1,
              lastPlayedLevel: p.lastPlayedLevel ?? 1,
              bestScore: p.bestScore ?? 0,
              updatedAt: p.updatedAt ?? Date.now()
            }
          }

          const skillPath: KidSkillPath = skillPathDB
            ? {
                mode: skillPathDB.mode,
                gameIds: Array.isArray(skillPathDB.gameIds) && skillPathDB.gameIds.length > 0 ? skillPathDB.gameIds : DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: typeof skillPathDB.currentIndex === 'number' ? skillPathDB.currentIndex : 0,
                updatedAt: skillPathDB.updatedAt ?? Date.now()
              }
            : {
                mode: 'free',
                gameIds: DEFAULT_SKILL_PATH_GAME_IDS,
                currentIndex: 0,
                updatedAt: Date.now()
              }

          if (!skillPathDB) {
            await upsertKidSkillPathDB(profile.id, {
              mode: skillPath.mode,
              gameIds: skillPath.gameIds,
              currentIndex: skillPath.currentIndex
            })
          }

          set(state => ({
            currentKid: profile,
            isKidsLoggedIn: true,
            sessions: [...state.sessions.filter((s: GameSession) => s.kidId !== profile.id), ...sessions],
            achievements: [...state.achievements.filter((a: Achievement) => a.kidId !== profile.id), ...achievements],
            gameProgress: progressByGame,
            skillPath
          }))

          return profile
        } catch {
          return null
        }
      },

      completeKidProfileForCurrentUser: async (params) => {
        const user = auth.currentUser
        if (!user) return null
        const uid = user.uid

        const existing = await getKidProfileById(uid)
        if (existing) return existing

        const newProfile = await createKidProfile(uid, {
          name: params.name.trim(),
          nameKey: params.name.trim().toLowerCase(),
          secretCode: (params.secretCode ?? '').trim(),
          grade: params.grade,
          avatar: params.avatar,
          countryName: params.countryName,
          countryFlag: params.countryFlag,
          createdAt: Date.now()
        })

        set(state => ({
          profiles: [...state.profiles, newProfile],
          currentKid: newProfile,
          isKidsLoggedIn: true,
          kidsAuthReady: true
        }))

        return newProfile
      },

      logout: () => {
        try {
          void signOut(auth)
        } catch {
          // ignore
        }
        set({ currentKid: null, isKidsLoggedIn: false, kidsAuthReady: true })
      },

      recordSession: async (session) => {
        console.log('[DEBUG] recordSession called with:', session)
        const currentKid = get().currentKid
        console.log('[DEBUG] currentKid:', currentKid?.id, currentKid?.name)
        if (!currentKid) {
          console.error('[DEBUG] recordSession - NO currentKid, aborting')
          return
        }
        
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
          level: session.level,
          score: session.score,
          starsEarned: session.starsEarned,
          correctAnswers: session.correctAnswers,
          totalQuestions: session.totalQuestions,
          durationSeconds: session.durationSeconds,
          playedAt: Date.now()
        })

        // Update per-game progress and best score (for per-game leaderboard)
        const gameId = session.gameType
        const currentProgress = get().gameProgress[gameId]
        const playedLevel = session.level ?? currentProgress?.lastPlayedLevel ?? 1
        const nextUnlocked = Math.min(100, playedLevel + 1)
        const bestScore = Math.max(currentProgress?.bestScore ?? 0, session.score)

        await upsertKidGameProgressDB(currentKid.id, gameId, {
          highestLevelUnlocked: Math.max(currentProgress?.highestLevelUnlocked ?? 1, nextUnlocked),
          lastPlayedLevel: playedLevel,
          bestScore
        })

        await upsertKidBestScoreDB({
          kidId: currentKid.id,
          kidName: currentKid.name,
          kidAvatar: currentKid.avatar,
          kidFlag: currentKid.countryFlag,
          kidGrade: currentKid.grade,
          gameId,
          bestScore
        })

        const previousOverall = get()
          .sessions
          .filter(s => s.kidId === currentKid.id)
          .reduce((sum, s) => sum + (s.score || 0), 0)
        const nextOverall = previousOverall + session.score
        await upsertKidOverallScoreDB({
          kidId: currentKid.id,
          kidName: currentKid.name,
          kidAvatar: currentKid.avatar,
          kidFlag: currentKid.countryFlag,
          kidGrade: currentKid.grade,
          overallScore: nextOverall
        })

        set(state => ({
          gameProgress: {
            ...state.gameProgress,
            [gameId]: {
              gameId,
              highestLevelUnlocked: Math.max(currentProgress?.highestLevelUnlocked ?? 1, nextUnlocked),
              lastPlayedLevel: playedLevel,
              bestScore,
              updatedAt: Date.now()
            }
          },
          sessions: [...state.sessions, newSession]
        }))
        console.log('[DEBUG] recordSession - state updated, new session added:', newSession.id, 'score:', newSession.score)
        console.log('[DEBUG] recordSession - total sessions now:', get().sessions.length)

        const skillPath = get().skillPath
        if (skillPath?.mode === 'skill_path_rotate') {
          const currentGameId = skillPath.gameIds[skillPath.currentIndex]
          if (currentGameId && currentGameId === session.gameType) {
            const nextIndex = skillPath.gameIds.length > 0 ? (skillPath.currentIndex + 1) % skillPath.gameIds.length : 0
            const updated: KidSkillPath = {
              ...skillPath,
              currentIndex: nextIndex,
              updatedAt: Date.now()
            }
            set({ skillPath: updated })
            await upsertKidSkillPathDB(currentKid.id, { currentIndex: nextIndex })
          }
        }
      },

      setSkillPathMode: async (mode) => {
        const currentKid = get().currentKid
        if (!currentKid) return

        const existing = get().skillPath
        const next: KidSkillPath = {
          mode,
          gameIds: existing?.gameIds?.length ? existing.gameIds : DEFAULT_SKILL_PATH_GAME_IDS,
          currentIndex: existing?.currentIndex ?? 0,
          updatedAt: Date.now()
        }
        set({ skillPath: next })
        await upsertKidSkillPathDB(currentKid.id, {
          mode: next.mode,
          gameIds: next.gameIds,
          currentIndex: next.currentIndex
        })
      },

      setSkillPathGameIds: async (gameIds) => {
        const currentKid = get().currentKid
        if (!currentKid) return

        const cleaned = Array.isArray(gameIds) ? gameIds.filter(Boolean) : []
        const existing = get().skillPath
        const nextIndex = 0
        const next: KidSkillPath = {
          mode: existing?.mode ?? 'free',
          gameIds: cleaned.length ? cleaned : DEFAULT_SKILL_PATH_GAME_IDS,
          currentIndex: nextIndex,
          updatedAt: Date.now()
        }
        set({ skillPath: next })
        await upsertKidSkillPathDB(currentKid.id, {
          mode: next.mode,
          gameIds: next.gameIds,
          currentIndex: next.currentIndex
        })
      },

      getSkillPathCurrentGameId: () => {
        const skillPath = get().skillPath
        if (!skillPath?.gameIds?.length) return null
        return skillPath.gameIds[skillPath.currentIndex] ?? null
      },

      advanceSkillPath: async () => {
        const currentKid = get().currentKid
        const skillPath = get().skillPath
        if (!currentKid || !skillPath?.gameIds?.length) return null

        const nextIndex = (skillPath.currentIndex + 1) % skillPath.gameIds.length
        const updated: KidSkillPath = {
          ...skillPath,
          currentIndex: nextIndex,
          updatedAt: Date.now()
        }
        set({ skillPath: updated })
        await upsertKidSkillPathDB(currentKid.id, { currentIndex: nextIndex })
        return updated.gameIds[updated.currentIndex] ?? null
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

      getGameProgress: (gameId: string) => {
        return get().gameProgress[gameId] ?? null
      },

      getAllGameProgress: () => {
        return Object.values(get().gameProgress)
      },

      getGameLeaderboard: async (gameId: string, topN: number = 10) => {
        const rows = await getGameLeaderboardDB(gameId, topN)
        return rows.map(r => ({
          kidId: r.kidId,
          kidName: r.kidName,
          kidAvatar: r.kidAvatar,
          kidFlag: r.kidFlag,
          kidGrade: r.kidGrade,
          gameId: r.gameId,
          bestScore: r.bestScore,
          updatedAt: r.updatedAt
        }))
      },

      getOverallLeaderboard: async (topN: number = 10) => {
        const rows = await getOverallLeaderboardDB(topN)
        return rows.map(r => ({
          kidId: r.kidId,
          kidName: r.kidName,
          kidAvatar: r.kidAvatar,
          kidFlag: r.kidFlag,
          kidGrade: r.kidGrade,
          overallScore: r.overallScore,
          updatedAt: r.updatedAt
        }))
      },

      getGradeTopper: async (grade: string) => {
        const r = await getGradeTopperDB(grade)
        if (!r) return null
        return {
          kidId: r.kidId,
          kidName: r.kidName,
          kidAvatar: r.kidAvatar,
          kidFlag: r.kidFlag,
          kidGrade: r.kidGrade,
          overallScore: r.overallScore,
          updatedAt: r.updatedAt
        }
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
        gameProgress: state.gameProgress,
        skillPath: state.skillPath,
        currentKid: state.currentKid,
        isKidsLoggedIn: state.isKidsLoggedIn,
        activeGame: state.activeGame
      })
    }
  )
)
