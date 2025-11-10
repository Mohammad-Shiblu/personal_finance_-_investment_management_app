
/**
 * Loan Payment Calculator API Route
 * Provides loan payment calculations using amortization formula
 * Equivalent to /api/calculators/loan in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CalculatorService } from '../../../../lib/services/calculator-service'

export const dynamic = 'force-dynamic'

/**
 * Calculate loan payment
 * POST /api/calculators/loan
 * Body: { principal, annualRate, termYears }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { principal, annualRate, termYears } = body

    const result = await CalculatorService.calculateLoanPayment(principal, annualRate, termYears)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/calculators/loan error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
