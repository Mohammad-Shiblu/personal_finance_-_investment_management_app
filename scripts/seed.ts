
/**
 * Database Seeding Script
 * Seeds the database with default categories and test user data
 * Equivalent to seed.py in Flask/FastAPI applications
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { CategoryService } from '../lib/services/category-service'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create test user (john@doe.com / johndoe123) with admin privileges
    const hashedPassword = await bcrypt.hash('johndoe123', 12)
    
    const testUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe'
      }
    })

    console.log('✅ Test user created:', testUser.email)

    // Create default categories for the test user
    const categoriesResult = await CategoryService.createDefaultCategories(testUser.id)
    
    if (categoriesResult.success) {
      console.log(`✅ Created ${categoriesResult.data.length} default categories`)
    } else {
      console.log('⚠️  Categories may already exist')
    }

    // Create sample income data
    const sampleIncomes = [
      {
        amount: 5000,
        source: 'Salary',
        description: 'Monthly salary',
        date: new Date('2024-01-01'),
        isRecurring: true,
        frequency: 'monthly',
        userId: testUser.id
      },
      {
        amount: 1500,
        source: 'Freelance',
        description: 'Web development project',
        date: new Date('2024-01-15'),
        isRecurring: false,
        userId: testUser.id
      },
      {
        amount: 5000,
        source: 'Salary',
        description: 'Monthly salary',
        date: new Date('2024-02-01'),
        isRecurring: true,
        frequency: 'monthly',
        userId: testUser.id
      }
    ]

    const incomePromises = sampleIncomes.map(income => 
      prisma.income.upsert({
        where: { id: 'sample-income-' + income.date.toISOString() },
        update: {},
        create: income
      }).catch(() => null) // Ignore errors for duplicate data
    )

    const createdIncomes = await Promise.all(incomePromises)
    const validIncomes = createdIncomes.filter(Boolean)
    console.log(`✅ Created ${validIncomes.length} sample income entries`)

    // Get first category for sample expenses
    const firstCategory = await prisma.category.findFirst({
      where: { userId: testUser.id }
    })

    if (firstCategory) {
      // Create sample expense data
      const sampleExpenses = [
        {
          amount: 800,
          description: 'Monthly rent',
          date: new Date('2024-01-02'),
          categoryId: firstCategory.id,
          userId: testUser.id
        },
        {
          amount: 150,
          description: 'Grocery shopping',
          date: new Date('2024-01-05'),
          categoryId: firstCategory.id,
          userId: testUser.id
        },
        {
          amount: 50,
          description: 'Gas station',
          date: new Date('2024-01-10'),
          categoryId: firstCategory.id,
          userId: testUser.id
        }
      ]

      const expensePromises = sampleExpenses.map((expense, index) => 
        prisma.expense.upsert({
          where: { id: 'sample-expense-' + index },
          update: {},
          create: expense
        }).catch(() => null) // Ignore errors for duplicate data
      )

      const createdExpenses = await Promise.all(expensePromises)
      const validExpenses = createdExpenses.filter(Boolean)
      console.log(`✅ Created ${validExpenses.length} sample expense entries`)
    }

    // Create sample investment data
    const sampleInvestments = [
      {
        name: 'VTSAX',
        type: 'ETF',
        symbol: 'VTSAX',
        quantity: 100,
        purchasePrice: 80.50,
        purchaseDate: new Date('2023-06-01'),
        currentPrice: 95.25,
        lastPriceUpdate: new Date(),
        notes: 'Total Stock Market Index Fund',
        userId: testUser.id
      },
      {
        name: 'Bitcoin',
        type: 'Crypto',
        symbol: 'BTC',
        quantity: 0.5,
        purchasePrice: 45000,
        purchaseDate: new Date('2023-08-15'),
        currentPrice: 52000,
        lastPriceUpdate: new Date(),
        notes: 'Long-term crypto investment',
        userId: testUser.id
      }
    ]

    const investmentPromises = sampleInvestments.map((investment, index) => 
      prisma.investment.upsert({
        where: { id: 'sample-investment-' + index },
        update: {},
        create: investment
      }).catch(() => null) // Ignore errors for duplicate data
    )

    const createdInvestments = await Promise.all(investmentPromises)
    const validInvestments = createdInvestments.filter(Boolean)
    console.log(`✅ Created ${validInvestments.length} sample investment entries`)

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
