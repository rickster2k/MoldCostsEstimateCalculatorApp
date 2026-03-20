'use server'

import { EstimateResultsEmail } from '@/components/resend/estimateResultEmailTemplate'
import { CalculationResult } from '@/lib/types'
import { Resend } from 'resend'

interface SendEstimateEmailParams {
  toEmail: string
  firstName: string
  estimateId: string
  estimateResults: CalculationResult
}

export async function sendEstimateEmail(  params: SendEstimateEmailParams): Promise<{ success: boolean; error?: string }> {
  const { toEmail, firstName, estimateId, estimateResults } = params

  const apiKey   = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.error('Missing Resend env vars')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from:    fromEmail,
      to:      toEmail,
      subject: `Your Mold Cost Estimate is Ready — ${estimateId}`,
      react:   EstimateResultsEmail({ firstName, estimateId, estimateResults , email:toEmail }),
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('sendEstimateEmail failed:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}