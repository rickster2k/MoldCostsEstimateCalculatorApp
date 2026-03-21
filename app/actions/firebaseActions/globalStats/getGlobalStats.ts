'use server'

import { GlobalStats, Shop } from '@/lib/types'
import { getAdminDb } from '@/lib/services/firebaseAdmin'

export async function getGlobalStats() {
    try {
        const adminDb = getAdminDb()
        const doc = await adminDb.collection('config').doc('globalStats').get()

        if (!doc.exists) {
            return { success: false, error: 'Global stats not found.' }
        }

        return { success: true, globalStats: doc.data() as GlobalStats }
    } catch (error) {
        console.error('Error fetching global stats:', error)
        return { success: false, error: 'Failed to fetch global stats.' }
    }
}

export async function getDiyShop() {
    try {
        const adminDb = getAdminDb()
        const doc = await adminDb.collection('config').doc('globalStats').get()

        if (!doc.exists) {
            return { success: false, error: 'Global stats not found.' }
        }

        const data = doc.data() as GlobalStats
        return { success: true, diyShop: data.diyShop as Shop }
    } catch (error) {
        console.error('Error fetching DIY shop:', error)
        return { success: false, error: 'Failed to fetch DIY shop.' }
    }
}

export async function getRemoteConsultShop() {
    try {
        const adminDb = getAdminDb()
        const doc = await adminDb.collection('config').doc('globalStats').get()

        if (!doc.exists) {
            return { success: false, error: 'Global stats not found.' }
        }

        const data = doc.data() as GlobalStats
        return { success: true, remoteConsultShop: data.remoteConsultShop as Shop }
    } catch (error) {
        console.error('Error fetching remote consult shop:', error)
        return { success: false, error: 'Failed to fetch remote consult shop.' }
    }
}