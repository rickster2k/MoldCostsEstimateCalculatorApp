// components/admin/adminEstimatePreview.tsx
'use client'

import { Estimate } from "@/lib/types"
import UserReport from "@/components/user/userReport"
import UserDownloadPdfModal from "@/components/user/userDownloadPdfModal"
import { X } from "lucide-react"

type Props = {
    estimate: Estimate
    onClose: () => void
}

export default function AdminEstimatePreview({ estimate, onClose }: Props) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div>
                    <p className="text-sm font-bold text-slate-800">
                        User Report Preview
                        <span className="ml-3 font-mono text-blue-600 text-sm">{estimate.estimateId}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Viewing as user</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* User report view */}
            <div className="p-6 w-full relative">
                {(estimate.blueprintPdf || estimate.consultationPdf) &&
                    <UserDownloadPdfModal estimate={estimate} />
                }
                <UserReport estimate={estimate} />
            </div>
        </div>
    )
}