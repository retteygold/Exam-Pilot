import { useNavigate } from 'react-router-dom'
import { BookOpen, Target, Award, ArrowRight, GraduationCap } from 'lucide-react'
import { useExamStore } from '../store/examStore'

export function Home() {
  const navigate = useNavigate()
  const { getScore } = useExamStore()

  const stats = getScore()

  return (
    <div className="p-4 space-y-6">
      {/* Logo Header */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Exam Pilot
            </h1>
            <p className="text-xs text-slate-400">Cambridge Past Papers</p>
          </div>
        </div>
      </div>

      {/* Hero with Storyset Image */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 opacity-20">
          <img 
            src="/storyset/Researchers-amico.svg" 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Master Your Exams</h2>
          <p className="text-blue-100 mb-4 text-sm">Practice with real Cambridge IGCSE & O-Level past papers</p>
          <button
            onClick={() => navigate('/papers')}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Practicing <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-slate-800 rounded-2xl text-center">
          <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-xl font-bold">{stats.percentage}%</div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-2xl text-center">
          <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-xl font-bold">{stats.correct}</div>
          <div className="text-xs text-slate-400">Correct</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-2xl text-center">
          <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-400">Attempted</div>
        </div>
      </div>

      {/* Practice Modes with Images */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose Mode</h3>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/papers')}
            className="w-full p-4 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 transition-colors text-left group"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-blue-500/20 transition-colors">
              <img 
                src="/storyset/Online Doctor-pana.svg" 
                alt="Practice" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Practice Mode</div>
              <div className="text-sm text-slate-400">Study at your own pace with hints</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/papers')}
            className="w-full p-4 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 transition-colors text-left group"
          >
            <div className="w-20 h-20 bg-amber-500/10 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-amber-500/20 transition-colors">
              <img 
                src="/storyset/Doctors-pana.svg" 
                alt="Exam" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Exam Mode</div>
              <div className="text-sm text-slate-400">Timed practice like real exam</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Subjects</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigate('/papers')}
            className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="/storyset/Medical care-amico.svg" 
                alt="Accounting" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="font-semibold text-sm">Accounting</div>
            <div className="text-[10px] text-slate-400">7707 O-Level</div>
          </button>
          
          <button 
            onClick={() => navigate('/papers')}
            className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="/storyset/Stem-cell research-amico.svg" 
                alt="Biology" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="font-semibold text-sm">Biology</div>
            <div className="text-[10px] text-slate-400">5090 O-Level</div>
          </button>
          
          <button 
            onClick={() => navigate('/papers')}
            className="p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="/storyset/Researchers-pana.svg" 
                alt="IGCSE Bio" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="font-semibold text-sm">Biology</div>
            <div className="text-[10px] text-slate-400">0610 IGCSE</div>
          </button>
        </div>
      </div>
    </div>
  )
}
