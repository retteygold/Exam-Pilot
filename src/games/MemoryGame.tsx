import { useState, useEffect, useCallback } from 'react'
import { Timer, RotateCcw, Trophy, Star, ChevronRight } from 'lucide-react'
import { MEMORY_LEVELS, EMOJI_SETS } from './memoryLevels'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

interface MemoryGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryGame({ onComplete, onExit }: MemoryGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)

   const [showReward, setShowReward] = useState(false)
   const [rewardData, setRewardData] = useState({
     title: '',
     message: '',
     type: 'achievement' as 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win',
     value: 0
   })

  const levelData = MEMORY_LEVELS[currentLevel]

  // Generate cards for current level
  const generateCards = useCallback(() => {
    const emojiSet = EMOJI_SETS[levelData.theme] || EMOJI_SETS['Mixed Easy']
    const selectedEmojis = emojiSet.slice(0, levelData.pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5)
    
    return shuffled
  }, [levelData])

  // Initialize level
  useEffect(() => {
    const newCards = generateCards()
    setCards(newCards)
    setTimeLeft(levelData.timeLimit)
    setFlippedCards([])
    setMatches(0)
    setAttempts(0)
    setScore(0)
    setIsGameActive(true)
    setShowLevelComplete(false)
    setShowGameOver(false)
  }, [currentLevel, generateCards, levelData.timeLimit])

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false)
          setShowGameOver(true)
          soundManager.play('wrong')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, timeLeft])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!isGameActive) return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (cards[cardId].isMatched) return

    soundManager.play('click')

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    // Flip the card
    setCards(prev => prev.map((card, idx) => 
      idx === cardId ? { ...card, isFlipped: true } : card
    ))

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1)
      const [first, second] = newFlipped
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        soundManager.play('correct')
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second ? { ...card, isMatched: true } : card
          ))
          setFlippedCards([])
          setMatches(prev => prev + 1)
          setScore(prev => prev + 10 + Math.max(0, timeLeft / 10))
        }, 500)
      } else {
        // No match - flip back
        soundManager.play('wrong')
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second ? { ...card, isFlipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const showRewardPopup = (
    title: string,
    message: string,
    type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win',
    value: number
  ) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
  }

  // Check for level completion
  useEffect(() => {
    if (matches > 0 && matches === levelData.pairs) {
      setIsGameActive(false)
      const levelScore = Math.floor(score + timeLeft * 2)
      setTotalScore(prev => prev + levelScore)
      showRewardPopup(
        `Level ${currentLevel + 1} Complete!`,
        `+${levelScore} points!`,
        'levelUp',
        levelScore
      )
      soundManager.play('levelUp')
      setTimeout(() => setShowLevelComplete(true), 500)
    }
  }, [matches, levelData.pairs, score, timeLeft])

  // Next level
  const nextLevel = () => {
    if (currentLevel < MEMORY_LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1)
    } else {
      // Game complete
      const stars = Math.min(3, Math.floor(totalScore / 1000) + 1)
      showRewardPopup('Memory Master! 🏆', `You earned ${stars} stars!`, 'win', stars)
      soundManager.play('win')
      setTimeout(() => {
        onComplete(totalScore, stars)
      }, 2500)
    }
  }

  // Reset level
  const resetLevel = () => {
    const newCards = generateCards()
    setCards(newCards)
    setTimeLeft(levelData.timeLimit)
    setFlippedCards([])
    setMatches(0)
    setAttempts(0)
    setScore(0)
    setIsGameActive(true)
    setShowLevelComplete(false)
    setShowGameOver(false)
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate grid columns based on level
  const getGridCols = () => {
    if (levelData.cols <= 4) return 'grid-cols-4'
    if (levelData.cols <= 6) return 'grid-cols-6'
    return 'grid-cols-8'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onExit} 
            className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">Level {currentLevel + 1}/100</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">{Math.floor(score)}</span>
            </div>
            <button 
              onClick={resetLevel} 
              className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Title & Stats */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">Memory Match</h1>
          <p className="text-pink-200 text-sm">{levelData.theme}</p>
          <div className="flex justify-center gap-6 mt-2 text-sm text-slate-300">
            <span>🎯 {matches}/{levelData.pairs}</span>
            <span>🎲 {attempts} tries</span>
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Level Progress</span>
            <span>{currentLevel + 1} / 100</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 transition-all"
              style={{ width: `${((currentLevel + 1) / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Time</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                timeLeft < 10 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-emerald-400'
              }`}
              style={{ width: `${(timeLeft / levelData.timeLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Grid */}
        <div 
          className={`grid ${getGridCols()} gap-2 md:gap-3 mx-auto max-w-2xl`}
          style={{ aspectRatio: levelData.cols > levelData.rows ? 'auto' : '1' }}
        >
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={!isGameActive || card.isMatched}
              className={`
                relative aspect-square rounded-xl md:rounded-2xl text-2xl md:text-3xl
                transition-all duration-300 transform
                ${card.isFlipped || card.isMatched 
                  ? 'bg-white rotate-0' 
                  : 'bg-gradient-to-br from-pink-500 to-rose-600 rotate-0 hover:scale-105'
                }
                ${card.isMatched ? 'opacity-60 scale-95' : ''}
                ${!card.isFlipped && !card.isMatched ? 'hover:shadow-lg hover:shadow-pink-500/30' : ''}
              `}
            >
              <span className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-300
                ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
              `}>
                {card.emoji}
              </span>
              
              {/* Card back pattern */}
              <span className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-300
                ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}
              `}>
                <span className="text-white text-opacity-30 text-4xl">?</span>
              </span>

              {/* Match indicator */}
              {card.isMatched && (
                <span className="absolute -top-1 -right-1 text-green-500 text-lg">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <p className="text-center text-slate-400 text-sm mt-4">
          Tap cards to find matching pairs!
        </p>

        {/* Level Complete Modal */}
        {showLevelComplete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 md:p-8 text-center max-w-sm w-full">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Level Complete!</h2>
              <p className="text-pink-300 text-sm mb-1">{levelData.theme}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mb-4">
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <p className="text-xs">Matches</p>
                  <p className="font-bold text-white">{matches}</p>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <p className="text-xs">Time Left</p>
                  <p className="font-bold text-white">{formatTime(timeLeft)}</p>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <p className="text-xs">Attempts</p>
                  <p className="font-bold text-white">{attempts}</p>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <p className="text-xs">Score</p>
                  <p className="font-bold text-yellow-400">{Math.floor(score + timeLeft * 2)}</p>
                </div>
              </div>
              <button 
                onClick={nextLevel}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              >
                {currentLevel < MEMORY_LEVELS.length - 1 ? 'Next Level' : 'Finish Game'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {showGameOver && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-6 md:p-8 text-center max-w-sm w-full">
              <div className="text-4xl md:text-5xl mb-3">⏰</div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Time's Up!</h2>
              <p className="text-slate-300 mb-4">You matched {matches} out of {levelData.pairs} pairs</p>
              <div className="flex gap-3">
                <button 
                  onClick={resetLevel}
                  className="flex-1 py-3 bg-slate-600 rounded-xl font-bold text-white"
                >
                  Try Again
                </button>
                <button 
                  onClick={onExit}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-bold text-white"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {showReward && (
          <RewardPopup
            isOpen={showReward}
            onClose={() => setShowReward(false)}
            title={rewardData.title}
            message={rewardData.message}
            type={rewardData.type}
            value={rewardData.value}
          />
        )}
      </div>
    </div>
  )
}
