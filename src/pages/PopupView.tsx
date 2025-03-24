import { useState, useEffect } from 'react'
import { useRewrite } from '@/hooks/useRewrite'
import { useGameification } from '@/hooks/useGameification'
import RewriteInput from '@/components/RewriteInput'
import ToneSelector from '@/components/ToneSelector'
import RewriteOutput from '@/components/RewriteOutput'
import XPDisplay from '@/components/XPDisplay'
import Header from '@/components/Header'

interface PopupViewProps {
  initialText: string
}

const PopupView = ({ initialText }: PopupViewProps) => {
  const [inputText, setInputText] = useState(initialText || '')
  const [selectedTone, setSelectedTone] = useState('clarity')
  const [showOutput, setShowOutput] = useState(false)
  
  const { rewrite, isLoading, rewrittenText } = useRewrite()
  const { xp, streak, addXP } = useGameification()

  useEffect(() => {
    if (initialText) {
      setInputText(initialText)
    }
  }, [initialText])

  const handleRewrite = async () => {
    if (!inputText.trim()) return

    await rewrite(inputText, selectedTone)
    setShowOutput(true)
    addXP(10) // Add XP when user successfully rewrites text
  }

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone)
    setShowOutput(false)
  }

  const handleSurpriseMe = async () => {
    if (!inputText.trim()) return
    
    await rewrite(inputText, 'surprise')
    setShowOutput(true)
    addXP(15) // Extra XP for using "Surprise Me" feature
  }

  const resetView = () => {
    setShowOutput(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      
      <XPDisplay xp={xp} streak={streak} />
      
      {!showOutput ? (
        <>
          <RewriteInput 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
          />
          
          <ToneSelector 
            selectedTone={selectedTone} 
            onChange={handleToneChange} 
            onSurpriseMe={handleSurpriseMe}
          />
          
          <button
            onClick={handleRewrite}
            disabled={isLoading || !inputText.trim()}
            className="mt-4 w-full py-2 px-4 bg-primary text-primary-foreground rounded-md 
                      hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Rewriting...' : 'Reword This!'}
          </button>
        </>
      ) : (
        <RewriteOutput 
          originalText={inputText}
          rewrittenText={rewrittenText}
          tone={selectedTone}
          onRewriteAgain={resetView}
        />
      )}
    </div>
  )
}

export default PopupView 