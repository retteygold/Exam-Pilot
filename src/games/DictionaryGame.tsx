import { useState, useEffect, useCallback } from 'react'
import { Star, ArrowLeft, BookOpen, Volume2, Check, X, Lightbulb, Search } from 'lucide-react'

interface DictionaryGameProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionType = 'definition' | 'synonym' | 'antonym'

interface WordEntry {
  word: string
  definition: string
  synonyms: string[]
  antonyms: string[]
  example: string
  difficulty: Difficulty
}

const wordBank: WordEntry[] = [
  // Easy
  { word: 'HAPPY', definition: 'Feeling joy or pleasure', synonyms: ['joyful', 'cheerful', 'glad'], antonyms: ['sad', 'unhappy', 'miserable'], example: 'The happy child smiled all day.', difficulty: 'easy' },
  { word: 'BIG', definition: 'Large in size', synonyms: ['large', 'huge', 'enormous'], antonyms: ['small', 'tiny', 'little'], example: 'The big elephant walked slowly.', difficulty: 'easy' },
  { word: 'FAST', definition: 'Moving quickly', synonyms: ['quick', 'rapid', 'swift'], antonyms: ['slow', 'sluggish'], example: 'The fast car zoomed past.', difficulty: 'easy' },
  { word: 'HOT', definition: 'Having high temperature', synonyms: ['warm', 'burning', 'boiling'], antonyms: ['cold', 'freezing', 'cool'], example: 'The hot sun made us sweat.', difficulty: 'easy' },
  { word: 'BRIGHT', definition: 'Shining with light', synonyms: ['shining', 'radiant', 'luminous'], antonyms: ['dim', 'dark', 'dull'], example: 'The bright stars filled the night sky.', difficulty: 'easy' },
  // Medium
  { word: 'COURAGEOUS', definition: 'Having bravery and boldness', synonyms: ['brave', 'fearless', 'bold'], antonyms: ['cowardly', 'timid', 'fearful'], example: 'The courageous firefighter saved the cat.', difficulty: 'medium' },
  { word: 'ENORMOUS', definition: 'Very large in size', synonyms: ['huge', 'massive', 'gigantic'], antonyms: ['tiny', 'minute', 'microscopic'], example: 'The enormous whale swam gracefully.', difficulty: 'medium' },
  { word: 'BRILLIANT', definition: 'Very intelligent or shining brightly', synonyms: ['genius', 'smart', 'exceptional'], antonyms: ['stupid', 'dull', 'average'], example: 'She had a brilliant idea for the project.', difficulty: 'medium' },
  { word: 'DELICIOUS', definition: 'Very tasty and enjoyable', synonyms: ['tasty', 'yummy', 'scrumptious'], antonyms: ['disgusting', 'gross', 'unappetizing'], example: 'The delicious cake melted in my mouth.', difficulty: 'medium' },
  { word: 'ANCIENT', definition: 'Very old, from long ago', synonyms: ['old', 'antique', 'prehistoric'], antonyms: ['modern', 'new', 'recent'], example: 'The ancient ruins tell stories of the past.', difficulty: 'medium' },
  // Hard
  { word: 'METICULOUS', definition: 'Showing great attention to detail', synonyms: ['precise', 'careful', 'thorough'], antonyms: ['careless', 'sloppy', 'hasty'], example: 'The meticulous artist painted every detail.', difficulty: 'hard' },
  { word: 'ELOQUENT', definition: 'Fluent and expressive in speaking', synonyms: ['articulate', 'well-spoken', 'persuasive'], antonyms: ['inarticulate', 'tongue-tied', 'silent'], example: 'The eloquent speaker moved the audience.', difficulty: 'hard' },
  { word: 'BENEVOLENT', definition: 'Kind and generous', synonyms: ['charitable', 'kind-hearted', 'humane'], antonyms: ['cruel', 'malevolent', 'selfish'], example: 'The benevolent donor gave to many causes.', difficulty: 'hard' },
  { word: 'RESILIENT', definition: 'Able to recover quickly from difficulties', synonyms: ['tough', 'strong', 'flexible'], antonyms: ['fragile', 'weak', 'delicate'], example: 'The resilient plant grew back after the storm.', difficulty: 'hard' },
]

export function DictionaryGame({ onComplete: _onComplete, onExit }: DictionaryGameProps) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<WordEntry[]>([])
  const [currentQ, setCurrentQ] = useState<{word: WordEntry; type: QuestionType; options: string[]; answer: number; question: string} | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [masteredWords, setMasteredWords] = useState<string[]>([])

  useEffect(() => {
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }, [])

  const generateQuestion = useCallback((wordEntry: WordEntry) => {
    const types: QuestionType[] = ['definition', 'synonym', 'antonym']
    const type = types[Math.floor(Math.random() * types.length)]
    
    let question: string
    let answer: string
    let options: string[]
    
    switch (type) {
      case 'definition':
        question = `What word means: "${wordEntry.definition}"?`
        answer = wordEntry.word
        // Get 3 random wrong answers from other words
        options = [answer]
        while (options.length < 4) {
          const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)].word
          if (!options.includes(randomWord)) {
            options.push(randomWord)
          }
        }
        break
      case 'synonym':
        question = `What is a synonym for "${wordEntry.word}"?`
        answer = wordEntry.synonyms[0]
        options = [answer]
        // Add other synonyms as distractors from different words
        while (options.length < 4) {
          const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)]
          const randomSyn = randomWord.synonyms[0]
          if (!options.includes(randomSyn) && randomSyn !== answer) {
            options.push(randomSyn)
          }
        }
        break
      case 'antonym':
        question = `What is an antonym (opposite) for "${wordEntry.word}"?`
        answer = wordEntry.antonyms[0]
        options = [answer]
        while (options.length < 4) {
          const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)]
          const randomAnt = randomWord.antonyms[0] || randomWord.synonyms[0]
          if (!options.includes(randomAnt) && randomAnt !== answer) {
            options.push(randomAnt)
          }
        }
        break
    }
    
    options.sort(() => Math.random() - 0.5)
    const answerIndex = options.indexOf(answer)
    
    return { word: wordEntry, type, options, answer: answerIndex, question }
  }, [])

  useEffect(() => {
    if (shuffledWords.length > 0 && level < shuffledWords.length) {
      const q = generateQuestion(shuffledWords[level])
      setCurrentQ(q)
      setSelected(null)
      setShowCorrect(false)
      setShowHint(false)
    }
  }, [level, shuffledWords, generateQuestion])

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  const handleAnswer = (idx: number) => {
    if (!currentQ || showCorrect) return
    
    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentQ.answer) {
      const points = currentQ.word.difficulty === 'easy' ? 15 : currentQ.word.difficulty === 'medium' ? 25 : 40
      const streakBonus = Math.min(streak * 2, 20)
      setScore(s => s + points + streakBonus)
      setStreak(s => s + 1)
      
      // Mark word as mastered
      if (!masteredWords.includes(currentQ.word.word)) {
        setMasteredWords([...masteredWords, currentQ.word.word])
      }
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (level >= 9) {
        setGameOver(true)
      } else {
        setLevel(l => l + 1)
      }
    }, 1500)
  }

  const getHint = () => {
    if (!currentQ) return ''
    switch (currentQ.type) {
      case 'definition':
        return `Example: "${currentQ.word.example}"`
      case 'synonym':
        return `Other synonyms: ${currentQ.word.synonyms.slice(1).join(', ')}`
      case 'antonym':
        return `Think of the opposite meaning!`
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 p-4 overflow-y-auto flex items-center justify-center">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <BookOpen className="w-20 h-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Word Master!</h2>
          <p className="text-xl text-amber-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <p className="text-amber-200 mb-6">Words mastered: {masteredWords.length}/10</p>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); setStreak(0); setMasteredWords([]); }} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 bg-slate-800/50 rounded-full"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <span className="text-white font-bold">{level + 1}/10</span>
          </div>
        </div>

        {/* Streak */}
        {streak > 2 && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/30 rounded-full text-orange-300 font-bold">
              🔥 {streak} Streak!
            </span>
          </div>
        )}

        {/* Word Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentQ.word.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
              currentQ.word.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
              'bg-red-500/30 text-red-300'
            }`}>{currentQ.word.difficulty.toUpperCase()}</span>
          </div>
          
          {/* Question */}
          <p className="text-xl text-white text-center font-medium mb-4">{currentQ.question}</p>
          
          {/* Word display for synonym/antonym questions */}
          {currentQ.type !== 'definition' && (
            <div className="text-center mb-4">
              <button
                onClick={() => speakWord(currentQ.word.word)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-xl text-amber-300 hover:bg-amber-500/30 transition-all"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-2xl font-bold">{currentQ.word.word}</span>
              </button>
            </div>
          )}

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
                  selected === i ? 'bg-amber-500 text-white' :
                  'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-600'
                }`}
              >
                {showCorrect && i === currentQ.answer && <Check className="w-5 h-5" />}
                {showCorrect && i === selected && i !== currentQ.answer && <X className="w-5 h-5" />}
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
              <p className="text-amber-200 text-sm text-center">{getHint()}</p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm">Words mastered: {masteredWords.length}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all" style={{ width: `${((level + 1) / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
