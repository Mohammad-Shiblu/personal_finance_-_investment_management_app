
/**
 * Individual Income Entry API Routes
 * Handles operations on specific income entries
 * Equivalent to /api/income/{id} endpoints in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { IncomeService } from '../../../../lib/services/income-service'

export const dynamic = 'force-dynamic'

/**
 * Delete a specific income entry
 * DELETE /api/income/{id}
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

    const result = await IncomeService.deleteIncome(session.user.id, params.id)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`DELETE /api/income/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
