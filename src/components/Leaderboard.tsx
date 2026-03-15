import { useKidsStore } from '../store/kidsStore'
import { Trophy, Star, User } from 'lucide-react'

interface LeaderboardProps {
  currentKidId?: string
}

export function Leaderboard({ currentKidId }: LeaderboardProps) {
  const { getLeaderboard } = useKidsStore()
  const leaderboard = getLeaderboard()

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-orange-500'
    if (index === 1) return 'from-slate-300 to-slate-400'
    if (index === 2) return 'from-amber-600 to-amber-700'
    return 'from-purple-500 to-pink-500'
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold text-white">Leaderboard</h3>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No players yet!</p>
          <p className="text-xs mt-1">Be the first to play!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.kid.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                entry.kid.id === currentKidId
                  ? 'bg-purple-500/20 border border-purple-500/50'
                  : 'bg-slate-700/50 hover:bg-slate-700'
              }`}
            >
              {/* Rank */}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRankColor(
                  index
                )} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
              >
                {typeof getRankIcon(index) === 'string' && getRankIcon(index).length > 2
                  ? getRankIcon(index)
                  : getRankIcon(index)}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-2xl">
                {entry.kid.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {entry.kid.name}
                  {entry.kid.id === currentKidId && (
                    <span className="ml-2 text-xs text-purple-400">(You)</span>
                  )}
                </p>
                <p className="text-xs text-slate-400">{entry.sessions} games played</p>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">{entry.totalStars}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mini stats footer */}
      {leaderboard.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            {leaderboard.length} player{leaderboard.length !== 1 ? 's' : ''} competing
          </p>
        </div>
      )}
    </div>
  )
}
