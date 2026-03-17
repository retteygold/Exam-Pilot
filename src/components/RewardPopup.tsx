import { useState, useEffect } from 'react'
import { Trophy, Star, Crown, Medal, Sparkles, X } from 'lucide-react'
import { soundManager } from '../utils/soundManager'

interface RewardPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'achievement' | 'levelUp' | 'stars' | 'milestone' | 'win'
  value?: number
}

const icons = {
  achievement: Trophy,
  levelUp: Crown,
  stars: Star,
  milestone: Medal,
  win: Sparkles
}

const colors = {
  achievement: 'from-yellow-400 to-amber-500',
  levelUp: 'from-purple-400 to-pink-500',
  stars: 'from-yellow-300 to-orange-400',
  milestone: 'from-blue-400 to-cyan-500',
  win: 'from-green-400 to-emerald-500'
}

export function RewardPopup({ isOpen, onClose, title, message, type, value }: RewardPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)
  const Icon = icons[type]

  useEffect(() => {
    if (isOpen) {
      // Play sound effect
      soundManager.play(type === 'achievement' ? 'achievement' : type === 'levelUp' ? 'levelUp' : 'win')
      
      // Trigger animations
      setShowConfetti(true)
      setAnimationPhase(1)
      
      const timer1 = setTimeout(() => setAnimationPhase(2), 100)
      const timer2 = setTimeout(() => setAnimationPhase(3), 300)
      
      // Auto close after 4 seconds
      const closeTimer = setTimeout(() => {
        onClose()
      }, 4000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(closeTimer)
      }
    }
  }, [isOpen, type, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />
      
      {/* Confetti */}
      {showConfetti && <ConfettiEffect />}
      
      {/* Popup Card */}
      <div 
        className={`relative bg-gradient-to-br ${colors[type]} p-1 rounded-3xl shadow-2xl pointer-events-auto transform transition-all duration-500 ${
          animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } ${animationPhase >= 2 ? 'rotate-0' : 'rotate-12'} ${animationPhase >= 3 ? 'translate-y-0' : '-translate-y-10'}`}
      >
        <div className="bg-slate-900 rounded-3xl p-8 text-center relative overflow-hidden min-w-[320px]">
          {/* Animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon with glow effect */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 bg-gradient-to-r ${colors[type]} blur-2xl opacity-50 animate-pulse`} />
            <div className={`relative w-24 h-24 mx-auto bg-gradient-to-br ${colors[type]} rounded-full flex items-center justify-center shadow-lg animate-bounce`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
            {title}
          </h2>
          
          {/* Message */}
          <p className="text-slate-300 mb-4 relative z-10">
            {message}
          </p>

          {/* Value display (for stars/points) */}
          {value && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
              <span className="text-4xl font-bold text-yellow-400">+{value}</span>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={onClose}
            className={`relative z-10 px-8 py-3 bg-gradient-to-r ${colors[type]} rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
          >
            Awesome! 🎉
          </button>
        </div>
      </div>
    </div>
  )
}

// Confetti component
function ConfettiEffect() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    color: string
    size: number
    rotation: number
    delay: number
  }>>([])

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
    const newParticles = [...Array(50)].map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 100, // Center spread
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  )
}

// CSS for confetti animation (add to global styles)
const confettiStyles = `
@keyframes confetti {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(100vh) rotate(720deg);
  }
}

.animate-confetti {
  animation: confetti 2s ease-out forwards;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = confettiStyles
  document.head.appendChild(style)
}

export default RewardPopup
