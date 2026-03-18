import { ProfileSetup } from './pages/ProfileSetup'
import { Auth } from './pages/Auth'
import { useUserStore } from './store/userStore'
import { Home } from './pages/Home'
import { KidsQuickPlay } from './pages/KidsQuickPlay'
import { Layout } from './components/Layout'
import { PaperSelect } from './pages/PaperSelect'
import { Exam } from './pages/Exam'
import { Results } from './pages/Results'
import { Stats } from './pages/Stats'
import { WordSearchGame } from './games/WordSearchGame'
import { CrosswordGame } from './games/CrosswordGame'
import { FindOddOneOut } from './games/FindOddOneOut'
import { WhichOneCan } from './games/WhichOneCan'
import { MemoryGame } from './games/MemoryGame'
import { Quiz } from './pages/Quiz'
import { MathBlaster } from './games/MathBlaster'
import { SpellingSprint } from './games/SpellingSprint'
import { GrammarBuilder } from './games/GrammarBuilder'
import { ScienceLab } from './games/ScienceLab'
import { MapExplorer } from './games/MapExplorer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const { isSetupComplete, hasHydrated, setUserId } = useUserStore()
  const [isAuthed, setIsAuthed] = useState(false)
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid ?? null
      setIsAuthed(!!uid)
      
      if (uid) {
        setUserId(uid)
      } else {
        setUserId(null)
      }
    })
    return () => unsub()
  }, [setUserId])
  
  // Wait for store to rehydrate from localStorage before making routing decisions
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthed ? (
            isSetupComplete ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/setup" replace />
            )
          ) : (
            <Auth onSuccess={() => {}} />
          )
        } 
      />

      <Route
        path="/setup"
        element={
          isAuthed ? (
            isSetupComplete ? (
              <Navigate to="/" replace />
            ) : (
              <ProfileSetup />
            )
          ) : (
            <Navigate to="/" replace />
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
            <Navigate to="/" replace />
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
            <Navigate to="/" replace />
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
            <Navigate to="/" replace />
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
            <Navigate to="/" replace />
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
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Kids Games - Full screen without Layout */}
      <Route 
        path="/game/word-search" 
        element={
          isAuthed && isSetupComplete ? (
            <WordSearchGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/crossword" 
        element={
          isAuthed && isSetupComplete ? (
            <CrosswordGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/find-odd" 
        element={
          isAuthed && isSetupComplete ? (
            <FindOddOneOut onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/which-can" 
        element={
          isAuthed && isSetupComplete ? (
            <WhichOneCan onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/memory" 
        element={
          isAuthed && isSetupComplete ? (
            <MemoryGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/math-blaster" 
        element={
          isAuthed && isSetupComplete ? (
            <MathBlaster onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/spelling-sprint" 
        element={
          isAuthed && isSetupComplete ? (
            <SpellingSprint onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/grammar-builder" 
        element={
          isAuthed && isSetupComplete ? (
            <GrammarBuilder onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/science-lab" 
        element={
          isAuthed && isSetupComplete ? (
            <ScienceLab onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/geography-map" 
        element={
          isAuthed && isSetupComplete ? (
            <MapExplorer onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
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
