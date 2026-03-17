import { db } from '../lib/firebase'
import { collection, doc, setDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import type { KidsProfile, GameSession, Achievement } from '../store/kidsStore'

export type KidsProfileDB = KidsProfile
export type GameSessionDB = GameSession
export type AchievementDB = Achievement

const KIDS_COLLECTION = 'kidsProfiles'
const SESSIONS_COLLECTION = 'kidsSessions'
const ACHIEVEMENTS_COLLECTION = 'kidsAchievements'

export async function createKidProfile(profile: Omit<KidsProfileDB, 'id'>): Promise<KidsProfileDB | null> {
  try {
    const nameKey = profile.name.toLowerCase().trim()
    
    // Check if name already exists
    const existing = await getKidByNameKey(nameKey)
    if (existing) {
      console.log('Kid with this name already exists:', nameKey)
      return null
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
    return null
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

export async function getKidSessions(kidId: string): Promise<GameSessionDB[]> {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('kidId', '==', kidId),
      where('deleted', '!=', true)
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        kidId: data.kidId,
        gameType: data.gameType,
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
