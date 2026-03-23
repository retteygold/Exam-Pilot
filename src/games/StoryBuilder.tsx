import { useState, useEffect } from 'react'
import { Star, ArrowLeft, PenTool, Check, Clock } from 'lucide-react'

interface StoryBuilderProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface StoryPrompt {
  beginning: string
  middleOptions: string[]
  endOptions: string[]
  correctMiddle: number
  correctEnd: number
  difficulty: Difficulty
}

const prompts: StoryPrompt[] = [
  {
    beginning: "A young girl named Mia found a magical key in her garden...",
    middleOptions: [
      "She buried it in the ground",
      "She used it to open a mysterious door",
      "She threw it in the river",
      "She gave it to her friend"
    ],
    endOptions: [
      "It led to a world full of talking animals",
      "She went to sleep",
      "The key disappeared",
      "She lost it forever"
    ],
    correctMiddle: 1,
    correctEnd: 0,
    difficulty: 'easy'
  },
  {
    beginning: "The old lighthouse keeper woke up to a stormy night...",
    middleOptions: [
      "He stayed in bed",
      "He made breakfast",
      "He climbed to the top to fix the light",
      "He called his friend"
    ],
    endOptions: [
      "The ships crashed",
      "He saved the ships from danger",
      "The lighthouse broke",
      "He went home"
    ],
    correctMiddle: 2,
    correctEnd: 1,
    difficulty: 'medium'
  },
  {
    beginning: "In a kingdom far away, a humble baker discovered a secret recipe...",
    middleOptions: [
      "He threw it away",
      "He baked bread that granted wishes",
      "He sold it to a king",
      "He forgot about it"
    ],
    endOptions: [
      "The kingdom fell into darkness",
      "He became greedy and lost everything",
      "He shared the bread and brought joy to all",
      "The recipe was stolen"
    ],
    correctMiddle: 1,
    correctEnd: 2,
    difficulty: 'hard'
  },
  {
    beginning: "A curious cat named Whiskers followed a butterfly into the forest...",
    middleOptions: [
      "He got scared and ran home",
      "He discovered a hidden cat village",
      "He fell asleep",
      "He caught the butterfly"
    ],
    endOptions: [
      "He made new friends and had adventures",
      "He was lost forever",
      "He was scared",
      "He went back home immediately"
    ],
    correctMiddle: 1,
    correctEnd: 0,
    difficulty: 'easy'
  },
  {
    beginning: "Two robots on Mars discovered a mysterious signal...",
    middleOptions: [
      "They ignored it and went to sleep",
      "They played games instead",
      "They followed the signal to an ancient cave",
      "They ran away"
    ],
    endOptions: [
      "They found evidence of ancient life",
      "Nothing happened",
      "They broke down",
      "The signal stopped"
    ],
    correctMiddle: 2,
    correctEnd: 0,
    difficulty: 'hard'
  }
]

export function StoryBuilder({ onComplete: _onComplete, onExit }: StoryBuilderProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentPrompt, setCurrentPrompt] = useState<StoryPrompt | null>(null)
  const [selectedMiddle, setSelectedMiddle] = useState<number | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null)
  const [stage, setStage] = useState<'middle' | 'end' | 'complete'>('middle')
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<StoryPrompt[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const shuffledP = [...prompts].sort(() => Math.random() - 0.5)
    setShuffled(shuffledP)
    setCurrentPrompt(shuffledP[0])
  }, [])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentPrompt(shuffled[level])
      setStage('middle')
      setSelectedMiddle(null)
      setSelectedEnd(null)
      setFeedback(null)
      setTimeLeft(60)
    }
  }, [level, shuffled])

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && stage !== 'complete') {
      const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(t)
    } else if (timeLeft === 0 && !gameOver) {
      console.log('[DEBUG] StoryBuilder time up, ending game with score:', score)
      setGameOver(true)
      // Call onComplete to record session
      if (_onComplete) {
        const stars = Math.min(Math.floor(score / 50), 5)
        console.log('[DEBUG] StoryBuilder calling onComplete with score:', score, 'stars:', stars)
        _onComplete(score, stars)
      }
    }
  }, [timeLeft, gameOver, stage, score, _onComplete])

  const handleMiddleSelect = (idx: number) => {
    if (feedback) return
    setSelectedMiddle(idx)
    setFeedback(idx === currentPrompt?.correctMiddle ? 'correct' : 'wrong')
    
    if (idx === currentPrompt?.correctMiddle) {
      const points = currentPrompt?.difficulty === 'easy' ? 15 : currentPrompt?.difficulty === 'medium' ? 20 : 25
      setScore(s => s + points)
    }

    setTimeout(() => {
      setStage('end')
      setFeedback(null)
    }, 1500)
  }

  const handleEndSelect = (idx: number) => {
    if (feedback) return
    setSelectedEnd(idx)
    setFeedback(idx === currentPrompt?.correctEnd ? 'correct' : 'wrong')
    
    if (idx === currentPrompt?.correctEnd) {
      const points = currentPrompt?.difficulty === 'easy' ? 15 : currentPrompt?.difficulty === 'medium' ? 20 : 25
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (level >= prompts.length - 1) {
        console.log('[DEBUG] StoryBuilder game complete, score:', score)
        setGameOver(true)
        // Call onComplete to record session
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] StoryBuilder calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
      }
    }, 1500)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <PenTool className="w-20 h-20 text-fuchsia-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Story Master!</h2>
          <p className="text-xl text-fuchsia-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-xl font-bold text-white">Write Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPrompt) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-fuchsia-500/20 rounded-full">
            <Clock className="w-4 h-4 text-fuchsia-400" />
            <span className={`font-bold ${timeLeft < 15 ? 'text-red-400' : 'text-fuchsia-400'}`}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Story Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <PenTool className="w-6 h-6 text-fuchsia-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              currentPrompt.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
              currentPrompt.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
              'bg-red-500/30 text-red-300'
            }`}>{currentPrompt.difficulty.toUpperCase()}</span>
          </div>
          
          <p className="text-lg text-white font-medium mb-4">{currentPrompt.beginning}</p>

          {stage === 'middle' && (
            <>
              <p className="text-fuchsia-300 text-sm mb-3">What happens next? Choose the best middle:</p>
              <div className="space-y-2">
                {currentPrompt.middleOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleMiddleSelect(i)}
                    disabled={feedback !== null}
                    className={`w-full py-3 px-4 rounded-xl text-left font-bold transition-all flex items-center gap-3 ${
                      feedback && selectedMiddle === i && i === currentPrompt.correctMiddle ? 'bg-green-500 text-white' :
                      feedback && selectedMiddle === i && i !== currentPrompt.correctMiddle ? 'bg-red-500 text-white' :
                      selectedMiddle === i ? 'bg-fuchsia-500 text-white' :
                      'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                    }`}
                  >
                    {feedback && selectedMiddle === i && i === currentPrompt.correctMiddle && <Check className="w-5 h-5" />}
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {stage === 'end' && (
            <>
              <div className="bg-fuchsia-500/20 rounded-xl p-3 mb-3">
                <p className="text-fuchsia-200 text-sm">Middle:</p>
                <p className="text-white">{currentPrompt.middleOptions[selectedMiddle!]}</p>
              </div>
              <p className="text-fuchsia-300 text-sm mb-3">How does the story end? Choose the best ending:</p>
              <div className="space-y-2">
                {currentPrompt.endOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleEndSelect(i)}
                    disabled={feedback !== null}
                    className={`w-full py-3 px-4 rounded-xl text-left font-bold transition-all flex items-center gap-3 ${
                      feedback && selectedEnd === i && i === currentPrompt.correctEnd ? 'bg-green-500 text-white' :
                      feedback && selectedEnd === i && i !== currentPrompt.correctEnd ? 'bg-red-500 text-white' :
                      selectedEnd === i ? 'bg-fuchsia-500 text-white' :
                      'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                    }`}
                  >
                    {feedback && selectedEnd === i && i === currentPrompt.correctEnd && <Check className="w-5 h-5" />}
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-fuchsia-300 text-sm">Story {level + 1} of {prompts.length}</p>
      </div>
    </div>
  )
}
