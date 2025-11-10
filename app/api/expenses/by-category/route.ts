
/**
 * Expense Category Analysis API Route
 * Provides expense breakdown by category for analytics
 * Equivalent to /api/expenses/by-category in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { ExpenseService } from '../../../../lib/services/expense-service'

export const dynamic = 'force-dynamic'

/**
 * Get expense breakdown by category
 * GET /api/expenses/by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const result = await ExpenseService.getExpensesByCategory(
      session.user.id, 
      startDate, 
      endDate
    )
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/expenses/by-category error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
