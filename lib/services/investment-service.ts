
/**
 * Investment Service Module
 * Handles all business logic related to investment portfolio management
 * Supports ETFs, crypto, stocks, and bonds with manual price tracking
 * Equivalent to a service layer in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { CreateInvestmentRequest, UpdateInvestmentRequest, InvestmentPortfolioSummary, ApiResponse } from '../types'
import { Decimal } from '@prisma/client/runtime/library'

export class InvestmentService {
  /**
   * Create a new investment entry for a user
   * @param userId - The user's unique identifier
   * @param data - Investment creation data
   * @returns Promise<ApiResponse> - API response with created investment or error
   */
  static async createInvestment(userId: string, data: CreateInvestmentRequest): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!data.name || !data.type || !data.quantity || !data.purchasePrice || !data.purchaseDate) {
        return {
          success: false,
          error: 'Name, type, quantity, purchase price, and purchase date are required fields'
        }
      }

      // Validate investment type
      const validTypes = ['ETF', 'Crypto', 'Stock', 'Bond']
      if (!validTypes.includes(data.type)) {
        return {
          success: false,
          error: 'Investment type must be one of: ETF, Crypto, Stock, Bond'
        }
      }

      // Validate quantity and prices are positive
      if (data.quantity <= 0 || data.purchasePrice <= 0) {
        return {
          success: false,
          error: 'Quantity and purchase price must be positive numbers'
        }
      }

      if (data.currentPrice !== undefined && data.currentPrice < 0) {
        return {
          success: false,
          error: 'Current price must be a positive number'
        }
      }

      // Create investment entry
      const investment = await prisma.investment.create({
        data: {
          name: data.name.trim(),
          type: data.type,
          symbol: data.symbol?.trim().toUpperCase() || null,
          quantity: new Decimal(data.quantity),
          purchasePrice: new Decimal(data.purchasePrice),
          purchaseDate: new Date(data.purchaseDate),
          currentPrice: data.currentPrice ? new Decimal(data.currentPrice) : null,
          lastPriceUpdate: data.currentPrice ? new Date() : null,
          notes: data.notes?.trim() || null,
          userId
        }
      })

      return {
        success: true,
        data: this.serializeInvestment(investment)
      }
    } catch (error) {
      console.error('Error creating investment:', error)
      return {
        success: false,
        error: 'Failed to create investment entry'
      }
    }
  }

  /**
   * Retrieve all investments for a user with optional filtering
   * @param userId - The user's unique identifier
   * @param type - Optional investment type filter
   * @returns Promise<ApiResponse> - API response with investments array or error
   */
  static async getUserInvestments(userId: string, type?: string): Promise<ApiResponse> {
    try {
      const whereClause: any = { userId }
      
      if (type) {
        whereClause.type = type
      }

      const investments = await prisma.investment.findMany({
        where: whereClause,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ]
      })

      const serializedInvestments = investments.map(investment => this.serializeInvestment(investment))

      return {
        success: true,
        data: serializedInvestments
      }
    } catch (error) {
      console.error('Error fetching user investments:', error)
      return {
        success: false,
        error: 'Failed to fetch investment data'
      }
    }
  }

  /**
   * Update an existing investment entry
   * @param userId - The user's unique identifier
   * @param data - Investment update data
   * @returns Promise<ApiResponse> - API response with updated investment or error
   */
  static async updateInvestment(userId: string, data: UpdateInvestmentRequest): Promise<ApiResponse> {
    try {
      // Verify investment exists and belongs to user
      const existingInvestment = await prisma.investment.findFirst({
        where: { id: data.id, userId }
      })

      if (!existingInvestment) {
        return {
          success: false,
          error: 'Investment entry not found'
        }
      }

      // Validate data if provided
      if (data.type && !['ETF', 'Crypto', 'Stock', 'Bond'].includes(data.type)) {
        return {
          success: false,
          error: 'Investment type must be one of: ETF, Crypto, Stock, Bond'
        }
      }

      if (data.quantity !== undefined && data.quantity <= 0) {
        return {
          success: false,
          error: 'Quantity must be a positive number'
        }
      }

      if (data.purchasePrice !== undefined && data.purchasePrice <= 0) {
        return {
          success: false,
          error: 'Purchase price must be a positive number'
        }
      }

      if (data.currentPrice !== undefined && data.currentPrice < 0) {
        return {
          success: false,
          error: 'Current price must be a positive number'
        }
      }

      // Prepare update data
      const updateData: any = {}
      if (data.name !== undefined) updateData.name = data.name.trim()
      if (data.type !== undefined) updateData.type = data.type
      if (data.symbol !== undefined) updateData.symbol = data.symbol?.trim().toUpperCase() || null
      if (data.quantity !== undefined) updateData.quantity = new Decimal(data.quantity)
      if (data.purchasePrice !== undefined) updateData.purchasePrice = new Decimal(data.purchasePrice)
      if (data.purchaseDate !== undefined) updateData.purchaseDate = new Date(data.purchaseDate)
      if (data.currentPrice !== undefined) {
        updateData.currentPrice = data.currentPrice ? new Decimal(data.currentPrice) : null
        updateData.lastPriceUpdate = data.currentPrice ? new Date() : null
      }
      if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null

      const updatedInvestment = await prisma.investment.update({
        where: { id: data.id },
        data: updateData
      })

      return {
        success: true,
        data: this.serializeInvestment(updatedInvestment)
      }
    } catch (error) {
      console.error('Error updating investment:', error)
      return {
        success: false,
        error: 'Failed to update investment entry'
      }
    }
  }

  /**
   * Delete an investment entry
   * @param userId - The user's unique identifier
   * @param investmentId - The investment entry's unique identifier
   * @returns Promise<ApiResponse> - API response with success status
   */
  static async deleteInvestment(userId: string, investmentId: string): Promise<ApiResponse> {
    try {
      // Verify investment exists and belongs to user
      const existingInvestment = await prisma.investment.findFirst({
        where: { id: investmentId, userId }
      })

      if (!existingInvestment) {
        return {
          success: false,
          error: 'Investment entry not found'
        }
      }

      await prisma.investment.delete({
        where: { id: investmentId }
      })

      return {
        success: true,
        data: { message: 'Investment entry deleted successfully' }
      }
    } catch (error) {
      console.error('Error deleting investment:', error)
      return {
        success: false,
        error: 'Failed to delete investment entry'
      }
    }
  }

  /**
   * Get comprehensive portfolio summary with performance analytics
   * @param userId - The user's unique identifier
   * @returns Promise<ApiResponse> - API response with portfolio summary
   */
  static async getPortfolioSummary(userId: string): Promise<ApiResponse> {
    try {
      const investments = await prisma.investment.findMany({
        where: { userId }
      })

      if (investments.length === 0) {
        return {
          success: true,
          data: {
            totalValue: 0,
            totalInvested: 0,
            totalGainLoss: 0,
            gainLossPercentage: 0,
            byType: [],
            investments: []
          }
        }
      }

      let totalInvested = 0
      let totalCurrentValue = 0
      const typeBreakdown: { [key: string]: { invested: number; currentValue: number; count: number } } = {}

      // Process each investment
      investments.forEach(investment => {
        const invested = investment.quantity.toNumber() * investment.purchasePrice.toNumber()
        const currentPrice = investment.currentPrice?.toNumber() || investment.purchasePrice.toNumber()
        const currentValue = investment.quantity.toNumber() * currentPrice

        totalInvested += invested
        totalCurrentValue += currentValue

        // Group by type
        if (!typeBreakdown[investment.type]) {
          typeBreakdown[investment.type] = { invested: 0, currentValue: 0, count: 0 }
        }
        typeBreakdown[investment.type].invested += invested
        typeBreakdown[investment.type].currentValue += currentValue
        typeBreakdown[investment.type].count += 1
      })

      const totalGainLoss = totalCurrentValue - totalInvested
      const gainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

      // Format type breakdown
      const byType = Object.entries(typeBreakdown).map(([type, data]) => ({
        type,
        totalValue: data.currentValue,
        totalInvested: data.invested,
        gainLoss: data.currentValue - data.invested,
        percentage: totalCurrentValue > 0 ? (data.currentValue / totalCurrentValue) * 100 : 0,
        count: data.count
      }))

      const portfolioSummary: InvestmentPortfolioSummary & { investments: any[] } = {
        totalValue: totalCurrentValue,
        totalInvested,
        totalGainLoss,
        gainLossPercentage,
        byType,
        investments: investments.map(investment => this.serializeInvestment(investment))
      }

      return {
        success: true,
        data: portfolioSummary
      }
    } catch (error) {
      console.error('Error generating portfolio summary:', error)
      return {
        success: false,
        error: 'Failed to generate portfolio summary'
      }
    }
  }

  /**
   * Update current prices for multiple investments
   * @param userId - The user's unique identifier
   * @param priceUpdates - Array of {id, currentPrice} objects
   * @returns Promise<ApiResponse> - API response with update results
   */
  static async updateInvestmentPrices(
    userId: string, 
    priceUpdates: Array<{ id: string; currentPrice: number }>
  ): Promise<ApiResponse> {
    try {
      const results = []
      const errors = []

      for (const update of priceUpdates) {
        try {
          // Verify investment exists and belongs to user
          const investment = await prisma.investment.findFirst({
            where: { id: update.id, userId }
          })

          if (!investment) {
            errors.push(`Investment with ID ${update.id} not found`)
            continue
          }

          if (update.currentPrice < 0) {
            errors.push(`Invalid price ${update.currentPrice} for investment ${investment.name}`)
            continue
          }

          // Update the investment
          const updatedInvestment = await prisma.investment.update({
            where: { id: update.id },
            data: {
              currentPrice: new Decimal(update.currentPrice),
              lastPriceUpdate: new Date()
            }
          })

          results.push(this.serializeInvestment(updatedInvestment))
        } catch (error) {
          errors.push(`Failed to update investment ${update.id}: ${error}`)
        }
      }

      return {
        success: true,
        data: {
          updated: results,
          errors: errors.length > 0 ? errors : undefined,
          summary: {
            totalRequested: priceUpdates.length,
            successful: results.length,
            failed: errors.length
          }
        }
      }
    } catch (error) {
      console.error('Error updating investment prices:', error)
      return {
        success: false,
        error: 'Failed to update investment prices'
      }
    }
  }

  /**
   * Helper method to serialize investment data (convert Decimal to number)
   * @param investment - Raw investment data from database
   * @returns Serialized investment object
   */
  private static serializeInvestment(investment: any) {
    const quantity = investment.quantity.toNumber()
    const purchasePrice = investment.purchasePrice.toNumber()
    const currentPrice = investment.currentPrice?.toNumber() || purchasePrice
    const totalInvested = quantity * purchasePrice
    const totalCurrentValue = quantity * currentPrice
    const gainLoss = totalCurrentValue - totalInvested
    const gainLossPercentage = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0

    return {
      ...investment,
      quantity,
      purchasePrice,
      currentPrice,
      // Calculated fields
      totalInvested,
      totalCurrentValue,
      gainLoss,
      gainLossPercentage
    }
  }
}
