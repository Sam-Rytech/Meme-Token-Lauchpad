import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      href: process.env.NEXT_PUBLIC_GITHUB_URL || '#',
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: 'Twitter',
      href: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: 'Discord',
      href: process.env.NEXT_PUBLIC_DISCORD_URL || '#',
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ]

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Create Token', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '#' },
        { name: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: process.env.NEXT_PUBLIC_DISCORD_URL || '#' },
        { name: 'Twitter', href: process.env.NEXT_PUBLIC_TWITTER_URL || '#' },
        { name: 'GitHub', href: process.env.NEXT_PUBLIC_GITHUB_URL || '#' },
        { name: 'Support', href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-white">MemeFactory</h3>
            </div>
            <p className="text-gray-400 mb-6">
              The easiest way to create and deploy meme tokens on Base Sepolia.
              No coding required.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center"
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={
                        link.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : ''
                      }
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; {currentYear} MemeFactory. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Connected to{' '}
                {process.env.NEXT_PUBLIC_NETWORK_NAME || 'Base Sepolia'}
              </span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_EXPLORER_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
            >
              View Explorer
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
