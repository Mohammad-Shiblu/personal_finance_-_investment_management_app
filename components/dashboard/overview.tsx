
/**
 * Dashboard Overview Component
 * Main overview charts and financial visualizations
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Skeleton } from '../ui/skeleton'
import dynamic from 'next/dynamic'

// Dynamically import charts to avoid SSR issues
const IncomeExpenseChart = dynamic(() => import('../charts/income-expense-chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

const ExpenseCategoryChart = dynamic(() => import('../charts/expense-category-chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

const TrendChart = dynamic(() => import('../charts/trend-chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

interface DashboardData {
  currentMonth: any
  trends: any
  insights: any
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  )
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard')
      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">{error || 'No data available'}</p>
            <p className="text-sm text-gray-500">
              Start by adding some income and expense entries to see your financial overview.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Visual analysis of your financial data and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <IncomeExpenseChart data={data.trends} />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <ExpenseCategoryChart />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <TrendChart data={data.trends} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
