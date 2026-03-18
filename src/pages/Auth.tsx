import { useState } from 'react'
import { LogIn, User, ArrowRight } from 'lucide-react'
import { useUserStore } from '../store/userStore'

interface AuthProps {
  onSuccess?: () => void
}

export function Auth({ onSuccess }: AuthProps) {
  const [mode, setMode] = useState<'main' | 'email' | 'guest'>('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const setProfile = useUserStore((s) => s.setProfile)
  const setUserId = useUserStore((s) => s.setUserId)

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }
    
    // Simple local auth - create user ID from email
    const userId = `email_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`
    setUserId(userId)
    setProfile({
      gender: '',
      age: '',
      grade: 'Grade 1',
      skillLevel: 'Beginner',
      exam: ''
    })
    onSuccess?.()
  }

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    
    // Guest mode - no email needed
    const userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setUserId(userId)
    setProfile({
      gender: '',
      age: '',
      grade: 'Grade 1',
      skillLevel: 'Beginner',
      exam: ''
    })
    onSuccess?.()
  }

  if (mode === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
            <p className="text-blue-200">Enter your details</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all"
              >
                <LogIn className="w-6 h-6" />
                Continue
              </button>

              <button
                type="button"
                onClick={() => setMode('main')}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quick Start</h1>
            <p className="text-emerald-200">Just enter your name</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all"
              >
                <ArrowRight className="w-6 h-6" />
                Start Learning
              </button>

              <button
                type="button"
                onClick={() => setMode('main')}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Main screen with 2 options
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Exam Pilot</h1>
          <p className="text-purple-200">Learn and have fun!</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setMode('guest')}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl font-bold text-white text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/30"
          >
            <User className="w-7 h-7" />
            Continue Without Login
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-slate-400">or</span>
            </div>
          </div>

          <button
            onClick={() => setMode('email')}
            className="w-full py-5 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white text-xl flex items-center justify-center gap-3 transition-all border border-slate-600"
          >
            <LogIn className="w-7 h-7" />
            Login with Email
          </button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          No password required for quick start!
        </p>
      </div>
    </div>
  )
}
