// Sound effects utility for games and achievements
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true

  constructor() {
    // Initialize with empty sounds - will be loaded on first use
    this.loadSounds()
  }

  private loadSounds() {
    // Create synthetic sounds using Web Audio API for better compatibility
    this.sounds.set('correct', this.createBeep(800, 0.1, 'sine'))
    this.sounds.set('wrong', this.createBeep(200, 0.3, 'sawtooth'))
    this.sounds.set('achievement', this.createSuccessSound())
    this.sounds.set('levelUp', this.createLevelUpSound())
    this.sounds.set('click', this.createBeep(600, 0.05, 'sine'))
    this.sounds.set('win', this.createWinSound())
    this.sounds.set('star', this.createStarSound())
  }

  private createBeep(_frequency: number, _duration: number, _type: OscillatorType): HTMLAudioElement {
    // Return a dummy audio element - actual playback uses Web Audio API
    return new Audio()
  }

  private createSuccessSound(): HTMLAudioElement {
    return new Audio()
  }

  private createLevelUpSound(): HTMLAudioElement {
    return new Audio()
  }

  private createWinSound(): HTMLAudioElement {
    return new Audio()
  }

  private createStarSound(): HTMLAudioElement {
    return new Audio()
  }

  // Play sound using Web Audio API for better browser support
  play(soundName: string) {
    if (!this.enabled) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      switch (soundName) {
        case 'correct':
          this.playTone(audioContext, 880, 0.1, 'sine')
          setTimeout(() => this.playTone(audioContext, 1100, 0.1, 'sine'), 100)
          break
        case 'wrong':
          this.playTone(audioContext, 150, 0.3, 'sawtooth')
          break
        case 'achievement':
          this.playAchievementSound(audioContext)
          break
        case 'levelUp':
          this.playLevelUpSound(audioContext)
          break
        case 'click':
          this.playTone(audioContext, 600, 0.05, 'sine')
          break
        case 'win':
          this.playWinSound(audioContext)
          break
        case 'star':
          this.playTone(audioContext, 1200, 0.15, 'sine')
          setTimeout(() => this.playTone(audioContext, 1600, 0.2, 'sine'), 100)
          break
      }
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  private playTone(audioContext: AudioContext, frequency: number, duration: number, type: OscillatorType) {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  private playAchievementSound(audioContext: AudioContext) {
    const notes = [523, 659, 784, 1047] // C major arpeggio
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(audioContext, freq, 0.15, 'sine'), i * 100)
    })
  }

  private playLevelUpSound(audioContext: AudioContext) {
    const notes = [440, 554, 659, 880, 1109] // Ascending fanfare
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(audioContext, freq, 0.2, 'sine'), i * 80)
    })
  }

  private playWinSound(audioContext: AudioContext) {
    const notes = [523, 659, 784, 1047, 1319, 1568] // Victory scale
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(audioContext, freq, 0.15, 'sine'), i * 120)
    })
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }
}

export const soundManager = new SoundManager()
