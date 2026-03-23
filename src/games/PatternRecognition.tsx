import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Shapes, Brain } from 'lucide-react'

interface PatternRecognitionProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Shape = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond'

interface Pattern {
  shapes: Shape[]
  options: Shape[]
  answer: number
}

const shapeIcons: Record<Shape, string> = {
  circle: '⭕',
  square: '⬜',
  triangle: '🔺',
  star: '⭐',
  heart: '❤️',
  diamond: '🔷'
}

const allShapes: Shape[] = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond']

export function PatternRecognition({ onComplete: _onComplete, onExit }: PatternRecognitionProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [streak, setStreak] = useState(0)

  const generatePattern = (lvl: number): Pattern => {
    const patternLength = Math.min(3 + Math.floor(lvl / 3), 6)
    const shapes: Shape[] = []
    
    // Generate pattern with repetition
    for (let i = 0; i < patternLength; i++) {
      shapes.push(allShapes[i % allShapes.length])
    }
    
    // Hide one shape
    const hiddenIndex = Math.floor(Math.random() * shapes.length)
    
    // Create options (including the correct one)
    const options = [shapes[hiddenIndex]]
    while (options.length < 4) {
      const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)]
      if (!options.includes(randomShape)) {
        options.push(randomShape)
      }
    }
    options.sort(() => Math.random() - 0.5)
    
    return { shapes, options, answer: options.indexOf(shapes[hiddenIndex]) }
  }

  useEffect(() => {
    setCurrentPattern(generatePattern(level))
    setSelected(null)
    setShowCorrect(false)
  }, [level])

  const handleSelect = (idx: number) => {
    if (showCorrect || !currentPattern) return
    
    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentPattern.answer) {
      const points = 15 + Math.min(streak * 3, 25)
      setScore(s => s + points)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (level >= 14) {
        console.log('[DEBUG] PatternRecognition game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] PatternRecognition calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
      }
    }, 1500)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Shapes className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Pattern Master!</h2>
          <p className="text-xl text-cyan-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); }} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPattern) return null

  // Find which position is hidden
  const hiddenIndex = currentPattern.shapes.findIndex((shape) => {
    return currentPattern.options[currentPattern.answer] === shape
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <span className="text-white font-bold">{level + 1}/15</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Complete the Pattern</h1>
        </div>

        {/* Pattern Display */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {currentPattern.shapes.map((shape, i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                  i === hiddenIndex ? 'bg-slate-700/50 border-2 border-dashed border-cyan-400' : 'bg-slate-800/50'
                }`}
              >
                {i === hiddenIndex ? '?' : shapeIcons[shape]}
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {currentPattern.options.map((shape, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showCorrect}
              className={`h-24 rounded-2xl text-4xl flex items-center justify-center transition-all ${
                showCorrect && i === currentPattern.answer ? 'bg-green-500 scale-110 ring-4 ring-white' :
                showCorrect && i === selected && i !== currentPattern.answer ? 'bg-red-500' :
                selected === i ? 'bg-cyan-500' :
                'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600'
              }`}
            >
              {shapeIcons[shape]}
            </button>
          ))}
        </div>

        {streak > 2 && (
          <p className="text-center text-cyan-300 mt-6 font-bold">
            🔥 {streak} Streak!
          </p>
        )}

        <p className="text-center text-slate-400 text-sm mt-6">
          What comes next in the pattern?
        </p>
      </div>
    </div>
  )
}
