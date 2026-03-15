import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Calendar, GraduationCap, Target, BookOpen, ArrowRight } from 'lucide-react'
import { useUserStore } from '../store/userStore'

export function ProfileSetup() {
  const navigate = useNavigate()
  const setProfile = useUserStore((state) => state.setProfile)
  
  const [step, setStep] = useState(1)
  const [profile, setProfileState] = useState({
    gender: '',
    age: '',
    grade: '',
    skillLevel: '' as '' | 'Beginner' | 'Intermediate' | 'Advanced',
    exam: ''
  })

  const updateField = (field: string, value: string) => {
    setProfileState(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
    else {
      setProfile(profile)
      navigate('/')
    }
  }

  const isStepComplete = () => {
    switch (step) {
      case 1: return profile.gender !== ''
      case 2: return profile.age !== ''
      case 3: return profile.grade !== ''
      case 4: return profile.skillLevel !== ''
      case 5: return profile.exam !== ''
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Profile Setup</h1>
          <span className="text-sm text-slate-400">Step {step} of 5</span>
        </div>
        <div className="mt-2 h-2 bg-slate-700 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h2 className="text-xl font-bold">What's your gender?</h2>
              <p className="text-slate-400 text-sm">This helps us personalize your experience</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateField('gender', option)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    profile.gender === option
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h2 className="text-xl font-bold">How old are you?</h2>
              <p className="text-slate-400 text-sm">We'll adjust the difficulty accordingly</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['12-13', '14-15', '16-17', '18+'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateField('age', option)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    profile.age === option
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  {option} years
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h2 className="text-xl font-bold">What grade are you in?</h2>
              <p className="text-slate-400 text-sm">We'll select questions appropriate for your level</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Grade 8', 'Grade 9', 'Grade 10'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateField('grade', option)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    profile.grade === option
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h2 className="text-xl font-bold">What's your skill level?</h2>
              <p className="text-slate-400 text-sm">Be honest - we'll tailor questions to help you improve</p>
            </div>
            <div className="space-y-3">
              {[
                { level: 'Beginner', desc: 'Just starting out' },
                { level: 'Intermediate', desc: 'Some knowledge, need practice' },
                { level: 'Advanced', desc: 'Confident, preparing for exam' }
              ].map(({ level, desc }) => (
                <button
                  key={level}
                  onClick={() => updateField('skillLevel', level)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    profile.skillLevel === level
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold">{level}</div>
                  <div className="text-sm text-slate-400">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <h2 className="text-xl font-bold">Which exam are you preparing for?</h2>
              <p className="text-slate-400 text-sm">We'll show you relevant past papers</p>
            </div>
            <div className="space-y-3">
              {[
                { code: '7707', name: 'Accounting', level: 'O-Level' },
                { code: '7708', name: 'Business Studies', level: 'O-Level' },
                { code: '4024', name: 'Mathematics', level: 'O-Level' },
                { code: '5054', name: 'Physics', level: 'O-Level' }
              ].map(({ code, name, level }) => (
                <button
                  key={code}
                  onClick={() => updateField('exam', code)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    profile.exam === code
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-slate-400">{code} • {level}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <button
          onClick={nextStep}
          disabled={!isStepComplete()}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {step === 5 ? 'Complete Setup' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
