import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConstellationBackground from '@/components/ConstellationBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WatchX: Premium Timepiece Auctions',
  description: 'Bid on and sell luxury watches in real-time auctions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AuthProvider>
          <ConstellationBackground />
          <div className="min-h-screen flex flex-col relative z-10">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

