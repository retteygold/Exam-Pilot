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
import { ReadingComprehension } from './games/ReadingComprehension'
import { StoryBuilder } from './games/StoryBuilder'
import { SoundDetective } from './games/SoundDetective'
import { SpeakUp } from './games/SpeakUp'
import { DictionaryGame } from './games/DictionaryGame'
import { WordScramble } from './games/WordScramble'
import { RhymeTime } from './games/RhymeTime'
import { PictureWordMatch } from './games/PictureWordMatch'
import { SpeedMath } from './games/SpeedMath'
import { ColorMatch } from './games/ColorMatch'
import { PatternRecognition } from './games/PatternRecognition'
import { ChallengeMode } from './pages/ChallengeMode'
import { MegaGame } from './games/MegaGame'
import { GameExitWrapper } from './components/GameExitWrapper'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'

function App() {
  const { isSetupComplete, hasHydrated, firebaseUser } = useUserStore()
  const [isAuthed, setIsAuthed] = useState(false)
  
  useEffect(() => {
    setIsAuthed(!!firebaseUser)
  }, [firebaseUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user)
    })
    return unsubscribe
  }, [])

  
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

      <Route 
        path="/challenge" 
        element={
          isAuthed && isSetupComplete ? (
            <ChallengeMode />
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
            <GameExitWrapper>
              {({ onExit }) => <WordSearchGame onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/crossword" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <CrosswordGame onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/find-odd" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <FindOddOneOut onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/which-can" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <WhichOneCan onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/memory" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <MemoryGame onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/math-blaster" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <MathBlaster onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/spelling-sprint" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <SpellingSprint onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/grammar-builder" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <GrammarBuilder onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/science-lab" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <ScienceLab onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/geography-map" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <MapExplorer onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/reading-comprehension" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <ReadingComprehension onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/story-builder" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <StoryBuilder onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/sound-detective" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <SoundDetective onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/speak-up" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <SpeakUp onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/dictionary" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <DictionaryGame onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/word-scramble" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <WordScramble onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/rhyme-time" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <RhymeTime onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/picture-match" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <PictureWordMatch onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/speed-math" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <SpeedMath onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/color-match" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <ColorMatch onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/pattern-recognition" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <PatternRecognition onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route 
        path="/game/mega-challenge" 
        element={
          isAuthed && isSetupComplete ? (
            <GameExitWrapper>
              {({ onExit }) => <MegaGame onComplete={() => {}} onExit={onExit} />}
            </GameExitWrapper>
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
