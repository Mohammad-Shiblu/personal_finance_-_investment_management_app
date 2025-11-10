
/**
 * Dashboard Layout Component
 * Layout wrapper for authenticated pages with sidebar navigation
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth-config'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '../../components/dashboard/sidebar'
import { DashboardHeader } from '../../components/dashboard/header'

export const dynamic = 'force-dynamic'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col flex-1 overflow-hidden">
        <DashboardHeader user={session.user} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
