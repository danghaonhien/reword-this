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
    
    case 'surprise':
      return `Reword the following text in a creative and engaging tone, chosen at random from this list: [witty, poetic, snarky, minimalist, dramatic, Gen Z, persuasive, humorous]. Maintain the meaning.

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

/**
 * Generates prompts for the custom tone builder feature
 */
export const getCustomTonePrompt = (referenceText: string, textToRewrite: string): string => {
  return `Use the writing style from the reference sample below as a tone guide. Reword the second text to match this style, keeping the meaning intact.

Reference Style:
"${referenceText}"

Text to Reword:
"${textToRewrite}"`;
}; 