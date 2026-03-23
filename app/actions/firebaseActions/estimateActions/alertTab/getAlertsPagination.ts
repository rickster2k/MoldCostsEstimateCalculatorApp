'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { DEFAULT_PAGE_SIZE, PaginatedResult,  } from '@/lib/utils/paginationUtils'

export async function getServiceAlertSubmissionsPagination(
  pageSize: number = DEFAULT_PAGE_SIZE,
  cursorId?: string
): Promise<{ success: true } & PaginatedResult<Estimate> | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()

    // Always-on filter: only docs where at least one service was requested.
    // Firestore doesn't support OR across fields natively so we use
    // requestRealEstimates as the anchor and union the other two client-side
    // would be expensive — instead we use a composite approach:
    // fetch all three boolean==true sets and merge + sort + paginate manually.

    const [realSnap, blueprintSnap, consultSnap] = await Promise.all([
      adminDb.collection('estimates').where('requestRealEstimates', '==', true).get(),
      adminDb.collection('estimates').where('requestDiyBlueprint', '==', true).get(),
      adminDb.collection('estimates').where('requestConsultant', '==', true).get(),
    ])

    // Merge, deduplicate, sort by timestamp desc
    const seen = new Set<string>()
    const merged: Estimate[] = []

    for (const snap of [realSnap, blueprintSnap, consultSnap]) {
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

    if (merged.length === 0) {
      return { success: true, data: [], nextCursor: null, hasMore: false }
    }

    // Manual cursor-based pagination against the merged array
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

  } catch (error) {
    console.error('Error fetching service alert submissions:', error)
    return { success: false, error: 'Failed to get service alert submissions.' }
  }
}