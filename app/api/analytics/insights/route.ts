
/**
 * Spending Insights Analytics API Route
 * Provides spending patterns analysis and actionable insights
 * Equivalent to /api/analytics/insights in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { AnalyticsService } from '../../../../lib/services/analytics-service'

export const dynamic = 'force-dynamic'

/**
 * Get spending insights and patterns
 * GET /api/analytics/insights?months=6
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '6')

    const result = await AnalyticsService.getSpendingInsights(session.user.id, months)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/analytics/insights error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
