import React, { useState } from 'react'
import { CopyIcon, CheckIcon, RefreshCw } from 'lucide-react'

interface RewriteBattleProps {
  originalText: string
  onRewriteAgain: () => void
}

const RewriteBattle: React.FC<RewriteBattleProps> = ({ originalText, onRewriteAgain }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [versionA, setVersionA] = useState('')
  const [versionB, setVersionB] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<'A' | 'B' | null>(null)

  const generateBattle = async () => {
    setIsLoading(true)
    
    try {
      // Mock API delay - in production this would call the AI API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate two different versions with slightly different style
      setVersionA(`Here's version A: ${originalText} with additional clarity and precision.`)
      setVersionB(`Version B approaches it differently: ${originalText} with more personality and engagement.`)
    } catch (error) {
      console.error("Error generating battle:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, version: string) => {
    navigator.clipboard.writeText(text)
    setCopied(version)
    setTimeout(() => setCopied(null), 2000)
  }

  const selectVersion = (version: 'A' | 'B') => {
    setSelectedVersion(version)
    // In a real implementation, we would save the selected version to history
    // and handle the replacement in the text field as needed
    
    // For demo, we just simulate confirmation
    setTimeout(() => {
      setSelectedVersion(null)
      // After selecting, we could either:
      // 1. Close the battle view and return to input
      // 2. Show a "Version selected" message
      onRewriteAgain() // Return to input view
    }, 1000)
  }

  if (!versionA && !versionB && !isLoading) {
    return (
      <div className="mt-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-4">
          Generate two different rewrites and compare them side-by-side
        </p>
        <button
          onClick={generateBattle}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md 
                    hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          Start Rewrite Battle
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Choose Your Favorite Rewrite</h3>
        <button 
          onClick={onRewriteAgain}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Try Again
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Version A */}
          <div className={`p-3 border rounded-md ${selectedVersion === 'A' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-secondary/20 rounded-full">Version A</span>
              <button 
                onClick={() => copyToClipboard(versionA, 'A')}
                className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
              >
                {copied === 'A' ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-sm">{versionA}</p>
            <button
              onClick={() => selectVersion('A')}
              className="mt-3 w-full py-1 px-2 text-xs bg-secondary text-secondary-foreground rounded-md 
                        hover:bg-secondary/90 focus:outline-none focus:ring-1 focus:ring-secondary/50"
            >
              {selectedVersion === 'A' ? 'Selected!' : 'Select Version A'}
            </button>
          </div>

          {/* Version B */}
          <div className={`p-3 border rounded-md ${selectedVersion === 'B' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-accent/20 rounded-full">Version B</span>
              <button 
                onClick={() => copyToClipboard(versionB, 'B')}
                className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
              >
                {copied === 'B' ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-sm">{versionB}</p>
            <button
              onClick={() => selectVersion('B')}
              className="mt-3 w-full py-1 px-2 text-xs bg-accent text-accent-foreground rounded-md 
                        hover:bg-accent/90 focus:outline-none focus:ring-1 focus:ring-accent/50"
            >
              {selectedVersion === 'B' ? 'Selected!' : 'Select Version B'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RewriteBattle 