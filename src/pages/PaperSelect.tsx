import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Target, Award, FileText, Calendar, User, Beaker, Calculator, CheckCircle } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { useUserStore } from '../store/userStore'
import { getQuestions } from '../services/firebaseQuestions'
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

const SUBJECT_META: Record<string, { name: string; code: string; timeAllowed: number; badge?: string; examBoard?: string }> = {
  // === CAMBRIDGE IGCSE (O Level) ===
  igcse_biology: { name: 'Biology', code: '0610', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_chemistry: { name: 'Chemistry', code: '0620', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_physics: { name: 'Physics', code: '0625', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_mathematics: { name: 'Mathematics', code: '0580', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_accounting: { name: 'Accounting', code: '0452', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_economics: { name: 'Economics', code: '0455', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_business_studies: { name: 'Business Studies', code: '0450', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_computer_science: { name: 'Computer Science', code: '0478', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_english_first: { name: 'English (First Language)', code: '0500', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_english_second: { name: 'English (Second Language)', code: '0510', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },
  igcse_travel_tourism: { name: 'Travel & Tourism', code: '0471', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE' },

  // === PEARSON EDEXCEL IAL (A Level) ===
  ial_biology: { name: 'Biology', code: 'WBI11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_chemistry: { name: 'Chemistry', code: 'WCH11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_physics: { name: 'Physics', code: 'WPH11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_mathematics: { name: 'Mathematics', code: 'WMA11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_accounting: { name: 'Accounting', code: 'WAC11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_economics: { name: 'Economics', code: 'WEC11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },
  ial_business: { name: 'Business', code: 'WBS11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL' },

  // === CAMBRIDGE IAL (A Level) ===
  cambridge_ial_travel_tourism: { name: 'Travel & Tourism', code: '9395', timeAllowed: 75, badge: 'A-Level', examBoard: 'Cambridge IAL' },
  cambridge_ial_computer_science: { name: 'Computer Science', code: '9618', timeAllowed: 75, badge: 'A-Level', examBoard: 'Cambridge IAL' },
}

function normalizeSubjectKey(subject: string | undefined | null): string {
  let s = (subject || 'accounting').toLowerCase().trim()
  
  // Remove "unknown" prefix and clean up
  s = s.replace(/^unknown\s+/, '')

  // Normalize common separators early
  s = s.replace(/-/g, '_')
  s = s.replace(/\s+/g, '_')
  s = s.replace(/_+/g, '_')
  
  // === CAMBRIDGE IGCSE NORMALIZATION ===
  // Biology 0610
  if (s.includes('biology') && (s.includes('0610') || s.includes('igcse'))) {
    return 'igcse_biology'
  }
  // Chemistry 0620
  if (s.includes('chemistry') && (s.includes('0620') || s.includes('igcse'))) {
    return 'igcse_chemistry'
  }
  // Physics 0625
  if (s.includes('physics') && (s.includes('0625') || s.includes('igcse'))) {
    return 'igcse_physics'
  }
  // Mathematics 0580
  if ((s.includes('mathematics') || s.includes('math')) && (s.includes('0580') || s.includes('igcse'))) {
    return 'igcse_mathematics'
  }
  // Accounting 0452
  if (s.includes('accounting') && (s.includes('0452') || s.includes('igcse'))) {
    return 'igcse_accounting'
  }
  // Economics 0455
  if (s.includes('economics') && (s.includes('0455') || s.includes('igcse'))) {
    return 'igcse_economics'
  }
  // Business Studies 0450
  if (s.includes('business') && (s.includes('0450') || s.includes('igcse'))) {
    return 'igcse_business_studies'
  }
  // Computer Science 0478
  if ((s.includes('computer') || s.includes('cs')) && (s.includes('0478') || s.includes('igcse'))) {
    return 'igcse_computer_science'
  }
  // English First 0500
  if (s.includes('english') && s.includes('0500')) {
    return 'igcse_english_first'
  }
  // English Second 0510
  if (s.includes('english') && s.includes('0510')) {
    return 'igcse_english_second'
  }
  // Travel & Tourism 0471
  if ((s.includes('travel') || s.includes('tourism')) && (s.includes('0471') || s.includes('igcse'))) {
    return 'igcse_travel_tourism'
  }

  // === PEARSON EDEXCEL IAL NORMALIZATION ===
  // Biology WBI11
  if (s.includes('biology') && s.includes('wbi')) {
    return 'ial_biology'
  }
  // Chemistry WCH11
  if (s.includes('chemistry') && s.includes('wch')) {
    return 'ial_chemistry'
  }
  // Physics WPH11
  if (s.includes('physics') && s.includes('wph')) {
    return 'ial_physics'
  }
  // Mathematics WMA11
  if ((s.includes('mathematics') || s.includes('math')) && s.includes('wma')) {
    return 'ial_mathematics'
  }
  // Accounting WAC11
  if (s.includes('accounting') && s.includes('wac')) {
    return 'ial_accounting'
  }
  // Economics WEC11
  if (s.includes('economics') && s.includes('wec')) {
    return 'ial_economics'
  }
  // Business WBS11
  if (s.includes('business') && s.includes('wbs')) {
    return 'ial_business'
  }

  // === CAMBRIDGE IAL NORMALIZATION ===
  // Travel & Tourism 9395
  if ((s.includes('travel') || s.includes('tourism')) && s.includes('9395')) {
    return 'cambridge_ial_travel_tourism'
  }
  // Computer Science 9618
  if ((s.includes('computer') || s.includes('cs')) && s.includes('9618')) {
    return 'cambridge_ial_computer_science'
  }

  // Legacy fallback patterns
  if (s.startsWith('o_level_')) {
    if (s.includes('accounting')) return 'igcse_accounting'
    if (s.includes('biology')) return 'igcse_biology'
    if (s.includes('mathematics') || s.includes('math')) return 'igcse_mathematics'
    if (s.includes('physics')) return 'igcse_physics'
  }

  if (s.startsWith('as_')) {
    if (s.includes('accounting')) return 'ial_accounting'
    if (s.includes('biology')) return 'ial_biology'
    if (s.includes('business')) return 'ial_business'
    if (s.includes('economics')) return 'ial_economics'
    if (s.includes('mathematics') || s.includes('math')) return 'ial_mathematics'
    if (s.includes('physics')) return 'ial_physics'
    if (s.includes('travel') || s.includes('tourism')) return 'cambridge_ial_travel_tourism'
  }

  // Default: try to infer from subject name alone
  if (s.includes('biology')) return 'igcse_biology'
  if (s.includes('chemistry')) return 'igcse_chemistry'
  if (s.includes('physics')) return 'igcse_physics'
  if (s.includes('mathematics') || s.includes('math')) return 'igcse_mathematics'
  if (s.includes('accounting')) return 'igcse_accounting'
  if (s.includes('economics')) return 'igcse_economics'
  if (s.includes('business')) return 'igcse_business_studies'
  if (s.includes('computer')) return 'igcse_computer_science'
  if (s.includes('english')) return 'igcse_english_first'
  if (s.includes('travel') || s.includes('tourism')) return 'igcse_travel_tourism'

  return s
}

export function PaperSelect() {
  const navigate = useNavigate()
  const startExam = useExamStore((state) => state.startExam)
  const completedPapers = useExamStore((state) => state.completedPapers)
  const { profile, getRecommendedDifficulty } = useUserStore()
  
  const [papers, setPapers] = useState<Paper[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMode, setSelectedMode] = useState<'practice' | 'exam'>('practice')
  const [recommendedDifficulty, setRecommendedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [selectedLevel, setSelectedLevel] = useState<'igcse' | 'ial'>('igcse')
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedPaper, setSelectedPaper] = useState<string>('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  
  const [subjectData, setSubjectData] = useState<{[key: string]: {total: number, verified: number}}>({})

  useEffect(() => {
    setRecommendedDifficulty(getRecommendedDifficulty())
  }, [getRecommendedDifficulty])

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const pageSize = 1000
        const all: Question[] = []
        let lastDoc: any = undefined

        for (;;) {
          const res = await getQuestions({}, pageSize, lastDoc)
          all.push(...res.questions)
          lastDoc = res.lastDoc || undefined
          if (res.questions.length < pageSize || !lastDoc) break
          if (all.length >= 30000) break
        }

        setAllQuestions(all)
      } catch (error) {
        console.error('Failed to load questions from Firebase:', error)
        setAllQuestions([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const computed = useMemo(() => {
    console.log('[DEBUG] PaperSelect compute - total questions:', allQuestions.length)
    if (allQuestions.length > 0) {
      console.log('[DEBUG] First question subject:', allQuestions[0].subject)
      console.log('[DEBUG] First question source:', allQuestions[0].source)
    }

    const stats: { [key: string]: { total: number; verified: number } } = {}
    const bySubject: { [key: string]: Question[] } = {}
    allQuestions.forEach((q) => {
      const s = normalizeSubjectKey(q.subject)
      bySubject[s] = bySubject[s] || []
      bySubject[s].push(q)
    })

    console.log('[DEBUG] bySubject keys:', Object.keys(bySubject))
    console.log('[DEBUG] SUBJECT_META keys:', Object.keys(SUBJECT_META))

    ;(Object.keys(SUBJECT_META) as Array<keyof typeof SUBJECT_META>).forEach((s) => {
      const list = bySubject[s] || []
      stats[String(s)] = {
        total: list.length,
        verified: list.filter((q) => q.verified).length
      }
    })

    const filtered = allQuestions.filter((q: Question) => {
      const questionDifficulty = q.difficulty || 'medium'
      const difficultyMatch =
        selectedMode === 'exam'
          ? true
          : recommendedDifficulty === 'easy'
            ? questionDifficulty === 'easy'
            : recommendedDifficulty === 'hard'
              ? questionDifficulty !== 'easy'
              : true
      return difficultyMatch
    })

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

    const papers = Array.from(paperMap.values()).sort((a, b) => b.year - a.year)

    return { stats, filtered, papers }
  }, [allQuestions, recommendedDifficulty, selectedMode])

  useEffect(() => {
    setQuestions(computed.filtered)
    setSubjectData(computed.stats)
    setPapers(computed.papers)
  }, [computed])

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

      {/* Progress Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Your Progress</h2>
              <p className="text-emerald-100 text-sm">
                {completedPapers.length} of {papers.length} papers completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {papers.length > 0 ? Math.round((completedPapers.length / papers.length) * 100) : 0}%
            </div>
            <div className="text-xs text-emerald-100">Done</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${papers.length > 0 ? (completedPapers.length / papers.length) * 100 : 0}%` }}
          />
        </div>
      </div>
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

      {/* Level Selector - Step 1 */}
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">1. Select Exam Level</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedLevel('igcse')
              setSelectedSubject('all')
              setSelectedYear('all')
              setSelectedPaper('all')
            }}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedLevel === 'igcse'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <div className="font-semibold text-lg">O Level (IGCSE)</div>
            <div className="text-xs opacity-80 mt-1">Cambridge IGCSE • 11 Subjects</div>
            <div className="text-[10px] opacity-60 mt-2">Grades 9-11 • Foundation Level</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedLevel('ial')
              setSelectedSubject('all')
              setSelectedYear('all')
              setSelectedPaper('all')
            }}
            className={`p-4 rounded-xl text-left transition-colors ${
              selectedLevel === 'ial'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <div className="font-semibold text-lg">A Level (IAL)</div>
            <div className="text-xs opacity-80 mt-1">Edexcel & Cambridge • 9 Subjects</div>
            <div className="text-[10px] opacity-60 mt-2">Grades 11-13 • Advanced Level</div>
          </button>
        </div>
      </div>

      {/* Subject Selector - Step 2 */}
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">2. Select Subject</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SUBJECT_META).map(([key, meta]) => {
            // Filter subjects based on selected level
            if (selectedLevel === 'igcse' && !key.startsWith('igcse_')) return null
            if (selectedLevel === 'ial' && (!key.startsWith('ial_') && !key.startsWith('cambridge_ial_'))) return null
            
            const Icon = key.includes('accounting') || key.includes('math') ? Calculator : key.includes('economics') || key.includes('business') || key.includes('travel') ? BookOpen : key.includes('english') ? BookOpen : Beaker
            const activeColor = key.includes('accounting') ? 'bg-blue-500' : key.includes('math') ? 'bg-indigo-500' : key.includes('economics') ? 'bg-amber-500' : key.includes('physics') ? 'bg-cyan-500' : key.includes('chemistry') ? 'bg-teal-500' : key.includes('english') ? 'bg-rose-500' : key.includes('computer') ? 'bg-violet-500' : key.includes('travel') ? 'bg-pink-500' : 'bg-green-500'
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedSubject(key)
                  setSelectedYear('all')
                  setSelectedPaper('all')
                }}
                className={`p-4 rounded-xl text-left transition-colors ${
                  selectedSubject === key
                    ? `${activeColor} text-white`
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-[10px] opacity-70 bg-black/20 px-2 py-0.5 rounded">{meta.code}</span>
                </div>
                <div className="font-semibold text-sm">{meta.name}</div>
                <div className="text-[10px] opacity-60 mt-1">
                  {meta.examBoard}
                </div>
                <div className="text-[10px] opacity-50 mt-1">
                  {subjectData[key]?.total || 0} questions • {subjectData[key]?.verified || 0} verified
                </div>
              </button>
            )
          })}
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

      {/* Year & Paper Selector - Step 3 */}
      <div className="p-4 bg-slate-800 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">3. Select Year & Paper</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Year Filter */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-slate-400 mb-1 block">Year</label>
            <select 
              className="w-full p-3 rounded-lg bg-slate-700 text-sm"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                setSelectedPaper('all')
              }}
            >
              <option value="all">All Years</option>
              {years.filter(y => y !== 'all').map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          {/* Paper Filter */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-slate-400 mb-1 block">Paper</label>
            <select 
              className="w-full p-3 rounded-lg bg-slate-700 text-sm"
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
            >
              <option value="all">All Papers</option>
              {paperNumbers.filter(p => p !== 'all').map(p => (
                <option key={p} value={p}>Paper {p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Verified Toggle */}
        <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/50 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showVerifiedOnly}
            onChange={(e) => setShowVerifiedOnly(e.target.checked)}
            className="rounded bg-slate-600"
          />
          <span className="text-sm">Show verified questions only</span>
        </label>

        <div className="flex items-center justify-between text-sm mt-3">
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
              className={`w-full p-4 rounded-xl hover:bg-slate-700 transition-colors text-left relative ${
                completedPapers.includes(paper.id) ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-slate-800'
              }`}
            >
              {completedPapers.includes(paper.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
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
