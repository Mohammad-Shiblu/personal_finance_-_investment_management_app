'use client'

/**
 * Financial Analytics Page
 * Provides comprehensive financial insights, trends, and spending analysis
 * Features: Monthly summaries, trend analysis, spending insights, visual charts
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { useToast } from '../../../hooks/use-toast'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Lightbulb } from 'lucide-react'

// Type definitions
interface MonthlyData {
  month: string
  totalIncome: number
  totalExpenses: number
  netSavings: number
  expensesByCategory: Array<{
    categoryName: string
    amount: number
    percentage: number
  }>
}

interface TrendData {
  incometrend: Array<{ date: string; amount: number }>
  expensesTrend: Array<{ date: string; amount: number }>
  savingsRate: number
  projectedSavings: Array<{ date: string; projected: number }>
}

interface InsightsData {
  insights: string[]
  totalExpenses: number
  averageMonthlySpending: number
  topCategories: Array<{
    category: string
    amount: number
    count: number
    percentage: number
  }>
  spendingTrends: Array<{ month: string; amount: number }>
}

export default function AnalyticsPage() {
  // State management
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null)
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null)
  const { toast } = useToast()

  /**
   * Load all analytics data on component mount
   */
  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  /**
   * Fetch comprehensive analytics data from API
   * Loads monthly summary, trends, and spending insights
   */
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard data which includes all analytics
      const response = await fetch('/api/analytics/dashboard')
      const result = await response.json()

      if (result.success) {
        setMonthlyData(result.data.currentMonth)
        setTrendData(result.data.trends)
        setInsightsData(result.data.insights)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to load analytics data',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Format currency values for display
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  /**
   * Format month string for display
   */
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">Insights and trends</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">Comprehensive insights into your financial health</p>
      </div>

      {/* Current Month Summary */}
      {monthlyData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyData.totalIncome)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {formatMonth(monthlyData.month)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(monthlyData.totalExpenses)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {formatMonth(monthlyData.month)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                <DollarSign className={`h-4 w-4 ${monthlyData.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${monthlyData.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyData.netSavings)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {monthlyData.netSavings >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expenses by Category */}
          {monthlyData.expensesByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Expenses by Category
                </CardTitle>
                <CardDescription>
                  Breakdown of your spending for {formatMonth(monthlyData.month)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.expensesByCategory.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.categoryName}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Trend Analysis */}
      {trendData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Income Trend
              </CardTitle>
              <CardDescription>Last 12 months income history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendData.incometrend.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatMonth(item.date)}</span>
                    <span className="font-medium text-green-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Expense Trend
              </CardTitle>
              <CardDescription>Last 12 months expense history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendData.expensesTrend.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatMonth(item.date)}</span>
                    <span className="font-medium text-red-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Savings Rate */}
      {trendData && (
        <Card>
          <CardHeader>
            <CardTitle>Savings Rate</CardTitle>
            <CardDescription>Percentage of income saved over the analyzed period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={`text-4xl font-bold ${trendData.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trendData.savingsRate.toFixed(1)}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${trendData.savingsRate >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                    style={{ width: `${Math.min(Math.abs(trendData.savingsRate), 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {trendData.savingsRate >= 20 
                    ? 'Excellent savings rate! Keep it up.' 
                    : trendData.savingsRate >= 10 
                    ? 'Good savings rate. Consider increasing if possible.' 
                    : trendData.savingsRate >= 0
                    ? 'Low savings rate. Try to reduce expenses or increase income.'
                    : 'Negative savings rate. You are spending more than you earn.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Insights */}
      {insightsData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Spending Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insightsData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Spending Categories */}
          {insightsData.topCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Your highest expense categories over the analyzed period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-xs text-gray-600">{category.count} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(category.amount)}</p>
                        <p className="text-xs text-gray-600">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spending Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Summary</CardTitle>
              <CardDescription>Overview of your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses (Analyzed Period)</p>
                  <p className="text-2xl font-bold">{formatCurrency(insightsData.totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Monthly Spending</p>
                  <p className="text-2xl font-bold">{formatCurrency(insightsData.averageMonthlySpending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Data Message */}
      {!monthlyData && !trendData && !insightsData && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Analytics Data Available</h3>
              <p className="mt-2 text-sm text-gray-600">
                Start adding income and expenses to see your financial analytics and insights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
