'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { AttachedPdf, EstimatePdfType } from '@/lib/types'

/**
 * Writes the uploaded PDF metadata (name + url) to the correct field
 * on the estimate document:
 *   blueprint    → estimate.blueprintPdf
 *   consultation → estimate.consultationPdf
 */
export async function updateEstimatePdf(
  estimateId: string,
  pdfType: EstimatePdfType,
  pdf: AttachedPdf
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()

    const field = pdfType === 'blueprint' ? 'blueprintPdf' : 'consultationPdf'

    await adminDb.collection('estimates').doc(estimateId).update({
      [field]: {
        name: pdf.name,
        url: pdf.url,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating estimate PDF:', error)
    return { success: false, error: 'Failed to update estimate PDF.' }
  }
}