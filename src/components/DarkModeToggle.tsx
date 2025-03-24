import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    // Update localStorage and apply class to document
    localStorage.setItem('darkMode', darkMode.toString())
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <button 
      onClick={toggleDarkMode} 
      className="p-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-3.5 h-3.5 text-accent" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-secondary" />
      )}
    </button>
  )
}

export default DarkModeToggle 