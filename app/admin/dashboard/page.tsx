export const dynamic = 'force-dynamic'

import { getGlobalStats } from "@/app/actions/firebaseActions/globalStats/getGlobalStats";
import AdminClientDashboard from "@/components/admin/adminClientDashboard";
import { verifyAdminIsValid } from "@/lib/auth/verifyAdminIsValid";
import { GlobalStats } from "@/lib/types";
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
    return (
        <AdminClientDashboard stats={response.globalStats || exampleGlobalStats}/>
    )
}