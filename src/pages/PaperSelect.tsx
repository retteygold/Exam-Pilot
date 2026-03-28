import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Target, Award, Calendar, CheckCircle, Play, ChevronLeft, Filter, RotateCcw, GraduationCap } from 'lucide-react'
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

const SUBJECT_META: Record<string, { name: string; code: string; timeAllowed: number; badge?: string; examBoard?: string; color: string; icon: string }> = {
  // === CAMBRIDGE IGCSE (O Level) ===
  igcse_biology: { name: 'Biology', code: '0610', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-green-500 to-emerald-600', icon: '🧬' },
  igcse_chemistry: { name: 'Chemistry', code: '0620', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-teal-500 to-cyan-600', icon: '⚗️' },
  igcse_physics: { name: 'Physics', code: '0625', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-cyan-500 to-blue-600', icon: '⚛️' },
  igcse_mathematics: { name: 'Mathematics', code: '0580', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-indigo-500 to-purple-600', icon: '📐' },
  igcse_accounting: { name: 'Accounting', code: '0452', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-blue-500 to-indigo-600', icon: '📊' },
  igcse_economics: { name: 'Economics', code: '0455', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-amber-500 to-orange-600', icon: '📈' },
  igcse_business_studies: { name: 'Business Studies', code: '0450', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-violet-500 to-purple-600', icon: '💼' },
  igcse_computer_science: { name: 'Computer Science', code: '0478', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-violet-500 to-fuchsia-600', icon: '💻' },
  igcse_english_first: { name: 'English (First)', code: '0500', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-rose-500 to-pink-600', icon: '📖' },
  igcse_english_second: { name: 'English (Second)', code: '0510', timeAllowed: 90, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-pink-500 to-rose-600', icon: '🗣️' },
  igcse_travel_tourism: { name: 'Travel & Tourism', code: '0471', timeAllowed: 60, badge: 'O-Level', examBoard: 'Cambridge IGCSE', color: 'from-fuchsia-500 to-pink-600', icon: '✈️' },

  // === PEARSON EDEXCEL IAL (A Level) ===
  ial_biology: { name: 'Biology', code: 'WBI11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-green-500 to-emerald-600', icon: '🧬' },
  ial_chemistry: { name: 'Chemistry', code: 'WCH11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-teal-500 to-cyan-600', icon: '⚗️' },
  ial_physics: { name: 'Physics', code: 'WPH11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-cyan-500 to-blue-600', icon: '⚛️' },
  ial_mathematics: { name: 'Mathematics', code: 'WMA11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-indigo-500 to-purple-600', icon: '📐' },
  ial_accounting: { name: 'Accounting', code: 'WAC11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-blue-500 to-indigo-600', icon: '📊' },
  ial_economics: { name: 'Economics', code: 'WEC11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-amber-500 to-orange-600', icon: '📈' },
  ial_business: { name: 'Business', code: 'WBS11', timeAllowed: 75, badge: 'A-Level', examBoard: 'Edexcel IAL', color: 'from-violet-500 to-purple-600', icon: '💼' },

  // === CAMBRIDGE IAL (A Level) ===
  cambridge_ial_travel_tourism: { name: 'Travel & Tourism', code: '9395', timeAllowed: 75, badge: 'A-Level', examBoard: 'Cambridge IAL', color: 'from-fuchsia-500 to-pink-600', icon: '✈️' },
  cambridge_ial_computer_science: { name: 'Computer Science', code: '9618', timeAllowed: 75, badge: 'A-Level', examBoard: 'Cambridge IAL', color: 'from-violet-500 to-fuchsia-600', icon: '💻' },
}

function normalizeSubjectKey(subject: string | undefined | null): string {
  let s = (subject || 'accounting').toLowerCase().trim()
  s = s.replace(/^unknown\s+/, '')
  s = s.replace(/-/g, '_')
  s = s.replace(/\s+/g, '_')
  s = s.replace(/_+/g, '_')
  
  if (s.includes('biology') && (s.includes('0610') || s.includes('igcse'))) return 'igcse_biology'
  if (s.includes('chemistry') && (s.includes('0620') || s.includes('igcse'))) return 'igcse_chemistry'
  if (s.includes('physics') && (s.includes('0625') || s.includes('igcse'))) return 'igcse_physics'
  if ((s.includes('mathematics') || s.includes('math')) && (s.includes('0580') || s.includes('igcse'))) return 'igcse_mathematics'
  if (s.includes('accounting') && (s.includes('0452') || s.includes('igcse'))) return 'igcse_accounting'
  if (s.includes('economics') && (s.includes('0455') || s.includes('igcse'))) return 'igcse_economics'
  if (s.includes('business') && (s.includes('0450') || s.includes('igcse'))) return 'igcse_business_studies'
  if ((s.includes('computer') || s.includes('cs')) && (s.includes('0478') || s.includes('igcse'))) return 'igcse_computer_science'
  if (s.includes('english') && s.includes('0500')) return 'igcse_english_first'
  if (s.includes('english') && s.includes('0510')) return 'igcse_english_second'
  if ((s.includes('travel') || s.includes('tourism')) && (s.includes('0471') || s.includes('igcse'))) return 'igcse_travel_tourism'

  if (s.includes('biology') && s.includes('wbi')) return 'ial_biology'
  if (s.includes('chemistry') && s.includes('wch')) return 'ial_chemistry'
  if (s.includes('physics') && s.includes('wph')) return 'ial_physics'
  if ((s.includes('mathematics') || s.includes('math')) && s.includes('wma')) return 'ial_mathematics'
  if (s.includes('accounting') && s.includes('wac')) return 'ial_accounting'
  if (s.includes('economics') && s.includes('wec')) return 'ial_economics'
  if (s.includes('business') && s.includes('wbs')) return 'ial_business'

  if ((s.includes('travel') || s.includes('tourism')) && s.includes('9395')) return 'cambridge_ial_travel_tourism'
  if ((s.includes('computer') || s.includes('cs')) && s.includes('9618')) return 'cambridge_ial_computer_science'

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
  }

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
  const [selectedSubject, setSelectedSubject] = useState<string>('igcse_biology')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<string>('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

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
    return { filtered, papers }
  }, [allQuestions, recommendedDifficulty, selectedMode])

  useEffect(() => {
    setQuestions(computed.filtered)
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

  // Filter subjects based on selected level
  const filteredSubjects = Object.entries(SUBJECT_META).filter(([key]) => {
    if (selectedLevel === 'igcse') return key.startsWith('igcse_')
    if (selectedLevel === 'ial') return key.startsWith('ial_') || key.startsWith('cambridge_ial_')
    return true
  })

  // Filter papers
  const filteredPapers = papers.filter(p => {
    if (p.subject !== selectedSubject) return false
    if (selectedYear !== 'all' && p.year !== selectedYear) return false
    if (selectedPaper !== 'all' && p.paper !== selectedPaper) return false
    if (showVerifiedOnly && p.verifiedCount === 0) return false
    return true
  })

  // Get unique years for selected subject
  const availableYears = [...new Set(papers.filter(p => p.subject === selectedSubject).map(p => p.year))].sort((a, b) => b - a)
  
  // Get papers grouped by year
  const papersByYear = filteredPapers.reduce((acc, paper) => {
    acc[paper.year] = acc[paper.year] || []
    acc[paper.year].push(paper)
    return acc
  }, {} as Record<number, Paper[]>)

  const meta = SUBJECT_META[selectedSubject]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Select Paper</h1>
              <p className="text-xs text-slate-400">Choose year & paper to start</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Level & Subject Selection */}
        <div className="px-4 pb-4 space-y-3">
          {/* Level Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedLevel('igcse')
                const firstIgcse = Object.keys(SUBJECT_META).find(k => k.startsWith('igcse_'))
                if (firstIgcse) setSelectedSubject(firstIgcse)
                setSelectedYear('all')
              }}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                selectedLevel === 'igcse'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              O Level (IGCSE)
            </button>
            <button
              onClick={() => {
                setSelectedLevel('ial')
                const firstIal = Object.keys(SUBJECT_META).find(k => k.startsWith('ial_') || k.startsWith('cambridge_ial_'))
                if (firstIal) setSelectedSubject(firstIal)
                setSelectedYear('all')
              }}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                selectedLevel === 'ial'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              A Level (IAL)
            </button>
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {filteredSubjects.map(([key, subjectMeta]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedSubject(key)
                  setSelectedYear('all')
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  selectedSubject === key
                    ? `bg-gradient-to-br ${subjectMeta.color} text-white`
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="text-lg mb-0.5">{subjectMeta.icon}</div>
                <div className="text-[10px] font-medium truncate">{subjectMeta.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Selected Subject Info */}
        <div className="p-4 bg-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta?.color || 'from-slate-600 to-slate-700'} flex items-center justify-center text-2xl`}>
              {meta?.icon || '📄'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">{meta?.name}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-mono">{meta?.code}</span>
                <span>•</span>
                <span>{meta?.examBoard}</span>
                <span>•</span>
                <span>{meta?.timeAllowed} min</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{filteredPapers.length}</div>
              <div className="text-xs text-slate-500">papers</div>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('practice')}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedMode === 'practice'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-2" />
            <div className="font-semibold text-sm">Practice</div>
            <div className="text-xs opacity-80">Study mode</div>
          </button>
          <button
            onClick={() => setSelectedMode('exam')}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedMode === 'exam'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-5 h-5 mb-2" />
            <div className="font-semibold text-sm">Exam</div>
            <div className="text-xs opacity-80">Timed mode</div>
          </button>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedYear('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedYear === 'all'
                ? 'bg-white text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All Years
          </button>
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedYear === year
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Papers by Year */}
        {selectedYear === 'all' ? (
          // Group by year when showing all
          availableYears.map(year => (
            <div key={year}>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {year}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {papersByYear[year]?.map(paper => (
                  <PaperCard 
                    key={paper.id} 
                    paper={paper} 
                    completed={completedPapers.includes(paper.id)}
                    onClick={() => handleStart(paper)}
                    mode={selectedMode}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show papers for selected year
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPapers.map(paper => (
              <PaperCard 
                key={paper.id} 
                paper={paper} 
                completed={completedPapers.includes(paper.id)}
                onClick={() => handleStart(paper)}
                mode={selectedMode}
              />
            ))}
          </div>
        )}

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400">No papers found for this selection</p>
            <button
              onClick={() => {
                setSelectedYear('all')
                setSelectedPaper('all')
              }}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <Target className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
            <div className="text-lg font-bold text-white">{filteredPapers.reduce((sum, p) => sum + p.totalQuestions, 0)}</div>
            <div className="text-xs text-slate-500">Questions</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <CheckCircle className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <div className="text-lg font-bold text-white">{completedPapers.length}</div>
            <div className="text-xs text-slate-500">Done</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-center">
            <Award className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <div className="text-lg font-bold text-white">{meta?.code}</div>
            <div className="text-xs text-slate-500">Code</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Paper Card Component
function PaperCard({ 
  paper, 
  completed, 
  onClick,
  mode 
}: { 
  paper: Paper
  completed: boolean
  onClick: () => void
  mode: 'practice' | 'exam'
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-xl text-left transition-all ${
        completed 
          ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20' 
          : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600'
      }`}
    >
      {/* Completed Badge */}
      {completed && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Paper Number */}
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
          completed 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : mode === 'exam' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {paper.paper}
        </div>
        {mode === 'exam' && (
          <div className="text-xs text-slate-500">
            {paper.timeAllowed}m
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="text-sm font-medium text-white">Paper {paper.paper}</div>
        <div className="text-xs text-slate-400">{paper.session}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">{paper.totalQuestions} Qs</span>
          {paper.verifiedCount > 0 && (
            <span className="text-emerald-400">✓ {Math.round((paper.verifiedCount / paper.totalQuestions) * 100)}%</span>
          )}
        </div>
      </div>

      {/* Start Button Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-blue-600/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center p-3">
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <Play className="w-4 h-4" />
          Start {mode === 'exam' ? 'Exam' : 'Practice'}
        </div>
      </div>
    </button>
  )
}
