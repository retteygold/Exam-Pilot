import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Volume2, Play, Ear, Check } from 'lucide-react'

interface SoundDetectiveProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'
type SoundType = 'animal' | 'nature' | 'vehicle' | 'musical'

interface SoundQuestion {
  type: SoundType
  emoji: string
  options: string[]
  answer: number
  description: string
  difficulty: Difficulty
}

const sounds: SoundQuestion[] = [
  // Easy - Animals
  { type: 'animal', emoji: '🐕', options: ['Cat', 'Dog', 'Bird', 'Cow'], answer: 1, description: 'Barking sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐱', options: ['Dog', 'Cat', 'Sheep', 'Pig'], answer: 1, description: 'Meowing sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐮', options: ['Horse', 'Pig', 'Cow', 'Sheep'], answer: 2, description: 'Mooing sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐤', options: ['Duck', 'Chicken', 'Goose', 'Turkey'], answer: 1, description: 'Clucking sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐴', options: ['Donkey', 'Horse', 'Zebra', 'Camel'], answer: 1, description: 'Neighing sound', difficulty: 'easy' },
  // Medium - Nature & Vehicles
  { type: 'nature', emoji: '🌧️', options: ['Wind', 'Rain', 'Thunder', 'Waves'], answer: 1, description: 'Falling water drops', difficulty: 'medium' },
  { type: 'nature', emoji: '⛈️', options: ['Lightning', 'Thunder', 'Storm', 'Hail'], answer: 1, description: 'Loud boom in sky', difficulty: 'medium' },
  { type: 'vehicle', emoji: '🚗', options: ['Motorcycle', 'Car', 'Truck', 'Bus'], answer: 1, description: 'Engine and horn', difficulty: 'medium' },
  { type: 'vehicle', emoji: '🚨', options: ['Police car', 'Ambulance', 'Fire truck', 'All of these'], answer: 3, description: 'Siren sounds', difficulty: 'medium' },
  { type: 'musical', emoji: '🎸', options: ['Violin', 'Guitar', 'Piano', 'Drums'], answer: 1, description: 'Strumming strings', difficulty: 'medium' },
  // Hard - Complex sounds
  { type: 'musical', emoji: '🎹', options: ['Organ', 'Piano', 'Harpsichord', 'Synthesizer'], answer: 1, description: 'Keys and hammers', difficulty: 'hard' },
  { type: 'nature', emoji: '🌊', options: ['River', 'Waterfall', 'Ocean waves', 'Rain'], answer: 2, description: 'Crashing water', difficulty: 'hard' },
  { type: 'vehicle', emoji: '✈️', options: ['Helicopter', 'Airplane', 'Jet', 'Glider'], answer: 1, description: 'Engine and takeoff', difficulty: 'hard' },
  { type: 'animal', emoji: '🐘', options: ['Lion', 'Elephant', 'Bear', 'Tiger'], answer: 1, description: 'Trumpeting call', difficulty: 'hard' },
]

export function SoundDetective({ onComplete: _onComplete, onExit }: SoundDetectiveProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentSound, setCurrentSound] = useState<SoundQuestion | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<SoundQuestion[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const shuffledS = [...sounds].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffled(shuffledS)
    setCurrentSound(shuffledS[0])
  }, [])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentSound(shuffled[level])
    }
  }, [level, shuffled])

  const playSound = () => {
    if (!currentSound || isPlaying) return
    
    // Use Web Speech API to describe the sound
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(`Listen carefully. ${currentSound.description}. What makes this sound?`)
    utterance.rate = 0.8
    utterance.pitch = 1
    
    utterance.onend = () => {
      setIsPlaying(false)
    }
    
    speechSynthesis.speak(utterance)
  }

  const handleAnswer = (idx: number) => {
    if (!currentSound || showCorrect) return

    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentSound.answer) {
      const points = currentSound.difficulty === 'easy' ? 10 : currentSound.difficulty === 'medium' ? 20 : 30
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (level >= 9) {
        setGameOver(true)
      } else {
        setLevel(l => l + 1)
        setSelected(null)
        setShowCorrect(false)
        setIsPlaying(false)
      }
    }, 1500)
  }

  const getCategoryIcon = (type: SoundType) => {
    switch (type) {
      case 'animal': return '🐾'
      case 'nature': return '🌿'
      case 'vehicle': return '🚗'
      case 'musical': return '🎵'
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Ear className="w-20 h-20 text-teal-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Sound Master!</h2>
          <p className="text-xl text-teal-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSound) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 p-4">
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

      <div className="max-w-md mx-auto">
        {/* Sound Display */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center border-4 border-teal-400/30">
            <span className="text-6xl">{currentSound.emoji}</span>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
            currentSound.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentSound.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{getCategoryIcon(currentSound.type)} {currentSound.type.toUpperCase()}</span>

          <p className="text-teal-200 text-sm mb-4">{currentSound.description}</p>

          {/* Play Sound Button */}
          <button
            onClick={playSound}
            disabled={isPlaying}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-teal-400 hover:to-cyan-400 transition-all disabled:opacity-50"
          >
            {isPlaying ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>
          
          <p className="text-teal-300 text-sm mt-3">{isPlaying ? 'Playing sound...' : 'Tap to hear the sound'}</p>
        </div>

        {/* Options */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-white font-bold mb-3 text-center">What makes this sound?</p>
          <div className="grid grid-cols-2 gap-2">
            {currentSound.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                  showCorrect && i === currentSound.answer ? 'bg-green-500 text-white' :
                  showCorrect && i === selected && i !== currentSound.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-teal-500 text-white' :
                  'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {showCorrect && i === currentSound.answer && <Check className="w-4 h-4 inline mr-1" />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-teal-300/70 text-xs mt-4">
          Tip: Listen to the sound description carefully!
        </p>
      </div>
    </div>
  )
}
