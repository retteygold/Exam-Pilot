import { useEffect, useState } from 'react'
import { BarChart, Target, Zap, Calendar, Trash2 } from 'lucide-react'

export function Stats() {
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
    correct: 0,
    streak: 0,
    byTopic: {} as Record<string, { correct: number; total: number }>
  })

  useEffect(() => {
    const saved = localStorage.getItem('gcse-prep-progress')
    if (saved) {
      const progress = JSON.parse(saved)
      const entries = Object.entries(progress) as [string, { correct: boolean; timestamp: number }][]
      const correct = entries.filter(([, e]) => e.correct).length
      
      let streak = 0
      const sorted = [...entries].sort((a, b) => b[1].timestamp - a[1].timestamp)
      for (const [, entry] of sorted) {
        if (entry.correct) streak++
        else break
      }

      setStats({
        total: 381,
        answered: entries.length,
        correct,
        streak,
        byTopic: {}
      })
    }
  }, [])

  const clearProgress = () => {
    localStorage.removeItem('gcse-prep-progress')
    setStats({ total: 381, answered: 0, correct: 0, streak: 0, byTopic: {} })
  }

  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Your Progress</h2>
      
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-slate-800 rounded-xl">
          <BarChart className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold">{accuracy}%</div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl">
          <Target className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl font-bold">{stats.correct}</div>
          <div className="text-xs text-slate-400">Correct</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl">
          <Zap className="w-5 h-5 text-amber-400 mb-2" />
          <div className="text-2xl font-bold">{stats.streak}</div>
          <div className="text-xs text-slate-400">Streak</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl">
          <Calendar className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl font-bold">{stats.answered}</div>
          <div className="text-xs text-slate-400">Answered</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-slate-800 rounded-xl">
        <div className="flex justify-between text-sm mb-2">
          <span>Overall Progress</span>
          <span>{stats.answered} / {stats.total}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${(stats.answered / stats.total) * 100}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-2">
          {Math.round((stats.answered / stats.total) * 100)}% complete
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={clearProgress}
        className="w-full p-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Clear All Progress
      </button>
    </div>
  )
}
