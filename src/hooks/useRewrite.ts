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
          
        case 'gen_z':
          response = `ngl, ${text} fr fr 💯 no cap! it's giving... vibes ✨`
          break
          
        case 'executive':
          response = `Bottom line: ${text}. The key implications are significant.`
          break
          
        case 'creative':
          response = `Imagine a world where ${text}... The possibilities are endless!`
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