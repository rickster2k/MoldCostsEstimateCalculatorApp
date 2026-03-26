'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { EstimateFilters } from '@/components/admin/adminSubmissionTab'

export async function getAllEstimateSubmissionsFiltered(
  filters: EstimateFilters
): Promise<{ success: true; data: Estimate[] } | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()
    const { searchType, searchValue, serviceRequest, dateFrom, dateTo } = filters
    const trimmed = searchValue.trim()

    // ── No active filter — fetch everything ───────────────────────────────────

    if (!searchType) {
      const snapshot = await adminDb
        .collection('estimates')
        .orderBy('timestamp', 'desc')
        .get()

      const data = snapshot.docs.map(doc => ({
        ...(doc.data() as Estimate),
        id: doc.id,
      }))

      return { success: true, data }
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
        data: snapshot.docs.map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
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
        data: snapshot.docs.map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
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
        data: snapshot.docs.map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Service request ───────────────────────────────────────────────────────

    if (searchType === 'serviceRequest' && serviceRequest) {
      const fieldMap: Record<string, string> = {
        realEstimates: 'requestRealEstimates',
        blueprint: 'requestDiyBlueprint',
        consultant: 'requestConsultant',
      }
      const field = fieldMap[serviceRequest]

      const snapshot = await adminDb
        .collection('estimates')
        .where(field, '==', true)
        .orderBy('timestamp', 'desc')
        .get()

      return {
        success: true,
        data: snapshot.docs.map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Date range ────────────────────────────────────────────────────────────

    if (searchType === 'dateRange') {
      let query: FirebaseFirestore.Query = adminDb
        .collection('estimates')
        .orderBy('timestamp', 'desc')

      if (dateFrom) {
          const from = new Date(dateFrom + 'T00:00:00.000Z')
          from.setUTCDate(from.getUTCDate() - 1)
          query = query.where('timestamp', '>=', from.toISOString())
      }
      if (dateTo) {
          const to = new Date(dateTo + 'T23:59:59.999Z')
          to.setUTCDate(to.getUTCDate() + 1)
          query = query.where('timestamp', '<=', to.toISOString())
      }

      const snapshot = await query.get()

      return {
        success: true,
        data: snapshot.docs.map(doc => ({ ...(doc.data() as Estimate), id: doc.id })),
      }
    }

    // ── Name — parallel prefix queries, merged ────────────────────────────────

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
          if (!seen.has(doc.id)) {
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

    // ── Fallback ──────────────────────────────────────────────────────────────

    return { success: false, error: 'Invalid filter configuration' }

  } catch (error) {
    console.error('Error fetching all filtered estimate submissions:', error)
    return { success: false, error: 'Failed to fetch estimates for export' }
  }
}