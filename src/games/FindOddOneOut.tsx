import { useState } from 'react'
import { Eye, RotateCcw, Trophy, Star } from 'lucide-react'

interface FindOddOneOutProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const LEVELS = [
  {
    items: ['🍎', '🍎', '🍎', '🍊'],
    odd: 3,
    hint: 'Find the fruit that is different!'
  },
  {
    items: ['🔵', '🔵', '🔵', '🔵', '🟢'],
    odd: 4,
    hint: 'Look for the different color!'
  },
  {
    items: ['🐶', '🐶', '🐶', '🐱'],
    odd: 3,
    hint: 'One animal is different!'
  },
  {
    items: ['🚗', '🚗', '🚗', '🚗', '🚗', '🚙'],
    odd: 5,
    hint: 'Find the different vehicle!'
  },
  {
    items: ['⭐', '⭐', '⭐', '⭐', '🌟'],
    odd: 4,
    hint: 'Look closely at the stars!'
  },
  {
    items: ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🟠'],
    odd: 6,
    hint: 'One circle has a different color!'
  },
  {
    items: ['✏️', '✏️', '✏️', '✏️', '🖊️'],
    odd: 4,
    hint: 'Find the different writing tool!'
  },
  {
    items: ['🎵', '🎵', '🎵', '🎶'],
    odd: 3,
    hint: 'One note is different!'
  },
  {
    items: ['🏀', '🏀', '🏀', '🏀', '⚽'],
    odd: 4,
    hint: 'Find the different ball!'
  },
  {
    items: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌺'],
    odd: 5,
    hint: 'One flower is different!'
  }
]

export function FindOddOneOut({ onComplete, onExit }: FindOddOneOutProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [wrongSelections, setWrongSelections] = useState<number[]>([])
  const [found, setFound] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const level = LEVELS[currentLevel]

  function handleItemClick(index: number) {
    if (found || wrongSelections.includes(index)) return

    if (index === level.odd) {
      // Correct!
      const bonus = attempts === 0 ? 20 : attempts === 1 ? 15 : 10
      setScore(score + bonus)
      setFound(true)
      
      setTimeout(() => {
        if (currentLevel < LEVELS.length - 1) {
          nextLevel()
        } else {
          const stars = Math.min(3, Math.floor(score / 50) + 1)
          onComplete(score, stars)
        }
      }, 1500)
    } else {
      // Wrong
      setWrongSelections([...wrongSelections, index])
      setAttempts(attempts + 1)
      setScore(Math.max(0, score - 5))
    }
  }

  function nextLevel() {
    setCurrentLevel(currentLevel + 1)
    setAttempts(0)
    setWrongSelections([])
    setFound(false)
    setShowHint(false)
  }

  function resetGame() {
    setCurrentLevel(0)
    setScore(0)
    setAttempts(0)
    setWrongSelections([])
    setFound(false)
    setShowHint(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Level {currentLevel + 1}/{LEVELS.length}</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <button onClick={resetGame} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <Eye className="w-12 h-12 text-orange-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Find the Odd One!</h1>
          <p className="text-orange-200">Look carefully and find what's different</p>
        </div>

        {/* Hint Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowHint(true)}
            disabled={showHint}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
              showHint 
                ? 'bg-slate-700/50 text-slate-400' 
                : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
            }`}
          >
            <Eye className="w-4 h-4" />
            {showHint ? level.hint : 'Need a hint?'}
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Progress</span>
            <span>{Math.round((currentLevel / LEVELS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all"
              style={{ width: `${((currentLevel) / LEVELS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <p className="text-lg text-white font-medium">
            {found ? '🎉 You found it!' : 'Click the item that is different!'}
          </p>
          {attempts > 0 && (
            <p className="text-orange-300 text-sm mt-1">
              Keep trying! {attempts} {attempts === 1 ? 'wrong guess' : 'wrong guesses'}
            </p>
          )}
        </div>

        {/* Items Grid */}
        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {level.items.map((item, index) => {
              const isWrong = wrongSelections.includes(index)
              const isCorrect = found && index === level.odd
              
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(index)}
                  disabled={isWrong || found}
                  className={`
                    aspect-square rounded-2xl text-4xl md:text-5xl flex items-center justify-center transition-all
                    ${isWrong 
                      ? 'bg-red-500/20 opacity-30 cursor-not-allowed' 
                      : isCorrect
                        ? 'bg-emerald-500/30 ring-4 ring-emerald-400 scale-110'
                        : found
                          ? 'bg-slate-700/30 opacity-50'
                          : 'bg-slate-700/50 hover:bg-slate-600 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            💡 Tip: Look for differences in color, shape, or type!
          </p>
        </div>

        {/* Level Complete Overlay */}
        {found && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 pointer-events-none">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm pointer-events-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Great Eye!</h2>
              <p className="text-slate-300 mb-4">
                You found the odd one out!
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${
                    i < (attempts === 0 ? 3 : attempts === 1 ? 2 : 1) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-slate-600'
                  }`} />
                ))}
              </div>
              <p className="text-yellow-400 font-bold mb-4">+{attempts === 0 ? 20 : attempts === 1 ? 15 : 10} points</p>
              <p className="text-slate-400 text-sm">
                {currentLevel < LEVELS.length - 1 ? 'Next level coming up...' : 'Final level complete!'}
              </p>
            </div>
          </div>
        )}

        {/* Game Complete */}
        {currentLevel === LEVELS.length - 1 && found && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Game Complete!</h2>
              <p className="text-slate-300 mb-4">You found all the odd ones!</p>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`w-8 h-8 ${i < Math.min(3, Math.floor(score / 50) + 1) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <p className="text-2xl font-bold text-yellow-400 mb-6">{score} points</p>
              <button 
                onClick={() => onComplete(score, Math.min(3, Math.floor(score / 50) + 1))}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-bold text-white"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
