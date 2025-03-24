import { useState, useEffect } from 'react'
import { useRewrite } from '@/hooks/useRewrite'
import { useGameification } from '@/hooks/useGameification'
import RewriteInput from '@/components/RewriteInput'
import ToneSelector from '@/components/ToneSelector'
import RewriteOutput from '@/components/RewriteOutput'
import RewriteBattle from '@/components/RewriteBattle'
import CustomToneBuilder from '@/components/CustomToneBuilder'
import XPDisplay from '@/components/XPDisplay'
import RewordHistory from '@/components/RewordHistory'
import { Moon, Sun, Swords, Palette, ArrowLeft, History } from 'lucide-react'

interface PopupViewProps {
  initialText: string
}

type ViewMode = 'input' | 'output' | 'battle' | 'custom-tone' | 'history'

const PopupView = ({ initialText }: PopupViewProps) => {
  const [inputText, setInputText] = useState(initialText || '')
  const [selectedTone, setSelectedTone] = useState('clarity')
  const [viewMode, setViewMode] = useState<ViewMode>('input')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  
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
    setViewMode('output')
    addXP(10) // Add XP when user successfully rewrites text
  }

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone)
    if (viewMode !== 'input') {
      setViewMode('input')
    }
  }

  const handleSurpriseMe = async () => {
    if (!inputText.trim()) return
    
    await rewrite(inputText, 'surprise')
    setViewMode('output')
    addXP(15) // Extra XP for using "Surprise Me" feature
  }

  const resetView = () => {
    setViewMode('input')
  }

  const startBattle = () => {
    if (!inputText.trim()) return
    setViewMode('battle')
    addXP(5) // Some XP for starting a battle
  }

  const openCustomToneBuilder = () => {
    if (!inputText.trim()) return
    setViewMode('custom-tone')
    addXP(5) // Some XP for using custom tone builder
  }

  const openHistory = () => {
    setViewMode('history')
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const handleSelectHistoryItem = (text: string) => {
    setInputText(text)
    setViewMode('input')
  }

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col p-5">
        <div className="flex justify-end mb-4">
          <XPDisplay xp={xp} streak={streak} />
        </div>
        
        {viewMode !== 'input' && (
          <button 
            onClick={resetView}
            className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Input
          </button>
        )}
        
        {viewMode === 'input' && (
          <>
            <RewriteInput 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              className="min-h-[180px]"
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
        )}
        
        {viewMode === 'output' && (
          <RewriteOutput 
            originalText={inputText}
            rewrittenText={rewrittenText}
            tone={selectedTone}
            onRewriteAgain={resetView}
          />
        )}
        
        {viewMode === 'battle' && (
          <RewriteBattle 
            originalText={inputText}
            onRewriteAgain={resetView}
          />
        )}
        
        {viewMode === 'custom-tone' && (
          <CustomToneBuilder 
            originalText={inputText}
            onRewriteAgain={resetView}
          />
        )}
        
        {viewMode === 'history' && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-4">Rewrite History</h3>
            <RewordHistory 
              onSelectHistoryItem={handleSelectHistoryItem} 
              fullPage 
            />
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="w-12 border-l border-border flex flex-col items-center pt-4 bg-muted/20">
        {/* History button */}
        <div className="group relative mb-6">
          <button 
            onClick={openHistory}
            className={`p-1.5 rounded-sm transition-colors ${
              viewMode === 'history' 
                ? 'bg-primary/20 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="View history"
          >
            <History className="w-5 h-5" />
          </button>
          <span className="absolute left-[-80px] top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
            History
          </span>
        </div>
        
        {/* Battle button */}
        <div className="group relative mb-6">
          <button 
            onClick={startBattle}
            disabled={!inputText.trim()}
            className={`p-1.5 rounded-sm transition-colors ${
              viewMode === 'battle' 
                ? 'bg-primary/20 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Battle of rewrites"
          >
            <Swords className="w-5 h-5" />
          </button>
          <span className="absolute left-[-80px] top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
            Battle
          </span>
        </div>
        
        {/* Custom tone button */}
        <div className="group relative mb-6">
          <button 
            onClick={openCustomToneBuilder}
            disabled={!inputText.trim()}
            className={`p-1.5 rounded-sm transition-colors ${
              viewMode === 'custom-tone' 
                ? 'bg-primary/20 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Custom tone builder"
          >
            <Palette className="w-5 h-5" />
          </button>
          <span className="absolute left-[-80px] top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
            Custom
          </span>
        </div>
        
        {/* Theme toggle button */}
        <div className="group relative mt-auto mb-4">
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="absolute left-[-80px] bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
            {isDarkMode ? "Light mode" : "Dark mode"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PopupView 