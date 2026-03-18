import { useNavigate } from 'react-router-dom'
import { Gamepad2, Puzzle, Brain, Grid3X3, Zap, ArrowRight } from 'lucide-react'

export function KidsQuickPlay() {
  const navigate = useNavigate()

  const tiles: Array<{ title: string; description: string; icon: any; onClick: () => void }> = [
    {
      title: 'Word Search',
      description: 'Find the words fast!',
      icon: SearchIcon,
      onClick: () => navigate('/game/word-search')
    },
    {
      title: 'Crossword',
      description: 'Fill the missing words',
      icon: Puzzle,
      onClick: () => navigate('/game/crossword')
    },
    {
      title: 'Memory',
      description: 'Match the pairs',
      icon: Brain,
      onClick: () => navigate('/game/memory')
    },
    {
      title: 'Find Odd',
      description: 'Spot what is different',
      icon: Grid3X3,
      onClick: () => navigate('/game/find-odd')
    },
    {
      title: 'Which One Can',
      description: 'Pick the correct one',
      icon: Zap,
      onClick: () => navigate('/game/which-can')
    },
    {
      title: 'Quiz',
      description: 'Quick questions',
      icon: Gamepad2,
      onClick: () => navigate('/quiz')
    }
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Kids Quick Play</h2>
          <p className="text-sm text-slate-400">Pick a game to start</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.title}
              onClick={t.onClick}
              className="w-full p-4 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-slate-400">{t.description}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SearchIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
