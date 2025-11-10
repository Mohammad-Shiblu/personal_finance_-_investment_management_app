
/**
 * Type definitions for the Financial Management Application
 * This file contains all TypeScript interfaces and types used throughout the application
 * Equivalent to models.py in a Flask/FastAPI application
 */

import { Prisma } from '@prisma/client'

// Database model types with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    incomes: true
    expenses: { include: { category: true } }
    categories: true
    investments: true
    transactions: true
  }
}>

export type ExpenseWithCategory = Prisma.ExpenseGetPayload<{
  include: { category: true }
}>

export type CategoryWithExpenses = Prisma.CategoryGetPayload<{
  include: { expenses: true }
}>

export type IncomeWithUser = Prisma.IncomeGetPayload<{
  include: { user: true }
}>

export type InvestmentWithUser = Prisma.InvestmentGetPayload<{
  include: { user: true }
}>

// API Request/Response types
export interface CreateIncomeRequest {
  amount: number
  source: string
  description?: string
  date: string
  isRecurring?: boolean
  frequency?: string
}

export interface UpdateIncomeRequest extends Partial<CreateIncomeRequest> {
  id: string
}

export interface CreateExpenseRequest {
  amount: number
  description: string
  date: string
  categoryId: string
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  color?: string
  icon?: string
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string
}

export interface CreateInvestmentRequest {
  name: string
  type: 'ETF' | 'Crypto' | 'Stock' | 'Bond'
  symbol?: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  currentPrice?: number
  notes?: string
}

export interface UpdateInvestmentRequest extends Partial<CreateInvestmentRequest> {
  id: string
}

// Calculator types
export interface CompoundInterestCalculation {
  principal: number
  rate: number // Annual interest rate as percentage
  time: number // Years
  frequency: number // Compounding frequency per year
}

export interface CompoundInterestResult {
  finalAmount: number
  totalInterest: number
  yearlyBreakdown: Array<{
    year: number
    startingAmount: number
    interestEarned: number
    endingAmount: number
  }>
}

export interface SavingsGrowthCalculation {
  initialAmount: number
  monthlyContribution: number
  annualRate: number // Percentage
  years: number
}

export interface SavingsGrowthResult {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  monthlyBreakdown: Array<{
    month: number
    contribution: number
    interestEarned: number
    balance: number
  }>
}

// Analytics and reporting types
export interface MonthlyFinancialSummary {
  month: string // YYYY-MM format
  totalIncome: number
  totalExpenses: number
  netSavings: number
  expensesByCategory: Array<{
    categoryName: string
    amount: number
    percentage: number
  }>
}

export interface TrendAnalysis {
  incometrend: Array<{
    date: string
    amount: number
  }>
  expensesTrend: Array<{
    date: string
    amount: number
  }>
  savingsRate: number // Percentage
  projectedSavings: Array<{
    date: string
    projected: number
  }>
}

export interface InvestmentPortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  gainLossPercentage: number
  byType: Array<{
    type: string
    totalValue: number
    totalInvested: number
    gainLoss: number
    percentage: number
  }>
}

// CSV Import types
export interface CSVImportRow {
  date: string
  description: string
  amount: number
  category?: string
  type: 'income' | 'expense'
}

export interface CSVImportResult {
  successful: number
  failed: number
  errors: Array<{
    row: number
    error: string
  }>
  preview: CSVImportRow[]
}

// Form validation schemas
export interface ValidationError {
  field: string
  message: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: ValidationError[]
}
