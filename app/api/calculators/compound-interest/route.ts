
/**
 * Compound Interest Calculator API Route
 * Provides compound interest calculations with yearly breakdown
 * Equivalent to /api/calculators/compound-interest in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CalculatorService } from '../../../../lib/services/calculator-service'

export const dynamic = 'force-dynamic'

/**
 * Calculate compound interest
 * POST /api/calculators/compound-interest
 * Body: { principal, rate, time, frequency }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = await CalculatorService.calculateCompoundInterest(body)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/calculators/compound-interest error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
