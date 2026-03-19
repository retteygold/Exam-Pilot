import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { Star, Trophy, Zap, Target, Gamepad2, Puzzle, Brain, Sparkles, ArrowRight, Medal, Crown, LogOut, Search, Grid3X3, Eye, HelpCircle, Users } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'
import { useUserStore } from '../store/userStore'
import type { Question, QuestionsData } from '../types'
import { Auth } from './Auth'
import { QuizRaceGame } from '../games/QuizRaceGame'
import { SpeedChallengeGame } from '../games/SpeedChallengeGame'
import { KnowledgeBattleGame } from '../games/KnowledgeBattleGame'
import { SkillPathLevelGame } from '../games/SkillPathLevelGame'

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
    id: 'math-blaster',
    title: 'Math Blaster',
    description: 'Arcade math levels (100)!',
    icon: Gamepad2,
    color: 'text-red-300',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    points: 40
  },
  {
    id: 'times-table-tower',
    title: 'Times Table Tower',
    description: 'Master times tables (100)!',
    icon: Target,
    color: 'text-orange-300',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    points: 40
  },
  {
    id: 'spelling-sprint',
    title: 'Spelling Sprint',
    description: 'Speed spelling practice!',
    icon: Zap,
    color: 'text-emerald-300',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    points: 35
  },
  {
    id: 'phonics-pop',
    title: 'Phonics Pop',
    description: 'Sounds & letters fun!',
    icon: Sparkles,
    color: 'text-teal-200',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    points: 35
  },
  {
    id: 'grammar-builder',
    title: 'Grammar Builder',
    description: 'Build strong sentences!',
    icon: Puzzle,
    color: 'text-indigo-300',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    points: 35
  },
  {
    id: 'science-lab',
    title: 'Science Lab',
    description: 'Experiments & facts!',
    icon: Sparkles,
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-500/20 to-sky-500/20',
    points: 35
  },
  {
    id: 'flag-capital-match',
    title: 'Flag & Capital Match',
    description: 'Flags and capitals!',
    icon: Trophy,
    color: 'text-sky-200',
    bgGradient: 'from-sky-500/20 to-indigo-500/20',
    points: 35
  },
  {
    id: 'geography-map-tap',
    title: 'Geography Map Tap',
    description: 'Tap places on the map!',
    icon: Target,
    color: 'text-blue-300',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    points: 35
  },
  {
    id: 'pattern-detective',
    title: 'Pattern Detective',
    description: 'Find the next pattern!',
    icon: Eye,
    color: 'text-amber-300',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    points: 35
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Read & answer smart!',
    icon: Brain,
    color: 'text-purple-200',
    bgGradient: 'from-purple-500/20 to-fuchsia-500/20',
    points: 35
  },
  {
    id: 'revision-boss',
    title: 'Revision Boss',
    description: 'Boss battle quiz!',
    icon: Trophy,
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-500/20 to-amber-500/20',
    points: 45
  },
  {
    id: 'quiz-race',
    title: 'Quiz Race',
    description: 'Fast quiz with streak bonuses!',
    icon: Trophy,
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-yellow-500/20',
    points: 30
  },
  {
    id: 'speed-challenge',
    title: 'Speed Challenge',
    description: 'Answer quickly to score big!',
    icon: Zap,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-red-500/20',
    points: 35
  },
  {
    id: 'knowledge-battle',
    title: 'Knowledge Battle',
    description: 'Fight with your brain power!',
    icon: Brain,
    color: 'text-purple-300',
    bgGradient: 'from-purple-500/20 to-fuchsia-500/20',
    points: 40
  },
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
  },
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
    description: 'Solve word puzzles!',
    icon: Grid3X3,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    points: 20
  },
  {
    id: 'find-odd',
    title: 'Find Odd One',
    description: 'Spot the difference!',
    icon: Eye,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    points: 10
  },
  {
    id: 'which-can',
    title: 'Which One Can?',
    description: 'Pick what works!',
    icon: HelpCircle,
    color: 'text-violet-400',
    bgGradient: 'from-violet-500/20 to-fuchsia-500/20',
    points: 10
  }
]

const achievements = [
  { icon: Star, title: 'First Steps', desc: 'Complete 1 quiz', unlocked: true },
  { icon: Trophy, title: 'Quiz Champion', desc: 'Score 100 points', unlocked: true },
  { icon: Medal, title: 'Brain Master', desc: 'Solve 10 puzzles', unlocked: false },
  { icon: Crown, title: 'Super Star', desc: 'Earn 500 stars', unlocked: false },
]

export function KidsDashboard() {
  // Force unregister service worker to clear stale cache
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (const reg of regs) {
          console.log('[VERSION] Unregistering service worker to force update')
          reg.unregister()
        }
      })
    }
  }, [])
  const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const [streak] = useState(5)

  const [bank, setBank] = useState<Question[]>([])

  const [loginKey, setLoginKey] = useState(0)

  const {
    currentKid,
    kidsAuthReady,
    bootstrapKidsAuth,
    logout,
    getKidStats,
    recordSession,
    skillPath,
    setSkillPathMode,
    getSkillPathCurrentGameId,
    getGameProgress,
    getGameLeaderboard,
    getOverallLeaderboard,
    getGradeTopper
  } = useKidsStore()

  useEffect(() => {
    void bootstrapKidsAuth()
  }, [bootstrapKidsAuth])

  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [activeLevel, setActiveLevel] = useState<number>(1)
  const [leaderboardGameId, setLeaderboardGameId] = useState<string>('math-blaster')
  const [leaderboardRows, setLeaderboardRows] = useState<Array<{ kidName: string; kidAvatar: string; kidFlag?: string; bestScore: number }>>([])
  const [overallRows, setOverallRows] = useState<Array<{ kidName: string; kidAvatar: string; kidFlag?: string; overallScore: number }>>([])
  const [gradeTopper, setGradeTopper] = useState<{ kidName: string; kidAvatar: string; kidFlag?: string; overallScore: number } | null>(null)

  const handleGameComplete = async (score: number, stars: number) => {
    console.log('[DEBUG] handleGameComplete called - score:', score, 'stars:', stars, 'activeGame:', activeGame)
    if (currentKid && recordSession) {
      console.log('[DEBUG] Recording session for kid:', currentKid.id)
      try {
        await recordSession({
          gameType: activeGame || 'unknown',
          level: activeLevel,
          score,
          starsEarned: stars,
          correctAnswers: Math.floor(score / 10),
          totalQuestions: 10,
          durationSeconds: 120
        })
        console.log('[DEBUG] Session recorded successfully')
      } catch (error) {
        console.error('[DEBUG] Failed to record session:', error)
      }

      if (skillPath?.mode === 'skill_path_rotate') {
        const nextGameId = getSkillPathCurrentGameId()
        if (nextGameId) {
          const p = getGameProgress(nextGameId)
          const nextLevel = p?.highestLevelUnlocked ?? 1
          setActiveGame(nextGameId)
          setActiveLevel(nextLevel)
          setLeaderboardGameId(nextGameId)
          return
        }
      }
    } else {
      console.log('[DEBUG] Cannot record session - currentKid:', !!currentKid, 'recordSession:', !!recordSession)
    }
    setActiveGame(null)
  }
  const handleLogin = () => {
    setLoginKey(k => k + 1)
    navigate('/setup')
  }

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

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const rows = await getGameLeaderboard(leaderboardGameId, 10)
        setLeaderboardRows(rows.map(r => ({ kidName: r.kidName, kidAvatar: r.kidAvatar, kidFlag: r.kidFlag, bestScore: r.bestScore })))
      } catch {
        setLeaderboardRows([])
      }
    }
    loadLeaderboard()
  }, [getGameLeaderboard, leaderboardGameId])

  useEffect(() => {
    const loadOverall = async () => {
      try {
        const rows = await getOverallLeaderboard(10)
        setOverallRows(rows.map(r => ({ kidName: r.kidName, kidAvatar: r.kidAvatar, kidFlag: r.kidFlag, overallScore: r.overallScore })))
      } catch {
        setOverallRows([])
      }
    }
    loadOverall()
  }, [getOverallLeaderboard])

  useEffect(() => {
    const loadTopper = async () => {
      if (!currentKid?.grade) return
      try {
        const r = await getGradeTopper(currentKid.grade)
        if (!r) {
          setGradeTopper(null)
          return
        }
        setGradeTopper({ kidName: r.kidName, kidAvatar: r.kidAvatar, kidFlag: r.kidFlag, overallScore: r.overallScore })
      } catch {
        setGradeTopper(null)
      }
    }
    loadTopper()
  }, [currentKid?.grade, getGradeTopper])

  const startKidsQuiz = (gameId: string) => {
    // Handle new interactive games - navigate to full screen routes
    const interactiveGames: Record<string, string> = {
      'word-search': '/game/word-search',
      'crossword': '/game/crossword',
      'find-odd': '/game/find-odd',
      'which-can': '/game/which-can',
      'memory': '/game/memory',
      'memory-match': '/game/memory'
    }
    
    if (interactiveGames[gameId]) {
      navigate(interactiveGames[gameId])
      return
    }

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

    // Remove duplicates by question ID, then shuffle randomly
    const uniqueQuestions = (filtered.length > 0 ? filtered : byGrade)
    const seenIds = new Set<string>()
    const deduped = uniqueQuestions.filter((q) => {
      const key = (q.id && q.id.trim()) ? q.id : `${q.subject || ''}:${q.topic || ''}:${q.question || ''}`
      if (seenIds.has(key)) return false
      seenIds.add(key)
      return true
    })
    
    // Shuffle array randomly (Fisher-Yates)
    const shuffled = [...deduped]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const selection = shuffled.slice(0, 10)
    
    navigate('/quiz', { state: { questions: selection } })
  }

  const startGame = (gameId: string) => {
    if (gameId === 'quiz-race' || gameId === 'speed-challenge' || gameId === 'knowledge-battle') {
      setActiveGame(gameId)
      setActiveLevel(1)
      setLeaderboardGameId(gameId)
      return
    }
    if (
      gameId === 'math-blaster' ||
      gameId === 'times-table-tower' ||
      gameId === 'spelling-sprint' ||
      gameId === 'phonics-pop' ||
      gameId === 'grammar-builder' ||
      gameId === 'science-lab' ||
      gameId === 'flag-capital-match' ||
      gameId === 'geography-map-tap' ||
      gameId === 'pattern-detective' ||
      gameId === 'reading-comprehension' ||
      gameId === 'revision-boss'
    ) {
      const p = getGameProgress(gameId)
      const startLevel = p?.highestLevelUnlocked ?? 1
      setActiveLevel(startLevel)
      setActiveGame(gameId)
      setLeaderboardGameId(gameId)
      return
    }
    startKidsQuiz(gameId)
  }

  const stats = currentKid ? getKidStats(currentKid.id) : { totalStars: 0, totalSessions: 0, bestStreak: 0 }

  const sessions = useKidsStore((state) => state.sessions)

  // Debug logging
  useEffect(() => {
    console.log('[DEBUG] KidsDashboard - currentKid:', currentKid?.id, currentKid?.name)
    console.log('[DEBUG] KidsDashboard - sessions count:', sessions.length)
    console.log('[DEBUG] KidsDashboard - sessions for current kid:', sessions.filter(s => s.kidId === currentKid?.id).length)
  }, [currentKid, sessions])

  const kidXp = useMemo(() => {
    if (!currentKid) return 0
    const kidSessions = sessions.filter(s => s.kidId === currentKid.id)
    const total = kidSessions.reduce((sum, s) => sum + (s.score || 0), 0)
    console.log('[DEBUG] Calculating XP - kidId:', currentKid.id, 'sessions:', kidSessions.length, 'totalXP:', total)
    return total
  }, [currentKid, sessions])

  const xpPerLevel = 500
  const xpLevel = Math.max(1, Math.floor(kidXp / xpPerLevel) + 1)
  const xpInLevel = kidXp % xpPerLevel
  const xpProgressPct = Math.min(100, Math.round((xpInLevel / xpPerLevel) * 100))

  if (!kidsAuthReady) {
    if (debugKidsAuth) {
      console.log('[KidsAuth] KidsDashboard: waiting for kidsAuthReady', {
        hasFirebaseUser: !!auth.currentUser,
        uid: auth.currentUser?.uid,
        hasCurrentKid: !!currentKid
      })
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!currentKid) {
    if (debugKidsAuth) {
      console.log('[KidsAuth] KidsDashboard: currentKid is null -> rendering KidsLogin', {
        hasFirebaseUser: !!auth.currentUser,
        uid: auth.currentUser?.uid
      })
    }
    return <Auth onSuccess={handleLogin} key={loginKey} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Cache Clear Button - Force Reload */}
      <button
        onClick={() => {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
              regs.forEach(r => r.unregister())
            })
          }
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name))
          })
          window.location.reload(true)
        }}
        className="w-full mb-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm"
      >
        ⚠️ CLICK TO UPDATE - Load New Version ⚠️
      </button>

      {/* Header with Stars & Streak */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 text-3xl">
            {currentKid!.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hi {currentKid!.name}!</h1>
            <p className="text-xs text-purple-200">{gradeLabel} <span className="text-[10px] text-slate-400 ml-2">v2.1</span></p>
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
      <button
        type="button"
        onClick={() => {
          const target = skillPath?.mode === 'skill_path_rotate' ? (getSkillPathCurrentGameId() || 'math-blaster') : 'quick-quiz'
          startGame(target)
        }}
        className="relative w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-4 hover:border-emerald-400/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-300">Play Now</h3>
            <p className="text-xs text-emerald-200/70">
              {skillPath?.mode === 'skill_path_rotate' ? 'Skill Path (Rotate) - next game ready!' : 'Free Play - tap to start!'}
            </p>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-emerald-300">Tap</div>
            <div className="text-xs text-emerald-400 font-bold">Play Now</div>
          </div>
        </div>
      </button>

      {/* Online Challenge Section */}
      <div className="mb-2">
        <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Online Challenge
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            console.log('[DEBUG] Navigating to Friend Battle')
            navigate('/challenge?mode=friends')
          }}
          className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 border-2 border-yellow-400 hover:scale-105 transition-all text-left shadow-lg shadow-yellow-500/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-right flex-1">
              <span className="text-xs text-white/80 font-bold">BATTLE</span>
            </div>
          </div>
          <h3 className="font-bold text-white text-sm">Friend Battle</h3>
          <p className="text-xs text-white/80 mt-1">Invite & compete</p>
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('[DEBUG] Navigating to Random Match')
            navigate('/challenge?mode=random')
          }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400 hover:scale-105 transition-all text-left shadow-lg shadow-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-right flex-1">
              <span className="text-xs text-white/80 font-bold">QUICK</span>
            </div>
          </div>
          <h3 className="font-bold text-white text-sm">Random Match</h3>
          <p className="text-xs text-white/80 mt-1">Play vs stranger</p>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="text-white font-bold">Mode</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSkillPathMode('free')}
            className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${
              skillPath?.mode !== 'skill_path_rotate'
                ? 'bg-purple-500/30 border-purple-400 text-purple-100'
                : 'bg-slate-800/50 border-slate-700 text-slate-200 hover:border-slate-500'
            }`}
          >
            Free Play
          </button>
          <button
            type="button"
            onClick={() => setSkillPathMode('skill_path_rotate')}
            className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${
              skillPath?.mode === 'skill_path_rotate'
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100'
                : 'bg-slate-800/50 border-slate-700 text-slate-200 hover:border-slate-500'
            }`}
          >
            Skill Path (Rotate)
          </button>
        </div>
      </div>

      {activeGame === 'quiz-race' && (
        <QuizRaceGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />
      )}
      {activeGame === 'speed-challenge' && (
        <SpeedChallengeGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />
      )}
      {activeGame === 'knowledge-battle' && (
        <KnowledgeBattleGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />
      )}

      {activeGame &&
        (activeGame === 'math-blaster' ||
          activeGame === 'times-table-tower' ||
          activeGame === 'spelling-sprint' ||
          activeGame === 'phonics-pop' ||
          activeGame === 'grammar-builder' ||
          activeGame === 'science-lab' ||
          activeGame === 'flag-capital-match' ||
          activeGame === 'geography-map-tap' ||
          activeGame === 'pattern-detective' ||
          activeGame === 'reading-comprehension' ||
          activeGame === 'revision-boss') && (
          <SkillPathLevelGame
            config={
              activeGame === 'math-blaster'
                ? { id: 'math-blaster', title: 'Math Blaster', description: 'Arcade math levels', iconEmoji: '🚀', bgClassName: 'bg-gradient-to-br from-red-900 via-orange-900 to-slate-900', topics: ['counting', 'addition', 'subtraction', 'multiplication', 'fractions', 'algebra'] }
                : activeGame === 'times-table-tower'
                  ? { id: 'times-table-tower', title: 'Times Table Tower', description: 'Times tables', iconEmoji: '🏰', bgClassName: 'bg-gradient-to-br from-orange-900 via-amber-900 to-slate-900', topics: ['multiplication', 'counting', 'addition', 'subtraction'] }
                : activeGame === 'spelling-sprint'
                  ? { id: 'spelling-sprint', title: 'Spelling Sprint', description: 'Spelling practice', iconEmoji: '📝', bgClassName: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900', topics: ['spelling', 'alphabet', 'phonics'] }
                  : activeGame === 'phonics-pop'
                    ? { id: 'phonics-pop', title: 'Phonics Pop', description: 'Phonics', iconEmoji: '🎈', bgClassName: 'bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900', topics: ['phonics', 'alphabet', 'spelling'] }
                  : activeGame === 'grammar-builder'
                    ? { id: 'grammar-builder', title: 'Grammar Builder', description: 'Grammar levels', iconEmoji: '🧩', bgClassName: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900', topics: ['grammar'] }
                    : activeGame === 'science-lab'
                      ? { id: 'science-lab', title: 'Science Lab', description: 'Science facts', iconEmoji: '🧪', bgClassName: 'bg-gradient-to-br from-cyan-900 via-sky-900 to-slate-900', topics: ['animals', 'forces', 'biology'] }
                      : activeGame === 'flag-capital-match'
                        ? { id: 'flag-capital-match', title: 'Flag & Capital Match', description: 'Flags and capitals', iconEmoji: '🏳️', bgClassName: 'bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900', topics: ['geography'] }
                      : activeGame === 'geography-map-tap'
                        ? { id: 'geography-map-tap', title: 'Geography Map Tap', description: 'Geography practice', iconEmoji: '🗺️', bgClassName: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900', topics: ['geography'] }
                        : activeGame === 'pattern-detective'
                          ? { id: 'pattern-detective', title: 'Pattern Detective', description: 'Patterns', iconEmoji: '🕵️', bgClassName: 'bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900', topics: ['shapes', 'algebra', 'fractions'] }
                          : activeGame === 'reading-comprehension'
                            ? { id: 'reading-comprehension', title: 'Reading Comprehension', description: 'Reading practice', iconEmoji: '📚', bgClassName: 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-slate-900', topics: ['grammar', 'alphabet'] }
                            : { id: 'revision-boss', title: 'Revision Boss', description: 'Boss battle revision', iconEmoji: '👑', bgClassName: 'bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900', topics: ['counting', 'addition', 'subtraction', 'spelling', 'grammar', 'animals'] }
            }
            questions={bank}
            gradeKey={gradeKey}
            level={activeLevel}
            onComplete={handleGameComplete}
            onExit={() => setActiveGame(null)}
          />
        )}

      {!activeGame && (
        <>
          {/* Leaderboard */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Leaderboard
            </h2>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-200 font-bold">{games.find(g => g.id === leaderboardGameId)?.title || 'Game'}</div>
                <select
                  value={leaderboardGameId}
                  onChange={(e) => setLeaderboardGameId(e.target.value)}
                  className="bg-slate-900/60 text-slate-200 text-sm rounded-xl px-3 py-2 border border-slate-700"
                >
                  {games.slice(0, 11).map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                {leaderboardRows.length === 0 && (
                  <div className="text-sm text-slate-400">No scores yet. Be the first!</div>
                )}
                {leaderboardRows.slice(0, 5).map((r, idx) => (
                  <div key={`${r.kidName}-${idx}`} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-3 py-2 border border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">{r.kidAvatar}</div>
                      <div className="text-sm text-white font-semibold">
                        {idx + 1}. {r.kidFlag ? `${r.kidFlag} ` : ''}{r.kidName}
                      </div>
                    </div>
                    <div className="text-sm text-yellow-300 font-bold">{r.bestScore}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Leaderboard */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Overall Champions
            </h2>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="space-y-2">
                {overallRows.length === 0 && (
                  <div className="text-sm text-slate-400">No overall scores yet.</div>
                )}
                {overallRows.slice(0, 5).map((r, idx) => (
                  <div key={`${r.kidName}-${idx}`} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-3 py-2 border border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">{r.kidAvatar}</div>
                      <div className="text-sm text-white font-semibold">
                        {idx + 1}. {r.kidFlag ? `${r.kidFlag} ` : ''}{r.kidName}
                      </div>
                    </div>
                    <div className="text-sm text-amber-300 font-bold">{r.overallScore}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Topper */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-emerald-300" />
              Grade Topper
            </h2>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              {!gradeTopper ? (
                <div className="text-sm text-slate-400">No topper yet for {currentKid.grade}.</div>
              ) : (
                <div className="flex items-center justify-between bg-slate-900/40 rounded-xl px-3 py-3 border border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">{gradeTopper.kidAvatar}</div>
                    <div>
                      <div className="text-sm text-white font-bold">{gradeTopper.kidFlag ? `${gradeTopper.kidFlag} ` : ''}{gradeTopper.kidName}</div>
                      <div className="text-xs text-slate-400">{currentKid.grade}</div>
                    </div>
                  </div>
                  <div className="text-sm text-emerald-300 font-bold">{gradeTopper.overallScore}</div>
                </div>
              )}
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
                    onClick={() => startGame(game.id)}
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
                <span className="text-sm text-slate-300">Level {xpLevel}</span>
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
                    <Icon className={`w-6 h-6 mb-2 ${ach.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                    <h4 className={`text-sm font-bold ${ach.unlocked ? 'text-amber-300' : 'text-slate-500'}`}>
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
            onClick={() => startKidsQuiz('quick-quiz')}
            className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg"
          >
            Play Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}
