import React from 'react'
import { Magic } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Magic className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold">Reword This</h1>
      </div>
      <div className="text-xs text-muted-foreground">
        v1.0.0
      </div>
    </div>
  )
}

export default Header 