// app/actions/firebaseActions/getEstimateById.ts
'use server'

import { Estimate } from '@/lib/types'
import { getAdminDb } from '@/lib/services/firebaseAdmin'

export async function getEstimateById(id: string) {
    try {
        const adminDb = getAdminDb()
        const doc = await adminDb.collection('estimates').doc(id).get()

        if (!doc.exists) {
            return { success: false, error: 'Estimate not found.' }
        }

        return { success: true, estimate: doc.data() as Estimate }
    } catch (error) {
        console.error('Error fetching estimate:', error)
        return { success: false, error: 'Failed to fetch estimate.' }
    }
}