import React from 'react'
import { Flame, Trophy } from 'lucide-react'

interface XPDisplayProps {
  xp: number
  streak: number
}

const XPDisplay: React.FC<XPDisplayProps> = ({ xp, streak }) => {
  // Calculate level based on XP
  const level = Math.floor(xp / 100) + 1
  
  // Calculate progress to next level
  const progressPercent = (xp % 100)
  
  return (
    <div className="mb-4 bg-secondary/30 rounded-md p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Level {level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium">{streak} day streak</span>
        </div>
      </div>
      
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{xp} XP</span>
        <span>{100 - (xp % 100)} XP to next level</span>
      </div>
    </div>
  )
}

export default XPDisplay 