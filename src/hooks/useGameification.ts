import { useState, useEffect } from 'react'
import { 
  UnlockableTone, 
  Theme, 
  ToneMasterBadge,
  DailyMission,
  GameificationResult 
} from './gameificationTypes'

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
    if (!lastRewrite) return
    
    const now = new Date()
    const lastRewriteDate = new Date(lastRewrite)
    
    // Reset streak if it's been more than 48 hours since last activity
    if (now.getTime() - lastRewriteDate.getTime() > 48 * 60 * 60 * 1000) {
      setStreak(0)
      return
    }
    
    // Check if we're on a new day compared to the last rewrite
    const today = new Date().toDateString()
    const lastRewriteDay = lastRewriteDate.toDateString()
    
    if (today !== lastRewriteDay) {
      // It's a new day, so we increment the streak
      setStreak(streak + 1)
      checkUnlocks()
    }
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
    setXp(prevXp => prevXp + amount)
    setLastRewrite(new Date())
    checkAndUpdateStreak()
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
    setToneMasterBadges(badges => 
      badges.map(badge => {
        if (badge.tone === tone && !badge.unlocked) {
          const newProgress = badge.progress + 1
          const unlocked = newProgress >= badge.required
          return {
            ...badge,
            progress: newProgress,
            unlocked
          }
        }
        return badge
      })
    )
    
    // Update missions
    updateMissions(tone, wordCount)
  }
  
  // Update missions based on user actions
  const updateMissions = (tone: string, wordCount: number = 0) => {
    setDailyMissions(missions => 
      missions.map(mission => {
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
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            // We'll handle this outside to avoid state update issues
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            // We'll handle this outside to avoid state update issues
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      })
    )
  }
  
  // Track battle usage
  const trackBattle = () => {
    setDailyMissions(missions => 
      missions.map(mission => {
        if (mission.completed || mission.type !== 'battle') return mission
        
        const newProgress = mission.progress + 1
        const completed = newProgress >= mission.goal
        
        if (completed && !mission.completed) {
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      })
    )
  }
  
  // Track custom tone usage
  const trackCustomTone = () => {
    setDailyMissions(missions => 
      missions.map(mission => {
        if (mission.completed || mission.type !== 'custom_tone') return mission
        
        const newProgress = mission.progress + 1
        const completed = newProgress >= mission.goal
        
        if (completed && !mission.completed) {
          // Give rewards when mission is completed
          if (mission.reward.type === 'xp') {
            setTimeout(() => addXP(mission.reward.value), 10)
          } else if (mission.reward.type === 'streak_bonus') {
            setTimeout(() => setStreak(s => s + mission.reward.value), 10)
          }
        }
        
        return {
          ...mission,
          progress: newProgress,
          completed
        }
      })
    )
  }
  
  // Check if new items should be unlocked based on XP, level or streak
  const checkUnlocks = () => {
    // Check unlockable tones
    setUnlockableTones(tones => 
      tones.map(tone => {
        if (!tone.unlocked) {
          if (
            (tone.unlockRequirement.type === 'xp' && xp >= tone.unlockRequirement.value) ||
            (tone.unlockRequirement.type === 'streak' && streak >= tone.unlockRequirement.value)
          ) {
            return { ...tone, unlocked: true }
          }
        }
        return tone
      })
    )
    
    // Check themes
    setThemes(themes => 
      themes.map(theme => {
        if (!theme.unlocked) {
          if (
            (theme.unlockRequirement.type === 'xp' && xp >= theme.unlockRequirement.value) ||
            (theme.unlockRequirement.type === 'streak' && streak >= theme.unlockRequirement.value) ||
            (theme.unlockRequirement.type === 'level' && level >= theme.unlockRequirement.value)
          ) {
            return { ...theme, unlocked: true }
          }
        }
        return theme
      })
    )
  }
  
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