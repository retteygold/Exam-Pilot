import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import { Layout } from './components/Layout'
import { ProfileSetup } from './pages/ProfileSetup'
import { Home } from './pages/Home'
import { KidsDashboard } from './pages/KidsDashboard'
import { PaperSelect } from './pages/PaperSelect'
import { Exam } from './pages/Exam'
import { Results } from './pages/Results'
import { Stats } from './pages/Stats'
import { Admin } from './pages/Admin'
import { WordSearchGame } from './games/WordSearchGame'
import { CrosswordGame } from './games/CrosswordGame'
import { FindOddOneOut } from './games/FindOddOneOut'
import { WhichOneCan } from './games/WhichOneCan'
import { MemoryGame } from './games/MemoryGame'
import { Quiz } from './pages/Quiz'

function App() {
  const { profile, isSetupComplete } = useUserStore()
  
  // Determine if user should see kids dashboard (Grades LKG-8)
  const isYoungStudent = profile?.grade && (
    profile.grade.includes('LKG') || 
    profile.grade.includes('UKG') ||
    (profile.grade.includes('Grade') && parseInt(profile.grade.replace('Grade ', '')) <= 8)
  )

  return (
    <Routes>
      <Route 
        path="/admin"
        element={<Admin />}
      />

      {/* Profile setup - shown first if not complete */}
      <Route 
        path="/setup" 
        element={isSetupComplete ? <Navigate to="/" replace /> : <ProfileSetup />} 
      />
      
      {/* Main app routes - KidsDashboard for young students, Home for older */}
      <Route 
        path="/" 
        element={
          isSetupComplete ? (
            <Layout>
              {isYoungStudent ? <KidsDashboard /> : <Home />}
            </Layout>
          ) : (
            <Navigate to="/setup" replace />
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
            <Navigate to="/setup" replace />
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
            <Navigate to="/setup" replace />
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
            <Navigate to="/setup" replace />
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
            <Navigate to="/setup" replace />
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
            <Navigate to="/setup" replace />
          )
        } 
      />

      {/* Kids Games - Full screen without Layout */}
      <Route 
        path="/game/word-search" 
        element={
          isSetupComplete && isYoungStudent ? (
            <WordSearchGame onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/crossword" 
        element={
          isSetupComplete && isYoungStudent ? (
            <CrosswordGame onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/find-odd" 
        element={
          isSetupComplete && isYoungStudent ? (
            <FindOddOneOut onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/which-can" 
        element={
          isSetupComplete && isYoungStudent ? (
            <WhichOneCan onComplete={() => {}} onExit={() => window.location.href = '/'} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/memory" 
        element={
          isSetupComplete && isYoungStudent ? (
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
