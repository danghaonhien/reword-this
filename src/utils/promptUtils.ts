/**
 * Generates appropriate prompts for different tones
 */
export const getPromptForTone = (tone: string, text: string): string => {
  switch (tone) {
    case 'clarity':
      return `Reword the following text to be clearer and more concise. Remove unnecessary words and simplify without losing meaning.

Text:
"${text}"`;
    
    case 'friendly':
      return `Reword the following text to sound friendly, warm, and approachable. Maintain a conversational feel while keeping it clear.

Text:
"${text}"`;
    
    case 'formal':
      return `Reword the following text in a more formal and professional tone. Avoid contractions, and use polite, business-friendly language.

Text:
"${text}"`;
    
    case 'persuasive':
      return `Reword the following text in a persuasive tone that convinces the reader. Use compelling language, rhetorical questions, and persuasive techniques.

Text:
"${text}"`;
    
    case 'executive':
      return `Reword the following text in an authoritative, decisive tone suitable for executive communications. Be direct, confident, and action-oriented.

Text:
"${text}"`;
    
    case 'creative':
      return `Reword the following text in a creative, imaginative tone. Use expressive language, metaphors, and vivid imagery where appropriate.

Text:
"${text}"`;
    
    default:
      // Generic prompt for any other tone
      return `Reword the following text to sound more ${tone}. Keep the original meaning, improve the flow, and make it natural for human readers.

Text:
"${text}"`;
  }
};

/**
 * Generates prompts for the "Battle of the Rewrites" feature
 */
export const getBattlePrompt = (text: string): string => {
  return `Generate two distinct rewrites of the following text with slightly different structure or tone. Keep core meaning the same. Return them as: Version A and Version B.

Text:
"${text}"`;
}; 