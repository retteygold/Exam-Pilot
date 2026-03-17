import { useState, useCallback } from 'react'
import { Swords, Shield, Trophy } from 'lucide-react'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

interface KnowledgeBattleGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const BATTLE_QUESTIONS = [
  { q: "What planet do we live on?", answer: "Earth", wrong: ["Mars", "Venus", "Jupiter"] },
  { q: "How many continents are there?", answer: "7", wrong: ["5", "6", "8"] },
  { q: "What is H2O?", answer: "Water", wrong: ["Oxygen", "Hydrogen", "Salt"] },
  { q: "Which animal is the largest?", answer: "Blue Whale", wrong: ["Elephant", "Giraffe", "Shark"] },
  { q: "What is 8 squared?", answer: "64", wrong: ["16", "32", "48"] },
  { q: "Which gas do plants need?", answer: "Carbon Dioxide", wrong: ["Oxygen", "Nitrogen", "Helium"] },
  { q: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", wrong: ["Picasso", "Van Gogh", "Michelangelo"] },
  { q: "What is the capital of France?", answer: "Paris", wrong: ["London", "Berlin", "Rome"] },
  { q: "How many sides does a hexagon have?", answer: "6", wrong: ["5", "7", "8"] },
  { q: "What do bees make?", answer: "Honey", wrong: ["Wax", "Silk", "Milk"] },
]

export function KnowledgeBattleGame({ onComplete, onExit }: KnowledgeBattleGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [isGameActive, setIsGameActive] = useState(true)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState({ 
    title: '', 
    message: '', 
    type: 'achievement' as 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', 
    value: 0 
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [battleMessage, setBattleMessage] = useState('⚔️ Battle Start! ⚔️')
  const [attackAnimation, setAttackAnimation] = useState<'player' | 'enemy' | null>(null)

  const handleAnswer = useCallback((option: string) => {
    if (!isGameActive || showResult) return
    
    setSelectedOption(option)
    setShowResult(true)
    
    const question = BATTLE_QUESTIONS[currentQuestion]
    const correct = option === question.answer
    
    if (correct) {
      soundManager.play('correct')
      // Player attacks enemy
      setAttackAnimation('player')
      setBattleMessage('⚔️ Correct! You attacked! ⚔️')
      
      const damage = 20 + Math.floor(Math.random() * 10)
      setEnemyHealth(prev => {
        const newHealth = Math.max(0, prev - damage)
        if (newHealth <= 0) {
          setTimeout(() => victory(), 1000)
        }
        return newHealth
      })
      setScore(prev => prev + 25)
    } else {
      soundManager.play('wrong')
      // Enemy attacks player
      setAttackAnimation('enemy')
      setBattleMessage('💔 Wrong! Enemy counter-attacks! 💔')
      
      const damage = 15 + Math.floor(Math.random() * 10)
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage)
        if (newHealth <= 0) {
          setTimeout(() => defeat(), 1000)
        }
        return newHealth
      })
    }

    setTimeout(() => {
      setAttackAnimation(null)
      if (playerHealth > 0 && enemyHealth > 0) {
        if (currentQuestion < BATTLE_QUESTIONS.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setSelectedOption(null)
          setShowResult(false)
          setBattleMessage('⚔️ Next Round! ⚔️')
        } else {
          // Out of questions - determine winner by health
          if (playerHealth > enemyHealth) {
            victory()
          } else {
            defeat()
          }
        }
      }
    }, 1500)
  }, [currentQuestion, isGameActive, showResult, playerHealth, enemyHealth])

  const victory = () => {
    setIsGameActive(false)
    const stars = Math.min(5, Math.floor(score / 25) + 2)
    
    showRewardPopup('Victory! 🏆', `You defeated the enemy! Score: ${score}`, 'win', stars)
    
    setTimeout(() => {
      onComplete(score, stars)
    }, 3000)
  }

  const defeat = () => {
    setIsGameActive(false)
    const stars = Math.max(1, Math.floor(score / 50))
    
    showRewardPopup('Defeat... 💔', `Don't give up! Score: ${score}`, 'stars', stars)
    
    setTimeout(() => {
      onComplete(score, stars)
    }, 3000)
  }

  const showRewardPopup = (title: string, message: string, type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win', value: number) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
    soundManager.play(type === 'win' ? 'win' : 'achievement')
  }

  const question = BATTLE_QUESTIONS[currentQuestion]
  const options = [question.answer, ...question.wrong].sort(() => Math.random() - 0.5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-slate-800/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors"
          >
            Retreat
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="max-w-3xl mx-auto">
        {/* Health Bars */}
        <div className="flex items-center justify-between mb-8 gap-8">
          {/* Player Health */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold">You</span>
              <span className="text-white font-bold ml-auto">{playerHealth}/100</span>
            </div>
            <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-blue-500/50">
              <div 
                className={`h-full transition-all duration-500 ${
                  playerHealth > 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                  playerHealth > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                  'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
                }`}
                style={{ width: `${playerHealth}%` }}
              />
            </div>
          </div>

          {/* VS */}
          <div className="text-4xl font-black text-purple-400 animate-pulse">
            VS
          </div>

          {/* Enemy Health */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-bold mr-auto">{enemyHealth}/100</span>
              <span className="text-red-400 font-bold">Enemy</span>
              <Swords className="w-5 h-5 text-red-400" />
            </div>
            <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-red-500/50">
              <div 
                className={`h-full transition-all duration-500 bg-gradient-to-r from-red-600 to-red-400`}
                style={{ width: `${enemyHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Battle Message */}
        <div className={`text-center mb-6 py-3 px-6 rounded-2xl font-bold text-lg transition-all ${
          attackAnimation === 'player' ? 'bg-blue-500/30 text-blue-300 scale-105' :
          attackAnimation === 'enemy' ? 'bg-red-500/30 text-red-300 scale-105' :
          'bg-purple-500/20 text-purple-300'
        }`}>
          {battleMessage}
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {question.q}
          </h2>

          {/* Battle Options */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-5 rounded-2xl font-bold text-lg transition-all transform ${
                  showResult
                    ? option === question.answer
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                      : option === selectedOption
                        ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                        : 'bg-slate-700/50 text-slate-400'
                    : 'bg-slate-700 hover:bg-purple-600 text-white border-2 border-transparent hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
                } ${attackAnimation === 'player' ? 'animate-pulse' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Battle Tip */}
        <div className="text-center">
          <p className="text-purple-300 font-semibold">
            🛡️ Correct answers deal damage! Wrong answers hurt you! 🗡️
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
