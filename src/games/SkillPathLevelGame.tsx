import { useEffect, useMemo, useState } from 'react'
import { Trophy, ArrowLeft, Star } from 'lucide-react'
import type { Question } from '../types'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

type RewardType = 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win'

export type SkillPathLevelGameConfig = {
  id: string
  title: string
  description: string
  iconEmoji: string
  bgClassName: string
  topics: string[]
}

interface SkillPathLevelGameProps {
  config: SkillPathLevelGameConfig
  questions: Question[]
  gradeKey: string
  level: number
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildLevelBank(params: {
  questions: Question[]
  gradeKey: string
  topics: string[]
  level: number
  count: number
}): Question[] {
  const { questions, gradeKey, topics, level, count } = params

  const byGrade = questions.filter((q) => (q.yearGroup || '').toLowerCase() === gradeKey)
  const allowed = new Set(topics.map(t => t.toLowerCase()))
  const filtered = allowed.size
    ? byGrade.filter((q) => allowed.has((q.topic || '').toLowerCase()))
    : byGrade

  const base = filtered.length ? filtered : byGrade
  if (!base.length) return []

  const seenIds = new Set<string>()
  const deduped = base.filter((q) => {
    const key = (q.id && q.id.trim()) ? q.id : `${q.subject || ''}:${q.topic || ''}:${q.question || ''}`
    if (seenIds.has(key)) return false
    seenIds.add(key)
    return true
  })

  const rng = mulberry32(hashString(`${gradeKey}|${topics.join(',')}|${level}`))
  const shuffled = [...deduped]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

export function SkillPathLevelGame({ config, questions, gradeKey, level, onComplete, onExit }: SkillPathLevelGameProps) {
  const levelQuestions = useMemo(() => {
    return buildLevelBank({
      questions,
      gradeKey,
      topics: config.topics,
      level,
      count: 10
    })
  }, [questions, gradeKey, config.topics, level])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState({ title: '', message: '', type: 'achievement' as RewardType, value: 0 })

  useEffect(() => {
    soundManager.play('click')
  }, [config.id, level])

  const showRewardPopup = (title: string, message: string, type: RewardType, value: number) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
    soundManager.play(type === 'win' ? 'win' : 'star')
  }

  const endLevel = () => {
    const stars = Math.min(5, Math.max(1, Math.floor(score / 25) + 1))
    showRewardPopup('Level Complete! ⭐', `You scored ${score} points and earned ${stars} stars!`, 'win', stars)
    setTimeout(() => {
      onComplete(score, stars)
    }, 2500)
  }

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelected(answerIndex)
    setShowResult(true)

    const q = levelQuestions[index]
    const isCorrect = q && q.correctAnswer === answerIndex

    if (isCorrect) {
      soundManager.play('correct')
      setCorrect((c) => c + 1)
      setScore((s) => s + 10)

      const nextCorrect = correct + 1
      if (nextCorrect === 5) {
        showRewardPopup('Halfway Hero! ✨', '5 correct answers!', 'milestone', 5)
      }
    } else {
      soundManager.play('wrong')
    }

    setTimeout(() => {
      const nextIndex = index + 1
      if (nextIndex >= levelQuestions.length) {
        endLevel()
        return
      }
      setIndex(nextIndex)
      setSelected(null)
      setShowResult(false)
    }, 900)
  }

  const q = levelQuestions[index]

  if (!q) {
    return (
      <div className={`min-h-screen ${config.bgClassName} p-4`}>
        <div className="max-w-2xl mx-auto">
          <button onClick={onExit} className="px-4 py-2 bg-slate-800/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </button>
          <div className="mt-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
            <div className="text-5xl mb-3">{config.iconEmoji}</div>
            <h2 className="text-xl font-bold text-white mb-2">{config.title} - Level {level}</h2>
            <p className="text-slate-300">No questions found for this grade/topic yet.</p>
          </div>
        </div>
      </div>
    )
  }

  const options = Array.isArray(q.options) ? q.options : []

  return (
    <div className={`min-h-screen ${config.bgClassName} p-4`}>
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="px-4 py-2 bg-slate-800/50 rounded-xl text-white hover:bg-slate-700/50 transition-colors">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Exit
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-white">{score}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-bold text-white">{correct}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-bold">
            {config.iconEmoji} {config.title}
          </div>
          <div className="text-slate-300 text-sm">Level {level} / 100</div>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((index + 1) / levelQuestions.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-slate-300 mt-2 text-sm">Question {index + 1} of {levelQuestions.length}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white text-center mb-6">{q.question}</h2>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className={`p-4 rounded-2xl font-semibold transition-all text-left ${
                  showResult
                    ? i === q.correctAnswer
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-200'
                      : i === selected
                        ? 'bg-red-500/30 border-2 border-red-500 text-red-200'
                        : 'bg-slate-700/50 text-slate-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-white border-2 border-transparent hover:border-purple-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showReward && (
        <RewardPopup
          isOpen={showReward}
          onClose={() => setShowReward(false)}
          title={rewardData.title}
          message={rewardData.message}
          type={rewardData.type}
          value={rewardData.value}
        />
      )}
    </div>
  )
}
