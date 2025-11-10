
/**
 * Retirement Planning Calculator API Route
 * Provides retirement needs calculations using the 4% rule
 * Equivalent to /api/calculators/retirement in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CalculatorService } from '../../../../lib/services/calculator-service'

export const dynamic = 'force-dynamic'

/**
 * Calculate retirement savings needs
 * POST /api/calculators/retirement
 * Body: { desiredMonthlyIncome, currentAge, retirementAge, currentSavings?, expectedReturn? }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { desiredMonthlyIncome, currentAge, retirementAge, currentSavings = 0, expectedReturn = 7 } = body

    const result = await CalculatorService.calculateRetirementNeeds(
      desiredMonthlyIncome,
      currentAge,
      retirementAge,
      currentSavings,
      expectedReturn
    )
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/calculators/retirement error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
