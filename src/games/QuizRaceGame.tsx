import { useState, useEffect, useCallback } from 'react'
import { Timer, Trophy, Flame } from 'lucide-react'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

interface QuizRaceGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const SAMPLE_QUESTIONS = [
  { q: "What is 5 + 3?", options: ["6", "7", "8", "9"], answer: 2 },
  { q: "What color is the sky?", options: ["Green", "Blue", "Red", "Yellow"], answer: 1 },
  { q: "How many days in a week?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "What is 10 - 4?", options: ["5", "6", "7", "8"], answer: 1 },
  { q: "Which is a fruit?", options: ["Carrot", "Potato", "Apple", "Broccoli"], answer: 2 },
  { q: "What comes after Monday?", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], answer: 1 },
  { q: "How many legs does a cat have?", options: ["2", "4", "6", "8"], answer: 1 },
  { q: "What is 2 × 3?", options: ["5", "6", "7", "8"], answer: 1 },
  { q: "Which shape has 3 sides?", options: ["Circle", "Square", "Triangle", "Rectangle"], answer: 2 },
  { q: "What do you use to write?", options: ["Spoon", "Fork", "Pencil", "Plate"], answer: 2 },
]

export function QuizRaceGame({ onComplete, onExit }: QuizRaceGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameActive, setIsGameActive] = useState(true)
  const [streak, setStreak] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState({ 
    title: '', 
    message: '', 
    type: 'achievement' as 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', 
    value: 0 
  })
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Timer
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, timeLeft])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (!isGameActive || showResult) return
    
    setSelectedOption(optionIndex)
    setShowResult(true)
    
    const correct = optionIndex === SAMPLE_QUESTIONS[currentQuestion].answer
    
    if (correct) {
      soundManager.play('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      
      // Bonus points for streaks
      const streakBonus = newStreak >= 3 ? 10 : newStreak >= 5 ? 20 : 0
      const points = 10 + streakBonus
      setScore(prev => prev + points)
      
      // Show streak rewards
      if (newStreak === 3) {
        showRewardPopup('Hot Streak! 🔥', '3 correct answers in a row!', 'achievement', 10)
      } else if (newStreak === 5) {
        showRewardPopup('Unstoppable! ⚡', '5 correct answers in a row!', 'achievement', 20)
      }
    } else {
      soundManager.play('wrong')
      setStreak(0)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        endGame()
      }
    }, 1500)
  }, [currentQuestion, isGameActive, streak, showResult])

  const showRewardPopup = (title: string, message: string, type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', value: number) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
    soundManager.play('star')
  }

  const endGame = () => {
    console.log('[DEBUG] QuizRaceGame endGame called, final score:', score)
    setIsGameActive(false)
    
    // Calculate stars based on score
    const stars = Math.min(5, Math.floor(score / 20) + 1)
    console.log('[DEBUG] QuizRaceGame calculated stars:', stars)
    
    // Show final reward
    setTimeout(() => {
      setRewardData({
        title: stars >= 4 ? 'Quiz Champion! 🏆' : stars >= 3 ? 'Great Job! ⭐' : 'Good Try! 👍',
        message: `You scored ${score} points and earned ${stars} stars!`,
        type: 'win',
        value: stars
      })
      setShowReward(true)
      soundManager.play('win')
    }, 500)

    // Complete after showing reward
    setTimeout(() => {
      console.log('[DEBUG] QuizRaceGame calling onComplete with score:', score, 'stars:', stars)
      onComplete(score, stars)
    }, 3000)
  }

  const question = SAMPLE_QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-slate-800/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors"
          >
            Exit
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Timer className="w-5 h-5 text-red-400" />
              <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{score}</span>
            </div>
          </div>
        </div>

        {/* Streak indicator */}
        {streak > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className={`w-6 h-6 ${streak >= 3 ? 'text-orange-500 animate-pulse' : 'text-orange-400'}`} />
            <span className={`text-lg font-bold ${streak >= 3 ? 'text-orange-400' : 'text-white'}`}>
              {streak} Streak!
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-slate-400 mt-2">
          Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {question.q}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`p-6 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 ${
                  showResult
                    ? index === question.answer
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                      : index === selectedOption
                        ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                        : 'bg-slate-700/50 text-slate-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-white border-2 border-transparent hover:border-purple-500'
                }`}
              >
                {option}
                {showResult && index === question.answer && (
                  <span className="ml-2">✓</span>
                )}
                {showResult && index === selectedOption && index !== question.answer && (
                  <span className="ml-2">✗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick tips */}
        <div className="text-center text-slate-400 text-sm">
          <p>💡 Quick! Answer fast for bonus points!</p>
        </div>
      </div>

      {/* Reward Popup */}
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
  )
}
