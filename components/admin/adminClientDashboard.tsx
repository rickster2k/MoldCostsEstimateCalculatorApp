'use client'

import { GlobalStats } from "@/lib/types"
import AdminDashboardDisplay from "./adminDashboardDisplay"

export default function AdminClientDashboard({stats}: {stats:GlobalStats}){
    return (
        <div className='max-w-7xl mx-auto p-6 space-y-8'>
            <AdminDashboardDisplay stats={stats}/>

        </div>
    )
}