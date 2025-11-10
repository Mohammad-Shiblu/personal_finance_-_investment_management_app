
/**
 * Financial Dashboard Analytics API Route
 * Provides comprehensive dashboard data with summaries and insights
 * Equivalent to /api/analytics/dashboard in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { AnalyticsService } from '../../../../lib/services/analytics-service'

export const dynamic = 'force-dynamic'

/**
 * Get comprehensive dashboard data
 * GET /api/analytics/dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await AnalyticsService.getDashboardData(session.user.id)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/analytics/dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
