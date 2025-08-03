import { useState, useEffect } from 'react'
import { useWallet } from './useWallet'

export function useContract() {
  const { contract, provider, signer, isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const executeTransaction = async (method, ...args) => {
    if (!contract) {
      throw new Error('Contract not initialized')
    }

    setIsLoading(true)
    setError('')

    try {
      // Estimate gas if it's a state-changing function
      let gasLimit
      if (contract[method].estimateGas) {
        const gasEstimate = await contract[method].estimateGas(...args)
        gasLimit = (gasEstimate * 120n) / 100n // Add 20% buffer
      }

      // Execute the transaction
      const tx = await contract[method](...args, gasLimit ? { gasLimit } : {})

      // Wait for confirmation if it returns a transaction
      if (tx.wait) {
        const receipt = await tx.wait()
        return receipt
      } else {
        return tx
      }
    } catch (error) {
      console.error(`Error executing ${method}:`, error)

      let errorMessage = 'Transaction failed'

      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas fees'
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user'
      } else if (error.reason) {
        errorMessage = error.reason
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const callContract = async (method, ...args) => {
    if (!contract) {
      throw new Error('Contract not initialized')
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await contract[method](...args)
      return result
    } catch (error) {
      console.error(`Error calling ${method}:`, error)
      const errorMessage =
        error.reason || error.message || 'Contract call failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getContractAddress = () => {
    return contract?.target || contract?.address
  }

  const getContractInterface = () => {
    return contract?.interface
  }

  return {
    contract,
    isLoading,
    error,
    executeTransaction,
    callContract,
    getContractAddress,
    getContractInterface,
    setError,
  }
}