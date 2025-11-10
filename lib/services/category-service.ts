
/**
 * Category Service Module
 * Handles all business logic related to expense category management
 * Equivalent to a service layer in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { CreateCategoryRequest, UpdateCategoryRequest, ApiResponse } from '../types'

export class CategoryService {
  /**
   * Default expense categories to seed for new users
   */
  static readonly DEFAULT_CATEGORIES = [
    { name: 'Food & Dining', description: 'Groceries, restaurants, and food delivery', color: '#FF6B6B', icon: 'UtensilsCrossed' },
    { name: 'Transportation', description: 'Gas, public transit, car maintenance', color: '#4ECDC4', icon: 'Car' },
    { name: 'Shopping', description: 'Clothes, electronics, and general purchases', color: '#45B7D1', icon: 'ShoppingBag' },
    { name: 'Entertainment', description: 'Movies, games, subscriptions', color: '#96CEB4', icon: 'Gamepad2' },
    { name: 'Bills & Utilities', description: 'Rent, electricity, internet, phone', color: '#FFEAA7', icon: 'Receipt' },
    { name: 'Healthcare', description: 'Medical expenses, insurance, pharmacy', color: '#DDA0DD', icon: 'Heart' },
    { name: 'Education', description: 'Courses, books, training', color: '#98D8C8', icon: 'GraduationCap' },
    { name: 'Travel', description: 'Flights, hotels, vacation expenses', color: '#F7DC6F', icon: 'Plane' },
    { name: 'Miscellaneous', description: 'Other expenses not categorized', color: '#AED6F1', icon: 'MoreHorizontal' }
  ]

  /**
   * Create default categories for a new user
   * @param userId - The user's unique identifier
   * @returns Promise<ApiResponse> - API response with created categories or error
   */
  static async createDefaultCategories(userId: string): Promise<ApiResponse> {
    try {
      const categories = await Promise.all(
        this.DEFAULT_CATEGORIES.map(categoryData => 
          prisma.category.create({
            data: {
              ...categoryData,
              isDefault: true,
              userId
            }
          })
        )
      )

      return {
        success: true,
        data: categories
      }
    } catch (error) {
      console.error('Error creating default categories:', error)
      return {
        success: false,
        error: 'Failed to create default categories'
      }
    }
  }

  /**
   * Create a new custom category for a user
   * @param userId - The user's unique identifier
   * @param data - Category creation data
   * @returns Promise<ApiResponse> - API response with created category or error
   */
  static async createCategory(userId: string, data: CreateCategoryRequest): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        return {
          success: false,
          error: 'Category name is required'
        }
      }

      // Check if category name already exists for this user
      const existingCategory = await prisma.category.findFirst({
        where: {
          userId,
          name: data.name.trim()
        }
      })

      if (existingCategory) {
        return {
          success: false,
          error: 'A category with this name already exists'
        }
      }

      // Create new category
      const category = await prisma.category.create({
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          color: data.color || null,
          icon: data.icon || null,
          isDefault: false, // Custom categories are never default
          userId
        }
      })

      return {
        success: true,
        data: category
      }
    } catch (error) {
      console.error('Error creating category:', error)
      return {
        success: false,
        error: 'Failed to create category'
      }
    }
  }

  /**
   * Retrieve all categories for a user
   * @param userId - The user's unique identifier
   * @param includeExpenseCount - Whether to include expense counts (default: false)
   * @returns Promise<ApiResponse> - API response with categories array or error
   */
  static async getUserCategories(userId: string, includeExpenseCount: boolean = false): Promise<ApiResponse> {
    try {
      const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: [
          { isDefault: 'desc' }, // Default categories first
          { name: 'asc' }
        ],
        include: includeExpenseCount ? {
          expenses: {
            select: { id: true } // Only select id to count
          }
        } : undefined
      })

      // Add expense count if requested
      const categoriesWithCounts = categories.map(category => ({
        ...category,
        expenseCount: includeExpenseCount ? (category as any).expenses?.length || 0 : undefined,
        expenses: undefined // Remove the expenses array from response
      }))

      return {
        success: true,
        data: categoriesWithCounts
      }
    } catch (error) {
      console.error('Error fetching user categories:', error)
      return {
        success: false,
        error: 'Failed to fetch categories'
      }
    }
  }

  /**
   * Update an existing category
   * @param userId - The user's unique identifier
   * @param data - Category update data
   * @returns Promise<ApiResponse> - API response with updated category or error
   */
  static async updateCategory(userId: string, data: UpdateCategoryRequest): Promise<ApiResponse> {
    try {
      // Verify category exists and belongs to user
      const existingCategory = await prisma.category.findFirst({
        where: { id: data.id, userId }
      })

      if (!existingCategory) {
        return {
          success: false,
          error: 'Category not found'
        }
      }

      // Check for duplicate names if name is being updated
      if (data.name && data.name.trim() !== existingCategory.name) {
        const duplicateCategory = await prisma.category.findFirst({
          where: {
            userId,
            name: data.name.trim(),
            id: { not: data.id } // Exclude current category from duplicate check
          }
        })

        if (duplicateCategory) {
          return {
            success: false,
            error: 'A category with this name already exists'
          }
        }
      }

      // Prepare update data
      const updateData: any = {}
      if (data.name !== undefined) updateData.name = data.name.trim()
      if (data.description !== undefined) updateData.description = data.description?.trim() || null
      if (data.color !== undefined) updateData.color = data.color || null
      if (data.icon !== undefined) updateData.icon = data.icon || null

      const updatedCategory = await prisma.category.update({
        where: { id: data.id },
        data: updateData
      })

      return {
        success: true,
        data: updatedCategory
      }
    } catch (error) {
      console.error('Error updating category:', error)
      return {
        success: false,
        error: 'Failed to update category'
      }
    }
  }

  /**
   * Delete a category (only if it has no associated expenses)
   * @param userId - The user's unique identifier
   * @param categoryId - The category's unique identifier
   * @returns Promise<ApiResponse> - API response with success status
   */
  static async deleteCategory(userId: string, categoryId: string): Promise<ApiResponse> {
    try {
      // Verify category exists and belongs to user
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
        include: {
          expenses: {
            select: { id: true }
          }
        }
      })

      if (!category) {
        return {
          success: false,
          error: 'Category not found'
        }
      }

      // Check if category has associated expenses
      if (category.expenses.length > 0) {
        return {
          success: false,
          error: `Cannot delete category with ${category.expenses.length} associated expense(s). Move or delete the expenses first.`
        }
      }

      // Prevent deletion of default categories
      if (category.isDefault) {
        return {
          success: false,
          error: 'Default categories cannot be deleted'
        }
      }

      await prisma.category.delete({
        where: { id: categoryId }
      })

      return {
        success: true,
        data: { message: 'Category deleted successfully' }
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      return {
        success: false,
        error: 'Failed to delete category'
      }
    }
  }

  /**
   * Get category with its expense statistics
   * @param userId - The user's unique identifier
   * @param categoryId - The category's unique identifier
   * @param months - Number of months to analyze (default: 12)
   * @returns Promise<ApiResponse> - API response with category details and stats
   */
  static async getCategoryWithStats(
    userId: string, 
    categoryId: string, 
    months: number = 12
  ): Promise<ApiResponse> {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
        include: {
          expenses: {
            where: {
              date: { gte: startDate }
            },
            orderBy: { date: 'desc' }
          }
        }
      })

      if (!category) {
        return {
          success: false,
          error: 'Category not found'
        }
      }

      // Calculate statistics
      const totalExpenses = category.expenses.reduce((sum, expense) => 
        sum + expense.amount.toNumber(), 0
      )

      const monthlyBreakdown: { [key: string]: number } = {}
      category.expenses.forEach(expense => {
        const monthKey = expense.date.toISOString().slice(0, 7)
        if (!monthlyBreakdown[monthKey]) monthlyBreakdown[monthKey] = 0
        monthlyBreakdown[monthKey] += expense.amount.toNumber()
      })

      const stats = {
        totalAmount: totalExpenses,
        expenseCount: category.expenses.length,
        averagePerExpense: category.expenses.length > 0 ? totalExpenses / category.expenses.length : 0,
        monthlyBreakdown: Object.entries(monthlyBreakdown).map(([month, amount]) => ({
          month,
          amount
        })).sort((a, b) => a.month.localeCompare(b.month))
      }

      return {
        success: true,
        data: {
          category: {
            ...category,
            expenses: category.expenses.map(expense => ({
              ...expense,
              amount: expense.amount.toNumber()
            }))
          },
          stats
        }
      }
    } catch (error) {
      console.error('Error fetching category with stats:', error)
      return {
        success: false,
        error: 'Failed to fetch category statistics'
      }
    }
  }
}
