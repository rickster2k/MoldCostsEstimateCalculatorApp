'use client'

import { GlobalStats } from "@/lib/types"
import AdminDashboardDisplay from "./adminDashboardDisplay"
import { useState } from "react"
import AdminTabSelector from "./adminTabSelector"
import AdminSettingsTab from "./adminSettingTab"
import AdminServiceAlertTab from "./adminServiceAlertTab"
import AdminSubmissionTab from "./adminSubmissionTab"

export default function AdminClientDashboard({stats}: {stats:GlobalStats}){
    const [viewState, updateViewState] = useState<'submissions'| 'serviceAlerts' | 'settings'>('submissions')

    return (
        <div className='max-w-7xl mx-auto p-6 space-y-8'>
            <AdminDashboardDisplay stats={stats}/>
            <div className='flex flex-col'>
                <AdminTabSelector setter={(tab: string) => updateViewState(tab as 'submissions'| 'serviceAlerts' | 'settings')} activeTab={viewState} />

                {viewState === 'submissions' && (<AdminSubmissionTab  globalStats={stats}/>) }
                {viewState ==='settings' && (<AdminSettingsTab globalStats={stats}/>) }
                {viewState === 'serviceAlerts' && (<AdminServiceAlertTab globalStats={stats}/>)}

            </div>
        </div>
    )
}