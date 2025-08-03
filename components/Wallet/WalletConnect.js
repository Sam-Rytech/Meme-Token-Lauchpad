import { Wallet, LogOut } from 'lucide-react'
import { useWallet } from '../../hooks/useWallet'
import { formatAddress } from '../../utils/helpers'

export default function WalletConnect() {
  const { account, isConnected, isLoading, connectWallet, disconnectWallet } =
    useWallet()

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <Wallet className="w-5 h-5" />
        )}
        <span className="hidden sm:inline">
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
    )
  }

  return (
    <div className="relative group">
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-200">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white text-sm">{formatAddress(account)}</span>
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4">
          <div className="text-xs text-gray-400 mb-2">Connected Account</div>
          <div className="text-white font-mono text-sm mb-4 break-all">
            {account}
          </div>
          <button
            onClick={disconnectWallet}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  )
}
