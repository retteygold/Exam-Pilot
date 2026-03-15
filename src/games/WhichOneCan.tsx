import { useState } from 'react'
import { HelpCircle, RotateCcw, Star, ArrowRight } from 'lucide-react'
import { WHICH_CAN_LEVELS } from './whichCanLevels'

interface WhichOneCanProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

export function WhichOneCan({ onComplete, onExit }: WhichOneCanProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const question = WHICH_CAN_LEVELS[currentQuestion]

  function handleSelect(index: number) {
    if (showResult) return
    
    setSelected(index)
    setShowResult(true)
    
    const isCorrect = question.items[index].can
    
    if (isCorrect) {
      const points = 10 + (streak * 2)
      setScore(score + points)
      setStreak(streak + 1)
      setCorrectCount(correctCount + 1)
    } else {
      setStreak(0)
      setScore(Math.max(0, score - 5))
    }
  }

  function nextQuestion() {
    if (currentQuestion < WHICH_CAN_LEVELS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      const stars = Math.min(3, Math.floor((correctCount / WHICH_CAN_LEVELS.length) * 3) + (correctCount === WHICH_CAN_LEVELS.length ? 0 : 1))
      onComplete(score, stars)
    }
  }

  function resetGame() {
    setCurrentQuestion(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setStreak(0)
    setCorrectCount(0)
  }

  const isCorrect = selected !== null && question.items[selected].can

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Q {currentQuestion + 1}/{WHICH_CAN_LEVELS.length}</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <button onClick={resetGame} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Streak */}
        {streak > 1 && (
          <div className="text-center mb-4">
            <span className="px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 font-bold">
              🔥 {streak} streak! (+{streak * 2} bonus)
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion) / WHICH_CAN_LEVELS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all"
              style={{ width: `${((currentQuestion) / WHICH_CAN_LEVELS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700 text-center mb-6">
          <HelpCircle className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {question.question}
          </h1>
          <p className="text-violet-200">Tap the correct answer!</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {question.items.map((item, index) => {
            const isSelected = selected === index
            const showCorrect = showResult && item.can
            const showWrong = showResult && isSelected && !item.can
            
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all
                  ${showCorrect 
                    ? 'bg-emerald-500/30 ring-4 ring-emerald-400 scale-105' 
                    : showWrong
                      ? 'bg-red-500/30 ring-4 ring-red-400'
                      : isSelected
                        ? 'bg-violet-500/30 ring-4 ring-violet-400'
                        : 'bg-slate-700/50 hover:bg-slate-600 hover:scale-105'
                  }
                `}
              >
                <span className="text-5xl md:text-6xl">{item.emoji}</span>
                <span className="text-xs text-slate-300 font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* Result */}
        {showResult && (
          <div className={`rounded-2xl p-4 mb-6 text-center ${isCorrect ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
            <p className={`text-xl font-bold mb-2 ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
              {isCorrect ? '🎉 Correct!' : '❌ Not quite!'}
            </p>
            <p className="text-slate-300 mb-4">{question.explanation}</p>
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-white flex items-center gap-2 mx-auto"
            >
              {currentQuestion < WHICH_CAN_LEVELS.length - 1 ? 'Next Question' : 'Finish'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm text-slate-400">
          <span>✅ Correct: {correctCount}</span>
          <span>❌ Wrong: {currentQuestion - correctCount + (showResult && !isCorrect ? 1 : 0)}</span>
        </div>
      </div>
    </div>
  )
}
