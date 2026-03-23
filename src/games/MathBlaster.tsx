import { useState, useEffect, useCallback } from 'react'
import { Star, Trophy, Timer, ArrowLeft, Zap } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface MathBlasterProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  question: string
  answer: number
  options: number[]
  difficulty: Difficulty
}

export function MathBlaster({ onComplete: _onComplete, onExit }: MathBlasterProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()
  
  const [level, setLevel] = useState(activeGame?.gameType === 'math-blaster' ? activeGame.level : 1)
  const [score, setScore] = useState(activeGame?.gameType === 'math-blaster' ? activeGame.score : 0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [showCorrect, setShowCorrect] = useState<number | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Start game session on mount
  useEffect(() => {
    if (!initialized) {
      startGameSession('math-blaster', level, { timeLeft })
      setInitialized(true)
    }
  }, [initialized, startGameSession, level, timeLeft])

  const generateQuestion = useCallback((lvl: number): Question => {
    const diff: Difficulty = lvl <= 3 ? 'easy' : lvl <= 6 ? 'medium' : 'hard'
    let q: string, a: number
    
    switch (diff) {
      case 'easy':
        const a1 = Math.floor(Math.random() * 10) + 1
        const b1 = Math.floor(Math.random() * 10) + 1
        if (Math.random() > 0.5) {
          q = `${a1} + ${b1} = ?`
          a = a1 + b1
        } else {
          q = `${Math.max(a1, b1)} - ${Math.min(a1, b1)} = ?`
          a = Math.max(a1, b1) - Math.min(a1, b1)
        }
        break
      case 'medium':
        const a2 = Math.floor(Math.random() * 12) + 2
        const b2 = Math.floor(Math.random() * 12) + 2
        if (Math.random() > 0.5) {
          q = `${a2} × ${b2} = ?`
          a = a2 * b2
        } else {
          const prod = a2 * b2
          q = `${prod} ÷ ${a2} = ?`
          a = b2
        }
        break
      case 'hard':
        const a3 = Math.floor(Math.random() * 20) + 5
        const b3 = Math.floor(Math.random() * 15) + 3
        const c3 = Math.floor(Math.random() * 10) + 1
        if (Math.random() > 0.5) {
          q = `${a3} + ${b3} × ${c3} = ?`
          a = a3 + b3 * c3
        } else {
          q = `(${a3} + ${b3}) × ${c3} = ?`
          a = (a3 + b3) * c3
        }
        break
    }

    const opts = [a]
    while (opts.length < 4) {
      const wrong = a + Math.floor(Math.random() * 20) - 10
      if (wrong !== a && !opts.includes(wrong) && wrong > 0) {
        opts.push(wrong)
      }
    }
    opts.sort(() => Math.random() - 0.5)

    return { question: q, answer: a, options: opts, difficulty: diff }
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
      console.log('[DEBUG] MathBlaster time up, ending game with score:', score)
      setGameOver(true)
      // Clear active game and call onComplete to record session
      clearActiveGame()
      if (_onComplete) {
        const finalStars = Math.min(Math.floor(score / 50), 5)
        console.log('[DEBUG] MathBlaster calling onComplete with score:', score, 'stars:', finalStars)
        _onComplete(score, finalStars)
      }
    }
  }, [timeLeft, gameOver, score, _onComplete, clearActiveGame])

  const handleAnswer = (ans: number) => {
    if (!currentQ || gameOver) return
    
    if (ans === currentQ.answer) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 20 : 30
      const streakBonus = Math.min(streak * 2, 20)
      setScore(s => s + points + streakBonus)
      setStreak(s => s + 1)
      setLevel(l => l + 1)
      setTimeLeft(30)
      setShowCorrect(null)
    } else {
      setShowCorrect(currentQ.answer)
      setStreak(0)
      setTimeout(() => {
        setLevel(l => l + 1)
        setTimeLeft(30)
        setShowCorrect(null)
      }, 1000)
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
          <p className="text-xl text-yellow-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(1); setStreak(0); setTimeLeft(30); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full">
            <Timer className="w-4 h-4 text-orange-400" />
            <span className={`font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-orange-400'}`}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Level & Streak */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold">Level {level}</span>
        </div>
        {streak > 2 && <p className="text-orange-400 font-bold animate-pulse">🔥 {streak} Streak!</p>}
      </div>

      {/* Question */}
      {currentQ && (
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-6 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              currentQ.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
              currentQ.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
              'bg-red-500/30 text-red-300'
            }`}>{currentQ.difficulty.toUpperCase()}</span>
            <h1 className="text-5xl font-bold text-white">{currentQ.question}</h1>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={showCorrect !== null}
                className={`py-4 rounded-2xl font-bold text-xl transition-all ${
                  showCorrect === opt ? 'bg-green-500 text-white' :
                  showCorrect !== null && opt !== showCorrect ? 'bg-slate-700/50 text-slate-400' :
                  'bg-gradient-to-br from-orange-500/30 to-red-500/30 text-white hover:from-orange-500/50 hover:to-red-500/50 border border-orange-400/30'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
