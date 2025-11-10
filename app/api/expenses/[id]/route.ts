
/**
 * Individual Expense Entry API Routes
 * Handles operations on specific expense entries
 * Equivalent to /api/expenses/{id} endpoints in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { ExpenseService } from '../../../../lib/services/expense-service'

export const dynamic = 'force-dynamic'

/**
 * Delete a specific expense entry
 * DELETE /api/expenses/{id}
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await ExpenseService.deleteExpense(session.user.id, params.id)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`DELETE /api/expenses/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
