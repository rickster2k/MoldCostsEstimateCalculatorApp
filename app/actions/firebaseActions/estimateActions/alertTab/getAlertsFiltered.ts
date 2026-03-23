'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { DEFAULT_PAGE_SIZE, PaginatedResult } from '@/lib/utils/paginationUtils'
import { EstimateFilters } from '@/components/admin/adminSubmissionTab'

// ── Helper: fetch all service alert doc ids (any of the 3 booleans == true) ──
// We resolve the full alert set first, then apply the search filter on top.
// This keeps the "always show only alerts" invariant across every filter type.

async function fetchAllAlertIds(adminDb: FirebaseFirestore.Firestore): Promise<Set<string>> {
  const [realSnap, blueprintSnap, consultSnap] = await Promise.all([
    adminDb.collection('estimates').where('requestRealEstimates', '==', true).select().get(),
    adminDb.collection('estimates').where('requestDiyBlueprint', '==', true).select().get(),
    adminDb.collection('estimates').where('requestConsultant', '==', true).select().get(),
  ])

  const ids = new Set<string>()
  for (const snap of [realSnap, blueprintSnap, consultSnap]) {
    for (const doc of snap.docs) ids.add(doc.id)
  }
  return ids
}

export async function getServiceAlertSubmissionsFiltered(
  filters: EstimateFilters,
  pageSize: number = DEFAULT_PAGE_SIZE,
  cursorId?: string
): Promise<{ success: true } & PaginatedResult<Estimate> | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()
    const { searchType, searchValue, dateFrom, dateTo } = filters
    const trimmed = searchValue.trim()

    // ── No search filter — delegate to pagination fn ──────────────────────────
    if (!searchType) {
      const { getServiceAlertSubmissionsPagination } = await import('./getAlertsPagination')
      return getServiceAlertSubmissionsPagination(pageSize, cursorId)
    }

    // Pre-fetch the full set of alert doc IDs so we can intersect below
    const alertIds = await fetchAllAlertIds(adminDb)

    if (alertIds.size === 0) {
      return { success: true, data: [], nextCursor: null, hasMore: false }
    }

    // ── Name search: parallel prefix queries then intersect ───────────────────
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
          // Intersect with alert IDs
          if (!seen.has(doc.id) && alertIds.has(doc.id)) {
            seen.add(doc.id)
            merged.push({ ...(doc.data() as Estimate), id: doc.id })
          }
        }
      }

      merged.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      const startIndex = cursorId
        ? merged.findIndex(e => e.id === cursorId) + 1
        : 0
      const page = merged.slice(startIndex, startIndex + pageSize)

      return {
        success: true,
        data: page,
        nextCursor: page.length === pageSize ? page[page.length - 1].id : null,
        hasMore: startIndex + pageSize < merged.length,
      }
    }

    // ── For all other filter types: run the Firestore query then intersect ─────
    let snapshot: FirebaseFirestore.QuerySnapshot

    if (searchType === 'email' && trimmed) {
      snapshot = await adminDb
        .collection('estimates')
        .where('contact.email', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

    } else if (searchType === 'estimateId' && trimmed) {
      snapshot = await adminDb
        .collection('estimates')
        .where('estimateId', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

    } else if (searchType === 'zipCode' && trimmed) {
      snapshot = await adminDb
        .collection('estimates')
        .where('contact.zipCode', '==', trimmed)
        .orderBy('timestamp', 'desc')
        .get()

    } else if (searchType === 'dateRange') {
      let query: FirebaseFirestore.Query = adminDb
        .collection('estimates')
        .orderBy('timestamp', 'desc')

      if (dateFrom) query = query.where('timestamp', '>=', dateFrom)
      if (dateTo)   query = query.where('timestamp', '<=', dateTo + 'T23:59:59.999Z')

      snapshot = await query.get()

    } else {
      return { success: false, error: 'Invalid filter configuration' }
    }

    // Intersect results with alert IDs and paginate manually
    const filtered: Estimate[] = snapshot.docs
      .filter(doc => alertIds.has(doc.id))
      .map(doc => ({ ...(doc.data() as Estimate), id: doc.id }))

    const startIndex = cursorId
      ? filtered.findIndex(e => e.id === cursorId) + 1
      : 0
    const page = filtered.slice(startIndex, startIndex + pageSize)

    return {
      success: true,
      data: page,
      nextCursor: page.length === pageSize ? page[page.length - 1].id : null,
      hasMore: startIndex + pageSize < filtered.length,
    }

  } catch (error) {
    console.error('Error fetching filtered service alert submissions:', error)
    return { success: false, error: 'Failed to get service alert submissions.' }
  }
}