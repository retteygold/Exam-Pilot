import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { useExamStore } from '../store/examStore'

export function Exam() {
  const navigate = useNavigate()
  const {
    examMode,
    questions,
    currentIndex,
    answers,
    isComplete,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishExam,
  } = useExamStore()

  const [selected, setSelected] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  
  // Timer for exam mode
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes default
  
  useEffect(() => {
    if (examMode === 'exam' && !isComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examMode, isComplete, finishExam])

  // Redirect if no exam active
  useEffect(() => {
    if (questions.length === 0) {
      navigate('/papers')
    }
  }, [questions, navigate])

  const question = questions[currentIndex]
  if (!question) return null

  const hasAnswered = answers[question.id] !== undefined
  const isLast = currentIndex === questions.length - 1
  const answeredCount = Object.keys(answers).length

  const handleSelect = (index: number) => {
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return
    
    const correct = selected === question.correctAnswer
    answerQuestion(question.id, selected, correct)
    setSelected(null)
    
    if (!isLast) {
      nextQuestion()
    }
  }

  const handleFinish = () => {
    finishExam()
    navigate('/results')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/papers')}
            className="flex items-center gap-1 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" /> Exit
          </button>
          
          {examMode === 'exam' && (
            <div className={`flex items-center gap-1 font-mono ${
              timeLeft < 300 ? 'text-red-400' : 'text-slate-300'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-slate-400">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 h-2 bg-slate-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
              {question.marks} mark{question.marks > 1 ? 's' : ''}
            </span>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full uppercase">
              {question.topic}
            </span>
          </div>

          <h3 className="text-lg mb-4 leading-relaxed">{question.question}</h3>

          {/* Image Required Notice */}
          {question.imageRequired && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">Diagram/Image Required</span>
              </div>
              <p className="text-xs text-slate-400">
                This question references a diagram or figure from the original paper.
                View page {question.imagePage} in the PDF: {question.source?.pdf}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Image path: {question.imagePath}
              </p>

              {question.imagePath && (
                <div className="mt-3">
                  <img
                    src={question.imagePath}
                    alt="Question figure"
                    className="w-full max-h-[420px] object-contain rounded-lg border border-slate-700"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          )}

          {/* Table - if present */}
          {question.table && (
            <div className="mb-6 overflow-x-auto">
              {question.table.title && (
                <h4 className="text-sm font-semibold text-slate-300 mb-2 text-center">{question.table.title}</h4>
              )}
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {question.table.columns.map((col, i) => (
                      <th key={i} className="border border-slate-600 px-2 py-1 text-left bg-slate-700/50 text-slate-300">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-slate-600 px-2 py-1 text-slate-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                  hasAnswered
                    ? idx === question.correctAnswer
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : answers[question.id]?.selected === idx
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-slate-700'
                    : selected === idx
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                  hasAnswered
                    ? idx === question.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : answers[question.id]?.selected === idx
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600'
                    : selected === idx
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600'
                }`}>
                  {hasAnswered && idx === question.correctAnswer ? (
                    <Check className="w-4 h-4" />
                  ) : hasAnswered && answers[question.id]?.selected === idx ? (
                    <X className="w-4 h-4" />
                  ) : (
                    letters[idx]
                  )}
                </span>
                <span className="text-left">{opt}</span>
              </button>
            ))}
          </div>

          {/* Answer Feedback */}
          {hasAnswered && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-xl">
              <p className="text-sm">
                <strong className={answers[question.id]?.correct ? 'text-emerald-400' : 'text-red-400'}>
                  {answers[question.id]?.correct ? 'Correct!' : 'Incorrect'}
                </strong>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Correct answer: {letters[question.correctAnswer]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions - Fixed for mobile visibility */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-800 border-t border-slate-700 pb-safe z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="p-3 bg-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {!hasAnswered ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-xl font-semibold transition-colors"
              >
                {isLast ? 'Finish' : 'Submit & Next'}
              </button>
            ) : (
              <button
                onClick={isLast ? handleFinish : nextQuestion}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors"
              >
                {isLast ? 'Finish Exam' : 'Next Question'}
              </button>
            )}

            <button
              onClick={nextQuestion}
              disabled={isLast}
              className="p-3 bg-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Finish Button */}
          {examMode === 'exam' && answeredCount > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Finish Early ({answeredCount}/{questions.length} answered)
            </button>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-24" />

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Finish Exam?</h3>
            <p className="text-slate-400 mb-4">
              You've answered {answeredCount} of {questions.length} questions. 
              {answeredCount < questions.length && ' Unanswered questions will be marked incorrect.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
