import { useState, useEffect } from 'react'
import type { UserProgress, ProgressEntry } from '../types'

const STORAGE_KEY = 'gcse-prep-progress'

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  const saveProgress = (questionId: string, correct: boolean, timeSpent?: number) => {
    const entry: ProgressEntry = {
      correct,
      timestamp: Date.now(),
      timeSpent
    }
    
    const updated = { ...progress, [questionId]: entry }
    setProgress(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const getStats = () => {
    const entries = Object.values(progress)
    const total = entries.length
    const correct = entries.filter(e => e.correct).length
    
    let streak = 0
    const sorted = [...entries].sort((a: ProgressEntry, b: ProgressEntry) => b.timestamp - a.timestamp)
    for (const entry of sorted) {
      if (entry.correct) streak++
      else break
    }

    return {
      totalAnswered: total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      streak
    }
  }

  const clearProgress = () => {
    setProgress({})
    localStorage.removeItem(STORAGE_KEY)
  }

  return { progress, saveProgress, getStats, clearProgress }
}
