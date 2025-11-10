
/**
 * Income Service Module
 * Handles all business logic related to income management
 * Equivalent to a service layer in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { CreateIncomeRequest, UpdateIncomeRequest, ApiResponse } from '../types'
import { Decimal } from '@prisma/client/runtime/library'

export class IncomeService {
  /**
   * Create a new income entry for a user
   * @param userId - The user's unique identifier
   * @param data - Income creation data
   * @returns Promise<ApiResponse> - API response with created income or error
   */
  static async createIncome(userId: string, data: CreateIncomeRequest): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!data.amount || !data.source || !data.date) {
        return {
          success: false,
          error: 'Amount, source, and date are required fields'
        }
      }

      // Create income entry
      const income = await prisma.income.create({
        data: {
          amount: new Decimal(data.amount),
          source: data.source,
          description: data.description || null,
          date: new Date(data.date),
          isRecurring: data.isRecurring || false,
          frequency: data.frequency || null,
          userId
        }
      })

      return {
        success: true,
        data: {
          ...income,
          amount: income.amount.toNumber()
        }
      }
    } catch (error) {
      console.error('Error creating income:', error)
      return {
        success: false,
        error: 'Failed to create income entry'
      }
    }
  }

  /**
   * Retrieve all income entries for a user with optional date filtering
   * @param userId - The user's unique identifier
   * @param startDate - Optional start date filter (ISO string)
   * @param endDate - Optional end date filter (ISO string)
   * @returns Promise<ApiResponse> - API response with income array or error
   */
  static async getUserIncomes(userId: string, startDate?: string, endDate?: string): Promise<ApiResponse> {
    try {
      const whereClause: any = { userId }

      // Add date filtering if provided
      if (startDate || endDate) {
        whereClause.date = {}
        if (startDate) whereClause.date.gte = new Date(startDate)
        if (endDate) whereClause.date.lte = new Date(endDate)
      }

      const incomes = await prisma.income.findMany({
        where: whereClause,
        orderBy: { date: 'desc' }
      })

      // Convert Decimal amounts to numbers for JSON serialization
      const serializedIncomes = incomes.map(income => ({
        ...income,
        amount: income.amount.toNumber()
      }))

      return {
        success: true,
        data: serializedIncomes
      }
    } catch (error) {
      console.error('Error fetching user incomes:', error)
      return {
        success: false,
        error: 'Failed to fetch income data'
      }
    }
  }

  /**
   * Update an existing income entry
   * @param userId - The user's unique identifier
   * @param data - Income update data
   * @returns Promise<ApiResponse> - API response with updated income or error
   */
  static async updateIncome(userId: string, data: UpdateIncomeRequest): Promise<ApiResponse> {
    try {
      // Verify income exists and belongs to user
      const existingIncome = await prisma.income.findFirst({
        where: { id: data.id, userId }
      })

      if (!existingIncome) {
        return {
          success: false,
          error: 'Income entry not found'
        }
      }

      // Prepare update data
      const updateData: any = {}
      if (data.amount !== undefined) updateData.amount = new Decimal(data.amount)
      if (data.source !== undefined) updateData.source = data.source
      if (data.description !== undefined) updateData.description = data.description
      if (data.date !== undefined) updateData.date = new Date(data.date)
      if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring
      if (data.frequency !== undefined) updateData.frequency = data.frequency

      const updatedIncome = await prisma.income.update({
        where: { id: data.id },
        data: updateData
      })

      return {
        success: true,
        data: {
          ...updatedIncome,
          amount: updatedIncome.amount.toNumber()
        }
      }
    } catch (error) {
      console.error('Error updating income:', error)
      return {
        success: false,
        error: 'Failed to update income entry'
      }
    }
  }

  /**
   * Delete an income entry
   * @param userId - The user's unique identifier
   * @param incomeId - The income entry's unique identifier
   * @returns Promise<ApiResponse> - API response with success status
   */
  static async deleteIncome(userId: string, incomeId: string): Promise<ApiResponse> {
    try {
      // Verify income exists and belongs to user
      const existingIncome = await prisma.income.findFirst({
        where: { id: incomeId, userId }
      })

      if (!existingIncome) {
        return {
          success: false,
          error: 'Income entry not found'
        }
      }

      await prisma.income.delete({
        where: { id: incomeId }
      })

      return {
        success: true,
        data: { message: 'Income entry deleted successfully' }
      }
    } catch (error) {
      console.error('Error deleting income:', error)
      return {
        success: false,
        error: 'Failed to delete income entry'
      }
    }
  }

  /**
   * Get monthly income summaries for analytics
   * @param userId - The user's unique identifier
   * @param months - Number of months to include (default: 12)
   * @returns Promise<ApiResponse> - API response with monthly summaries
   */
  static async getMonthlyIncomeSummary(userId: string, months: number = 12): Promise<ApiResponse> {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const incomes = await prisma.income.findMany({
        where: {
          userId,
          date: { gte: startDate }
        },
        orderBy: { date: 'asc' }
      })

      // Group by month and sum amounts
      const monthlyData: { [key: string]: number } = {}
      
      incomes.forEach(income => {
        const monthKey = income.date.toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData[monthKey]) monthlyData[monthKey] = 0
        monthlyData[monthKey] += income.amount.toNumber()
      })

      // Convert to array format for charts
      const monthlySummary = Object.entries(monthlyData).map(([month, total]) => ({
        month,
        total,
        count: incomes.filter(i => i.date.toISOString().slice(0, 7) === month).length
      }))

      return {
        success: true,
        data: monthlySummary
      }
    } catch (error) {
      console.error('Error generating monthly income summary:', error)
      return {
        success: false,
        error: 'Failed to generate income summary'
      }
    }
  }
}
