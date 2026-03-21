'use client'
import { CalculationResult, ContactInfo, Estimate, EstimateData, EstimateNoId } from "@/lib/types"
import { useState } from "react"
import ContactStep from "./contactStep"
import { toast } from "sonner"
import { calculateEstimate } from "@/app/actions/geminiActions/calculateEstimate"
import { saveEstimateAction } from "@/app/actions/firebaseActions/estimateActions/saveEstimateAction"
import EstimateSentStep from "./estimateSentStep"
import { sendEstimateEmail } from "@/app/actions/resendActions/sendEstimateEmail"
import { verifyUserAccess } from "@/app/actions/firebaseActions/verifyUserAccess"

type IntakeClientProps = {
    contactInfo: ContactInfo
    setContact: (c: ContactInfo) => void
    zipCode: string
    estimateData: EstimateData
    goBack: () => void
}

// ── Fake results — swap out once Gemini API key is available ──────────────────
const FAKE_RESULTS: CalculationResult = {
    lowEstimate:     3200,
    highEstimate:    4800,
    averageEstimate: 4000,
    breakdown: {
        baseCost:              2200,
        severityAdjustment:    880,
        complexityAdjustment:  660,
        additionalServices:    260,
        foggingCost:           0,
    },
}
const USE_FAKE_RESULTS = true // TODO: set to false once Gemini API key is configured
// ─────────────────────────────────────────────────────────────────────────────

export default function IntakeClient({ contactInfo, setContact, zipCode, estimateData, goBack }: IntakeClientProps) {

    contactInfo.firstName = contactInfo.firstName.toLowerCase()
    contactInfo.lastName  = contactInfo.lastName.toLowerCase()

    const [isCalculating, setIsCalculating]       = useState(false)
    const [activeSubmission, setActiveSubmission] = useState<Estimate | null>(null)
    const [submitted, setSubmitted]               = useState(false)

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCalculating(true)
        try {
            // Step 0: Guard — ensure required data exists
            if (!contactInfo || !estimateData) {
                toast.error("Please make sure all information is filled out")
                return
            }

            // Step 1: Get calculation results
            // Use local variable (not state) for all downstream steps —
            // setResults is async and state won't be updated until next render.
            let results: CalculationResult

            if (USE_FAKE_RESULTS) {
                console.warn("⚠️ Using fake results — swap USE_FAKE_RESULTS to false once API key is set")
                results = FAKE_RESULTS
            } else {
                console.log("Calling Gemini calculateEstimate...")
                const response = await calculateEstimate(estimateData)
                if (!response.success || !response.data) {
                    console.error("Gemini error:", response.error)
                    toast.error("There was a problem calculating your estimate. Please try again.")
                    return
                }
                console.log("Gemini response:", response.data)
                results = response.data
                toast.success("Your results have been calculated!")
            }

            // Step 2: Build submission object
            const estimateSubmissionObj: EstimateNoId = {
                estimateAmount:      results.averageEstimate,
                data:                estimateData,
                estimateResults:     results,
                testingStatus:       'not-sure',
                requestRealEstimates: false,
                requestDiyBlueprint:  false,
                requestConsultant:    false,
                contact:             contactInfo,
            }

            // Step 3: Save to Firestore
            console.log("Saving estimate to Firestore...")
            const responseSave = await saveEstimateAction(estimateSubmissionObj)
            if (!responseSave.success) {
                throw new Error(responseSave.error || 'Failed to save submission')
            }
            if (!responseSave.estimateId) {
                throw new Error("Firestore save succeeded but estimateId was not returned")
            }

            // Step 3a: Build full Estimate object with returned metadata
            const estimateFullObj: Estimate = {
                id:                   responseSave.id,
                estimateId:           responseSave.estimateId,
                timestamp:            responseSave.timestamp,
                estimateAmount:       estimateSubmissionObj.estimateAmount,
                data:                 estimateSubmissionObj.data,
                estimateResults:      estimateSubmissionObj.estimateResults,
                testingStatus:        estimateSubmissionObj.testingStatus,
                requestRealEstimates: estimateSubmissionObj.requestRealEstimates,
                requestDiyBlueprint:  estimateSubmissionObj.requestDiyBlueprint,
                requestConsultant:    estimateSubmissionObj.requestConsultant,
                contact:              estimateSubmissionObj.contact,
            }

            // Step 4: Send confirmation email (non-blocking — failure doesn't stop the flow)
            try {
                const emailResult = await sendEstimateEmail({
                    toEmail:         estimateFullObj.contact.email,
                    firstName:       estimateFullObj.contact.firstName,
                    estimateId:      estimateFullObj.estimateId,
                    estimateResults: estimateFullObj.estimateResults,
                })
                if (!emailResult.success) {
                    console.error("Email send failed:", emailResult.error)
                    toast.error("Your estimate is saved but we could not send the confirmation email. You can still view it from your report page.")
                }
            } catch (e) {
                console.error("Email error:", e)
                toast.error("Your estimate is saved but we could not send the confirmation email.")
            }

            // Step 5: Set httpOnly session cookie
            await verifyUserAccess(
                estimateFullObj.contact.email.trim().toLowerCase(),
                estimateFullObj.estimateId,
            )

            // Step 6: Persist to sessionStorage for immediate viewing
            sessionStorage.setItem('estimate', JSON.stringify(estimateFullObj))

            // Step 7: Notify header of session change
            window.dispatchEvent(new Event('estimate-session-change'))

            // Step 8: Update local state to show confirmation screen
            setActiveSubmission(estimateFullObj)
            setSubmitted(true)

        } catch (err) {
            console.error("handleContactSubmit error:", err)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsCalculating(false)
        }
    }

    // Show confirmation screen once submitted
    if (submitted && activeSubmission) {
        return <EstimateSentStep firstName={activeSubmission.contact.firstName} email={activeSubmission.contact.email} estimateId={activeSubmission.estimateId} />
    }

    return (
        <ContactStep
            contact={contactInfo}
            setContact={setContact}
            dataZipCode={zipCode}
            onSubmit={handleContactSubmit}
            onBack={goBack}
            isSubmitting={isCalculating}
        />
    )
}