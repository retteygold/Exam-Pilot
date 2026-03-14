import { useEffect, useState } from 'react'
import type { ClipboardEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Question } from '../types'
import { canUseSupabaseQuestions, deleteQuestion, fetchAllQuestionsFromSupabase, upsertQuestion } from '../services/questionsSupabase'
import { Save, Trash2, Plus, Image, ChevronDown, ChevronUp, Check } from 'lucide-react'

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

  const canUseSupabase = canUseSupabaseQuestions()

  // Load all questions on mount
  useEffect(() => {
    if (!canUseSupabase) return

    const loadQuestions = async () => {
      setLoading(true)
      try {
        const questions = await fetchAllQuestionsFromSupabase()
        setAllQuestions(questions)
        setResults(questions.slice(0, 100)) // Show first 100
      } catch (e) {
        console.error('Failed to load questions:', e)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [canUseSupabase])

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
    if (!canUseSupabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email || null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSessionEmail(newSession?.user.email || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [canUseSupabase])

  const signIn = async () => {
    setAuthError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setAuthError(error.message)
        return
      }
      setSessionEmail(data.user?.email || null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
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
      const questions = await fetchAllQuestionsFromSupabase()
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
      const qs = await fetchAllQuestionsFromSupabase()
      setAllQuestions(qs)
      setResults(qs.slice(0, 100))
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
      const qs = await fetchAllQuestionsFromSupabase()
      setAllQuestions(qs)
      setResults(qs.slice(0, 100))
    } catch (e: any) {
      setSaveStatus(e?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageFile = async (file: File) => {
    if (!selected) return
    setLoading(true)
    setSaveStatus(null)
    try {
      const bucket = 'question-images'
      const ext = (file.name.split('.').pop() || 'png').toLowerCase()
      // Sanitize the ID for storage path
      const safeId = selected.id.replace(/[^a-zA-Z0-9-_]/g, '_')
      const path = `${safeId}/${Date.now()}.${ext}`

      console.log('Uploading to bucket:', bucket, 'path:', path)
      
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type || 'image/png',
      })
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      const url = urlData.publicUrl

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

  if (!canUseSupabase) {
    return (
      <div className="p-4">
        <div className="p-4 bg-slate-800 rounded-xl text-center">Supabase not configured</div>
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
          {saveStatus && <span className="text-sm px-3 py-1 rounded-full bg-slate-700">{saveStatus}</span>}
          <button disabled={loading} onClick={signOut} className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm">Logout</button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
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
            <div className="max-h-[calc(100vh-480px)] overflow-y-auto">
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
                        <div className="text-sm font-medium truncate">{group.subject}</div>
                        <div className="text-xs text-slate-400 truncate" title={group.pdf}>
                          {group.year} • Paper {group.paper}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate" title={group.pdf}>
                          {group.pdf}
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
              <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800 sticky top-[73px] z-10">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{selected.id ? 'Edit' : 'New'}</span>
                  {selected.imagePath && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Has Image</span>}
                </div>
                <div className="flex gap-2">
                  <button disabled={loading} onClick={save} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold flex items-center gap-2">
                    <Save className="w-4 h-4"/> Save
                  </button>
                  {selected.id && (
                    <button disabled={loading} onClick={remove} className="px-3 py-2 rounded-lg bg-red-600/50 hover:bg-red-600">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Form */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                    </div>
                    {showImageSection ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                  </button>
                  
                  {showImageSection && (
                    <div className="p-4 space-y-3">
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
                <div className="sticky bottom-0 pt-4 pb-2 bg-slate-800">
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
      </div>
    </div>
  )
}
