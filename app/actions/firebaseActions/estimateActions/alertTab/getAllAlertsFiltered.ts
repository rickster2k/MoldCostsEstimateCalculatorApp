'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { EstimateFilters } from '@/components/admin/adminSubmissionTab'

export async function getAllServiceAlertSubmissionsFiltered(
  filters: EstimateFilters
): Promise<{ success: true; data: Estimate[] } | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()
    const { searchType, searchValue, dateFrom, dateTo } = filters
    const trimmed = searchValue.trim()

    // ── Always fetch the full alert ID set first ───────────────────────────────

    const [realSnap, blueprintSnap, consultSnap] = await Promise.all([
      adminDb.collection('estimates').where('requestRealEstimates', '==', true).select().get(),
      adminDb.collection('estimates').where('requestDiyBlueprint', '==', true).select().get(),
      adminDb.collection('estimates').where('requestConsultant', '==', true).select().get(),
    ])

    const alertIds = new Set<string>()
    for (const snap of [realSnap, blueprintSnap, consultSnap]) {
      for (const doc of snap.docs) alertIds.add(doc.id)
    }

    if (alertIds.size === 0) return { success: true, data: [] }

    // ── No active filter — fetch all alerts ───────────────────────────────────

    if (!searchType) {
      const snapshot = await adminDb
        .collection('estimates')
        .orderBy('timestamp', 'desc')
        .get()

      const data = snapshot.docs
        .filter(doc => alertIds.has(doc.id))
        .map(doc => ({ ...(doc.data() as Estimate), id: doc.id }))

      return { success: true, data }
    }

    // ── Name ──────────────────────────────────────────────────────────────────

    if (searchType === 'name' && trimmed) {
      const lower = trimmed.toLowerCase()

      const [firstSnap, lastSnap] = await Promise.all([
        adminDb
          .collection('estimates')
          .orderBy('contact.firstName')
          .startAt(lower)
          .endAt(lower + '\uf8ff')
          .get(),
        adminDb
          .collection('estimates')
          .orderBy('contact.lastName')
          .startAt(lower)
          .endAt(lower + '\uf8ff')
          .get(),
      ])

      const seen = new Set<string>()
      const merged: Estimate[] = []

      for (const snap of [firstSnap, lastSnap]) {
        for (const doc of snap.docs) {
          if (!seen.has(doc.id) && alertIds.has(doc.id)) {
            seen.add(doc.id)
            merged.push({ ...(doc.data() as Estimate), id: doc.id })
          }
        }
      }

      merged.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      return { success: true, data: merged }
    }

    // ── Email ─────────────────────────────────────────────────────────────────

    if (searchType === 'email' && trimmed) {
      const snapshot = await adminDb
        .collection('estimates')
        .where('contact.email', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

      return {
        success: true,
        data: snapshot.docs
          .filter(doc => alertIds.has(doc.id))
          .map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Estimate ID ───────────────────────────────────────────────────────────

    if (searchType === 'estimateId' && trimmed) {
      const snapshot = await adminDb
        .collection('estimates')
        .where('estimateId', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

      return {
        success: true,
        data: snapshot.docs
          .filter(doc => alertIds.has(doc.id))
          .map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Zip Code ──────────────────────────────────────────────────────────────

    if (searchType === 'zipCode' && trimmed) {
      const snapshot = await adminDb
        .collection('estimates')
        .where('contact.zipCode', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

      return {
        success: true,
        data: snapshot.docs
          .filter(doc => alertIds.has(doc.id))
          .map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Date range ────────────────────────────────────────────────────────────

    if (searchType === 'dateRange') {
      let query: FirebaseFirestore.Query = adminDb
        .collection('estimates')
        .orderBy('timestamp', 'desc')

      if (dateFrom) query = query.where('timestamp', '>=', dateFrom)
      if (dateTo)   query = query.where('timestamp', '<=', dateTo + 'T23:59:59.999Z')

      const snapshot = await query.get()

      return {
        success: true,
        data: snapshot.docs
          .filter(doc => alertIds.has(doc.id))
          .map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    return { success: false, error: 'Invalid filter configuration' }

  } catch (error) {
    console.error('Error fetching all filtered service alert submissions:', error)
    return { success: false, error: 'Failed to fetch service alerts for export' }
  }
}