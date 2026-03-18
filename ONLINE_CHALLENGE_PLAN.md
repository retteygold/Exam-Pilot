# Online Challenge Feature — Architecture & Implementation Plan

## Overview
A real-time multiplayer system where kids can challenge friends (via invite code/link) or get matched with random opponents of similar skill/grade. Players compete in the same game simultaneously with live score updates.

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Real-time Sync** | Live score/progress updates during gameplay |
| **Friends Challenge** | Generate invite code → share → friend joins → play together |
| **Random Matchmaking** | Match with online player (same grade, similar skill level) |
| **Spectator Mode** | See opponent's score/avatar animate in real-time |
| **Anti-Cheat** | Server-side score validation, max score caps per question |
| **Rewards** | Bonus XP/stars for winning, streak bonuses, participation rewards |
| **Rematch** | One-click play again with same opponent |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Challenge    │  │ Matchmaking  │  │ Real-time Game       │  │
│  │ Lobby        │  │ Queue        │  │ Session              │  │
│  │              │  │              │  │ (onSnapshot)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────┬──────────────────────────────────────────┘
                     │ Firestore Real-time
┌────────────────────┴──────────────────────────────────────────┐
│                      FIRESTORE DATABASE                        │
│  ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐   │
│  │ challengeRooms │ │ matchmaking    │ │ challengeResults │   │
│  │ (live sessions)│ │ queue          │ │ (history)        │   │
│  └────────────────┘ └────────────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Real-time Strategy
- Use **Firestore onSnapshot** listeners for live updates
- Challenge room doc updated every 1-3 seconds during gameplay
- Client throttles writes (not every frame)
- 5-minute match timeout (auto-forfeit if disconnected)

---

## Firestore Schema

### Collection: `challengeRooms`
Active real-time game sessions.

```typescript
interface ChallengeRoom {
  id: string                    // auto-generated
  status: 'waiting' | 'playing' | 'finished' | 'abandoned'
  
  // Matchmaking info
  mode: 'friends' | 'random'
  inviteCode?: string          // 6-char code for friends mode
  gameType: string             // 'math-blaster', 'quiz-race', etc.
  
  // Players (max 2 for MVP)
  players: {
    [playerId: string]: {
      id: string
      name: string
      avatar: string
      flag?: string
      grade: string
      ready: boolean           // clicked "ready"
      score: number            // current score
      progress: number         // 0-100% through game
      finished: boolean        // completed all questions
      finishTime?: number      // ms timestamp
      disconnected: boolean    // heartbeat timeout
    }
  }
  
  // Game state (synced)
  gameConfig: {
    questionCount: number
    timeLimitSeconds: number
    questions?: any[]          // shared question set (optional)
  }
  
  // Timing
  createdAt: number            // server timestamp
  startedAt?: number
  endedAt?: number
  expiresAt: number            // auto-cleanup 10 min after end
  
  // Results
  winnerId?: string | 'draw'
  rematchRoomId?: string     // link to next game
}
```

### Collection: `matchmakingQueue`
For random matchmaking.

```typescript
interface MatchmakingEntry {
  id: string                    // playerId
  playerId: string
  grade: string
  skillRating: number          // derived from past performance
  gameType: string             // preferred or 'any'
  timestamp: number            // when queued
  status: 'searching' | 'matched' | 'cancelled'
  matchedRoomId?: string
}
```

### Collection: `challengeResults`
Permanent history (leaderboard source).

```typescript
interface ChallengeResult {
  id: string
  roomId: string
  mode: 'friends' | 'random'
  gameType: string
  
  playerA: {
    id: string
    name: string
    avatar: string
    score: number
    won: boolean
  }
  
  playerB: {
    id: string
    name: string
    avatar: string
    score: number
    won: boolean
  }
  
  winnerId?: string | 'draw'
  playedAt: number
  durationSeconds: number
}
```

---

## Matchmaking Flow

### Friends Challenge
```
1. Player A clicks "Challenge Friend"
   → Creates challengeRoom (status: 'waiting')
   → Generates 6-char invite code (e.g., "X7K9P2")
   
2. Player A shares code (copy/whatsapp)

3. Player B enters code → clicks "Join"
   → Validates room exists & waiting
   → Adds Player B to room
   
4. Both click "Ready" → status: 'playing'
   
5. Real-time game begins
   → Both see live scores
   → Progress bars animate
   
6. Both finish → status: 'finished'
   → Winner announced
   → Save to challengeResults
   → Offer rematch
```

### Random Matchmaking
```
1. Player clicks "Find Opponent"
   → Add to matchmakingQueue
   → Show "Searching..." animation
   
2. Cloud Function runs every 10 seconds:
   → Query queue for same grade, similar rating
   → Create challengeRoom with both players
   → Remove from queue
   
3. Match found → redirect to lobby
   → 10-second countdown auto-start
   
4. Real-time game (same as above)
```

---

## Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Challenge rooms - only players can read/write
    match /challengeRooms/{roomId} {
      allow read: if signedIn() && 
        request.auth.uid in resource.data.players;
      allow create: if signedIn();
      allow update: if signedIn() && 
        request.auth.uid in resource.data.players;
    }
    
    // Matchmaking queue - own entry only
    match /matchmakingQueue/{playerId} {
      allow read, write: if signedIn() && 
        request.auth.uid == playerId;
    }
    
    // Results - players can read their matches
    match /challengeResults/{resultId} {
      allow read: if signedIn() && (
        request.auth.uid == resource.data.playerA.id ||
        request.auth.uid == resource.data.playerB.id
      );
      allow create: if signedIn(); // server-side ideally
    }
  }
}
```

---

## UI/UX Flow

### 1. Challenge Button (KidsDashboard)
```
┌─────────────────────────────────────┐
│  ⚔️  Challenge Mode  [Dropdown]    │
│                                     │
│  [ Challenge Friend ]  [ Find Opponent ]
│                                     │
└─────────────────────────────────────┘
```

### 2. Friends Challenge Modal
```
┌─────────────────────────────────────┐
│  Challenge a Friend                 │
│                                     │
│  Invite Code:  X7K9P2              │
│  [ Copy ] [ Share on WhatsApp ]     │
│                                     │
│  Waiting for friend to join...      │
│  [ Cancel ]                         │
└─────────────────────────────────────┘
```

### 3. Join Challenge (from code)
```
┌─────────────────────────────────────┐
│  Join Challenge                     │
│                                     │
│  Enter Code: [ _ _ _ _ _ _ ]        │
│                                     │
│  [ Join Game ]                      │
└─────────────────────────────────────┘
```

### 4. Pre-Game Lobby
```
┌─────────────────────────────────────┐
│  Ready to Battle!                   │
│                                     │
│  🇺🇸  Alex           ✅ Ready       │
│  vs                                 │
│  🇬🇧  Sam            ✅ Ready       │
│                                     │
│  Game: Math Blaster                 │
│  Starting in 5...                   │
└─────────────────────────────────────┘
```

### 5. During Game (Real-time UI)
```
┌─────────────────────────────────────┐
│  ⚔️  Math Blaster    2:34 left      │
│                                     │
│  You:  1,240 pts    ████████░░ 80% │
│  Alex  🇺🇸           ██████░░░░ 60% │
│                                     │
│  [ Question here... ]               │
│  [ A ] [ B ] [ C ] [ D ]            │
│                                     │
│  🏆 +50 for win!                    │
└─────────────────────────────────────┘
```

### 6. Results Screen
```
┌─────────────────────────────────────┐
│  🎉 You Won!                        │
│                                     │
│  You:  1,500 pts (+50 bonus)        │
│  Alex: 1,200 pts                    │
│                                     │
│  [ Play Again ] [ Find New Opponent ]│
│  [ Back to Dashboard ]              │
└─────────────────────────────────────┘
```

---

## Technical Implementation

### Services to Create

```typescript
// src/services/challengeService.ts

export const createChallengeRoom = async (
  playerId: string, 
  gameType: string, 
  mode: 'friends' | 'random'
) => {
  const room = {
    status: 'waiting',
    mode,
    gameType,
    players: { [playerId]: { /* player data */ } },
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 min
  }
  return await addDoc(collection(db, 'challengeRooms'), room)
}

export const joinChallengeRoom = async (
  roomId: string, 
  playerId: string
) => {
  // Transaction: check room exists, has space, add player
}

export const updatePlayerProgress = async (
  roomId: string,
  playerId: string,
  score: number,
  progress: number
) => {
  // Throttled write (max 1 per second)
}

export const subscribeToRoom = (
  roomId: string,
  callback: (room: ChallengeRoom) => void
) => {
  return onSnapshot(doc(db, 'challengeRooms', roomId), callback)
}
```

### Matchmaking Algorithm

```typescript
// Cloud Function (or client-side for MVP)
const findMatch = async (playerId: string, grade: string) => {
  const q = query(
    collection(db, 'matchmakingQueue'),
    where('grade', '==', grade),
    where('status', '==', 'searching'),
    where('playerId', '!=', playerId),
    orderBy('timestamp'),
    limit(1)
  )
  
  const match = await getDocs(q)
  if (!match.empty) {
    const opponent = match.docs[0]
    return createChallengeRoom([playerId, opponent.id], 'random')
  }
  
  // No match, add self to queue
  await setDoc(doc(db, 'matchmakingQueue', playerId), {
    playerId, grade, status: 'searching', timestamp: Date.now()
  })
}
```

### Real-time Game Hook

```typescript
// src/hooks/useChallengeRoom.ts
export const useChallengeRoom = (roomId: string) => {
  const [room, setRoom] = useState<ChallengeRoom | null>(null)
  
  useEffect(() => {
    return subscribeToRoom(roomId, setRoom)
  }, [roomId])
  
  const updateScore = useCallback(
    throttle((score: number) => {
      updatePlayerProgress(roomId, currentPlayerId, score, progressPercent)
    }, 1000),
    [roomId]
  )
  
  return { room, updateScore }
}
```

---

## Anti-Cheat (MVP Level)

1. **Server-side score validation**
   - Max score per question: 100 pts
   - Max total: questionCount × 100
   - Reject impossible score jumps (>500 pts in 2 seconds)

2. **Time validation**
   - Minimum time per question: 3 seconds
   - Flag finish times < (questions × 3s)

3. **Disconnect handling**
   - 30-second grace period
   - Auto-forfeit after timeout
   - Opponent wins by default

4. **Rate limiting**
   - Max 1 challenge per minute per player
   - Prevent spam queue entries

---

## Rewards System

| Outcome | XP | Stars | Streak |
|---------|-----|-------|--------|
| Win | +50 | +3 | +1 🔥 |
| Draw | +25 | +2 | 0 |
| Loss | +10 | +1 | Reset |
| Win Streak ×3 | +100 bonus | +5 | — |
| Win Streak ×5 | +200 bonus | +10 | — |

---

## Implementation Phases

### Phase 1: Core (Week 1)
- [ ] Create Firestore collections + rules
- [ ] Challenge room service (create/join/subscribe)
- [ ] Friends challenge with invite code
- [ ] Pre-game lobby UI

### Phase 2: Gameplay (Week 2)
- [ ] Integrate with existing games (Math Blaster, Quiz Race)
- [ ] Real-time score sync
- [ ] Opponent progress bar UI
- [ ] Game completion + results screen

### Phase 3: Matchmaking (Week 3)
- [ ] Random matchmaking queue
- [ ] Matchmaking UI (searching animation)
- [ ] Auto-start countdown

### Phase 4: Polish (Week 4)
- [ ] Anti-cheat validation
- [ ] Rewards integration
- [ ] Rematch feature
- [ ] Challenge history page
- [ ] Leaderboard (most wins)

---

## Files to Create/Modify

### New Files
```
src/
  services/
    challengeService.ts      # Room CRUD + matchmaking
    challengeUtils.ts        # Invite codes, validation
  hooks/
    useChallengeRoom.ts      # Real-time subscription
  components/
    ChallengeLobby.tsx       # Waiting/pre-game screen
    ChallengeGameOverlay.tsx # Opponent score display
    ChallengeResults.tsx     # Win/loss screen
    InviteCodeModal.tsx     # Share/join UI
    MatchmakingSearch.tsx    # Finding opponent
  pages/
    ChallengeMode.tsx        # Main challenge hub
```

### Modified Files
```
src/
  pages/
    KidsDashboard.tsx        # Add Challenge buttons
  games/
    MathBlaster.tsx         # Add challenge mode support
    QuizRaceGame.tsx        # Add challenge mode support
    SpeedChallengeGame.tsx  # Add challenge mode support
    KnowledgeBattleGame.tsx # Add challenge mode support
  store/
    kidsStore.ts            # Add challenge stats
```

---

## Success Metrics

- [ ] Average matchmaking time < 30 seconds
- [ ] Challenge completion rate > 70%
- [ ] Rematch rate > 40%
- [ ] Zero score exploits (validated by server)
- [ ] Works on mobile + desktop

---

## Notes

- Start with **2-player only** (simpler than N-player)
- Use **Firestore** (already integrated) - no need for WebSocket server
- Consider **Cloud Functions** for matchmaking if client-side becomes complex
- Mobile battery: limit onSnapshot updates to 1/sec during gameplay
