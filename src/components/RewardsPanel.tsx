import React, { useState } from 'react'
import { useGameification } from '@/hooks/useGameification'
import { 
  UnlockableTone, 
  Theme, 
  ToneMasterBadge, 
  DailyMission 
} from '@/hooks/gameificationTypes'
import { Gift, Award, Palette, Target, Check, Lock } from 'lucide-react'

type RewardTab = 'tones' | 'themes' | 'badges' | 'missions'

interface RewardsPanelProps {
  onBack?: () => void;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<RewardTab>('tones')
  const {
    xp,
    level,
    streak,
    unlockableTones,
    themes,
    toneMasterBadges,
    activeBadge,
    setActiveBadge,
    dailyMissions
  } = useGameification()

  return (
    <div className="bg-card border border-border rounded-md shadow-sm">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium flex items-center">
          <Gift className="w-4 h-4 mr-2 text-primary" />
          Rewards & Unlockables
        </h3>
        <div className="text-xs text-muted-foreground mt-1">
          Level {level} • {xp} XP • {streak} Day Streak
        </div>
      </div>

      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('tones')}
            className={`px-3 py-2 text-xs font-medium flex-1 flex justify-center items-center gap-1.5 ${
              activeTab === 'tones'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Tones
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-2 text-xs font-medium flex-1 flex justify-center items-center gap-1.5 ${
              activeTab === 'themes'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Palette className="w-3 h-3" />
            Themes
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-2 text-xs font-medium flex-1 flex justify-center items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="w-3 h-3" />
            Badges
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-3 py-2 text-xs font-medium flex-1 flex justify-center items-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="w-3 h-3" />
            Missions
          </button>
        </div>
      </div>

      <div className="p-3 max-h-[250px] overflow-y-auto custom-scrollbar">
        {activeTab === 'tones' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Unlock special tones by earning XP and maintaining streaks
            </div>
            {unlockableTones.map((tone) => (
              <div
                key={tone.id}
                className={`p-2 border rounded-md ${
                  tone.unlocked
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm flex items-center gap-1.5">
                    {tone.unlocked ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    {tone.name}
                  </div>
                  {!tone.unlocked && (
                    <div className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {tone.unlockRequirement.type === 'xp'
                        ? `${tone.unlockRequirement.value} XP`
                        : `${tone.unlockRequirement.value} Day Streak`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tone.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Customize your experience with unlockable themes
            </div>
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-2 border rounded-md ${
                  theme.unlocked
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm flex items-center gap-1.5">
                    {theme.unlocked ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    {theme.name}
                  </div>
                  {!theme.unlocked && (
                    <div className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {theme.unlockRequirement.type === 'xp'
                        ? `${theme.unlockRequirement.value} XP`
                        : theme.unlockRequirement.type === 'streak'
                        ? `${theme.unlockRequirement.value} Day Streak`
                        : `Level ${theme.unlockRequirement.value}`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {theme.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Become a master in different tones to earn badges
            </div>
            {toneMasterBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-2 border rounded-md ${
                  badge.unlocked
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/20'
                } ${activeBadge === badge.id ? 'ring-2 ring-primary/50' : ''}`}
                onClick={() => {
                  if (badge.unlocked) {
                    setActiveBadge(badge.id === activeBadge ? null : badge.id)
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm flex items-center gap-1.5">
                    {badge.unlocked ? (
                      <Award className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    {badge.name}
                    {activeBadge === badge.id && (
                      <span className="text-[10px] bg-primary text-primary-foreground px-1 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </div>
                {!badge.unlocked && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(badge.progress / badge.required) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {badge.progress}/{badge.required}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Complete daily missions to earn rewards
            </div>
            {dailyMissions.map((mission) => (
              <div
                key={mission.id}
                className={`p-2 border rounded-md ${
                  mission.completed
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border bg-muted/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {mission.completed ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Target className="w-3.5 h-3.5 text-primary" />
                      )}
                      {mission.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {mission.description}
                    </div>
                  </div>
                  <div className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {mission.reward.type === 'xp'
                      ? `+${mission.reward.value} XP`
                      : `+${mission.reward.value} Streak`}
                  </div>
                </div>
                {!mission.completed && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(mission.progress / mission.goal) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {mission.progress}/{mission.goal}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {onBack && (
        <div className="p-3 border-t border-border">
          <button
            onClick={onBack}
            className="w-full py-2 px-4 bg-muted/40 hover:bg-muted/60 text-sm text-foreground rounded-md flex items-center justify-center transition-colors"
          >
            Return to Rewrite
          </button>
        </div>
      )}
    </div>
  )
}

export default RewardsPanel 