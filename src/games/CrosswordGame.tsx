import { useState, useRef } from 'react'
import { Grid3X3, RotateCcw, Trophy, Star, HelpCircle, ChevronRight } from 'lucide-react'
import { CROSSWORD_LEVELS } from './crosswordLevels'
import { soundManager } from '../utils/soundManager'
import { RewardPopup } from '../components/RewardPopup'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState({
    title: '',
    message: '',
    type: 'achievement' as 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win',
    value: 0
  })

  const puzzle = CROSSWORD_LEVELS[currentPuzzle]

  function handleCellClick(row: number, col: number) {
    if (isCellBlocked(row, col)) return

    soundManager.play('click')
    
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
      soundManager.play('click')
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
      soundManager.play('click')
      const newGrid = [...grid.map(r => [...r])]
      newGrid[row][col] = key
      setGrid(newGrid)
      checkWords(newGrid)
      moveSelection(1)
    }
  }

  const showRewardPopup = (
    title: string,
    message: string,
    type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win',
    value: number
  ) => {
    setRewardData({ title, message, type, value })
    setShowReward(true)
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

  function moveToNextCell() {
    if (!selectedCell) return
    const { row, col } = selectedCell
    if (direction === 'across') {
      moveSelectionTo(row, col + 1)
    } else {
      moveSelectionTo(row + 1, col)
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
      soundManager.play('correct')
      setSolvedWords([...solvedWords, ...newSolved])
      setScore(score + newSolved.length * 15)

      if (solvedWords.length + newSolved.length === 1 || solvedWords.length + newSolved.length === Math.ceil(puzzle.words.length / 2)) {
        showRewardPopup('Nice! ⭐', `You solved: ${newSolved[0]}`, 'achievement', 15)
      }
      
      if (solvedWords.length + newSolved.length === puzzle.words.length) {
        const levelScore = score + newSolved.length * 15
        setTimeout(() => {
          setTotalScore(totalScore + levelScore)
          showRewardPopup(
            `Level ${currentPuzzle + 1} Complete!`,
            `+${levelScore} points!`,
            'levelUp',
            levelScore
          )
          soundManager.play('levelUp')
          setShowLevelComplete(true)
        }, 1000)
      }
    } else {
      soundManager.play('wrong')
    }
  }

  function nextLevel() {
    setCurrentPuzzle(currentPuzzle + 1)
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')))
    setSelectedCell(null)
    setSolvedWords([])
    setShowHint(null)
    setShowLevelComplete(false)
    setScore(0)
  }

  function resetGame() {
    soundManager.play('click')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4 pb-20 overflow-y-auto">
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

        {/* Game Area - Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          {/* Grid */}
          <div className="relative order-1">
            <input
              ref={inputRef}
              type="text"
              className="fixed left-0 top-0 opacity-0 w-1 h-1"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => {
                const char = e.target.value.slice(-1).toUpperCase()
                if (char && selectedCell && !isCellBlocked(selectedCell.row, selectedCell.col)) {
                  const newGrid = [...grid]
                  newGrid[selectedCell.row][selectedCell.col] = char
                  setGrid(newGrid)
                  moveToNextCell()
                }
                e.target.value = ''
              }}
              onKeyDown={handleKeyPress}
            />
            <div 
              className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700"
              onClick={() => inputRef.current?.focus()}
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
                        onClick={() => {
                          handleCellClick(row, col)
                          inputRef.current?.focus()
                        }}
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
              <p className="text-center text-slate-400 text-xs mt-2">
                Click a cell, then type letters
              </p>
            </div>
          </div>

          {/* Clues - Scrollable on mobile when long */}
          <div className="order-2 space-y-3 max-h-[55vh] overflow-y-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
            {/* Across Clues */}
            <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                <span className="text-blue-400">→</span> Across
              </h3>
              <div className="space-y-1.5">
                {puzzle.words.filter(w => w.direction === 'across').map((w, i) => (
                  <div 
                    key={w.word}
                    onClick={() => {
                      setSelectedCell({row: w.row, col: w.col})
                      setDirection('across')
                      setShowHint(w.clue)
                      inputRef.current?.focus()
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                      solvedWords.includes(w.word)
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700/30 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="font-bold mr-1.5">{i + 1}.</span>
                    {w.clue}
                    {solvedWords.includes(w.word) && (
                      <span className="ml-1.5 text-emerald-400 text-xs">✓ {w.word}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Down Clues */}
            <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                <span className="text-purple-400">↓</span> Down
              </h3>
              <div className="space-y-1.5">
                {puzzle.words.filter(w => w.direction === 'down').map((w, i) => {
                  const acrossCount = puzzle.words.filter(w => w.direction === 'across').length
                  return (
                    <div 
                      key={w.word}
                      onClick={() => {
                        setSelectedCell({row: w.row, col: w.col})
                        setDirection('down')
                        setShowHint(w.clue)
                        inputRef.current?.focus()
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                        solvedWords.includes(w.word)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700/30 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-bold mr-1.5">{acrossCount + i + 1}.</span>
                      {w.clue}
                      {solvedWords.includes(w.word) && (
                        <span className="ml-1.5 text-emerald-400 text-xs">✓ {w.word}</span>
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
                  onClick={() => {
                    const stars = Math.min(3, Math.floor(totalScore / 200) + 1)
                    showRewardPopup('Crossword Champion! 🏆', `You earned ${stars} stars!`, 'win', stars)
                    soundManager.play('win')
                    setTimeout(() => {
                      onComplete(totalScore, stars)
                    }, 2500)
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white"
                >
                  Finish Game
                </button>
              )}
            </div>
          </div>
        )}

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
    </div>
  )
}
