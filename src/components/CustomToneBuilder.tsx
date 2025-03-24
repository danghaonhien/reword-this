import React, { useState } from 'react'
import { Info, CopyIcon, CheckIcon, ArrowRight } from 'lucide-react'

interface CustomToneBuilderProps {
  originalText: string
  onRewriteAgain: () => void
}

const CustomToneBuilder: React.FC<CustomToneBuilderProps> = ({ originalText, onRewriteAgain }) => {
  const [referenceText, setReferenceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rewrittenText, setRewrittenText] = useState('')
  const [copied, setCopied] = useState(false)

  const handleRewriteWithCustomTone = async () => {
    if (!referenceText.trim()) return

    setIsLoading(true)
    
    try {
      // Mock API delay - in production this would call the AI API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a rewrite based on the reference sample
      // In a real implementation, this would be handled by the AI model
      const customRewrite = `${originalText} 
      
      [Rewritten in the style of your reference sample, matching tone, vocabulary choices, sentence structure, and overall feel while maintaining the original meaning.]`
      
      setRewrittenText(customRewrite)
    } catch (error) {
      console.error("Error generating custom tone rewrite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Custom Tone Builder</h3>
        <button 
          onClick={onRewriteAgain}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Back to Input
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-muted/30 rounded-md border border-muted">
        <div className="flex items-start gap-2 mb-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Paste a sample of writing in the style you want to match. The AI will rewrite your text to match that style.
          </p>
        </div>
      </div>
      
      {!rewrittenText ? (
        <>
          <textarea
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            placeholder="Paste a reference text sample here..."
            className="w-full h-32 p-3 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          
          <div className="flex items-center gap-2 mt-3 mb-2">
            <div className="h-px flex-grow bg-border"></div>
            <span className="text-xs text-muted-foreground px-2">Original Text</span>
            <div className="h-px flex-grow bg-border"></div>
          </div>
          
          <div className="p-3 border border-input rounded-md bg-background/50 text-sm text-muted-foreground">
            {originalText}
          </div>
          
          <button
            onClick={handleRewriteWithCustomTone}
            disabled={isLoading || !referenceText.trim()}
            className="mt-4 w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-md 
                      hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50 
                      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-secondary-foreground"></div>
                <span>Analyzing Style...</span>
              </>
            ) : (
              <>
                <span>Rewrite with Custom Tone</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </>
      ) : (
        <div className="border border-border rounded-md p-4">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium px-2 py-0.5 bg-secondary/20 rounded-full">Custom Tone</span>
            <button 
              onClick={() => copyToClipboard(rewrittenText)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-sm flex items-center gap-1 text-xs"
            >
              {copied ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm whitespace-pre-wrap">{rewrittenText}</p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setRewrittenText('')
                setReferenceText('')
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Try Another Sample
            </button>
            <button
              onClick={onRewriteAgain}
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Input
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomToneBuilder 