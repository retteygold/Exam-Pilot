import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Target, Award, FileText, ArrowRight, Beaker } from 'lucide-react'
import { useExamStore } from '../store/examStore'

export function Home() {
  const navigate = useNavigate()
  const { getScore } = useExamStore()

  const stats = getScore()

  return (
    <div className="p-4 space-y-4">
      {/* Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700">
        <h2 className="text-2xl font-bold mb-2">GCSE Exam Prep</h2>
        <p className="text-blue-100 mb-4">Practice with real Cambridge past papers. Grade 8-10 ready.</p>
        <button
          onClick={() => navigate('/papers')}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          Start Practicing <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-slate-800 rounded-xl">
          <Target className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl font-bold">{stats.percentage}%</div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl">
          <Award className="w-5 h-5 text-amber-400 mb-2" />
          <div className="text-2xl font-bold">{stats.correct}</div>
          <div className="text-xs text-slate-400">Correct</div>
        </div>
      </div>

      {/* Modes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose Your Mode</h3>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/papers')}
            className="w-full p-4 bg-slate-800 rounded-xl flex items-center gap-4 hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Practice Mode</div>
              <div className="text-sm text-slate-400">Study at your own pace, no time limit</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => navigate('/papers')}
            className="w-full p-4 bg-slate-800 rounded-xl flex items-center gap-4 hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Exam Mode</div>
              <div className="text-sm text-slate-400">Timed practice like real exam conditions</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Subjects</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-800 rounded-xl">
            <FileText className="w-5 h-5 text-blue-400 mb-2" />
            <div className="font-semibold">Accounting</div>
            <div className="text-xs text-slate-400">7707 - O Level</div>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <Beaker className="w-5 h-5 text-green-400 mb-2" />
            <div className="font-semibold">Biology</div>
            <div className="text-xs text-slate-400">5090 - O Level</div>
          </div>
        </div>
      </div>
    </div>
  )
}
