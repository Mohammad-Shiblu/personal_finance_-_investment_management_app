
/**
 * CSV Import API Route
 * Handles CSV file upload and transaction import processing
 * Files are processed in-memory without external storage
 * Equivalent to /api/import/csv in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { CSVImportService } from '../../../../lib/services/csv-import-service'

export const dynamic = 'force-dynamic'

/**
 * Upload and process CSV file for transaction import
 * Processes CSV file in-memory and imports transactions to database
 * POST /api/import/csv
 * @param request - NextRequest containing FormData with 'file' and optional 'source'
 * @returns JSON response with import results including success/failure counts
 */
export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Extract file and source from form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const source = formData.get('source') as string || 'CSV Import'

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type is CSV
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV file' },
        { status: 400 }
      )
    }

    // Convert file to buffer and parse CSV content
    const buffer = Buffer.from(await file.arrayBuffer())
    const csvContent = buffer.toString('utf-8')
    
    // Parse CSV content into structured data
    const parseResult = await CSVImportService.parseCSVContent(csvContent)

    if (!parseResult.success || !parseResult.data?.rows) {
      return NextResponse.json(parseResult, { status: 400 })
    }

    // Import parsed transactions into database
    const importResult = await CSVImportService.importTransactions(
      session.user.id,
      parseResult.data.rows,
      source
    )

    if (!importResult.success) {
      return NextResponse.json(importResult, { status: 400 })
    }

    // Return success response with import statistics
    return NextResponse.json({
      success: true,
      data: {
        ...importResult.data,
        fileName: file.name,
        fileSize: file.size
      }
    })

  } catch (error) {
    console.error('POST /api/import/csv error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error during CSV import' },
      { status: 500 }
    )
  }
}
