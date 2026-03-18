import { SimpleAuth } from './pages/SimpleAuth'
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
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const { isSetupComplete, hasHydrated } = useUserStore()
  
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
          isSetupComplete ? (
            <Layout>
              <Home />
            </Layout>
          ) : (
            <SimpleAuth />
          )
        } 
      />

      <Route
        path="/kids"
        element={
          isSetupComplete ? (
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
          isSetupComplete ? (
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
          isSetupComplete ? (
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
          isSetupComplete ? (
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
          isSetupComplete ? (
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
          isSetupComplete ? (
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
          isSetupComplete ? (
            <WordSearchGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/crossword" 
        element={
          isSetupComplete ? (
            <CrosswordGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/find-odd" 
        element={
          isSetupComplete ? (
            <FindOddOneOut onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/which-can" 
        element={
          isSetupComplete ? (
            <WhichOneCan onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/memory" 
        element={
          isSetupComplete ? (
            <MemoryGame onComplete={() => {}} onExit={() => window.location.href = '/kids'} />
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
