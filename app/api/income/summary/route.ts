
/**
 * Income Summary and Analytics API Route
 * Provides aggregated income data for analytics
 * Equivalent to /api/income/summary in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { IncomeService } from '../../../../lib/services/income-service'

export const dynamic = 'force-dynamic'

/**
 * Get monthly income summary for analytics
 * GET /api/income/summary?months=12
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')

    const result = await IncomeService.getMonthlyIncomeSummary(session.user.id, months)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/income/summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
