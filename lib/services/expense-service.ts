
/**
 * Expense Service Module
 * Handles all business logic related to expense management and categorization
 * Equivalent to a service layer in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { CreateExpenseRequest, UpdateExpenseRequest, ApiResponse } from '../types'
import { Decimal } from '@prisma/client/runtime/library'

export class ExpenseService {
  /**
   * Create a new expense entry for a user
   * @param userId - The user's unique identifier
   * @param data - Expense creation data
   * @returns Promise<ApiResponse> - API response with created expense or error
   */
  static async createExpense(userId: string, data: CreateExpenseRequest): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!data.amount || !data.description || !data.date || !data.categoryId) {
        return {
          success: false,
          error: 'Amount, description, date, and category are required fields'
        }
      }

      // Verify category exists and belongs to user
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId }
      })

      if (!category) {
        return {
          success: false,
          error: 'Category not found or does not belong to user'
        }
      }

      // Create expense entry
      const expense = await prisma.expense.create({
        data: {
          amount: new Decimal(data.amount),
          description: data.description,
          date: new Date(data.date),
          categoryId: data.categoryId,
          userId
        },
        include: {
          category: true
        }
      })

      return {
        success: true,
        data: {
          ...expense,
          amount: expense.amount.toNumber()
        }
      }
    } catch (error) {
      console.error('Error creating expense:', error)
      return {
        success: false,
        error: 'Failed to create expense entry'
      }
    }
  }

  /**
   * Retrieve all expense entries for a user with optional filtering
   * @param userId - The user's unique identifier
   * @param startDate - Optional start date filter (ISO string)
   * @param endDate - Optional end date filter (ISO string)
   * @param categoryId - Optional category filter
   * @returns Promise<ApiResponse> - API response with expenses array or error
   */
  static async getUserExpenses(
    userId: string, 
    startDate?: string, 
    endDate?: string, 
    categoryId?: string
  ): Promise<ApiResponse> {
    try {
      const whereClause: any = { userId }

      // Add date filtering if provided
      if (startDate || endDate) {
        whereClause.date = {}
        if (startDate) whereClause.date.gte = new Date(startDate)
        if (endDate) whereClause.date.lte = new Date(endDate)
      }

      // Add category filtering if provided
      if (categoryId) {
        whereClause.categoryId = categoryId
      }

      const expenses = await prisma.expense.findMany({
        where: whereClause,
        include: {
          category: true
        },
        orderBy: { date: 'desc' }
      })

      // Convert Decimal amounts to numbers for JSON serialization
      const serializedExpenses = expenses.map(expense => ({
        ...expense,
        amount: expense.amount.toNumber()
      }))

      return {
        success: true,
        data: serializedExpenses
      }
    } catch (error) {
      console.error('Error fetching user expenses:', error)
      return {
        success: false,
        error: 'Failed to fetch expense data'
      }
    }
  }

  /**
   * Update an existing expense entry
   * @param userId - The user's unique identifier
   * @param data - Expense update data
   * @returns Promise<ApiResponse> - API response with updated expense or error
   */
  static async updateExpense(userId: string, data: UpdateExpenseRequest): Promise<ApiResponse> {
    try {
      // Verify expense exists and belongs to user
      const existingExpense = await prisma.expense.findFirst({
        where: { id: data.id, userId }
      })

      if (!existingExpense) {
        return {
          success: false,
          error: 'Expense entry not found'
        }
      }

      // If category is being changed, verify it exists and belongs to user
      if (data.categoryId) {
        const category = await prisma.category.findFirst({
          where: { id: data.categoryId, userId }
        })

        if (!category) {
          return {
            success: false,
            error: 'Category not found or does not belong to user'
          }
        }
      }

      // Prepare update data
      const updateData: any = {}
      if (data.amount !== undefined) updateData.amount = new Decimal(data.amount)
      if (data.description !== undefined) updateData.description = data.description
      if (data.date !== undefined) updateData.date = new Date(data.date)
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId

      const updatedExpense = await prisma.expense.update({
        where: { id: data.id },
        data: updateData,
        include: {
          category: true
        }
      })

      return {
        success: true,
        data: {
          ...updatedExpense,
          amount: updatedExpense.amount.toNumber()
        }
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      return {
        success: false,
        error: 'Failed to update expense entry'
      }
    }
  }

  /**
   * Delete an expense entry
   * @param userId - The user's unique identifier
   * @param expenseId - The expense entry's unique identifier
   * @returns Promise<ApiResponse> - API response with success status
   */
  static async deleteExpense(userId: string, expenseId: string): Promise<ApiResponse> {
    try {
      // Verify expense exists and belongs to user
      const existingExpense = await prisma.expense.findFirst({
        where: { id: expenseId, userId }
      })

      if (!existingExpense) {
        return {
          success: false,
          error: 'Expense entry not found'
        }
      }

      await prisma.expense.delete({
        where: { id: expenseId }
      })

      return {
        success: true,
        data: { message: 'Expense entry deleted successfully' }
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      return {
        success: false,
        error: 'Failed to delete expense entry'
      }
    }
  }

  /**
   * Get expense breakdown by category for analytics
   * @param userId - The user's unique identifier
   * @param startDate - Optional start date filter (ISO string)
   * @param endDate - Optional end date filter (ISO string)
   * @returns Promise<ApiResponse> - API response with category breakdown
   */
  static async getExpensesByCategory(
    userId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse> {
    try {
      const whereClause: any = { userId }

      if (startDate || endDate) {
        whereClause.date = {}
        if (startDate) whereClause.date.gte = new Date(startDate)
        if (endDate) whereClause.date.lte = new Date(endDate)
      }

      const expenses = await prisma.expense.findMany({
        where: whereClause,
        include: {
          category: true
        }
      })

      // Group expenses by category
      const categoryTotals: { [key: string]: { name: string; total: number; count: number; color?: string } } = {}

      expenses.forEach(expense => {
        const categoryId = expense.category.id
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = {
            name: expense.category.name,
            total: 0,
            count: 0,
            color: expense.category.color || undefined
          }
        }
        categoryTotals[categoryId].total += expense.amount.toNumber()
        categoryTotals[categoryId].count += 1
      })

      // Calculate total and percentages
      const totalExpenses = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.total, 0)
      
      const categoryBreakdown = Object.entries(categoryTotals).map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.total,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
        color: data.color
      })).sort((a, b) => b.amount - a.amount) // Sort by amount descending

      return {
        success: true,
        data: {
          totalExpenses,
          categoryBreakdown
        }
      }
    } catch (error) {
      console.error('Error generating expense category breakdown:', error)
      return {
        success: false,
        error: 'Failed to generate expense breakdown'
      }
    }
  }

  /**
   * Get monthly expense summaries for analytics
   * @param userId - The user's unique identifier
   * @param months - Number of months to include (default: 12)
   * @returns Promise<ApiResponse> - API response with monthly summaries
   */
  static async getMonthlyExpenseSummary(userId: string, months: number = 12): Promise<ApiResponse> {
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
        },
        orderBy: { date: 'asc' }
      })

      // Group by month
      const monthlyData: { [key: string]: number } = {}
      
      expenses.forEach(expense => {
        const monthKey = expense.date.toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData[monthKey]) monthlyData[monthKey] = 0
        monthlyData[monthKey] += expense.amount.toNumber()
      })

      // Convert to array format for charts
      const monthlySummary = Object.entries(monthlyData).map(([month, total]) => ({
        month,
        total,
        count: expenses.filter(e => e.date.toISOString().slice(0, 7) === month).length
      }))

      return {
        success: true,
        data: monthlySummary
      }
    } catch (error) {
      console.error('Error generating monthly expense summary:', error)
      return {
        success: false,
        error: 'Failed to generate expense summary'
      }
    }
  }
}
