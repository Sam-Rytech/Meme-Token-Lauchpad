import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import {
  switchToBaseSepolia,
  BASE_SEPOLIA_CHAIN_ID,
} from '../../utils/contracts'

export default function NetworkSwitch() {
  const [currentChainId, setCurrentChainId] = useState(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    checkNetwork()

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged)
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setCurrentChainId(chainId)
        setIsCorrectNetwork(chainId === BASE_SEPOLIA_CHAIN_ID)
      } catch (error) {
        console.error('Error checking network:', error)
      }
    }
  }

  const handleChainChanged = (chainId) => {
    setCurrentChainId(chainId)
    setIsCorrectNetwork(chainId === BASE_SEPOLIA_CHAIN_ID)
    // Reload the page to refresh the provider
    window.location.reload()
  }

  const handleSwitchNetwork = async () => {
    setIsSwitching(true)
    try {
      await switchToBaseSepolia()
    } catch (error) {
      console.error('Error switching network:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  // Don't show if no wallet is connected
  if (!window.ethereum || !currentChainId) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-green-300 font-medium">
            Connected to Base Sepolia
          </p>
          <p className="text-green-400 text-sm">
            You're on the correct network
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-orange-300 font-medium mb-1">Wrong Network</p>
          <p className="text-orange-400 text-sm mb-3">
            Please switch to Base Sepolia to use this application.
          </p>
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
          >
            {isSwitching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Switching...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Switch to Base Sepolia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
