import { useState, useEffect } from 'react'
import { Star, Trophy, ArrowLeft, Puzzle, Check } from 'lucide-react'

interface GrammarBuilderProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  parts: string[]
  correctOrder: number[]
  hint: string
  difficulty: Difficulty
}

const questions: Question[] = [
  // Easy - Simple sentences
  { parts: ['The', 'cat', 'is', 'sleeping'], correctOrder: [0, 1, 2, 3], hint: 'Subject + Verb', difficulty: 'easy' },
  { parts: ['I', 'like', 'to', 'read'], correctOrder: [0, 1, 2, 3], hint: 'Subject + Action', difficulty: 'easy' },
  { parts: ['She', 'runs', 'very', 'fast'], correctOrder: [0, 1, 2, 3], hint: 'Subject + Verb + How', difficulty: 'easy' },
  { parts: ['The', 'sun', 'is', 'bright'], correctOrder: [0, 1, 2, 3], hint: 'Describing something', difficulty: 'easy' },
  { parts: ['We', 'play', 'at', 'school'], correctOrder: [0, 1, 2, 3], hint: 'Where do we play?', difficulty: 'easy' },
  // Medium - More complex
  { parts: ['The', 'quick', 'brown', 'fox', 'jumps'], correctOrder: [0, 1, 2, 3, 4], hint: 'Describing an action', difficulty: 'medium' },
  { parts: ['My', 'favorite', 'color', 'is', 'blue'], correctOrder: [0, 1, 2, 3, 4], hint: 'Stating a preference', difficulty: 'medium' },
  { parts: ['Yesterday', 'I', 'went', 'to', 'the park'], correctOrder: [0, 1, 2, 3, 4], hint: 'Past tense action', difficulty: 'medium' },
  { parts: ['Because', 'it', 'rained', 'we', 'stayed', 'inside'], correctOrder: [0, 1, 2, 3, 4, 5], hint: 'Cause and effect', difficulty: 'medium' },
  // Hard - Complex grammar
  { parts: ['Although', 'he', 'was', 'tired', 'he', 'finished', 'his', 'work'], correctOrder: [0, 1, 2, 3, 4, 5, 6, 7], hint: 'Contrast situation', difficulty: 'hard' },
  { parts: ['The', 'book', 'that', 'I', 'read', 'was', 'very', 'interesting'], correctOrder: [0, 1, 2, 3, 4, 5, 6, 7], hint: 'Describing which book', difficulty: 'hard' },
]

export function GrammarBuilder({ onExit }: GrammarBuilderProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [userOrder, setUserOrder] = useState<number[]>([])
  const [shuffledParts, setShuffledParts] = useState<{text: string, originalIndex: number}[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    const q = questions[level]
    if (q) {
      setCurrentQ(q)
      const shuffled = q.parts.map((text, i) => ({ text, originalIndex: i }))
        .sort(() => Math.random() - 0.5)
      setShuffledParts(shuffled)
      setUserOrder([])
      setFeedback(null)
    }
  }, [level])

  const handleWordClick = (originalIndex: number) => {
    if (feedback) return
    
    if (userOrder.includes(originalIndex)) {
      setUserOrder(u => u.filter(i => i !== originalIndex))
    } else {
      setUserOrder(u => [...u, originalIndex])
    }
  }

  const checkAnswer = () => {
    if (!currentQ || userOrder.length !== currentQ.parts.length) return
    
    const correct = JSON.stringify(userOrder) === JSON.stringify(currentQ.correctOrder)
    if (correct) {
      const points = currentQ.difficulty === 'easy' ? 15 : currentQ.difficulty === 'medium' ? 25 : 40
      setScore(s => s + points)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (level >= questions.length - 1) {
        setGameOver(true)
      } else {
        setLevel(l => l + 1)
      }
    }, 1500)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Grammar Master!</h2>
          <p className="text-xl text-purple-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  const isComplete = userOrder.length === currentQ.parts.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}</span>
          </div>
          <span className="text-white font-bold">{level + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <Puzzle className="w-12 h-12 text-purple-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Build the Sentence</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
            currentQ.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentQ.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{currentQ.difficulty.toUpperCase()}</span>
        </div>

        {/* Answer Area */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4 min-h-[100px]">
          <p className="text-purple-200 text-sm mb-2">Your sentence:</p>
          <div className="flex flex-wrap gap-2">
            {userOrder.map((idx, i) => (
              <button
                key={i}
                onClick={() => handleWordClick(idx)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  feedback === 'correct' ? 'bg-green-500 text-white' :
                  feedback === 'wrong' ? 'bg-red-500 text-white' :
                  'bg-purple-500/50 text-white hover:bg-purple-500/70'
                }`}
              >
                {currentQ.parts[idx]}
              </button>
            ))}
          </div>
          {isComplete && feedback === null && (
            <button onClick={checkAnswer} className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> Check Answer
            </button>
          )}
        </div>

        {/* Word Bank */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-slate-300 text-sm mb-3">Hint: {currentQ.hint}</p>
          <div className="flex flex-wrap gap-2">
            {shuffledParts.map(({ text, originalIndex }) => {
              const used = userOrder.includes(originalIndex)
              return (
                <button
                  key={originalIndex}
                  onClick={() => handleWordClick(originalIndex)}
                  disabled={used || feedback !== null}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    used ? 'opacity-0 pointer-events-none' :
                    'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {text}
                </button>
              )
            })}
          </div>
        </div>

        {feedback === 'wrong' && (
          <p className="text-center text-red-400 mt-4 font-bold">Try again! Check the word order.</p>
        )}
      </div>
    </div>
  )
}
