import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Image, Check, Eye } from 'lucide-react'

interface PictureWordMatchProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface PictureQuestion {
  emoji: string
  word: string
  options: string[]
  answer: number
  difficulty: Difficulty
}

const questions: PictureQuestion[] = [
  // Easy
  { emoji: '🐱', word: 'CAT', options: ['CAT', 'DOG', 'COW', 'BAT'], answer: 0, difficulty: 'easy' },
  { emoji: '🐶', word: 'DOG', options: ['CAT', 'DOG', 'FOX', 'WOLF'], answer: 1, difficulty: 'easy' },
  { emoji: '🌳', word: 'TREE', options: ['FLOWER', 'TREE', 'GRASS', 'BUSH'], answer: 1, difficulty: 'easy' },
  { emoji: '🚗', word: 'CAR', options: ['BUS', 'TRUCK', 'CAR', 'BIKE'], answer: 2, difficulty: 'easy' },
  { emoji: '🏠', word: 'HOUSE', options: ['HOUSE', 'BUILDING', 'TOWER', 'HUT'], answer: 0, difficulty: 'easy' },
  { emoji: '🍎', word: 'APPLE', options: ['ORANGE', 'BANANA', 'APPLE', 'GRAPE'], answer: 2, difficulty: 'easy' },
  { emoji: '☀️', word: 'SUN', options: ['MOON', 'STAR', 'SUN', 'CLOUD'], answer: 2, difficulty: 'easy' },
  { emoji: '🌙', word: 'MOON', options: ['SUN', 'MOON', 'STAR', 'PLANET'], answer: 1, difficulty: 'easy' },
  // Medium
  { emoji: '🦋', word: 'BUTTERFLY', options: ['MOTH', 'BEE', 'BUTTERFLY', 'DRAGONFLY'], answer: 2, difficulty: 'medium' },
  { emoji: '🐘', word: 'ELEPHANT', options: ['RHINO', 'HIPPOPOTAMUS', 'ELEPHANT', 'GIRAFFE'], answer: 2, difficulty: 'medium' },
  { emoji: '🚀', word: 'ROCKET', options: ['PLANE', 'ROCKET', 'SPACESHIP', 'SATELLITE'], answer: 1, difficulty: 'medium' },
  { emoji: '🎸', word: 'GUITAR', options: ['VIOLIN', 'PIANO', 'DRUM', 'GUITAR'], answer: 3, difficulty: 'medium' },
  { emoji: '⛰️', word: 'MOUNTAIN', options: ['HILL', 'MOUNTAIN', 'VALLEY', 'PLATEAU'], answer: 1, difficulty: 'medium' },
  // Hard
  { emoji: '🦕', word: 'DINOSAUR', options: ['DRAGON', 'LIZARD', 'DINOSAUR', 'CROCODILE'], answer: 2, difficulty: 'hard' },
  { emoji: '🔭', word: 'TELESCOPE', options: ['MICROSCOPE', 'TELESCOPE', 'BINOCULARS', 'CAMERA'], answer: 1, difficulty: 'hard' },
  { emoji: '🌋', word: 'VOLCANO', options: ['MOUNTAIN', 'HILL', 'VALLEY', 'VOLCANO'], answer: 3, difficulty: 'hard' },
]

export function PictureWordMatch({ onComplete: _onComplete, onExit }: PictureWordMatchProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentQ, setCurrentQ] = useState<PictureQuestion | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<PictureQuestion[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const shuffledQ = [...questions].sort(() => Math.random() - 0.5).slice(0, 12)
    setShuffled(shuffledQ)
    setCurrentQ(shuffledQ[0])
  }, [])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentQ(shuffled[level])
      setSelected(null)
      setShowCorrect(false)
    }
  }, [level, shuffled])

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  const handleAnswer = (idx: number) => {
    if (!currentQ || showCorrect) return

    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentQ.answer) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 15 : 25
      const streakBonus = Math.min(streak * 2, 15)
      setScore(s => s + points + streakBonus)
      setStreak(s => s + 1)
      speakWord(currentQ.word)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (level >= shuffled.length - 1) {
        console.log('[DEBUG] PictureWordMatch game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] PictureWordMatch calling onComplete with score:', score, 'stars:', stars)
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
      <div className="min-h-screen bg-gradient-to-br from-lime-900 via-green-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Image className="w-20 h-20 text-lime-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Picture Master!</h2>
          <p className="text-xl text-lime-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); }} className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-green-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-900 via-green-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <span className="text-white font-bold">{level + 1}/{shuffled.length}</span>
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
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-lime-400" />
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentQ.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
              currentQ.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
              'bg-red-500/30 text-red-300'
            }`}>{currentQ.difficulty.toUpperCase()}</span>
          </div>
          
          {/* Big Emoji */}
          <div className="text-9xl mb-6 animate-bounce">
            {currentQ.emoji}
          </div>

          <p className="text-lime-200 text-sm mb-4">What is this?</p>

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
                  selected === i ? 'bg-lime-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                {showCorrect && i === currentQ.answer && <Check className="w-5 h-5 inline mr-1" />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-lime-300/70 text-sm">
          Look at the picture and choose the correct word!
        </p>
      </div>
    </div>
  )
}
