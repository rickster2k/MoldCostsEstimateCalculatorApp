export const dynamic = 'force-dynamic'

import { getServiceAlertSubmissionsPagination } from "@/app/actions/firebaseActions/estimateActions/alertTab/getAlertsPagination";
import { getEstimateSubmissionsPagination } from "@/app/actions/firebaseActions/estimateActions/estimateTab/getEstimateSubmissionsPagination";
import { getGlobalStats } from "@/app/actions/firebaseActions/globalStats/getGlobalStats";
import AdminClientDashboard from "@/components/admin/adminClientDashboard";
import { verifyAdminIsValid } from "@/lib/auth/verifyAdminIsValid";
import { Estimate, GlobalStats } from "@/lib/types";
import { toast } from "sonner";


export default async function Dashboard(){
    verifyAdminIsValid() //verify admin status


    const exampleGlobalStats: GlobalStats = {
        totalSubmissions: 142,
        totalAlerts: 89,
        totalEstimateValue: 684500,
        averageEstimateValue: 4820,
        requestRealEstimatesCount: 61,
        requestDiyBlueprintCount: 44,
        requestConsultantCount: 37,
        needsTestingCount: 53,
        pendingContractorMatch: 1,
        pendingBlueprintFulfillment: 8,
        pendingConsultationFulfillment: 5,
        handledContractorMatch: 2,
        handledBlueprint:2,
        handledConsultation:2,
        diyShop: {paymentUrl: "" , pricePoint: 0},
        remoteConsultShop: {paymentUrl: "" , pricePoint: 0}
    }

    const response = await getGlobalStats()
    if(!response.success){toast.error("Failed to get Global Stats using default values")}


    /*Grab estimate data with pagination  */
    const estimatePaginationResponse = await getEstimateSubmissionsPagination()
    let estimates: Estimate[] = []
    let nextCursor_estimate: string = ""
    let hasMore_estimate: boolean = false

    if (estimatePaginationResponse.success){
        estimates= estimatePaginationResponse.data
        nextCursor_estimate = estimatePaginationResponse.nextCursor ?? ""
        hasMore_estimate = estimatePaginationResponse.hasMore
    }

    /*Alerts */
    let alerts: Estimate[] = []
    let nextCursor_alert: string = ""
    let hasMore_alert: boolean = false
 
    const alertResponse = await getServiceAlertSubmissionsPagination()
    if (alertResponse.success) {
        alerts = alertResponse.data
        nextCursor_alert = alertResponse.nextCursor ?? ""
        hasMore_alert = alertResponse.hasMore
    }

    return (
        <AdminClientDashboard 
            stats={response.globalStats || exampleGlobalStats}
            estimates={estimates}
            nextCursor_estimate={nextCursor_estimate}
            hasMore_estimate={hasMore_estimate}
            alerts={alerts}
            nextCursor_alert={nextCursor_alert}
            hasMore_alert={hasMore_alert}
        />
    )
}