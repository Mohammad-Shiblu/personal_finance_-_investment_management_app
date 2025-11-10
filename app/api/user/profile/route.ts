import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth-config'
import { prisma } from '../../../../lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id }, 
    select: { firstName: true, lastName: true, phone: true, bio: true, image: true } 
  })
  return NextResponse.json({ success: true, data: user })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { firstName, lastName, phone, bio, image } = await request.json()
  const name = `${firstName || ''} ${lastName || ''}`.trim()
  
  await prisma.user.update({ 
    where: { id: session.user.id }, 
    data: { firstName, lastName, phone, bio, image, name } 
  })
  return NextResponse.json({ success: true })
}
