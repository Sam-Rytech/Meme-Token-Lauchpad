import { createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { switchToBaseSepolia, getContract } from '../utils/contracts'

export const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [account, setAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [chainId, setChainId] = useState(null)

  useEffect(() => {
    checkConnection()
    const removeListeners = setupEventListeners()
    return () => removeListeners && removeListeners()
  }, [])

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else if (accounts[0] !== account) {
      setAccount(accounts[0])
    }
  }

  const handleChainChanged = (chainId) => {
    setChainId(chainId)
    window.location.reload()
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        if (accounts.length > 0) {
          await connectWallet()
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setIsLoading(true)
        setError('')

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        await switchToBaseSepolia()

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = getContract(provider, true)

        const network = await provider.getNetwork()
        setChainId('0x' + network.chainId.toString(16))

        setAccount(accounts[0])
        setIsConnected(true)
        setProvider(provider)
        setSigner(signer)
        setContract(contract)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        if (error.code === 4001) {
          setError('Connection rejected by user')
        } else {
          setError('Failed to connect wallet')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const disconnectWallet = () => {
    setAccount('')
    setIsConnected(false)
    setProvider(null)
    setSigner(null)
    setContract(null)
    setChainId(null)
    setError('')
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        provider,
        signer,
        contract,
        isLoading,
        error,
        chainId,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
