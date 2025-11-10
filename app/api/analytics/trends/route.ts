
/**
 * Financial Trends Analysis API Route
 * Provides trend analysis and forecasting based on historical data
 * Equivalent to /api/analytics/trends in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { AnalyticsService } from '../../../../lib/services/analytics-service'

export const dynamic = 'force-dynamic'

/**
 * Get trend analysis and forecasts
 * GET /api/analytics/trends?months=12
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')

    const result = await AnalyticsService.getTrendAnalysis(session.user.id, months)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/analytics/trends error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
