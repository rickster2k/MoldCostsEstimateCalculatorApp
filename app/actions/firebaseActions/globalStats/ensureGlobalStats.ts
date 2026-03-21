
import { getAdminDb } from "@/lib/services/firebaseAdmin"
import { initializeGlobalStats } from "./initializeGlobalStats"

export default async function ensureGlobalStats() {
    const adminDb = getAdminDb()
    const doc = await adminDb.collection('config').doc('globalStats').get()
    if (!doc.exists) {
        await initializeGlobalStats()
    }
}