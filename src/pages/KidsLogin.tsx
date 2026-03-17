import { useState } from 'react'
import { useKidsStore } from '../store/kidsStore'
import { UserPlus, LogIn, Sparkles } from 'lucide-react'

const AVATARS = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🦄', '🐙', '🦊', '🐰']
const GRADES = ['LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']

const COUNTRIES = [
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'UAE', flag: '🇦🇪' }
]

interface KidsLoginProps {
  onLogin: () => void
  onBack?: () => void
}

export function KidsLogin({ onLogin, onBack }: KidsLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [grade, setGrade] = useState('Grade 1')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [countryName, setCountryName] = useState(COUNTRIES[0].name)
  const [countryFlag, setCountryFlag] = useState(COUNTRIES[0].flag)
  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  const { login, register } = useKidsStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const profile = await login(name, secretCode)
    if (profile) {
      setSuccess(`Welcome back, ${profile.name}! 🎉`)
      setTimeout(() => onLogin(), 500)
    } else {
      setError('Wrong name or secret code! Try again.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (name.length < 2) {
      setError('Name must be at least 2 letters!')
      return
    }
    
    if (!/^\d{4}$/.test(secretCode)) {
      setError('Secret code must be exactly 4 numbers!')
      return
    }
    
    const profile = await register(name, secretCode, grade, avatar, countryName, countryFlag)
    if (profile) {
      setSuccess(`Account created! Welcome, ${profile.name}! 🎉`)
      setTimeout(() => onLogin(), 500)
    } else {
      setError('This name is already taken! Try a different name.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center relative">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-white transition-colors z-10"
        >
          ← Back
        </button>
      )}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegistering ? 'Create Account' : 'Welcome Back!'}
          </h1>
          <p className="text-purple-200">
            {isRegistering ? 'Join the fun learning adventure!' : 'Enter your name and secret code'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                maxLength={20}
              />
            </div>

            {/* Secret Code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secret Code (4 numbers)
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="****"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            {/* Registration Fields */}
            {isRegistering && (
              <>
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Country
                  </label>
                  <select
                    value={countryName}
                    onChange={(e) => {
                      const selected = COUNTRIES.find(c => c.name === e.target.value)
                      setCountryName(e.target.value)
                      setCountryFlag(selected?.flag || '🏳️')
                    }}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs text-slate-400">Selected: {countryFlag} {countryName}</div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Choose Your Avatar
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAvatar(a)}
                        className={`text-3xl p-2 rounded-xl transition-all ${
                          avatar === a
                            ? 'bg-purple-500/30 border-2 border-purple-500 scale-110'
                            : 'bg-slate-700 border-2 border-transparent hover:bg-slate-600'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all mt-6"
            >
              {isRegistering ? (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              ) : (
                <><LogIn className="w-5 h-5" /> Login</>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
              }}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              {isRegistering 
                ? 'Already have an account? Login here' 
                : 'New here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
