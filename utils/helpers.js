// Address formatting
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Number formatting
export const formatNumber = (num) => {
  if (!num) return '0'
  return parseInt(num).toLocaleString()
}

// Format large numbers with suffixes
export const formatNumberWithSuffix = (num) => {
  if (!num) return '0'

  const number = parseInt(num)

  if (number >= 1e12) {
    return (number / 1e12).toFixed(1) + 'T'
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B'
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M'
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K'
  }

  return number.toLocaleString()
}

// Clipboard operations
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)

    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

// Open in explorer
export const openInExplorer = (address, type = 'address') => {
  const baseUrl =
    process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia-explorer.base.org'
  const url = `${baseUrl}/${type}/${address}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Open transaction in explorer
export const openTransactionInExplorer = (txHash) => {
  openInExplorer(txHash, 'tx')
}

// Time formatting
export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  } else {
    return time.toLocaleDateString()
  }
}

// Date formatting
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// String utilities
export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Validation utilities
export const isValidTokenName = (name) => {
  return name && name.trim().length > 0 && name.length <= 50
}

export const isValidTokenSymbol = (symbol) => {
  return symbol && /^[A-Z0-9]{1,10}$/.test(symbol.toUpperCase())
}

export const isValidTotalSupply = (supply) => {
  const num = parseInt(supply)
  return !isNaN(num) && num > 0 && num <= 1e15
}

// URL utilities
export const buildExplorerUrl = (address, type = 'address') => {
  const baseUrl =
    process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia-explorer.base.org'
  return `${baseUrl}/${type}/${address}`
}

export const buildTransactionUrl = (txHash) => {
  return buildExplorerUrl(txHash, 'tx')
}

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  if (typeof window === 'undefined') return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return false

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

// Array utilities
export const removeDuplicates = (array, key) => {
  if (!key) return [...new Set(array)]

  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

// Async utilities
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      await sleep(delay * attempt)
    }
  }
}

// Error handling
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error

  if (error?.reason) return error.reason
  if (error?.message) return error.message
  if (error?.data?.message) return error.data.message

  return 'An unexpected error occurred'
}

// Generate random values
export const generateRandomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Color utilities
export const generateColorFromAddress = (address) => {
  if (!address) return '#8b5cf6'

  const colors = [
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
    '#8b5cf6',
    '#f97316',
  ]

  const index = parseInt(address.slice(-2), 16) % colors.length
  return colors[index]
}
