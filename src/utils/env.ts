/**
 * Environment variable utilities
 * 
 * Provides type-safe access to environment variables with fallbacks
 */

// API Keys
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string

// Environment configuration
export const isDev = () => process.env.NODE_ENV === 'development';

// API endpoint configuration
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://reword-this-backend.onrender.com/api';

// Debug mode configuration
export const DEBUG = isDev();

// Environment type
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'production';

// Environment variables configuration
export const MAX_TOKENS = parseInt(import.meta.env.VITE_MAX_TOKENS || '1000');
export const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo';

// Feature flags
export const ENABLE_PREMIUM_FEATURES = import.meta.env.VITE_ENABLE_PREMIUM_FEATURES === 'true';
export const ENABLE_DEBUG_MODE = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

// Helper functions
export const isProd = () => APP_ENV === 'production';

/**
 * Check if user has premium access
 * This uses the ENABLE_PREMIUM_FEATURES flag and can be extended
 * with subscription checks in the future
 */
export const isPremium = (): boolean => {
  return ENABLE_PREMIUM_FEATURES;
}

/**
 * Validates that the OpenAI API key looks correctly formatted
 * Basic validation checks:
 * 1. Not empty
 * 2. Starts with "sk-" (common for OpenAI keys)
 * 3. Minimum length (OpenAI keys are generally long)
 */
export const isValidApiKey = (key = OPENAI_API_KEY): boolean => {
  if (!key) return false;
  if (!key.startsWith('sk-')) return false;
  if (key.length < 30) return false;
  return true;
} 