import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Zap, Medal, Crown, BookOpen } from 'lucide-react'
import { useUserStore } from '../store/userStore'

const quotes = [
  'Every expert was once a beginner. Start your journey today!',
  'Success is the sum of small efforts, repeated daily.',
  'Your future is created by what you do today, not tomorrow.',
  'Believe you can and you are halfway there!',
  'The secret to getting ahead is getting started.'
]

const rewards = [
  { step: 1, icon: Star, title: 'Profile Starter', color: 'text-yellow-400' },
  { step: 2, icon: Medal, title: 'Age Revealed', color: 'text-amber-400' },
  { step: 3, icon: Zap, title: 'Grade Master', color: 'text-blue-400' },
  { step: 4, icon: Star, title: 'Skill Seeker', color: 'text-purple-400' },
  { step: 5, icon: Crown, title: 'Exam Champion', color: 'text-emerald-400' }
]

const availableSubjects = [
  { id: 'o_level_biology', name: 'O-Level Biology (5090)', grades: ['Grade 9', 'Grade 10'], icon: '🧬' },
  { id: 'igcse_biology', name: 'IGCSE Biology (0610)', grades: ['Grade 9', 'Grade 10', 'Grade 11'], icon: '🧫' },
  { id: 'o_level_accounting', name: 'O-Level Accounting (7707)', grades: ['Grade 11', 'Grade 12'], icon: '📊' },
  { id: 'as_biology', name: 'AS Biology (WBI11)', grades: ['Grade 12'], icon: '🧬' },
  { id: 'as_mathematics', name: 'AS Mathematics (9709)', grades: ['Grade 12'], icon: '📐' },
  { id: 'as_physics', name: 'AS Physics (9702)', grades: ['Grade 12'], icon: '⚛️' },
  { id: 'as_economics', name: 'AS Economics (9708)', grades: ['Grade 12'], icon: '📈' },
]

const ageOptions = ['13-14', '15-16', '17-18', '19+']

const images = [
  '/storyset/Researchers-amico.svg',
  '/storyset/Online Doctor-pana.svg',
  '/storyset/Doctors-pana.svg',
  '/storyset/Medical care-amico.svg',
  '/storyset/Health professional team-amico.svg'
]

export function ProfileSetup() {
  const navigate = useNavigate()
  const setProfile = useUserStore((state) => state.setProfile)
  const [step, setStep] = useState(1)
  const [profile, setProfileState] = useState({
    gender: '', age: '', grade: '', skillLevel: '' as any, exam: ''
  })

  const updateField = (field: string, value: string) => {
    setProfileState(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
    else { setProfile(profile); navigate('/') }
  }

  const isComplete = () => {
    switch (step) {
      case 1: return profile.gender !== ''
      case 2: return profile.age !== ''
      case 3: return profile.grade !== ''
      case 4: return profile.skillLevel !== ''
      case 5: return profile.exam !== ''
      default: return false
    }
  }

  const quote = quotes[step - 1]
  const reward = rewards[step - 1]
  const Icon = reward?.icon || Star

  return (
    <div className='min-h-screen bg-slate-900 flex flex-col'>
      <div className='p-4 bg-slate-800 border-b border-slate-700'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <span className='text-sm font-bold'>E</span>
            </div>
            <span className='font-semibold'>Exam Pilot</span>
          </div>
          <div className='flex items-center gap-2'>
            <Icon className={'w-5 h-5 ' + (reward?.color || 'text-yellow-400')} />
            <span className='text-sm text-slate-400'>Step {step} of 5</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {[1,2,3,4,5].map(s => (
            <div key={s} className='flex-1'>
              <div className={'h-2 rounded-full ' + (s <= step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700')} />
            </div>
          ))}
        </div>
      </div>

      <div className='bg-gradient-to-r from-emerald-900/50 to-blue-900/50 p-3 border-b border-emerald-800/30'>
        <p className='text-center text-sm text-emerald-300 italic'>&quot;{quote}&quot;</p>
      </div>

      <div className='flex-1 p-4 flex flex-col'>
        <div className='text-center mb-6'>
          <div className='relative w-32 h-32 mx-auto mb-4'>
            <img src={images[step - 1]} alt='' className='w-full h-full object-contain' />
            <div className='absolute -bottom-2 -right-2 w-10 h-10 bg-slate-800 rounded-full border-2 border-yellow-500 flex items-center justify-center'>
              <Icon className={'w-5 h-5 ' + reward?.color} />
            </div>
          </div>
          <div className='inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-3'>
            <Icon className={'w-4 h-4 ' + reward?.color} />
            <span className='text-xs font-medium text-yellow-400'>{reward?.title}</span>
          </div>
          <h2 className='text-2xl font-bold mb-2'>
            {step === 1 && 'What is your gender?'}
            {step === 2 && 'How old are you?'}
            {step === 3 && 'What grade are you in?'}
            {step === 4 && 'What is your skill level?'}
            {step === 5 && 'Choose your exam!'}
          </h2>
        </div>

        <div className='flex-1'>
          {step === 1 && (
            <div className='grid grid-cols-2 gap-3'>
              {['Male','Female','Other','Prefer not to say'].map(o => (
                <button key={o} onClick={() => updateField('gender', o)}
                  className={'p-4 rounded-2xl border-2 transition-all ' + (profile.gender === o ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-600')}>
                  <div className='font-medium'>{o}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className='grid grid-cols-2 gap-3'>
              {ageOptions.map(o => (
                <button key={o} onClick={() => updateField('age', o)}
                  className={'p-4 rounded-2xl border-2 transition-all ' + (profile.age === o ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-600')}>
                  <div className='font-semibold'>{o}</div>
                  <div className='text-xs text-slate-400'>years</div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className='space-y-3'>
              {['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(o => (
                <button key={o} onClick={() => updateField('grade', o)}
                  className={'w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ' + (profile.grade === o ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-600')}>
                  <BookOpen className='w-6 h-6 text-blue-400' />
                  <div className='font-semibold'>{o}</div>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className='space-y-3'>
              {['Beginner','Intermediate','Advanced'].map(o => (
                <button key={o} onClick={() => updateField('skillLevel', o)}
                  className={'w-full p-4 rounded-2xl border-2 text-left transition-all ' + (profile.skillLevel === o ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-600')}>
                  <div className='font-semibold text-lg'>{o}</div>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className='space-y-3'>
              <div className='p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-xl mb-4 text-center text-sm text-emerald-300'>
                Choose your exam based on available subjects!
              </div>
              {availableSubjects.map(subj => (
                <button key={subj.id} onClick={() => updateField('exam', subj.id)}
                  className={'w-full p-4 rounded-2xl border-2 text-left transition-all ' + (profile.exam === subj.id ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-600')}>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>{subj.icon}</span>
                    <div>
                      <div className='font-semibold text-lg'>{subj.name}</div>
                      <div className='text-xs text-slate-400'>Grades: {subj.grades.join(', ')}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isComplete() && (
          <div className='mt-4 p-3 bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-700/50 rounded-xl flex items-center gap-3'>
            <div className='w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center'>
              <Icon className='w-5 h-5 text-yellow-400' />
            </div>
            <div>
              <div className='font-semibold text-yellow-400 text-sm'>{reward?.title} Unlocked!</div>
            </div>
          </div>
        )}
      </div>

      <div className='p-4 bg-slate-800 border-t border-slate-700'>
        <button onClick={nextStep} disabled={!isComplete()}
          className='w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg'>
          {step === 5 ? 'Start Your Journey' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
