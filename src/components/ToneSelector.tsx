import React from 'react'
import { Sparkles, Lock } from 'lucide-react'
import { useGameification } from '@/hooks/useGameification'
import { UnlockableTone } from '@/hooks/gameificationTypes'

interface ToneSelectorProps {
  selectedTone: string
  onChange: (tone: string) => void
  onSurpriseMe: () => void
}

const baseTones = [
  { id: 'clarity', label: 'Clarity' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'formal', label: 'Formal' },
  // Base tones always available
]

const ToneSelector: React.FC<ToneSelectorProps> = ({ 
  selectedTone, 
  onChange, 
  onSurpriseMe 
}) => {
  const { unlockableTones } = useGameification()
  
  // Combine base tones with unlocked tones
  const allTones = [
    ...baseTones,
    ...unlockableTones
      .filter(tone => tone.unlocked)
      .map(tone => ({ id: tone.id, label: tone.name }))
  ]
  
  // Get locked tones to display
  const lockedTones = unlockableTones
    .filter(tone => !tone.unlocked)
    .slice(0, 2) // Only show up to 2 locked tones to avoid cluttering the UI
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
        Select Tone
      </label>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {allTones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`py-2 px-3 text-sm rounded-md border transition-colors
                      ${selectedTone === tone.id 
                        ? 'bg-primary text-primary-foreground border-primary/30'
                        : 'bg-card text-card-foreground border-border hover:bg-secondary/20'}`}
          >
            {tone.label}
          </button>
        ))}
        
        {/* Show locked tones */}
        {lockedTones.map((tone) => (
          <div
            key={tone.id}
            className="relative py-2 px-3 text-sm rounded-md border border-border
                      bg-muted/30 text-muted-foreground cursor-default group"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              {tone.name}
            </div>
            
            {/* Tooltip showing unlock requirements */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48
                         bg-popover text-popover-foreground text-xs p-2 rounded shadow-md
                         opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="text-xs font-medium">{tone.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tone.description}</div>
              <div className="text-xs mt-1 font-medium">
                Unlock with: {tone.unlockRequirement.type === 'xp' 
                  ? `${tone.unlockRequirement.value} XP` 
                  : `${tone.unlockRequirement.value} Day Streak`}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={onSurpriseMe}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 
                 bg-accent text-accent-foreground rounded-md hover:bg-accent/90
                 transition-colors shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Surprise Me!</span>
      </button>
    </div>
  )
}

export default ToneSelector 