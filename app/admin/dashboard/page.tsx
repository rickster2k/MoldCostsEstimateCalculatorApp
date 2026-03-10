import AdminClientDashboard from "@/components/admin/adminClientDashboard";
import { GlobalStats } from "@/lib/types";

export default function Dashboard(){
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
    }
    return (
        <AdminClientDashboard stats={exampleGlobalStats}/>
    )
}