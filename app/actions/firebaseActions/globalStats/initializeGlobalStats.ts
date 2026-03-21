
import { GlobalStats } from '@/lib/types'
import { getAdminDb } from '@/lib/services/firebaseAdmin'

const GLOBAL_STATS_DOC = 'globalStats'
const GLOBAL_STATS_COLLECTION = 'config'

export async function initializeGlobalStats() {
    try {
        const adminDb = getAdminDb()
        const docRef = adminDb.collection(GLOBAL_STATS_COLLECTION).doc(GLOBAL_STATS_DOC)
        const doc = await docRef.get()

        if (doc.exists) {
            return { success: false, error: 'Global stats already initialized.' }
        }

        const initialStats: GlobalStats = {
            totalSubmissions:               0,
            totalAlerts:                    0,
            totalEstimateValue:             0,
            averageEstimateValue:           0,
            requestRealEstimatesCount:      0,
            requestDiyBlueprintCount:       0,
            requestConsultantCount:         0,
            needsTestingCount:              0,
            pendingContractorMatch:         0,
            pendingBlueprintFulfillment:    0,
            pendingConsultationFulfillment: 0,
            handledContractorMatch:         0,
            handledBlueprint:               0,
            handledConsultation:            0,
            diyShop: {
                paymentUrl: '',
                pricePoint: 0,
            },
            remoteConsultShop: {
                paymentUrl: '',
                pricePoint: 0,
            },
        }

        await docRef.set(initialStats)

        return { success: true }
    } catch (error) {
        console.error('Error initializing global stats:', error)
        return { success: false, error: 'Failed to initialize global stats.' }
    }
}