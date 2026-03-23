import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Trophy, Zap, Clock, Brain, Music, Palette, BookOpen, Calculator, Sparkles } from 'lucide-react'

interface MegaGameProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type GameType = 'math' | 'spelling' | 'color' | 'shape' | 'rhyme' | 'memory' | 'word' | 'science'

interface Challenge {
  type: GameType
  question: string
  options: string[]
  answer: number
  hint: string
  icon: any
  color: string
}

const allChallenges: Challenge[] = [
  // Math challenges
  { type: 'math', question: '5 + 7 = ?', options: ['10', '11', '12', '13'], answer: 2, hint: 'Count on your fingers!', icon: Calculator, color: 'text-red-400' },
  { type: 'math', question: '9 × 3 = ?', options: ['18', '27', '24', '21'], answer: 1, hint: '9 + 9 + 9', icon: Calculator, color: 'text-red-400' },
  { type: 'math', question: '15 - 8 = ?', options: ['5', '6', '7', '8'], answer: 2, hint: 'What is 15 take away 8?', icon: Calculator, color: 'text-red-400' },
  { type: 'math', question: '12 ÷ 4 = ?', options: ['2', '3', '4', '6'], answer: 1, hint: 'How many groups of 4 in 12?', icon: Calculator, color: 'text-red-400' },
  { type: 'math', question: '6 × 7 = ?', options: ['42', '36', '48', '49'], answer: 0, hint: 'Think of 6 groups of 7', icon: Calculator, color: 'text-red-400' },
  
  // Spelling challenges
  { type: 'spelling', question: 'Which is spelled correctly?', options: ['BUTERFLY', 'BUTTERFLY', 'BUTTERFLY', 'BUTTERFLY'], answer: 2, hint: 'Double T, double F', icon: BookOpen, color: 'text-blue-400' },
  { type: 'spelling', question: 'Which is spelled correctly?', options: ['ELEPHANT', 'ELEFANT', 'ELEPHENT', 'ELLIPHANT'], answer: 0, hint: 'Starts with E-L-E', icon: BookOpen, color: 'text-blue-400' },
  { type: 'spelling', question: 'Which is spelled correctly?', options: ['COMPUTER', 'COMPUTER', 'KOMPUTER', 'COMPUTER'], answer: 0, hint: 'Starts with C-O-M', icon: BookOpen, color: 'text-blue-400' },
  { type: 'spelling', question: 'Complete: S_COOL', options: ['K', 'C', 'CH', 'CHH'], answer: 2, hint: 'Where you learn!', icon: BookOpen, color: 'text-blue-400' },
  { type: 'spelling', question: 'Complete: RA_NBOW', options: ['I', 'IE', 'AI', 'EI'], answer: 0, hint: 'Colors in the sky', icon: BookOpen, color: 'text-blue-400' },
  
  // Color challenges
  { type: 'color', question: ' Red +  Blue = ?', options: ['GREEN', 'PURPLE', 'ORANGE', 'PINK'], answer: 1, hint: 'A royal color!', icon: Palette, color: 'text-purple-400' },
  { type: 'color', question: ' Yellow +  Blue = ?', options: ['RED', 'GREEN', 'ORANGE', 'PURPLE'], answer: 1, hint: 'Like grass and leaves', icon: Palette, color: 'text-purple-400' },
  { type: 'color', question: ' Red +  Yellow = ?', options: ['GREEN', 'BLUE', 'ORANGE', 'PURPLE'], answer: 2, hint: 'Like a sunset!', icon: Palette, color: 'text-purple-400' },
  { type: 'color', question: 'What color is a banana?', options: ['RED', 'YELLOW', 'GREEN', 'BROWN'], answer: 1, hint: 'Sunshine color!', icon: Palette, color: 'text-purple-400' },
  { type: 'color', question: 'What color is the sky on a clear day?', options: ['GREEN', 'BLUE', 'RED', 'YELLOW'], answer: 1, hint: 'Like the ocean!', icon: Palette, color: 'text-purple-400' },
  
  // Shape challenges
  { type: 'shape', question: '  ?', options: [' ', ' ', ' ', ' '], answer: 0, hint: 'All circles!', icon: Brain, color: 'text-cyan-400' },
  { type: 'shape', question: ' ?', options: [' ', ' ', ' ', ' '], answer: 2, hint: 'Keep the triangles going!', icon: Brain, color: 'text-cyan-400' },
  { type: 'shape', question: ' ?', options: [' ', ' ', ' ', ' '], answer: 1, hint: 'More stars!', icon: Brain, color: 'text-cyan-400' },
  { type: 'shape', question: ' ?', options: [' ', ' ', ' ', ' '], answer: 2, hint: 'Squares continue!', icon: Brain, color: 'text-cyan-400' },
  { type: 'shape', question: ' ?', options: [' ', ' ', ' ', ' '], answer: 2, hint: 'Keep the hearts coming!', icon: Brain, color: 'text-cyan-400' },
  
  // Rhyme challenges
  { type: 'rhyme', question: 'What rhymes with CAT?', options: ['DOG', 'HAT', 'BIRD', 'FISH'], answer: 1, hint: 'You wear it on your head!', icon: null, color: 'text-pink-400' },
  { type: 'rhyme', question: 'What rhymes with DOG?', options: ['CAT', 'FOG', 'BIRD', 'FISH'], answer: 1, hint: 'Misty weather!', icon: null, color: 'text-pink-400' },
  { type: 'rhyme', question: 'What rhymes with SUN?', options: ['MOON', 'FUN', 'STAR', 'SKY'], answer: 1, hint: 'Having a good time!', icon: null, color: 'text-pink-400' },
  { type: 'rhyme', question: 'What rhymes with TREE?', options: ['FREE', 'BUSH', 'LEAF', 'WOOD'], answer: 0, hint: 'Not trapped!', icon: null, color: 'text-pink-400' },
  { type: 'rhyme', question: 'What rhymes with BOOK?', options: ['LOOK', 'PEN', 'READ', 'PAPER'], answer: 0, hint: 'Use your eyes!', icon: null, color: 'text-pink-400' },
  
  // Memory/Word challenges
  { type: 'word', question: ' is a...', options: ['DOG', 'CAT', 'BIRD', 'FISH'], answer: 1, hint: 'Says meow!', icon: BookOpen, color: 'text-amber-400' },
  { type: 'word', question: ' is a...', options: ['CAT', 'DOG', 'COW', 'PIG'], answer: 1, hint: 'Says woof!', icon: BookOpen, color: 'text-amber-400' },
  { type: 'word', question: ' is an...', options: ['ORANGE', 'APPLE', 'BANANA', 'GRAPE'], answer: 1, hint: 'Red fruit!', icon: BookOpen, color: 'text-amber-400' },
  { type: 'word', question: ' is a...', options: ['BUS', 'CAR', 'TRUCK', 'BIKE'], answer: 1, hint: 'Has 4 wheels!', icon: BookOpen, color: 'text-amber-400' },
  { type: 'word', question: ' is the...', options: ['SUN', 'MOON', 'STAR', 'PLANET'], answer: 1, hint: 'At night!', icon: BookOpen, color: 'text-amber-400' },
  
  // Science challenges
  { type: 'science', question: 'Plants need ___ to grow', options: ['DARKNESS', 'SUNLIGHT', 'COLD', 'NOISE'], answer: 1, hint: 'It comes from the sun!', icon: Sparkles, color: 'text-green-400' },
  { type: 'science', question: 'Water freezes at ___°C', options: ['0', '10', '100', '-10'], answer: 0, hint: 'When it is very cold!', icon: Sparkles, color: 'text-green-400' },
  { type: 'science', question: 'How many legs does a spider have?', options: ['4', '6', '8', '10'], answer: 2, hint: 'More than an insect!', icon: Sparkles, color: 'text-green-400' },
  { type: 'science', question: 'The biggest planet is...', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 2, hint: 'A gas giant!', icon: Sparkles, color: 'text-green-400' },
  { type: 'science', question: 'We breathe in...', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Smoke'], answer: 1, hint: 'O2!', icon: Sparkles, color: 'text-green-400' },
]

export function MegaGame({ onComplete: _onComplete, onExit }: MegaGameProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [completedGames, setCompletedGames] = useState<Set<GameType>>(new Set())

  // Call onComplete when game ends
  useEffect(() => {
    if (gameOver && _onComplete) {
      console.log('[DEBUG] MegaGame game complete, score:', score)
      const stars = Math.min(Math.floor(score / 150), 5)
      console.log('[DEBUG] MegaGame calling onComplete with score:', score, 'stars:', stars)
      _onComplete(score, stars)
    }
  }, [gameOver, score, _onComplete])

  useEffect(() => {
    // Shuffle and pick 15 random challenges
    const shuffled = [...allChallenges].sort(() => Math.random() - 0.5).slice(0, 15)
    setChallenges(shuffled)
  }, [])

  useEffect(() => {
    if (!showCorrect && !gameOver && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0 && !showCorrect) {
      handleTimeout()
    }
  }, [timeLeft, showCorrect, gameOver])

  const handleTimeout = () => {
    setShowCorrect(true)
    setLives(l => l - 1)
    setStreak(0)
    
    setTimeout(() => {
      if (lives <= 1) {
        setGameOver(true)
      } else {
        nextChallenge()
      }
    }, 1500)
  }

  const nextChallenge = () => {
    if (currentIndex >= challenges.length - 1) {
      setGameOver(true)
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setShowCorrect(false)
      setTimeLeft(20)
    }
  }

  const handleAnswer = (idx: number) => {
    if (showCorrect || gameOver || challenges.length === 0) return
    
    const current = challenges[currentIndex]
    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === current.answer) {
      const points = 20 + Math.min(streak * 5, 50) + Math.floor(timeLeft / 2)
      setScore(s => s + points)
      setStreak(s => s + 1)
      setCompletedGames(prev => new Set(prev).add(current.type))
    } else {
      setLives(l => l - 1)
      setStreak(0)
    }

    setTimeout(() => {
      if (lives <= 1 && idx !== current.answer) {
        setGameOver(true)
      } else {
        nextChallenge()
      }
    }, 1500)
  }

  const current = challenges[currentIndex]
  const progress = ((currentIndex + 1) / challenges.length) * 100
  const stars = Math.min(Math.floor(score / 150), 5)

  if (gameOver || !current) {
    const isWin = lives > 0 && currentIndex >= challenges.length - 1
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${isWin ? 'text-yellow-400' : 'text-slate-400'}`} />
          <h2 className="text-3xl font-bold text-white mb-2">
            {isWin ? '🏆 Mega Champion!' : 'Game Over!'}
          </h2>
          <p className="text-xl text-purple-300 mb-2">Score: {score}</p>
          <p className="text-lg text-purple-200 mb-4">
            Completed: {completedGames.size}/8 game types
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { 
              setScore(0); 
              setLives(3); 
              setCurrentIndex(0); 
              setGameOver(false); 
              setStreak(0);
              setCompletedGames(new Set());
              const shuffled = [...allChallenges].sort(() => Math.random() - 0.5).slice(0, 15)
              setChallenges(shuffled)
            }} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  const Icon = current.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full">
              <span className="text-red-400 font-bold">{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Challenge {currentIndex + 1}/{challenges.length}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={`${timeLeft < 5 ? 'text-red-400' : 'text-purple-300'}`}>{timeLeft}s</span>
            </div>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Game Type Badge */}
        <div className="text-center mb-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full ${current.color}`}>
            <Icon className="w-5 h-5" />
            <span className="font-bold uppercase">{current.type} Challenge</span>
          </span>
        </div>

        {/* Streak */}
        {streak > 2 && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/30 rounded-full text-orange-300 font-bold">
              <Zap className="w-4 h-4" /> {streak} Streak! (+{Math.min(streak * 5, 50)} bonus)
            </span>
          </div>
        )}

        {/* Challenge Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          {/* Question */}
          <div className="text-center mb-6">
            <div className={`text-4xl mb-4 ${current.color}`}>
              {current.type === 'math' && <Calculator className="w-16 h-16 mx-auto" />}
              {current.type === 'spelling' && <BookOpen className="w-16 h-16 mx-auto" />}
              {current.type === 'color' && <Palette className="w-16 h-16 mx-auto" />}
              {current.type === 'shape' && <Brain className="w-16 h-16 mx-auto" />}
              {current.type === 'rhyme' && <Music className="w-16 h-16 mx-auto" />}
              {current.type === 'word' && <BookOpen className="w-16 h-16 mx-auto" />}
              {current.type === 'science' && <Sparkles className="w-16 h-16 mx-auto" />}
            </div>
            <h2 className="text-2xl font-bold text-white">{current.question}</h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`py-4 px-2 rounded-xl font-bold text-lg transition-all ${
                  showCorrect && i === current.answer ? 'bg-green-500 text-white scale-105' :
                  showCorrect && i === selected && i !== current.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-purple-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Hint */}
          {showCorrect && selected !== current.answer && (
            <div className="mt-4 p-3 bg-slate-700/50 rounded-xl text-center">
              <p className="text-slate-300 text-sm">💡 Hint: {current.hint}</p>
            </div>
          )}
        </div>

        {/* Completed Types */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from(completedGames).map(type => (
            <span key={type} className="px-2 py-1 bg-green-500/20 rounded-lg text-green-300 text-xs font-bold uppercase">
              ✓ {type}
            </span>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-4">
          Complete all challenge types to become the Mega Champion!
        </p>
      </div>
    </div>
  )
}
