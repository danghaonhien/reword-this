import React from 'react'
import ReactDOM from 'react-dom/client'
import PopupView from './pages/PopupView'
import './index.css'

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PopupView />
        </div>
      </div>
    </div>
  </React.StrictMode>,
) 