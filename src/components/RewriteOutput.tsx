import React from 'react'
import { Copy, ArrowLeft, RefreshCw } from 'lucide-react'

interface RewriteOutputProps {
  originalText: string
  rewrittenText: string
  tone: string
  onRewriteAgain: () => void
}

const RewriteOutput: React.FC<RewriteOutputProps> = ({
  originalText,
  rewrittenText,
  tone,
  onRewriteAgain,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText)
      .then(() => {
        // Could show a toast notification here
        console.log('Copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium capitalize">
          {tone === 'surprise' ? 'Surprise tone' : `${tone} tone`}
        </h3>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>

      <div className="bg-muted/30 rounded-md p-3 mb-4 text-sm overflow-auto max-h-[200px]">
        {rewrittenText}
      </div>

      <div className="text-xs text-muted-foreground mb-2">Original text:</div>
      <div className="bg-muted/30 rounded-md p-3 mb-4 text-xs overflow-auto max-h-[100px] text-muted-foreground">
        {originalText}
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onRewriteAgain}
          className="flex items-center justify-center gap-1 py-2 px-3 
                   bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 flex-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Try Different Tone
        </button>
        <button
          onClick={onRewriteAgain}
          className="flex items-center justify-center gap-1 py-2 px-3 
                   bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex-1"
        >
          <RefreshCw className="w-4 h-4" />
          Rewrite Again
        </button>
      </div>
    </div>
  )
}

export default RewriteOutput 