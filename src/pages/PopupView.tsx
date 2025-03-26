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
import RewardsPanel from '../components/RewardsPanel'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { useRewrite } from '../hooks/useRewrite'
import { useGameification } from '../hooks/useGameification'
import { Theme, UnlockableTone } from '../hooks/gameificationTypes'
import { calculateProgress, getNextUnlockableTone, getNextUnlockableTheme, getLevelTitle } from '../utils/gameificationUtils'
import RewardNotification from '../components/RewardNotification'

// Get rewards data from gameification system
const getNextReward = (level: number): { name: string, unlocksAt: number } => {
  const rewards = [
    { name: "Basic themes", unlocksAt: 1 },
    { name: "Professional themes", unlocksAt: 5 },
    { name: "Premium themes", unlocksAt: 10 },
    { name: "Advanced styles", unlocksAt: 15 },
    { name: "Expert tones", unlocksAt: 20 },
  ];
  
  // Find the next reward that hasn't been unlocked yet
  const nextReward = rewards.find(reward => reward.unlocksAt > level);
  
  // If all rewards are unlocked, return the last one
  return nextReward || rewards[rewards.length - 1];
}

// Calculate progress to next unlock
const getRewardProgress = (level: number, nextUnlock: number): number => {
  // Find the previous unlock level
  const prevUnlock = nextUnlock <= 5 ? 1 : 
                     nextUnlock <= 10 ? 5 : 
                     nextUnlock <= 15 ? 10 : 15;
  
  // Calculate progress percentage between previous and next unlock
  return ((level - prevUnlock) / (nextUnlock - prevUnlock)) * 100;
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
  const [isRewriting, setIsRewriting] = useState(false)
  const [selectedTone, setSelectedTone] = useState('clarity')
  const [showInput, setShowInput] = useState(true)
  const [currentView, setCurrentView] = useState<'battle' | 'rewards' | 'history' | null>(null)
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
    setIsRewriting(true)
    
    // Handle surprise me by selecting a random unlocked tone
    if (tone === 'surprise') {
      const availableTones = gameification.unlockableTones
        .filter(t => t.unlocked)
        .map(t => t.id);
      
      // If no tones are unlocked, default to clarity
      if (availableTones.length === 0) {
        tone = 'clarity';
      } else {
        // Pick a random tone from the available ones
        tone = availableTones[Math.floor(Math.random() * availableTones.length)];
      }
      
      console.log(`Surprise Me selected the "${tone}" tone`);
    }
    
    // Use the useRewrite hook's rewrite function
    try {
      const result = await rewriteText(text, tone)
      if (result) {
        // Set the rewritten text
        setRewrite(result)
        // Save to history
        saveToHistory(text, result, tone)
        // Add XP - this will also update the lastRewrite time through our fixed addXP function
        addXP(5)
        
        // Track tone usage for badges and rewards (with word count)
        const wordCount = text.split(/\s+/).filter(word => word.trim().length > 0).length;
        gameification.trackToneUsage(tone, wordCount);
        
        // Log streak state for debugging
        console.log('Current streak after rewrite:', gameification.streak);
      }
    } catch (error) {
      console.error("Error during inline rewrite:", error)
    } finally {
      setIsRewriting(false)
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
    <div className="flex h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Reward notification component for displaying new unlocks */}
        <RewardNotification />
        
        {/* Main content - conditionally render based on current view */}
        <div className="flex-1 overflow-hidden flex flex-col h-screen max-h-screen">
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
                        <div className="absolute top-full right-0 mt-2 bg-popover text-popover-foreground text-xs p-3 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 w-64">
                          <div className="space-y-3">
                            {/* Level Progress */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Level Progress</span>
                                <span>{xp % 100}/100 XP</span>
                              </div>
                              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                                  style={{ width: `${calculateProgress(xp % 100, 100)}%` }}
                                />
                              </div>
                              <div className="text-xxs text-muted-foreground mt-1">
                                {100 - (xp % 100)} XP needed for level {level + 1}
                              </div>
                            </div>
                            
                            {/* Streak Progress */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Streak Progress</span>
                                <span>{streak}/7 days</span>
                              </div>
                              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-accent h-full rounded-full transition-all duration-500 ease-out" 
                                  style={{ width: `${calculateProgress(streak, 7)}%` }}
                                />
                              </div>
                              <div className="text-xxs text-muted-foreground mt-1">
                                {streak >= 7 ? 'Streak complete! Keep going!' : `${7 - streak} more day${7 - streak !== 1 ? 's' : ''} to complete streak`}
                              </div>
                            </div>
                            
                            {/* Next Rewards - Dynamically calculated */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Next Rewards</span>
                              </div>
                              
                              {/* Next Tone */}
                              {(() => {
                                const nextTone = getNextUnlockableTone(gameification.unlockableTones, xp, streak);
                                if (nextTone) {
                                  const current = nextTone.unlockRequirement.type === 'xp' ? xp : streak;
                                  const required = nextTone.unlockRequirement.value;
                                  const progress = calculateProgress(current, required);
                                  
                                  return (
                                    <div className="mb-2">
                                      <div className="text-xxs font-medium flex justify-between">
                                        <span>Tone: {nextTone.name}</span>
                                        <span>{current}/{required} {nextTone.unlockRequirement.type === 'xp' ? 'XP' : 'Days'}</span>
                                      </div>
                                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-1">
                                        <div 
                                          className="bg-primary h-full rounded-full" 
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                              
                              {/* Next Theme */}
                              {(() => {
                                const nextTheme = getNextUnlockableTheme(gameification.themes, xp, level, streak);
                                if (nextTheme) {
                                  let current, required, unitLabel;
                                  
                                  if (nextTheme.unlockRequirement.type === 'xp') {
                                    current = xp;
                                    required = nextTheme.unlockRequirement.value;
                                    unitLabel = 'XP';
                                  } else if (nextTheme.unlockRequirement.type === 'level') {
                                    current = level;
                                    required = nextTheme.unlockRequirement.value;
                                    unitLabel = 'Level';
                                  } else {
                                    current = streak;
                                    required = nextTheme.unlockRequirement.value;
                                    unitLabel = 'Days';
                                  }
                                  
                                  const progress = calculateProgress(current, required);
                                  
                                  return (
                                    <div className="mb-2">
                                      <div className="text-xxs font-medium flex justify-between">
                                        <span>Theme: {nextTheme.name}</span>
                                        <span>{current}/{required} {unitLabel}</span>
                                      </div>
                                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-1">
                                        <div 
                                          className="bg-accent h-full rounded-full" 
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${calculateProgress(xp % 100, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                      <span>{xp} XP</span>
                      <span>{100 - (xp % 100)} XP to next level</span>
                    </div>
                  </div>

                  {/* Content Container - flex-grow to push controls to bottom */}
                  <div className="flex-grow overflow-y-auto custom-scrollbar pb-32">
                    {/* Rewrite Result (when available) */}
                    {isRewriting ? (
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
                          
                          <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                            <p className="text-sm whitespace-pre-wrap">{rewrite}</p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-border">
                            <button
                              onClick={() => {
                                setRewrite('')
                                setIsRewriting(false)
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
                    <div className={`${rewrite || isRewriting ? ' rounded-md overflow-hidden' : ''}`}>
                      {(!rewrite && !isRewriting) && (
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
                        disabled={!textToRewrite.trim() || isRewriting}
                        className="w-full max-w-md py-2.5 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRewriting ? 'Rewriting...' : 'Reword This!'}
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
                <div className="flex flex-col h-full overflow-hidden">
                  <button
                    onClick={resetView}
                    className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                  >
                    ← Back to Home
                  </button>
                  
                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1" style={{ height: 'calc(100vh - 140px)' }}>
                    <RewriteBattle 
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
      
      {/* Sidebar - remove Custom Tone button */}
      <div className="flex flex-col items-center w-12 py-4 bg-card border-l border-border">
        {/* Navigation buttons with Custom Tone removed */}
        <div className="flex flex-col items-center gap-3 mb-auto">
          <div className="relative group">
            <button 
              onClick={() => setCurrentView('battle')}
              className={`p-2 rounded-full ${currentView === 'battle' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              // title="Battle Rewrite"
            >
              <Swords className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Rewrite Battle
            </span>
          </div>
          
          {/* Theme Switcher placed directly after Battle */}
          <div className="relative group">
            <div className="px-2 py-1 rounded-full hover:bg-muted/50 text-muted-foreground">
              <ThemeSwitcher />
            </div>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              Theme
            </span>
          </div>
          
          <div className="relative group">
            <button 
              onClick={() => setCurrentView('history')}
              className={`p-2 rounded-full ${currentView === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              // title="Rewrite History"
            >
              <History className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
              History
            </span>
          </div>
        </div>
        
        {/* Bottom controls - remove ThemeSwitcher from here */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <div className="relative group">
            <button
              onClick={() => setCurrentView('rewards')}
              className={`p-2 rounded-full ${currentView === 'rewards' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground'}`}
              // title="Rewards"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
              Rewards
            </span>
          </div>
          
          <div className="relative group">
            <button
              onClick={closeApp}
              className="p-2 rounded-full hover:bg-destructive/20 text-destructive"
              // title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
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
  const gameification = useGameification()
  
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
      
      // Calculate word count for proper tracking
      const wordCount = originalText.split(/\s+/).filter(word => word.trim().length > 0).length;
      
      // Track tone usage for rewards and badges with word count
      gameification.trackToneUsage(tone, wordCount);
      
      // Add XP for successful rewrite
      gameification.addXP(5);
    }
  }, [rewrittenText, onRewrittenText, hasNotifiedParent, originalText, tone, gameification])
  
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