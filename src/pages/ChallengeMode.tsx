/**
 * Challenge Mode Page
 * Integrates ChallengeLobby + ChallengeGame + actual game
 */

import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChallengeLobby } from '../components/ChallengeLobby'
import { ChallengeGame } from '../components/ChallengeGame'
import { QuizRaceGame } from '../games/QuizRaceGame'
import { useKidsStore } from '../store/kidsStore'

export function ChallengeMode() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentKid, recordSession } = useKidsStore()
  
  const mode = (searchParams.get('mode') as 'friends' | 'random') || 'friends'
  const gameType = searchParams.get('game') || 'quiz-race'
  
  const [stage, setStage] = useState<'lobby' | 'game' | 'results'>('lobby')
  const [roomId, setRoomId] = useState<string | null>(null)

  const handleGameStart = (id: string) => {
    setRoomId(id)
    setStage('game')
  }

  const handleGameComplete = (score: number, earnedStars: number) => {
    // Save session - no need to track state, just save directly
    if (currentKid) {
      recordSession({
        gameType,
        level: 1,
        score,
        starsEarned: earnedStars,
        correctAnswers: Math.floor(score / 10),
        totalQuestions: 10,
        durationSeconds: 300
      })
    }
  }

  const handleExit = () => {
    navigate('/kids')
  }

  // Render appropriate stage
  if (stage === 'lobby') {
    return (
      <ChallengeLobby
        mode={mode}
        gameType={gameType}
        onExit={handleExit}
        onStart={handleGameStart}
      />
    )
  }

  if (stage === 'game' && roomId) {
    return (
      <ChallengeGame
        roomId={roomId}
        gameComponent={
          <QuizRaceGame
            onComplete={(score, earnedStars) => handleGameComplete(score, earnedStars)}
            onExit={handleExit}
          />
        }
        onGameScore={(score: number, progress: number) => {
          // Real-time score updates handled by ChallengeGame wrapper
          console.log('Score update:', score, progress)
        }}
        onGameComplete={(finalScore: number) => {
          handleGameComplete(finalScore, Math.floor(finalScore / 100))
        }}
        onExit={handleExit}
      />
    )
  }

  // Results are shown by ChallengeGame wrapper, so this shouldn't render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}
