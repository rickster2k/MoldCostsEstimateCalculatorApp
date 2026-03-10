'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { Estimate } from '@/lib/types'
export async function verifyUserAccess(email: string, reportId: string) {
    console.log("Hiiiii")
    try {
        const normalizedEmail = email.trim()
        const normalizedReportId = reportId.trim().toUpperCase()


        console.log("Checking user access with email:", normalizedEmail)
        console.log("Checking user access with normalizedReportId:", normalizedReportId)
        console.log("Checking Firestore for matching submission...")

        const adminDb = getAdminDb()
        
        const snapshot = await adminDb
        .collection('submissions')
        .where('contact.email', '==', normalizedEmail)
        .where('reportId', '==', normalizedReportId)
        .limit(1)
        .get()

        

        if (snapshot.empty) {
        return {
            success: false,
            error: 'Invalid Email or Report ID. Please check your details and try again.'
        }
        }

        const estimate = snapshot.docs[0].data() as Estimate

        // Create short lived token
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
        const token = await new SignJWT({ reportId: estimate.estimateId, normalizedEmail })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(secret)

        const cookieStore = await cookies()
        cookieStore.set('user-audit-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 2, // 2 hours
            path: '/',
        })
        return {
        success: true,
        estimate
        }
    } catch (error) {
        console.error('Audit verification error:', error)

        return {
            success: false,
            error: 'An error occurred. Please try again later.'
        }
    }
}
