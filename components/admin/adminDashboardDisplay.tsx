'use client'

import { GlobalStats } from "@/lib/types";
import { signOut } from "next-auth/react";
import FulfillmentProgress from "./formatting/fulfillmentProgress";
import OverViewStats from "./formatting/overviewStats";
import DashboardDisplayHeader from "./formatting/dashboardDisplayHeader";
import FulfillmentQueue from "./formatting/fulfillmentQueue";
import HintTooltip from "../shared/hintToolTip";

type AdminDashboardDisplayProps = {
  stats: GlobalStats
}

export default function AdminDashboardDisplay({ stats }: AdminDashboardDisplayProps) {
  return (
    <div className="flex flex-col gap-8 space-y-4">
        <DashboardDisplayHeader>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Admin Dashboard
                </h1>
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                    Sign Out
                </button>
            </div>
        </DashboardDisplayHeader>
        
        <div className="flex flex-col gap-4 border-slate-200 shadow-theme1Shade rounded-2xl shadow-md pt-10 p-8">
            <h3 className="text-4xl font-semibold italic text-theme1">Overview</h3>
            <OverViewStats>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat
                    label="Total Submissions"
                    value={stats.totalSubmissions}
                    hint="Every user who completed the estimator and entered their contact details."
                />
                <Stat
                    label="Total Alerts"
                    value={stats.totalAlerts}
                    hint="Submissions where the user opted into at least one service request — these need follow-up."
                />
                <Stat
                    label="Avg Estimate"
                    value={`$${stats.averageEstimateValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    hint="Mean remediation estimate across all submissions, in USD."
                />
                <Stat
                    label="Total Est. Value"
                    value={`$${stats.totalEstimateValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    hint="Sum of all estimate amounts across every submission."
                />
                <Stat
                    label="Contractor Requests"
                    value={stats.requestRealEstimatesCount}
                    hint="Users who requested to be matched with local certified contractors."
                />
                <Stat
                    label="Blueprint Requests"
                    value={stats.requestDiyBlueprintCount}
                    hint="Users who requested the DIY Remediation Blueprint."
                />
                <Stat
                    label="Consultation Requests"
                    value={stats.requestConsultantCount}
                    hint="Users who requested a 1-on-1 expert consultation."
                />
                <Stat
                    label="Testing Requested"
                    value={stats.needsTestingCount}
                    hint="Users who answered 'yes' to needing professional mold testing."
                />
            </div> 
            </OverViewStats>

            <FulfillmentProgress>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Stat
                        label="Contractors Handled"
                        value={`${stats.handledContractorMatch} / ${stats.requestRealEstimatesCount}`}
                        hint="Contractor match requests marked as completed out of total requests."
                    />
                    <Stat
                        label="Blueprints Delivered"
                        value={`${stats.handledBlueprint} / ${stats.requestDiyBlueprintCount}`}
                        hint="Blueprint PDFs delivered to users out of total requests."
                    />
                    <Stat
                        label="Consultations Delivered"
                        value={`${stats.handledConsultation} / ${stats.requestConsultantCount}`}
                        hint="Consultation PDFs delivered to users out of total requests."
                    />
                </div>
            </FulfillmentProgress>
        </div>

        
        <FulfillmentQueue>
            <div className="flex flex-col gap-4 border-slate-200 shadow-theme1Shade rounded-2xl shadow-md pt-10 p-8">
                <h3 className="text-4xl font-semibold italic text-theme1">Action Required</h3>
                
                    {(stats.pendingContractorMatch > 0 || stats.pendingBlueprintFulfillment > 0 || stats.pendingConsultationFulfillment > 0) && (
                        <div className="flex flex-row gap-4">
                            {stats.pendingContractorMatch > 0 && (
                                <Stat
                                    label="Contractor Match Pending"
                                    value={stats.pendingContractorMatch}
                                    hint="Contractor match requests with no admin action taken yet."
                                    urgent
                                />
                            )}  
                            {stats.pendingBlueprintFulfillment > 0 && (
                            <Stat
                                label="Blueprints Pending"
                                value={stats.pendingBlueprintFulfillment}
                                hint="Blueprint requests where the admin has not yet uploaded a PDF — these need action."
                                urgent
                            />
                            )}
                            {stats.pendingConsultationFulfillment > 0 && (
                            <Stat
                                label="Consultations Pending"
                                value={stats.pendingConsultationFulfillment}
                                hint="Consultation requests where the admin has not yet uploaded a PDF — these need action."
                                urgent
                            />
                            )}
                        </div>
                    )}
            </div>            
        </FulfillmentQueue>   


        
        

        
    </div>
  )
}

function Stat({  label,  value,  hint,  urgent = false,}: {  label: string , value: number | string,  hint?: string,  urgent?: boolean}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        {hint && <HintTooltip text={hint} />}
      </div>
      <div className={`text-2xl font-black ${urgent ? 'text-red-500' : 'text-theme1Shade'}`}>
        {value}
      </div>
    </div>
  )
}

