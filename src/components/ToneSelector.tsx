import React from 'react'
import { Sparkles } from 'lucide-react'

interface ToneSelectorProps {
  selectedTone: string
  onChange: (tone: string) => void
  onSurpriseMe: () => void
}

const tones = [
  { id: 'clarity', label: 'Clarity' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'formal', label: 'Formal' },
  // Free tier has limited tones
]

const ToneSelector: React.FC<ToneSelectorProps> = ({ 
  selectedTone, 
  onChange, 
  onSurpriseMe 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
        Select Tone
      </label>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {tones.map((tone) => (
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