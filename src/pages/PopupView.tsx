import React, { useState, useEffect } from 'react'
import { 
  Moon, 
  Sun, 
  Sparkles, 
  RotateCcw, 
  X,
  Trophy,
  Flame
} from 'lucide-react'
import ToneSelector from '../components/ToneSelector'
import RewordHistory from '../components/RewordHistory'
import RewriteBattle from '../components/RewriteBattle'
import CustomToneBuilder from '../components/CustomToneBuilder'
import RewardsPanel from '../components/RewardsPanel'
import { useRewrite } from '../hooks/useRewrite'
import { useGameification } from '../hooks/useGameification'

// Function to get level title based on level
const getLevelTitle = (level: number): string => {
  const titles = [
    "Word Novice",             // Level 1
    "Phrase Apprentice",       // Level 2
    "Sentence Crafter",        // Level 3
    "Expression Artisan",      // Level 4
    "Tone Virtuoso",           // Level 5
    "Wordsmith Wizard",        // Level 6
    "Lexical Alchemist",       // Level 7
    "Prose Mastermind",        // Level 8
    "Language Luminary",       // Level 9
    "Reword Royalty"           // Level 10+
  ];
  
  return level <= titles.length ? titles[level - 1] : "Reword Legend";
}

const PopupView: React.FC = () => {
  const [textToRewrite, setTextToRewrite] = useState('')
  const [rewrite, setRewrite] = useState('')
  const [selectedTone, setSelectedTone] = useState('clarity')
  const [showInput, setShowInput] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('reword-dark-mode')
    return savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [currentView, setCurrentView] = useState<'rewrite' | 'battle' | 'custom' | 'rewards'>('rewrite')
  const gameification = useGameification()
  const { addXP, xp, level, streak } = gameification
  
  // Close the popup window (extension only)
  const closeApp = () => {
    if (window.close) {
      window.close()
    }
  }

  // Toggle dark mode and save the preference
  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('reword-dark-mode', newMode.toString())
    
    // Update document class for dark mode
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Set dark mode based on saved preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Save rewrite to history
  const saveToHistory = (original: string, rewritten: string, tone: string) => {
    try {
      const storedHistory = localStorage.getItem('reword-history')
      const history = storedHistory ? JSON.parse(storedHistory) : []
      
      // Add new item to history
      const newItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        originalText: original,
        rewrittenText: rewritten,
        tone: tone,
        timestamp: Date.now()
      }
      
      // Add to start of array (newest first)
      const updatedHistory = [newItem, ...history].slice(0, 100) // Keep only the latest 100 items
      
      // Save back to localStorage
      localStorage.setItem('reword-history', JSON.stringify(updatedHistory))
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('rewordHistoryUpdated'))
      
      // Award XP for completing a rewrite
      addXP(5)
    } catch (error) {
      console.error('Error saving to history:', error)
    }
  }

  // Handle a rewrite from the regular flow
  const handleRewrite = (text: string) => {
    setRewrite(text)
    setShowInput(false)
    // Only save to history if we have both texts
    if (textToRewrite && text) {
      saveToHistory(textToRewrite, text, selectedTone)
    }
  }

  // Handle text selection from history
  const handleHistorySelect = (text: string) => {
    setTextToRewrite(text)
    setShowInput(true)
    setRewrite('')
  }

  // Reset to input view
  const resetView = () => {
    setShowInput(true)
    setRewrite('')
    setCurrentView('rewrite')
  }

  // Start another rewrite with the same text
  const rewriteAgain = () => {
    setShowInput(true)
    setRewrite('')
  }

  // Function for the surprise me feature
  const handleSurpriseMe = () => {
    // This would trigger a rewrite with a surprise tone
    console.log('Surprise me clicked');
  }

  return (
    <div className="flex flex-grow h-full max-h-[600px] bg-background">
      {/* Sidebar */}
      <div className="flex flex-col items-center w-12 py-4 bg-card border-r border-border">
        {/* Navigation buttons */}
        <div className="flex flex-col items-center gap-3 mb-auto">
          <button 
            onClick={() => setCurrentView('rewrite')}
            className={`p-2 rounded-full ${currentView === 'rewrite' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
            title="Standard Rewrite"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setCurrentView('battle')}
            className={`p-2 rounded-full ${currentView === 'battle' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
            title="Battle Rewrite"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={() => setCurrentView('custom')}
            className={`p-2 rounded-full ${currentView === 'custom' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
            title="Custom Tone Rewrite"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 20L3 17V4L9 7M9 20V7M9 20L15 17M9 7L15 4M15 4L21 7V20L15 17M15 17V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <button
            onClick={() => setCurrentView('rewards')}
            className={`p-2 rounded-full ${currentView === 'rewards' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
            title="Rewards"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={closeApp}
            className="p-2 rounded-full hover:bg-destructive/20 text-destructive"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full max-h-[600px] overflow-hidden">
        {/* Main content - conditionally render based on current view */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'rewards' ? (
            <div className="h-full overflow-auto custom-scrollbar p-4">
              <RewardsPanel onBack={resetView} />
            </div>
          ) : (
            <div className="h-full overflow-auto custom-scrollbar p-4">
              {showInput ? (
                <>
                  {/* XP Display Component */}
                  <div className="mb-4 bg-card border border-border rounded-md p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{getLevelTitle(level)}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">Lvl {level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">{streak} day streak</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${xp % 100}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                      <span>{xp} XP</span>
                      <span>{100 - (xp % 100)} XP to next level</span>
                    </div>
                  </div>

                  <TextInput 
                    text={textToRewrite} 
                    onTextChange={setTextToRewrite} 
                    onRewriteClick={() => setShowInput(false)}
                  />
                  
                  {currentView === 'rewrite' && (
                    <ToneSelector 
                      selectedTone={selectedTone} 
                      onChange={setSelectedTone} 
                      onSurpriseMe={handleSurpriseMe}
                    />
                  )}
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Recent Rewordings</h3>
                      <RewordHistory 
                        onSelectHistoryItem={handleHistorySelect} 
                        hideLabel
                      />
                    </div>
                    <RewordHistory 
                      onSelectHistoryItem={handleHistorySelect}
                      fullPage
                      showLimited
                    />
                  </div>
                </>
              ) : (
                <>
                  {currentView === 'rewrite' && (
                    <div className="space-y-4">
                      <RewordResult 
                        originalText={textToRewrite}
                        tone={selectedTone}
                        onRewrittenText={handleRewrite}
                        onRewriteAgain={rewriteAgain}
                      />
                    </div>
                  )}
                  
                  {currentView === 'battle' && (
                    <RewriteBattle 
                      originalText={textToRewrite}
                      onRewriteAgain={rewriteAgain}
                    />
                  )}
                  
                  {currentView === 'custom' && (
                    <CustomToneBuilder
                      originalText={textToRewrite}
                      onRewriteAgain={rewriteAgain}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Component to handle the rewritten result
const RewordResult: React.FC<{
  originalText: string
  tone: string
  onRewrittenText: (text: string) => void
  onRewriteAgain: () => void
}> = ({ originalText, tone, onRewrittenText, onRewriteAgain }) => {
  const { rewrite, isLoading, rewrittenText, error } = useRewrite()
  const [copied, setCopied] = useState(false)
  
  // Trigger rewrite on component mount
  useEffect(() => {
    if (originalText) {
      rewrite(originalText, tone)
    }
  }, [originalText, tone])
  
  // Pass the rewritten text up to the parent when it's ready
  useEffect(() => {
    if (rewrittenText) {
      onRewrittenText(rewrittenText)
    }
  }, [rewrittenText])
  
  // Copy text to clipboard
  const copyToClipboard = () => {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          console.error('Failed to copy text:', err)
        })
    }
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-center">Rewriting with <span className="capitalize font-medium">{tone}</span> tone...</p>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md">
        <h3 className="text-destructive font-medium mb-2">Error</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => rewrite(originalText, tone)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }
  
  // Show the rewritten text
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Rewritten with <span className="capitalize">{tone}</span> tone</h3>
          <button
            onClick={copyToClipboard}
            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <p className="text-sm whitespace-pre-wrap">{rewrittenText}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Original Text</h4>
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{originalText}</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onRewriteAgain}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted/30 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Rewrite Again
        </button>
      </div>
    </div>
  )
}

// Define TextInput component since it's missing
interface TextInputProps {
  text: string
  onTextChange: (text: string) => void
  onRewriteClick: () => void
}

const TextInput: React.FC<TextInputProps> = ({ text, onTextChange, onRewriteClick }) => {
  return (
    <div className="mb-4">
      <div className="border border-border rounded-md bg-card overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text to rewrite..."
          className="w-full min-h-[150px] p-3 bg-transparent resize-none focus:outline-none"
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={onRewriteClick}
          disabled={!text.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rewrite
        </button>
      </div>
    </div>
  )
}

export default PopupView 