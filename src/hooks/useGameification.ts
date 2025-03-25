import { useState, useEffect, useCallback } from 'react'
import { 
  UnlockableTone, 
  Theme, 
  DailyMission,
  GameificationResult 
} from './gameificationTypes'
import { gameificationService } from '../services/gameificationService'

// Update the GlobalGameState and GameificationState interfaces
export interface GlobalGameState {
  xp: number
  level: number
  streak: number
  unlockableTones: UnlockableTone[]
  themes: Theme[]
  dailyMissions: DailyMission[]
  activeTheme: Theme | null
  update: (state: Partial<GlobalGameState>) => void
}

interface GameificationState {
  xp: number;
  level: number;
  streak: number;
  unlockableTones: UnlockableTone[];
  themes: Theme[];
  dailyMissions: DailyMission[];
  tonesUsedToday: Record<string, number>;
  activeTheme: Theme | null;
  update: (state: Partial<GlobalGameState>) => void;
}

// Update the gameificationState object
const gameificationState: GameificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  unlockableTones: [],
  themes: [],
  dailyMissions: [],
  tonesUsedToday: {},
  activeTheme: null,
  update: (state) => {
    Object.assign(gameificationState, state)
    window.dispatchEvent(new CustomEvent('gameStateUpdate', { detail: gameificationState }))
  }
}

// Define initial data for gameification features
const initialUnlockableTones: UnlockableTone[] = [
  {
    id: 'clarity',
    name: 'Clarity',
    description: 'Clear and concise communication',
    unlockRequirement: { type: 'xp', value: 0 }, // Available from start
    unlocked: true
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and approachable tone',
    unlockRequirement: { type: 'xp', value: 50 },
    unlocked: false
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Professional and structured communication',
    unlockRequirement: { type: 'xp', value: 100 },
    unlocked: false
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed and conversational tone',
    unlockRequirement: { type: 'xp', value: 150 },
    unlocked: false
  },
  {
    id: 'enthusiastic',
    name: 'Enthusiastic',
    description: 'Energetic and passionate expression',
    unlockRequirement: { type: 'xp', value: 200 },
    unlocked: false
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    description: 'Tactful and balanced communication',
    unlockRequirement: { type: 'streak', value: 3 },
    unlocked: false
  },
  {
    id: 'persuasive',
    name: 'Persuasive',
    description: 'Compelling and convincing arguments',
    unlockRequirement: { type: 'xp', value: 300 },
      unlocked: false
    },
    {
    id: 'technical',
    name: 'Technical',
    description: 'Precise and specialized language',
    unlockRequirement: { type: 'xp', value: 400 },
      unlocked: false
    },
    {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative and expressive writing',
    unlockRequirement: { type: 'streak', value: 5 },
      unlocked: false
    },
    {
      id: 'executive',
      name: 'Executive',
    description: 'Authoritative and decisive communication',
    unlockRequirement: { type: 'xp', value: 500 },
      unlocked: false
    }
];

const initialThemes: Theme[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Default app theme',
    unlockRequirement: { type: 'level', value: 1 },
    unlocked: true,
    className: 'theme-standard'
  },
    {
      id: 'dark',
      name: 'Dark Mode',
    description: 'Low-light optimized theme',
    unlockRequirement: { type: 'level', value: 2 },
    unlocked: false,
      className: 'theme-dark'
    },
    {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Minimalist, distraction-free interface',
    unlockRequirement: { type: 'xp', value: 200 },
    unlocked: false,
    className: 'theme-focus'
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Calming green and blue palette',
    unlockRequirement: { type: 'streak', value: 5 },
      unlocked: false,
    className: 'theme-nature'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'High-contrast, energetic colors',
      unlockRequirement: { type: 'level', value: 5 },
      unlocked: false,
    className: 'theme-vibrant'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Subtle, business-oriented design',
    unlockRequirement: { type: 'xp', value: 600 },
    unlocked: false,
    className: 'theme-professional'
  },
  {
    id: 'writers_delight',
    name: 'Writer\'s Delight',
    description: 'Typography-focused design (Premium)',
    unlockRequirement: { type: 'xp', value: 9999 }, // Premium only
    unlocked: false,
    className: 'theme-writers-delight'
  },
  {
    id: 'custom_accent',
    name: 'Custom Accent Colors',
    description: 'Personalized color choices (Premium)',
    unlockRequirement: { type: 'xp', value: 9999 }, // Premium only
      unlocked: false,
    className: 'theme-custom-accent'
    }
];
  
const initialDailyMissions: DailyMission[] = [
  {
    id: 'tone_explorer',
    title: 'Tone Explorer',
    description: 'Use 3 different tones today',
    type: 'use_tones',
    goal: 3,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 40 }
  },
  {
    id: 'word_count',
    title: 'Word Count',
    description: 'Rewrite at least 200 words today',
    type: 'rewrite_words',
    goal: 200,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 30 }
  },
  {
    id: 'multi_tasker',
    title: 'Multi-tasker',
    description: 'Complete 3 different rewrites today',
    type: 'rewrite_count',
    goal: 3,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 50 }
  },
  {
    id: 'battle_ready',
    title: 'Battle Ready',
    description: 'Use the Rewrite Battle feature once today',
    type: 'battle',
    goal: 1,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 60 }
  },
  {
    id: 'feedback_friend',
    title: 'Feedback Friend',
    description: 'Select your favorite from multiple rewrites',
    type: 'feedback',
    goal: 1,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 25 }
  },
  {
    id: 'daily_checkin',
    title: 'Daily Check-in',
    description: 'Simple login mission',
    type: 'checkin',
    goal: 1,
    progress: 0,
    completed: false,
    reward: { type: 'xp', value: 15 }
  }
];

// Initialize the service with predefined data (this is only done once)
let serviceInitialized = false;

export function useGameification(): GameificationResult {
  // State variables
  const [xp, setXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [unlockableTones, setUnlockableTones] = useState<UnlockableTone[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([])
  const [activeTheme, setActiveThemeState] = useState<Theme | null>(null);

  // Initialize state from gameificationService
  useEffect(() => {
    // Initialize the service with predefined data if not already done
    if (!serviceInitialized) {
      const state = gameificationService.getState();
      
      // Only initialize if the service is empty
      if (state.unlockableTones.length === 0 && state.themes.length === 0) {
        console.log('Initializing gameification service with predefined data');
        gameificationService.initializeState({
          unlockableTones: initialUnlockableTones,
          themes: initialThemes,
          dailyMissions: initialDailyMissions
        });
        serviceInitialized = true;
      }
      
      // Track daily check-in when component mounts
      gameificationService.trackCheckIn();
      
      // Debug the current state on initialization
      console.log('Initial gameification state:', gameificationService.debugState());
    }
    
    // Get the latest state
    const state = gameificationService.getState()
    setXP(state.xp)
    setLevel(state.level)
    setStreak(state.streak)
    setUnlockableTones(state.unlockableTones)
    setThemes(state.themes)
    setDailyMissions(state.dailyMissions)
    
    // Handle activeTheme separately to ensure themes are loaded first
    if (themes.length === 0 && state.themes.length > 0) {
      // First time loading themes
      const savedThemeId = localStorage.getItem('active-theme') || 'standard';
      const theme = state.themes.find(t => t.id === savedThemeId && t.unlocked) || 
                   state.themes.find(t => t.id === 'standard') || null;
      
      if (theme) {
        console.log('Setting initial theme:', theme.id);
        setActiveThemeState(theme);
        
        // Apply theme directly during initialization
        document.documentElement.classList.forEach(cls => {
          if (cls.startsWith('theme-')) {
            document.documentElement.classList.remove(cls);
          }
        });
        document.documentElement.classList.add(`theme-${theme.id}`);
      }
    } else if (state.activeTheme) {
      // Service already has an active theme
      setActiveThemeState(state.activeTheme);
    }

    // Update global state for backward compatibility
    gameificationState.update({
      xp: state.xp,
      level: state.level,
      streak: state.streak,
      unlockableTones: state.unlockableTones,
      themes: state.themes,
      dailyMissions: state.dailyMissions,
      activeTheme: state.activeTheme
    })

    // Listen for state updates
    const handleXPUpdate = (e: CustomEvent) => {
      setXP(e.detail)
      gameificationState.update({ xp: e.detail })
    }

    const handleLevelUpdate = (e: CustomEvent) => {
      setLevel(e.detail)
      gameificationState.update({ level: e.detail })
    }

    const handleStreakUpdate = (e: CustomEvent) => {
      setStreak(e.detail)
      gameificationState.update({ streak: e.detail })
    }

    const handleToneUnlock = (e: CustomEvent) => {
      const updatedTones = [...unlockableTones]
      const toneIndex = updatedTones.findIndex(t => t.id === e.detail.id)
      if (toneIndex >= 0) {
        updatedTones[toneIndex] = e.detail
        setUnlockableTones(updatedTones)
        gameificationState.update({ unlockableTones: updatedTones })
      }
    }

    const handleThemeUnlock = (e: CustomEvent) => {
      const updatedThemes = [...themes]
      const themeIndex = updatedThemes.findIndex(t => t.id === e.detail.id)
      if (themeIndex >= 0) {
        updatedThemes[themeIndex] = e.detail
        setThemes(updatedThemes)
        gameificationState.update({ themes: updatedThemes })
      }
    }

    const handleMissionUpdate = (e: CustomEvent) => {
      const updatedMissions = [...dailyMissions]
      const missionIndex = updatedMissions.findIndex(m => m.id === e.detail.id)
      if (missionIndex >= 0) {
        updatedMissions[missionIndex] = e.detail
        setDailyMissions(updatedMissions)
        gameificationState.update({ dailyMissions: updatedMissions })
      }
    }

    const handleActiveThemeUpdate = (e: CustomEvent) => {
      console.log('Received active_theme_update event with theme:', e.detail?.id);
      setActiveThemeState(e.detail);
      gameificationState.update({ activeTheme: e.detail });
    }

    // Handle gameification updates
    const handleGameificationUpdate = (e: CustomEvent) => {
      const newState = e.detail;
      if (newState) {
        if (newState.xp !== undefined) setXP(newState.xp);
        if (newState.level !== undefined) setLevel(newState.level);
        if (newState.streak !== undefined) setStreak(newState.streak);
        if (newState.unlockableTones) setUnlockableTones(newState.unlockableTones);
        if (newState.themes) setThemes(newState.themes);
        if (newState.dailyMissions) setDailyMissions(newState.dailyMissions);
        if (newState.activeTheme !== undefined) setActiveTheme(newState.activeTheme);
      }
    };

    window.addEventListener('xp_update', handleXPUpdate as EventListener)
    window.addEventListener('level_update', handleLevelUpdate as EventListener)
    window.addEventListener('streak_update', handleStreakUpdate as EventListener)
    window.addEventListener('tone_unlock', handleToneUnlock as EventListener)
    window.addEventListener('theme_unlock', handleThemeUnlock as EventListener)
    window.addEventListener('mission_update', handleMissionUpdate as EventListener)
    window.addEventListener('active_theme_update', handleActiveThemeUpdate as EventListener)
    window.addEventListener('gameification_update', handleGameificationUpdate as EventListener)

    return () => {
      window.removeEventListener('xp_update', handleXPUpdate as EventListener)
      window.removeEventListener('level_update', handleLevelUpdate as EventListener)
      window.removeEventListener('streak_update', handleStreakUpdate as EventListener)
      window.removeEventListener('tone_unlock', handleToneUnlock as EventListener)
      window.removeEventListener('theme_unlock', handleThemeUnlock as EventListener)
      window.removeEventListener('mission_update', handleMissionUpdate as EventListener)
      window.removeEventListener('active_theme_update', handleActiveThemeUpdate as EventListener)
      window.removeEventListener('gameification_update', handleGameificationUpdate as EventListener)
    }
  }, [])

  // Additional effect to handle theme initialization after themes are loaded
  useEffect(() => {
    if (themes.length > 0 && !activeTheme) {
      const savedThemeId = localStorage.getItem('active-theme') || 'standard';
      const theme = themes.find(t => t.id === savedThemeId && t.unlocked) || 
                  themes.find(t => t.id === 'standard') || null;
      
      if (theme) {
        console.log('Setting theme after themes loaded:', theme.id);
        setActiveThemeState(theme);
      }
    }
  }, [themes, activeTheme]);

  // Core functions
  const addXP = (amount: number) => {
    gameificationService.addXP(amount)
  }
  
  const trackToneUsage = (tone: string, wordCount: number) => {
    gameificationService.trackToneUsage(tone, wordCount)
  }

  const trackBattle = (winner: string, loser: string) => {
    addXP(10); // Add XP for battles
    gameificationService.updateMissions('battle', 1); 
  }
  
  const trackFeedback = () => {
    addXP(5); // Add XP for providing feedback
    gameificationService.trackFeedback()
  }
  
  // Add stub for trackWordWizard that doesn't rely on badge functionality
  const trackWordWizard = (wordCount: number) => {
    // Add a small XP reward for processing words
    addXP(Math.min(Math.floor(wordCount / 100), 10)); // Cap at 10 XP
    console.log(`Tracked ${wordCount} words`);
  }
  
  // Set active theme with localStorage persistence
  const setActiveTheme = useCallback((theme: Theme | null) => {
    console.log('useGameification: Setting active theme:', theme?.id);
    setActiveThemeState(theme);
    
    // Use the service method to update the theme
    gameificationService.setActiveTheme(theme);
    
    // No need to manually set localStorage as the service does it
  }, []);

  // Additional debugging helper functions
  const debugRewards = () => {
    return gameificationService.debugState();
  }
  
  const fixMissionIssues = () => {
    gameificationService.fixMissions();
    return 'Mission issues fixed';
  }
  
  const simulateUnlock = (type: 'tone' | 'theme', id: string) => {
    console.log(`Simulating unlock for ${type} with id ${id}`);
    
    if (type === 'tone') {
      const tone = gameificationService.getState().unlockableTones.find(t => t.id === id);
      if (tone) {
        window.dispatchEvent(new CustomEvent('tone_unlock', { detail: {...tone, unlocked: true} }));
        window.dispatchEvent(new CustomEvent('rewardUnlocked', { 
          detail: {
            unlockedDetails: {
              tones: [id],
              themes: [],
              badges: []
            }
          }
        }));
        return `Simulated unlock for tone: ${tone.name}`;
      }
    } else if (type === 'theme') {
      const theme = gameificationService.getState().themes.find(t => t.id === id);
      if (theme) {
        window.dispatchEvent(new CustomEvent('theme_unlock', { detail: {...theme, unlocked: true} }));
        window.dispatchEvent(new CustomEvent('rewardUnlocked', { 
          detail: {
            unlockedDetails: {
              tones: [],
              themes: [id],
              badges: []
            }
          }
        }));
        return `Simulated unlock for theme: ${theme.name}`;
      }
    }
    
    return `Could not find ${type} with id ${id}`;
  }
  
  const simulateMissionComplete = (missionId: string) => {
    const mission = gameificationService.getState().dailyMissions.find(m => m.id === missionId);
    if (mission) {
      const updatedMission = {...mission, completed: true, progress: mission.goal};
      window.dispatchEvent(new CustomEvent('mission_update', { detail: updatedMission }));
      return `Simulated completion for mission: ${mission.title}`;
    }
    return `Could not find mission with id ${missionId}`;
  }
  
  const resetGameification = () => {
    localStorage.removeItem('gameification_state');
    window.location.reload();
    return 'Gameification state reset';
  }
  
  // Add a method to complete a daily mission
  const completeMission = (missionId: string) => {
    const mission = dailyMissions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      mission.completed = true;
      mission.progress = mission.goal;
      
      // Award XP for completing the mission
      if (mission.reward.type === 'xp') {
        addXP(mission.reward.value);
      }
      
      // Dispatch mission update event
      window.dispatchEvent(new CustomEvent('mission_update', { detail: mission }));
      
      // Update state
      setDailyMissions([...dailyMissions]);
      
      return true;
    }
    return false;
  };

  // Return the gameification result without badge-related properties and methods
  const result: GameificationResult = {
    xp,
    level,
    streak,
    unlockableTones,
    themes,
    dailyMissions,
    tonesUsedToday: gameificationService.getTonesUsedToday(),
    activeTheme,
    addXP,
    checkAndUpdateStreak: () => gameificationService.updateStreak(),
    trackToneUsage,
    trackBattle,
    trackFeedback,
    trackWordWizard,
    setActiveTheme,
    completeMission
  };

  return result;
} 