import { useState, useEffect, useCallback } from 'react'
import { Star, ArrowLeft, Shuffle, Check, RotateCcw, Timer, Zap } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface WordScrambleProps {
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
  { word: 'CAT', hint: 'A furry pet', difficulty: 'easy' },
  { word: 'DOG', hint: 'A loyal pet', difficulty: 'easy' },
  { word: 'SUN', hint: 'Shines in sky', difficulty: 'easy' },
  { word: 'BOOK', hint: 'You read this', difficulty: 'easy' },
  { word: 'TREE', hint: 'Has leaves', difficulty: 'easy' },
  { word: 'FISH', hint: 'Lives in water', difficulty: 'easy' },
  { word: 'BIRD', hint: 'It can fly', difficulty: 'easy' },
  { word: 'MOON', hint: 'Shines at night', difficulty: 'easy' },
  // Medium - 5-6 letters
  { word: 'APPLE', hint: 'Red or green fruit', difficulty: 'medium' },
  { word: 'HOUSE', hint: 'Where you live', difficulty: 'medium' },
  { word: 'WATER', hint: 'You drink this', difficulty: 'medium' },
  { word: 'BREAD', hint: 'Made from flour', difficulty: 'medium' },
  { word: 'CHAIR', hint: 'You sit on this', difficulty: 'medium' },
  { word: 'TABLE', hint: 'You eat on this', difficulty: 'medium' },
  { word: 'PENCIL', hint: 'Used for writing', difficulty: 'medium' },
  { word: 'SCHOOL', hint: 'Where you learn', difficulty: 'medium' },
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

export function WordScramble({ onComplete: _onComplete, onExit }: WordScrambleProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()
  
  const [level, setLevel] = useState(activeGame?.gameType === 'word-scramble' ? activeGame.level : 0)
  const [score, setScore] = useState(activeGame?.gameType === 'word-scramble' ? activeGame.score : 0)
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [scrambled, setScrambled] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState<string[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(
    activeGame?.gameType === 'word-scramble' ? (activeGame.extraData?.timeLeft ?? 45) : 45
  )
  const [initialized, setInitialized] = useState(false)

  const scrambleWord = useCallback((word: string): string[] => {
    const letters = word.split('')
    let scrambled = [...letters]
    // Ensure it's actually scrambled
    do {
      scrambled.sort(() => Math.random() - 0.5)
    } while (scrambled.join('') === word)
    return scrambled
  }, [])

  // Start game session on mount
  useEffect(() => {
    if (!initialized) {
      const shuffled = [...words].sort(() => Math.random() - 0.5)
      setShuffledWords(shuffled)
      const startLevel = activeGame?.gameType === 'word-scramble' ? activeGame.level : 0
      setCurrentWord(shuffled[startLevel] || shuffled[0])
      startGameSession('word-scramble', startLevel, { timeLeft })
      setInitialized(true)
    }
  }, [initialized, startGameSession, activeGame, timeLeft])

  useEffect(() => {
    if (currentWord) {
      setScrambled(scrambleWord(currentWord.word))
      setUserAnswer([])
      setFeedback(null)
    }
  }, [currentWord, scrambleWord])

  // Save progress whenever level or score changes
  useEffect(() => {
    if (initialized && !gameOver) {
      updateGameProgress(level, score, { timeLeft })
    }
  }, [initialized, level, score, timeLeft, gameOver, updateGameProgress])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && feedback !== 'correct') {
      const t = setTimeout(() => setTimeLeft((prev: number) => prev - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0) {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(() => {
        if (level >= 9) {
          setGameOver(true)
          // Clear active game when game ends
          clearActiveGame()
        } else {
          setLevel(l => l + 1)
          setCurrentWord(shuffledWords[level + 1])
          setTimeLeft(45)
        }
      }, 1500)
    }
  }, [timeLeft, gameOver, feedback, level, shuffledWords, clearActiveGame])

  const handleLetterClick = (letter: string, index: number) => {
    if (feedback) return
    
    // Add to user answer
    setUserAnswer([...userAnswer, letter])
    // Remove from scrambled
    const newScrambled = [...scrambled]
    newScrambled.splice(index, 1)
    setScrambled(newScrambled)
    
    // Check if answer is complete
    const currentAnswer = [...userAnswer, letter].join('')
    if (currentAnswer.length === currentWord!.word.length) {
      if (currentAnswer === currentWord!.word) {
        setFeedback('correct')
        const points = currentWord!.difficulty === 'easy' ? 15 : currentWord!.difficulty === 'medium' ? 25 : 40
        const timeBonus = Math.floor(timeLeft / 5)
        const streakBonus = Math.min(streak * 3, 25)
        setScore(s => s + points + timeBonus + streakBonus)
        setStreak(s => s + 1)
      } else {
        setFeedback('wrong')
        setStreak(0)
      }
      
      setTimeout(() => {
        if (level >= 9) {
          console.log('[DEBUG] WordScramble game complete, score:', score)
          setGameOver(true)
          // Clear active game and call onComplete to record session
          clearActiveGame()
          // Call onComplete to record session
          if (_onComplete) {
            const stars = Math.min(Math.floor(score / 50), 5)
            console.log('[DEBUG] WordScramble calling onComplete with score:', score, 'stars:', stars)
            _onComplete(score, stars)
          }
        } else {
          setLevel(l => l + 1)
          setCurrentWord(shuffledWords[level + 1])
          setTimeLeft(45)
        }
      }, 1500)
    }
  }

  const handleBackspace = () => {
    if (feedback || userAnswer.length === 0) return
    const newAnswer = [...userAnswer]
    const letter = newAnswer.pop()!
    setUserAnswer(newAnswer)
    setScrambled([...scrambled, letter])
  }

  const handleReset = () => {
    if (feedback || !currentWord) return
    setScrambled(scrambleWord(currentWord.word))
    setUserAnswer([])
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Shuffle className="w-20 h-20 text-violet-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Unscramble Master!</h2>
          <p className="text-xl text-violet-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); }} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-violet-500/20 rounded-full">
              <Timer className="w-4 h-4 text-violet-400" />
              <span className={`font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-violet-400'}`}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Level info */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            currentWord.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentWord.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{currentWord.difficulty.toUpperCase()}</span>
          <span className="text-white font-bold">{level + 1}/10</span>
        </div>

        {/* Streak */}
        {streak > 2 && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/30 rounded-full text-orange-300 font-bold">
              <Zap className="w-4 h-4" /> {streak} Streak!
            </span>
          </div>
        )}

        {/* Game Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          <div className="text-center mb-6">
            <Shuffle className="w-12 h-12 text-violet-400 mx-auto mb-2" />
            <p className="text-violet-200 text-sm">Hint: {currentWord.hint}</p>
          </div>

          {/* User Answer Display */}
          <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 min-h-[80px] flex items-center justify-center">
            {userAnswer.length > 0 ? (
              <div className="flex gap-2 flex-wrap justify-center">
                {userAnswer.map((letter, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${
                      feedback === 'correct' ? 'bg-green-500 text-white' :
                      feedback === 'wrong' ? 'bg-red-500 text-white' :
                      'bg-violet-500/30 text-white'
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-slate-400 text-sm">Click letters to build the word</span>
            )}
          </div>

          {/* Scrambled Letters */}
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {scrambled.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter, i)}
                disabled={feedback !== null}
                className="w-12 h-14 bg-violet-500/30 hover:bg-violet-500/50 rounded-xl font-bold text-xl text-white transition-all border border-violet-400/30"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={handleBackspace}
              disabled={userAnswer.length === 0 || feedback !== null}
              className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-bold text-white disabled:opacity-50"
            >
              ← Back
            </button>
            <button
              onClick={handleReset}
              disabled={feedback !== null}
              className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          {/* Feedback */}
          {feedback === 'correct' && (
            <div className="mt-4 p-3 bg-green-500/20 rounded-xl text-center">
              <Check className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-green-300 font-bold">Correct!</p>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="mt-4 p-3 bg-red-500/20 rounded-xl text-center">
              <p className="text-red-300 font-bold">Wrong! The word was: {currentWord.word}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
