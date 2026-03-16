import { useEffect, useState } from 'react'
import type { ClipboardEvent } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, storage } from '../lib/firebase'
import type { Question } from '../types'
import { canUseFirebase, deleteQuestion, fetchAllQuestionsFromFirebase, upsertQuestion } from '../services/questionsFirebase'
import { Save, Trash2, Plus, Image, ChevronDown, ChevronUp, Check, FileText, Users, Star, Trophy, Activity, RotateCcw, Edit2, Database, Download } from 'lucide-react'
import { useKidsStore } from '../store/kidsStore'
import { useMigration } from '../services/migrateQuestions'
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../services/cloudinary'

function makeEmptyQuestion(): Question {
  return {
    id: '',
    subject: 'biology',
    yearGroup: 'year10',
    difficulty: 'medium',
    topic: 'general',
    marks: 1,
    question: '',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: '',
    examStyle: true,
    timeLimit: 60,
    source: {
      pdf: '',
      year: 2024,
      session: 'May/June',
      paper: '11',
      question_number: '1',
    },
    verified: false,
    imageRequired: false,
  }
}

export function Admin() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedPaper, setSelectedPaper] = useState<string>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Results
  const [results, setResults] = useState<Question[]>([])
  const [selected, setSelected] = useState<Question | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [showImageSection, setShowImageSection] = useState(false)
  const [showPdfImage, setShowPdfImage] = useState(false)
  const [activeTab, setActiveTab] = useState<'questions' | 'kids' | 'migration'>('questions')

  const { profiles, sessions, achievements, getLeaderboard, deleteKid, resetKidStats, updateKid } = useKidsStore()

  const canUseFirebaseDb = canUseFirebase()

  // Load all questions on mount
  useEffect(() => {
    if (!canUseFirebaseDb) return

    const loadQuestions = async () => {
      setLoading(true)
      try {
        const questions = await fetchAllQuestionsFromFirebase()
        setAllQuestions(questions)
        setResults(questions) // Show ALL questions, not just first 100
      } catch (e) {
        console.error('Failed to load questions:', e)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [canUseFirebaseDb])

  // Apply filters
  useEffect(() => {
    let filtered = allQuestions

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === selectedSubject)
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(q => q.source?.year?.toString() === selectedYear)
    }
    if (selectedPaper !== 'all') {
      filtered = filtered.filter(q => q.source?.paper === selectedPaper)
    }
    if (verifiedOnly) {
      filtered = filtered.filter(q => q.verified)
    }

    setResults(filtered)
  }, [allQuestions, selectedSubject, selectedYear, selectedPaper, verifiedOnly])

  // Get unique filter values
  const subjects = ['all', ...new Set(allQuestions.map(q => q.subject).filter(Boolean))]
  const years = ['all', ...Array.from(new Set(allQuestions.map(q => q.source?.year).filter(Boolean).map(String))).sort((a: string, b: string) => parseInt(b) - parseInt(a))]
  const papers = ['all', ...new Set(allQuestions.map(q => q.source?.paper).filter(Boolean))]

  // Group by subject, year, paper, pdf for tree view
  const grouped = results.reduce((acc, q) => {
    const subject = q.subject || 'unknown'
    const year = q.source?.year || 'unknown'
    const paper = q.source?.paper || 'unknown'
    const pdf = q.source?.pdf || 'unknown'
    const key = `${subject}|${year}|${paper}|${pdf}`
    if (!acc[key]) acc[key] = { subject, year: String(year), paper: String(paper), pdf, questions: [] }
    acc[key].questions.push(q)
    return acc
  }, {} as Record<string, { subject: string, year: string, paper: string, pdf: string, questions: Question[] }>)

  useEffect(() => {
    if (!canUseFirebaseDb) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSessionEmail(user?.email || null)
    })

    return () => unsubscribe()
  }, [canUseFirebaseDb])

  const signIn = async () => {
    setAuthError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // onAuthStateChanged will update sessionEmail
    } catch (error: any) {
      setAuthError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await firebaseSignOut(auth)
      setSessionEmail(null)
      setResults([])
      setSelected(null)
    } finally {
      setLoading(false)
    }
  }

  // Search function removed - now using filter-based UI
  // const search = async () => { ... }

  const loadRecent = async () => {
    // Reload all questions and reset filters
    setLoading(true)
    try {
      const questions = await fetchAllQuestionsFromFirebase()
      setAllQuestions(questions)
      setSelectedSubject('all')
      setSelectedYear('all')
      setSelectedPaper('all')
      setVerifiedOnly(false)
      setResults(questions.slice(0, 100))
    } catch (e) {
      console.error('Failed to reload:', e)
    } finally {
      setLoading(false)
    }
  }
  
  // Load recent on auth
  useEffect(() => {
    if (sessionEmail) {
      loadRecent()
    }
  }, [sessionEmail])

  const createNew = () => {
    const q = makeEmptyQuestion()
    setSelected(q)
    setSaveStatus(null)
    setShowImageSection(false)
  }

  const save = async () => {
    if (!selected) return
    if (!selected.id.trim()) {
      setSaveStatus('ID is required')
      return
    }
    const savedId = selected.id // Remember the ID we just saved

    setLoading(true)
    setSaveStatus(null)
    try {
      const questionToSave = {
        ...selected,
        imageRequired: Boolean(selected.imagePath),
      }
      console.log('Saving question:', savedId, 'with imagePath:', questionToSave.imagePath)
      await upsertQuestion(questionToSave)
      setSaveStatus('Saved!')
      
      // Refresh the list and re-select the same question
      // Reload all questions
      const qs = await fetchAllQuestionsFromFirebase()
      setAllQuestions(qs)
      setResults(qs)
      const updated = qs.find((q: Question) => q.id === savedId)
      if (updated) {
        console.log('Re-selecting updated question with imagePath:', updated.imagePath)
        setSelected(updated)
      }
    } catch (e: any) {
      console.error('Save error:', e)
      setSaveStatus(e?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!selected?.id) return
    if (!confirm('Delete this question?')) return
    setLoading(true)
    setSaveStatus(null)
    try {
      await deleteQuestion(selected.id)
      setSaveStatus('Deleted')
      setSelected(null)
      // Reload all questions
      const qs = await fetchAllQuestionsFromFirebase()
      setAllQuestions(qs)
      setResults(qs)
    } catch (e: any) {
      setSaveStatus(e?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageFile = async (file: File) => {
    if (!selected) return
    if (!isCloudinaryConfigured()) {
      setSaveStatus('Cloudinary not configured - check .env file')
      return
    }
    setLoading(true)
    setSaveStatus(null)
    try {
      console.log('Uploading to Cloudinary...')
      
      const url = await uploadImageToCloudinary(file)

      setSelected({
        ...selected,
        imageRequired: true,
        imagePath: url,
      })
      setSaveStatus('Image uploaded - click Save to store')
    } catch (e: any) {
      console.error('Image upload error:', e)
      setSaveStatus(e?.message || 'Image upload failed')
    } finally {
      setLoading(false)
    }
  }

  const exportToJson = () => {
    if (!selected) return
    
    const data = {
      metadata: {
        subject: selected.subject,
        id: selected.id,
        exportedAt: new Date().toISOString(),
        verified: selected.verified
      },
      question: selected
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selected.id || 'question'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setSaveStatus('Exported to JSON!')
  }

  const onPaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const items = Array.from(e.clipboardData.items)
    const img = items.find((it) => it.type.startsWith('image/'))
    if (!img) {
      setSaveStatus('No image found in clipboard')
      return
    }
    const file = img.getAsFile()
    if (!file) {
      setSaveStatus('Could not get image from clipboard')
      return
    }
    await uploadImageFile(file)
  }

  if (!canUseFirebaseDb) {
    return (
      <div className="p-4">
        <div className="p-4 bg-slate-800 rounded-xl text-center">Firebase not configured</div>
      </div>
    )
  }

  if (!sessionEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
            <p className="text-slate-400 text-sm">Manage exam questions</p>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <input className="w-full p-3 rounded-xl bg-slate-700" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full p-3 rounded-xl bg-slate-700" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {authError && <div className="text-sm text-red-400">{authError}</div>}
            <button disabled={loading} className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold" onClick={signIn}>Sign In</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Bar - Sticky */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg">Admin</h1>
          <span className="text-xs text-slate-400">{sessionEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex bg-slate-700 rounded-lg p-1 mr-4">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'questions' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'kids' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'migration' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Migration
            </button>
          </div>
          {saveStatus && <span className="text-sm px-3 py-1 rounded-full bg-slate-700">{saveStatus}</span>}
          <button disabled={loading} onClick={signOut} className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">Logout</button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Students Tab Content */}
        {activeTab === 'kids' && (
          <div className="lg:col-span-12 space-y-4">
            {/* Kids Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Total Students</span>
                </div>
                <div className="text-2xl font-bold">{profiles.length}</div>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-400">Total Sessions</span>
                </div>
                <div className="text-2xl font-bold">{sessions.length}</div>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-slate-400">Total Stars</span>
                </div>
                <div className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.starsEarned, 0)}
                </div>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-slate-400">Achievements</span>
                </div>
                <div className="text-2xl font-bold">{achievements.length}</div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="p-4 bg-slate-800 rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Students Leaderboard
              </h3>
              <div className="space-y-2">
                {getLeaderboard().map((entry, idx) => (
                  <div key={entry.kid.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-8 text-center font-bold text-lg">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </div>
                    <div className="text-2xl">{entry.kid.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.kid.name}</div>
                      <div className="text-xs text-slate-400">{entry.kid.grade}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">{entry.totalStars}</span>
                      </div>
                      <div className="text-xs text-slate-400">{entry.sessions} games</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const newName = prompt('New name:', entry.kid.name)
                          if (newName) updateKid(entry.kid.id, { name: newName })
                        }}
                        className="p-2 rounded-lg bg-slate-600 hover:bg-slate-500"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Reset stats for ${entry.kid.name}?`)) {
                            resetKidStats(entry.kid.id)
                          }
                        }}
                        className="p-2 rounded-lg bg-yellow-600/50 hover:bg-yellow-600"
                        title="Reset Stats"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${entry.kid.name}?`)) {
                            deleteKid(entry.kid.id)
                          }
                        }}
                        className="p-2 rounded-lg bg-red-600/50 hover:bg-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {profiles.length === 0 && (
                  <div className="text-center text-slate-500 py-8">No students registered yet</div>
                )}
              </div>
            </div>

            {/* All Sessions */}
            <div className="p-4 bg-slate-800 rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Recent Activity
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {[...sessions].sort((a, b) => b.playedAt - a.playedAt).slice(0, 50).map(session => {
                  const kid = profiles.find(p => p.id === session.kidId)
                  return (
                    <div key={session.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg text-sm">
                      <div className="text-xl">{kid?.avatar || '👤'}</div>
                      <div className="flex-1">
                        <span className="font-medium">{kid?.name || 'Unknown'}</span>
                        <span className="text-slate-400"> played </span>
                        <span className="text-blue-400">{session.gameType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">+{session.starsEarned}⭐</span>
                        <span className="text-slate-400">{session.score}/{session.totalQuestions}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(session.playedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {sessions.length === 0 && (
                  <div className="text-center text-slate-500 py-8">No sessions recorded yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Migration Tab Content */}
        {activeTab === 'migration' && (
          <div className="lg:col-span-12 space-y-4">
            <div className="p-4 bg-slate-800 rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                Data Migration (Supabase → Firebase)
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Migrate existing questions from Supabase to Firebase Firestore.
                This will copy all questions while keeping the originals in Supabase.
              </p>
              <MigrationPanel />
            </div>
          </div>
        )}
        {activeTab === 'questions' && (
        <>
        {/* Left Panel - Filters & List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Filters */}
          <div className="p-3 bg-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              <span className="text-xs text-slate-400">{results.length} questions</span>
            </div>
            
            {/* Subject Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Subject</label>
              <select 
                className="w-full p-2 rounded-lg bg-slate-700 text-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            {/* Year Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Year</label>
              <select 
                className="w-full p-2 rounded-lg bg-slate-700 text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {years.filter(y => y !== 'all').map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            {/* Paper Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Paper</label>
              <select 
                className="w-full p-2 rounded-lg bg-slate-700 text-sm"
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
              >
                <option value="all">All Papers</option>
                {papers.filter(p => p !== 'all').map(p => (
                  <option key={p} value={p}>Paper {p}</option>
                ))}
              </select>
            </div>
            
            {/* Verified Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded bg-slate-700 border-slate-600"
              />
              <span className="text-sm text-slate-300">Verified only</span>
            </label>
            
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => {
                  setSelectedSubject('all')
                  setSelectedYear('all')
                  setSelectedPaper('all')
                  setVerifiedOnly(false)
                }}
                className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
              >
                Reset
              </button>
              <button disabled={loading} onClick={createNew} className="flex-1 py-2 rounded-lg bg-green-600/50 hover:bg-green-500/50 text-sm flex items-center justify-center gap-1">
                <Plus className="w-4 h-4"/> New
              </button>
            </div>
          </div>

          {/* Papers Tree View */}
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-700 font-medium text-sm">
              Papers ({Object.keys(grouped).length})
            </div>
            <div className="max-h-[50vh] lg:max-h-[calc(100vh-480px)] overflow-y-auto">
              {Object.keys(grouped).length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">No papers match filters</div>
              )}
              {Object.entries(grouped).map(([key, group]) => (
                <div key={key} className="border-b border-slate-700/50">
                  <button
                    onClick={() => {
                      // Select first question of this group
                      if (group.questions.length > 0) {
                        setSelected(group.questions[0])
                        setShowImageSection(false)
                      }
                    }}
                    className="w-full text-left p-3 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate text-blue-300" title={group.pdf}>
                          {group.pdf}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {group.subject} • {group.year} • Paper {group.paper}
                        </div>
                      </div>
                      <div className="text-right ml-2 shrink-0">
                        <div className="text-xs text-slate-400">{group.questions.length} Qs</div>
                        <div className="text-[10px] text-emerald-400">
                          {group.questions.filter(q => q.verified).length} verified
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="lg:col-span-8">
          {!selected ? (
            <div className="p-8 bg-slate-800 rounded-xl text-center text-slate-400">Select a question to edit</div>
          ) : (
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              {/* Editor Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800 lg:sticky lg:top-[73px] z-10">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{selected.id ? 'Edit' : 'New'}</span>
                  {selected.imagePath && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Has Image</span>}
                </div>
                <div className="flex gap-2">
                  <button disabled={loading} onClick={save} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold flex items-center gap-2">
                    <Save className="w-4 h-4"/> Save
                  </button>
                  {selected.verified && (
                    <button disabled={loading} onClick={exportToJson} className="px-3 py-2 rounded-lg bg-emerald-600/50 hover:bg-emerald-600" title="Export verified question to JSON">
                      <Download className="w-4 h-4"/>
                    </button>
                  )}
                  {selected.id && (
                    <button disabled={loading} onClick={remove} className="px-3 py-2 rounded-lg bg-red-600/50 hover:bg-red-600">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Form */}
              <div className="p-4 space-y-4 lg:max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* ID & Subject */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Question ID</label>
                    <input
                      className="w-full p-3 rounded-lg bg-slate-700"
                      value={selected.id}
                      onChange={(e) => setSelected({ ...selected, id: e.target.value })}
                      placeholder="0610-y2024-p11-q2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subject</label>
                    <select
                      className="w-full p-3 rounded-lg bg-slate-700"
                      value={selected.subject}
                      onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
                    >
                      <option value="biology">O-Level Biology (5090)</option>
                      <option value="igcse_biology">IGCSE Biology (0610)</option>
                      <option value="as_biology">AS Biology (WBI11)</option>
                      <option value="o_level_biology">O-Level Biology (5090)</option>
                      <option value="o_level_accounting">O-Level Accounting (7707)</option>
                      <option value="as_economics">AS Economics</option>
                      <option value="as_mathematics">AS Mathematics</option>
                      <option value="as_physics">AS Physics</option>
                      <option value="accounting">Accounting (7707)</option>
                    </select>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Question Text</label>
                  <textarea
                    className="w-full p-3 rounded-lg bg-slate-700 min-h-[80px]"
                    value={selected.question}
                    onChange={(e) => setSelected({ ...selected, question: e.target.value })}
                    placeholder="Type the question here..."
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">Options (A, B, C, D)</label>
                  {['A', 'B', 'C', 'D'].map((letter, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-sm font-semibold text-slate-400">{letter}.</span>
                      <input
                        className="flex-1 p-2 rounded-lg bg-slate-700 text-sm"
                        value={selected.options?.[idx] || ''}
                        onChange={(e) => {
                          const next = [...(selected.options || ['', '', '', ''])]
                          next[idx] = e.target.value
                          setSelected({ ...selected, options: next })
                        }}
                      />
                      <button
                        onClick={() => setSelected({ ...selected, correctAnswer: idx })}
                        className={"w-8 h-8 rounded-lg flex items-center justify-center " + (selected.correctAnswer === idx ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400')}
                      >
                        <Check className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Marks & Topic */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Marks</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-slate-700"
                      value={selected.marks}
                      onChange={(e) => setSelected({ ...selected, marks: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Topic</label>
                    <input
                      className="w-full p-3 rounded-lg bg-slate-700"
                      value={selected.topic}
                      onChange={(e) => setSelected({ ...selected, topic: e.target.value })}
                      placeholder="e.g. photosynthesis"
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Explanation</label>
                  <textarea
                    className="w-full p-3 rounded-lg bg-slate-700 min-h-[60px]"
                    value={selected.explanation}
                    onChange={(e) => setSelected({ ...selected, explanation: e.target.value })}
                    placeholder="Explanation for the correct answer..."
                  />
                </div>

                {/* PDF Page Image Viewer */}
                {selected.source?.pdf && (
                  <div className="border border-slate-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowPdfImage(!showPdfImage)}
                      className="w-full p-3 flex items-center justify-between bg-slate-700/50 hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium text-sm">PDF Page Image</span>
                        <span className="text-xs text-slate-400">{selected.source.pdf}</span>
                      </div>
                      {showPdfImage ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                    </button>
                    
                    {showPdfImage && (
                      <div className="p-4 space-y-3">
                        <div className="text-xs text-slate-400 mb-2">
                          Look at this image to verify/correct the question text and options
                        </div>
                        <img 
                          src={`/pdf_images/${selected.source.pdf.replace('.pdf', '')}/page_003.png`}
                          alt="PDF Page"
                          className="max-h-64 rounded-lg border border-slate-600 mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/pdf_images/' + selected.source.pdf.replace('.pdf', '') + '/page_004.png';
                          }}
                        />
                        <div className="text-xs text-slate-500 text-center">
                          Images saved in: public/pdf_images/{selected.source.pdf.replace('.pdf', '')}/
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Section - Collapsible */}
                <div className="border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowImageSection(!showImageSection)}
                    className="w-full p-3 flex items-center justify-between bg-slate-700/50 hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      <span className="font-medium text-sm">Image</span>
                      {selected.imagePath && <span className="text-xs text-green-400">(Uploaded)</span>}
                      {!storage && <span className="text-xs text-orange-400">(Storage disabled)</span>}
                    </div>
                    {showImageSection ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                  </button>
                  
                  {showImageSection && (
                    <div className="p-4 space-y-3">
                      {!storage ? (
                        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                          <div className="text-2xl mb-2">⚠️</div>
                          <div className="text-sm text-slate-300">Image upload disabled</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Firebase Storage requires a paid plan. Images are stored as external URLs only.
                          </div>
                          <div className="mt-3 text-xs text-slate-400">
                            You can still paste image URLs in the question text.
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Paste Area */}
                          <div
                            tabIndex={0}
                            onPaste={onPaste}
                            className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center hover:border-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer bg-slate-800/50"
                          >
                            <div className="text-2xl mb-1">📋</div>
                            <div className="text-sm text-slate-300">Click here → Press Ctrl+V to paste</div>
                            <div className="text-xs text-slate-500">Use Snipping Tool → Copy → Ctrl+V</div>
                          </div>

                          {/* File Upload */}
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImageFile(f); }}
                              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Image Preview */}
                      {selected.imagePath && (
                        <div className="mt-2">
                          <img src={selected.imagePath} alt="" className="max-h-32 rounded-lg border border-slate-600" />
                          <div className="text-xs text-slate-400 mt-1 break-all">{selected.imagePath}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Save Button - Always Visible */}
                <div className="lg:sticky lg:bottom-0 pt-4 pb-2 bg-slate-800">
                  <div className="flex gap-2">
                    <button disabled={loading} onClick={save} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold flex items-center justify-center gap-2">
                      <Save className="w-5 h-5"/> Save Question
                    </button>
                    {selected.id && (
                      <button disabled={loading} onClick={remove} className="px-4 py-3 rounded-xl bg-red-600/50 hover:bg-red-600">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  )
}

// Migration Panel Component
function MigrationPanel() {
  const { status, progress, logs, startMigration } = useMigration()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={startMigration}
          disabled={status === 'running'}
          className={`px-4 py-2 rounded-lg font-medium ${
            status === 'running'
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-500'
          }`}
        >
          {status === 'running' ? 'Migrating...' : 'Start Migration'}
        </button>
        
        {status === 'complete' && (
          <span className="text-green-400">✅ Migration Complete</span>
        )}
        {status === 'error' && (
          <span className="text-red-400">❌ Migration Failed</span>
        )}
      </div>

      {/* Progress */}
      <div className="text-sm">
        <div className="flex justify-between mb-1">
          <span>Progress: {progress.migrated} / {progress.total}</span>
          <span className={progress.errors > 0 ? 'text-red-400' : 'text-slate-400'}>
            Errors: {progress.errors}
          </span>
        </div>
        {progress.total > 0 && (
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${(progress.migrated / progress.total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Logs */}
      <div className="bg-slate-900 rounded-lg p-3 max-h-48 overflow-y-auto">
        <div className="text-xs text-slate-500 mb-2">Migration Log:</div>
        {logs.length === 0 ? (
          <div className="text-sm text-slate-500">Click "Start Migration" to begin</div>
        ) : (
          <div className="space-y-1 text-xs font-mono">
            {logs.map((log, i) => (
              <div key={i} className="text-slate-300">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
