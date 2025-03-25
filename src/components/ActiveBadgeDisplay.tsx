import React from 'react'
import { useGameification } from '@/hooks/useGameification'
import { Award } from 'lucide-react'

interface ActiveBadgeDisplayProps {
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ActiveBadgeDisplay: React.FC<ActiveBadgeDisplayProps> = ({ 
  showName = true,
  size = 'md' 
}) => {
  const { toneMasterBadges, activeBadge } = useGameification()
  
  const badgeDetails = activeBadge 
    ? toneMasterBadges.find(badge => badge.id === activeBadge)
    : null;
    
  if (!badgeDetails) return null;
  
  const sizeMap = {
    sm: { icon: 'w-3 h-3', text: 'text-xs' },
    md: { icon: 'w-4 h-4', text: 'text-sm' },
    lg: { icon: 'w-5 h-5', text: 'text-base' }
  };
  
  return (
    <div 
      className="inline-flex items-center gap-1 bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full"
      title={badgeDetails.description}
    >
      <Award className={sizeMap[size].icon} />
      {showName && (
        <span className={`${sizeMap[size].text} font-medium`}>
          {badgeDetails.name}
        </span>
      )}
    </div>
  )
}

export default ActiveBadgeDisplay 