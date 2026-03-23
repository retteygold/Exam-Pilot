import { useState, useEffect } from 'react'
import { Star, ArrowLeft, FlaskConical, Microscope, Atom, Brain } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface ScienceLabProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionType = 'fact' | 'experiment' | 'identify'

interface Question {
  type: QuestionType
  question: string
  options: string[]
  answer: number
  image?: string
  difficulty: Difficulty
}

const questions: Question[] = [
  // Easy - Basic facts
  { type: 'fact', question: 'What do plants need to make food?', options: ['Sunlight', 'Music', 'TV', 'Toys'], answer: 0, difficulty: 'easy' },
  { type: 'fact', question: 'How many legs does a spider have?', options: ['4', '6', '8', '10'], answer: 2, difficulty: 'easy' },
  { type: 'fact', question: 'What is the freezing point of water?', options: ['0°C', '10°C', '25°C', '100°C'], answer: 0, difficulty: 'easy' },
  { type: 'fact', question: 'Which animal lays eggs?', options: ['Dog', 'Cat', 'Bird', 'Elephant'], answer: 2, difficulty: 'easy' },
  { type: 'fact', question: 'What color is chlorophyll?', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 1, difficulty: 'easy' },
  // Medium - More complex
  { type: 'experiment', question: 'What happens when you mix baking soda and vinegar?', options: ['Nothing', 'Explosion', 'Fizzing reaction', 'Freezing'], answer: 2, difficulty: 'medium' },
  { type: 'fact', question: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], answer: 2, difficulty: 'medium' },
  { type: 'identify', question: 'Which of these is a mammal?', options: ['Shark', 'Dolphin', 'Goldfish', 'Crocodile'], answer: 1, difficulty: 'medium' },
  { type: 'fact', question: 'What gas do humans breathe in?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], answer: 1, difficulty: 'medium' },
  // Hard - Advanced
  { type: 'fact', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1, difficulty: 'hard' },
  { type: 'experiment', question: 'In a circuit, what does the resistor do?', options: ['Store charge', 'Control current flow', 'Generate electricity', 'Store energy'], answer: 1, difficulty: 'hard' },
  { type: 'fact', question: 'What is H2O?', options: ['Salt', 'Sugar', 'Water', 'Acid'], answer: 2, difficulty: 'hard' },
  { type: 'identify', question: 'Which state of matter has no fixed shape?', options: ['Solid', 'Liquid', 'Gas', 'Both liquid and gas'], answer: 3, difficulty: 'hard' },
]

export function ScienceLab({ onComplete: _onComplete, onExit }: ScienceLabProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()

  const [level, setLevel] = useState(activeGame?.gameType === 'science-lab' ? activeGame.level : 0)
  const [score, setScore] = useState(activeGame?.gameType === 'science-lab' ? activeGame.score : 0)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<Question[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      const shuffledQ = [...questions].sort(() => Math.random() - 0.5).slice(0, 10)
      setShuffled(shuffledQ)
      const startLevel = activeGame?.gameType === 'science-lab' ? activeGame.level : 0
      setCurrentQ(shuffledQ[startLevel] || shuffledQ[0])
      startGameSession('science-lab', startLevel, {})
      setInitialized(true)
    }
  }, [initialized, startGameSession, activeGame])

  // Save progress whenever level or score changes
  useEffect(() => {
    if (initialized && !gameOver) {
      updateGameProgress(level, score, {})
    }
  }, [initialized, level, score, gameOver, updateGameProgress])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentQ(shuffled[level])
    }
  }, [level, shuffled])

  const handleAnswer = (idx: number) => {
    if (!currentQ || showCorrect) return
    
    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentQ.answer) {
      const points = currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 20 : 30
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (level >= 9) {
        console.log('[DEBUG] ScienceLab game complete, score:', score)
        setGameOver(true)
        // Clear active game and call onComplete to record session
        clearActiveGame()
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] ScienceLab calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
        setSelected(null)
        setShowCorrect(false)
      }
    }, 1500)
  }

  const getIcon = (type: QuestionType) => {
    switch (type) {
      case 'fact': return <Brain className="w-8 h-8 text-cyan-400" />
      case 'experiment': return <FlaskConical className="w-8 h-8 text-green-400" />
      case 'identify': return <Microscope className="w-8 h-8 text-purple-400" />
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Atom className="w-20 h-20 text-cyan-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-3xl font-bold text-white mb-2">Science Champion!</h2>
          <p className="text-xl text-cyan-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 p-4">
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

      <div className="max-w-md mx-auto">
        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
              {getIcon(currentQ.type)}
            </div>
          </div>
          
          <span className={`block text-center text-xs font-bold mb-2 ${
            currentQ.difficulty === 'easy' ? 'text-green-400' : 
            currentQ.difficulty === 'medium' ? 'text-yellow-400' : 
            'text-red-400'
          }`}>{currentQ.type.toUpperCase()} • {currentQ.difficulty.toUpperCase()}</span>
          
          <h2 className="text-xl font-bold text-white text-center mb-6">{currentQ.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`w-full py-3 px-4 rounded-xl font-bold text-left transition-all flex items-center gap-3 ${
                  showCorrect && i === currentQ.answer ? 'bg-green-500 text-white' :
                  showCorrect && i === selected && i !== currentQ.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-cyan-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all" style={{ width: `${((level + 1) / 10) * 100}%` }} />
          </div>
          <p className="text-center text-cyan-300 text-sm mt-2">Keep experimenting!</p>
        </div>
      </div>
    </div>
  )
}
