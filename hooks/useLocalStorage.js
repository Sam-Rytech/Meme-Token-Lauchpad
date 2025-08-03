import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Remove from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

// Hook for storing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage(
    'meme-factory-preferences',
    {
      theme: 'dark',
      autoRefresh: true,
      notifications: true,
      defaultGasLimit: '200000',
    }
  )

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return {
    preferences,
    setPreferences,
    updatePreference,
  }
}

// Hook for storing recently viewed tokens
export function useRecentTokens(maxItems = 10) {
  const [recentTokens, setRecentTokens] = useLocalStorage(
    'meme-factory-recent-tokens',
    []
  )

  const addRecentToken = (token) => {
    setRecentTokens((prev) => {
      // Remove if already exists
      const filtered = prev.filter((t) => t.address !== token.address)
      // Add to beginning and limit to maxItems
      return [token, ...filtered].slice(0, maxItems)
    })
  }

  const removeRecentToken = (address) => {
    setRecentTokens((prev) => prev.filter((token) => token.address !== address))
  }

  const clearRecentTokens = () => {
    setRecentTokens([])
  }

  return {
    recentTokens,
    addRecentToken,
    removeRecentToken,
    clearRecentTokens,
  }
}
