'use server'

import { getAdminDb } from '@/lib/services/firebaseAdmin'
import { Estimate } from '@/lib/types'
import { DEFAULT_PAGE_SIZE, PaginatedResult, applyPagination, buildPaginatedResult } from '@/lib/utils/paginationUtils';

export async function getEstimateSubmissionsPagination(
  pageSize: number = DEFAULT_PAGE_SIZE,
  cursorId?: string
): Promise<{ success: true } & PaginatedResult<Estimate> | { success: false; error: string }> {
  try {
    const adminDb = getAdminDb()
    const baseQuery = adminDb.collection('estimates').orderBy('timestamp', 'desc')

    let cursorDoc = undefined
    if (cursorId) {
      const cursorSnap = await adminDb.collection('estimates').doc(cursorId).get()
      if (cursorSnap.exists) cursorDoc = cursorSnap
    }

    const query = applyPagination(baseQuery, pageSize, cursorDoc)
    const snapshot = await query.get()

    if (snapshot.empty) {
      return { success: false, error: 'No estimate submissions found.' }
    }

    const result = buildPaginatedResult<Estimate>(
      snapshot.docs,
      pageSize,
      (doc) => {
        const data = doc.data() as Estimate
        return {
          ...data,
          id: doc.id,
        }
      }
    )

    return { success: true, ...result }
  } catch (error) {
    console.error('Error fetching estimate submissions:', error)
    return { success: false, error: 'Failed to get estimate submissions.' }
  }
}