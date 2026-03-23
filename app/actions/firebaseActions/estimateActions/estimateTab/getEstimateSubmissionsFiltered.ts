'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { applyPagination, buildPaginatedResult, DEFAULT_PAGE_SIZE, PaginatedResult } from '@/lib/utils/paginationUtils'
import { EstimateFilters } from '@/components/admin/adminSubmissionTab'

export async function getEstimateSubmissionsFiltered(
  filters: EstimateFilters,
  pageSize: number = DEFAULT_PAGE_SIZE,
  cursorId?: string
): Promise<{ success: true } & PaginatedResult<Estimate> | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()
    let baseQuery: FirebaseFirestore.Query = adminDb
      .collection('estimates')
      .orderBy('timestamp', 'desc')

    const { searchType, searchValue, serviceRequest, dateFrom, dateTo } = filters
    const trimmed = searchValue.trim()

    // ── Exact match filters ───────────────────────────────────────────────────

    if (searchType === 'email' && trimmed) {
      baseQuery = adminDb
        .collection('estimates')
        .where('contact.email', '==', trimmed)
        .orderBy('timestamp', 'desc')

    } else if (searchType === 'estimateId' && trimmed) {
      baseQuery = adminDb
        .collection('estimates')
        .where('estimateId', '==', trimmed)
        .orderBy('timestamp', 'desc')

    } else if (searchType === 'zipCode' && trimmed) {
      baseQuery = adminDb
        .collection('estimates')
        .where('contact.zipCode', '==', trimmed)
        .orderBy('timestamp', 'desc')

    } else if (searchType === 'serviceRequest' && serviceRequest) {
      // Map the serviceRequest value to the correct Firestore field
      const fieldMap: Record<string, string> = {
        realEstimates: 'requestRealEstimates',
        blueprint: 'requestDiyBlueprint',
        consultant: 'requestConsultant',
      }
      const field = fieldMap[serviceRequest]
      baseQuery = adminDb
        .collection('estimates')
        .where(field, '==', true)
        .orderBy('timestamp', 'desc')

    } else if (searchType === 'dateRange') {
      if (dateFrom) {
        baseQuery = baseQuery.where('timestamp', '>=', dateFrom)
      }
      if (dateTo) {
        baseQuery = baseQuery.where('timestamp', '<=', dateTo + 'T23:59:59.999Z')
      }

    } else if (searchType === 'name' && trimmed) {
      // ── Name search: parallel firstName + lastName prefix queries ───────────
      const lower = trimmed.toLowerCase()

      const [firstSnap, lastSnap] = await Promise.all([
        adminDb
          .collection('estimates')
          .orderBy('contact.firstName')
          .startAt(lower)
          .endAt(lower + '\uf8ff')
          .limit(pageSize + 1)
          .get(),
        adminDb
          .collection('estimates')
          .orderBy('contact.lastName')
          .startAt(lower)
          .endAt(lower + '\uf8ff')
          .limit(pageSize + 1)
          .get(),
      ])

      // Merge, deduplicate, sort by timestamp desc
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

      // Manual pagination against merged result
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

    // ── Standard paginated query path ─────────────────────────────────────────

    let cursorDoc: FirebaseFirestore.DocumentSnapshot | undefined = undefined
    if (cursorId) {
      const cursorSnap = await adminDb.collection('estimates').doc(cursorId).get()
      if (cursorSnap.exists) cursorDoc = cursorSnap
    }

    const query = applyPagination(baseQuery, pageSize, cursorDoc)
    const snapshot = await query.get()

    if (snapshot.empty) {
      return { success: true, data: [], nextCursor: null, hasMore: false }
    }

    const result = buildPaginatedResult<Estimate>(
      snapshot.docs,
      pageSize,
      (doc) => ({ ...(doc.data() as Estimate), id: doc.id })
    )

    return { success: true, ...result }

  } catch (error) {
    console.error('Error fetching filtered estimate submissions:', error)
    return { success: false, error: 'Failed to get estimate submissions.' }
  }
}