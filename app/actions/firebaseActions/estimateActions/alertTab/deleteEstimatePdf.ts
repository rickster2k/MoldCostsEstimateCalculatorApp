'use server'

import { getAdminDb, getAdminStorage } from '@/lib/services/firebaseAdmin'
import { EstimatePdfType } from '@/lib/types';

/**
 * Deletes the PDF file from Firebase Storage and clears the corresponding
 * field on the estimate document in Firestore.
 *
 * Storage path mirrors uploadPdfToStorage:
 *   estimate-docs/{estimateId}/blueprint/{fileName}
 *   estimate-docs/{estimateId}/consultation/{fileName}
 */
export async function deleteEstimatePdf(
  estimateId: string,
  pdfType: EstimatePdfType
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET
    if (!bucketName) throw new Error('FIREBASE_STORAGE_BUCKET not defined')

    const adminDb = getAdminDb()
    const field = pdfType === 'blueprint' ? 'blueprintPdf' : 'consultationPdf'

    // ── 1. Read current PDF name from Firestore ───────────────────────────────
    const docSnap = await adminDb.collection('estimates').doc(estimateId).get()
    if (!docSnap.exists) {
      return { success: false, error: 'Estimate not found' }
    }

    const pdfData = docSnap.get(field) as { name: string; url: string } | undefined
    if (!pdfData?.name) {
      // Nothing stored — clear the field defensively and return success
      await adminDb.collection('estimates').doc(estimateId).update({ [field]: null })
      return { success: true }
    }

    // ── 2. Delete from Firebase Storage ──────────────────────────────────────
    const adminStorage = getAdminStorage()
    const bucket = adminStorage.bucket(bucketName)

    const filePath = `estimate-docs/${estimateId}/${pdfType}/${pdfData.name}`
    const file = bucket.file(filePath)

    const [exists] = await file.exists()
    if (exists) {
      await file.delete()
      console.log('Deleted from storage:', filePath)
    } else {
      console.warn('File not found in storage, clearing Firestore field anyway:', filePath)
    }

    // ── 3. Clear the Firestore field ──────────────────────────────────────────
    await adminDb.collection('estimates').doc(estimateId).update({
      [field]: null,
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting estimate PDF:', error)
    return { success: false, error: 'Failed to delete PDF' }
  }
}