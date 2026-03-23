import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Music, Check, Lightbulb } from 'lucide-react'

interface RhymeTimeProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface RhymeQuestion {
  word: string
  options: string[]
  answer: number
  hint: string
  difficulty: Difficulty
}

const questions: RhymeQuestion[] = [
  // Easy
  { word: 'CAT', options: ['HAT', 'DOG', 'CAR', 'BAT'], answer: 0, hint: 'You wear it on your head', difficulty: 'easy' },
  { word: 'DOG', options: ['CAT', 'LOG', 'PIG', 'FOG'], answer: 1, hint: 'A piece of wood', difficulty: 'easy' },
  { word: 'SUN', options: ['MOON', 'RUN', 'SKY', 'FUN'], answer: 3, hint: 'Having a good time', difficulty: 'easy' },
  { word: 'STAR', options: ['MOON', 'CAR', 'MARS', 'FAR'], answer: 1, hint: 'A vehicle', difficulty: 'easy' },
  { word: 'TREE', options: ['BEE', 'SEA', 'FREE', 'LEAF'], answer: 2, hint: 'Not trapped', difficulty: 'easy' },
  { word: 'BOOK', options: ['LOOK', 'PEN', 'NOOK', 'PAGE'], answer: 0, hint: 'Use your eyes', difficulty: 'easy' },
  // Medium
  { word: 'NIGHT', options: ['LIGHT', 'DAY', 'DARK', 'MOON'], answer: 0, hint: 'Opposite of dark', difficulty: 'medium' },
  { word: 'SCHOOL', options: ['POOL', 'RULE', 'TOOL', 'COOL'], answer: 3, hint: 'Not warm', difficulty: 'medium' },
  { word: 'TRAIN', options: ['RAIN', 'BUS', 'PLANE', 'RAIL'], answer: 0, hint: 'Falls from sky', difficulty: 'medium' },
  { word: 'MOUSE', options: ['HOUSE', 'RAT', 'CAT', 'LOUSE'], answer: 0, hint: 'Where you live', difficulty: 'medium' },
  { word: 'DANCE', options: ['CHANCE', 'SING', 'PRANCE', 'LANCE'], answer: 2, hint: 'To jump around', difficulty: 'medium' },
  // Hard
  { word: 'ELEPHANT', options: ['ELEGANT', 'RELEVANT', 'PLEASANT', 'ELEMENT'], answer: 2, hint: 'Nice and enjoyable', difficulty: 'hard' },
  { word: 'BUTTERFLY', options: ['UTTER', 'FLUTTER', 'SHUTTER', 'UTTERLY'], answer: 1, hint: 'To flap wings quickly', difficulty: 'hard' },
  { word: 'ADVENTURE', options: ['VENTURE', 'CENTURE', 'LITERATURE', 'FURNITURE'], answer: 0, hint: 'A risky journey', difficulty: 'hard' },
  { word: 'TELESCOPE', options: ['MICROSCOPE', 'HOPE', 'SCOPE', 'ENVELOPE'], answer: 2, hint: 'Range of view', difficulty: 'hard' },
]

export function RhymeTime({ onComplete: _onComplete, onExit }: RhymeTimeProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentQ, setCurrentQ] = useState<RhymeQuestion | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<RhymeQuestion[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const shuffledQ = [...questions].sort(() => Math.random() - 0.5)
    setShuffled(shuffledQ)
    setCurrentQ(shuffledQ[0])
  }, [])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentQ(shuffled[level])
      setSelected(null)
      setShowCorrect(false)
      setShowHint(false)
    }
  }, [level, shuffled])

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.7
    speechSynthesis.speak(utterance)
  }

  const handleAnswer = (idx: number) => {
    if (!currentQ || showCorrect) return

    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentQ.answer) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 20 : 30
      const streakBonus = Math.min(streak * 2, 15)
      setScore(s => s + points + streakBonus)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (level >= 9) {
        console.log('[DEBUG] RhymeTime game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] RhymeTime calling onComplete with score:', score, 'stars:', stars)
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
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Music className="w-20 h-20 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Rhyme Master!</h2>
          <p className="text-xl text-pink-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); }} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <span className="text-white font-bold">{level + 1}/10</span>
          </div>
        </div>

        {/* Streak */}
        {streak > 2 && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/30 rounded-full text-orange-300 font-bold">
              🔥 {streak} Streak!
            </span>
          </div>
        )}

        {/* Game Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-pink-500/20 rounded-full flex items-center justify-center border-4 border-pink-400/30">
              <Music className="w-10 h-10 text-pink-400" />
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
              currentQ.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
              currentQ.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
              'bg-red-500/30 text-red-300'
            }`}>{currentQ.difficulty.toUpperCase()}</span>
            <p className="text-pink-200 text-sm">Which word rhymes with...</p>
          </div>
          
          {/* Target Word */}
          <button
            onClick={() => speakWord(currentQ.word)}
            className="w-full py-4 bg-pink-500/20 rounded-2xl mb-6 hover:bg-pink-500/30 transition-all"
          >
            <p className="text-4xl font-bold text-white tracking-widest">{currentQ.word}</p>
            <p className="text-pink-300 text-sm mt-1">🔊 Click to hear</p>
          </button>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`py-4 px-2 rounded-xl font-bold text-lg transition-all ${
                  showCorrect && i === currentQ.answer ? 'bg-green-500 text-white scale-105' :
                  showCorrect && i === selected && i !== currentQ.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-pink-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                {showCorrect && i === currentQ.answer && <Check className="w-5 h-5 inline mr-1" />}
                {opt}
              </button>
            ))}
          </div>

          {/* Hint */}
          {!showHint && (
            <button 
              onClick={() => setShowHint(true)}
              className="w-full mt-4 py-2 text-pink-300 text-sm hover:text-pink-200 flex items-center justify-center gap-1"
            >
              <Lightbulb className="w-4 h-4" /> Need a hint?
            </button>
          )}
          {showHint && (
            <div className="mt-4 p-3 bg-pink-500/20 rounded-xl">
              <p className="text-pink-200 text-sm text-center">💡 {currentQ.hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
