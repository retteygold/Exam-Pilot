import { useEffect, useMemo, useState } from 'react'
import type { ClipboardEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Question } from '../types'

import { canUseSupabaseQuestions, deleteQuestion, fetchQuestionsByIdLike, fetchRecentQuestions, upsertQuestion } from '../services/questionsSupabase'

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
  const [queryId, setQueryId] = useState('')
  const [results, setResults] = useState<Question[]>([])
  const [selected, setSelected] = useState<Question | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const canUseSupabase = useMemo(() => canUseSupabaseQuestions(), [])

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

  const search = async () => {
    if (!queryId.trim()) return
    setLoading(true)
    setSaveStatus(null)
    try {
      const qs = await fetchQuestionsByIdLike(queryId.trim())
      setResults(qs)
      setSelected(qs[0] || null)
    } catch (e: any) {
      setSaveStatus(e?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const loadRecent = async () => {
    setLoading(true)
    setSaveStatus(null)
    try {
      const qs = await fetchRecentQuestions(50)
      setResults(qs)
      setSelected(qs[0] || null)
    } catch (e: any) {
      setSaveStatus(e?.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const createNew = () => {
    const q = makeEmptyQuestion()
    setSelected(q)
    setSaveStatus(null)
  }

  const save = async () => {
    if (!selected) return
    if (!selected.id.trim()) {
      setSaveStatus('ID is required')
      return
    }

    setLoading(true)
    setSaveStatus(null)
    try {
      await upsertQuestion({
        ...selected,
        imageRequired: Boolean(selected.imageRequired || selected.imagePath),
      })
      setSaveStatus('Saved')
      await search()
    } catch (e: any) {
      setSaveStatus(e?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!selected?.id) return
    setLoading(true)
    setSaveStatus(null)
    try {
      await deleteQuestion(selected.id)
      setSaveStatus('Deleted')
      setSelected(null)
      await search()
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
      
      const { error: uploadError, data } = await supabase.storage.from(bucket).upload(path, file, {
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

  const onPasteAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Focus the div to ensure it can receive paste events
    e.currentTarget.focus()
  }

  if (!canUseSupabase) {
    return (
      <div className="p-4">
        <div className="p-4 bg-slate-800 rounded-xl">
          Supabase env vars are missing.
        </div>
      </div>
    )
  }

  if (!sessionEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4">
              <img 
                src="/storyset/Health professional team-amico.svg" 
                alt="Admin" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage questions and content</p>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <input
              className="w-full p-3 rounded-xl bg-slate-700"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-700"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authError && <div className="text-sm text-red-400">{authError}</div>}
            <button
              disabled={loading}
              className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
              onClick={signIn}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="p-4 bg-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img 
              src="/storyset/Doctors-rafiki.svg" 
              alt="" 
              className="w-full h-full object-contain opacity-80"
            />
          </div>
          <div>
            <div className="font-semibold">Admin</div>
            <div className="text-xs text-slate-400">{sessionEmail}</div>
          </div>
        </div>
        <button
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>

      {/* How To Use - Instructions */}
      <div className="p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-2xl space-y-2">
        <div className="font-semibold text-emerald-400 flex items-center gap-2">
          <span>How to Edit Questions</span>
        </div>
        <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
          <li><strong>Search</strong> for a question by ID (e.g., <code>0610-y2024-p11-q2</code>) or click <strong>Recent</strong></li>
          <li>Click the question in the <strong>Results</strong> list to select it</li>
          <li>Edit the <strong>Question text</strong> or <strong>Options</strong> (A, B, C, D)</li>
          <li>Change <strong>Correct Answer</strong> (0=A, 1=B, 2=C, 3=D)</li>
          <li>Click <strong>Save</strong> to save changes</li>
        </ol>
        <div className="mt-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="font-medium text-amber-400 text-sm mb-1">Quick Image Add (Snipping Tool)</div>
          <div className="text-xs text-slate-400">
            1. Use Snipping Tool to copy image → 2. Click on this page → 3. Press <strong>Ctrl+V</strong> to paste → 4. Click Save
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-800 rounded-2xl space-y-3">
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-xl bg-slate-700"
            placeholder="Search by question id (e.g. 0610-y2024-p11-q2)"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          />
          <button
            disabled={loading}
            className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            onClick={search}
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
            onClick={loadRecent}
          >
            Recent
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
            onClick={createNew}
          >
            New
          </button>
          {saveStatus && <div className="text-sm text-slate-300 self-center">{saveStatus}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 p-4 bg-slate-800 rounded-2xl">
          <div className="text-sm font-semibold mb-2">Results</div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {results.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-4">No questions found. Search or click Recent.</div>
            )}
            {results.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selected?.id === q.id ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold truncate">{q.id}</div>
                  {!q.imageRequired && !q.imagePath && (
                    <div className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">NO IMG</div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-slate-400">{q.subject}</div>
                  {q.imagePath && <div className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">IMG</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-4 bg-slate-800 rounded-2xl space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="text-sm font-semibold">Editor</div>
          {!selected ? (
            <div className="text-sm text-slate-400">Select a question or create a new one.</div>
          ) : (
            <>
              {/* Question ID */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Question ID</label>
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.id}
                  onChange={(e) => setSelected({ ...selected, id: e.target.value })}
                  placeholder="e.g. 0610-y2024-p11-q2"
                />
              </div>

              {/* Subject & Topic */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Subject</label>
                  <select
                    className="w-full p-3 rounded-xl bg-slate-700"
                    value={selected.subject}
                    onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
                  >
                    <option value="biology">O-Level Biology (5090)</option>
                    <option value="igcse_biology">IGCSE Biology (0610)</option>
                    <option value="accounting">Accounting (7707)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Topic</label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-700"
                    value={selected.topic}
                    onChange={(e) => setSelected({ ...selected, topic: e.target.value })}
                    placeholder="e.g. photosynthesis"
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Question Text</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-slate-700 min-h-[100px]"
                  value={selected.question}
                  onChange={(e) => setSelected({ ...selected, question: e.target.value })}
                  placeholder="Type the question here..."
                />
              </div>

              {/* Options A-D */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">Options (A, B, C, D)</label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-sm font-semibold text-slate-400">{letter}.</span>
                    <input
                      className="flex-1 p-3 rounded-xl bg-slate-700"
                      value={selected.options?.[idx] || ''}
                      onChange={(e) => {
                        const next = [...(selected.options || ['', '', '', ''])]
                        next[idx] = e.target.value
                        setSelected({ ...selected, options: next })
                      }}
                      placeholder={`Option ${letter}`}
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer & Marks */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Correct Answer (0=A, 1=B, 2=C, 3=D)</label>
                  <select
                    className="w-full p-3 rounded-xl bg-slate-700"
                    value={selected.correctAnswer}
                    onChange={(e) => setSelected({ ...selected, correctAnswer: Number(e.target.value) })}
                  >
                    <option value={0}>A (0)</option>
                    <option value={1}>B (1)</option>
                    <option value={2}>C (2)</option>
                    <option value={3}>D (3)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Marks</label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-700"
                    type="number"
                    value={selected.marks}
                    onChange={(e) => setSelected({ ...selected, marks: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Image Section - Simplified */}
              <div className="p-4 bg-slate-700/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Image</div>
                  {selected.imageRequired && (
                    <div className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Has Image</div>
                  )}
                </div>
                
                {/* Paste Area - Focusable */}
                <div 
                  tabIndex={0}
                  className="p-6 border-2 border-dashed border-slate-600 rounded-xl text-center hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer bg-slate-800/50"
                  onClick={onPasteAreaClick}
                  onPaste={onPaste}
                >
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-sm text-slate-300 font-medium">Click here, then press <strong>Ctrl+V</strong> to paste image</div>
                  <div className="text-xs text-slate-500 mt-2">Use Snipping Tool → Copy → Click this box → Ctrl+V</div>
                </div>

                {/* Or Upload */}
                <div className="text-xs text-slate-500 text-center">or</div>
                <input
                  className="w-full text-sm"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) uploadImageFile(f)
                  }}
                />

                {/* Image Preview */}
                {selected.imagePath && (
                  <div className="mt-2">
                    <img 
                      src={selected.imagePath} 
                      alt="Question" 
                      className="max-h-40 rounded-lg border border-slate-600"
                    />
                    <div className="text-xs text-slate-400 mt-1 break-all">{selected.imagePath}</div>
                  </div>
                )}
              </div>

              {/* Save/Delete Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold"
                  onClick={save}
                >
                  💾 Save Question
                </button>
                <button
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-red-600/50 hover:bg-red-600 disabled:opacity-50"
                  onClick={remove}
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
