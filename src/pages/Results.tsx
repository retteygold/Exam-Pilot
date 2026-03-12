import { useLocation, useNavigate } from 'react-router-dom'
import { Trophy, RotateCcw, Home } from 'lucide-react'

export function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { score, total, answered } = location.state || { score: 0, total: 0, answered: 0 }
  
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  
  let message = 'Keep practicing!'
  if (percentage >= 80) message = 'Excellent work!'
  else if (percentage >= 60) message = 'Good job!'
  else if (percentage >= 40) message = 'Getting there!'

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 text-center">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${
          percentage >= 60 ? 'text-amber-400' : 'text-slate-400'
        }`} />
        
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-slate-400 mb-6">{message}</p>
        
        <div className="text-6xl font-bold text-blue-500 mb-2">{percentage}%</div>
        <div className="text-slate-400 mb-6">{score} / {total} marks</div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-3 bg-slate-700 rounded-xl">
            <div className="text-2xl font-bold">{answered}</div>
            <div className="text-xs text-slate-400">Answered</div>
          </div>
          <div className="p-3 bg-slate-700 rounded-xl">
            <div className="text-2xl font-bold text-emerald-400">
              {Math.round((score / (total || 1)) * answered)}
            </div>
            <div className="text-xs text-slate-400">Correct</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
