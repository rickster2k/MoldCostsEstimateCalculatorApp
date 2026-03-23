'use client'

import { Estimate } from "@/lib/types"
import { getSignedPdfUrl } from "@/app/actions/firebaseActions/authActions/getSignedPdfUrl"
import { useState } from "react"
import { toast } from "sonner"
import { FileText, ShieldCheck, Download, X, AlertCircle } from "lucide-react"

type Props = {
    estimate: Estimate
}

type PdfType = 'blueprint' | 'consultation'

type ConfirmState = {
    pdfType: PdfType
    fileName: string
} | null

export default function UserDownloadPdfModal({ estimate }: Props) {
    const [confirm, setConfirm] = useState<ConfirmState>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    const hasBlueprintPdf = !!estimate.blueprintPdf
    const hasConsultationPdf = !!estimate.consultationPdf

    // ── Step 1: user clicks a PDF button → show confirmation ─────────────────

    const handleSelectPdf = (pdfType: PdfType) => {
        const pdf = pdfType === 'blueprint' ? estimate.blueprintPdf : estimate.consultationPdf
        if (!pdf?.name) return
        setConfirm({ pdfType, fileName: pdf.name })
    }

    // ── Step 2: user confirms → fetch signed URL and open ────────────────────

    const handleConfirmDownload = async () => {
        if (!confirm) return
        setIsDownloading(true)
        try {
            const result = await getSignedPdfUrl(estimate.id, confirm.fileName, confirm.pdfType)
            if (result.success) {
                window.open(result.url, '_blank')
                setConfirm(null)
            } else {
                toast.error('Failed to generate download link. Please try again.')
            }
        } catch {
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <>
            {/* ── Floating pill ─────────────────────────────────────────────── */}
            <div className="absolute top-3.5 right-6 flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5 mr-1">
                    <Download className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Your PDFs
                    </span>
                </div>

                {hasBlueprintPdf && (
                    <button
                        onClick={() => handleSelectPdf('blueprint')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Blueprint
                    </button>
                )}

                {hasConsultationPdf && (
                    <button
                        onClick={() => handleSelectPdf('consultation')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Consultation
                    </button>
                )}
            </div>

            {/* ── Confirmation modal ────────────────────────────────────────── */}
            {confirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isDownloading && setConfirm(null)}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
                        {/* Close */}
                        <button
                            onClick={() => setConfirm(null)}
                            disabled={isDownloading}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon + title */}
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                confirm.pdfType === 'blueprint'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-blue-100 text-blue-600'
                            }`}>
                                {confirm.pdfType === 'blueprint'
                                    ? <FileText className="w-5 h-5" />
                                    : <ShieldCheck className="w-5 h-5" />
                                }
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Download PDF</p>
                                <p className="text-xs text-slate-400">
                                    {confirm.pdfType === 'blueprint' ? 'DIY Blueprint' : 'Consultation Report'}
                                </p>
                            </div>
                        </div>

                        {/* File name */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <p className="text-xs text-slate-600 font-medium truncate">{confirm.fileName}</p>
                        </div>

                        <p className="text-xs text-slate-500">
                            Are you sure you want to download this file? This will open the PDF in a new tab — the link expires in 30 minutes.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={() => setConfirm(null)}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDownload}
                                disabled={isDownloading}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                                    confirm.pdfType === 'blueprint'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isDownloading ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}