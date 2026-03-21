import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Admin Routes 
  if (url.pathname.startsWith('/admin/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.admin) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // User Report Routes 
  if (url.pathname.startsWith('/user/report')) {
    const token = req.cookies.get('user-estimate-token') 

    if (!token) {
      url.pathname = '/user/login'
      return NextResponse.redirect(url)
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
      await jwtVerify(token.value, secret)
    } catch {
      url.pathname = '/user/login'
      return NextResponse.redirect(url)
    }
  }

  // All other routes are public 
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/user/report/:path*'],
}