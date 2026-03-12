import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, X, Eye, ArrowRight } from 'lucide-react'
import type { Question } from '../types'

export function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const questions: Question[] = location.state?.questions || []
  
  // Redirect if no questions
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/')
    }
  }, [questions, navigate])
  
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const question = questions[current]
  if (!question) return <div className="flex items-center justify-center h-full">Loading...</div>

  const options = Array.isArray(question.options) ? question.options : []
  if (options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-lg font-semibold mb-2">This question is not multiple-choice.</div>
        <div className="text-sm text-slate-400 mb-6">Pick a different question set.</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const handleCheck = () => {
    if (selected === null) return
    
    const correct = selected === question.correctAnswer
    if (correct) setScore((s: number) => s + question.marks)
    setAnswered((a: number) => a + 1)
    
    const saved = localStorage.getItem('gcse-prep-progress')
    const progress = saved ? JSON.parse(saved) : {}
    progress[question.id] = { correct, timestamp: Date.now() }
    localStorage.setItem('gcse-prep-progress', JSON.stringify(progress))
    
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c: number) => c + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      navigate('/results', { state: { score, total: questions.reduce((a, q) => a + q.marks, 0), answered } })
    }
  }

  const progress = ((current / questions.length) * 100).toFixed(0)
  const letters = ['A', 'B', 'C', 'D']

  const cleanText = (text: string) => {
    return text
      .replace(/^\d+\s+/, '')
      .replace(/[.\u2026]{6,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const parseMcqFromQuestion = (rawText: string) => {
    const text = cleanText(rawText)
    const idx = text.search(/\sA\s+/)
    if (idx === -1) {
      return { stem: text, parsedOptions: null as string[] | null }
    }

    const stem = text.slice(0, idx).trim()
    const tail = text.slice(idx).trim()
    const parsed: Record<string, string> = {}
    const re = /(?:^|\s)([A-D])\s+(.+?)(?=\s+[A-D]\s+|$)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(tail)) !== null) {
      parsed[m[1]] = m[2].trim()
    }

    const parsedOptions = letters.map((l) => parsed[l]).filter(Boolean)
    if (parsedOptions.length < 2) {
      return { stem: text, parsedOptions: null as string[] | null }
    }

    return { stem, parsedOptions }
  }

  const isLetterOnlyOptions =
    options.length === 4 && options.every((o) => typeof o === 'string' && o.trim().length === 1)
  const hasMarkers = (() => {
    const t = ` ${question.question} `
    return /\sA\s+/.test(t) && /\sB\s+/.test(t) && /\sC\s+/.test(t) && /\sD\s+/.test(t)
  })()

  const parsed = isLetterOnlyOptions && hasMarkers ? parseMcqFromQuestion(question.question) : null
  const stemText = parsed?.stem ?? cleanText(question.question)
  const displayOptions = parsed?.parsedOptions?.length === 4 ? parsed.parsedOptions : options.map((o) => cleanText(o))

  return (
    <div className="flex flex-col h-full p-4">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 bg-slate-800 rounded-2xl p-5 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
            {question.marks} mark{question.marks > 1 ? 's' : ''}
          </span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full uppercase">
            {question.topic}
          </span>
        </div>

        <h3 className="text-lg mb-6 leading-relaxed">{stemText}</h3>

        {/* Options */}
        <div className="space-y-3">
          {displayOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !showAnswer && setSelected(idx)}
              disabled={showAnswer}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                selected === idx 
                  ? showAnswer 
                    ? idx === question.correctAnswer
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : 'bg-red-500/20 border-2 border-red-500'
                    : 'bg-blue-500/20 border-2 border-blue-500'
                  : showAnswer && idx === question.correctAnswer
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                selected === idx
                  ? showAnswer
                    ? idx === question.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-slate-600'
              }`}>
                {showAnswer && idx === question.correctAnswer ? <Check className="w-4 h-4" /> : 
                 showAnswer && selected === idx && idx !== question.correctAnswer ? <X className="w-4 h-4" /> :
                 letters[idx]}
              </span>
              <span className="text-left">{opt}</span>
            </button>
          ))}
        </div>

        {/* Answer Section */}
        {showAnswer && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <p className="text-sm text-slate-300 mb-2">
              <strong className="text-emerald-400">Correct Answer:</strong> {letters[question.correctAnswer]}
            </p>
            <p className="text-sm text-slate-400">{question.explanation}</p>
            <p className="text-xs text-slate-500 mt-2">
              Source: {question.source.pdf} - {question.source.year} {question.source.session}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2">
        {!showAnswer ? (
          <>
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
            >
              Check Answer
            </button>
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> Show Answer
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {current < questions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
