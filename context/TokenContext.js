import { createContext, useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'

export const TokenContext = createContext()

export function TokenProvider({ children }) {
  const [deployedTokens, setDeployedTokens] = useState([])
  const [isLoadingTokens, setIsLoadingTokens] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const { account, contract, isConnected } = useWallet()

  useEffect(() => {
    if (isConnected && contract && account) {
      loadUserTokens()
    } else {
      setDeployedTokens([])
    }
  }, [isConnected, contract, account])

  const loadUserTokens = async () => {
    if (!contract || !account) return

    try {
      setIsLoadingTokens(true)
      setTokenError('')

      // Get user's token addresses
      const tokenAddresses = await contract.getTokensByCreator(account)
      const tokens = []

      // Get detailed info for each token
      for (const tokenAddress of tokenAddresses) {
        try {
          const tokenInfo = await contract.getTokenInfo(tokenAddress)
          tokens.push({
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            totalSupply: tokenInfo.totalSupply.toString(),
            address: tokenAddress,
            timestamp: new Date(
              Number(tokenInfo.timestamp) * 1000
            ).toLocaleDateString(),
            creator: tokenInfo.creator,
          })
        } catch (error) {
          console.error(`Error loading token info for ${tokenAddress}:`, error)
        }
      }

      // Sort by newest first
      tokens.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setDeployedTokens(tokens)
    } catch (error) {
      console.error('Error loading user tokens:', error)
      setTokenError('Failed to load your tokens')
    } finally {
      setIsLoadingTokens(false)
    }
  }

  const createToken = async (tokenData) => {
    if (!contract) {
      throw new Error('Contract not initialized')
    }

    try {
      // Estimate gas
      const gasEstimate = await contract.createToken.estimateGas(
        tokenData.name,
        tokenData.symbol,
        tokenData.totalSupply
      )

      // Add 20% buffer to gas estimate
      const gasLimit = (gasEstimate * 120n) / 100n

      // Create transaction
      const tx = await contract.createToken(
        tokenData.name,
        tokenData.symbol,
        tokenData.totalSupply,
        { gasLimit }
      )

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Find the TokenCreated event
      const tokenCreatedEvent = receipt.logs.find((log) => {
        try {
          const parsedLog = contract.interface.parseLog(log)
          return parsedLog.name === 'TokenCreated'
        } catch {
          return false
        }
      })

      if (tokenCreatedEvent) {
        const parsedLog = contract.interface.parseLog(tokenCreatedEvent)
        const tokenAddress = parsedLog.args.tokenAddress

        // Add new token to the list
        const newToken = {
          name: tokenData.name,
          symbol: tokenData.symbol,
          totalSupply: tokenData.totalSupply,
          address: tokenAddress,
          timestamp: new Date().toLocaleDateString(),
          creator: account,
        }

        setDeployedTokens((prev) => [newToken, ...prev])

        return {
          success: true,
          tokenAddress,
          transactionHash: receipt.hash,
        }
      }

      throw new Error('Token creation event not found')
    } catch (error) {
      console.error('Error creating token:', error)

      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error(
          'Insufficient ETH for gas fees. Please add ETH to your wallet.'
        )
      } else if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user.')
      } else if (error.reason) {
        throw new Error(error.reason)
      } else {
        throw new Error('Failed to create token. Please try again.')
      }
    }
  }

  const refreshTokens = () => {
    if (isConnected && contract && account) {
      loadUserTokens()
    }
  }

  const addToken = (token) => {
    setDeployedTokens((prev) => [token, ...prev])
  }

  const removeToken = (tokenAddress) => {
    setDeployedTokens((prev) =>
      prev.filter((token) => token.address !== tokenAddress)
    )
  }

  const getTokenByAddress = (address) => {
    return deployedTokens.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )
  }

  const value = {
    deployedTokens,
    isLoadingTokens,
    tokenError,
    createToken,
    loadUserTokens,
    refreshTokens,
    addToken,
    removeToken,
    getTokenByAddress,
    setTokenError,
  }

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}
