
/**
 * User Signup API Route
 * Handles user registration with password hashing and validation
 * Equivalent to /auth/register in Flask/FastAPI
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { CategoryService } from '../../../lib/services/category-service'

export const dynamic = 'force-dynamic'

/**
 * Handle user signup/registration
 * POST /api/signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        name: firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : null
      }
    })

    // Create default categories for the new user
    await CategoryService.createDefaultCategories(user.id)

    // Return success (don't include password in response)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error during signup' },
      { status: 500 }
    )
  }
}
