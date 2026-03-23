'use client'

import { Estimate, GlobalStats } from "@/lib/types"
import { useRef, useState } from "react"
import { usePagination } from "@/lib/hooks/usePagination"
import PaginationControls from "@/components/shared/paginationControls"
import { toast } from "sonner"

import { getServiceAlertSubmissionsPagination } from "@/app/actions/firebaseActions/estimateActions/alertTab/getAlertsPagination"
import { getServiceAlertSubmissionsFiltered } from "@/app/actions/firebaseActions/estimateActions/alertTab/getAlertsFiltered"
import { getAllServiceAlertSubmissionsFiltered } from "@/app/actions/firebaseActions/estimateActions/alertTab/getAllAlertsFiltered"

import { downloadCsv, estimatesToCsvString } from "@/lib/utils/csvUtils"
import { Search, Download, Calendar, X, ChevronDown, Bell, FileText, ShieldCheck, Filter, UploadCloud, Trash2, Eye, CheckCircle2 } from "lucide-react"
import { EstimateFilters, EMPTY_ESTIMATE_FILTERS, hasActiveEstimateFilters } from "@/components/admin/adminSubmissionTab"
import { Capitalize, formatTimestamp } from "@/lib/utils/formattingUtils"

import { updateEstimatePdf } from "@/app/actions/firebaseActions/estimateActions/alertTab/updateEstimatePdf"
import { deleteEstimatePdf } from "@/app/actions/firebaseActions/estimateActions/alertTab/deleteEstimatePdf"
import { getSignedPdfUrl } from "@/app/actions/firebaseActions/authActions/getSignedPdfUrl"
import { uploadEstimatePdf } from "@/app/actions/firebaseActions/estimateActions/alertTab/uploadEstimatePdf"

// ── Service alert specific filter ─────────────────────────────────────────────

type AlertFilters = Omit<EstimateFilters, 'serviceRequest'> & { serviceRequest: '' }

const EMPTY_ALERT_FILTERS: AlertFilters = {
    ...EMPTY_ESTIMATE_FILTERS,
    serviceRequest: '',
}

function hasActiveAlertFilters(f: AlertFilters): boolean {
    return hasActiveEstimateFilters({ ...f, serviceRequest: '' })
}

// ── PDF type ──────────────────────────────────────────────────────────────────

type PdfType = 'blueprint' | 'consultation'

// ── Badge helpers ─────────────────────────────────────────────────────────────

function YesBadge({ color }: { color: 'emerald' | 'orange' | 'blue' }) {
    const styles = {
        emerald: 'bg-emerald-100 text-emerald-700',
        orange: 'bg-orange-100 text-orange-700',
        blue: 'bg-blue-100 text-blue-700',
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[color]}`}>
            Yes
        </span>
    )
}

function NoBadge() {
    return <span className="text-slate-300 text-xs font-medium">No</span>
}

// ── Search bar ────────────────────────────────────────────────────────────────

type SearchBarProps = {
    onSearch: (filters: AlertFilters) => void
    onClear: () => void
    onExport: () => void
    isSearching: boolean
    isExporting: boolean
}

function AlertSearchBar({ onSearch, onClear, onExport, isSearching, isExporting }: SearchBarProps) {
    const [filters, setFilters] = useState<AlertFilters>(EMPTY_ALERT_FILTERS)
    const isActive = hasActiveAlertFilters(filters)

    const handleSearchTypeChange = (type: AlertFilters['searchType']) => {
        setFilters({ ...EMPTY_ALERT_FILTERS, searchType: type })
    }

    return (
        <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative">
                    <select
                        value={filters.searchType}
                        onChange={(e) => handleSearchTypeChange(e.target.value as AlertFilters['searchType'])}
                        className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Filter by…</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="estimateId">Estimate ID</option>
                        <option value="zipCode">Zip Code</option>
                        <option value="dateRange">Date Range</option>
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex-1 flex items-center gap-2">
                    {(['name', 'email', 'estimateId', 'zipCode'] as const).includes(filters.searchType as 'name' | 'email' | 'estimateId' | 'zipCode') && (
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={
                                    filters.searchType === 'name' ? 'Search by name…' :
                                    filters.searchType === 'email' ? 'Search by email…' :
                                    filters.searchType === 'estimateId' ? 'Search by Estimate ID…' :
                                    'Search by zip code…'
                                }
                                value={filters.searchValue}
                                onChange={(e) => setFilters({ ...filters, searchValue: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && isActive && onSearch(filters)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {filters.searchType === 'dateRange' && (
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase tracking-widest">From</div>
                            </div>
                            <span className="text-slate-400 font-bold text-sm">–</span>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase tracking-widest">To</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {isActive && (
                        <button
                            onClick={() => onSearch(filters)}
                            disabled={isSearching}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <Search className="w-3.5 h-3.5" />
                            {isSearching ? 'Searching…' : 'Search'}
                        </button>
                    )}
                    {isActive && (
                        <button
                            onClick={() => { setFilters(EMPTY_ALERT_FILTERS); onClear() }}
                            className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                    )}
                    <button
                        onClick={onExport}
                        disabled={isExporting}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {isExporting ? 'Exporting…' : 'CSV'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── PDF action cell ───────────────────────────────────────────────────────────

type PdfActionCellProps = {
    estimate: Estimate
    pdfType: PdfType
    isUploading: boolean
    focusedId: string | null
    onUploadClick: (id: string, type: PdfType) => void
    onView: (estimate: Estimate, type: PdfType) => void
    onDelete: (estimate: Estimate, type: PdfType) => void
}

function PdfActionCell({
    estimate,
    pdfType,
    isUploading,
    focusedId,
    onUploadClick,
    onView,
    onDelete,
}: PdfActionCellProps) {
    const pdf = pdfType === 'blueprint' ? estimate.blueprintPdf : estimate.consultationPdf
    const isThisUploading = isUploading && focusedId === estimate.id
    const color = pdfType === 'blueprint' ? 'emerald' : 'blue'

    const colorStyles = {
        emerald: {
            badge: 'bg-emerald-50 border-emerald-100',
            view: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
            delete: 'text-red-400 hover:text-red-500 hover:bg-red-50',
            upload: 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50',
            label: 'Blueprint',
            icon: FileText,
        },
        blue: {
            badge: 'bg-blue-50 border-blue-100',
            view: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
            delete: 'text-red-400 hover:text-red-500 hover:bg-red-50',
            upload: 'text-slate-400 hover:text-blue-600 hover:bg-blue-50',
            label: 'Consult',
            icon: ShieldCheck,
        },
    }

    const s = colorStyles[color]

    if (isThisUploading) {
        return (
            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
            </span>
        )
    }

    if (pdf) {
        return (
            <div className={`inline-flex items-center gap-0.5 rounded-lg border px-1 ${s.badge}`}>
                <button
                    onClick={() => onView(estimate, pdfType)}
                    className={`p-1.5 rounded transition-colors ${s.view}`}
                    title={`View ${s.label} PDF`}
                >
                    <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => onDelete(estimate, pdfType)}
                    className={`p-1.5 rounded transition-colors ${s.delete}`}
                    title={`Delete ${s.label} PDF`}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => onUploadClick(estimate.id, pdfType)}
            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors ${s.upload}`}
            title={`Upload ${s.label} PDF`}
        >
            <UploadCloud className="w-3.5 h-3.5" />
            {s.label}
        </button>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

type AdminServiceAlertTabProps = {
    globalStats: GlobalStats
    alerts: Estimate[]
    initialNextCursor: string | null
    initialHasMore: boolean
}

export default function AdminServiceAlertTab({
    globalStats,
    alerts,
    initialNextCursor,
    initialHasMore,
}: AdminServiceAlertTabProps) {
    const [activeFilters, setActiveFilters] = useState<AlertFilters>(EMPTY_ALERT_FILTERS)
    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [focusedId, setFocusedId] = useState<string | null>(null)
    const [focusedPdfType, setFocusedPdfType] = useState<PdfType | null>(null)

    // ── Pagination ────────────────────────────────────────────────────────────

    const fetchPage = hasActiveAlertFilters(activeFilters)
        ? (pageSize: number, cursor?: string) =>
              getServiceAlertSubmissionsFiltered(activeFilters, pageSize, cursor)
        : getServiceAlertSubmissionsPagination

    const {
        data: alertList,
        currentPage,
        hasMore,
        loading,
        handleNext,
        handlePrevious,
        resetToData,
    } = usePagination<Estimate>({
        initialData: alerts,
        initialNextCursor,
        initialHasMore,
        pageSize: 10,
        fetchPage,
    })

    // ── Search ────────────────────────────────────────────────────────────────

    const handleSearch = async (filters: AlertFilters) => {
        setIsSearching(true)
        setActiveFilters(filters)
        const result = await getServiceAlertSubmissionsFiltered(filters)
        if (result.success) {
            resetToData(result.data, result.nextCursor, result.hasMore)
        } else {
            toast.error('Search failed. Please try again.')
        }
        setIsSearching(false)
    }

    const handleClearSearch = async () => {
        setIsSearching(true)
        setActiveFilters(EMPTY_ALERT_FILTERS)
        const result = await getServiceAlertSubmissionsPagination()
        if (result.success) {
            resetToData(result.data, result.nextCursor, result.hasMore)
        }
        setIsSearching(false)
    }

    // ── CSV export ────────────────────────────────────────────────────────────

    const handleCsvExport = async () => {
        setIsExporting(true)
        try {
            const result = await getAllServiceAlertSubmissionsFiltered(activeFilters)
            if (!result.success) { toast.error('Failed to export data'); return }
            if (result.data.length === 0) { toast.info('No data to export'); return }
            const timestamp = new Date().toISOString().split('T')[0]
            downloadCsv(estimatesToCsvString(result.data), `service-alerts-${timestamp}.csv`)
            toast.success(`Exported ${result.data.length} alerts`)
        } catch {
            toast.error('An error occurred during export')
        } finally {
            setIsExporting(false)
        }
    }

    // ── PDF upload ────────────────────────────────────────────────────────────

    const handleUploadClick = (id: string, type: PdfType) => {
        setFocusedId(id)
        setFocusedPdfType(type)
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !focusedId || !focusedPdfType) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const uploadResult = await uploadEstimatePdf(formData, focusedId, focusedPdfType)
            if (!uploadResult.success || !uploadResult.downloadUrl) {
                toast.error(uploadResult.error || 'Failed to upload PDF')
                return
            }
            const result = await updateEstimatePdf(focusedId, focusedPdfType, {
                name: file.name,
                url: uploadResult.downloadUrl,
            })
            if (result.success) {
                toast.success(`${focusedPdfType === 'blueprint' ? 'Blueprint' : 'Consultation'} PDF uploaded successfully!`)
                const refreshed = await fetchPage(10, undefined)
                if (refreshed.success) resetToData(refreshed.data, refreshed.nextCursor, refreshed.hasMore)
            } else {
                toast.error(result.error || 'Failed to upload PDF')
            }
        } catch {
            toast.error('An error occurred while uploading the file')
        } finally {
            setIsUploading(false)
            setFocusedId(null)
            setFocusedPdfType(null)
            e.target.value = ''
        }
    }

    // ── PDF view ──────────────────────────────────────────────────────────────

    const handleViewPdf = async (estimate: Estimate, type: PdfType) => {
        const pdf = type === 'blueprint' ? estimate.blueprintPdf : estimate.consultationPdf
        if (!pdf?.name || !estimate.id) {
            toast.info('No PDF attached')
            return
        }
        const result = await getSignedPdfUrl(estimate.id, pdf.name, type)
        if (result.success) {
            window.open(result.url, '_blank')
        } else {
            toast.error('Failed to load PDF')
        }
    }

    // ── PDF delete ────────────────────────────────────────────────────────────

    const handleDeletePdf = async (estimate: Estimate, type: PdfType) => {
        const result = await deleteEstimatePdf(estimate.id, type)
        if (result.success) {
            toast.success(`${type === 'blueprint' ? 'Blueprint' : 'Consultation'} PDF removed`)
            const refreshed = await fetchPage(10, undefined)
            if (refreshed.success) resetToData(refreshed.data, refreshed.nextCursor, refreshed.hasMore)
        } else {
            toast.error('Failed to delete PDF')
        }
    }

    // ── Stat cards ────────────────────────────────────────────────────────────

    const statCards = [
        { label: 'Total Alerts', value: globalStats.totalAlerts.toLocaleString(), icon: Bell, color: 'text-red-500', bg: 'bg-red-100' },
        { label: 'Real Estimate Requests', value: globalStats.requestRealEstimatesCount.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Blueprint Requests', value: globalStats.requestDiyBlueprintCount.toLocaleString(), icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100' },
        { label: 'Consultation Requests', value: globalStats.requestConsultantCount.toLocaleString(), icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Pending Blueprint', value: globalStats.pendingBlueprintFulfillment.toLocaleString(), icon: UploadCloud, color: 'text-orange-500', bg: 'bg-orange-100' },
        { label: 'Pending Consultation', value: globalStats.pendingConsultationFulfillment.toLocaleString(), icon: UploadCloud, color: 'text-blue-600', bg: 'bg-blue-100' },
    ]

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* Stat cards 
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
                        <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center ${card.color}`}>
                            <card.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{card.label}</div>
                            <div className="text-xl font-bold text-slate-900 mt-0.5">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>*/}

            {/* Table card */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">

                {/* Search bar — outside scroll container so it stays full width */}
                <AlertSearchBar
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    isSearching={isSearching}
                    onExport={handleCsvExport}
                    isExporting={isExporting}
                />

                {/* Scrollable table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-275">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">#</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Name</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Email</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Preferred</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Estimate ID</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Zip</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Real Est.</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Blueprint</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Consult</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Blueprint PDF</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Consult PDF</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isSearching ? (
                                <tr>
                                    <td colSpan={13} className="px-6 py-10 text-center text-slate-400 text-sm">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Searching…
                                        </span>
                                    </td>
                                </tr>
                            ) : alertList.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                                        {hasActiveAlertFilters(activeFilters)
                                            ? 'No alerts match your search.'
                                            : 'No service alerts found.'}
                                    </td>
                                </tr>
                            ) : (
                                alertList.map((est, index) => (
                                    <tr key={est.id} className="hover:bg-red-50/20 transition-colors">
                                        <td className="px-4 py-3 text-slate-400 text-xs font-medium">
                                            {currentPage * 10 + index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                            {formatTimestamp(est.timestamp)}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                                            {Capitalize(est.contact.firstName)} {Capitalize(est.contact.lastName)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 text-xs">
                                            {est.contact.email}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {est.contact.phone || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs capitalize">
                                            {est.contact.preferredContact || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-blue-600 text-xs">
                                            {est.estimateId}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-slate-500 text-xs">
                                            {est.contact.zipCode}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {est.requestRealEstimates ? <YesBadge color="emerald" /> : <NoBadge />}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {est.requestDiyBlueprint ? <YesBadge color="orange" /> : <NoBadge />}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {est.requestConsultant ? <YesBadge color="blue" /> : <NoBadge />}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {est.requestDiyBlueprint ? (
                                                <PdfActionCell
                                                    estimate={est}
                                                    pdfType="blueprint"
                                                    isUploading={isUploading}
                                                    focusedId={focusedId}
                                                    onUploadClick={handleUploadClick}
                                                    onView={handleViewPdf}
                                                    onDelete={handleDeletePdf}
                                                />
                                            ) : (
                                                <span className="text-slate-200 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {est.requestConsultant ? (
                                                <PdfActionCell
                                                    estimate={est}
                                                    pdfType="consultation"
                                                    isUploading={isUploading}
                                                    focusedId={focusedId}
                                                    onUploadClick={handleUploadClick}
                                                    onView={handleViewPdf}
                                                    onDelete={handleDeletePdf}
                                                />
                                            ) : (
                                                <span className="text-slate-200 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-slate-100">
                    <PaginationControls
                        currentPage={currentPage}
                        hasMore={hasMore}
                        loading={loading}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                </div>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
            />
        </div>
    )
}