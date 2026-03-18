import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import { Layout } from './components/Layout'
import { ProfileSetup } from './pages/ProfileSetup'
import { Home } from './pages/Home'
import { PaperSelect } from './pages/PaperSelect'
import { Exam } from './pages/Exam'
import { Results } from './pages/Results'
import { Stats } from './pages/Stats'
import { Admin } from './pages/Admin'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useState } from 'react'
import { WordSearchGame } from './games/WordSearchGame'
import { CrosswordGame } from './games/CrosswordGame'
import { FindOddOneOut } from './games/FindOddOneOut'
import { WhichOneCan } from './games/WhichOneCan'
import { MemoryGame } from './games/MemoryGame'
import { Quiz } from './pages/Quiz'
import { KidsQuickPlay } from './pages/KidsQuickPlay'

function App() {
  const { userId, isSetupComplete, hasHydrated, setUserId, clearProfile } = useUserStore()
  const [isAuthed, setIsAuthed] = useState<boolean>(!!auth.currentUser)
  
  // Wait for store to rehydrate from localStorage before making routing decisions
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid ?? null
      setIsAuthed(!!uid)

      if (!uid) {
        // Logged out: keep local setup/profile so the same user doesn't redo setup after re-login.
        setUserId(null)
        return
      }

      // If a different account signs in, require setup again for that account.
      if (userId && userId !== uid) {
        clearProfile()
        setUserId(uid)
        return
      }

      // First login on this device
      if (!userId) setUserId(uid)
    })

    return () => unsub()
  }, [clearProfile, setUserId, userId])

  return (
    <Routes>
      <Route 
        path="/admin"
        element={<Admin />}
      />

      {/* Profile setup - shown first if not complete */}
      <Route 
        path="/setup" 
        element={<ProfileSetup />}
      />
      
      {/* Main app routes - KidsDashboard for young students, Home for older */}
      <Route 
        path="/" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <Home />
            </Layout>
          ) : (
            <ProfileSetup />
          )
        } 
      />

      <Route
        path="/kids"
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <KidsQuickPlay />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route 
        path="/papers" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <PaperSelect />
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
          )
        } 
      />
      <Route 
        path="/exam" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <Exam />
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
          )
        } 
      />
      <Route 
        path="/results" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <Results />
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
          )
        } 
      />
      <Route 
        path="/stats" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <Stats />
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
          )
        } 
      />

      <Route 
        path="/quiz" 
        element={
          isAuthed && isSetupComplete ? (
            <Layout>
              <Quiz />
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
          )
        } 
      />

      {/* Kids Games - Full screen without Layout */}
      <Route 
        path="/game/word-search" 
        element={
          isAuthed && isSetupComplete ? (
            <WordSearchGame onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/crossword" 
        element={
          isAuthed && isSetupComplete ? (
            <CrosswordGame onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/find-odd" 
        element={
          isAuthed && isSetupComplete ? (
            <FindOddOneOut onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/which-can" 
        element={
          isAuthed && isSetupComplete ? (
            <WhichOneCan onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/memory" 
        element={
          isAuthed && isSetupComplete ? (
            <MemoryGame onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
