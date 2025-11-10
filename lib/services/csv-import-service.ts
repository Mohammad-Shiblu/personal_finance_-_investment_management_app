
/**
 * CSV Import Service Module
 * Handles importing financial transactions from CSV files
 * Equivalent to a file processing service in Flask/FastAPI architecture
 */

import { prisma } from '../db'
import { CSVImportRow, CSVImportResult, ApiResponse } from '../types'
import { Decimal } from '@prisma/client/runtime/library'

export class CSVImportService {
  /**
   * Process and import transactions from CSV data
   * @param userId - The user's unique identifier
   * @param csvData - Array of parsed CSV rows
   * @param source - Source identifier (filename or description)
   * @returns Promise<ApiResponse> - Import results with success/error counts
   */
  static async importTransactions(
    userId: string, 
    csvData: CSVImportRow[], 
    source: string
  ): Promise<ApiResponse> {
    try {
      if (!csvData || csvData.length === 0) {
        return {
          success: false,
          error: 'No data provided for import'
        }
      }

      const results: CSVImportResult = {
        successful: 0,
        failed: 0,
        errors: [],
        preview: []
      }

      // Validate and import each row
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i]
        const rowNumber = i + 1

        try {
          // Validate row data
          const validation = this.validateCSVRow(row)
          if (!validation.valid) {
            results.failed++
            results.errors.push({
              row: rowNumber,
              error: validation.error || 'Invalid row data'
            })
            continue
          }

          // Import the transaction
          await prisma.transaction.create({
            data: {
              type: row.type,
              amount: new Decimal(row.amount),
              description: row.description.trim(),
              date: new Date(row.date),
              category: row.category?.trim() || null,
              source: source.trim(),
              imported: true,
              processed: false, // Will be processed later by user
              userId
            }
          })

          results.successful++

          // Add to preview (first 10 successful imports)
          if (results.preview.length < 10) {
            results.preview.push(row)
          }

        } catch (error) {
          results.failed++
          results.errors.push({
            row: rowNumber,
            error: `Failed to import: ${error}`
          })
        }
      }

      return {
        success: true,
        data: results
      }
    } catch (error) {
      console.error('Error importing CSV transactions:', error)
      return {
        success: false,
        error: 'Failed to import CSV data'
      }
    }
  }

  /**
   * Parse CSV content into structured data
   * Supports common CSV formats from banks and financial institutions
   * @param csvContent - Raw CSV file content as string
   * @returns Promise<ApiResponse> - Parsed CSV data or error
   */
  static async parseCSVContent(csvContent: string): Promise<ApiResponse> {
    try {
      if (!csvContent.trim()) {
        return {
          success: false,
          error: 'Empty CSV file'
        }
      }

      const lines = csvContent.trim().split('\n')
      if (lines.length < 2) { // Need header + at least one data row
        return {
          success: false,
          error: 'CSV file must have a header row and at least one data row'
        }
      }

      // Parse header to determine column mapping
      const header = this.parseCSVLine(lines[0])
      const columnMapping = this.detectColumnMapping(header)

      if (!columnMapping.valid) {
        return {
          success: false,
          error: columnMapping.error || 'Unable to detect required columns in CSV'
        }
      }

      // Parse data rows
      const parsedRows: CSVImportRow[] = []
      const parseErrors: string[] = []

      for (let i = 1; i < lines.length; i++) {
        try {
          const line = lines[i].trim()
          if (!line) continue // Skip empty lines

          const values = this.parseCSVLine(line)
          const row = this.mapCSVRow(values, columnMapping.mapping!)

          if (row) {
            parsedRows.push(row)
          }
        } catch (error) {
          parseErrors.push(`Line ${i + 1}: ${error}`)
        }
      }

      if (parsedRows.length === 0) {
        return {
          success: false,
          error: 'No valid data rows found in CSV'
        }
      }

      return {
        success: true,
        data: {
          rows: parsedRows,
          totalRows: parsedRows.length,
          parseErrors: parseErrors.length > 0 ? parseErrors : undefined
        }
      }
    } catch (error) {
      console.error('Error parsing CSV content:', error)
      return {
        success: false,
        error: 'Failed to parse CSV content'
      }
    }
  }

  /**
   * Get unprocessed imported transactions for user review
   * @param userId - The user's unique identifier
   * @returns Promise<ApiResponse> - Unprocessed transactions
   */
  static async getUnprocessedTransactions(userId: string): Promise<ApiResponse> {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          imported: true,
          processed: false
        },
        orderBy: { createdAt: 'desc' }
      })

      const serializedTransactions = transactions.map(transaction => ({
        ...transaction,
        amount: transaction.amount.toNumber()
      }))

      return {
        success: true,
        data: serializedTransactions
      }
    } catch (error) {
      console.error('Error fetching unprocessed transactions:', error)
      return {
        success: false,
        error: 'Failed to fetch unprocessed transactions'
      }
    }
  }

  /**
   * Convert imported transactions to income/expense records
   * @param userId - The user's unique identifier
   * @param transactionIds - Array of transaction IDs to process
   * @param categoryMappings - Optional category mappings for expenses
   * @returns Promise<ApiResponse> - Processing results
   */
  static async processTransactions(
    userId: string, 
    transactionIds: string[], 
    categoryMappings?: { [transactionId: string]: string }
  ): Promise<ApiResponse> {
    try {
      const results = {
        incomeCreated: 0,
        expensesCreated: 0,
        errors: [] as string[]
      }

      // Get user's categories for validation
      const userCategories = await prisma.category.findMany({
        where: { userId }
      })

      if (userCategories.length === 0) {
        return {
          success: false,
          error: 'No categories found. Please create categories before processing transactions.'
        }
      }

      for (const transactionId of transactionIds) {
        try {
          const transaction = await prisma.transaction.findFirst({
            where: { id: transactionId, userId, processed: false }
          })

          if (!transaction) {
            results.errors.push(`Transaction ${transactionId} not found or already processed`)
            continue
          }

          if (transaction.type === 'income') {
            // Create income record
            await prisma.income.create({
              data: {
                amount: transaction.amount,
                source: transaction.category || 'Imported',
                description: transaction.description,
                date: transaction.date,
                userId
              }
            })
            results.incomeCreated++
          } else if (transaction.type === 'expense') {
            // Find appropriate category
            let categoryId = categoryMappings?.[transactionId]
            
            if (!categoryId) {
              // Try to match by category name from CSV
              const matchingCategory = userCategories.find(cat => 
                cat.name.toLowerCase() === transaction.category?.toLowerCase()
              )
              categoryId = matchingCategory?.id
            }

            // Use first category as default if no match found
            if (!categoryId) {
              categoryId = userCategories[0].id
            }

            // Create expense record
            await prisma.expense.create({
              data: {
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date,
                categoryId,
                userId
              }
            })
            results.expensesCreated++
          }

          // Mark transaction as processed
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { processed: true }
          })

        } catch (error) {
          results.errors.push(`Failed to process transaction ${transactionId}: ${error}`)
        }
      }

      return {
        success: true,
        data: results
      }
    } catch (error) {
      console.error('Error processing transactions:', error)
      return {
        success: false,
        error: 'Failed to process transactions'
      }
    }
  }

  /**
   * Delete imported transactions (before processing)
   * @param userId - The user's unique identifier
   * @param transactionIds - Array of transaction IDs to delete
   * @returns Promise<ApiResponse> - Deletion results
   */
  static async deleteImportedTransactions(userId: string, transactionIds: string[]): Promise<ApiResponse> {
    try {
      const deleteResult = await prisma.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId,
          processed: false // Only allow deletion of unprocessed transactions
        }
      })

      return {
        success: true,
        data: {
          deleted: deleteResult.count,
          message: `Deleted ${deleteResult.count} imported transactions`
        }
      }
    } catch (error) {
      console.error('Error deleting imported transactions:', error)
      return {
        success: false,
        error: 'Failed to delete imported transactions'
      }
    }
  }

  /**
   * Validate a single CSV row
   * @param row - CSV row data
   * @returns Validation result
   */
  private static validateCSVRow(row: CSVImportRow): { valid: boolean; error?: string } {
    if (!row.date || !row.description || !row.amount || !row.type) {
      return { valid: false, error: 'Missing required fields: date, description, amount, or type' }
    }

    // Validate date format
    const dateObj = new Date(row.date)
    if (isNaN(dateObj.getTime())) {
      return { valid: false, error: 'Invalid date format' }
    }

    // Validate amount
    if (typeof row.amount !== 'number' || row.amount <= 0) {
      return { valid: false, error: 'Amount must be a positive number' }
    }

    // Validate type
    if (!['income', 'expense'].includes(row.type)) {
      return { valid: false, error: 'Type must be either "income" or "expense"' }
    }

    return { valid: true }
  }

  /**
   * Parse a CSV line handling quoted values
   * @param line - CSV line string
   * @returns Array of values
   */
  private static parseCSVLine(line: string): string[] {
    const values = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim()) // Add the last value
    return values
  }

  /**
   * Detect column mapping from CSV header
   * @param header - Array of header column names
   * @returns Column mapping configuration
   */
  private static detectColumnMapping(header: string[]): { valid: boolean; mapping?: any; error?: string } {
    const mapping: any = {}
    
    // Common column name variations
    const patterns = {
      date: /^(date|transaction\s?date|posted\s?date)$/i,
      description: /^(description|memo|transaction|details?)$/i,
      amount: /^(amount|value|sum|total)$/i,
      type: /^(type|transaction\s?type|debit\/credit)$/i,
      category: /^(category|merchant|vendor)$/i
    }

    // Find matching columns
    for (let i = 0; i < header.length; i++) {
      const columnName = header[i].trim()
      
      for (const [field, pattern] of Object.entries(patterns)) {
        if (pattern.test(columnName)) {
          mapping[field] = i
          break
        }
      }
    }

    // Check required fields
    if (!mapping.date || mapping.description === undefined || mapping.amount === undefined) {
      return {
        valid: false,
        error: 'Required columns not found: date, description, and amount are mandatory'
      }
    }

    return { valid: true, mapping }
  }

  /**
   * Map CSV row values to CSVImportRow structure
   * @param values - Array of CSV values
   * @param mapping - Column mapping configuration
   * @returns Mapped CSV import row or null if invalid
   */
  private static mapCSVRow(values: string[], mapping: any): CSVImportRow | null {
    try {
      const date = values[mapping.date]?.trim()
      const description = values[mapping.description]?.trim()
      const amountStr = values[mapping.amount]?.trim().replace(/[$,]/g, '') // Remove currency symbols
      const typeStr = values[mapping.type]?.trim().toLowerCase()
      const category = mapping.category !== undefined ? values[mapping.category]?.trim() : undefined

      if (!date || !description || !amountStr) {
        return null
      }

      const amount = parseFloat(amountStr)
      if (isNaN(amount) || amount <= 0) {
        return null
      }

      // Determine transaction type
      let type: 'income' | 'expense' = 'expense' // Default to expense
      
      if (mapping.type !== undefined && typeStr) {
        if (['credit', 'deposit', 'income', '+'].some(t => typeStr.includes(t))) {
          type = 'income'
        } else if (['debit', 'withdrawal', 'expense', 'payment', '-'].some(t => typeStr.includes(t))) {
          type = 'expense'
        }
      } else {
        // If no type column, assume positive amounts are income, negative are expenses
        type = amount > 0 ? 'income' : 'expense'
      }

      return {
        date,
        description,
        amount: Math.abs(amount), // Always store positive amount
        type,
        category
      }
    } catch (error) {
      return null
    }
  }
}
