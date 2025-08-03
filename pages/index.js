import { useState } from 'react'
import Head from 'next/head'
import { Sparkles, TrendingUp } from 'lucide-react'
import HeroSection from '../components/Features/HeroSection'
import CreateToken from '../components/Features/CreateToken'
import TokenHistory from '../components/Features/TokenHistory'
import { useWallet } from '../hooks/useWallet'

export default function Home() {
  const [activeTab, setActiveTab] = useState('create')
  const { isConnected } = useWallet()

  return (
    <>
      <Head>
        <title>MemeFactory - Launch Your Meme Token</title>
        <meta
          name="description"
          content="Create and deploy ERC-20 meme tokens on Base Sepolia in seconds. No coding required!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <HeroSection />

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Create Token
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                My Tokens
              </button>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'create' && <CreateToken />}
          {activeTab === 'history' && <TokenHistory />}
        </div>
      </div>
    </>
  )
}
