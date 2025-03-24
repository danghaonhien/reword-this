import { useState, useEffect } from 'react'
import PopupView from './pages/PopupView'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [selectedText, setSelectedText] = useState<string>('')

  useEffect(() => {
    // Check if we're in a Chrome extension context
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'TEXT_SELECTED') {
          setSelectedText(message.text)
        }
      })
    }

    // For development outside of extension context
    const urlParams = new URLSearchParams(window.location.search)
    const textParam = urlParams.get('text')
    if (textParam) {
      setSelectedText(decodeURIComponent(textParam))
    }
  }, [])

  return (
    <div className="w-[400px] min-h-[500px] p-5 bg-background text-foreground shadow-xl rounded-lg relative">
      <DarkModeToggle />
      <PopupView initialText={selectedText} />
    </div>
  )
}

export default App 