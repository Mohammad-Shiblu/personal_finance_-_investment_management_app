
/**
 * Root Layout Component
 * Main layout wrapper for the Financial Management Application
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '../components/ui/toaster'
import { SessionProvider } from '../components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Financial Management App - Phase 1 Foundation',
  description: 'Comprehensive financial management application for income tracking, expense management, investment portfolio, and financial analytics.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Financial Management App - Phase 1 Foundation',
    description: 'Comprehensive financial management application for income tracking, expense management, investment portfolio, and financial analytics.',
    images: ['/og-image.png'],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background font-sans antialiased">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
