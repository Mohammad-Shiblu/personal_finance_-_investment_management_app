/**
 * Forgot Password API Route
 * Generates password reset token and provides reset link
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link has been generated'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token
    await prisma.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        token: resetToken,
        expires,
        used: false
      }
    })

    // In production, send email here
    // For now, return the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been generated',
      // Remove this in production - only for development
      resetLink
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
