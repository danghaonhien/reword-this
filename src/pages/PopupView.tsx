import React, { useState, useEffect } from 'react'
import { 
  Moon, 
  Sun, 
  Sparkles, 
  RotateCcw, 
  X,
  Trophy,
  Flame,
  History,
  Swords,
  Palette,
  Info,
  Trash2,
  ChevronDown
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

interface HistoryItem {
  id: string
  originalText: string
  rewrittenText: string
  tone: string
  timestamp: number
}

interface PopupViewProps {
  selectedText?: string
}

const PopupView: React.FC<PopupViewProps> = ({ selectedText = '' }) => {
  const [textToRewrite, setTextToRewrite] = useState(selectedText)
  const [rewrite, setRewrite] = useState('')
  const [isRewording, setIsRewording] = useState(false)
  const [selectedTone, setSelectedTone] = useState('clarity')
  const [showInput, setShowInput] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('reword-dark-mode')
    return savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [currentView, setCurrentView] = useState<'battle' | 'custom' | 'rewards' | 'history' | null>(null)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [showAllHistory, setShowAllHistory] = useState(false)
  const gameification = useGameification()
  const { addXP, xp, level, streak } = gameification
  const { rewrite: rewriteText } = useRewrite()
  
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
  
  // Update textToRewrite when selectedText changes
  useEffect(() => {
    if (selectedText) {
      setTextToRewrite(selectedText)
    }
  }, [selectedText])
  
  // Load history on mount and when it updates
  const loadHistory = () => {
    const storedHistory = localStorage.getItem('reword-history')
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as HistoryItem[]
        setHistoryItems(parsedHistory)
      } catch (error) {
        console.error('Error parsing history:', error)
      }
    }
  }
  
  useEffect(() => {
    loadHistory()
    window.addEventListener('rewordHistoryUpdated', loadHistory)
    return () => {
      window.removeEventListener('rewordHistoryUpdated', loadHistory)
    }
  }, [])

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
    // Only save to history if we have both texts and they're not empty
    if (textToRewrite && text && text.trim() !== '') {
      // Set rewrite text
      setRewrite(text)
      
      // Save to history
      saveToHistory(textToRewrite, text, selectedTone)
    }
  }

  // Update the home screen 'Reword This' button to trigger the inline rewrite
  const handleRewordButtonClick = () => {
    // Trigger the rewrite with the current text and tone
    inlineRewrite(textToRewrite, selectedTone)
  }

  // Function for the surprise me feature
  const handleSurpriseMe = () => {
    // Set the tone to surprise (only if it's different)
    if (selectedTone !== 'surprise') {
      setSelectedTone('surprise')
    }
    
    // Trigger the rewrite with surprise tone
    inlineRewrite(textToRewrite, 'surprise')
  }

  // Function to handle inline rewrites
  const inlineRewrite = async (text: string, tone: string) => {
    if (!text.trim()) return;
    
    // Clear previous rewrite
    setRewrite('')
    // Set loading state
    setIsRewording(true)
    
    // Use the useRewrite hook's rewrite function
    try {
      const result = await rewriteText(text, tone)
      if (result) {
        // Set the rewritten text
        setRewrite(result)
        // Save to history
        saveToHistory(text, result, tone)
        // Add XP
        addXP(5)
      }
    } catch (error) {
      console.error("Error during inline rewrite:", error)
    } finally {
      setIsRewording(false)
    }
  }

  // Handle text selection from history
  const handleHistorySelect = (text: string) => {
    setTextToRewrite(text)
    setShowInput(true)
    setRewrite('')
    setCurrentView(null)
  }
  
  // Handle history item deletion
  const handleDeleteHistoryItem = (id: string) => {
    try {
      const updatedItems = historyItems.filter(item => item.id !== id)
      localStorage.setItem('reword-history', JSON.stringify(updatedItems))
      setHistoryItems(updatedItems)
      
      // Notify other components
      window.dispatchEvent(new Event('rewordHistoryUpdated'))
    } catch (error) {
      console.error('Error deleting history item:', error)
    }
  }

  // Reset to input view
  const resetView = () => {
    setShowInput(true)
    setRewrite('')
    setCurrentView(null)
    setShowAllHistory(false)
  }

  // Start another rewrite with the same text
  const rewriteAgain = () => {
    setRewrite('')
  }

  // Filter history items for display
  const getDisplayHistoryItems = () => {
    if (showAllHistory) {
      return historyItems;
    }
    return historyItems.slice(0, 4);
  }

  const displayHistoryItems = getDisplayHistoryItems();
  const hasMoreHistoryItems = !showAllHistory && historyItems.length > 4;

  return (
    <div className="flex flex-grow h-full min-h-screen bg-background">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Main content - conditionally render based on current view */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentView === 'rewards' ? (
            <div className="h-full min-h-0 overflow-auto custom-scrollbar p-4">
              <button
                onClick={resetView}
                className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
              >
                ← Back to Home
              </button>
              <RewardsPanel onBack={resetView} />
            </div>
          ) : currentView === 'history' ? (
            <div className="h-full min-h-0 overflow-auto custom-scrollbar p-4">
              <button
                onClick={resetView}
                className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
              >
                ← Back to Home
              </button>
              <h3 className="text-sm font-medium mb-4">Rewrite History</h3>
              <div className="space-y-3">
                {historyItems.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-md">
                    No history yet. Start rewriting to build history!
                  </div>
                ) : (
                  <>
                    {displayHistoryItems.map((item) => (
                      <div key={item.id} className="border border-border rounded-md p-2 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="capitalize font-medium text-xs">{item.tone} tone</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xxs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()} 
                              {' '}
                              {new Date(item.timestamp).toLocaleTimeString(undefined, { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            <button
                              onClick={() => handleDeleteHistoryItem(item.id)}
                              className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete this history item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div 
                          className="bg-muted/30 p-1.5 rounded-sm mb-1.5 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleHistorySelect(item.rewrittenText)}
                        >
                          {item.rewrittenText.length > 80 
                            ? `${item.rewrittenText.substring(0, 80)}...` 
                            : item.rewrittenText
                          }
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xxs text-muted-foreground line-clamp-1">
                            {item.originalText.length > 40 
                              ? `${item.originalText.substring(0, 40)}...` 
                              : item.originalText
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {hasMoreHistoryItems && (
                      <button
                        onClick={() => setShowAllHistory(true)}
                        className="w-full py-2 text-xs flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        Show More
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full min-h-0 p-4">
              {currentView === null && showInput ? (
                <>
                  {/* XP Display Component */}
                  <div className="bg-card border border-border rounded-md p-3 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{getLevelTitle(level)}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">Lvl {level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 relative group">
                        <Flame className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">{streak} day streak</span>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 bg-popover text-popover-foreground text-xs p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="text-xs">Current streak: {streak}/7 days</div>
                          <div className="text-xs mt-1">Keep rewriting daily to maintain your streak!</div>
                        </div>
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

                  {/* Content Container - flex-grow to push controls to bottom */}
                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 pb-32">
                    {/* Rewrite Result (when available) */}
                    {isRewording ? (
                      <div className="mb-4 bg-card border border-border rounded-md p-4">
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="mt-4 text-sm text-center">Rewriting with <span className="capitalize font-medium">{selectedTone}</span> tone...</p>
                        </div>
                      </div>
                    ) : rewrite ? (
                      <div className="mb-4">
                        <div className="bg-card border border-border rounded-md p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-medium">Rewritten with <span className="capitalize">{selectedTone}</span> tone</h3>
                          </div>
                          
                          <div className="max-h-[240px] overflow-y-auto ">
                            <p className="text-sm whitespace-pre-wrap">{rewrite}</p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-border">
                            <button
                              onClick={() => {
                                setRewrite('')
                                setIsRewording(false)
                              }}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground"
                              title="Edit original text"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(rewrite)
                                  .catch(err => console.error('Failed to copy text:', err))
                              }}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground"
                              title="Copy to clipboard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                              Copy
                            </button>
                            <button
                              onClick={rewriteAgain}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground"
                              title="Regenerate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 21h5v-5" />
                              </svg>
                              Regenerate
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Collapsible Text Input (collapsed when rewrite is available) */}
                    <div className={`${rewrite || isRewording ? ' rounded-md overflow-hidden' : ''}`}>
                      {(!rewrite && !isRewording) && (
                        <TextInput 
                          text={textToRewrite} 
                          onTextChange={setTextToRewrite} 
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Fixed Bottom Section with Tone Selector and Buttons - Now at bottom of page */}
                  <div className="absolute bottom-4 left-4 right-4 pt-4 border-border bg-background z-10 shadow-sm">
                    <ToneSelector 
                      selectedTone={selectedTone} 
                      onChange={setSelectedTone} 
                      onSurpriseMe={handleSurpriseMe}
                    />
                    
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleRewordButtonClick}
                        disabled={!textToRewrite.trim() || isRewording}
                        className="w-full max-w-md py-2.5 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRewording ? 'Rewriting...' : 'Reword This!'}
                      </button>
                    </div>
                  </div>
                </>
              ) : currentView === null && !showInput ? (
                <div className="flex flex-col h-full">
                  <button
                    onClick={resetView}
                    className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                  >
                    ← Back to Home
                  </button>
                  
                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                    <RewordResult 
                      originalText={textToRewrite}
                      tone={selectedTone}
                      onRewrittenText={handleRewrite}
                      onRewriteAgain={rewriteAgain}
                    />
                  </div>
                </div>
              ) : currentView === 'battle' ? (
                <div className="flex flex-col h-full">
                  <button
                    onClick={resetView}
                    className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                  >
                    ← Back to Home
                  </button>
                  
                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                    <RewriteBattle 
                      originalText={textToRewrite}
                      onRewriteAgain={rewriteAgain}
                    />
                  </div>
                </div>
              ) : currentView === 'custom' ? (
                <div className="flex flex-col h-full">
                  <button
                    onClick={resetView}
                    className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                  >
                    ← Back to Home
                  </button>
                  
                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                    <CustomToneBuilder
                      originalText={textToRewrite}
                      onRewriteAgain={rewriteAgain}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar - moved to the right */}
      <div className="flex flex-col items-center w-12 py-4 bg-card border-l border-border">
        {/* Navigation buttons */}
        <div className="flex flex-col items-center gap-3 mb-auto">
          <div className="relative group">
            <button 
              onClick={() => setCurrentView('battle')}
              className={`p-2 rounded-full ${currentView === 'battle' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              title="Battle Rewrite"
            >
              <Swords className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Rewrite Battle
            </span>
          </div>
          
          <div className="relative group">
            <button 
              onClick={() => setCurrentView('custom')}
              className={`p-2 rounded-full ${currentView === 'custom' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              title="Custom Tone Rewrite"
            >
              <Palette className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Custom Tone
            </span>
          </div>
          
          <div className="relative group">
            <button 
              onClick={() => setCurrentView('history')}
              className={`p-2 rounded-full ${currentView === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              title="Rewrite History"
            >
              <History className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              History
            </span>
          </div>
        </div>
        
        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <div className="relative group">
            <button
              onClick={() => setCurrentView('rewards')}
              className={`p-2 rounded-full ${currentView === 'rewards' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              title="Rewards"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Rewards
            </span>
          </div>
          
          <div className="relative group">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
          
          <div className="relative group">
            <button
              onClick={closeApp}
              className="p-2 rounded-full hover:bg-destructive/20 text-destructive"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Close
            </span>
          </div>
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
  const [hasTriggeredRewrite, setHasTriggeredRewrite] = useState(false)
  const [hasNotifiedParent, setHasNotifiedParent] = useState(false)
  
  // Trigger rewrite on component mount
  useEffect(() => {
    if (!hasTriggeredRewrite && originalText) {
      const doRewrite = async () => {
        try {
          setHasTriggeredRewrite(true)
          await rewrite(originalText, tone)
        } catch (error) {
          console.error("Error during rewrite:", error)
        }
      }
      
      doRewrite()
    }
  }, [originalText, tone, rewrite, hasTriggeredRewrite])
  
  // Pass the rewritten text up to the parent when it's ready
  useEffect(() => {
    if (rewrittenText && !hasNotifiedParent && onRewrittenText) {
      onRewrittenText(rewrittenText)
      setHasNotifiedParent(true)
    }
  }, [rewrittenText, onRewrittenText, hasNotifiedParent])
  
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
        </div>
        
        <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
          <p className="text-sm whitespace-pre-wrap">{rewrittenText}</p>
        </div>
        
        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-border">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={onRewriteAgain}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground"
            title="Regenerate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            Regenerate
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Original Text</h4>
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{originalText}</p>
        </div>
      </div>
    </div>
  )
}

// Define TextInput component since it's missing
interface TextInputProps {
  text: string
  onTextChange: (text: string) => void
}

const TextInput: React.FC<TextInputProps> = ({ text, onTextChange }) => {
  return (
    <div className="mb-0">
      <div className="border border-border rounded-md bg-card overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter text to rewrite..."
          className="w-full h-[250px] p-3 bg-transparent resize-none focus:outline-none"
        />
      </div>
    </div>
  )
}

export default PopupView 