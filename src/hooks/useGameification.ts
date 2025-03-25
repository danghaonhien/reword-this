import { useState, useEffect } from 'react'
import { 
  UnlockableTone, 
  Theme, 
  ToneMasterBadge,
  DailyMission,
  GameificationResult 
} from './gameificationTypes'
import { gameificationService } from '../services/gameificationService'

// Define interface for the global state
export interface GlobalGameState {
  xp: number
  level: number
  streak: number
  unlockableTones: UnlockableTone[]
  themes: Theme[]
  toneMasterBadges: ToneMasterBadge[]
  dailyMissions: DailyMission[]
  activeBadge: string | null
  update: (state: Partial<GlobalGameState>) => void
}

// Initialize global state
export const gameificationState: GlobalGameState = {
  xp: 0,
  level: 1,
  streak: 0,
  unlockableTones: [],
  themes: [],
  toneMasterBadges: [],
  dailyMissions: [],
  activeBadge: null,
  update: (state) => {
    Object.assign(gameificationState, state)
    window.dispatchEvent(new CustomEvent('gameification_update', { detail: gameificationState }))
  }
}

export function useGameification(): GameificationResult {
  // State variables
  const [xp, setXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [unlockableTones, setUnlockableTones] = useState<UnlockableTone[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [toneMasterBadges, setToneMasterBadges] = useState<ToneMasterBadge[]>([])
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([])
  const [activeBadge, setActiveBadge] = useState<string | null>(null)

  // Initialize state from gameificationService
  useEffect(() => {
    const state = gameificationService.getState()
    setXP(state.xp)
    setLevel(state.level)
    setStreak(state.streak)
    setUnlockableTones(state.unlockableTones)
    setThemes(state.themes)
    setToneMasterBadges(state.toneMasterBadges)
    setDailyMissions(state.dailyMissions)
    setActiveBadge(state.activeBadge)

    // Update global state
    gameificationState.update(state)

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

    const handleBadgeUnlock = (e: CustomEvent) => {
      const updatedBadges = [...toneMasterBadges]
      const badgeIndex = updatedBadges.findIndex(b => b.id === e.detail.id)
      if (badgeIndex >= 0) {
        updatedBadges[badgeIndex] = e.detail
        setToneMasterBadges(updatedBadges)
        gameificationState.update({ toneMasterBadges: updatedBadges })
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

    const handleActiveBadgeUpdate = (e: CustomEvent) => {
      setActiveBadge(e.detail)
      gameificationState.update({ activeBadge: e.detail })
    }

    window.addEventListener('xp_update', handleXPUpdate as EventListener)
    window.addEventListener('level_update', handleLevelUpdate as EventListener)
    window.addEventListener('streak_update', handleStreakUpdate as EventListener)
    window.addEventListener('tone_unlock', handleToneUnlock as EventListener)
    window.addEventListener('theme_unlock', handleThemeUnlock as EventListener)
    window.addEventListener('badge_unlock', handleBadgeUnlock as EventListener)
    window.addEventListener('mission_update', handleMissionUpdate as EventListener)
    window.addEventListener('active_badge_update', handleActiveBadgeUpdate as EventListener)

    return () => {
      window.removeEventListener('xp_update', handleXPUpdate as EventListener)
      window.removeEventListener('level_update', handleLevelUpdate as EventListener)
      window.removeEventListener('streak_update', handleStreakUpdate as EventListener)
      window.removeEventListener('tone_unlock', handleToneUnlock as EventListener)
      window.removeEventListener('theme_unlock', handleThemeUnlock as EventListener)
      window.removeEventListener('badge_unlock', handleBadgeUnlock as EventListener)
      window.removeEventListener('mission_update', handleMissionUpdate as EventListener)
      window.removeEventListener('active_badge_update', handleActiveBadgeUpdate as EventListener)
    }
  }, [])

  // Core functions
  const addXP = (amount: number) => {
    gameificationService.addXP(amount)
  }

  const trackToneUsage = (tone: string, wordCount: number) => {
    gameificationService.trackToneUsage(tone, wordCount)
  }

  const trackBattle = () => {
    gameificationService.updateMissions('battle', 0)
  }

  const trackCustomTone = () => {
    gameificationService.updateMissions('custom_tone', 0)
  }

  const setUserActiveBadge = (badgeId: string | null) => {
    gameificationService.setActiveBadge(badgeId)
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