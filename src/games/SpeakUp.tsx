import { useState, useEffect } from 'react'
import { Star, ArrowLeft, Mic, Volume2, Check, AlertCircle } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface SpeakUpProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface WordChallenge {
  word: string
  hint: string
  emoji: string
  difficulty: Difficulty
}

const words: WordChallenge[] = [
  // Easy - Simple words
  { word: 'HELLO', hint: 'Greeting when you meet someone', emoji: '👋', difficulty: 'easy' },
  { word: 'WATER', hint: 'You drink this', emoji: '💧', difficulty: 'easy' },
  { word: 'HAPPY', hint: 'Feeling good and smiling', emoji: '😊', difficulty: 'easy' },
  { word: 'SCHOOL', hint: 'Where students learn', emoji: '🏫', difficulty: 'easy' },
  { word: 'FRIEND', hint: 'Someone you like and play with', emoji: '🤝', difficulty: 'easy' },
  // Medium - Longer words
  { word: 'BEAUTIFUL', hint: 'Very pretty or nice to look at', emoji: '🌸', difficulty: 'medium' },
  { word: 'ELEPHANT', hint: 'Large animal with a trunk', emoji: '🐘', difficulty: 'medium' },
  { word: 'BUTTERFLY', hint: 'Flying insect with colorful wings', emoji: '🦋', difficulty: 'medium' },
  { word: 'ADVENTURE', hint: 'Exciting journey or experience', emoji: '🗺️', difficulty: 'medium' },
  { word: 'DINOSAUR', hint: 'Extinct reptile from long ago', emoji: '🦕', difficulty: 'medium' },
  // Hard - Complex words
  { word: 'EXTRAORDINARY', hint: 'Very special and unusual', emoji: '✨', difficulty: 'hard' },
  { word: 'TELESCOPE', hint: 'Tool to see faraway stars', emoji: '🔭', difficulty: 'hard' },
  { word: 'LABORATORY', hint: 'Place for science experiments', emoji: '🔬', difficulty: 'hard' },
  { word: 'CHAMPION', hint: 'Winner of a competition', emoji: '🏆', difficulty: 'hard' },
]

export function SpeakUp({ onComplete: _onComplete, onExit }: SpeakUpProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()

  const [level, setLevel] = useState(activeGame?.gameType === 'speak-up' ? activeGame.level : 0)
  const [score, setScore] = useState(activeGame?.gameType === 'speak-up' ? activeGame.score : 0)
  const [currentWord, setCurrentWord] = useState<WordChallenge | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<WordChallenge[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'listening' | null>(null)
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [supportMessage, setSupportMessage] = useState('')
  const [initialized, setInitialized] = useState(false)

  // Start game session on mount
  useEffect(() => {
    if (!initialized) {
      const shuffledW = [...words].sort(() => Math.random() - 0.5)
      setShuffled(shuffledW)
      const startLevel = activeGame?.gameType === 'speak-up' ? activeGame.level : 0
      console.log('[DEBUG] SpeakUp starting - restored level:', startLevel, 'restored score:', activeGame?.score || 0)
      setCurrentWord(shuffledW[startLevel] || shuffledW[0])
      startGameSession('speak-up', startLevel, {})
      console.log('[DEBUG] SpeakUp game session started')
      setInitialized(true)
    }
  }, [initialized, startGameSession, activeGame])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentWord(shuffled[level])
      setTranscript('')
      setFeedback(null)
    }
  }, [level, shuffled])

  // Save progress whenever level or score changes
  useEffect(() => {
    if (initialized && !gameOver) {
      updateGameProgress(level, score, {})
    }
  }, [initialized, level, score, gameOver, updateGameProgress])

  const speakWord = () => {
    if (!currentWord) return
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.rate = 0.6
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupportMessage('Speech recognition not supported in this browser. Try Chrome!')
      return
    }

    setIsListening(true)
    setTranscript('')
    setFeedback('listening')

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toUpperCase().trim()
      setTranscript(result)
      setIsListening(false)
      
      // Check if spoken word matches (with some flexibility)
      const target = currentWord?.word || ''
      const similarity = calculateSimilarity(result, target)
      
      if (similarity >= 0.7 || result.includes(target)) {
        setFeedback('correct')
        const points = currentWord?.difficulty === 'easy' ? 15 : currentWord?.difficulty === 'medium' ? 25 : 40
        setScore(s => s + points)
      } else {
        setFeedback('wrong')
      }

      setTimeout(() => {
        if (level >= 9) {
          console.log('[DEBUG] SpeakUp game complete, score:', score)
          setGameOver(true)
          // Clear active game and call onComplete to record session
          clearActiveGame()
          if (_onComplete) {
            const stars = Math.min(Math.floor(score / 50), 5)
            console.log('[DEBUG] SpeakUp calling onComplete with score:', score, 'stars:', stars)
            _onComplete(score, stars)
          }
        } else {
          setLevel(l => l + 1)
        }
      }, 2000)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setFeedback('wrong')
      setSupportMessage("Couldn't hear you. Please try again!")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()

    // Timeout after 5 seconds
    setTimeout(() => {
      if (isListening) {
        recognition.stop()
      }
    }, 5000)
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Mic className="w-20 h-20 text-rose-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Speaking Champion!</h2>
          <p className="text-xl text-rose-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-bold text-white">Speak Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 p-4">
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

      <div className="max-w-md mx-auto">
        {/* Word Card */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-rose-500/20 rounded-full flex items-center justify-center border-4 border-rose-400/30">
            <span className="text-6xl">{currentWord.emoji}</span>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
            currentWord.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentWord.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{currentWord.difficulty.toUpperCase()}</span>

          <p className="text-rose-200 text-sm mb-2">{currentWord.hint}</p>

          {/* Show word to practice */}
          <div className="bg-rose-500/20 rounded-xl p-4 mb-4">
            <p className="text-xs text-rose-300 mb-1">Say this word:</p>
            <p className="text-3xl font-bold text-white tracking-widest">{currentWord.word}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={speakWord}
              className="p-4 bg-rose-500/30 rounded-full hover:bg-rose-500/50 transition-all"
            >
              <Volume2 className="w-6 h-6 text-rose-300" />
            </button>
            
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-6 rounded-full transition-all ${
                isListening ? 'bg-green-500 animate-pulse' : 
                feedback === 'correct' ? 'bg-green-500' :
                feedback === 'wrong' ? 'bg-red-500' :
                'bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : feedback === 'correct' ? (
                <Check className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          {/* Status */}
          <p className="text-rose-300 text-sm mt-4">
            {isListening ? '🎤 Listening... Speak now!' : 
             feedback === 'correct' ? '✨ Perfect pronunciation!' : 
             feedback === 'wrong' ? `You said: "${transcript}"` :
             'Tap the mic and say the word'}
          </p>

          {supportMessage && (
            <div className="mt-3 p-3 bg-yellow-500/20 rounded-xl">
              <p className="text-yellow-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {supportMessage}
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all" style={{ width: `${((level + 1) / 10) * 100}%` }} />
          </div>
          <p className="text-center text-rose-300 text-sm mt-2">Keep practicing your speaking!</p>
        </div>
      </div>
    </div>
  )
}
