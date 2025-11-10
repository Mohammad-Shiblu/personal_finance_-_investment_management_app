
/**
 * Dashboard Home Page
 * Main dashboard overview with financial summaries and quick actions
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth-config'
import { DashboardOverview } from '../../components/dashboard/overview'
import { QuickActions } from '../../components/dashboard/quick-actions'
import { RecentTransactions } from '../../components/dashboard/recent-transactions'
import { FinancialSummaryCards } from '../../components/dashboard/summary-cards'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const firstName = session?.user?.firstName || 'there'

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's your financial overview for today.
        </p>
      </div>

      {/* Financial summary cards */}
      <FinancialSummaryCards />

      {/* Quick actions */}
      <QuickActions />

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Overview charts */}
        <div className="lg:col-span-2">
          <DashboardOverview />
        </div>

        {/* Right column - Recent transactions */}
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
