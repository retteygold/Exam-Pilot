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

function App() {
  const isSetupComplete = useUserStore((state: { isSetupComplete: boolean }) => state.isSetupComplete)

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
      
      {/* Main app routes */}
      <Route 
        path="/" 
        element={
          isSetupComplete ? (
            <Layout>
              <Home />
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
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
