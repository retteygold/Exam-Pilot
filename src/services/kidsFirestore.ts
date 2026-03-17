import { db } from '../lib/firebase'
import { collection, doc, setDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from 'firebase/firestore'
import type { KidsProfile, GameSession, Achievement } from '../store/kidsStore'

export type KidsProfileDB = KidsProfile
export type GameSessionDB = GameSession & { level?: number }
export type AchievementDB = Achievement

const KIDS_COLLECTION = 'kidsProfiles'
const SESSIONS_COLLECTION = 'kidsSessions'
const ACHIEVEMENTS_COLLECTION = 'kidsAchievements'
const GAME_PROGRESS_COLLECTION = 'kidsGameProgress'
const GAME_BEST_SCORES_COLLECTION = 'kidsGameBestScores'
const SKILL_PATH_COLLECTION = 'kidsSkillPath'
const OVERALL_SCORES_COLLECTION = 'kidsOverallScores'

export type KidGameProgressDB = {
  id: string
  kidId: string
  gameId: string
  highestLevelUnlocked: number
  lastPlayedLevel: number
  bestScore: number
  updatedAt: number
}

export type KidGameBestScoreDB = {
  id: string
  kidId: string
  gameId: string
  bestScore: number
  kidName: string
  kidAvatar: string
  kidFlag?: string
  kidGrade?: string
  updatedAt: number
}

export type KidOverallScoreDB = {
  id: string
  kidId: string
  kidName: string
  kidAvatar: string
  kidFlag?: string
  kidGrade?: string
  overallScore: number
  updatedAt: number
}

export type KidSkillPathDB = {
  id: string
  kidId: string
  mode: 'free' | 'skill_path_rotate'
  gameIds: string[]
  currentIndex: number
  updatedAt: number
}

export async function createKidProfile(profile: Omit<KidsProfileDB, 'id'>): Promise<KidsProfileDB> {
  try {
    const nameKey = profile.name.toLowerCase().trim()
    
    // Check if name already exists
    const existing = await getKidByNameKey(nameKey)
    if (existing) {
      console.log('Kid with this name already exists:', nameKey)
      throw new Error('KID_NAME_TAKEN')
    }

    const docRef = doc(collection(db, KIDS_COLLECTION))
    const newProfile: KidsProfileDB = {
      ...profile,
      id: docRef.id,
      nameKey
    }
    
    await setDoc(docRef, {
      ...newProfile,
      createdAt: serverTimestamp()
    })
    
    return newProfile
  } catch (error) {
    console.error('Error creating kid profile:', error)
    throw error
  }
}

export async function getKidByNameKey(nameKey: string): Promise<KidsProfileDB | null> {
  try {
    const q = query(
      collection(db, KIDS_COLLECTION),
      where('nameKey', '==', nameKey.toLowerCase().trim())
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      nameKey: data.nameKey,
      secretCode: data.secretCode,
      grade: data.grade,
      avatar: data.avatar,
      countryName: data.countryName,
      countryFlag: data.countryFlag,
      createdAt: data.createdAt?.toMillis?.() || Date.now()
    } as KidsProfileDB
  } catch (error) {
    console.error('Error getting kid by name key:', error)
    return null
  }
}

export async function validateKidLogin(name: string, secretCode: string): Promise<KidsProfileDB | null> {
  const normalizedName = name.trim().toLowerCase()
  const normalizedCode = secretCode.trim()
  
  const profile = await getKidByNameKey(normalizedName)
  
  if (!profile) return null
  if (profile.secretCode !== normalizedCode) return null
  
  return profile
}

export async function updateKidProfile(kidId: string, updates: Partial<KidsProfileDB>): Promise<boolean> {
  try {
    const docRef = doc(db, KIDS_COLLECTION, kidId)
    await setDoc(docRef, updates, { merge: true })
    return true
  } catch (error) {
    console.error('Error updating kid profile:', error)
    return false
  }
}

export async function deleteKidProfile(kidId: string): Promise<boolean> {
  try {
    // Delete profile
    await setDoc(doc(db, KIDS_COLLECTION, kidId), { deleted: true }, { merge: true })
    
    // Also mark sessions and achievements as deleted
    const sessionsQuery = query(collection(db, SESSIONS_COLLECTION), where('kidId', '==', kidId))
    const sessionsSnap = await getDocs(sessionsQuery)
    sessionsSnap.docs.forEach(async (d) => {
      await setDoc(doc(db, SESSIONS_COLLECTION, d.id), { deleted: true }, { merge: true })
    })
    
    const achievementsQuery = query(collection(db, ACHIEVEMENTS_COLLECTION), where('kidId', '==', kidId))
    const achievementsSnap = await getDocs(achievementsQuery)
    achievementsSnap.docs.forEach(async (d) => {
      await setDoc(doc(db, ACHIEVEMENTS_COLLECTION, d.id), { deleted: true }, { merge: true })
    })
    
    return true
  } catch (error) {
    console.error('Error deleting kid profile:', error)
    return false
  }
}

export async function recordSession(session: Omit<GameSessionDB, 'id'>): Promise<GameSessionDB | null> {
  try {
    const docRef = doc(collection(db, SESSIONS_COLLECTION))
    const newSession: GameSessionDB = {
      ...session,
      id: docRef.id
    }
    
    await setDoc(docRef, {
      ...newSession,
      playedAt: serverTimestamp()
    })
    
    return newSession
  } catch (error) {
    console.error('Error recording session:', error)
    return null
  }
}

export async function upsertKidSkillPath(
  kidId: string,
  updates: Partial<Pick<KidSkillPathDB, 'mode' | 'gameIds' | 'currentIndex'>>
): Promise<KidSkillPathDB | null> {
  try {
    const docId = kidId
    const docRef = doc(db, SKILL_PATH_COLLECTION, docId)

    const payload: Partial<KidSkillPathDB> = {
      id: docId,
      kidId,
      ...updates,
      updatedAt: Date.now()
    }

    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    return payload as KidSkillPathDB
  } catch (error) {
    console.error('Error upserting kid skill path:', error)
    return null
  }
}

export async function getKidSkillPath(kidId: string): Promise<KidSkillPathDB | null> {
  try {
    const q = query(collection(db, SKILL_PATH_COLLECTION), where('kidId', '==', kidId), limit(1))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const d = snapshot.docs[0]
    const data = d.data()

    return {
      id: d.id,
      kidId: data.kidId,
      mode: (data.mode === 'skill_path_rotate' ? 'skill_path_rotate' : 'free') as KidSkillPathDB['mode'],
      gameIds: Array.isArray(data.gameIds) ? data.gameIds : [],
      currentIndex: typeof data.currentIndex === 'number' ? data.currentIndex : 0,
      updatedAt: data.updatedAt?.toMillis?.() || Date.now()
    } as KidSkillPathDB
  } catch (error) {
    console.error('Error getting kid skill path:', error)
    return null
  }
}

 export async function upsertKidGameProgress(
   kidId: string,
   gameId: string,
   updates: {
     highestLevelUnlocked?: number
     lastPlayedLevel?: number
     bestScore?: number
   }
 ): Promise<KidGameProgressDB | null> {
   try {
     const docId = `${kidId}_${gameId}`
     const docRef = doc(db, GAME_PROGRESS_COLLECTION, docId)

     const progress: Partial<KidGameProgressDB> = {
       id: docId,
       kidId,
       gameId,
       ...updates,
       updatedAt: Date.now()
     }

     await setDoc(
       docRef,
       {
         ...progress,
         updatedAt: serverTimestamp()
       },
       { merge: true }
     )

     return progress as KidGameProgressDB
   } catch (error) {
     console.error('Error upserting kid game progress:', error)
     return null
   }
 }

 export async function getKidGameProgress(kidId: string): Promise<KidGameProgressDB[]> {
   try {
     const q = query(
       collection(db, GAME_PROGRESS_COLLECTION),
       where('kidId', '==', kidId)
     )
     const snapshot = await getDocs(q)
     return snapshot.docs.map(d => {
       const data = d.data()
       return {
         id: d.id,
         kidId: data.kidId,
         gameId: data.gameId,
         highestLevelUnlocked: data.highestLevelUnlocked ?? 1,
         lastPlayedLevel: data.lastPlayedLevel ?? 1,
         bestScore: data.bestScore ?? 0,
         updatedAt: data.updatedAt?.toMillis?.() || Date.now()
       } as KidGameProgressDB
     })
   } catch (error) {
     console.error('Error getting kid game progress:', error)
     return []
   }
 }

export async function upsertKidBestScore(params: {
  kidId: string
  kidName: string
  kidAvatar: string
  kidFlag?: string
  kidGrade?: string
  gameId: string
  bestScore: number
}): Promise<KidGameBestScoreDB | null> {
  try {
    const { kidId, kidName, kidAvatar, kidFlag, kidGrade, gameId, bestScore } = params
    const docId = `${kidId}_${gameId}`
    const docRef = doc(db, GAME_BEST_SCORES_COLLECTION, docId)

    const payload: Partial<KidGameBestScoreDB> = {
      id: docId,
      kidId,
      gameId,
      bestScore,
      kidName,
      kidAvatar,
      kidFlag,
      kidGrade,
      updatedAt: Date.now()
    }

    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    return payload as KidGameBestScoreDB
  } catch (error) {
    console.error('Error upserting kid best score:', error)
    return null
  }
}

export async function getGameLeaderboard(gameId: string, topN: number = 10): Promise<KidGameBestScoreDB[]> {
  try {
    const q = query(
      collection(db, GAME_BEST_SCORES_COLLECTION),
      where('gameId', '==', gameId),
      orderBy('bestScore', 'desc'),
      limit(topN)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        kidId: data.kidId,
        gameId: data.gameId,
        bestScore: data.bestScore ?? 0,
        kidName: data.kidName ?? 'Kid',
        kidAvatar: data.kidAvatar ?? '⭐',
        kidFlag: data.kidFlag,
        kidGrade: data.kidGrade,
        updatedAt: data.updatedAt?.toMillis?.() || Date.now()
      } as KidGameBestScoreDB
    })
  } catch (error) {
    console.error('Error getting game leaderboard:', error)
    return []
  }
}

export async function upsertKidOverallScore(params: {
  kidId: string
  kidName: string
  kidAvatar: string
  kidFlag?: string
  kidGrade?: string
  overallScore: number
}): Promise<KidOverallScoreDB | null> {
  try {
    const { kidId, kidName, kidAvatar, kidFlag, kidGrade, overallScore } = params
    const docId = kidId
    const docRef = doc(db, OVERALL_SCORES_COLLECTION, docId)

    const payload: Partial<KidOverallScoreDB> = {
      id: docId,
      kidId,
      kidName,
      kidAvatar,
      kidFlag,
      kidGrade,
      overallScore,
      updatedAt: Date.now()
    }

    await setDoc(
      docRef,
      {
        ...payload,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    return payload as KidOverallScoreDB
  } catch (error) {
    console.error('Error upserting kid overall score:', error)
    return null
  }
}

export async function getOverallLeaderboard(topN: number = 10): Promise<KidOverallScoreDB[]> {
  try {
    const q = query(collection(db, OVERALL_SCORES_COLLECTION), orderBy('overallScore', 'desc'), limit(topN))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        kidId: data.kidId,
        kidName: data.kidName ?? 'Kid',
        kidAvatar: data.kidAvatar ?? '⭐',
        kidFlag: data.kidFlag,
        kidGrade: data.kidGrade,
        overallScore: data.overallScore ?? 0,
        updatedAt: data.updatedAt?.toMillis?.() || Date.now()
      } as KidOverallScoreDB
    })
  } catch (error) {
    console.error('Error getting overall leaderboard:', error)
    return []
  }
}

export async function getGradeTopper(grade: string): Promise<KidOverallScoreDB | null> {
  try {
    const q = query(
      collection(db, OVERALL_SCORES_COLLECTION),
      where('kidGrade', '==', grade),
      orderBy('overallScore', 'desc'),
      limit(1)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const d = snapshot.docs[0]
    const data = d.data()
    return {
      id: d.id,
      kidId: data.kidId,
      kidName: data.kidName ?? 'Kid',
      kidAvatar: data.kidAvatar ?? '⭐',
      kidFlag: data.kidFlag,
      kidGrade: data.kidGrade,
      overallScore: data.overallScore ?? 0,
      updatedAt: data.updatedAt?.toMillis?.() || Date.now()
    } as KidOverallScoreDB
  } catch (error) {
    console.error('Error getting grade topper:', error)
    return null
  }
}

export async function getKidSessions(kidId: string): Promise<GameSessionDB[]> {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('kidId', '==', kidId),
      where('deleted', '!=', true)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        kidId: data.kidId,
        gameType: data.gameType,
        level: typeof data.level === 'number' ? data.level : undefined,
        score: data.score,
        starsEarned: data.starsEarned,
        correctAnswers: data.correctAnswers,
        totalQuestions: data.totalQuestions,
        durationSeconds: data.durationSeconds,
        playedAt: data.playedAt?.toMillis?.() || Date.now()
      } as GameSessionDB
    })
  } catch (error) {
    console.error('Error getting kid sessions:', error)
    return []
  }
}

export async function recordAchievement(achievement: Omit<AchievementDB, 'id'>): Promise<AchievementDB | null> {
  try {
    // Check if already exists
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      where('kidId', '==', achievement.kidId),
      where('code', '==', achievement.code)
    )
    const existing = await getDocs(q)
    if (!existing.empty) return null
    
    const docRef = doc(collection(db, ACHIEVEMENTS_COLLECTION))
    const newAchievement: AchievementDB = {
      ...achievement,
      id: docRef.id
    }
    
    await setDoc(docRef, {
      ...newAchievement,
      unlockedAt: serverTimestamp()
    })
    
    return newAchievement
  } catch (error) {
    console.error('Error recording achievement:', error)
    return null
  }
}

export async function getKidAchievements(kidId: string): Promise<AchievementDB[]> {
  try {
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      where('kidId', '==', kidId),
      where('deleted', '!=', true)
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        kidId: data.kidId,
        code: data.code,
        title: data.title,
        description: data.description,
        starsReward: data.starsReward,
        unlockedAt: data.unlockedAt?.toMillis?.() || Date.now()
      } as AchievementDB
    })
  } catch (error) {
    console.error('Error getting kid achievements:', error)
    return []
  }
}

export async function getAllKidsProfiles(): Promise<KidsProfileDB[]> {
  try {
    const snapshot = await getDocs(collection(db, KIDS_COLLECTION))
    return snapshot.docs
      .filter(doc => !doc.data().deleted)
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          nameKey: data.nameKey,
          secretCode: data.secretCode,
          grade: data.grade,
          avatar: data.avatar,
          createdAt: data.createdAt?.toMillis?.() || Date.now()
        } as KidsProfileDB
      })
  } catch (error) {
    console.error('Error getting all kids profiles:', error)
    return []
  }
}
