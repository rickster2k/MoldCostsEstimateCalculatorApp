'use server'

export async function generateEstimateId() {
    const estimateId = `MG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    return estimateId
}
