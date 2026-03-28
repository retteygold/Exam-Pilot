import { useNavigate } from 'react-router-dom'
import { BookOpen, Target, Award, ArrowRight, GraduationCap, Clock, TrendingUp, BarChart3, Play, RotateCcw, ChevronRight, Flame, CheckCircle2, AlertCircle } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { useUserStore } from '../store/userStore'
import { useState, useEffect } from 'react'

// Subject metadata matching PaperSelect.tsx
const SUBJECT_META: Record<string, { name: string; code: string; color: string; icon: string; level: 'igcse' | 'ial' }> = {
  // IGCSE (O Level)
  igcse_biology: { name: 'Biology', code: '0610', color: 'from-green-500 to-emerald-600', icon: '🧬', level: 'igcse' },
  igcse_chemistry: { name: 'Chemistry', code: '0620', color: 'from-teal-500 to-cyan-600', icon: '⚗️', level: 'igcse' },
  igcse_physics: { name: 'Physics', code: '0625', color: 'from-cyan-500 to-blue-600', icon: '⚛️', level: 'igcse' },
  igcse_mathematics: { name: 'Mathematics', code: '0580', color: 'from-indigo-500 to-purple-600', icon: '📐', level: 'igcse' },
  igcse_accounting: { name: 'Accounting', code: '0452', color: 'from-blue-500 to-indigo-600', icon: '📊', level: 'igcse' },
  igcse_economics: { name: 'Economics', code: '0455', color: 'from-amber-500 to-orange-600', icon: '📈', level: 'igcse' },
  igcse_business_studies: { name: 'Business Studies', code: '0450', color: 'from-violet-500 to-purple-600', icon: '💼', level: 'igcse' },
  igcse_computer_science: { name: 'Computer Science', code: '0478', color: 'from-violet-500 to-fuchsia-600', icon: '💻', level: 'igcse' },
  igcse_english_first: { name: 'English (First)', code: '0500', color: 'from-rose-500 to-pink-600', icon: '📖', level: 'igcse' },
  igcse_english_second: { name: 'English (Second)', code: '0510', color: 'from-pink-500 to-rose-600', icon: '🗣️', level: 'igcse' },
  igcse_travel_tourism: { name: 'Travel & Tourism', code: '0471', color: 'from-fuchsia-500 to-pink-600', icon: '✈️', level: 'igcse' },
  // IAL (A Level)
  ial_biology: { name: 'Biology', code: 'WBI11', color: 'from-green-500 to-emerald-600', icon: '🧬', level: 'ial' },
  ial_chemistry: { name: 'Chemistry', code: 'WCH11', color: 'from-teal-500 to-cyan-600', icon: '⚗️', level: 'ial' },
  ial_physics: { name: 'Physics', code: 'WPH11', color: 'from-cyan-500 to-blue-600', icon: '⚛️', level: 'ial' },
  ial_mathematics: { name: 'Mathematics', code: 'WMA11', color: 'from-indigo-500 to-purple-600', icon: '📐', level: 'ial' },
  ial_accounting: { name: 'Accounting', code: 'WAC11', color: 'from-blue-500 to-indigo-600', icon: '📊', level: 'ial' },
  ial_economics: { name: 'Economics', code: 'WEC11', color: 'from-amber-500 to-orange-600', icon: '📈', level: 'ial' },
  ial_business: { name: 'Business', code: 'WBS11', color: 'from-violet-500 to-purple-600', icon: '💼', level: 'ial' },
  cambridge_ial_travel_tourism: { name: 'Travel & Tourism', code: '9395', color: 'from-fuchsia-500 to-pink-600', icon: '✈️', level: 'ial' },
  cambridge_ial_computer_science: { name: 'Computer Science', code: '9618', color: 'from-violet-500 to-fuchsia-600', icon: '💻', level: 'ial' },
}

interface RecentPaper {
  id: string
  subject: string
  year: number
  session: string
  paper: string
  completedAt: string
  score: number
  total: number
}

export function Home() {
  const navigate = useNavigate()
  const { getScore, completedPapers } = useExamStore()
  const profile = useUserStore((s) => s.profile)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'igcse' | 'ial'>('all')
  const [recentPapers, setRecentPapers] = useState<RecentPaper[]>([])

  const stats = getScore()

  // Load recent papers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('exam-storage')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.state?.completedPapers) {
          // Mock recent papers for now - in real app would come from Firebase
          setRecentPapers([
            {
              id: 'igcse_biology_2023_june_11',
              subject: 'igcse_biology',
              year: 2023,
              session: 'June',
              paper: '11',
              completedAt: new Date().toISOString(),
              score: 18,
              total: 25
            }
          ])
        }
      } catch {
        // ignore
      }
    }
  }, [])

  // Filter subjects based on selected level
  const filteredSubjects = Object.entries(SUBJECT_META).filter(([_, meta]) => {
    if (selectedLevel === 'all') return true
    return meta.level === selectedLevel
  })

  // Calculate progress for each subject
  const getSubjectProgress = (_subjectKey: string) => {
    // Mock progress - in real app would calculate from completed papers
    return Math.floor(Math.random() * 60) + 20
  }

  return (
    <div className="min-h-full bg-slate-950">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-b border-slate-800">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Exam Pilot</h1>
                <p className="text-sm text-slate-400">Cambridge & Edexcel Past Papers</p>
              </div>
            </div>
            {profile?.name && (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {profile.name[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{profile.name}</p>
                  <p className="text-xs text-slate-400">{profile.grade}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.percentage}%</div>
              <div className="text-xs text-emerald-400 mt-1">+5% this week</div>
            </div>

            <div className="p-4 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{completedPapers.length}</div>
              <div className="text-xs text-blue-400 mt-1">papers done</div>
            </div>

            <div className="p-4 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Streak</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.total > 0 ? Math.min(Math.floor(stats.total / 10), 30) : 0}</div>
              <div className="text-xs text-amber-400 mt-1">day streak</div>
            </div>

            <div className="p-4 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Time</span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.floor(stats.total * 1.5)}m</div>
              <div className="text-xs text-purple-400 mt-1">total practice</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Quick Action - Continue or Start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/papers')}
            className="group relative overflow-hidden p-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Start Practice</h3>
                  <p className="text-sm text-blue-200">Choose your exam and subject</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <span>O Level & A Level papers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/stats')}
            className="group p-5 bg-slate-800 rounded-2xl text-left border border-slate-700 transition-all hover:bg-slate-750 hover:border-slate-600"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">View Progress</h3>
                <p className="text-sm text-slate-400">Track your performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Detailed analytics</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Level Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Select Exam Level</h2>
            <div className="flex gap-1 p-1 bg-slate-800 rounded-lg">
              {(['all', 'igcse', 'ial'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {level === 'all' ? 'All' : level === 'igcse' ? 'O Level' : 'A Level'}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSubjects.map(([key, meta]) => {
              const progress = getSubjectProgress(key)
              return (
                <button
                  key={key}
                  onClick={() => navigate('/papers')}
                  className="group relative p-4 bg-slate-800 rounded-2xl border border-slate-700 text-left transition-all hover:border-slate-600 hover:bg-slate-750"
                >
                  {/* Progress Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700 rounded-t-2xl overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${meta.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      meta.level === 'igcse'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {meta.level === 'igcse' ? 'O Level' : 'A Level'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm mb-1">{meta.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">{meta.code}</span>
                    <span className="text-xs text-slate-400">{progress}%</span>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {recentPapers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <button
                onClick={() => navigate('/stats')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {recentPapers.map((paper) => {
                const meta = SUBJECT_META[paper.subject]
                const percentage = Math.round((paper.score / paper.total) * 100)
                return (
                  <div
                    key={paper.id}
                    className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta?.color || 'from-slate-600 to-slate-700'} flex items-center justify-center text-xl`}>
                      {meta?.icon || '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {meta?.name || paper.subject} {meta?.code}
                      </h4>
                      <p className="text-sm text-slate-400">
                        Paper {paper.paper} • {paper.session} {paper.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        percentage >= 70 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {percentage}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {paper.score}/{paper.total}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/papers')}
                      className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-200 mb-1">Exam Tip</h3>
              <p className="text-sm text-amber-100/80">
                Practice under timed conditions to simulate real exam pressure. Start with past papers from 3-4 years ago and work towards recent ones.
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <BookOpen className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">O Level (IGCSE)</h3>
            <p className="text-sm text-slate-400">Cambridge IGCSE subjects for grades 9-11</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <TrendingUp className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">A Level (IAL)</h3>
            <p className="text-sm text-slate-400">Edexcel & Cambridge for grades 11-13</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <Award className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Verified Answers</h3>
            <p className="text-sm text-slate-400">All answers checked against mark schemes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
