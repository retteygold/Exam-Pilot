import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useKidsStore } from '../store/kidsStore'
import { Gamepad2, Puzzle, Brain, Grid3X3, Zap, Trophy, Star, ArrowRight, Search, Eye, HelpCircle, BookOpen, Sparkles, Target, PenTool, Ear, Mic, BookMarked, Shuffle, Music, Image, Calculator, Palette, Shapes, Crown } from 'lucide-react'

interface GameCard {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgGradient: string
  points: number
}

const games: GameCard[] = [
  // Math & Logic
  {
    id: 'math-blaster',
    title: 'Math Blaster',
    description: 'Arcade math fun!',
    icon: Gamepad2,
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    points: 40
  },
  // Language & Reading
  {
    id: 'reading-comprehension',
    title: 'Reading Fun',
    description: 'Read stories!',
    icon: BookOpen,
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    points: 35
  },
  {
    id: 'story-builder',
    title: 'Story Builder',
    description: 'Create stories!',
    icon: PenTool,
    color: 'text-fuchsia-400',
    bgGradient: 'from-fuchsia-500/20 to-purple-500/20',
    points: 35
  },
  {
    id: 'spelling-sprint',
    title: 'Spelling Sprint',
    description: 'Speed spelling!',
    icon: Zap,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    points: 35
  },
  {
    id: 'grammar-builder',
    title: 'Grammar Builder',
    description: 'Build sentences!',
    icon: Puzzle,
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    points: 35
  },
  // Listening & Speaking
  {
    id: 'sound-detective',
    title: 'Sound Detective',
    description: 'Guess sounds!',
    icon: Ear,
    color: 'text-teal-400',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    points: 30
  },
  {
    id: 'speak-up',
    title: 'Speak Up',
    description: 'Practice speaking!',
    icon: Mic,
    color: 'text-rose-400',
    bgGradient: 'from-rose-500/20 to-pink-500/20',
    points: 40
  },
  // Vocabulary & Word Games
  {
    id: 'dictionary',
    title: 'Dictionary',
    description: 'Learn words!',
    icon: BookMarked,
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    points: 35
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters!',
    icon: Shuffle,
    color: 'text-violet-400',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    points: 30
  },
  {
    id: 'rhyme-time',
    title: 'Rhyme Time',
    description: 'Find rhymes!',
    icon: Music,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    points: 25
  },
  {
    id: 'picture-match',
    title: 'Picture Match',
    description: 'Match pictures!',
    icon: Image,
    color: 'text-lime-400',
    bgGradient: 'from-lime-500/20 to-green-500/20',
    points: 20
  },
  // Quick Games
  {
    id: 'speed-math',
    title: 'Speed Math',
    description: 'Fast calculations!',
    icon: Calculator,
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    points: 35
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors!',
    icon: Palette,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-violet-500/20',
    points: 25
  },
  {
    id: 'pattern-recognition',
    title: 'Pattern Genius',
    description: 'Complete patterns!',
    icon: Shapes,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-teal-500/20',
    points: 30
  },
  // MEGA GAME
  {
    id: 'mega-challenge',
    title: 'MEGA CHALLENGE',
    description: 'All games mixed!',
    icon: Crown,
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-500/30 via-orange-500/30 to-pink-500/30',
    points: 100
  },
  // Science & Geography
  {
    id: 'science-lab',
    title: 'Science Lab',
    description: 'Fun experiments!',
    icon: Sparkles,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-sky-500/20',
    points: 35
  },
  {
    id: 'geography-map',
    title: 'Map Explorer',
    description: 'Explore the world!',
    icon: Target,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    points: 35
  },
  // Classic Games
  {
    id: 'word-search',
    title: 'Word Search',
    description: 'Find hidden words!',
    icon: Search,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    points: 15
  },
  {
    id: 'crossword',
    title: 'Crossword',
    description: 'Solve puzzles!',
    icon: Grid3X3,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    points: 20
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Match the pairs!',
    icon: Brain,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    points: 20
  },
  {
    id: 'find-odd',
    title: 'Find Odd One',
    description: 'Spot different!',
    icon: Eye,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    points: 10
  },
  {
    id: 'which-can',
    title: 'Which One Can?',
    description: 'Pick correct!',
    icon: HelpCircle,
    color: 'text-violet-400',
    bgGradient: 'from-violet-500/20 to-fuchsia-500/20',
    points: 10
  },
  {
    id: 'quiz',
    title: 'Quick Quiz',
    description: 'Fast questions!',
    icon: Zap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    points: 10
  }
]

export function KidsQuickPlay() {
  const navigate = useNavigate()
  const { currentKid, sessions } = useKidsStore()

  // Calculate XP from sessions
  const kidXp = useMemo(() => {
    if (!currentKid) return 0
    const kidSessions = sessions.filter(s => s.kidId === currentKid.id)
    const total = kidSessions.reduce((sum, s) => sum + (s.score || 0), 0)
    return total
  }, [currentKid, sessions])

  const xpPerLevel = 500
  const xpLevel = Math.max(1, Math.floor(kidXp / xpPerLevel) + 1)
  const xpInLevel = kidXp % xpPerLevel
  const xpProgressPct = Math.min(100, Math.round((xpInLevel / xpPerLevel) * 100))
  const levelNames = ['Explorer', 'Adventurer', 'Champion', 'Master', 'Legend']
  const levelName = levelNames[Math.min(xpLevel - 1, 4)] || 'Legend'

  const startGame = (gameId: string) => {
    const routes: Record<string, string> = {
      'word-search': '/game/word-search',
      'crossword': '/game/crossword',
      'memory': '/game/memory',
      'find-odd': '/game/find-odd',
      'which-can': '/game/which-can',
      'quiz': '/quiz',
      'math-blaster': '/game/math-blaster',
      'spelling-sprint': '/game/spelling-sprint',
      'grammar-builder': '/game/grammar-builder',
      'science-lab': '/game/science-lab',
      'geography-map': '/game/geography-map',
      'reading-comprehension': '/game/reading-comprehension',
      'story-builder': '/game/story-builder',
      'sound-detective': '/game/sound-detective',
      'speak-up': '/game/speak-up',
      'dictionary': '/game/dictionary',
      'word-scramble': '/game/word-scramble',
      'rhyme-time': '/game/rhyme-time',
      'mega-challenge': '/game/mega-challenge',
      'speed-math': '/game/speed-math',
      'color-match': '/game/color-match',
      'pattern-recognition': '/game/pattern-recognition'
    }
    const route = routes[gameId]
    if (route) navigate(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Kids Zone v2.1</h1>
            <p className="text-xs text-emerald-300">Fun learning games! [UPDATED]</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 bg-slate-800/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          Exit Kids
        </button>
      </div>

      {/* Play Now Banner */}
      <button
        type="button"
        onClick={() => startGame('word-search')}
        className="relative w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6 hover:border-emerald-400/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-300">Start Playing</h3>
            <p className="text-xs text-emerald-200/70">Pick any game and start learning!</p>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            </div>
          </div>
          <div className="text-right">
            <ArrowRight className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-300" />
          Online Challenge
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/challenge?mode=friend')}
            className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/25 to-orange-500/25 border border-yellow-400/30 hover:border-yellow-300/60 transition-all text-left"
          >
            <div className="text-sm font-bold text-yellow-200">Friend Battle</div>
            <div className="text-xs text-yellow-200/70 mt-1">Play with a friend</div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/challenge?mode=random')}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/25 to-pink-500/25 border border-purple-400/30 hover:border-purple-300/60 transition-all text-left"
          >
            <div className="text-sm font-bold text-purple-200">Random Match</div>
            <div className="text-xs text-purple-200/70 mt-1">Find an opponent</div>
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-purple-400" />
          Games
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <button
                key={game.id}
                onClick={() => startGame(game.id)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${game.bgGradient} border border-white/10 hover:border-white/30 transition-all group text-left`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${game.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/70">+{game.points}</span>
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{game.title}</h3>
                <p className="text-xs text-white/60">{game.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Learning Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-400" />
          Learning
        </h2>
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-300">Level {xpLevel}: {levelName}</span>
            <span className="text-xs text-purple-400 font-bold">{xpInLevel}/{xpPerLevel} XP</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
              style={{ width: `${xpProgressPct}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`aspect-square rounded-xl flex items-center justify-center ${
                  level <= Math.min(5, xpLevel)
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-slate-700/50 border border-slate-600'
                }`}
              >
                {level <= Math.min(5, xpLevel) ? (
                  <Star className="w-4 h-4 text-white fill-white" />
                ) : (
                  <span className="text-xs text-slate-500">{level}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

