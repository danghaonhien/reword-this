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
      <label className="block text-sm font-medium mb-2">
        Select Tone
      </label>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`py-2 px-3 text-sm rounded-md 
                      ${selectedTone === tone.id 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {tone.label}
          </button>
        ))}
      </div>
      
      <button
        onClick={onSurpriseMe}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 
                 bg-accent text-accent-foreground rounded-md hover:bg-accent/80"
      >
        <Sparkles className="w-4 h-4" />
        <span>Surprise Me!</span>
      </button>
    </div>
  )
}

export default ToneSelector 