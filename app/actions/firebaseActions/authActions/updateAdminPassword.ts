'use server'

import { getAdminAuth } from '@/lib/services/firebaseAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function updateAdminPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify the caller is an authenticated admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.admin) {
      return { success: false, error: 'Unauthorized' }
    }

    // 2. Validate password strength server-side
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' }
    }

    // 3. Look up the Firebase user by email to get their UID
    const adminAuth = getAdminAuth()
    const userRecord = await adminAuth.getUserByEmail(session.user.email!)

    // 4. Update password via Admin SDK — bypasses any client-side auth
    await adminAuth.updateUser(userRecord.uid, { password: newPassword })

    return { success: true }
  } catch (err) {
    console.error('Failed to update admin password:', err)
    return { success: false, error: 'Failed to update password. Please try again.' }
  }
}