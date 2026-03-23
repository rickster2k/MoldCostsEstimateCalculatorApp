'use server'

import { getAdminStorage } from '@/lib/services/firebaseAdmin'
import { verifyAdminIsValid } from '@/lib/auth/verifyAdminIsValid'
import { EstimatePdfType } from '@/lib/types';

/**
 * Generates a short-lived signed URL (30 min) for viewing an estimate PDF.
 * Only accessible to verified admins.
 *
 * Storage path mirrors uploadPdfToStorage:
 *   estimate-docs/{estimateId}/blueprint/{fileName}
 *   estimate-docs/{estimateId}/consultation/{fileName}
 */
export async function getSignedPdfUrl(
  estimateId: string,
  fileName: string,
  pdfType: EstimatePdfType
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  verifyAdminIsValid()

  try {
    const bucket = getAdminStorage().bucket()

    const filePath = `estimate-docs/${estimateId}/${pdfType}/${fileName}`
    const file = bucket.file(filePath)

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 30 * 60 * 1000, // 30 minutes
    })

    return { success: true, url }
  } catch (err) {
    console.error('Failed to generate signed URL:', err)
    return { success: false, error: 'Failed to generate PDF link.' }
  }
}