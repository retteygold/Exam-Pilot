import { useState, useEffect } from 'react'
import { Star, Trophy, Volume2, ArrowLeft, Brain } from 'lucide-react'

interface SpellingSprintProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface Word {
  word: string
  hint: string
  difficulty: Difficulty
}

const words: Word[] = [
  // Easy - 3-4 letters
  { word: 'CAT', hint: 'A furry pet that says meow', difficulty: 'easy' },
  { word: 'DOG', hint: 'A loyal pet that barks', difficulty: 'easy' },
  { word: 'SUN', hint: 'The bright star in the sky', difficulty: 'easy' },
  { word: 'BOOK', hint: 'You read this', difficulty: 'easy' },
  { word: 'TREE', hint: 'Has leaves and branches', difficulty: 'easy' },
  { word: 'FISH', hint: 'Lives in water', difficulty: 'easy' },
  { word: 'BIRD', hint: 'It can fly', difficulty: 'easy' },
  { word: 'MOON', hint: 'Shines at night', difficulty: 'easy' },
  { word: 'STAR', hint: 'Twinkles in sky', difficulty: 'easy' },
  { word: 'CAKE', hint: 'Birthday dessert', difficulty: 'easy' },
  // Medium - 5-6 letters
  { word: 'APPLE', hint: 'Red or green fruit', difficulty: 'medium' },
  { word: 'HOUSE', hint: 'Where you live', difficulty: 'medium' },
  { word: 'WATER', hint: 'You drink this', difficulty: 'medium' },
  { word: 'BREAD', hint: 'Made from flour', difficulty: 'medium' },
  { word: 'CHAIR', hint: 'You sit on this', difficulty: 'medium' },
  { word: 'TABLE', hint: 'You eat on this', difficulty: 'medium' },
  { word: 'PENCIL', hint: 'Used for writing', difficulty: 'medium' },
  { word: 'SCHOOL', hint: 'Where you learn', difficulty: 'medium' },
  { word: 'FRIEND', hint: 'Someone you like', difficulty: 'medium' },
  { word: 'YELLOW', hint: 'Color of sun', difficulty: 'medium' },
  // Hard - 7+ letters
  { word: 'ELEPHANT', hint: 'Large animal with trunk', difficulty: 'hard' },
  { word: 'COMPUTER', hint: 'Electronic device', difficulty: 'hard' },
  { word: 'BUTTERFLY', hint: 'Colorful flying insect', difficulty: 'hard' },
  { word: 'MOUNTAIN', hint: 'Tall landform', difficulty: 'hard' },
  { word: 'RAINBOW', hint: 'Colors in sky after rain', difficulty: 'hard' },
  { word: 'DINOSAUR', hint: 'Extinct reptile', difficulty: 'hard' },
  { word: 'TELESCOPE', hint: 'Tool to see stars', difficulty: 'hard' },
  { word: 'OCTOPUS', hint: 'Sea animal with 8 arms', difficulty: 'hard' },
]

export function SpellingSprint({ onComplete: _onComplete, onExit }: SpellingSprintProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    setCurrentWord(shuffled[0])
  }, [])

  useEffect(() => {
    if (shuffledWords.length > 0) {
      setCurrentWord(shuffledWords[level])
    }
  }, [level, shuffledWords])

  const handleSubmit = () => {
    if (!currentWord || !input.trim()) return
    
    const correct = input.trim().toUpperCase() === currentWord.word
    if (correct) {
      const points = currentWord.difficulty === 'easy' ? 10 : currentWord.difficulty === 'medium' ? 20 : 30
      setScore(s => s + points)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (level >= 9) {
        console.log('[DEBUG] SpellingSprint game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] SpellingSprint calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
        setInput('')
        setShowHint(false)
        setFeedback(null)
      }
    }, 1000)
  }

  const speakWord = () => {
    if (!currentWord) return
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.rate = 0.7
    speechSynthesis.speak(utterance)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Spelling Complete!</h2>
          <p className="text-xl text-emerald-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setInput(''); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-4">
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

      {/* Word Display */}
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-6 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
            currentWord.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentWord.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{currentWord.difficulty.toUpperCase()}</span>
          
          <button 
            onClick={speakWord}
            className="w-20 h-20 mx-auto mb-4 bg-emerald-500/30 rounded-full flex items-center justify-center hover:bg-emerald-500/50 transition-all"
          >
            <Volume2 className="w-10 h-10 text-emerald-300" />
          </button>
          
          <p className="text-emerald-200 mb-4">Listen and spell the word!</p>
          
          <button 
            onClick={() => setShowHint(true)}
            className="text-sm text-emerald-300 hover:text-emerald-200 flex items-center gap-1 mx-auto"
          >
            <Brain className="w-4 h-4" />
            {showHint ? `Hint: ${currentWord.hint}` : 'Need a hint?'}
          </button>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type the word..."
            className={`w-full px-6 py-4 bg-slate-800/50 border-2 rounded-2xl text-white text-center text-xl font-bold uppercase placeholder-slate-400 focus:outline-none transition-colors ${
              feedback === 'correct' ? 'border-green-500 bg-green-500/20' :
              feedback === 'wrong' ? 'border-red-500 bg-red-500/20' :
              'border-slate-600 focus:border-emerald-500'
            }`}
            autoFocus
          />
          
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || feedback !== null}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 rounded-2xl font-bold text-white text-xl transition-all"
          >
            Check Spelling
          </button>
        </div>

        {/* Letter Hints */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Word has {currentWord.word.length} letters</p>
          <div className="flex justify-center gap-2">
            {[...Array(currentWord.word.length)].map((_, i) => (
              <div key={i} className="w-10 h-12 border-2 border-emerald-500/30 rounded-lg flex items-center justify-center bg-slate-800/30">
                {input[i] && <span className="text-emerald-300 font-bold text-xl">{input[i].toUpperCase()}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
