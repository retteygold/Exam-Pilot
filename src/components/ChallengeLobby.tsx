import { useState, useEffect } from 'react'
import { Swords, Copy, Check, Users, Zap, Clock, ArrowLeft, Gamepad2 } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'
import {
  createChallengeRoom,
  joinChallengeByCode,
  setPlayerReady,
  startChallenge,
  subscribeToRoom,
  leaveChallenge,
  cancelChallenge,
  type ChallengeRoom
} from '../services/challengeService'

interface ChallengeLobbyProps {
  mode: 'friends' | 'random'
  gameType: string
  onExit: () => void
  onStart: (roomId: string) => void
}

export function ChallengeLobby({ mode, gameType, onExit, onStart }: ChallengeLobbyProps) {
  const { currentKid } = useKidsStore()
  const [room, setRoom] = useState<ChallengeRoom | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState<string>('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Create or join room on mount
  useEffect(() => {
    if (!currentKid) return

    const init = async () => {
      try {
        if (mode === 'friends') {
          // Create room and get invite code
          const newRoomId = await createChallengeRoom(
            currentKid.id,
            currentKid.name,
            currentKid.avatar,
            currentKid.grade,
            gameType,
            'friends',
            currentKid.countryFlag
          )
          setRoomId(newRoomId)
          // Get room data to extract invite code
          const unsub = subscribeToRoom(newRoomId, (roomData) => {
            if (roomData) {
              setRoom(roomData)
              setInviteCode(roomData.inviteCode || '')
            }
          })
          return unsub
        }
      } catch (err) {
        setError('Failed to create challenge room')
      }
    }

    let cleanupFn: (() => void) | undefined

    init().then((cleanup) => {
      cleanupFn = cleanup
    })

    return () => {
      cleanupFn?.()
    }
  }, [mode, gameType, currentKid])

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsub = subscribeToRoom(roomId, (roomData) => {
      if (!roomData) {
        setError('Room was cancelled')
        return
      }
      setRoom(roomData)

      // Check if game started
      if (roomData.status === 'playing') {
        onStart(roomId)
      }

      // Countdown when both ready
      const players = Object.values(roomData.players)
      const allReady = players.length === 2 && players.every(p => p.ready)
      if (allReady && countdown === 0) {
        setCountdown(5)
      }
    })

    return unsub
  }, [roomId, onStart])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1 && roomId) {
          startChallenge(roomId)
        }
        setCountdown(c => c - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, roomId])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoinByCode = async () => {
    if (!currentKid || joinCode.length !== 6) return

    try {
      const joinedRoomId = await joinChallengeByCode(
        joinCode.toUpperCase(),
        currentKid.id,
        currentKid.name,
        currentKid.avatar,
        currentKid.grade,
        currentKid.countryFlag
      )

      if (joinedRoomId) {
        setRoomId(joinedRoomId)
        setError('')
      } else {
        setError('Invalid code or room is full')
      }
    } catch {
      setError('Failed to join room')
    }
  }

  const handleReady = async () => {
    if (!roomId || !currentKid) return
    setIsReady(true)
    await setPlayerReady(roomId, currentKid.id, true)
  }

  const handleCancel = async () => {
    if (!roomId) return
    await cancelChallenge(roomId)
    onExit()
  }

  const handleLeave = async () => {
    if (!roomId || !currentKid) return
    await leaveChallenge(roomId, currentKid.id)
    onExit()
  }

  if (!currentKid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Please login first</div>
      </div>
    )
  }

  // Show join code input for friends mode if not in room yet
  if (mode === 'friends' && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={onExit} className="flex items-center gap-2 text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Swords className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Challenge a Friend</h1>
            <p className="text-purple-200">Enter invite code to join</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="X7K9P2"
              maxLength={6}
              className="w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-2xl font-bold tracking-widest placeholder-slate-500 focus:outline-none focus:border-yellow-500"
            />
            <button
              onClick={handleJoinByCode}
              disabled={joinCode.length !== 6}
              className="w-full mt-4 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 rounded-xl font-bold text-white"
            >
              Join Challenge
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Or create your own challenge from the dashboard
            </p>
          </div>
        </div>
      </div>
    )
  }

  const players = room ? Object.values(room.players) : []
  const isHost = room?.players[currentKid.id] && Object.keys(room.players)[0] === currentKid.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={handleLeave} className="flex items-center gap-2 text-white mb-6">
          <ArrowLeft className="w-5 h-5" /> Leave
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === 'friends' ? <Users className="w-10 h-10 text-white" /> : <Zap className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {mode === 'friends' ? 'Friend Challenge' : 'Random Match'}
          </h1>
          <p className="text-purple-200 flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            {gameType.replace(/-/g, ' ')}
          </p>
        </div>

        {/* Invite Code (friends mode) */}
        {mode === 'friends' && inviteCode && (
          <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Share this code with your friend</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-900/50 rounded-xl px-4 py-3 text-center">
                <span className="text-2xl font-bold text-yellow-400 tracking-widest">{inviteCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        )}

        {/* Players */}
        <div className="mb-6 space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${
                player.id === currentKid.id
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
                {player.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{player.name}</span>
                  {player.flag && <span>{player.flag}</span>}
                  {player.id === currentKid.id && (
                    <span className="text-xs text-yellow-400">(You)</span>
                  )}
                </div>
                <span className="text-sm text-slate-400">{player.grade}</span>
              </div>
              {player.ready ? (
                <div className="px-3 py-1 bg-green-500/20 rounded-full">
                  <span className="text-green-400 text-sm font-bold">Ready</span>
                </div>
              ) : (
                <div className="px-3 py-1 bg-slate-700 rounded-full">
                  <span className="text-slate-400 text-sm">Waiting...</span>
                </div>
              )}
            </div>
          ))}

          {/* Empty slot */}
          {players.length < 2 && (
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-600 bg-slate-800/30">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex-1">
                <span className="text-slate-500">Waiting for opponent...</span>
              </div>
              <div className="animate-pulse">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-white">{countdown}</div>
            <p className="text-purple-200">Starting soon...</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {players.length === 2 && !isReady && countdown === 0 && (
            <button
              onClick={handleReady}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl font-bold text-white text-lg"
            >
              I'm Ready!
            </button>
          )}

          {isReady && countdown === 0 && (
            <div className="w-full py-4 bg-slate-700 rounded-2xl font-bold text-white text-center">
              Waiting for opponent...
            </div>
          )}

          {isHost && players.length === 1 && (
            <button
              onClick={handleCancel}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white"
            >
              Cancel Challenge
            </button>
          )}
        </div>

        {/* Game info */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Limit
            </span>
            <span className="text-white">{room?.gameConfig.timeLimitSeconds || 300}s</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Questions
            </span>
            <span className="text-white">{room?.gameConfig.questionCount || 10}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
