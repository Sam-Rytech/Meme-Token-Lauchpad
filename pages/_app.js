import './globals.css'
import { WalletProvider } from '../context/WalletContext'
import { TokenProvider } from '../context/TokenContext'
import Layout from '../components/Layout/Layout'

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <TokenProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TokenProvider>
    </WalletProvider>
  )
}