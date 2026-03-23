import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Globe, MapPin, Flag, Mountain, Compass } from 'lucide-react'

interface MapExplorerProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

type QuestionType = 'capital' | 'flag' | 'landmark' | 'continent'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  type: QuestionType
  question: string
  options: string[]
  answer: number
  hint: string
  difficulty: Difficulty
}

const questions: Question[] = [
  // Easy - Capitals and basic geography
  { type: 'capital', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], answer: 2, hint: 'City of Lights', difficulty: 'easy' },
  { type: 'capital', question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], answer: 2, hint: 'Land of the Rising Sun', difficulty: 'easy' },
  { type: 'flag', question: 'Which country has a red circle on white flag?', options: ['China', 'Japan', 'Korea', 'Singapore'], answer: 1, hint: 'Island nation in Asia', difficulty: 'easy' },
  { type: 'continent', question: 'Which continent is Egypt in?', options: ['Asia', 'Europe', 'Africa', 'South America'], answer: 2, hint: 'Home to the Sahara Desert', difficulty: 'easy' },
  { type: 'capital', question: 'What is the capital of USA?', options: ['New York', 'Los Angeles', 'Washington DC', 'Chicago'], answer: 2, hint: 'White House is here', difficulty: 'easy' },
  // Medium - Harder capitals and landmarks
  { type: 'capital', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 2, hint: 'Not the biggest city!', difficulty: 'medium' },
  { type: 'landmark', question: 'Where is the Eiffel Tower?', options: ['London', 'Paris', 'Rome', 'Berlin'], answer: 1, hint: 'Iron tower, city of love', difficulty: 'medium' },
  { type: 'flag', question: 'Which country has stars and stripes?', options: ['UK', 'USA', 'Australia', 'Canada'], answer: 1, hint: '50 stars, 13 stripes', difficulty: 'medium' },
  { type: 'landmark', question: 'Where is the Great Wall?', options: ['Japan', 'Korea', 'China', 'India'], answer: 2, hint: 'Ancient wall thousands of miles long', difficulty: 'medium' },
  { type: 'capital', question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'Sao Paulo', 'Brasilia', 'Buenos Aires'], answer: 2, hint: 'Planned city, not the famous beach one', difficulty: 'medium' },
  // Hard - Advanced geography
  { type: 'landmark', question: 'Where is Machu Picchu?', options: ['Mexico', 'Peru', 'Chile', 'Colombia'], answer: 1, hint: 'Ancient Incan citadel in the Andes', difficulty: 'hard' },
  { type: 'capital', question: 'What is the capital of South Africa?', options: ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban'], answer: 2, hint: 'Has 3 capital cities!', difficulty: 'hard' },
  { type: 'flag', question: 'Which country has a maple leaf?', options: ['USA', 'UK', 'Australia', 'Canada'], answer: 3, hint: 'North American country', difficulty: 'hard' },
  { type: 'continent', question: 'Which is the smallest continent?', options: ['Europe', 'Australia', 'Antarctica', 'South America'], answer: 1, hint: 'Also called Oceania', difficulty: 'hard' },
]

export function MapExplorer({ onComplete: _onComplete, onExit }: MapExplorerProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<Question[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const shuffledQ = [...questions].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffled(shuffledQ)
    setCurrentQ(shuffledQ[0])
  }, [])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentQ(shuffled[level])
    }
  }, [level, shuffled])

  const handleAnswer = (idx: number) => {
    if (!currentQ || showCorrect) return
    
    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentQ.answer) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 20 : 30
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (level >= 9) {
        console.log('[DEBUG] MapExplorer game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] MapExplorer calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
        setSelected(null)
        setShowCorrect(false)
        setShowHint(false)
      }
    }, 1500)
  }

  const getIcon = (type: QuestionType) => {
    switch (type) {
      case 'capital': return <Flag className="w-6 h-6 text-blue-400" />
      case 'flag': return <Globe className="w-6 h-6 text-green-400" />
      case 'landmark': return <Mountain className="w-6 h-6 text-orange-400" />
      case 'continent': return <MapPin className="w-6 h-6 text-purple-400" />
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Globe className="w-20 h-20 text-blue-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-2">Explorer Complete!</h2>
          <p className="text-xl text-blue-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}</span>
          </div>
          <span className="text-white font-bold">{level + 1}/10</span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Map Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-4 border-blue-400/30">
              <Compass className="w-10 h-10 text-blue-300" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            {getIcon(currentQ.type)}
            <span className={`text-xs font-bold ${
              currentQ.difficulty === 'easy' ? 'text-green-400' : 
              currentQ.difficulty === 'medium' ? 'text-yellow-400' : 
              'text-red-400'
            }`}>{currentQ.type.toUpperCase()}</span>
          </div>
          
          <h2 className="text-xl font-bold text-white text-center mb-4">{currentQ.question}</h2>

          {/* Hint */}
          {showHint && (
            <div className="bg-blue-500/20 rounded-xl p-3 mb-4 text-center">
              <p className="text-blue-200 text-sm">💡 {currentQ.hint}</p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                  showCorrect && i === currentQ.answer ? 'bg-green-500 text-white scale-105' :
                  showCorrect && i === selected && i !== currentQ.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-blue-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Hint Button */}
          {!showHint && (
            <button 
              onClick={() => setShowHint(true)}
              className="w-full mt-4 py-2 text-blue-300 text-sm hover:text-blue-200"
            >
              Need a hint? (-5 points)
            </button>
          )}
        </div>

        {/* Progress Map */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Start</span>
            <span>Journey</span>
            <span>Finish</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full transition-all" style={{ width: `${((level + 1) / 10) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-blue-400' : 'bg-slate-600'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
