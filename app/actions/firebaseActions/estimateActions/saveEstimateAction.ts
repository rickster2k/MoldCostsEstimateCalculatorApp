'use server'

import { Estimate, EstimateNoId } from "@/lib/types"
import { generateEstimateId } from "../../helperActions/generateEstimateId"
import { getAdminDb } from "@/lib/services/firebaseAdmin";

export async function saveEstimateAction(data: EstimateNoId) {
    try{
        //Call ai api here for caluculation given what data ? 
        console.log("data being passed is ", data);

        const id = crypto.randomUUID()
        const estimateId  = await generateEstimateId();
        const timestamp = new Date().toISOString()
        /* Create full object with ids generated here */
        const estimateSubmissionObj: Estimate = {
            id: id,
            estimateId: estimateId,
            timestamp: timestamp,
            estimateAmount: data.estimateAmount,
            data: data.data,
            estimateResults: data.estimateResults,
            testingStatus: data.testingStatus,
            foggingStatus: data.foggingStatus,
            requestRealEstimates: data.requestRealEstimates,
            requestDiyBlueprint: data.requestDiyBlueprint,
            requestConsultant: data.requestConsultant,
            contact: data.contact,
        }

        //Save submission to firestore
        const res = await saveEstimateToFirestore(estimateSubmissionObj)

        if(!res.success){
            return {
                success: false,
                error: "Failed to save Estimate. Please try Again"
            }
        }

        /* Any other global tracking call CALL HERE */
        return {
            success: true,
            id: id,
            estimateId: estimateId,
            timestamp: timestamp, 
        }
    }
    catch(e){
        console.error('Error in saveSubmission action:', e)
    
        return {
            success: false,
            error: 'Failed to save submission. Please try again.'
        }
    }
    
}


export async function saveEstimateToFirestore(estimate: Estimate) {
  try {
    const adminDb = getAdminDb()
    await adminDb
      .collection('estimates')
      .doc(estimate.id)
      .set(estimate)
    
    console.log('Estimate saved')
    return {
        success: true
    }
  } catch (error) {
    console.error('Error saving estimate:', error)
    return {
        success: false
    }
  }
}