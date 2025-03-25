import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { useGameification } from '../hooks/useGameification';
import { ToneMasterBadge } from '../hooks/gameificationTypes';

// Updated component for more compact display in sidebar
const BadgeSelector: React.FC = () => {
  const { toneMasterBadges, activeBadge, setActiveBadge } = useGameification();
  const [isOpen, setIsOpen] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([]);

  // Listen for reward unlock events to highlight newly unlocked badges
  useEffect(() => {
    const handleRewardUnlocked = (e: CustomEvent) => {
      if (e.detail?.type === 'badge') {
        setRecentlyUnlocked(prev => [...prev, e.detail.id]);
        
        // Clear the "new" indicator after 5 seconds
        setTimeout(() => {
          setRecentlyUnlocked(prev => prev.filter(id => id !== e.detail.id));
        }, 5000);
      }
    };

    window.addEventListener('rewardUnlocked' as any, handleRewardUnlocked as any);
    return () => {
      window.removeEventListener('rewardUnlocked' as any, handleRewardUnlocked as any);
    };
  }, []);

  // Filter badges that are unlocked
  const unlockedBadges = toneMasterBadges.filter(badge => badge.unlocked);
  const lockedBadges = toneMasterBadges.filter(badge => !badge.unlocked);

  // Get details of the active badge
  const activeBadgeDetails = activeBadge 
    ? toneMasterBadges.find(badge => badge.id === activeBadge) 
    : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-0"
        title="Change active badge"
      >
        <Award className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-[calc(100%+8px)] top-0 w-48 rounded-md shadow-lg bg-popover border border-border z-50">
          <div className="py-1 px-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2 pt-2">
              Badges
            </div>
            
            {/* Option to remove active badge */}
            <button
              onClick={() => {
                setActiveBadge(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-sm text-sm flex items-center justify-between
                ${!activeBadge ? 'bg-accent/20 text-accent-foreground' : 'hover:bg-muted'}
              `}
            >
              <span>No Badge</span>
            </button>
            
            {/* Unlocked badges */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {unlockedBadges.map(badge => (
                <button
                  key={badge.id}
                  onClick={() => {
                    setActiveBadge(badge.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-sm text-sm flex items-center justify-between
                    ${activeBadge === badge.id ? 'bg-accent/20 text-accent-foreground' : 'hover:bg-muted'}
                  `}
                >
                  <span>{badge.name}</span>
                  {recentlyUnlocked.includes(badge.id) && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-accent/20 text-accent animate-pulse">
                      New!
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Locked badges with progress */}
            {lockedBadges.length > 0 && (
              <>
                <div className="text-xs font-medium text-muted-foreground mt-3 mb-2 px-2 pt-1 border-t border-border">
                  In Progress
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {lockedBadges.map(badge => (
                    <div
                      key={badge.id}
                      className="w-full text-left px-3 py-1.5 rounded-sm text-xs text-muted-foreground"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          {badge.name}
                        </span>
                        <span className="text-xxs whitespace-nowrap">{badge.progress}/{badge.required}</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-1 w-full bg-muted h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-accent/40 h-full rounded-full" 
                          style={{ width: `${(badge.progress / badge.required) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeSelector; 