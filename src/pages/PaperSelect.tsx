import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Target, Award, FileText, Calendar, User, Beaker, Calculator } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { useUserStore } from '../store/userStore'
import type { Question } from '../types'

interface Paper {
  id: string
  subject: string
  subjectName: string
  code: string
  year: number
  session: string
  paper: string
  totalQuestions: number
  timeAllowed: number
  verifiedCount: number
}

export function PaperSelect() {
  const navigate = useNavigate()
  const startExam = useExamStore((state: { startExam: (questions: Question[], mode: 'practice' | 'exam', paper: string) => void }) => state.startExam)
  const { profile, getRecommendedDifficulty } = useUserStore()
  
  const [papers, setPapers] = useState<Paper[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMode, setSelectedMode] = useState<'practice' | 'exam'>('practice')
  const [recommendedDifficulty, setRecommendedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [selectedSubject, setSelectedSubject] = useState<'accounting' | 'biology' | 'igcse_biology'>('accounting')
  const [subjectData, setSubjectData] = useState<{[key: string]: {total: number, verified: number}}>({})

  useEffect(() => {
    setRecommendedDifficulty(getRecommendedDifficulty())
    
    // Load all subjects
    Promise.all([
      fetch(`/questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []})),
      fetch(`/biology_questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []})),
      fetch(`/igcse_biology_0610_questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []}))
    ]).then(([accountingData, biologyData, igcseBioData]) => {
      const stats: {[key: string]: {total: number, verified: number}} = {}
      
      // Process Accounting
      const accQuestions = (accountingData.questions || []).map((q: Question) => ({...q, _subject: 'accounting'}))
      stats.accounting = {
        total: accQuestions.length,
        verified: accQuestions.filter((q: Question) => q.verified).length
      }
      
      // Process Biology
      const bioQuestions = (biologyData.questions || []).map((q: Question) => ({...q, _subject: 'biology'}))
      stats.biology = {
        total: bioQuestions.length,
        verified: bioQuestions.filter((q: Question) => q.verified).length
      }

      // Process IGCSE Biology 0610
      const igcseBioQuestions = (igcseBioData.questions || []).map((q: Question) => ({...q, _subject: 'igcse_biology'}))
      stats.igcse_biology = {
        total: igcseBioQuestions.length,
        verified: igcseBioQuestions.filter((q: Question) => q.verified).length
      }
      
      // Combine
      const combined = [...accQuestions, ...bioQuestions, ...igcseBioQuestions]
      
      const filtered = combined.filter((q: Question) => {
        const questionDifficulty = q.difficulty || 'medium'
        const difficultyMatch = selectedMode === 'exam' ? true : 
          recommendedDifficulty === 'easy' ? questionDifficulty === 'easy' :
          recommendedDifficulty === 'hard' ? questionDifficulty !== 'easy' :
          true
        return difficultyMatch
      })
      
      setQuestions(filtered)
      setSubjectData(stats)
      
      // Group by paper
      const paperMap = new Map<string, Paper>()
      filtered.forEach((q: Question) => {
        const source = q.source || {}
        const subject = (q.subject || 'accounting').toLowerCase()
        const code = subject === 'accounting' ? '7707' : subject === 'biology' ? '5090' : '0610'
        const key = `${subject}_${source.pdf || 'unknown'}_${source.year}_${source.session}_${source.paper}`
        
        if (!paperMap.has(key)) {
          paperMap.set(key, {
            id: key,
            subject: subject,
            subjectName: subject === 'accounting' ? 'Accounting' : subject === 'biology' ? 'Biology' : 'Biology',
            code: code,
            year: source.year || 2020,
            session: source.session || 'May/June',
            paper: source.paper || '11',
            totalQuestions: 0,
            timeAllowed: subject === 'accounting' ? 45 : subject === 'biology' ? 60 : 45,
            verifiedCount: 0
          })
        }
        
        const paper = paperMap.get(key)!
        paper.totalQuestions++
        if (q.verified) paper.verifiedCount++
      })
      
      setPapers(Array.from(paperMap.values()).sort((a, b) => b.year - a.year))
      setLoading(false)
    })
  }, [getRecommendedDifficulty, recommendedDifficulty, selectedMode])

  const handleStart = (paper: Paper) => {
    const paperQuestions = questions.filter((q: Question) => {
      const source = q.source || {}
      const subject = (q.subject || 'accounting').toLowerCase()
      const key = `${subject}_${source.pdf || 'unknown'}_${source.year}_${source.session}_${source.paper}`
      return key === paper.id
    })
    
    if (paperQuestions.length === 0) return
    
    const subjectName = selectedSubject === 'accounting' ? 'Accounting' : 'Biology'
    startExam(paperQuestions, selectedMode, `${subjectName} ${paper.code} Paper ${paper.paper} ${paper.year}`)
    navigate('/exam')
  }

  // Filter papers by selected subject
  const filteredPapers = papers.filter(p => p.subject === selectedSubject)
  const currentStats = subjectData[selectedSubject] || { total: 0, verified: 0 }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Welcome, Student!</h2>
            <p className="text-blue-100 text-sm">
              Grade {profile?.grade} • {profile?.skillLevel} Level
            </p>
          </div>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-2 text-emerald-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-sm">100% Verified</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Official Cambridge O-Level • Answers verified from mark schemes
        </p>
      </div>

      {/* Subject Selector */}
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Select Subject</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedSubject('accounting')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'accounting'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Calculator className="w-5 h-5 mb-2" />
            <div className="font-semibold">Accounting</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.accounting?.total || 0} questions • {subjectData.accounting?.verified || 0} verified
            </div>
          </button>
          
          <button
            onClick={() => setSelectedSubject('biology')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'biology'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Beaker className="w-5 h-5 mb-2" />
            <div className="font-semibold">Biology</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.biology?.total || 0} questions • {subjectData.biology?.verified || 0} verified
            </div>
          </button>

          <button
            onClick={() => setSelectedSubject('igcse_biology')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'igcse_biology'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Beaker className="w-5 h-5 mb-2" />
            <div className="font-semibold">Biology</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.igcse_biology?.total || 0} questions • {subjectData.igcse_biology?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">IGCSE • 0610</div>
          </button>
        </div>
      </div>
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Choose Mode</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('practice')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedMode === 'practice'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <BookOpen className="w-6 h-6 mb-2" />
            <div className="font-semibold">Practice</div>
            <div className="text-sm opacity-80">No timer, study at your pace</div>
          </button>
          
          <button
            onClick={() => setSelectedMode('exam')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedMode === 'exam'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Clock className="w-6 h-6 mb-2" />
            <div className="font-semibold">Exam</div>
            <div className="text-sm opacity-80">Timed, real exam conditions</div>
          </button>
        </div>
      </div>

      {/* Papers List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedSubject === 'accounting' ? 'Accounting' : 'Biology'} Papers ({filteredPapers.length})
        </h2>
        <div className="space-y-3">
          {filteredPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => handleStart(paper)}
              className="w-full p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    paper.subject === 'accounting' ? 'bg-blue-500/20' : 'bg-green-500/20'
                  }`}>
                    {paper.subject === 'accounting' ? '📊' : '🧬'}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {paper.code} Paper {paper.paper}
                    </div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {paper.year} {paper.session}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-slate-400">{paper.totalQuestions} questions</div>
                  {paper.verifiedCount > 0 && (
                    <div className="text-xs text-emerald-400">
                      {Math.round((paper.verifiedCount / paper.totalQuestions) * 100)}% verified
                    </div>
                  )}
                  {selectedMode === 'exam' && (
                    <div className="text-xs text-slate-500">{paper.timeAllowed} min</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-slate-800 rounded-xl text-center">
          <FileText className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-bold">{filteredPapers.length}</div>
          <div className="text-xs text-slate-400">Papers</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
          <div className="text-2xl font-bold">{currentStats.total}</div>
          <div className="text-xs text-slate-400">Questions</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl text-center">
          <Award className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <div className="text-2xl font-bold">{selectedSubject === 'accounting' ? '7707' : selectedSubject === 'biology' ? '5090' : '0610'}</div>
          <div className="text-xs text-slate-400">Code</div>
        </div>
      </div>
    </div>
  )
}
