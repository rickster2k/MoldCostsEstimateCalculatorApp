'use server'

import { Resend } from 'resend'
import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { RecoveryEmail } from '@/components/resend/recoveryEmailTemplate'

interface SendRecoveryEmailParams {
  toEmail: string
}

export async function sendRecoveryEmail(  params: SendRecoveryEmailParams): Promise<{ success: boolean; error?: string }> {
    const { toEmail } = params
    const apiKey    = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL

    if (!apiKey || !fromEmail) {
        console.error('Missing Resend env vars')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        // Look up the most recent submission for this email address
        const adminDb = getAdminDb()
        const snapshot = await adminDb
            .collection('estimates')
            .where('contact.email', '==', toEmail.toLowerCase().trim())
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
        // If no submission found, return success anyway (security best practice —
        // never reveal whether an email exists in the system)
        if (snapshot.empty) {
        return { success: true }
        }

        const submission = snapshot.docs[0].data() as Estimate
        const { estimateId, contact, timestamp } = submission

        const submissionDate = new Date(timestamp).toLocaleDateString('en-US', {
        year:  'numeric',
        month: 'long',
        day:   'numeric',
        })

        const resend = new Resend(apiKey)

        const { error } = await resend.emails.send({
        from:    fromEmail,
        to:      toEmail,
        subject: `Your MoldCost's Estimate ID — ${estimateId}`,
        react:   RecoveryEmail({
            estimateId,
            firstName:      contact.firstName,
            submissionDate,
        }),
        })

        if (error) {
        console.error('Resend error:', error)
        return { success: false, error: error.message }
        }

        return { success: true }

    } catch (err) {
        console.error('sendRecoveryEmail failed:', err)
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
}