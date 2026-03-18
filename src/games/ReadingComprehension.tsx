import { useState, useEffect } from 'react'
import { Star, ArrowLeft, BookOpen, Eye, Lightbulb } from 'lucide-react'

interface ReadingComprehensionProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface Passage {
  title: string
  passage: string
  questions: {
    question: string
    options: string[]
    answer: number
    hint: string
  }[]
  difficulty: Difficulty
}

const passages: Passage[] = [
  {
    title: "The Friendly Elephant",
    passage: "Once upon a time, there was a kind elephant named Ella. She lived in a big forest with her animal friends. Ella loved to help others. One day, a little rabbit got lost. Ella used her long trunk to lift the rabbit and carry her safely back home. Everyone in the forest loved Ella because she was always so helpful and kind.",
    questions: [
      { question: "What was the elephant's name?", options: ["Emma", "Ella", "Emily", "Elle"], answer: 1, hint: "Starts with 'Ell'" },
      { question: "Where did Ella live?", options: ["In a zoo", "In a forest", "In a city", "On a farm"], answer: 1, hint: "Wild animals live here" },
      { question: "Who got lost?", options: ["A bird", "A rabbit", "A deer", "A fox"], answer: 1, hint: "Small hopping animal" },
      { question: "How did Ella help?", options: ["With her feet", "With her trunk", "With her tail", "With her ears"], answer: 1, hint: "Long nose" }
    ],
    difficulty: 'easy'
  },
  {
    title: "The Rainy Day Adventure",
    passage: "Tommy and his sister Lucy loved rainy days. When it rained, they would put on their colorful rain boots and bright yellow raincoats. They loved jumping in puddles and watching the raindrops splash. After playing outside, they would go inside and drink hot chocolate while watching the rain through the window. Rainy days were their favorite days of all.",
    questions: [
      { question: "What did Tommy and Lucy wear on rainy days?", options: ["Swimsuits", "Rain boots and raincoats", "Snow jackets", "Pajamas"], answer: 1, hint: "Special clothes for wet weather" },
      { question: "What did they love to do in puddles?", options: ["Swim", "Jump", "Fish", "Skip rocks"], answer: 1, hint: "Up and down movement" },
      { question: "What did they drink after playing?", options: ["Cold juice", "Hot chocolate", "Tea", "Coffee"], answer: 1, hint: "Warm brown drink" },
      { question: "How did they feel about rainy days?", options: ["They hated them", "They were scared", "They loved them", "They ignored them"], answer: 2, hint: "Favorite days" }
    ],
    difficulty: 'easy'
  },
  {
    title: "The Butterfly's Journey",
    passage: "Monarch butterflies are amazing travelers. Every year, millions of them fly thousands of miles from Canada to Mexico. They travel together in large groups called swarms. The butterflies use the sun to help them find their way. This journey is called migration. Scientists are still studying how the butterflies know exactly where to go, even though they have never been there before.",
    questions: [
      { question: "How far do monarch butterflies travel?", options: ["A few miles", "Hundreds of miles", "Thousands of miles", "Millions of miles"], answer: 2, hint: "Very long distance" },
      { question: "What helps butterflies find their way?", options: ["The moon", "Stars", "The sun", "GPS"], answer: 2, hint: "Bright light in sky during day" },
      { question: "What is this journey called?", options: ["Vacation", "Trip", "Migration", "Travel"], answer: 2, hint: "Seasonal movement of animals" },
      { question: "Where do they travel from and to?", options: ["USA to Canada", "Mexico to USA", "Canada to Mexico", "USA to Mexico"], answer: 2, hint: "North to South" }
    ],
    difficulty: 'medium'
  },
  {
    title: "The First Telephone",
    passage: "Alexander Graham Bell invented the telephone in 1876. Before phones, people had to write letters or meet in person to talk to each other. The first telephone call was made between two rooms in Bell's workshop. The message was 'Mr. Watson, come here, I want to see you.' This invention changed the world forever. Today, we can video call anyone anywhere in the world instantly.",
    questions: [
      { question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Albert Einstein", "Isaac Newton"], answer: 1, hint: "Bell is in his name" },
      { question: "When was the telephone invented?", options: ["1776", "1876", "1976", "1676"], answer: 1, hint: "1800s" },
      { question: "What was the first telephone message?", options: ["Hello", "Help me", "Mr. Watson, come here", "Testing one two"], answer: 2, hint: "Asked someone to come" },
      { question: "What did people do before phones?", options: ["Used computers", "Wrote letters or met in person", "Used smoke signals", "Sent emails"], answer: 1, hint: "Written communication" }
    ],
    difficulty: 'medium'
  },
  {
    title: "The Great Barrier Reef",
    passage: "The Great Barrier Reef is the largest coral reef system in the world. It stretches over 2,300 kilometers along the coast of Australia. This underwater wonder is made of billions of tiny coral polyps. The reef is home to thousands of species including fish, sharks, turtles, and dolphins. Sadly, climate change is threatening this beautiful ecosystem. Scientists and conservationists are working hard to protect it for future generations.",
    questions: [
      { question: "Where is the Great Barrier Reef located?", options: ["Hawaii", "Florida", "Australia", "Japan"], answer: 2, hint: "Down under" },
      { question: "What is the reef made of?", options: ["Rocks", "Sand", "Coral polyps", "Shells"], answer: 2, hint: "Tiny living creatures" },
      { question: "What is threatening the reef?", options: ["Overfishing only", "Climate change", "Too many tourists", "Loud music"], answer: 1, hint: "Global warming effects" },
      { question: "How long is the reef?", options: ["230 km", "2,300 km", "23,000 km", "230,000 km"], answer: 1, hint: "Over 2,000 km" }
    ],
    difficulty: 'hard'
  }
]

export function ReadingComprehension({ onComplete: _onComplete, onExit }: ReadingComprehensionProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showCorrect, setShowCorrect] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffledPassages, setShuffledPassages] = useState<Passage[]>([])
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const shuffled = [...passages].sort(() => Math.random() - 0.5)
    setShuffledPassages(shuffled)
    setCurrentPassage(shuffled[0])
  }, [])

  useEffect(() => {
    if (shuffledPassages.length > 0) {
      setCurrentPassage(shuffledPassages[level])
      setQuestionIndex(0)
    }
  }, [level, shuffledPassages])

  const currentQuestion = currentPassage?.questions[questionIndex]

  const handleAnswer = (idx: number) => {
    if (!currentQuestion || showCorrect !== null) return

    setShowCorrect(idx)
    
    if (idx === currentQuestion.answer) {
      const points = currentPassage?.difficulty === 'easy' ? 15 : currentPassage?.difficulty === 'medium' ? 25 : 35
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (questionIndex < (currentPassage?.questions.length || 0) - 1) {
        setQuestionIndex(q => q + 1)
        setShowCorrect(null)
        setShowHint(false)
      } else {
        if (level >= Math.min(2, shuffledPassages.length - 1)) {
          setGameOver(true)
        } else {
          setLevel(l => l + 1)
          setShowCorrect(null)
          setShowHint(false)
        }
      }
    }, 1500)
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <BookOpen className="w-20 h-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Reading Complete!</h2>
          <p className="text-xl text-amber-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-white">Read Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPassage || !currentQuestion) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 p-4 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{score}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            currentPassage.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentPassage.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{currentPassage.difficulty.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Passage */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">{currentPassage.title}</h2>
          </div>
          <div className="max-h-[38vh] overflow-y-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
            <p className="text-slate-200 text-sm leading-relaxed">{currentPassage.passage}</p>
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-amber-400" />
            <span className="text-white font-bold">Question {questionIndex + 1}/{currentPassage.questions.length}</span>
          </div>
          
          <p className="text-white text-lg mb-4 font-medium">{currentQuestion.question}</p>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect !== null}
                className={`w-full py-3 px-4 rounded-xl font-bold text-left transition-all flex items-center gap-3 ${
                  showCorrect === i && i === currentQuestion.answer ? 'bg-green-500 text-white' :
                  showCorrect === i && i !== currentQuestion.answer ? 'bg-red-500 text-white' :
                  showCorrect !== null && i === currentQuestion.answer ? 'bg-green-500/50 text-white' :
                  'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>

          {/* Hint */}
          {!showHint && (
            <button 
              onClick={() => setShowHint(true)}
              className="w-full mt-4 py-2 text-amber-300 text-sm hover:text-amber-200 flex items-center justify-center gap-1"
            >
              <Lightbulb className="w-4 h-4" /> Need a hint?
            </button>
          )}
          {showHint && (
            <div className="mt-4 p-3 bg-amber-500/20 rounded-xl">
              <p className="text-amber-200 text-sm text-center">💡 {currentQuestion.hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
