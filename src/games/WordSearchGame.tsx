import { useState, useEffect } from 'react'
import { Search, RotateCcw, Trophy, Star, ChevronRight } from 'lucide-react'
import { WORD_SEARCH_LEVELS } from './wordSearchLevels'

interface WordSearchGameProps {
  onComplete: (score: number, stars: number) => void
  onExit: () => void
}

const GRID_SIZE = 10

export function WordSearchGame({ onComplete, onExit }: WordSearchGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [grid, setGrid] = useState<string[][]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [wordPositions, setWordPositions] = useState<Map<string, {row: number, col: number}[]>>(new Map())
  const [pointerId, setPointerId] = useState<number | null>(null)
  const [showLevelComplete, setShowLevelComplete] = useState(false)

  const levelData = WORD_SEARCH_LEVELS[currentLevel]
  const WORDS = levelData.words

  useEffect(() => {
    generateGrid()
  }, [currentLevel])

  function generateGrid() {
    const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''))
    const positions = new Map<string, {row: number, col: number}[]>()
    
    const directions = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]]
    
    for (const word of WORDS) {
      let placed = false
      let attempts = 0
      
      while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)]
        const row = Math.floor(Math.random() * GRID_SIZE)
        const col = Math.floor(Math.random() * GRID_SIZE)
        
        if (canPlaceWord(newGrid, word, row, col, dir)) {
          const wordCells: {row: number, col: number}[] = []
          for (let i = 0; i < word.length; i++) {
            const r = row + dir[0] * i
            const c = col + dir[1] * i
            newGrid[r][c] = word[i]
            wordCells.push({row: r, col: c})
          }
          positions.set(word, wordCells)
          placed = true
        }
        attempts++
      }
    }
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
    
    setGrid(newGrid)
    setWordPositions(positions)
  }

  function canPlaceWord(grid: string[][], word: string, row: number, col: number, dir: number[]) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dir[0] * i
      const c = col + dir[1] * i
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false
    }
    return true
  }

  function handleCellClick(row: number, col: number) {
    if (isSelecting) {
      checkWord()
      setIsSelecting(false)
      setSelectedCells([])
      setCurrentWord('')
    } else {
      setIsSelecting(true)
      setSelectedCells([{row, col}])
      setCurrentWord(grid[row][col])
    }
  }

  function handleCellEnter(row: number, col: number) {
    if (!isSelecting) return
    
    const lastCell = selectedCells[selectedCells.length - 1]
    if (!lastCell) return
    
    const dr = Math.abs(row - lastCell.row)
    const dc = Math.abs(col - lastCell.col)
    
    if ((dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0)) {
      const alreadySelected = selectedCells.some(c => c.row === row && c.col === col)
      if (!alreadySelected) {
        const newSelected = [...selectedCells, {row, col}]
        setSelectedCells(newSelected)
        setCurrentWord(newSelected.map(c => grid[c.row][c.col]).join(''))
      }
    }
  }

  function startSelection(row: number, col: number) {
    setIsSelecting(true)
    setSelectedCells([{row, col}])
    setCurrentWord(grid[row][col])
  }

  function endSelection() {
    if (!isSelecting) return
    checkWord()
    setIsSelecting(false)
    setSelectedCells([])
    setCurrentWord('')
  }

  function handlePointerDown(e: React.PointerEvent, row: number, col: number) {
    e.preventDefault()
    if (e.pointerType === 'mouse' && (e.button ?? 0) !== 0) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setPointerId(e.pointerId)
    startSelection(row, col)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isSelecting) return
    if (pointerId !== null && e.pointerId !== pointerId) return
    e.preventDefault()

    const element = document.elementFromPoint(e.clientX, e.clientY)
    const button = element?.closest?.('button[data-row]') as HTMLElement | null
    if (!button) return

    const r = parseInt(button.getAttribute('data-row') || '-1')
    const c = parseInt(button.getAttribute('data-col') || '-1')
    if (r >= 0 && c >= 0) handleCellEnter(r, c)
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (pointerId !== null && e.pointerId !== pointerId) return
    e.preventDefault()
    setPointerId(null)
    endSelection()
  }

  function handlePointerCancel(e: React.PointerEvent) {
    if (pointerId !== null && e.pointerId !== pointerId) return
    e.preventDefault()
    setPointerId(null)
    setIsSelecting(false)
    setSelectedCells([])
    setCurrentWord('')
  }

  function checkWord() {
    const word = currentWord
    const reversedWord = word.split('').reverse().join('')
    
    const targetWord = WORDS.find(w => w === word || w === reversedWord)
    
    if (targetWord && !foundWords.includes(targetWord)) {
      const newFoundWords = [...foundWords, targetWord]
      setFoundWords(newFoundWords)
      const newScore = score + 10
      setScore(newScore)
      
      if (newFoundWords.length === WORDS.length) {
        const newTotal = totalScore + newScore
        setTotalScore(newTotal)
        setTimeout(() => setShowLevelComplete(true), 500)
      }
    }
  }

  function nextLevel() {
    if (currentLevel < WORD_SEARCH_LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setFoundWords([])
      setSelectedCells([])
      setIsSelecting(false)
      setCurrentWord('')
      setScore(0)
      setShowLevelComplete(false)
    } else {
      const stars = Math.min(3, Math.floor(totalScore / 100) + 1)
      onComplete(totalScore, stars)
    }
  }

  function resetGame() {
    setFoundWords([])
    setSelectedCells([])
    setIsSelecting(false)
    setCurrentWord('')
    setScore(0)
    generateGrid()
  }

  const isCellSelected = (row: number, col: number) => 
    selectedCells.some(c => c.row === row && c.col === col)

  const isCellFound = (row: number, col: number) => {
    for (const [word, positions] of wordPositions) {
      if (foundWords.includes(word)) {
        if (positions.some((p) => p.row === row && p.col === col)) return true
      }
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <button onClick={resetGame} className="p-2 bg-slate-700/50 rounded-full hover:bg-slate-700 text-white">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <Search className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Word Search</h1>
          <p className="text-emerald-200">Level {currentLevel + 1}/50 - {levelData.theme}</p>
          <p className="text-emerald-300/70 text-sm">Find all the hidden words!</p>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Level Progress</span>
            <span>{currentLevel + 1} / 50</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
              style={{ width: `${((currentLevel + 1) / 50) * 100}%` }}
            />
          </div>
        </div>

        {/* Word List */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 max-h-32 overflow-y-auto">
          {WORDS.map(word => (
            <span
              key={word}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                foundWords.includes(word)
                  ? 'bg-emerald-500/30 text-emerald-300 line-through'
                  : 'bg-slate-700/50 text-slate-300'
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Found: {foundWords.length}/{WORDS.length}</span>
            <span>{Math.round((foundWords.length / WORDS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
              style={{ width: `${(foundWords.length / WORDS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 overflow-x-auto">
          <div 
            className="grid gap-1 touch-none select-none"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
              minWidth: '280px', 
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onMouseLeave={() => {
              if (isSelecting) {
                endSelection()
              }
            }}
          >
            {grid.map((row, r) => 
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  data-row={r}
                  data-col={c}
                  onMouseDown={() => handleCellClick(r, c)}
                  onMouseEnter={() => handleCellEnter(r, c)}
                  onClick={() => handleCellClick(r, c)}
                  onPointerDown={(e) => handlePointerDown(e, r, c)}
                  className={`
                    aspect-square rounded-lg font-bold text-sm transition-all select-none pointer-events-auto
                    ${isCellFound(r, c) 
                      ? 'bg-emerald-500/50 text-emerald-100' 
                      : isCellSelected(r, c)
                        ? 'bg-cyan-500/50 text-cyan-100'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                    }
                  `}
                >
                  {cell}
                </button>
              ))
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-4">
          Click and drag to select letters forming words
        </p>

        {/* Level Complete Modal */}
        {showLevelComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Level Complete!</h2>
              <p className="text-emerald-300 mb-2">Level {currentLevel + 1}: {levelData.theme}</p>
              <p className="text-slate-300 mb-4">Score: {score} points</p>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`w-8 h-8 ${i < Math.min(3, Math.floor(score / 30) + 1) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <button 
                onClick={nextLevel}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              >
                {currentLevel < WORD_SEARCH_LEVELS.length - 1 ? 'Next Level' : 'Finish Game'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
