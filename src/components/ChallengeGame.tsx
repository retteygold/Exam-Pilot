/**
 * ChallengeGame - Real-time multiplayer game wrapper
 * Wraps existing games and adds real-time score sync + opponent progress
 */

import { useState, useEffect, useRef } from 'react'
import { useKidsStore } from '../store/kidsStore'
import {
  subscribeToRoom,
  updatePlayerProgress,
  finishChallenge,
  type ChallengeRoom
} from '../services/challengeService'
import { Users, Trophy, Zap } from 'lucide-react'

interface ChallengeGameProps {
  roomId: string
  gameComponent: React.ReactNode
  onGameScore: (score: number, progress: number) => void
  onGameComplete: (finalScore: number) => void
  onExit: () => void
}

export function ChallengeGame({
  roomId,
  gameComponent,
  onGameScore,
  onGameComplete,
  onExit
}: ChallengeGameProps) {
  const { currentKid } = useKidsStore()
  const [room, setRoom] = useState<ChallengeRoom | null>(null)
  const [opponent, setOpponent] = useState<{ name: string; avatar: string; score: number; progress: number } | null>(null)
  const [myScore, setMyScore] = useState(0)
  const [myProgress, setMyProgress] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [winner, setWinner] = useState<string | 'draw' | null>(null)
  const scoreThrottleRef = useRef<number>(0)

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId || !currentKid) return

    const unsub = subscribeToRoom(roomId, (roomData) => {
      if (!roomData) return
      setRoom(roomData)

      // Find opponent
      const opponentData = Object.values(roomData.players).find(
        p => p.id !== currentKid.id
      )
      if (opponentData) {
        setOpponent({
          name: opponentData.name,
          avatar: opponentData.avatar,
          score: opponentData.score,
          progress: opponentData.progress
        })
      }

      // Check if game ended
      if (roomData.status === 'finished') {
        setGameEnded(true)
        setWinner(roomData.winnerId || null)
      }
    })

    return unsub
  }, [roomId, currentKid])

  // Expose challenge controls via ref pattern for child games
  const challengeRef = useRef({
    updateScore: (_score: number, _progress: number) => {},
    complete: (_finalScore: number) => {}
  })

  // Register callbacks in ref so child can access via context or props
  useEffect(() => {
    challengeRef.current.updateScore = (score: number, progress: number) => {
      if (!roomId || !currentKid) return
      setMyScore(score)
      setMyProgress(progress)
      const now = Date.now()
      if (now - scoreThrottleRef.current > 1000) {
        scoreThrottleRef.current = now
        updatePlayerProgress(roomId, currentKid.id, score, progress)
      }
      onGameScore(score, progress)
    }

    challengeRef.current.complete = (finalScore: number) => {
      if (!roomId || !currentKid || gameEnded) return
      setMyScore(finalScore)
      setMyProgress(100)
      finishChallenge(roomId, currentKid.id, finalScore)
      onGameComplete(finalScore)
    }
  }, [roomId, currentKid, gameEnded, onGameScore, onGameComplete])

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Loading challenge...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Opponent Status Bar - Fixed at top */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* You */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/30 rounded-full flex items-center justify-center text-xl">
                {currentKid?.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-white">You</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400">{myScore} pts</span>
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${myProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VS / Status */}
            <div className="text-center">
              {gameEnded ? (
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-bold text-white">
                    {winner === 'draw' ? 'Draw!' : winner === currentKid?.id ? 'You Win!' : 'Opponent Wins!'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-purple-300">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold">LIVE</span>
                  <Zap className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white">{opponent?.name || 'Waiting...'}</p>
                {opponent && (
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full transition-all"
                        style={{ width: `${opponent.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-400">{opponent.score} pts</span>
                  </div>
                )}
              </div>
              <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center text-xl">
                {opponent?.avatar || <Users className="w-5 h-5 text-slate-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative">
        {gameEnded ? (
          <ChallengeResults
            winner={winner}
            myScore={myScore}
            opponentScore={opponent?.score || 0}
            opponentName={opponent?.name || 'Opponent'}
            onRematch={() => window.location.reload()}
            onExit={onExit}
          />
        ) : (
          <div className="challenge-game-wrapper">
            {gameComponent}
          </div>
        )}
      </div>
    </div>
  )
}

// Results Screen Component
interface ChallengeResultsProps {
  winner: string | 'draw' | null
  myScore: number
  opponentScore: number
  opponentName: string
  onRematch: () => void
  onExit: () => void
}

function ChallengeResults({
  winner,
  myScore,
  opponentScore,
  opponentName,
  onRematch,
  onExit
}: ChallengeResultsProps) {
  const { currentKid } = useKidsStore()
  const isWinner = winner === currentKid?.id
  const isDraw = winner === 'draw'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 text-center">
        {/* Result Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isWinner
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
            : isDraw
            ? 'bg-gradient-to-br from-blue-400 to-purple-500'
            : 'bg-gradient-to-br from-slate-500 to-slate-600'
        }`}>
          {isWinner ? (
            <Trophy className="w-12 h-12 text-white" />
          ) : isDraw ? (
            <Users className="w-12 h-12 text-white" />
          ) : (
            <span className="text-4xl">😢</span>
          )}
        </div>

        {/* Result Text */}
        <h2 className={`text-3xl font-bold mb-2 ${
          isWinner ? 'text-yellow-400' : isDraw ? 'text-blue-400' : 'text-slate-400'
        }`}>
          {isWinner ? 'You Won!' : isDraw ? "It's a Draw!" : 'You Lost!'}
        </h2>
        <p className="text-slate-400 mb-8">
          {isWinner ? '🎉 Great job! You beat your opponent!' : isDraw ? '🤝 Close match!' : '💪 Keep practicing!'}
        </p>

        {/* Score Comparison */}
        <div className="bg-slate-900/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-slate-400">You</p>
              <p className="text-2xl font-bold text-yellow-400">{myScore}</p>
            </div>
            <div className="text-slate-500 font-bold">VS</div>
            <div className="text-center flex-1">
              <p className="text-sm text-slate-400">{opponentName}</p>
              <p className="text-2xl font-bold text-purple-400">{opponentScore}</p>
            </div>
          </div>

          {/* Bonus XP */}
          <div className="pt-3 border-t border-slate-700">
            <p className="text-sm text-slate-400">Bonus XP</p>
            <p className="text-xl font-bold text-green-400">
              +{isWinner ? 50 : isDraw ? 25 : 10} XP
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRematch}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-2xl font-bold text-white"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
