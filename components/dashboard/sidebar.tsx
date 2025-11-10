
/**
 * Dashboard Sidebar Component
 * Navigation sidebar for the financial management dashboard
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import {
  DollarSign,
  Home,
  TrendingUp,
  CreditCard,
  PieChart,
  Calculator,
  Upload,
  BarChart3,
  Settings,
  Wallet
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Income', href: '/dashboard/income', icon: TrendingUp },
  { name: 'Expenses', href: '/dashboard/expenses', icon: CreditCard },
  { name: 'Categories', href: '/dashboard/categories', icon: PieChart },
  { name: 'Investments', href: '/dashboard/investments', icon: Wallet },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Calculators', href: '/dashboard/calculators', icon: Calculator },
  { name: 'Import CSV', href: '/dashboard/import', icon: Upload },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <DollarSign className="h-8 w-8 text-green-600" />
        <span className="text-xl font-bold text-gray-900">FinanceApp</span>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? 'bg-green-50 border-r-2 border-green-600 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
              )}
            >
              <item.icon
                className={cn(
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 flex-shrink-0 h-5 w-5'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Version info */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Phase 1 Foundation
          <br />
          <span className="font-medium">v1.0.0</span>
        </div>
      </div>
    </div>
  )
}
