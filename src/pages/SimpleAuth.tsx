import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, GraduationCap } from 'lucide-react'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useUserStore } from '../store/userStore'

const grades = ['LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

export function SimpleAuth() {
  const navigate = useNavigate()
  const setProfile = useUserStore((s) => s.setProfile)
  const [name, setName] = useState('')
  const [step, setStep] = useState<'name' | 'grade'>('name')

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      setStep('grade')
    }
  }

  const handleGradeSelect = async (grade: string) => {
    try {
      await signInAnonymously(auth)
      await setProfile({
        name: name.trim(),
        gender: '',
        age: '',
        grade,
        skillLevel: 'Beginner',
        exam: ''
      })
      navigate('/')
    } catch (e) {
      // If auth fails, do not navigate
      console.error(e)
    }
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Exam Pilot</h1>
            <p className="text-purple-200">What's your name?</p>
          </div>

          <form onSubmit={handleNameSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700">
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-lg text-center"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 rounded-2xl font-bold text-white text-lg transition-all"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hi {name}!</h1>
          <p className="text-emerald-200">Pick your grade</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700">
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeSelect(grade)}
                className="p-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors border border-slate-600 hover:border-slate-500"
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
