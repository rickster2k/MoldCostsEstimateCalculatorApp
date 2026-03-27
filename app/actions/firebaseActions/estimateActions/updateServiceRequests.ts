// app/actions/firebaseActions/updateServiceRequests.ts
'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const GLOBAL_STATS_DOC = 'globalStats'
const GLOBAL_STATS_COLLECTION = 'config'

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

        const doc = snapshot.docs[0]
        const currentData = doc.data()

        const wasAlreadyAlert =
            currentData.requestRealEstimates ||
            currentData.requestDiyBlueprint  ||
            currentData.requestConsultant

        await doc.ref.update({
            requestRealEstimates,
            requestDiyBlueprint,
            requestConsultant,
        })

        const isNowAlert = requestRealEstimates || requestDiyBlueprint || requestConsultant

        if (!wasAlreadyAlert && isNowAlert) {
            try {
                await adminDb
                    .collection(GLOBAL_STATS_COLLECTION)
                    .doc(GLOBAL_STATS_DOC)
                    .update({
                        totalAlerts: FieldValue.increment(1),
                    })
            } catch (err) {
                console.error('Stats update error:', err)
            }
        }

        return { success: true }

    } catch (error) {
        console.error('Error updating service requests:', error)
        return { success: false, error: 'Failed to update service requests.' }
    }
}