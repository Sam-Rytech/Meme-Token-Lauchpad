import Head from 'next/head'
import { Shield, Zap, Users, Code, Rocket, Globe } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description:
        'Deploy your meme token in seconds, not hours. Our optimized smart contracts ensure quick and efficient deployment.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Audited',
      description:
        'Built with security in mind. Our smart contracts follow best practices and are thoroughly tested.',
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'No Code Required',
      description:
        'Create professional tokens without writing a single line of code. Perfect for creators and entrepreneurs.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description:
        'Join thousands of creators who have launched their tokens. Be part of the meme economy revolution.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Base Network',
      description:
        'Built on Base Sepolia for fast, cheap transactions. Experience the future of decentralized finance.',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Launch Ready',
      description:
        'Your tokens are immediately tradeable and ready for the market. Start building your community today.',
    },
  ]

  return (
    <>
      <Head>
        <title>About - MemeFactory</title>
        <meta
          name="description"
          content="Learn about MemeFactory, the easiest way to create and deploy meme tokens on Base Sepolia."
        />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MemeFactory
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MemeFactory is the ultimate no-code platform for creating and
              deploying ERC-20 meme tokens. We're democratizing token creation
              and making it accessible to everyone.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 text-center leading-relaxed">
              We believe that anyone should be able to participate in the token
              economy, regardless of their technical background. MemeFactory
              removes the barriers to token creation, empowering creators,
              communities, and entrepreneurs to launch their ideas quickly and
              securely on the blockchain.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          

          

          
        </div>
      </div>
    </>
  )
}
