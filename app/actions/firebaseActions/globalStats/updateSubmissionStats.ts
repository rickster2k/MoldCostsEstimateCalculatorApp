// app/actions/firebaseActions/globalStats/updateSubmissionStats.ts
'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

const GLOBAL_STATS_DOC = 'globalStats'
const GLOBAL_STATS_COLLECTION = 'config'

type UpdateSubmissionStatsParams = {
    estimateAmount: number
    isServiceAlert: boolean
}

export async function updateSubmissionStats({ estimateAmount, isServiceAlert }: UpdateSubmissionStatsParams) {
    try {
        const adminDb = getAdminDb()

        await adminDb
            .collection(GLOBAL_STATS_COLLECTION)
            .doc(GLOBAL_STATS_DOC)
            .update({
                totalSubmissions:   FieldValue.increment(1),
                totalEstimateValue: FieldValue.increment(estimateAmount),
                ...(isServiceAlert && { totalAlerts: FieldValue.increment(1) }),
            })

        return { success: true }
    } catch (error) {
        console.error('Error updating submission stats:', error)
        return { success: false, error: 'Failed to update submission stats.' }
    }
}