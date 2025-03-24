import { useState } from 'react'
import { getPromptForTone } from '@/utils/promptUtils'

type RewriteResult = {
  rewrite: (text: string, tone: string) => Promise<string>
  isLoading: boolean
  rewrittenText: string
  error: string | null
}

export const useRewrite = (): RewriteResult => {
  const [isLoading, setIsLoading] = useState(false)
  const [rewrittenText, setRewrittenText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const rewrite = async (text: string, tone: string): Promise<string> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // For demo purposes, we're using a mock API call
      // In production, this would call an actual API
      const prompt = getPromptForTone(tone, text)
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate demo response based on tone
      let response = ''
      
      switch(tone) {
        case 'clarity':
          response = text
            .split('. ')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .join('. ')
            .replace(/\s+/g, ' ')
            .trim()
          break
          
        case 'friendly':
          response = `Hey there! ${text} 😊`
          break
          
        case 'formal':
          response = `We hereby state that ${text}`
          break
          
        case 'surprise':
          const surpriseTones = ['witty', 'poetic', 'snarky', 'minimalist']
          const randomTone = surpriseTones[Math.floor(Math.random() * surpriseTones.length)]
          
          if (randomTone === 'witty') {
            response = `Well, isn't this interesting: ${text} (But what do I know?)`
          } else if (randomTone === 'poetic') {
            response = `In whispers of thought, we consider: ${text}`
          } else if (randomTone === 'snarky') {
            response = `Oh sure, like we're supposed to believe that ${text}`
          } else if (randomTone === 'minimalist') {
            response = text.split(' ').slice(0, text.split(' ').length / 2).join(' ') + '...'
          }
          break
          
        default:
          response = text
      }
      
      setRewrittenText(response)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return ''
    } finally {
      setIsLoading(false)
    }
  }

  return {
    rewrite,
    isLoading,
    rewrittenText,
    error
  }
} 