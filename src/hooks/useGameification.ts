import { useState, useEffect } from 'react'
import { 
  UnlockableTone, 
  Theme, 
  ToneMasterBadge,
  DailyMission,
  GameificationResult 
} from './gameificationTypes'

// Define interface for the global state
interface GlobalGameState {
  xp: number;
  level: number;
  streak: number;
  updatedAt: number;
  update: (newValues: Partial<Omit<GlobalGameState, 'update'>>) => void;
}

// Global state object to be shared across components
export const gameificationState: GlobalGameState = {
  xp: 0,
  level: 1,
  streak: 0,
  updatedAt: Date.now(),
  
  // Update method to trigger state change notification
  update(newValues: Partial<Omit<GlobalGameState, 'update'>>) {
    Object.assign(gameificationState, newValues, { updatedAt: Date.now() });
    
    // Broadcast gameStateUpdated event for components to react
    const event = new CustomEvent('gameStateUpdated', {
      detail: { ...newValues, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    
    console.log('Global gameification state updated:', gameificationState);
  }
};

// Define interface for custom themes
interface CustomTheme {
  id: string
  name: string
  description: string
  unlockRequirement: {
    type: 'xp' | 'streak' | 'level'
    value: number
  }
  unlocked: boolean
  className: string
}

export const useGameification = (): GameificationResult => {
  // Basic stats
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [lastRewrite, setLastRewrite] = useState<Date | null>(null)
  
  // Additional gamification features
  const [unlockableTones, setUnlockableTones] = useState<UnlockableTone[]>([
    {
      id: 'poetic',
      name: 'Poetic',
      description: 'Rewrite text with rhythm and artistic expression',
      unlockRequirement: { type: 'xp', value: 1000 },
      unlocked: false
    },
    {
      id: 'genz',
      name: 'Gen Z',
      description: 'Rewrite text with Gen Z slang and style',
      unlockRequirement: { type: 'streak', value: 7 },
      unlocked: false
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Rewrite text in formal academic style',
      unlockRequirement: { type: 'xp', value: 500 },
      unlocked: false
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Rewrite text for C-suite and business leaders',
      unlockRequirement: { type: 'streak', value: 3 },
      unlocked: false
    }
  ])
  
  const [themes, setThemes] = useState<Theme[]>([
    {
      id: 'dark',
      name: 'Dark Mode',
      description: "A sleek dark theme that's easy on the eyes",
      unlockRequirement: { type: 'xp', value: 100 },
      unlocked: true,
      className: 'theme-dark'
    },
    {
      id: 'whiteboard',
      name: 'Minimal Whiteboard',
      description: 'Clean and distraction-free interface',
      unlockRequirement: { type: 'xp', value: 300 },
      unlocked: false,
      className: 'theme-whiteboard'
    },
    {
      id: 'parchment',
      name: 'Typing on Parchment',
      description: 'An aged paper look for a classic writing feel',
      unlockRequirement: { type: 'level', value: 5 },
      unlocked: false,
      className: 'theme-parchment'
    },
    {
      id: 'neon',
      name: 'Neon Nights',
      description: 'High contrast vibrant colors with a cyberpunk feel',
      unlockRequirement: { type: 'streak', value: 5 },
      unlocked: false,
      className: 'theme-neon'
    }
  ])
  
  const [toneMasterBadges, setToneMasterBadges] = useState<ToneMasterBadge[]>([
    {
      id: 'clarity_master',
      tone: 'clarity',
      name: 'Clarity Master',
      description: 'Rewrite text in clarity tone 25 times',
      progress: 0,
      required: 25,
      unlocked: false
    },
    {
      id: 'friendly_master',
      tone: 'friendly',
      name: 'Friendly Master',
      description: 'Rewrite text in friendly tone 25 times',
      progress: 0,
      required: 25,
      unlocked: false
    },
    {
      id: 'formal_master',
      tone: 'formal',
      name: 'Formal Master',
      description: 'Rewrite text in formal tone 25 times',
      progress: 0,
      required: 25,
      unlocked: false
    },
    {
      id: 'surprise_master',
      tone: 'surprise',
      name: 'Surprise Master',
      description: 'Use the surprise tone 15 times',
      progress: 0,
      required: 15,
      unlocked: false
    }
  ])
  
  const [activeBadge, setActiveBadge] = useState<string | null>(null)
  
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([
    {
      id: 'different_tones',
      title: 'Tone Explorer',
      description: 'Use 3 different tones today',
      type: 'use_tones',
      goal: 3,
      progress: 0,
      completed: false,
      reward: { type: 'xp', value: 25 }
    },
    {
      id: 'words_clarity',
      title: 'Clarity Champion',
      description: 'Rewrite at least 100 words in Clarity mode',
      type: 'rewrite_words',
      goal: 100,
      progress: 0,
      completed: false,
      reward: { type: 'streak_bonus', value: 1 }
    },
    {
      id: 'rewrite_count',
      title: 'Rewriting Spree',
      description: 'Complete 5 rewrites today',
      type: 'rewrite_count',
      goal: 5,
      progress: 0,
      completed: false,
      reward: { type: 'xp', value: 30 }
    },
    {
      id: 'battle_winner',
      title: 'Battle Victor',
      description: 'Complete 3 rewrite battles',
      type: 'battle',
      goal: 3,
      progress: 0,
      completed: false,
      reward: { type: 'xp', value: 40 }
    }
  ])
  
  // Tracking of tones used today for missions
  const [tonesUsedToday, setTonesUsedToday] = useState<Set<string>>(new Set())
  
  // Load data from local storage
  useEffect(() => {
    const storedXp = localStorage.getItem('reword-xp')
    const storedLevel = localStorage.getItem('reword-level')
    const storedStreak = localStorage.getItem('reword-streak')
    const storedLastRewrite = localStorage.getItem('reword-last-rewrite')
    const storedUnlockableTones = localStorage.getItem('reword-unlockable-tones')
    const storedThemes = localStorage.getItem('reword-themes')
    const storedToneMasterBadges = localStorage.getItem('reword-tone-master-badges')
    const storedActiveBadge = localStorage.getItem('reword-active-badge')
    const storedDailyMissions = localStorage.getItem('reword-daily-missions')
    const storedTonesUsedToday = localStorage.getItem('reword-tones-used-today')
    const storedLastMissionReset = localStorage.getItem('reword-last-mission-reset')
    
    if (storedXp) setXp(parseInt(storedXp))
    if (storedLevel) setLevel(parseInt(storedLevel))
    if (storedStreak) setStreak(parseInt(storedStreak))
    if (storedLastRewrite) setLastRewrite(new Date(storedLastRewrite))
    if (storedUnlockableTones) setUnlockableTones(JSON.parse(storedUnlockableTones))
    if (storedThemes) setThemes(JSON.parse(storedThemes))
    if (storedToneMasterBadges) setToneMasterBadges(JSON.parse(storedToneMasterBadges))
    if (storedActiveBadge) setActiveBadge(storedActiveBadge)
    if (storedDailyMissions) setDailyMissions(JSON.parse(storedDailyMissions))
    if (storedTonesUsedToday) setTonesUsedToday(new Set(JSON.parse(storedTonesUsedToday)))
    
    // Check if we need to reset daily missions
    const today = new Date().toDateString()
    if (storedLastMissionReset !== today) {
      resetDailyMissions()
      localStorage.setItem('reword-last-mission-reset', today)
    }
    
    // Check streak
    checkAndUpdateStreak()
  }, [])
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('reword-xp', xp.toString())
    localStorage.setItem('reword-level', level.toString())
    localStorage.setItem('reword-streak', streak.toString())
    if (lastRewrite) localStorage.setItem('reword-last-rewrite', lastRewrite.toISOString())
    localStorage.setItem('reword-unlockable-tones', JSON.stringify(unlockableTones))
    localStorage.setItem('reword-themes', JSON.stringify(themes))
    localStorage.setItem('reword-tone-master-badges', JSON.stringify(toneMasterBadges))
    if (activeBadge) localStorage.setItem('reword-active-badge', activeBadge)
    localStorage.setItem('reword-daily-missions', JSON.stringify(dailyMissions))
    localStorage.setItem('reword-tones-used-today', JSON.stringify([...tonesUsedToday]))
  }, [xp, level, streak, lastRewrite, unlockableTones, themes, toneMasterBadges, activeBadge, dailyMissions, tonesUsedToday])
  
  // Calculate level based on XP
  useEffect(() => {
    // Simple level formula: level = 1 + Math.floor(xp / 100)
    const newLevel = 1 + Math.floor(xp / 100)
    if (newLevel !== level) {
      setLevel(newLevel)
      checkUnlocks()
    }
  }, [xp, level])
  
  // Check for streak updates
  const checkAndUpdateStreak = () => {
    if (!lastRewrite) {
      // First time user is doing a rewrite
      setLastRewrite(new Date());
      return;
    }
    
    const now = new Date();
    const lastRewriteDate = new Date(lastRewrite);
    
    // Reset streak if it's been more than 48 hours since last activity
    if (now.getTime() - lastRewriteDate.getTime() > 48 * 60 * 60 * 1000) {
      setStreak(0);
      
      // Update global state
      gameificationState.update({ streak: 0 });
      
      // Dispatch streak reset event
      setTimeout(() => {
        const event = new CustomEvent('gameStateUpdated', {
          detail: { type: 'streak', value: 0, reset: true }
        });
        window.dispatchEvent(event);
      }, 10);
      
      return;
    }
    
    // Check if we're on a new day compared to the last rewrite
    const today = new Date().toDateString();
    const lastRewriteDay = lastRewriteDate.toDateString();
    
    if (today !== lastRewriteDay) {
      // Get the streak from localStorage to ensure we're not incrementing multiple times
      const currentStreak = localStorage.getItem('reword-streak');
      const parsedStreak = currentStreak ? parseInt(currentStreak) : 0;
      
      // Compare dates to ensure we only increment once per day
      const lastStreakUpdateDay = localStorage.getItem('reword-streak-last-update');
      
      if (lastStreakUpdateDay !== today) {
        // It's a new day and we haven't updated the streak yet today
        const newStreakValue = parsedStreak + 1;
        setStreak(newStreakValue);
        
        // Update global state
        gameificationState.update({ streak: newStreakValue });
        
        localStorage.setItem('reword-streak-last-update', today);
        
        // Dispatch streak update event
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'streak', value: newStreakValue, increased: true }
          });
          window.dispatchEvent(event);
          console.log('Streak increased to', newStreakValue);
        }, 10);
        
        checkUnlocks();
      } else {
        // We've already updated the streak today, just use the current value
        setStreak(parsedStreak);
        
        // Update global state to ensure consistency
        gameificationState.update({ streak: parsedStreak });
      }
    }
    
    // Update last rewrite time
    setLastRewrite(now);
  }
  
  // Reset daily missions
  const resetDailyMissions = () => {
    setDailyMissions(missions => 
      missions.map(mission => ({
        ...mission,
        progress: 0,
        completed: false
      }))
    )
    setTonesUsedToday(new Set())
  }
  
  // Add XP and update related stats
  const addXP = (amount: number) => {
    setXp(prevXp => {
      const newXp = prevXp + amount;
      
      // Update global state
      gameificationState.update({ xp: newXp });
      
      // Dispatch event to signal XP change for immediate UI update
      setTimeout(() => {
        const event = new CustomEvent('gameStateUpdated', {
          detail: { type: 'xp', value: newXp }
        });
        window.dispatchEvent(event);
      }, 10);
      
      return newXp;
    });
    
    // Only check streak but don't set lastRewrite here
    // This prevents streak from incrementing on each rewrite
    checkAndUpdateStreak();
  }
  
  // Track tone usage for missions and badges
  const trackToneUsage = (tone: string, wordCount: number) => {
    // Update tones used today set
    setTonesUsedToday(prev => {
      const newSet = new Set(prev)
      newSet.add(tone)
      return newSet
    })
    
    // Update tone master badges
    let badgeUnlocked = false;
    setToneMasterBadges(badges => {
      let anyUnlocked = false;
      const updatedBadges = badges.map(badge => {
        if (badge.tone === tone && !badge.unlocked) {
          const newProgress = badge.progress + 1
          const unlocked = newProgress >= badge.required
          if (unlocked) {
            anyUnlocked = true;
            // Award XP bonus when a badge is unlocked
            setTimeout(() => addXP(15), 10);
          }
          return {
            ...badge,
            progress: newProgress,
            unlocked
          }
        }
        return badge
      });
      
      if (anyUnlocked) {
        // Trigger gameStateUpdated for badge progress
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'badges', tone }
          });
          window.dispatchEvent(event);
        }, 20);
      }
      
      return updatedBadges;
    })
    
    // Force check unlocks to ensure tones and themes get updated
    // when meeting XP or streak requirements
    checkUnlocks();
    
    // Update missions
    updateMissions(tone, wordCount)
  }
  
  // Update missions based on user actions
  const updateMissions = (tone: string, wordCount: number = 0) => {
    let missionsCompleted = false;
    
    setDailyMissions(missions => {
      const updatedMissions = missions.map(mission => {
        if (mission.completed) return mission
        
        let newProgress = mission.progress
        let completed = false
        
        switch (mission.type) {
          case 'use_tones':
            newProgress = tonesUsedToday.size
            break
          case 'rewrite_words':
            if (tone === 'clarity') {
              newProgress += wordCount
            }
            break
          case 'rewrite_count':
            newProgress += 1
            break
          case 'battle':
            // This will be handled in a separate function
            break
          case 'custom_tone':
            // This will be handled in a separate function
            break
        }
        
        completed = newProgress >= mission.goal
        
        if (completed && !mission.completed) {
          missionsCompleted = true;
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            // We'll handle this outside to avoid state update issues
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            // We'll handle this outside to avoid state update issues
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
            // Check unlocks after streak update
            setTimeout(() => checkUnlocks(), 20)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      });
      
      // Trigger an update event if missions have changed
      if (missionsCompleted) {
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'missions', missions: updatedMissions }
          });
          window.dispatchEvent(event);
        }, 20);
      }
      
      return updatedMissions;
    });
    
    // If any missions were completed, check for unlocks again
    if (missionsCompleted) {
      setTimeout(() => checkUnlocks(), 30);
    }
  }
  
  // Track battle usage
  const trackBattle = () => {
    let battleCompleted = false;
    
    setDailyMissions(missions => {
      const updatedMissions = missions.map(mission => {
        if (mission.completed || mission.type !== 'battle') return mission
        
        const newProgress = mission.progress + 1
        const completed = newProgress >= mission.goal
        
        if (completed && !mission.completed) {
          battleCompleted = true;
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
            // Check unlocks after streak update
            setTimeout(() => checkUnlocks(), 20)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      });
      
      // Dispatch event if battle mission changed
      if (battleCompleted) {
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'battle', completed: true }
          });
          window.dispatchEvent(event);
        }, 20);
      }
      
      return updatedMissions;
    });
    
    // Always award XP for battles
    addXP(10);
    
    // Check for unlocks since XP was awarded
    checkUnlocks();
    
    // If battle mission was completed, check unlocks again after rewards are given
    if (battleCompleted) {
      setTimeout(() => checkUnlocks(), 30);
    }
  }
  
  // Track custom tone usage
  const trackCustomTone = () => {
    let customToneCompleted = false;
    
    setDailyMissions(missions => {
      const updatedMissions = missions.map(mission => {
        if (mission.completed || mission.type !== 'custom_tone') return mission
        
        const newProgress = mission.progress + 1
        const completed = newProgress >= mission.goal
        
        if (completed && !mission.completed) {
          customToneCompleted = true;
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
            // Check unlocks after streak update
            setTimeout(() => checkUnlocks(), 20)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      });
      
      // Dispatch event if custom tone mission changed
      if (customToneCompleted) {
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'customTone', completed: true }
          });
          window.dispatchEvent(event);
        }, 20);
      }
      
      return updatedMissions;
    });
    
    // Always award XP for custom tone creation
    addXP(8);
    
    // Check for unlocks since XP was awarded
    checkUnlocks();
    
    // If custom tone mission was completed, check unlocks again after rewards are given
    if (customToneCompleted) {
      setTimeout(() => checkUnlocks(), 30);
    }
  }
  
  // Check if new items should be unlocked based on XP, level or streak
  const checkUnlocks = () => {
    let unlockedItems = false;
    let unlockedDetails = {
      tones: [] as string[],
      themes: [] as string[],
      badges: [] as string[]
    };
    
    // Update the level in the global state
    gameificationState.update({ 
      xp, 
      level, 
      streak 
    });
    
    // Check unlockable tones
    setUnlockableTones(tones => {
      let anyUnlocked = false;
      const updatedTones = tones.map(tone => {
        if (!tone.unlocked) {
          if (
            (tone.unlockRequirement.type === 'xp' && xp >= tone.unlockRequirement.value) ||
            (tone.unlockRequirement.type === 'streak' && streak >= tone.unlockRequirement.value)
          ) {
            anyUnlocked = true;
            unlockedDetails.tones.push(tone.name);
            return { ...tone, unlocked: true };
          }
        }
        return tone;
      });
      
      if (anyUnlocked) {
        unlockedItems = true;
        // Dispatch separate event for tones update
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'tones', unlocked: unlockedDetails.tones }
          });
          window.dispatchEvent(event);
        }, 20);
      }
      
      return updatedTones;
    });
    
    // Check themes
    setThemes(themes => {
      let anyUnlocked = false;
      const updatedThemes = themes.map(theme => {
        if (!theme.unlocked) {
          if (
            (theme.unlockRequirement.type === 'xp' && xp >= theme.unlockRequirement.value) ||
            (theme.unlockRequirement.type === 'streak' && streak >= theme.unlockRequirement.value) ||
            (theme.unlockRequirement.type === 'level' && level >= theme.unlockRequirement.value)
          ) {
            anyUnlocked = true;
            unlockedDetails.themes.push(theme.name);
            return { ...theme, unlocked: true };
          }
        }
        return theme;
      });
      
      if (anyUnlocked) {
        unlockedItems = true;
        // Dispatch separate event for themes update
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'themes', unlocked: unlockedDetails.themes }
          });
          window.dispatchEvent(event);
        }, 30);
      }
      
      return updatedThemes;
    });
    
    // Check badges again for XP-based unlocks
    setToneMasterBadges(badges => {
      let anyUnlocked = false;
      const updatedBadges = badges.map(badge => {
        if (badge.progress >= badge.required && !badge.unlocked) {
          anyUnlocked = true;
          unlockedDetails.badges.push(badge.name);
          return { ...badge, unlocked: true };
        }
        return badge;
      });
      
      if (anyUnlocked) {
        unlockedItems = true;
        // Dispatch separate event for badges update
        setTimeout(() => {
          const event = new CustomEvent('gameStateUpdated', {
            detail: { type: 'badges', unlocked: unlockedDetails.badges }
          });
          window.dispatchEvent(event);
        }, 40);
      }
      
      return updatedBadges;
    });
    
    // Dispatch event if anything was unlocked
    if (unlockedItems) {
      // Using a small timeout to ensure state has updated
      setTimeout(() => {
        // Log the event for debugging
        console.log('Dispatching rewardUnlocked event:', { xp, level, streak, unlockedDetails });
        
        // Dispatch the reward unlocked event
        const event = new CustomEvent('rewardUnlocked', {
          detail: { 
            xp, 
            level, 
            streak,
            unlockedDetails  
          }
        });
        window.dispatchEvent(event);
        
        // Update global state with all the latest data
        gameificationState.update({ 
          xp, 
          level, 
          streak
        });
        
        // Also dispatch a general update event to force UI refresh with a short delay
        // to ensure it happens after all the other state updates
        setTimeout(() => {
          const updateEvent = new CustomEvent('gameStateUpdated', {
            detail: { type: 'allUnlocks', xp, level, streak }
          });
          window.dispatchEvent(updateEvent);
        }, 50);
      }, 100);
    }
  };
  
  // Set active badge
  const setUserActiveBadge = (badgeId: string | null) => {
    setActiveBadge(badgeId)
  }
  
  return {
    // Basic stats
    xp,
    level,
    streak,
    
    // Core functions
    addXP,
    trackToneUsage,
    trackBattle,
    trackCustomTone,
    
    // Feature-specific data and functions
    unlockableTones,
    themes,
    toneMasterBadges,
    activeBadge,
    setActiveBadge: setUserActiveBadge,
    dailyMissions
  }
} 