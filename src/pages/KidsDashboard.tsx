import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Trophy, Zap, Target, Gamepad2, Puzzle, Brain, Sparkles, ArrowRight, Medal, Crown, LogOut } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'
import { useUserStore } from '../store/userStore'
import type { Question, QuestionsData } from '../types'
import { KidsLogin } from './KidsLogin'

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
  {
    id: 'quick-quiz',
    title: 'Quick Quiz',
    description: 'Fast questions, earn stars!',
    icon: Zap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    points: 10
  },
  {
    id: 'puzzle-solve',
    title: 'Puzzle Time',
    description: 'Solve puzzles, train your brain!',
    icon: Puzzle,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    points: 15
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Match cards, test memory!',
    icon: Brain,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    points: 20
  },
  {
    id: 'word-builder',
    title: 'Word Builder',
    description: 'Build words, learn spelling!',
    icon: Target,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    points: 15
  },
  {
    id: 'math-race',
    title: 'Math Race',
    description: 'Race against time with numbers!',
    icon: Gamepad2,
    color: 'text-red-400',
    bgGradient: 'from-red-500/20 to-rose-500/20',
    points: 25
  },
  {
    id: 'science-explorer',
    title: 'Science Explorer',
    description: 'Discover amazing facts!',
    icon: Sparkles,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-teal-500/20',
    points: 20
  }
]

const achievements = [
  { icon: Star, title: 'First Steps', desc: 'Complete 1 quiz', unlocked: true },
  { icon: Trophy, title: 'Quiz Champion', desc: 'Score 100 points', unlocked: true },
  { icon: Medal, title: 'Brain Master', desc: 'Solve 10 puzzles', unlocked: false },
  { icon: Crown, title: 'Super Star', desc: 'Earn 500 stars', unlocked: false },
]

export function KidsDashboard() {
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const [streak] = useState(5)

  const [bank, setBank] = useState<Question[]>([])

  const { currentKid, logout, getKidStats } = useKidsStore()

  // Use kids profile grade if logged in
  const gradeLabel = currentKid?.grade || profile?.grade || 'Grade 1'
  
  const gradeKey = useMemo(() => {
    const g = (currentKid?.grade || profile?.grade || '').trim()
    if (!g) return 'grade1'
    if (g.toUpperCase() === 'LKG') return 'lkg'
    if (g.toUpperCase() === 'UKG') return 'ukg'
    const m = g.match(/Grade\s+(\d+)/i)
    if (m) return `grade${m[1]}`
    return 'grade1'
  }, [currentKid?.grade, profile?.grade])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/kids_questions.json', { cache: 'no-store' })
        const data = (await res.json()) as QuestionsData
        setBank(Array.isArray(data.questions) ? data.questions : [])
      } catch {
        setBank([])
      }
    }
    load()
  }, [])

  const startKidsQuiz = (gameId: string) => {
    const byGrade = bank.filter((q) => (q.yearGroup || '').toLowerCase() === gradeKey)
    if (byGrade.length === 0) {
      navigate('/quiz', { state: { questions: [] } })
      return
    }

    // Light mapping from game cards to topics
    const topicMap: Record<string, string[]> = {
      'quick-quiz': ['colors', 'shapes', 'counting', 'addition', 'subtraction'],
      'puzzle-solve': ['shapes', 'fractions', 'algebra'],
      'memory-match': ['alphabet', 'phonics', 'spelling'],
      'word-builder': ['spelling', 'grammar', 'alphabet', 'phonics'],
      'math-race': ['counting', 'addition', 'subtraction', 'multiplication', 'fractions', 'algebra'],
      'science-explorer': ['animals', 'forces', 'biology']
    }

    const allowed = topicMap[gameId]
    const filtered = allowed
      ? byGrade.filter((q) => allowed.includes((q.topic || '').toLowerCase()))
      : byGrade

    const selection = (filtered.length > 0 ? filtered : byGrade).slice(0, 10)
    navigate('/quiz', { state: { questions: selection } })
  }

  const stats = currentKid ? getKidStats(currentKid.id) : { totalStars: 0, totalSessions: 0, bestStreak: 0 }

  // Show login if not authenticated
  if (!currentKid) {
    return <KidsLogin onLogin={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header with Stars & Streak */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 text-3xl">
            {currentKid!.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hi {currentKid!.name}!</h1>
            <p className="text-xs text-purple-200">{gradeLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-400">{stats.totalStars}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-500/30">
            <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-bold text-orange-400">{stats.bestStreak > 0 ? stats.bestStreak : streak}</span>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      <div className="relative p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-300">Daily Challenge!</h3>
            <p className="text-xs text-emerald-200/70">Complete 3 quizzes today</p>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-emerald-300">2/3</div>
            <div className="text-xs text-emerald-400 font-bold">+50⭐</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-400" />
          Play & Learn
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <button
                key={game.id}
                onClick={() => startKidsQuiz(game.id)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${game.bgGradient} border border-white/10 hover:border-white/30 transition-all group text-left`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center`}>
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

      {/* Learning Path */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          Your Journey
        </h2>
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-300">Level 3: Math Explorer</span>
            <span className="text-xs text-purple-400 font-bold">450/500 XP</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
            <div className="h-full w-11/12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`aspect-square rounded-xl flex items-center justify-center ${
                  level <= 3
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-slate-700/50 border border-slate-600'
                }`}
              >
                {level <= 3 ? (
                  <Star className="w-4 h-4 text-white fill-white" />
                ) : (
                  <span className="text-xs text-slate-500">{level}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-amber-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach, i) => {
            const Icon = ach.icon
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  ach.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-2 ${
                    ach.unlocked ? 'text-amber-400' : 'text-slate-600'
                  }`}
                />
                <h4
                  className={`text-sm font-bold ${
                    ach.unlocked ? 'text-amber-300' : 'text-slate-500'
                  }`}
                >
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-500">{ach.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Practice Button */}
      <button
        onClick={() => navigate('/papers')}
        className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
      >
        Start Learning Adventure!
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}
