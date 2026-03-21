// app/actions/firebaseActions/updateContactInfo.ts
'use server'

import { ContactInfo } from '@/lib/types'
import { getAdminDb } from '@/lib/services/firebaseAdmin'

export async function updateContactInfo(estimateId: string, contactInfo: ContactInfo) {
    try {
        const adminDb = getAdminDb()

        const snapshot = await adminDb
            .collection('estimates')
            .where('id', '==', estimateId)
            .limit(1)
            .get()

        if (snapshot.empty) {
            return { success: false, error: 'Estimate not found.' }
        }

        await snapshot.docs[0].ref.update({ contact: contactInfo })

        return { success: true }
    } catch (error) {
        console.error('Error updating contact info:', error)
        return { success: false, error: 'Failed to update contact info.' }
    }
}