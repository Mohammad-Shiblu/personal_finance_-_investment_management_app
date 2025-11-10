
/**
 * Investment Price Update API Route
 * Handles bulk price updates for investments
 * Equivalent to /api/investments/prices in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { InvestmentService } from '../../../../lib/services/investment-service'

export const dynamic = 'force-dynamic'

/**
 * Update current prices for multiple investments
 * PUT /api/investments/prices
 * Body: { updates: [{ id: string, currentPrice: number }] }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    const result = await InvestmentService.updateInvestmentPrices(session.user.id, updates)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('PUT /api/investments/prices error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
