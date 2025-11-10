
/**
 * Financial Summary Cards Component
 * Displays key financial metrics in card format
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  categoryCount: number
  investmentCount: number
}

export function FinancialSummaryCards() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard')
      const data = await response.json()

      if (data.success && data.data) {
        const dashboardData = data.data
        setSummary({
          totalIncome: dashboardData.totals?.totalIncome || 0,
          totalExpenses: dashboardData.totals?.totalExpenses || 0,
          netSavings: (dashboardData.totals?.totalIncome || 0) - (dashboardData.totals?.totalExpenses || 0),
          savingsRate: dashboardData.trends?.savingsRate || 0,
          categoryCount: dashboardData.totals?.categoryCount || 0,
          investmentCount: dashboardData.totals?.investmentCount || 0
        })
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
      setError('Failed to load financial summary')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !summary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <p className="text-muted-foreground">{error || 'No data available'}</p>
        </CardContent>
      </Card>
    )
  }

  const cards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+3.2%',
      changeColor: 'text-red-600'
    },
    {
      title: 'Net Savings',
      value: summary.netSavings,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${summary.savingsRate.toFixed(1)}% rate`,
      changeColor: summary.savingsRate > 20 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Investments',
      value: summary.investmentCount,
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: `${summary.categoryCount} categories`,
      changeColor: 'text-gray-600',
      isCount: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.isCount ? (
                  card.value
                ) : (
                  `$${card.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </div>
              <p className={`text-xs ${card.changeColor} flex items-center gap-1`}>
                {card.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
