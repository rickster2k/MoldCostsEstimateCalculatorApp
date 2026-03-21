// lib/auth/verifyUserIsValid.ts
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

export async function verifyUserIsValid() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-estimate-token')

  if (!token) {
    redirect('/login/user')
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    await jwtVerify(token.value, secret)
  } catch {
    redirect('/login/user')
  }
}