import React, { useState, useEffect } from 'react'
import { Sparkles, Lock } from 'lucide-react'
import { useGameification } from '@/hooks/useGameification'
import { UnlockableTone } from '@/hooks/gameificationTypes'
import PremiumRewardTeaser from './PremiumRewardTeaser'

interface ToneSelectorProps {
  selectedTone: string
  onChange: (tone: string) => void
  onSurpriseMe: () => void
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ 
  selectedTone, 
  onChange, 
  onSurpriseMe 
}) => {
  const { unlockableTones } = useGameification()
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([])
  
  // Get all available tones
  const availableTones = unlockableTones
    .filter(tone => tone.unlocked)
    .map(tone => ({ id: tone.id, label: tone.name }))
  
  // Get locked tones to display
  const lockedTones = unlockableTones
    .filter(tone => !tone.unlocked)
    .slice(0, 2) // Only show up to 2 locked tones to avoid cluttering the UI
    
  // Get premium tones to display
  const premiumTones = unlockableTones
    .filter(tone => !tone.unlocked && tone.unlockRequirement.value === 9999)
    .slice(0, 1) // Just show one premium tone
  
  // Listen for unlocked tones
  useEffect(() => {
    const handleRewardUnlocked = (event: Event) => {
      const customEvent = event as CustomEvent
      const details = customEvent.detail.unlockedDetails
      
      if (details.tones && details.tones.length > 0) {
        setRecentlyUnlocked(details.tones)
        
        // Clear the animation after 5 seconds
        setTimeout(() => {
          setRecentlyUnlocked([])
        }, 5000)
      }
    }
    
    window.addEventListener('rewardUnlocked', handleRewardUnlocked)
    
    return () => window.removeEventListener('rewardUnlocked', handleRewardUnlocked)
  }, [])
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
        Select Tone
      </label>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {availableTones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`py-2 px-3 text-sm rounded-md border transition-colors relative group 
                      ${selectedTone === tone.id 
                        ? 'bg-primary text-primary-foreground border-primary/30'
                        : 'bg-card text-card-foreground border-border hover:bg-secondary/20 '}
                      ${recentlyUnlocked.includes(tone.id) ? 'ring-2 ring-accent animate-pulse' : ''}`}
          >
            {tone.label}
            {recentlyUnlocked.includes(tone.id) && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] px-1 rounded-full">New!</span>
            )}
            
            {/* Tooltip showing tone description */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48
                         bg-popover text-popover-foreground text-xs p-2 rounded shadow-md
                         opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left z-10">
              <div className="text-xs font-medium">{tone.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {unlockableTones.find(t => t.id === tone.id)?.description || ''}
              </div>
              {tone.id === 'clarity' && (
                <div className="text-xs mt-1 font-medium text-primary">Available from start</div>
              )}
            </div>
          </button>
        ))}
        
        {/* Show locked tones */}
        {lockedTones
          .filter(tone => !premiumTones.includes(tone))
          .map((tone) => (
          <div
            key={`locked-${tone.id}`}
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
                         opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
        
        {/* Show premium tones */}
        {premiumTones.length > 0 && (
          <div
            key={`premium-${premiumTones[0].id}`}
            className="relative py-2 px-3 text-sm rounded-md border border-dashed border-primary/40
                      bg-primary/5 text-primary-foreground cursor-default group"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-primary" />
              <span>Premium</span>
            </div>
            
            {/* Premium tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48
                         bg-popover text-popover-foreground text-xs p-2 rounded shadow-md
                         opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="text-xs font-medium">Premium Tones</div>
              <div className="text-xs text-muted-foreground mt-1">Subscribe to unlock exclusive premium tones.</div>
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={onSurpriseMe}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 
                 bg-accent text-accent-foreground rounded-md hover:bg-accent/90
                 transition-colors shadow-sm group relative"
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Surprise Me!</span>
        
        {/* Tooltip explaining surprise me functionality */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64
                     bg-popover text-popover-foreground text-xs p-2 rounded shadow-md
                     opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left z-10">
          <div className="text-xs font-medium">Surprise Me</div>
          <div className="text-xs text-muted-foreground mt-1">
            Automatically selects a random tone from your unlocked tones to rewrite your text.
            A fun way to discover different writing styles!
          </div>
        </div>
      </button>
    </div>
  )
}

export default ToneSelector 