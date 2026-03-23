'use client'

import { Estimate, GlobalStats } from "@/lib/types"
//import AdminDashboardDisplay from "./adminDashboardDisplay"
import { useState } from "react"
import AdminTabSelector from "./adminTabSelector"
import AdminSettingsTab from "./adminSettingTab"
import AdminServiceAlertTab from "./adminServiceAlertTab"
import AdminSubmissionTab from "./adminSubmissionTab"

type AdminClientDashboardProps = {
    stats:GlobalStats,
    estimates: Estimate[],
    alerts: Estimate[],
    nextCursor_estimate: string,
    hasMore_estimate: boolean,
    nextCursor_alert: string,
    hasMore_alert:boolean
}

export default function AdminClientDashboard({stats, estimates, nextCursor_estimate, hasMore_estimate, alerts, nextCursor_alert, hasMore_alert}: AdminClientDashboardProps){
    const [viewState, updateViewState] = useState<'submissions'| 'serviceAlerts' | 'settings'>('submissions')

    return (
        <div className='p-6 space-y-8'>
            {/*<AdminDashboardDisplay stats={stats}/>*/}
            <div className='flex flex-col'>
                <AdminTabSelector setter={(tab: string) => updateViewState(tab as 'submissions'| 'serviceAlerts' | 'settings')} activeTab={viewState} />

                {viewState === 'submissions' && (<AdminSubmissionTab  globalStats={stats} estimates={estimates} initialNextCursor={nextCursor_estimate} initialHasMore={hasMore_estimate} />) }
                {viewState ==='settings' && (<AdminSettingsTab globalStats={stats}/>) }
                {viewState === 'serviceAlerts' && (<AdminServiceAlertTab globalStats={stats} alerts={alerts} initialNextCursor={nextCursor_alert}  initialHasMore={hasMore_alert}  />)}

            </div>
        </div>
    )
}