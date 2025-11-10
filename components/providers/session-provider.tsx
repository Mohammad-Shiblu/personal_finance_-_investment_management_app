
/**
 * Session Provider Component
 * Wraps the app with NextAuth session context to prevent hydration mismatches
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <div>{children}</div>
  }

  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}
