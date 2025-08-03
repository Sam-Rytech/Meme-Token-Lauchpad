import { ethers } from 'ethers'

// Contract configuration
export const TOKEN_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS ||
  '0x2846e2885e35e243d9d5eea203e90b547ed86155'
export const BASE_SEPOLIA_CHAIN_ID = '0x14A34' // 84532 in hex

// Contract ABI
export const TOKEN_FACTORY_ABI = [
  'function createToken(string memory _name, string memory _symbol, uint256 _totalSupply) external returns (address)',
  'function getTokensByCreator(address creator) external view returns (address[] memory)',
  'function getTokenInfo(address tokenAddress) external view returns (tuple(address tokenAddress, string name, string symbol, uint256 totalSupply, address creator, uint256 timestamp))',
  'function getAllTokens() external view returns (address[] memory)',
  'function getTotalTokensCount() external view returns (uint256)',
  'event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol, uint256 totalSupply, uint256 timestamp)',
]

// ERC-20 Token ABI (for interacting with created tokens)
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

// Network configuration
export const BASE_SEPOLIA_CONFIG = {
  chainId: BASE_SEPOLIA_CHAIN_ID,
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'],
  blockExplorerUrls: [
    process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia-explorer.base.org',
  ],
}

// Switch to Base Sepolia network
export const switchToBaseSepolia = async () => {
  if (!window.ethereum) {
    throw new Error('No wallet detected')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BASE_SEPOLIA_CONFIG],
        })
      } catch (addError) {
        throw new Error('Failed to add Base Sepolia network')
      }
    } else {
      throw switchError
    }
  }
}

// Get contract instance
export const getContract = (provider, withSigner = false) => {
  if (!TOKEN_FACTORY_ADDRESS || TOKEN_FACTORY_ADDRESS === '0x...') {
    throw new Error('Token Factory contract address not configured')
  }

  const contractProvider = withSigner ? provider.getSigner() : provider
  return new ethers.Contract(
    TOKEN_FACTORY_ADDRESS,
    TOKEN_FACTORY_ABI,
    contractProvider
  )
}

// Get ERC-20 token contract instance
export const getTokenContract = (
  tokenAddress,
  provider,
  withSigner = false
) => {
  if (!tokenAddress) {
    throw new Error('Token address is required')
  }

  const contractProvider = withSigner ? provider.getSigner() : provider
  return new ethers.Contract(tokenAddress, ERC20_ABI, contractProvider)
}

// Get provider (read-only)
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }

  // Fallback to public RPC
  return new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'
  )
}

// Check if user is on correct network
export const isCorrectNetwork = async () => {
  if (!window.ethereum) return false

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return chainId === BASE_SEPOLIA_CHAIN_ID
  } catch (error) {
    console.error('Error checking network:', error)
    return false
  }
}

// Get current network info
export const getCurrentNetwork = async () => {
  if (!window.ethereum) return null

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const networkId = parseInt(chainId, 16)

    // Known networks
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      8453: 'Base Mainnet',
      84532: 'Base Sepolia',
      11155111: 'Sepolia',
    }

    return {
      chainId,
      networkId,
      name: networks[networkId] || `Unknown Network (${networkId})`,
    }
  } catch (error) {
    console.error('Error getting network info:', error)
    return null
  }
}

// Validate contract address
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

// Format wei to ether
export const formatEther = (wei) => {
  try {
    return ethers.formatEther(wei)
  } catch {
    return '0'
  }
}

// Parse ether to wei
export const parseEther = (ether) => {
  try {
    return ethers.parseEther(ether.toString())
  } catch {
    return ethers.parseEther('0')
  }
}
