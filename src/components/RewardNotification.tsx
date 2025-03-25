import React, { useState, useEffect } from 'react'
import { Sparkles, XCircle } from 'lucide-react'

// Define the event detail types
interface RewardUnlockedEvent {
  unlockedDetails: {
    tones: string[];
    themes: string[];
  }
}

const RewardNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<{ id: string; type: string; name: string; }[]>([])
  
  useEffect(() => {
    // Handle reward unlocked events
    const handleRewardUnlocked = (e: CustomEvent) => {
      const detail = e.detail as RewardUnlockedEvent;
      
      if (detail?.unlockedDetails) {
        const { tones = [], themes = [] } = detail.unlockedDetails;
        
        // Process tones
        tones.forEach(tone => {
          addNotification('tone', tone);
        });
        
        // Process themes
        themes.forEach(theme => {
          addNotification('theme', theme);
        });
      }
    }

    // Add event listener
    window.addEventListener('rewardUnlocked' as any, handleRewardUnlocked as any)
    
    // Cleanup
    return () => {
      window.removeEventListener('rewardUnlocked' as any, handleRewardUnlocked as any)
    }
  }, [])

  // Add a notification
  const addNotification = (type: string, id: string) => {
    const newNotification = {
      id: `${type}-${id}-${Date.now()}`,
      type,
      name: formatName(id)
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
    }, 5000)
  }
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  // Format name from ID (camelCase or snake_case to Title Case)
  const formatName = (id: string) => {
    return id
      .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
      .trim()
  }

  // If no notifications, don't render anything
  if (notifications.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-64">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className="bg-card border border-border shadow-md rounded-md p-3 animate-slideInDown flex items-start"
        >
          <div className="mr-2 mt-0.5">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium">New {notification.type} Unlocked!</h4>
            <p className="text-xs text-muted-foreground">{notification.name}</p>
          </div>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default RewardNotification 