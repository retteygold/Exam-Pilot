import { useState, useEffect, useCallback } from 'react'
import { Star, ArrowLeft, Zap, Timer, Trophy, Flame } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface SpeedMathProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Operation = '+' | '-' | '×' | '÷'

interface Question {
  num1: number
  num2: number
  operation: Operation
  answer: number
  options: number[]
}

export function SpeedMath({ onComplete: _onComplete, onExit }: SpeedMathProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()
  
  const [level, setLevel] = useState(activeGame?.gameType === 'speed-math' ? activeGame.level : 1)
  const [score, setScore] = useState(activeGame?.gameType === 'speed-math' ? activeGame.score : 0)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showCorrect, setShowCorrect] = useState<number | null>(null)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [initialized, setInitialized] = useState(false)

  // Start game session on mount
  useEffect(() => {
    if (!initialized) {
      startGameSession('speed-math', level, { timeLeft })
      setInitialized(true)
    }
  }, [initialized, startGameSession, level, timeLeft])

  const generateQuestion = useCallback((lvl: number): Question => {
    const operations: Operation[] = lvl <= 3 ? ['+', '-'] : lvl <= 6 ? ['+', '-', '×'] : ['+', '-', '×', '÷']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1: number, num2: number, answer: number
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * (lvl * 5)) + 1
        num2 = Math.floor(Math.random() * (lvl * 5)) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * (lvl * 5)) + 5
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * (lvl * 2)) + 2
        num2 = Math.floor(Math.random() * 10) + 1
        answer = num1 * num2
        break
      case '÷':
        num2 = Math.floor(Math.random() * 8) + 2
        answer = Math.floor(Math.random() * (lvl * 3)) + 1
        num1 = num2 * answer
        break
    }
    
    // Generate wrong options
    const options = [answer]
    while (options.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10
      if (wrong !== answer && !options.includes(wrong) && wrong > 0) {
        options.push(wrong)
      }
    }
    options.sort(() => Math.random() - 0.5)
    
    return { num1, num2, operation, answer, options }
  }, [])

  useEffect(() => {
    setCurrentQ(generateQuestion(level))
  }, [level, generateQuestion])

  // Save progress whenever level or score changes
  useEffect(() => {
    if (initialized && !gameOver) {
      updateGameProgress(level, score, { timeLeft })
    }
  }, [initialized, level, score, timeLeft, gameOver, updateGameProgress])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0 && !gameOver) {
      console.log('[DEBUG] SpeedMath time up, ending game with score:', score)
      setGameOver(true)
      // Clear active game and call onComplete to record session
      clearActiveGame()
      if (_onComplete) {
        const stars = Math.min(Math.floor(score / 100), 5)
        console.log('[DEBUG] SpeedMath calling onComplete with score:', score, 'stars:', stars)
        _onComplete(score, stars)
      }
    }
  }, [timeLeft, gameOver, score, _onComplete, clearActiveGame])

  const handleAnswer = (ans: number) => {
    if (!currentQ || gameOver) return
    
    if (ans === currentQ.answer) {
      const points = Math.min(level * 10, 50) + Math.min(streak * 3, 30)
      setScore(s => s + points)
      setStreak(s => s + 1)
      setTotalCorrect(c => c + 1)
      setShowCorrect(ans)
    } else {
      setStreak(0)
      setShowCorrect(currentQ.answer)
    }

    setTimeout(() => {
      setLevel(l => l + 1)
      setShowCorrect(null)
    }, 600)
  }

  const stars = Math.min(Math.floor(score / 100), 5)

  if (gameOver) {
    const stars = Math.min(Math.floor(score / 100), 5)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-orange-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Time's Up!</h2>
          <p className="text-xl text-orange-300 mb-2">Score: {score}</p>
          <p className="text-lg text-orange-200 mb-4">Correct: {totalCorrect} answers</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(1); setTimeLeft(60); setGameOver(false); setStreak(0); setTotalCorrect(0); }} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full">
              <Timer className="w-4 h-4 text-red-400" />
              <span className={`font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-orange-400'}`}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Level & Streak */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-bold">Level {level}</span>
          </div>
          {streak > 2 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/30 rounded-full">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-bold">{streak}</span>
            </div>
          )}
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-6 text-center">
            <div className="text-5xl font-bold text-white mb-6">
              {currentQ.num1} {currentQ.operation} {currentQ.num2} = ?
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={showCorrect !== null}
                  className={`py-4 rounded-2xl font-bold text-2xl transition-all ${
                    showCorrect === opt ? 'bg-green-500 text-white scale-105' :
                    showCorrect !== null ? 'bg-slate-700/50 text-slate-400' :
                    'bg-gradient-to-br from-orange-500/30 to-red-500/30 text-white hover:from-orange-500/50 hover:to-red-500/50 border border-orange-400/30'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-orange-300 text-sm">
          Answer as fast as you can! ⏱️
        </p>
      </div>
    </div>
  )
}
