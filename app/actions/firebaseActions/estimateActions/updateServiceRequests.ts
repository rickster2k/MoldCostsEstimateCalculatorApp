// app/actions/firebaseActions/updateServiceRequests.ts
'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'

export async function updateServiceRequests(
    estimateId: string,
    requestRealEstimates: boolean,
    requestDiyBlueprint: boolean,
    requestConsultant: boolean
) {
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

        await snapshot.docs[0].ref.update({
            requestRealEstimates,
            requestDiyBlueprint,
            requestConsultant,
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating service requests:', error)
        return { success: false, error: 'Failed to update service requests.' }
    }
}