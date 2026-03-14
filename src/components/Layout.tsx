import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Home, ChevronLeft, FileText, Code } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [stats, setStats] = useState({ answered: 0, correct: 0, streak: 0 })
  
  useEffect(() => {
    const saved = localStorage.getItem('gcse-prep-progress')
    if (saved) {
      const progress = JSON.parse(saved)
      const entries = Object.values(progress) as { correct: boolean; timestamp: number }[]
      const answered = entries.length
      const correct = entries.filter(e => e.correct).length
      
      let streak = 0
      const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp)
      for (const entry of sorted) {
        if (entry.correct) streak++
        else break
      }
      
      setStats({ answered, correct, streak })
    }
  }, [location.pathname])

  const showBack = location.pathname !== '/'
  const isHome = location.pathname === '/'

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-700 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Exam Pilot" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-bold">Exam Pilot</h1>
              <p className="text-xs text-slate-400">Navigate to top grades</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>{stats.answered} answered</span>
          <span className="text-emerald-400">{stats.correct} correct</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around px-4 py-2 bg-slate-800 border-t border-slate-700 shrink-0">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isHome ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link 
          to="/papers" 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            location.pathname === '/papers' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">Papers</span>
        </Link>
        
        <Link 
          to="/stats" 
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            location.pathname === '/stats' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Stats</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="px-4 py-3 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Code className="w-3 h-3" />
          <span>Retts Web Dev</span>
          <span className="text-slate-600">|</span>
          <span>Since 2016</span>
        </div>
      </footer>
    </div>
  )
}
