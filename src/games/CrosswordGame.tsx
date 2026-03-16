import { useState } from 'react'
import { Grid3X3, RotateCcw, Trophy, Star, HelpCircle, ChevronRight } from 'lucide-react'
import { CROSSWORD_LEVELS } from './crosswordLevels'

interface CrosswordGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const GRID_SIZE = 9

export function CrosswordGame({ onComplete, onExit }: CrosswordGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [grid, setGrid] = useState<string[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')))
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [direction, setDirection] = useState<'across' | 'down'>('across')
  const [solvedWords, setSolvedWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showHint, setShowHint] = useState<string | null>(null)
  const [showLevelComplete, setShowLevelComplete] = useState(false)

  const puzzle = CROSSWORD_LEVELS[currentPuzzle]

  function handleCellClick(row: number, col: number) {
    if (isCellBlocked(row, col)) return
    
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection(direction === 'across' ? 'down' : 'across')
    } else {
      setSelectedCell({row, col})
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (!selectedCell) return
    
    const { row, col } = selectedCell
    const key = e.key.toUpperCase()
    
    if (key === 'BACKSPACE') {
      const newGrid = [...grid.map(r => [...r])]
      newGrid[row][col] = ''
      setGrid(newGrid)
      moveSelection(-1)
    } else if (key === 'ARROWUP') {
      moveSelectionTo(row - 1, col)
    } else if (key === 'ARROWDOWN') {
      moveSelectionTo(row + 1, col)
    } else if (key === 'ARROWLEFT') {
      moveSelectionTo(row, col - 1)
    } else if (key === 'ARROWRIGHT') {
      moveSelectionTo(row, col + 1)
    } else if (key.length === 1 && /[A-Z]/.test(key)) {
      const newGrid = [...grid.map(r => [...r])]
      newGrid[row][col] = key
      setGrid(newGrid)
      checkWords(newGrid)
      moveSelection(1)
    }
  }

  function moveSelection(dir: number) {
    if (!selectedCell) return
    const { row, col } = selectedCell
    if (direction === 'across') {
      moveSelectionTo(row, col + dir)
    } else {
      moveSelectionTo(row + dir, col)
    }
  }

  function moveSelectionTo(row: number, col: number) {
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && !isCellBlocked(row, col)) {
      setSelectedCell({row, col})
    }
  }

  function isCellBlocked(row: number, col: number) {
    return !puzzle.words.some(w => {
      if (w.direction === 'across') {
        return w.row === row && col >= w.col && col < w.col + w.word.length
      } else {
        return w.col === col && row >= w.row && row < w.row + w.word.length
      }
    })
  }

  function checkWords(currentGrid: string[][]) {
    const newSolved: string[] = []
    
    for (const word of puzzle.words) {
      let formed = ''
      if (word.direction === 'across') {
        for (let c = word.col; c < word.col + word.word.length; c++) {
          formed += currentGrid[word.row][c] || ''
        }
      } else {
        for (let r = word.row; r < word.row + word.word.length; r++) {
          formed += currentGrid[r][word.col] || ''
        }
      }
      
      if (formed === word.word && !solvedWords.includes(word.word)) {
        newSolved.push(word.word)
      }
    }
    
    if (newSolved.length > 0) {
      setSolvedWords([...solvedWords, ...newSolved])
      setScore(score + newSolved.length * 15)
      
      if (solvedWords.length + newSolved.length === puzzle.words.length) {
        const levelScore = score + newSolved.length * 15
        setTimeout(() => {
          setTotalScore(totalScore + levelScore)
          setShowLevelComplete(true)
        }, 1000)
      }
    }
  }

  function nextLevel() {
    setCurrentPuzzle(currentPuzzle + 1)
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')))
    setSelectedCell(null)
    setSolvedWords([])
    setShowHint(null)
    setShowLevelComplete(false)
  }

  function resetGame() {
    setCurrentPuzzle(0)
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')))
    setSelectedCell(null)
    setSolvedWords([])
    setScore(0)
    setShowHint(null)
  }

  function getCellNumber(row: number, col: number) {
    for (let i = 0; i < puzzle.words.length; i++) {
      const w = puzzle.words[i]
      if (w.row === row && w.col === col) return i + 1
    }
    return null
  }

  function isCellSolved(row: number, col: number) {
    return puzzle.words.some(w => {
      if (!solvedWords.includes(w.word)) return false
      if (w.direction === 'across') {
        return w.row === row && col >= w.col && col < w.col + w.word.length
      } else {
        return w.col === col && row >= w.row && row < w.row + w.word.length
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Level {currentPuzzle + 1}/{CROSSWORD_LEVELS.length}</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <button onClick={resetGame} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <Grid3X3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Crossword Puzzle</h1>
          <p className="text-blue-200">Fill in the words using the clues</p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Solved: {solvedWords.length}/{puzzle.words.length}</span>
            <span>{Math.round((solvedWords.length / puzzle.words.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all"
              style={{ width: `${(solvedWords.length / puzzle.words.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Grid */}
          <div 
            className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700"
            tabIndex={0}
            onKeyDown={handleKeyPress}
          >
            <div 
              className="grid gap-1 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                maxWidth: '280px'
              }}
            >
              {Array(GRID_SIZE).fill(null).map((_, row) => 
                Array(GRID_SIZE).fill(null).map((_, col) => {
                  const isBlocked = isCellBlocked(row, col)
                  const isSelected = selectedCell?.row === row && selectedCell?.col === col
                  const number = getCellNumber(row, col)
                  const isSolved = isCellSolved(row, col)
                  
                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => handleCellClick(row, col)}
                      disabled={isBlocked}
                      className={`
                        aspect-square rounded-lg font-bold text-lg relative transition-all
                        ${isBlocked 
                          ? 'bg-slate-900/50' 
                          : isSelected
                            ? 'bg-blue-500/50 text-white ring-2 ring-blue-400'
                            : isSolved
                              ? 'bg-emerald-500/30 text-emerald-100'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                        }
                      `}
                    >
                      {number && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-slate-400">
                          {number}
                        </span>
                      )}
                      {grid[row][col]}
                    </button>
                  )
                })
              )}
            </div>
            <p className="text-center text-slate-400 text-xs mt-3">
              Click a cell, then type letters
            </p>
          </div>

          {/* Clues */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-400">→</span> Across
              </h3>
              <div className="space-y-2">
                {puzzle.words.filter(w => w.direction === 'across').map((w, i) => (
                  <div 
                    key={w.word}
                    onClick={() => {
                      setSelectedCell({row: w.row, col: w.col})
                      setDirection('across')
                      setShowHint(w.clue)
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      solvedWords.includes(w.word)
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700/30 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="font-bold mr-2">{i + 1}.</span>
                    {w.clue}
                    {solvedWords.includes(w.word) && (
                      <span className="ml-2 text-emerald-400">✓ {w.word}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-purple-400">↓</span> Down
              </h3>
              <div className="space-y-2">
                {puzzle.words.filter(w => w.direction === 'down').map((w, i) => {
                  const acrossCount = puzzle.words.filter(w => w.direction === 'across').length
                  return (
                    <div 
                      key={w.word}
                      onClick={() => {
                        setSelectedCell({row: w.row, col: w.col})
                        setDirection('down')
                        setShowHint(w.clue)
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${
                        solvedWords.includes(w.word)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700/30 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-bold mr-2">{acrossCount + i + 1}.</span>
                      {w.clue}
                      {solvedWords.includes(w.word) && (
                        <span className="ml-2 text-emerald-400">✓ {w.word}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-200 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            {showHint}
          </div>
        )}

        {/* Victory */}
        {showLevelComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Level Complete!</h2>
              <p className="text-slate-300 mb-4">
                Level {currentPuzzle + 1} finished!
              </p>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`w-8 h-8 ${i < Math.min(3, Math.floor(score / 40) + 1) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                ))}
              </div>
              {currentPuzzle < CROSSWORD_LEVELS.length - 1 ? (
                <button 
                  onClick={nextLevel}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                >
                  Next Level
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => onComplete(totalScore, Math.min(3, Math.floor(totalScore / 200) + 1))}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white"
                >
                  Finish Game
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
