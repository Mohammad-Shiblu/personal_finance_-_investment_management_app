
/**
 * Analytics Service Module
 * Handles data analysis, trend forecasting, and financial insights generation
 * Equivalent to an analytics/reporting service in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { MonthlyFinancialSummary, TrendAnalysis, ApiResponse } from '../types'

export class AnalyticsService {
  /**
   * Generate comprehensive financial summary for a specific month
   * @param userId - The user's unique identifier
   * @param year - Year for the summary (YYYY format)
   * @param month - Month for the summary (1-12)
   * @returns Promise<ApiResponse> - API response with monthly summary
   */
  static async getMonthlyFinancialSummary(
    userId: string, 
    year: number, 
    month: number
  ): Promise<ApiResponse> {
    try {
      // Validate month and year
      if (month < 1 || month > 12 || year < 1900 || year > 2100) {
        return {
          success: false,
          error: 'Invalid month or year parameters'
        }
      }

      const startDate = new Date(year, month - 1, 1) // Start of month
      const endDate = new Date(year, month, 0, 23, 59, 59) // End of month

      // Fetch income data for the month
      const monthlyIncomes = await prisma.income.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      // Fetch expense data for the month with categories
      const monthlyExpenses = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          category: true
        }
      })

      // Calculate totals
      const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount.toNumber(), 0)
      const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount.toNumber(), 0)
      const netSavings = totalIncome - totalExpenses

      // Group expenses by category
      const categoryTotals: { [key: string]: { name: string; amount: number } } = {}
      
      monthlyExpenses.forEach(expense => {
        const categoryName = expense.category.name
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = { name: categoryName, amount: 0 }
        }
        categoryTotals[categoryName].amount += expense.amount.toNumber()
      })

      // Calculate percentages and sort by amount
      const expensesByCategory = Object.values(categoryTotals)
        .map(category => ({
          categoryName: category.name,
          amount: Math.round(category.amount * 100) / 100,
          percentage: totalExpenses > 0 ? Math.round((category.amount / totalExpenses) * 10000) / 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)

      const monthString = `${year}-${month.toString().padStart(2, '0')}`
      
      const summary: MonthlyFinancialSummary = {
        month: monthString,
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netSavings: Math.round(netSavings * 100) / 100,
        expensesByCategory
      }

      return {
        success: true,
        data: summary
      }
    } catch (error) {
      console.error('Error generating monthly financial summary:', error)
      return {
        success: false,
        error: 'Failed to generate monthly financial summary'
      }
    }
  }

  /**
   * Generate trend analysis and forecasts based on historical data
   * @param userId - The user's unique identifier
   * @param months - Number of months of historical data to analyze (default: 12)
   * @returns Promise<ApiResponse> - API response with trend analysis
   */
  static async getTrendAnalysis(userId: string, months: number = 12): Promise<ApiResponse> {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      // Fetch historical income and expense data
      const [incomes, expenses] = await Promise.all([
        prisma.income.findMany({
          where: {
            userId,
            date: { gte: startDate }
          },
          orderBy: { date: 'asc' }
        }),
        prisma.expense.findMany({
          where: {
            userId,
            date: { gte: startDate }
          },
          orderBy: { date: 'asc' }
        })
      ])

      // Group data by month
      const monthlyData: { [key: string]: { income: number; expenses: number } } = {}

      // Process income data
      incomes.forEach(income => {
        const monthKey = income.date.toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0 }
        }
        monthlyData[monthKey].income += income.amount.toNumber()
      })

      // Process expense data
      expenses.forEach(expense => {
        const monthKey = expense.date.toISOString().slice(0, 7)
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0 }
        }
        monthlyData[monthKey].expenses += expense.amount.toNumber()
      })

      // Create trend arrays
      const incomeTrend = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          date,
          amount: Math.round(data.income * 100) / 100
        }))

      const expensesTrend = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          date,
          amount: Math.round(data.expenses * 100) / 100
        }))

      // Calculate average savings rate
      const totalIncome = incomeTrend.reduce((sum, month) => sum + month.amount, 0)
      const totalExpenses = expensesTrend.reduce((sum, month) => sum + month.amount, 0)
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

      // Generate simple forecasts using linear regression
      const projectedSavings = this.generateSavingsProjections(monthlyData, 6) // Project 6 months ahead

      const trendAnalysis: TrendAnalysis = {
        incometrend: incomeTrend,
        expensesTrend,
        savingsRate: Math.round(savingsRate * 100) / 100,
        projectedSavings
      }

      return {
        success: true,
        data: trendAnalysis
      }
    } catch (error) {
      console.error('Error generating trend analysis:', error)
      return {
        success: false,
        error: 'Failed to generate trend analysis'
      }
    }
  }

  /**
   * Get spending patterns and insights
   * @param userId - The user's unique identifier
   * @param months - Number of months to analyze (default: 6)
   * @returns Promise<ApiResponse> - API response with spending insights
   */
  static async getSpendingInsights(userId: string, months: number = 6): Promise<ApiResponse> {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          date: { gte: startDate }
        },
        include: {
          category: true
        }
      })

      if (expenses.length === 0) {
        return {
          success: true,
          data: {
            insights: ['No expense data available for analysis'],
            totalExpenses: 0,
            averageMonthlySpending: 0,
            topCategories: [],
            spendingTrends: []
          }
        }
      }

      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount.toNumber(), 0)
      const averageMonthlySpending = totalExpenses / months

      // Category analysis
      const categoryTotals: { [key: string]: { amount: number; count: number; name: string } } = {}
      expenses.forEach(expense => {
        const categoryName = expense.category.name
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = { amount: 0, count: 0, name: categoryName }
        }
        categoryTotals[categoryName].amount += expense.amount.toNumber()
        categoryTotals[categoryName].count += 1
      })

      const topCategories = Object.entries(categoryTotals)
        .map(([_, data]) => ({
          category: data.name,
          amount: Math.round(data.amount * 100) / 100,
          count: data.count,
          percentage: Math.round((data.amount / totalExpenses) * 10000) / 100
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      // Generate insights based on spending patterns
      const insights = this.generateSpendingInsights(topCategories, averageMonthlySpending, expenses)

      // Monthly spending trend
      const monthlySpending: { [key: string]: number } = {}
      expenses.forEach(expense => {
        const monthKey = expense.date.toISOString().slice(0, 7)
        if (!monthlySpending[monthKey]) monthlySpending[monthKey] = 0
        monthlySpending[monthKey] += expense.amount.toNumber()
      })

      const spendingTrends = Object.entries(monthlySpending)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({
          month,
          amount: Math.round(amount * 100) / 100
        }))

      return {
        success: true,
        data: {
          insights,
          totalExpenses: Math.round(totalExpenses * 100) / 100,
          averageMonthlySpending: Math.round(averageMonthlySpending * 100) / 100,
          topCategories,
          spendingTrends
        }
      }
    } catch (error) {
      console.error('Error generating spending insights:', error)
      return {
        success: false,
        error: 'Failed to generate spending insights'
      }
    }
  }

  /**
   * Get comprehensive financial dashboard data
   * @param userId - The user's unique identifier
   * @returns Promise<ApiResponse> - API response with dashboard data
   */
  static async getDashboardData(userId: string): Promise<ApiResponse> {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      
      // Get current month summary
      const currentMonthSummary = await this.getMonthlyFinancialSummary(userId, currentYear, currentMonth)
      
      // Get trend analysis for the past 12 months
      const trendAnalysis = await this.getTrendAnalysis(userId, 12)
      
      // Get spending insights for the past 6 months
      const spendingInsights = await this.getSpendingInsights(userId, 6)

      // Get basic stats
      const [totalIncomeResult, totalExpensesResult, categoryCount, investmentCount] = await Promise.all([
        prisma.income.aggregate({
          where: { userId },
          _sum: { amount: true }
        }),
        prisma.expense.aggregate({
          where: { userId },
          _sum: { amount: true }
        }),
        prisma.category.count({
          where: { userId }
        }),
        prisma.investment.count({
          where: { userId }
        })
      ])

      const dashboardData = {
        currentMonth: currentMonthSummary.success ? currentMonthSummary.data : null,
        trends: trendAnalysis.success ? trendAnalysis.data : null,
        insights: spendingInsights.success ? spendingInsights.data : null,
        totals: {
          totalIncome: totalIncomeResult._sum.amount?.toNumber() || 0,
          totalExpenses: totalExpensesResult._sum.amount?.toNumber() || 0,
          categoryCount,
          investmentCount
        },
        generated: now.toISOString()
      }

      return {
        success: true,
        data: dashboardData
      }
    } catch (error) {
      console.error('Error generating dashboard data:', error)
      return {
        success: false,
        error: 'Failed to generate dashboard data'
      }
    }
  }

  /**
   * Generate savings projections using simple linear trend analysis
   * @param monthlyData - Historical monthly income/expense data
   * @param projectMonths - Number of months to project forward
   * @returns Array of projected savings data
   */
  private static generateSavingsProjections(
    monthlyData: { [key: string]: { income: number; expenses: number } },
    projectMonths: number
  ) {
    const sortedMonths = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b))
    
    if (sortedMonths.length < 2) {
      return [] // Not enough data for projection
    }

    // Calculate average monthly savings for recent months
    const recentMonths = sortedMonths.slice(-3) // Use last 3 months
    const averageMonthlySavings = recentMonths.reduce((sum, [_, data]) => 
      sum + (data.income - data.expenses), 0
    ) / recentMonths.length

    // Generate projections
    const projections = []
    const lastMonth = sortedMonths[sortedMonths.length - 1][0]
    const baseDate = new Date(lastMonth + '-01')

    for (let i = 1; i <= projectMonths; i++) {
      const projectedDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1)
      const projectedDateString = projectedDate.toISOString().slice(0, 7)
      
      projections.push({
        date: projectedDateString,
        projected: Math.round(averageMonthlySavings * 100) / 100
      })
    }

    return projections
  }

  /**
   * Generate actionable spending insights based on expense data
   * @param topCategories - Top spending categories
   * @param averageMonthlySpending - Average monthly spending amount
   * @param expenses - All expense records
   * @returns Array of insight strings
   */
  private static generateSpendingInsights(
    topCategories: any[],
    averageMonthlySpending: number,
    expenses: any[]
  ): string[] {
    const insights = []

    // Top category insight
    if (topCategories.length > 0) {
      const topCategory = topCategories[0]
      if (topCategory.percentage > 30) {
        insights.push(`${topCategory.category} accounts for ${topCategory.percentage}% of your spending. Consider reviewing this category for potential savings.`)
      } else {
        insights.push(`Your spending is well-distributed, with ${topCategory.category} being your top category at ${topCategory.percentage}%.`)
      }
    }

    // Spending frequency insight
    const totalTransactions = expenses.length
    if (totalTransactions > 0) {
      const avgTransactionAmount = (expenses.reduce((sum, e) => sum + e.amount.toNumber(), 0)) / totalTransactions
      if (avgTransactionAmount < 20) {
        insights.push(`You make frequent small purchases (average $${Math.round(avgTransactionAmount)}). Consider bundling purchases to reduce transaction frequency.`)
      } else if (avgTransactionAmount > 200) {
        insights.push(`Your average transaction is $${Math.round(avgTransactionAmount)}, indicating larger, less frequent purchases.`)
      }
    }

    // Monthly spending insight
    if (averageMonthlySpending > 0) {
      insights.push(`Your average monthly spending is $${Math.round(averageMonthlySpending)}. Track this against your income to maintain a healthy savings rate.`)
    }

    return insights
  }
}
