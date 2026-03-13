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
      const path = `${selected.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      const url = data.publicUrl

      setSelected({
        ...selected,
        imageRequired: true,
        imagePath: url,
      })
      setSaveStatus('Image uploaded (remember to Save)')
    } catch (e: any) {
      setSaveStatus(e?.message || 'Image upload failed')
    } finally {
      setLoading(false)
    }
  }

  const onPaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items)
    const img = items.find((it) => it.type.startsWith('image/'))
    if (!img) return
    const file = img.getAsFile()
    if (!file) return
    await uploadImageFile(file)
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
    <div className="p-4 space-y-4" onPaste={onPaste}>
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
            {results.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selected?.id === q.id ? 'bg-blue-500/20' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="text-sm font-semibold">{q.id}</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">{q.subject}</div>
                  {q.imageRequired && <div className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">IMG</div>}
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
              <input
                className="w-full p-3 rounded-xl bg-slate-700"
                value={selected.id}
                onChange={(e) => setSelected({ ...selected, id: e.target.value })}
                placeholder="id"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.subject}
                  onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
                  placeholder="subject"
                />
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.topic}
                  onChange={(e) => setSelected({ ...selected, topic: e.target.value })}
                  placeholder="topic"
                />
              </div>
              <textarea
                className="w-full p-3 rounded-xl bg-slate-700 min-h-[120px]"
                value={selected.question}
                onChange={(e) => setSelected({ ...selected, question: e.target.value })}
                placeholder="question"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.source?.pdf || ''}
                  onChange={(e) => setSelected({ ...selected, source: { ...selected.source, pdf: e.target.value } })}
                  placeholder="source.pdf"
                />
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={String(selected.source?.question_number || '')}
                  onChange={(e) => setSelected({ ...selected, source: { ...selected.source, question_number: e.target.value } })}
                  placeholder="source.question_number"
                />
              </div>

              <textarea
                className="w-full p-3 rounded-xl bg-slate-700 min-h-[96px]"
                value={JSON.stringify(selected.source || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setSelected({ ...selected, source: parsed })
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
                placeholder="source (JSON)"
              />

              <textarea
                className="w-full p-3 rounded-xl bg-slate-700 min-h-[96px]"
                value={selected.table ? JSON.stringify(selected.table, null, 2) : ''}
                onChange={(e) => {
                  const v = e.target.value.trim()
                  if (!v) {
                    setSelected({ ...selected, table: undefined })
                    return
                  }
                  try {
                    const parsed = JSON.parse(v)
                    setSelected({ ...selected, table: parsed })
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
                placeholder="table (JSON)"
              />

              <div className="space-y-2">
                {(selected.options || []).map((opt, idx) => (
                  <input
                    key={idx}
                    className="w-full p-3 rounded-xl bg-slate-700"
                    value={opt}
                    onChange={(e) => {
                      const next = [...(selected.options || [])]
                      next[idx] = e.target.value
                      setSelected({ ...selected, options: next })
                    }}
                    placeholder={`Option ${idx}`}
                  />
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="w-full p-3 rounded-xl bg-slate-700"
                    type="number"
                    value={selected.correctAnswer}
                    onChange={(e) => setSelected({ ...selected, correctAnswer: Number(e.target.value) })}
                    placeholder="correctAnswer (0-3)"
                  />
                  <input
                    className="w-full p-3 rounded-xl bg-slate-700"
                    type="number"
                    value={selected.marks}
                    onChange={(e) => setSelected({ ...selected, marks: Number(e.target.value) })}
                    placeholder="marks"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Image</div>
                  {selected.imageRequired && (
                    <div className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">imageRequired: true</div>
                  )}
                </div>
                <div className="text-xs text-slate-300">Paste an image here (Ctrl+V) or upload a file.</div>
                <input
                  className="w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) uploadImageFile(f)
                  }}
                />
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.imagePath || ''}
                  onChange={(e) => setSelected({ ...selected, imagePath: e.target.value, imageRequired: true })}
                  placeholder="imagePath (URL)"
                />
                <input
                  className="w-full p-3 rounded-xl bg-slate-700"
                  value={selected.imageNote || ''}
                  onChange={(e) => setSelected({ ...selected, imageNote: e.target.value })}
                  placeholder="imageNote"
                />
              </div>

              <div className="flex gap-2">
                <button
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
                  onClick={save}
                >
                  Save
                </button>
                <button
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50"
                  onClick={remove}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
