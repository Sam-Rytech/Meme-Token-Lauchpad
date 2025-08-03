import { useState, useEffect } from 'react'
import { Copy, ExternalLink, Wallet } from 'lucide-react'
import { useWallet } from '../../hooks/useWallet'
import { formatAddress, copyToClipboard } from '../../utils/helpers'

export default function WalletInfo() {
  const { account, isConnected, provider } = useWallet()
  const [balance, setBalance] = useState('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  useEffect(() => {
    if (isConnected && provider && account) {
      fetchBalance()
    }
  }, [isConnected, provider, account])

  const fetchBalance = async () => {
    if (!provider || !account) return

    try {
      setIsLoadingBalance(true)
      const balance = await provider.getBalance(account)
      const balanceInEth = (Number(balance) / 1e18).toFixed(4)
      setBalance(balanceInEth)
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance('Error')
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(account)
    if (success) {
      // You could add a toast notification here
      console.log('Address copied to clipboard')
    }
  }

  const openInExplorer = () => {
    const explorerUrl =
      process.env.NEXT_PUBLIC_EXPLORER_URL ||
      'https://sepolia-explorer.base.org'
    window.open(`${explorerUrl}/address/${account}`, '_blank')
  }

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">
          Connect your wallet to view account information
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Wallet className="w-5 h-5 mr-2" />
        Wallet Information
      </h3>

      <div className="space-y-4">
        {/* Account Address */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Account Address
          </label>
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-3">
            <span className="text-white font-mono text-sm flex-1 break-all">
              {account}
            </span>
            <button
              onClick={handleCopyAddress}
              className="text-purple-400 hover:text-purple-300 transition-colors p-1"
              title="Copy address"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={openInExplorer}
              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
              title="View in explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            ETH Balance
          </label>
          <div className="bg-white/5 rounded-lg p-3">
            {isLoadingBalance ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading...</span>
              </div>
            ) : (
              <span className="text-white font-semibold">{balance} ETH</span>
            )}
          </div>
        </div>

        {/* Network */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Network</label>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white">
                {process.env.NEXT_PUBLIC_NETWORK_NAME || 'Base Sepolia'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={fetchBalance}
            disabled={isLoadingBalance}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm"
          >
            Refresh Balance
          </button>
          <button
            onClick={openInExplorer}
            className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2 px-4 rounded-lg transition-all duration-200 text-sm"
          >
            View in Explorer
          </button>
        </div>
      </div>
    </div>
  )
}
