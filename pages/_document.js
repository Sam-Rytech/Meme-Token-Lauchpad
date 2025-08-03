import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#8b5cf6" />
        <meta
          name="description"
          content="Create and deploy ERC-20 meme tokens on Base Sepolia in seconds. No coding required!"
        />
        <meta
          property="og:title"
          content="MemeFactory - Launch Your Meme Token"
        />
        <meta
          property="og:description"
          content="Create and deploy ERC-20 meme tokens on Base Sepolia in seconds. No coding required!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MemeFactory - Launch Your Meme Token"
        />
        <meta
          name="twitter:description"
          content="Create and deploy ERC-20 meme tokens on Base Sepolia in seconds. No coding required!"
        />
        <meta name="twitter:image" content="/twitter-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
