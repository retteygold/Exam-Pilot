import { useEffect, useState } from 'react'
import { useKidsStore } from '../store/kidsStore'
import { UserPlus, LogIn, Sparkles, Chrome } from 'lucide-react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AVATARS = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🦄', '🐙', '🦊', '🐰']
const GRADES = ['LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8']

type CountryOption = { name: string; flag: string }

const ISO_3166_ALPHA2: string[] = [
  'AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ',
  'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ',
  'CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ',
  'DE','DJ','DK','DM','DO','DZ',
  'EC','EE','EG','EH','ER','ES','ET',
  'FI','FJ','FK','FM','FO','FR',
  'GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY',
  'HK','HM','HN','HR','HT','HU',
  'ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT',
  'JE','JM','JO','JP',
  'KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ',
  'LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
  'MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ',
  'NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ',
  'OM',
  'PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY',
  'QA',
  'RE','RO','RS','RU','RW',
  'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ',
  'TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ',
  'UA','UG','UM','US','UY','UZ',
  'VA','VC','VE','VG','VI','VN','VU',
  'WF','WS',
  'YE','YT',
  'ZA','ZM','ZW'
]

const flagFromRegion = (regionCode: string) =>
  regionCode
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))

const buildCountryOptions = (): CountryOption[] => {
  const dn = new Intl.DisplayNames(['en'], { type: 'region' })
  return ISO_3166_ALPHA2
    .map(code => ({
      name: dn.of(code) || code,
      flag: flagFromRegion(code)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

interface KidsLoginProps {
  onLogin: () => void
  onBack?: () => void
}

export function KidsLogin({ onLogin, onBack }: KidsLoginProps) {
  const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
  const [isRegistering, setIsRegistering] = useState(false)
  const [authMode, setAuthMode] = useState<'email' | 'google_profile'>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('Grade 1')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [countryOptions] = useState<CountryOption[]>(() => buildCountryOptions())
  const [countryName, setCountryName] = useState(countryOptions[0]?.name || 'Pakistan')
  const [countryFlag, setCountryFlag] = useState(countryOptions[0]?.flag || '🇵🇰')
  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  const isProfileCompletion = authMode === 'google_profile'
  const isSignupFlow = isRegistering || isProfileCompletion

  const { currentKid, loginWithEmail, registerWithEmail, loginWithGoogle, finishGoogleRedirectLogin, completeKidProfileForCurrentUser } = useKidsStore()

  useEffect(() => {
    const run = async () => {
      if (debugKidsAuth) {
        console.log('[KidsAuth] mount: starting redirect completion attempt', {
          hasCurrentKid: !!currentKid,
          hasAuthUserAtMount: !!auth.currentUser,
          url: window.location.href
        })
      }

      const profile = await finishGoogleRedirectLogin()
      if (profile) {
        if (debugKidsAuth) console.log('[KidsAuth] redirect result: profile loaded', { kidId: profile.id, name: profile.name })
        setSuccess(`Welcome back, ${profile.name}! 🎉`)
        setTimeout(() => onLogin(), 300)
        return
      }

      if (debugKidsAuth) console.log('[KidsAuth] redirect result: no profile returned', { hasAuthUser: !!auth.currentUser })

      // If redirect sign-in completed but profile doc doesn't exist yet, prompt profile completion.
      if (auth.currentUser) {
        if (debugKidsAuth) console.log('[KidsAuth] auth.currentUser exists but no profile doc yet; switching to profile completion')
        setAuthMode('google_profile')
        setIsRegistering(true)
        setSuccess('Signed in with Google. Please complete your profile.')
      }
    }

    void run()
  }, [finishGoogleRedirectLogin, onLogin])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (debugKidsAuth) {
        console.log('[KidsAuth] onAuthStateChanged', {
          hasUser: !!user,
          uid: user?.uid,
          hasCurrentKid: !!currentKid
        })
      }
      // After redirect/refresh, auth may initialize after the component renders.
      // If the user is signed in but we don't yet have a kid profile loaded, prompt completion.
      if (user && !currentKid) {
        if (debugKidsAuth) console.log('[KidsAuth] signed-in user but currentKid missing -> show google_profile form')
        setAuthMode('google_profile')
        setIsRegistering(true)
      }
    })
    return () => unsub()
  }, [currentKid])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const profile = await loginWithEmail(email, password)
      if (profile) {
        setSuccess(`Welcome back, ${profile.name}! 🎉`)
        setTimeout(() => onLogin(), 500)
      } else {
        setError('Login failed. Please complete your profile.')
      }
    } catch (err: unknown) {
      if (debugKidsAuth) console.log('[KidsAuth] handleLogin error', err)
      const message = err instanceof Error ? err.message : String(err)
      setError(`Login failed: ${message}`)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setSuccess('')
    if (debugKidsAuth) console.log('[KidsAuth] starting Google redirect sign-in')
    try {
      await loginWithGoogle()
      setSuccess('Opening Google sign-in...')
    } catch (err: unknown) {
      if (debugKidsAuth) console.log('[KidsAuth] loginWithGoogle threw', err)
      const message = err instanceof Error ? err.message : String(err)
      setError(`Google sign-in failed: ${message}`)
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
    

    if (authMode === 'email') {
      try {
        const profile = await registerWithEmail({
          name,
          email,
          password,
          grade,
          avatar,
          countryName,
          countryFlag
        })
        if (profile) {
          setSuccess(`Account created! Welcome, ${profile.name}! 🎉`)
          setTimeout(() => onLogin(), 500)
        }
      } catch (err: unknown) {
        if (debugKidsAuth) console.log('[KidsAuth] handleRegister(email) error', err)
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('KID_NAME_TAKEN')) {
          setError('This account already exists. Try logging in instead.')
        } else if (msg.includes('KID_PASSWORD_TOO_SHORT')) {
          setError('Password must be at least 6 characters.')
        } else if (msg.includes('auth/')) {
          setError(`Signup failed: ${msg}`)
        } else {
          setError('Signup failed. Please try again.')
        }
      }
      return
    }

    if (authMode === 'google_profile') {
      try {
        const profile = await completeKidProfileForCurrentUser({
          name,
          grade,
          avatar,
          countryName,
          countryFlag
        })
        if (profile) {
          setSuccess(`Profile saved! Welcome, ${profile.name}! 🎉`)
          setTimeout(() => onLogin(), 500)
        }
      } catch {
        setError('Could not save profile. Please try again.')
      }
      return
    }

    setError('Signup failed. Please try again.')
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
            {isSignupFlow ? 'Create Account' : 'Welcome Back!'}
          </h1>
          <p className="text-purple-200">
            {authMode === 'google_profile'
              ? 'Complete your profile to continue'
              : (isSignupFlow ? 'Create an account with email or Google' : 'Sign in with email or Google')}
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

          <form onSubmit={isSignupFlow ? handleRegister : handleLogin} className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 border border-slate-600 transition-colors"
            >
              <Chrome className="w-5 h-5" /> Continue with Google
            </button>

            {authMode !== 'google_profile' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </>
            )}

            {isSignupFlow && (
              <>
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Country
                  </label>
                  <input
                    list="country-options"
                    value={countryName}
                    onChange={(e) => {
                      const v = e.target.value
                      setCountryName(v)
                      const match = countryOptions.find(o => o.name === v)
                      if (match) setCountryFlag(match.flag)
                    }}
                    placeholder="Start typing..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <datalist id="country-options">
                    {countryOptions.map(o => (
                      <option key={o.name} value={o.name} />
                    ))}
                  </datalist>
                  <div className="text-xs text-slate-400 mt-1">
                    Selected: {countryFlag} {countryName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Choose Your Avatar
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAvatar(a)}
                        className={`p-3 rounded-xl text-2xl border transition-colors ${avatar === a ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              {isSignupFlow ? (
                <>
                  <UserPlus className="w-6 h-6" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Login
                </>
              )}
            </button>

            {authMode !== 'google_profile' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email')
                  setIsRegistering(!isRegistering)
                  setError('')
                  setSuccess('')
                }}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 border border-slate-600 transition-colors"
              >
                {isSignupFlow ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Already have an account? Login
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    New here? Create account
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
