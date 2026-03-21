'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'

const GLOBAL_STATS_DOC = 'globalStats'
const GLOBAL_STATS_COLLECTION = 'config'

export async function updateDiyShop(paymentUrl: string, pricePoint: number) {
    try {
        const adminDb = getAdminDb()

        await adminDb
            .collection(GLOBAL_STATS_COLLECTION)
            .doc(GLOBAL_STATS_DOC)
            .update({
                diyShop: { paymentUrl, pricePoint }
            })

        return { success: true }
    } catch (error) {
        console.error('Error updating DIY shop:', error)
        return { success: false, error: 'Failed to update DIY shop.' }
    }
}