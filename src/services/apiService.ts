import { API_ENDPOINT, isDev } from '@/utils/env';

interface APIError extends Error {
  name: string;
  message: string;
}

/**
 * Service for making secure API calls via our backend server
 */
export const callOpenAI = async (prompt: string): Promise<string> => {
  try {
    // Ensure the API endpoint is properly formatted
    const endpoint = API_ENDPOINT.endsWith('/') ? API_ENDPOINT.slice(0, -1) : API_ENDPOINT;
    const url = `${endpoint}/rewrite`;
    
    if (isDev()) {
      console.log(`Calling API at ${url}`);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      // Add timeout
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });

    // Log response status for debugging
    if (isDev()) {
      console.log(`API response status: ${response.status}`);
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.error || `API request failed with status ${response.status}`;
      } catch (e) {
        errorMessage = `API request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    
    // More specific error handling
    const apiError = error as APIError;
    if (apiError.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    } else if (apiError.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(apiError.message || 'Error calling API');
  }
};

/**
 * Service for battle rewrites feature
 */
export const callOpenAIForBattle = async (prompt: string): Promise<{versionA: string, versionB: string}> => {
  try {
    const response = await callOpenAI(prompt);
    
    // Parse the response to extract Version A and Version B
    const versionAMatch = response.match(/Version A[:\s]*(.+?)(?=Version B|$)/is);
    const versionBMatch = response.match(/Version B[:\s]*(.+?)$/is);
    
    if (!versionAMatch || !versionBMatch) {
      console.warn('Battle response parsing issue:', response);
    }
    
    return {
      versionA: versionAMatch?.[1]?.trim() || 'Failed to generate Version A. Please try again.',
      versionB: versionBMatch?.[1]?.trim() || 'Failed to generate Version B. Please try again.'
    };
  } catch (error: unknown) {
    console.error('Battle rewrites API error:', error);
    const apiError = error as APIError;
    throw new Error(apiError.message || 'Error generating battle rewrites');
  }
}; 