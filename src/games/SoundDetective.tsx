import { useState, useEffect, useRef } from 'react'
import { Star, ArrowLeft, Volume2, Play, Ear, Check } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'

interface SoundDetectiveProps {
  onComplete?: (score: number, stars: number) => void
  onExit: () => void
}

type Difficulty = 'easy' | 'medium' | 'hard'
type SoundType = 'animal' | 'nature' | 'vehicle' | 'musical'

interface SoundQuestion {
  type: SoundType
  emoji: string
  options: string[]
  answer: number
  description: string
  difficulty: Difficulty
}

const sounds: SoundQuestion[] = [
  // Easy - Animals
  { type: 'animal', emoji: '🐕', options: ['Cat', 'Dog', 'Bird', 'Cow'], answer: 1, description: 'Barking sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐱', options: ['Dog', 'Cat', 'Sheep', 'Pig'], answer: 1, description: 'Meowing sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐮', options: ['Horse', 'Pig', 'Cow', 'Sheep'], answer: 2, description: 'Mooing sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐤', options: ['Duck', 'Chicken', 'Goose', 'Turkey'], answer: 1, description: 'Clucking sound', difficulty: 'easy' },
  { type: 'animal', emoji: '🐴', options: ['Donkey', 'Horse', 'Zebra', 'Camel'], answer: 1, description: 'Neighing sound', difficulty: 'easy' },
  // Medium - Nature & Vehicles
  { type: 'nature', emoji: '🌧️', options: ['Wind', 'Rain', 'Thunder', 'Waves'], answer: 1, description: 'Falling water drops', difficulty: 'medium' },
  { type: 'nature', emoji: '⛈️', options: ['Lightning', 'Thunder', 'Storm', 'Hail'], answer: 1, description: 'Loud boom in sky', difficulty: 'medium' },
  { type: 'vehicle', emoji: '🚗', options: ['Motorcycle', 'Car', 'Truck', 'Bus'], answer: 1, description: 'Engine and horn', difficulty: 'medium' },
  { type: 'vehicle', emoji: '🚨', options: ['Police car', 'Ambulance', 'Fire truck', 'All of these'], answer: 3, description: 'Siren sounds', difficulty: 'medium' },
  { type: 'musical', emoji: '🎸', options: ['Violin', 'Guitar', 'Piano', 'Drums'], answer: 1, description: 'Strumming strings', difficulty: 'medium' },
  // Hard - Complex sounds
  { type: 'musical', emoji: '🎹', options: ['Organ', 'Piano', 'Harpsichord', 'Synthesizer'], answer: 1, description: 'Keys and hammers', difficulty: 'hard' },
  { type: 'nature', emoji: '🌊', options: ['River', 'Waterfall', 'Ocean waves', 'Rain'], answer: 2, description: 'Crashing water', difficulty: 'hard' },
  { type: 'vehicle', emoji: '✈️', options: ['Helicopter', 'Airplane', 'Jet', 'Glider'], answer: 1, description: 'Engine and takeoff', difficulty: 'hard' },
  { type: 'animal', emoji: '🐘', options: ['Lion', 'Elephant', 'Bear', 'Tiger'], answer: 1, description: 'Trumpeting call', difficulty: 'hard' },
]

export function SoundDetective({ onComplete: _onComplete, onExit }: SoundDetectiveProps) {
  const { startGameSession, updateGameProgress, clearActiveGame, getActiveGame } = useKidsStore()
  const activeGame = getActiveGame()

  const [level, setLevel] = useState(activeGame?.gameType === 'sound-detective' ? activeGame.level : 0)
  const [score, setScore] = useState(activeGame?.gameType === 'sound-detective' ? activeGame.score : 0)
  const [currentSound, setCurrentSound] = useState<SoundQuestion | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [shuffled, setShuffled] = useState<SoundQuestion[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [initialized, setInitialized] = useState(false)

  const getAudioCtx = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playTone = (ctx: AudioContext, freq: number, duration: number, type: OscillatorType, gain = 0.2) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    g.gain.setValueAtTime(gain, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }

  const playNoise = (ctx: AudioContext, duration: number, color: 'white' | 'pink' = 'white', gain = 0.12) => {
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    let b0 = 0
    let b1 = 0
    let b2 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      if (color === 'pink') {
        b0 = 0.99765 * b0 + white * 0.0990460
        b1 = 0.96300 * b1 + white * 0.2965164
        b2 = 0.57000 * b2 + white * 1.0526913
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2
      } else {
        data[i] = white
      }
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

    source.connect(g)
    g.connect(ctx.destination)
    source.start()
    source.stop(ctx.currentTime + duration)
  }

  const playSoundByQuestion = async (q: SoundQuestion) => {
    const ctx = await getAudioCtx()

    // Keep these short so it feels like “real sound” but doesn't annoy.
    switch (q.type) {
      case 'animal': {
        // Simple “voice” style: quick pitch pattern
        // Different animals get slightly different pitch.
        const base = q.emoji === '🐱' ? 900 : q.emoji === '🐮' ? 220 : q.emoji === '🐘' ? 140 : 600
        playTone(ctx, base, 0.12, 'square', 0.12)
        setTimeout(() => playTone(ctx, base * 0.85, 0.12, 'square', 0.12), 130)
        setTimeout(() => playTone(ctx, base * 1.1, 0.1, 'square', 0.1), 260)
        break
      }
      case 'nature': {
        if (q.emoji === '🌧️') {
          // Rain: soft pink noise
          playNoise(ctx, 0.9, 'pink', 0.10)
        } else if (q.emoji === '⛈️') {
          // Thunder: low rumble + crack
          playTone(ctx, 55, 0.7, 'sawtooth', 0.15)
          setTimeout(() => playNoise(ctx, 0.15, 'white', 0.12), 120)
        } else if (q.emoji === '🌊') {
          // Waves: slow oscillation + noise
          playNoise(ctx, 0.8, 'pink', 0.09)
          setTimeout(() => playTone(ctx, 180, 0.25, 'sine', 0.08), 80)
        } else {
          playNoise(ctx, 0.8, 'pink', 0.10)
        }
        break
      }
      case 'vehicle': {
        // Engine: buzzing sawtooth + short honk
        playTone(ctx, 110, 0.6, 'sawtooth', 0.10)
        setTimeout(() => playTone(ctx, 330, 0.12, 'square', 0.08), 220)
        break
      }
      case 'musical': {
        // Instrument: clean notes
        playTone(ctx, 440, 0.18, 'sine', 0.14)
        setTimeout(() => playTone(ctx, 554, 0.18, 'sine', 0.14), 180)
        setTimeout(() => playTone(ctx, 659, 0.22, 'sine', 0.14), 360)
        break
      }
    }
  }

  // Start game session on mount
  useEffect(() => {
    if (!initialized) {
      const shuffledS = [...sounds].sort(() => Math.random() - 0.5).slice(0, 10)
      setShuffled(shuffledS)
      const startLevel = activeGame?.gameType === 'sound-detective' ? activeGame.level : 0
      console.log('[DEBUG] SoundDetective starting - restored level:', startLevel, 'restored score:', activeGame?.score || 0)
      setCurrentSound(shuffledS[startLevel] || shuffledS[0])
      startGameSession('sound-detective', startLevel, {})
      console.log('[DEBUG] SoundDetective game session started')
      setInitialized(true)
    }
  }, [initialized, startGameSession, activeGame])

  // Save progress whenever level or score changes
  useEffect(() => {
    if (initialized && !gameOver) {
      console.log('[DEBUG] SoundDetective saving progress - level:', level, 'score:', score)
      updateGameProgress(level, score, {})
    }
  }, [initialized, level, score, gameOver, updateGameProgress])

  useEffect(() => {
    if (shuffled.length > 0) {
      setCurrentSound(shuffled[level])
    }
  }, [level, shuffled])

  const playSound = async () => {
    if (!currentSound || isPlaying) return
    setIsPlaying(true)
    try {
      await playSoundByQuestion(currentSound)
      // Approx duration; keep in sync with synth functions
      setTimeout(() => setIsPlaying(false), 950)
    } catch {
      setIsPlaying(false)
    }
  }

  const handleAnswer = (idx: number) => {
    if (!currentSound || showCorrect) return

    setSelected(idx)
    setShowCorrect(true)
    
    if (idx === currentSound.answer) {
      const points = currentSound.difficulty === 'easy' ? 10 : currentSound.difficulty === 'medium' ? 20 : 30
      setScore(s => s + points)
    }

    setTimeout(() => {
      if (level >= 9) {
        console.log('[DEBUG] SoundDetective game complete, score:', score)
        setGameOver(true)
        // Clear active game and call onComplete to record session
        clearActiveGame()
        if (_onComplete) {
          const stars = Math.min(Math.floor(score / 50), 5)
          console.log('[DEBUG] SoundDetective calling onComplete with score:', score, 'stars:', stars)
          _onComplete(score, stars)
        }
      } else {
        setLevel(l => l + 1)
        setSelected(null)
        setShowCorrect(false)
        setIsPlaying(false)
      }
    }, 1500)
  }

  const getCategoryIcon = (type: SoundType) => {
    switch (type) {
      case 'animal': return '🐾'
      case 'nature': return '🌿'
      case 'vehicle': return '🚗'
      case 'musical': return '🎵'
    }
  }

  const stars = Math.min(Math.floor(score / 50), 5)

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center">
          <Ear className="w-20 h-20 text-teal-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Sound Master!</h2>
          <p className="text-xl text-teal-300 mb-4">Score: {score}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setLevel(0); setGameOver(false); }} className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold text-white">Play Again</button>
            <button onClick={onExit} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-white">Exit</button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSound) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 p-4">
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
        {/* Sound Display */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center border-4 border-teal-400/30">
            <span className="text-6xl">{currentSound.emoji}</span>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
            currentSound.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' : 
            currentSound.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' : 
            'bg-red-500/30 text-red-300'
          }`}>{getCategoryIcon(currentSound.type)} {currentSound.type.toUpperCase()}</span>

          <p className="text-teal-200 text-sm mb-4">{currentSound.description}</p>

          {/* Play Sound Button */}
          <button
            onClick={playSound}
            disabled={isPlaying}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-teal-400 hover:to-cyan-400 transition-all disabled:opacity-50"
          >
            {isPlaying ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>
          
          <p className="text-teal-300 text-sm mt-3">{isPlaying ? 'Playing sound...' : 'Tap to hear the sound'}</p>
        </div>

        {/* Options */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-white font-bold mb-3 text-center">What makes this sound?</p>
          <div className="grid grid-cols-2 gap-2">
            {currentSound.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showCorrect}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all ${
                  showCorrect && i === currentSound.answer ? 'bg-green-500 text-white' :
                  showCorrect && i === selected && i !== currentSound.answer ? 'bg-red-500 text-white' :
                  selected === i ? 'bg-teal-500 text-white' :
                  'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {showCorrect && i === currentSound.answer && <Check className="w-4 h-4 inline mr-1" />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-teal-300/70 text-xs mt-4">
          Tip: Listen to the sound description carefully!
        </p>
      </div>
    </div>
  )
}
