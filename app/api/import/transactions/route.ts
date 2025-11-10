
/**
 * Transaction Import Management API Route
 * Handles imported transaction review and processing
 * Equivalent to /api/import/transactions in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CSVImportService } from '../../../../lib/services/csv-import-service'

export const dynamic = 'force-dynamic'

/**
 * Get unprocessed imported transactions for review
 * GET /api/import/transactions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await CSVImportService.getUnprocessedTransactions(session.user.id)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/import/transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Process imported transactions into income/expense records
 * POST /api/import/transactions
 * Body: { transactionIds: string[], categoryMappings?: { [transactionId: string]: string } }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { transactionIds, categoryMappings } = body

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction IDs array is required' },
        { status: 400 }
      )
    }

    const result = await CSVImportService.processTransactions(
      session.user.id,
      transactionIds,
      categoryMappings
    )
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/import/transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Delete imported transactions
 * DELETE /api/import/transactions
 * Body: { transactionIds: string[] }
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { transactionIds } = body

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction IDs array is required' },
        { status: 400 }
      )
    }

    const result = await CSVImportService.deleteImportedTransactions(session.user.id, transactionIds)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE /api/import/transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
