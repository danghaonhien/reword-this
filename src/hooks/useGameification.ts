import { useState, useEffect } from 'react'

type GameificationData = {
  xp: number
  streak: number
  lastActive: string | null
}

type GameificationResult = {
  xp: number
  streak: number
  addXP: (amount: number) => void
  resetXP: () => void
}

const STORAGE_KEY = 'reword-this-gameification'

const getInitialData = (): GameificationData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData) as GameificationData
      
      // Check if streak needs to be reset (no activity in last 24 hours)
      if (parsedData.lastActive) {
        const lastActive = new Date(parsedData.lastActive)
        const now = new Date()
        const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceLastActive > 24) {
          // Reset streak but keep XP
          return {
            xp: parsedData.xp,
            streak: 0,
            lastActive: now.toISOString()
          }
        }
      }
      
      return parsedData
    }
  } catch (error) {
    console.error('Error retrieving gameification data:', error)
  }
  
  // Default values if no stored data or error
  return {
    xp: 0,
    streak: 0,
    lastActive: null
  }
}

export const useGameification = (): GameificationResult => {
  const [data, setData] = useState<GameificationData>(getInitialData)
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving gameification data:', error)
    }
  }, [data])
  
  const addXP = (amount: number) => {
    const now = new Date()
    const lastActiveDate = data.lastActive ? new Date(data.lastActive) : null
    
    // Check if this is a new day (for streak)
    let newStreak = data.streak
    if (!lastActiveDate || now.toDateString() !== lastActiveDate.toDateString()) {
      newStreak += 1
    }
    
    setData({
      xp: data.xp + amount,
      streak: newStreak,
      lastActive: now.toISOString()
    })
  }
  
  const resetXP = () => {
    setData({
      xp: 0,
      streak: 0,
      lastActive: null
    })
  }
  
  return {
    xp: data.xp,
    streak: data.streak,
    addXP,
    resetXP
  }
} 