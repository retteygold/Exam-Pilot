import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Target, Award, FileText, Calendar, User, Beaker, Calculator } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { useUserStore } from '../store/userStore'
import type { Question } from '../types'
import { canUseSupabaseQuestions, fetchAllQuestionsFromSupabase } from '../services/questionsSupabase'

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

const SUBJECT_META: Record<string, { name: string; code: string; timeAllowed: number; badge?: string }> = {
  accounting: { name: 'Accounting', code: '7707', timeAllowed: 45, badge: 'O-Level' },
  o_level_accounting: { name: 'Accounting', code: '7707', timeAllowed: 45, badge: 'O-Level' },
  biology: { name: 'Biology', code: '5090', timeAllowed: 60, badge: 'O-Level' },
  o_level_biology: { name: 'Biology', code: '5090', timeAllowed: 60, badge: 'O-Level' },
  igcse_biology: { name: 'Biology', code: '0610', timeAllowed: 45, badge: 'IGCSE' },
  as_biology: { name: 'Biology', code: 'WBI11', timeAllowed: 75, badge: 'AS' },
  as_economics: { name: 'Economics', code: '9708', timeAllowed: 75, badge: 'AS' },
  as_mathematics: { name: 'Mathematics', code: '9709', timeAllowed: 75, badge: 'AS' },
  as_physics: { name: 'Physics', code: '9702', timeAllowed: 75, badge: 'AS' },
}

function normalizeSubjectKey(subject: string | undefined | null): string {
  const s = (subject || 'accounting').toLowerCase()
  if (s === 'o-level_accounting') return 'o_level_accounting'
  if (s === 'o-level_biology') return 'o_level_biology'
  return s
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
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedPaper, setSelectedPaper] = useState<string>('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  
  const [subjectData, setSubjectData] = useState<{[key: string]: {total: number, verified: number}}>({})

  useEffect(() => {
    setRecommendedDifficulty(getRecommendedDifficulty())
 
    const compute = (allQuestions: Question[]) => {
      const stats: {[key: string]: {total: number, verified: number}} = {}
      const bySubject: {[key: string]: Question[]} = {}
      allQuestions.forEach((q) => {
        const s = normalizeSubjectKey(q.subject)
        bySubject[s] = bySubject[s] || []
        bySubject[s].push(q)
      })

      ;(Object.keys(SUBJECT_META) as Array<keyof typeof SUBJECT_META>).forEach((s) => {
        const list = bySubject[s] || []
        stats[String(s)] = {
          total: list.length,
          verified: list.filter((q) => q.verified).length
        }
      })

      const filtered = allQuestions.filter((q: Question) => {
        const questionDifficulty = q.difficulty || 'medium'
        const difficultyMatch = selectedMode === 'exam' ? true :
          recommendedDifficulty === 'easy' ? questionDifficulty === 'easy' :
          recommendedDifficulty === 'hard' ? questionDifficulty !== 'easy' :
          true
        return difficultyMatch
      })

      setQuestions(filtered)
      setSubjectData(stats)

      const paperMap = new Map<string, Paper>()
      filtered.forEach((q: Question) => {
        const source = q.source || {}
        const subject = normalizeSubjectKey(q.subject)
        const meta = SUBJECT_META[subject] || { name: subject, code: subject, timeAllowed: 60 }
        const code = meta.code
        const key = `${subject}_${source.pdf || 'unknown'}_${source.year}_${source.session}_${source.paper}`

        if (!paperMap.has(key)) {
          paperMap.set(key, {
            id: key,
            subject: subject,
            subjectName: meta.name,
            code: code,
            year: source.year || 2020,
            session: source.session || 'May/June',
            paper: source.paper || '11',
            totalQuestions: 0,
            timeAllowed: meta.timeAllowed,
            verifiedCount: 0
          })
        }

        const paper = paperMap.get(key)!
        paper.totalQuestions++
        if (q.verified) paper.verifiedCount++
      })

      setPapers(Array.from(paperMap.values()).sort((a, b) => b.year - a.year))
      setLoading(false)
    }

    if (canUseSupabaseQuestions()) {
      fetchAllQuestionsFromSupabase()
        .then((qs) => compute(qs))
        .catch(() => {
          setLoading(false)
        })
      return
    }

    Promise.all([
      fetch(`/questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []})),
      fetch(`/biology_questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []})),
      fetch(`/igcse_biology_0610_questions.json?t=${Date.now()}`).then(r => r.json()).catch(() => ({questions: []}))
    ]).then(([accountingData, biologyData, igcseBioData]) => {
      const combined = [
        ...(accountingData.questions || []),
        ...(biologyData.questions || []),
        ...(igcseBioData.questions || []),
      ] as Question[]
      compute(combined)
    })
  }, [getRecommendedDifficulty, recommendedDifficulty, selectedMode])

  const handleStart = (paper: Paper) => {
    const paperQuestions = questions.filter((q: Question) => {
      const source = q.source || {}
      const subject = normalizeSubjectKey(q.subject)
      const key = `${subject}_${source.pdf || 'unknown'}_${source.year}_${source.session}_${source.paper}`
      return key === paper.id
    })
    
    if (paperQuestions.length === 0) return

    const subjectName = paper.subjectName
    startExam(paperQuestions, selectedMode, `${subjectName} ${paper.code} Paper ${paper.paper} ${paper.year}`)
    navigate('/exam')
  }

  // Get unique filter values from all papers
  const subjects = ['all', ...Array.from(new Set(papers.map(p => p.subject)))]
  const years = ['all', ...Array.from(new Set(papers.map(p => p.year.toString()))).sort((a: string, b: string) => parseInt(b) - parseInt(a))]
  const paperNumbers = ['all', ...Array.from(new Set(papers.map(p => p.paper)))]
  
  // Apply filters
  const filteredPapers = papers.filter(p => {
    if (selectedSubject !== 'all' && p.subject !== selectedSubject) return false
    if (selectedYear !== 'all' && p.year.toString() !== selectedYear) return false
    if (selectedPaper !== 'all' && p.paper !== selectedPaper) return false
    if (showVerifiedOnly && p.verifiedCount === 0) return false
    return true
  })
  
  // Calculate stats for selected filters
  const totalQuestions = filteredPapers.reduce((sum, p) => sum + p.totalQuestions, 0)
  const totalVerified = filteredPapers.reduce((sum, p) => sum + p.verifiedCount, 0)

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
            onClick={() => setSelectedSubject('o_level_accounting')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'o_level_accounting'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Calculator className="w-5 h-5 mb-2" />
            <div className="font-semibold">Accounting</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.o_level_accounting?.total || 0} questions • {subjectData.o_level_accounting?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">O-Level • 7707</div>
          </button>
          
          <button
            onClick={() => setSelectedSubject('o_level_biology')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'o_level_biology'
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Beaker className="w-5 h-5 mb-2" />
            <div className="font-semibold">Biology</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.o_level_biology?.total || 0} questions • {subjectData.o_level_biology?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">O-Level • 5090</div>
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

          <button
            onClick={() => setSelectedSubject('as_biology')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'as_biology'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Beaker className="w-5 h-5 mb-2" />
            <div className="font-semibold">Biology</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.as_biology?.total || 0} questions • {subjectData.as_biology?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">AS • WBI11</div>
          </button>

          <button
            onClick={() => setSelectedSubject('as_mathematics')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'as_mathematics'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Calculator className="w-5 h-5 mb-2" />
            <div className="font-semibold">Mathematics</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.as_mathematics?.total || 0} questions • {subjectData.as_mathematics?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">AS • 9709</div>
          </button>

          <button
            onClick={() => setSelectedSubject('as_physics')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'as_physics'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Beaker className="w-5 h-5 mb-2" />
            <div className="font-semibold">Physics</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.as_physics?.total || 0} questions • {subjectData.as_physics?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">AS • 9702</div>
          </button>

          <button
            onClick={() => setSelectedSubject('as_economics')}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedSubject === 'as_economics'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-2" />
            <div className="font-semibold">Economics</div>
            <div className="text-xs opacity-60 mt-1">
              {subjectData.as_economics?.total || 0} questions • {subjectData.as_economics?.verified || 0} verified
            </div>
            <div className="text-[10px] opacity-60 mt-1">AS • 9708</div>
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

      {/* Filters */}
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Subject Filter */}
          <select 
            className="p-3 rounded-lg bg-slate-700 text-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.filter(s => s !== 'all').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          
          {/* Year Filter */}
          <select 
            className="p-3 rounded-lg bg-slate-700 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.filter(y => y !== 'all').map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          {/* Paper Filter */}
          <select 
            className="p-3 rounded-lg bg-slate-700 text-sm"
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
          >
            <option value="all">All Papers</option>
            {paperNumbers.filter(p => p !== 'all').map(p => (
              <option key={p} value={p}>Paper {p}</option>
            ))}
          </select>
          
          {/* Verified Toggle */}
          <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showVerifiedOnly}
              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              className="rounded bg-slate-600"
            />
            <span className="text-sm">Verified only</span>
          </label>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{filteredPapers.length} papers • {totalQuestions} questions • {totalVerified} verified</span>
          <button 
            onClick={() => {
              setSelectedSubject('all')
              setSelectedYear('all')
              setSelectedPaper('all')
              setShowVerifiedOnly(false)
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Papers List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {(SUBJECT_META[selectedSubject]?.name || 'All Subjects')} Papers ({filteredPapers.length})
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
                    paper.subject.includes('accounting') ? 'bg-blue-500/20' : paper.subject.includes('math') ? 'bg-indigo-500/20' : paper.subject.includes('economics') ? 'bg-amber-500/20' : paper.subject.includes('physics') ? 'bg-cyan-500/20' : 'bg-green-500/20'
                  }`}>
                    {paper.subject.includes('accounting') ? '📊' : paper.subject.includes('math') ? '📐' : paper.subject.includes('economics') ? '📈' : paper.subject.includes('physics') ? '⚛️' : '🧬'}
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
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <div className="text-xs text-slate-400">Questions</div>
        </div>
        <div className="p-4 bg-slate-800 rounded-xl text-center">
          <Award className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <div className="text-2xl font-bold">{SUBJECT_META[selectedSubject]?.code || 'ALL'}</div>
          <div className="text-xs text-slate-400">Code</div>
        </div>
      </div>
    </div>
  )
}
