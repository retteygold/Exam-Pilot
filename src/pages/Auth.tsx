import { useEffect, useMemo, useRef, useState } from 'react'
import { Chrome, LogIn, Mail, UserPlus } from 'lucide-react'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth'
import { auth } from '../lib/firebase'

interface AuthProps {
  onSuccess?: () => void
}

export function Auth({ onSuccess }: AuthProps) {
  const debugKidsAuth = typeof window !== 'undefined' && window.localStorage?.getItem('debugKidsAuth') === '1'
  const didCallSuccessRef = useRef(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length >= 6, [email, password])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        if (debugKidsAuth) console.log('[Auth] setPersistence(browserLocalPersistence) ok')
      } catch (e) {
        if (debugKidsAuth) console.log('[Auth] setPersistence error', e)
      }

      try {
        const res = await getRedirectResult(auth)
        if (debugKidsAuth) console.log('[Auth] getRedirectResult', { hasResult: !!res, uid: res?.user?.uid })
        if (mounted && res?.user && !didCallSuccessRef.current) {
          didCallSuccessRef.current = true
          onSuccess?.()
        }
      } catch (e) {
        if (debugKidsAuth) console.log('[Auth] getRedirectResult error', e)
      }
    })()

    const unsub = onAuthStateChanged(auth, (user) => {
      if (debugKidsAuth) console.log('[Auth] onAuthStateChanged', { hasUser: !!user, uid: user?.uid })
      if (user && !didCallSuccessRef.current) {
        didCallSuccessRef.current = true
        onSuccess?.()
      }
    })

    return () => {
      mounted = false
      unsub()
    }
  }, [onSuccess])

  const mapErr = (err: unknown) => {
    const anyErr = err as any
    if (typeof anyErr?.code === 'string') return anyErr.code
    const msg = err instanceof Error ? err.message : String(err)
    const m = msg.match(/auth\/[a-zA-Z0-9-]+/)
    return m?.[0] ?? msg
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await setPersistence(auth, browserLocalPersistence)
      const normalizedEmail = email.trim().toLowerCase()
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, normalizedEmail, password)
        setSuccess('Signed in!')
      } else {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password)
        setSuccess('Account created!')
      }
      if (!didCallSuccessRef.current) {
        didCallSuccessRef.current = true
        onSuccess?.()
      }
    } catch (err: unknown) {
      if (debugKidsAuth) console.log('[Auth] email auth error', err)
      setError(mapErr(err))
    }
  }

  const handleGoogle = async () => {
    setError('')
    setSuccess('')
    try {
      await setPersistence(auth, browserLocalPersistence)
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithRedirect(auth, provider)
      setSuccess('Opening Google sign-in...')
    } catch (err: unknown) {
      if (debugKidsAuth) console.log('[Auth] google error', err)
      const mapped = mapErr(err)
      setError(mapped)

      // Fallback: if redirect is blocked/unsupported, try popup so user can still sign in.
      // (Popup may still be blocked by browser settings, but this helps on many devices.)
      try {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        await signInWithPopup(auth, provider)
        if (!didCallSuccessRef.current) {
          didCallSuccessRef.current = true
          onSuccess?.()
        }
      } catch (popupErr: unknown) {
        if (debugKidsAuth) console.log('[Auth] google popup fallback error', popupErr)
        const popupMapped = mapErr(popupErr)
        setError(`${mapped} | ${popupMapped}`)
      }
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail) {
        setError('Please enter your email first.')
        return
      }
      await sendPasswordResetEmail(auth, normalizedEmail)
      setSuccess('Password reset email sent.')
    } catch (err: unknown) {
      if (debugKidsAuth) console.log('[Auth] forgot password error', err)
      setError(mapErr(err))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-yellow-500/30">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Exam Pilot</h1>
          <p className="text-purple-200">{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</p>
        </div>

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

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 mb-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 border border-slate-600 transition-colors"
          >
            <Chrome className="w-5 h-5" /> Continue with Google
          </button>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:hover:scale-100"
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-6 h-6" />
                  Login
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  Sign Up
                </>
              )}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full py-2 text-sm text-purple-200 hover:text-purple-100"
              >
                Forgot password?
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setSuccess('')
              }}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 border border-slate-600 transition-colors"
            >
              {mode === 'login' ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  New here? Create account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Already have an account? Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
