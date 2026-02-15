import { vi } from './vi'

export const translations = {
  vi,
}

export type Locale = keyof typeof translations

// Simple translation function
export function t(key: string, locale: Locale = 'vi'): string {
  const keys = key.split('.')
  let value: unknown = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key
}

// Export Vietnamese translations directly for convenience
export { vi }
