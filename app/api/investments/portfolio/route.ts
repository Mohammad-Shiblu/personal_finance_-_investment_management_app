
/**
 * Investment Portfolio Summary API Route
 * Provides comprehensive portfolio analytics and performance metrics
 * Equivalent to /api/investments/portfolio in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { InvestmentService } from '../../../../lib/services/investment-service'

export const dynamic = 'force-dynamic'

/**
 * Get comprehensive portfolio summary
 * GET /api/investments/portfolio
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await InvestmentService.getPortfolioSummary(session.user.id)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/investments/portfolio error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
