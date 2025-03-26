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
          
        case 'persuasive':
          response = `You absolutely need to consider that ${text}. Don't you agree?`
          break
          
        case 'executive':
          response = `Decision: ${text}. Action required immediately.`
          break
          
        case 'creative':
          response = `Imagine a world where ${text} becomes the new reality!`
          break
          
        default:
          response = text
      }
      
      setRewrittenText(response)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
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