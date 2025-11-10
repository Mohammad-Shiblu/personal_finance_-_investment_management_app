
/**
 * Landing Page Component
 * Main entry point - redirects to dashboard if authenticated, shows landing page if not
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth-config'
import { redirect } from 'next/navigation'
import { LandingPage } from '../components/landing-page'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  return <LandingPage />
}
