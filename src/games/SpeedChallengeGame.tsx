import { useState, useEffect, useCallback } from 'react'
import { Timer, Zap, Flame } from 'lucide-react'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

interface SpeedChallengeGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const CHALLENGES = [
  { type: 'math', question: '5 + 7 = ?', answer: '12', options: ['10', '12', '14', '15'] },
  { type: 'math', question: '15 - 8 = ?', answer: '7', options: ['5', '6', '7', '9'] },
  { type: 'math', question: '3 × 4 = ?', answer: '12', options: ['7', '10', '12', '14'] },
  { type: 'pattern', question: '2, 4, 6, 8, ?', answer: '10', options: ['9', '10', '11', '12'] },
  { type: 'pattern', question: '1, 3, 5, 7, ?', answer: '9', options: ['8', '9', '10', '11'] },
  { type: 'logic', question: 'Which is biggest?', answer: 'Elephant', options: ['Cat', 'Dog', 'Elephant', 'Mouse'] },
  { type: 'logic', question: 'What has 4 legs?', answer: 'Table', options: ['Fish', 'Bird', 'Snake', 'Table'] },
  { type: 'color', question: '🍎 + 🍌 = ?', answer: 'Fruits', options: ['Colors', 'Fruits', 'Animals', 'Numbers'] },
]

export function SpeedChallengeGame({ onComplete, onExit }: SpeedChallengeGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameActive, setIsGameActive] = useState(true)
  const [streak, setStreak] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState({ 
    title: '', 
    message: '', 
    type: 'achievement' as 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', 
    value: 0 
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [difficulty, setDifficulty] = useState(1)

  // Timer - faster than quiz race
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

  const handleAnswer = useCallback((option: string) => {
    if (!isGameActive || showResult) return
    
    setSelectedOption(option)
    setShowResult(true)
    
    const challenge = CHALLENGES[currentChallenge]
    const correct = option === challenge.answer
    
    if (correct) {
      soundManager.play('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      
      // Time bonus for fast answers
      const timeBonus = timeLeft > 20 ? 15 : timeLeft > 10 ? 10 : 5
      const streakBonus = newStreak >= 3 ? 20 : newStreak >= 5 ? 40 : 0
      const points = 20 + timeBonus + streakBonus
      
      setScore(prev => prev + points)
      
      // Show rewards for milestones
      if (newStreak === 3) {
        showRewardPopup('Speed Demon! 🔥', '3 in a row with time to spare!', 'achievement', 20)
      } else if (newStreak === 5) {
        showRewardPopup('Lightning Fast! ⚡', 'Unstoppable streak!', 'milestone', 40)
        setDifficulty(d => d + 1)
      }
    } else {
      soundManager.play('wrong')
      setStreak(0)
    }

    // Quick transition - speed is key
    setTimeout(() => {
      const nextIndex = currentChallenge + 1
      if (nextIndex < CHALLENGES.length) {
        setCurrentChallenge(nextIndex)
        // Add time bonus for completing quickly
        setTimeLeft(prev => Math.min(prev + 5, 30))
        setSelectedOption(null)
        setShowResult(false)
      } else {
        endGame()
      }
    }, 800)
  }, [currentChallenge, isGameActive, streak, showResult, timeLeft])

  const showRewardPopup = (title: string, message: string, type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', value: number) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
    soundManager.play('star')
  }

  const endGame = () => {
    setIsGameActive(false)
    
    const stars = Math.min(5, Math.floor(score / 30) + 1)
    
    setTimeout(() => {
      setRewardData({
        title: score >= 100 ? 'Speed King! 👑' : score >= 60 ? 'Fast Finisher! 🏃' : 'Good Try! 💪',
        message: `You scored ${score} points and earned ${stars} stars!`,
        type: 'win',
        value: stars
      })
      setShowReward(true)
      soundManager.play('win')
    }, 500)

    setTimeout(() => {
      onComplete(score, stars)
    }, 3000)
  }

  const challenge = CHALLENGES[currentChallenge]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
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
            <div className={`flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl ${timeLeft <= 5 ? 'animate-pulse border-2 border-red-500' : ''}`}>
              <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400' : 'text-orange-400'}`} />
              <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{score}</span>
            </div>
          </div>
        </div>

        {/* Streak and difficulty */}
        <div className="flex items-center justify-between mb-4">
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
              <span className="text-xl font-bold text-orange-400">
                {streak}x Streak!
              </span>
            </div>
          )}
          <div className="text-right">
            <span className="text-sm text-slate-400">Level {difficulty}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300"
            style={{ width: `${((currentChallenge + 1) / CHALLENGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Challenge Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-6 text-center">
          <div className="mb-2">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium">
              {challenge.type.toUpperCase()} CHALLENGE
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-8 mt-4">
            {challenge.question}
          </h2>

          {/* Options - arranged for quick tapping */}
          <div className="grid grid-cols-2 gap-4">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-6 rounded-2xl font-bold text-xl transition-all transform active:scale-95 ${
                  showResult
                    ? option === challenge.answer
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-300 scale-105'
                      : option === selectedOption
                        ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                        : 'bg-slate-700/50 text-slate-400'
                    : 'bg-slate-700 hover:bg-orange-600 text-white border-2 border-transparent hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Speed tip */}
        <div className="text-center">
          <p className="text-orange-300 font-semibold animate-pulse">
            ⚡ Faster answers = More points! ⚡
          </p>
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
