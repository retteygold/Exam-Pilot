/**
 * Online Challenge Service
 * Real-time multiplayer challenge room management
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// Types
export interface ChallengePlayer {
  id: string
  name: string
  avatar: string
  flag?: string
  grade: string
  ready: boolean
  score: number
  progress: number
  finished: boolean
  finishTime?: number
  disconnected: boolean
}

export interface ChallengeRoom {
  id: string
  status: 'waiting' | 'playing' | 'finished' | 'abandoned'
  mode: 'friends' | 'random'
  inviteCode?: string
  gameType: string
  players: Record<string, ChallengePlayer>
  gameConfig: {
    questionCount: number
    timeLimitSeconds: number
  }
  createdAt: number
  startedAt?: number
  endedAt?: number
  expiresAt: number
  winnerId?: string | 'draw'
}

export interface MatchmakingEntry {
  id: string
  playerId: string
  grade: string
  skillRating: number
  gameType: string
  timestamp: number
  status: 'searching' | 'matched' | 'cancelled'
  matchedRoomId?: string
}

// Collection references
const roomsRef = collection(db, 'challengeRooms')
const matchmakingRef = collection(db, 'matchmakingQueue')

// Generate 6-character invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed similar chars (0, O, 1, I)
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Create a new challenge room
export async function createChallengeRoom(
  playerId: string,
  playerName: string,
  playerAvatar: string,
  playerGrade: string,
  gameType: string,
  mode: 'friends' | 'random',
  playerFlag?: string
): Promise<string> {
  const roomId = doc(roomsRef).id
  const inviteCode = mode === 'friends' ? generateInviteCode() : undefined
  
  const room: Omit<ChallengeRoom, 'id'> = {
    status: 'waiting',
    mode,
    inviteCode,
    gameType,
    players: {
      [playerId]: {
        id: playerId,
        name: playerName,
        avatar: playerAvatar,
        flag: playerFlag,
        grade: playerGrade,
        ready: false,
        score: 0,
        progress: 0,
        finished: false,
        disconnected: false
      }
    },
    gameConfig: {
      questionCount: 10,
      timeLimitSeconds: 300
    },
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  }
  
  await setDoc(doc(roomsRef, roomId), room)
  return roomId
}

// Join a room by invite code
export async function joinChallengeByCode(
  inviteCode: string,
  playerId: string,
  playerName: string,
  playerAvatar: string,
  playerGrade: string,
  playerFlag?: string
): Promise<string | null> {
  // Find room with matching invite code
  const q = query(roomsRef, where('inviteCode', '==', inviteCode), where('status', '==', 'waiting'))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) return null
  
  const roomDoc = snapshot.docs[0]
  const room = roomDoc.data() as ChallengeRoom
  
  // Check if room is full (max 2 players for MVP)
  if (Object.keys(room.players).length >= 2) return null
  
  // Add player to room
  const batch = writeBatch(db)
  batch.update(doc(roomsRef, roomDoc.id), {
    [`players.${playerId}`]: {
      id: playerId,
      name: playerName,
      avatar: playerAvatar,
      flag: playerFlag,
      grade: playerGrade,
      ready: false,
      score: 0,
      progress: 0,
      finished: false,
      disconnected: false
    }
  })
  
  await batch.commit()
  return roomDoc.id
}

// Join a room by ID (for random matchmaking)
export async function joinChallengeRoom(
  roomId: string,
  playerId: string,
  playerName: string,
  playerAvatar: string,
  playerGrade: string,
  playerFlag?: string
): Promise<boolean> {
  const roomDoc = await getDoc(doc(roomsRef, roomId))
  if (!roomDoc.exists()) return false
  
  const room = roomDoc.data() as ChallengeRoom
  if (room.status !== 'waiting') return false
  if (Object.keys(room.players).length >= 2) return false
  
  await updateDoc(doc(roomsRef, roomId), {
    [`players.${playerId}`]: {
      id: playerId,
      name: playerName,
      avatar: playerAvatar,
      flag: playerFlag,
      grade: playerGrade,
      ready: false,
      score: 0,
      progress: 0,
      finished: false,
      disconnected: false
    }
  })
  
  return true
}

// Set player ready status
export async function setPlayerReady(
  roomId: string,
  playerId: string,
  ready: boolean
): Promise<void> {
  await updateDoc(doc(roomsRef, roomId), {
    [`players.${playerId}.ready`]: ready
  })
}

// Start the game (both players ready)
export async function startChallenge(roomId: string): Promise<void> {
  await updateDoc(doc(roomsRef, roomId), {
    status: 'playing',
    startedAt: Date.now()
  })
}

// Update player progress during game
export async function updatePlayerProgress(
  roomId: string,
  playerId: string,
  score: number,
  progress: number
): Promise<void> {
  await updateDoc(doc(roomsRef, roomId), {
    [`players.${playerId}.score`]: score,
    [`players.${playerId}.progress`]: progress
  })
}

// Mark player as finished
export async function finishChallenge(
  roomId: string,
  playerId: string,
  finalScore: number
): Promise<void> {
  const roomDoc = await getDoc(doc(roomsRef, roomId))
  if (!roomDoc.exists()) return
  
  const room = roomDoc.data() as ChallengeRoom
  
  // Update this player
  const updates: Record<string, any> = {
    [`players.${playerId}.finished`]: true,
    [`players.${playerId}.score`]: finalScore,
    [`players.${playerId}.finishTime`]: Date.now()
  }
  
  // Check if all players finished
  const allFinished = Object.values(room.players).every(
    p => p.id === playerId || p.finished
  )
  
  if (allFinished) {
    updates.status = 'finished'
    updates.endedAt = Date.now()
    
    // Determine winner
    const players = Object.values(room.players)
    const scores = players.map(p => ({ id: p.id, score: p.finished ? p.score : 0 }))
    scores.sort((a, b) => b.score - a.score)
    
    if (scores[0].score === scores[1]?.score) {
      updates.winnerId = 'draw'
    } else {
      updates.winnerId = scores[0].id
    }
  }
  
  await updateDoc(doc(roomsRef, roomId), updates)
}

// Subscribe to room updates (real-time)
export function subscribeToRoom(
  roomId: string,
  callback: (room: ChallengeRoom | null) => void
) {
  return onSnapshot(doc(roomsRef, roomId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as ChallengeRoom)
    } else {
      callback(null)
    }
  })
}

// Leave/abandon challenge
export async function leaveChallenge(roomId: string, playerId: string): Promise<void> {
  const roomDoc = await getDoc(doc(roomsRef, roomId))
  if (!roomDoc.exists()) return
  
  const room = roomDoc.data() as ChallengeRoom
  
  // If game hasn't started, remove player
  if (room.status === 'waiting') {
    const players = { ...room.players }
    delete players[playerId]
    
    if (Object.keys(players).length === 0) {
      // Delete empty room
      await deleteDoc(doc(roomsRef, roomId))
    } else {
      await updateDoc(doc(roomsRef, roomId), { players })
    }
  } else {
    // Mark as disconnected during game
    await updateDoc(doc(roomsRef, roomId), {
      [`players.${playerId}.disconnected`]: true
    })
  }
}

// Cancel/delete room (host only, before start)
export async function cancelChallenge(roomId: string): Promise<void> {
  await deleteDoc(doc(roomsRef, roomId))
}

// ==================== MATCHMAKING ====================

// Add to matchmaking queue
export async function joinMatchmaking(
  playerId: string,
  grade: string,
  skillRating: number,
  gameType: string
): Promise<void> {
  await setDoc(doc(matchmakingRef, playerId), {
    playerId,
    grade,
    skillRating,
    gameType,
    timestamp: Date.now(),
    status: 'searching'
  })
}

// Remove from matchmaking
export async function leaveMatchmaking(playerId: string): Promise<void> {
  await deleteDoc(doc(matchmakingRef, playerId))
}

// Find a match (called periodically or by cloud function)
export async function findMatch(
  playerId: string,
  grade: string
): Promise<string | null> {
  // Look for someone in queue with same grade
  const q = query(
    matchmakingRef,
    where('status', '==', 'searching'),
    where('grade', '==', grade),
    where('playerId', '!=', playerId)
  )
  
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  // Get first match
  const opponent = snapshot.docs[0].data() as MatchmakingEntry
  
  // Create room
  const roomId = await createChallengeRoom(
    playerId,
    'Finding...', // Will be updated when player joins
    '',
    grade,
    opponent.gameType,
    'random'
  )
  
  // Update both entries
  const batch = writeBatch(db)
  batch.update(doc(matchmakingRef, playerId), {
    status: 'matched',
    matchedRoomId: roomId
  })
  batch.update(doc(matchmakingRef, opponent.playerId), {
    status: 'matched',
    matchedRoomId: roomId
  })
  await batch.commit()
  
  return roomId
}

// Check matchmaking status
export async function getMatchmakingStatus(
  playerId: string
): Promise<MatchmakingEntry | null> {
  const docSnap = await getDoc(doc(matchmakingRef, playerId))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as MatchmakingEntry
}
