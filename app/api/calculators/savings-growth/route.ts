
/**
 * Savings Growth Calculator API Route
 * Provides savings growth calculations with monthly contributions
 * Equivalent to /api/calculators/savings-growth in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CalculatorService } from '../../../../lib/services/calculator-service'

export const dynamic = 'force-dynamic'

/**
 * Calculate savings growth with regular contributions
 * POST /api/calculators/savings-growth
 * Body: { initialAmount, monthlyContribution, annualRate, years }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await CalculatorService.calculateSavingsGrowth(body)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/calculators/savings-growth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
