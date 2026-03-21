'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'

const GLOBAL_STATS_DOC = 'globalStats'
const GLOBAL_STATS_COLLECTION = 'config'

export async function updateRemoteConsultShop(paymentUrl: string, pricePoint: number) {
    try {
        const adminDb = getAdminDb()

        await adminDb
            .collection(GLOBAL_STATS_COLLECTION)
            .doc(GLOBAL_STATS_DOC)
            .update({
                remoteConsultShop: { paymentUrl, pricePoint }
            })

        return { success: true }
    } catch (error) {
        console.error('Error updating remote consult shop:', error)
        return { success: false, error: 'Failed to update remote consult shop.' }
    }
}