import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Palette, Check, Sparkles } from 'lucide-react'

interface ColorMatchProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

interface Color {
  name: string
  bg: string
  border: string
}

const colors: Color[] = [
  { name: 'RED', bg: 'bg-red-500', border: 'border-red-400' },
  { name: 'BLUE', bg: 'bg-blue-500', border: 'border-blue-400' },
  { name: 'GREEN', bg: 'bg-green-500', border: 'border-green-400' },
  { name: 'YELLOW', bg: 'bg-yellow-500', border: 'border-yellow-400' },
  { name: 'PURPLE', bg: 'bg-purple-500', border: 'border-purple-400' },
  { name: 'ORANGE', bg: 'bg-orange-500', border: 'border-orange-400' },
  { name: 'PINK', bg: 'bg-pink-500', border: 'border-pink-400' },
  { name: 'CYAN', bg: 'bg-cyan-500', border: 'border-cyan-400' },
]

export function ColorMatch({ onComplete: _onComplete, onExit }: ColorMatchProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [targetColor, setTargetColor] = useState<Color | null>(null)
  const [options, setOptions] = useState<Color[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    generateLevel()
  }, [level])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !showCorrect) {
      const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0) {
      setGameOver(true)
    }
  }, [timeLeft, gameOver, showCorrect])

  const generateLevel = () => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5)
    const target = shuffled[0]
    const opts = shuffled.slice(0, 4).sort(() => Math.random() - 0.5)
    setTargetColor(target)
    setOptions(opts)
    setSelected(null)
    setShowCorrect(false)
    setTimeLeft(30)
  }

  const handleSelect = (idx: number) => {
    if (showCorrect || !targetColor) return
    
    setSelected(idx)
    setShowCorrect(true)
    
    if (options[idx].name === targetColor.name) {
      const points = 15 + Math.min(streak * 2, 20)
      setScore(s => s + points)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (level >= 14) {
        setGameOver(true)
      } else {
        setLevel(l => l + 1)
      }
    }, 1000)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Palette className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Color Master!</h2>
          <p className="text-xl text-purple-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); }} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!targetColor) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full">
              <span className="text-purple-400 font-bold text-sm">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 font-bold">
            <Sparkles className="w-4 h-4" /> Level {level + 1}/15
          </span>
        </div>

        {/* Target Color */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6 text-center">
          <p className="text-purple-200 text-sm mb-4">Find this color:</p>
          <div className={`w-32 h-32 mx-auto rounded-2xl ${targetColor.bg} shadow-2xl border-4 ${targetColor.border} flex items-center justify-center mb-4`}>
            <span className="text-white font-bold text-2xl drop-shadow-lg">{targetColor.name}</span>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((color, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showCorrect}
              className={`h-24 rounded-2xl ${color.bg} border-4 ${color.border} transition-all ${
                showCorrect && color.name === targetColor.name ? 'scale-110 ring-4 ring-white' :
                showCorrect && i === selected && color.name !== targetColor.name ? 'opacity-50' :
                'hover:scale-105'
              }`}
            >
              {showCorrect && color.name === targetColor.name && (
                <Check className="w-8 h-8 text-white mx-auto" />
              )}
            </button>
          ))}
        </div>

        {streak > 2 && (
          <p className="text-center text-purple-300 mt-4 font-bold">
            🔥 {streak} Streak!
          </p>
        )}
      </div>
    </div>
  )
}
