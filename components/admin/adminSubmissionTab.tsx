'use client'

import { Estimate, GlobalStats } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"
import {Search,Download,Calendar,X,CheckCircle2,ExternalLink,ChevronDown,DollarSign,ClipboardList,Bell,FileText,ShieldCheck,Filter} from "lucide-react"


/*Filter actions Pagination */
import { getEstimateSubmissionsPagination } from "@/app/actions/firebaseActions/estimateActions/estimateTab/getEstimateSubmissionsPagination"


/*Helper imports */
import { Capitalize, formatTimestamp } from "@/lib/utils/formattingUtils"
import { downloadCsv, estimatesToCsvString } from "@/lib/utils/csvUtils"

/*Pagination Imports  */
import { usePagination } from "@/lib/hooks/usePagination"
import PaginationControls from "../shared/paginationControls"
import { getEstimateSubmissionsFiltered } from "@/app/actions/firebaseActions/estimateActions/estimateTab/getEstimateSubmissionsFiltered"
import { getAllEstimateSubmissionsFiltered } from "@/app/actions/firebaseActions/estimateActions/estimateTab/getAllEstimateSubmissionsFiltered"
import AdminEstimatePreview from "./adminEstimatePreview"

// ── Filter types ──────────────────────────────────────────────────────────────

export type EstimateFilters = {
    searchType: 'name' | 'email' | 'estimateId' | 'zipCode' | 'dateRange' | 'serviceRequest' | ''
    searchValue: string
    serviceRequest: 'realEstimates' | 'blueprint' | 'consultant' | ''
    dateFrom: string
    dateTo: string
}

export const EMPTY_ESTIMATE_FILTERS: EstimateFilters = {
    searchType: '',
    searchValue: '',
    serviceRequest: '',
    dateFrom: '',
    dateTo: '',
}

export function hasActiveEstimateFilters(filters: EstimateFilters): boolean {
    return (
        (['name', 'email', 'estimateId', 'zipCode'].includes(filters.searchType) && filters.searchValue.trim() !== '') ||
        (filters.searchType === 'serviceRequest' && filters.serviceRequest !== '') ||
        (filters.searchType === 'dateRange' && (filters.dateFrom !== '' || filters.dateTo !== ''))
    )
}

// ── Props ─────────────────────────────────────────────────────────────────────

type AdminSubmissionTabProps = {
    globalStats: GlobalStats
    estimates: Estimate[]
    initialNextCursor: string | null
    initialHasMore: boolean
}

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

// ── Search bar sub-component ──────────────────────────────────────────────────

type SearchBarProps = {
    onSearch: (filters: EstimateFilters) => void
    onClear: () => void
    onExport: () => void
    isSearching: boolean
    isExporting: boolean
}

function AdminSubmissionSearchBar({ onSearch, onClear, onExport, isSearching, isExporting }: SearchBarProps) {
    const [filters, setFilters] = useState<EstimateFilters>(EMPTY_ESTIMATE_FILTERS)
    const isActive = hasActiveEstimateFilters(filters)

    const handleSearchTypeChange = (type: EstimateFilters['searchType']) => {
        setFilters({ ...EMPTY_ESTIMATE_FILTERS, searchType: type })
    }

    const handleSubmit = () => {
        if (isActive) onSearch(filters)
    }

    const handleClear = () => {
        setFilters(EMPTY_ESTIMATE_FILTERS)
        onClear()
    }

    return (
        <div className="p-4 border-b border-slate-100 space-y-3">
            {/* Top row: search type + export */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search type selector */}
                <div className="relative">
                    <select
                        value={filters.searchType}
                        onChange={(e) => handleSearchTypeChange(e.target.value as EstimateFilters['searchType'])}
                        className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Filter by…</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="estimateId">Estimate ID</option>
                        <option value="zipCode">Zip Code</option>
                        <option value="dateRange">Date Range</option>
                        <option value="serviceRequest">Service Request</option>
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* Contextual input(s) */}
                <div className="flex-1 flex items-center gap-2">
                    {(['name', 'email', 'estimateId', 'zipCode'] as const).includes(filters.searchType as 'name' | 'email' | 'estimateId' | 'zipCode') && (
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={
                                    filters.searchType === 'name' ? 'Search by first or last name…' :
                                    filters.searchType === 'email' ? 'Search by email address…' :
                                    filters.searchType === 'estimateId' ? 'Search by Estimate ID…' :
                                    'Search by zip code…'
                                }
                                value={filters.searchValue}
                                onChange={(e) => setFilters({ ...filters, searchValue: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase tracking-widest">To</div>
                            </div>
                        </div>
                    )}

                    {filters.searchType === 'serviceRequest' && (
                        <div className="relative flex-1">
                            <select
                                value={filters.serviceRequest}
                                onChange={(e) => setFilters({ ...filters, serviceRequest: e.target.value as EstimateFilters['serviceRequest'] })}
                                className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select service…</option>
                                <option value="realEstimates">Real Estimates</option>
                                <option value="blueprint">DIY Blueprint</option>
                                <option value="consultant">Consultation</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    {isActive && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSearching}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <Search className="w-3.5 h-3.5" />
                            {isSearching ? 'Searching…' : 'Search'}
                        </button>
                    )}
                    {isActive && (
                        <button
                            onClick={handleClear}
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

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminSubmissionTab({
    globalStats,
    estimates,
    initialNextCursor,
    initialHasMore,
}: AdminSubmissionTabProps) {
    const [activeFilters, setActiveFilters] = useState<EstimateFilters>(EMPTY_ESTIMATE_FILTERS)
    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null)

    // ── Pagination ──────────────────────────────────────────────────────────

    const fetchPage = hasActiveEstimateFilters(activeFilters)
        ? (pageSize: number, cursor?: string) =>
              getEstimateSubmissionsFiltered(activeFilters, pageSize, cursor)
        : getEstimateSubmissionsPagination

    const {
        data: estimateList,
        currentPage,
        hasMore,
        loading,
        handleNext,
        handlePrevious,
        resetToData,
    } = usePagination<Estimate>({
        initialData: estimates,
        initialNextCursor,
        initialHasMore,
        pageSize: 10,
        fetchPage,
        onPageChange: () => {
            setSelectedEstimate(null)
        },
    })

    // ── Search handlers ─────────────────────────────────────────────────────

    const handleSearch = async (filters: EstimateFilters) => {
        setIsSearching(true)
        setActiveFilters(filters)
        setSelectedEstimate(null)

        const result = await getEstimateSubmissionsFiltered(filters)
        if (result.success) {
            resetToData(result.data, result.nextCursor, result.hasMore)
        } else {
            toast.error('Search failed. Please try again.')
        }
        setIsSearching(false)
    }

    const handleClearSearch = async () => {
        setIsSearching(true)
        setActiveFilters(EMPTY_ESTIMATE_FILTERS)
        setSelectedEstimate(null)

        const result = await getEstimateSubmissionsPagination()
        if (result.success) {
            resetToData(result.data, result.nextCursor, result.hasMore)
        }
        setIsSearching(false)
    }

    // ── CSV Export ──────────────────────────────────────────────────────────

    const handleCsvExport = async () => {
        setIsExporting(true)
        try {
            const result = await getAllEstimateSubmissionsFiltered(activeFilters)

            if (!result.success) {
                toast.error('Failed to export data')
                return
            }
            if (result.data.length === 0) {
                toast.info('No data to export')
                return
            }

            const csvString = estimatesToCsvString(result.data)
            const timestamp = new Date().toISOString().split('T')[0]
            const filterLabel = hasActiveEstimateFilters(activeFilters)
                ? `-${activeFilters.searchType || 'filtered'}`
                : '-all'
            const filename = `submissions${filterLabel}-${timestamp}.csv`

            downloadCsv(csvString, filename)
            toast.success(`Exported ${result.data.length} submissions`)
        } catch (error) {
            console.error('CSV export error:', error)
            toast.error('An error occurred during export')
        } finally {
            setIsExporting(false)
        }
    }

    // ── Stat cards ──────────────────────────────────────────────────────────

    const statCards = [
        {
            label: 'Total Submissions',
            value: globalStats.totalSubmissions.toLocaleString(),
            icon: ClipboardList,
            color: 'text-slate-600',
            bg: 'bg-slate-100',
        },
        {
            label: 'Total Est. Value',
            value: `$${globalStats.totalEstimateValue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100',
        },
        {
            label: 'Service Alerts',
            value: globalStats.totalAlerts.toLocaleString(),
            icon: Bell,
            color: 'text-red-500',
            bg: 'bg-red-100',
        },/*
        {
            label: 'Pending Contractor Match',
            value: globalStats.pendingContractorMatch.toLocaleString(),
            icon: CheckCircle2,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
        },
        {
            label: 'Pending Blueprint',
            value: globalStats.pendingBlueprintFulfillment.toLocaleString(),
            icon: FileText,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
        },
        {
            label: 'Pending Consultation',
            value: globalStats.pendingConsultationFulfillment.toLocaleString(),
            icon: ShieldCheck,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },*/
    ]

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Stat cards */}
            <div className="flex flex-wrap justify-center  gap-16">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3 min-w-36 items-center text-center">
                        <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center ${card.color}`}>
                            <card.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{card.label}</div>
                            <div className="text-xl font-bold text-slate-900 mt-0.5">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                     <table className="w-full text-sm min-w-300">
                        <thead>
                            {/* Search bar row */}
                            <tr>
                                <td colSpan={14} className="p-0">
                                    <AdminSubmissionSearchBar
                                        onSearch={handleSearch}
                                        onClear={handleClearSearch}
                                        isSearching={isSearching}
                                        onExport={handleCsvExport}
                                        isExporting={isExporting}
                                    />
                                </td>
                            </tr>

                            {/* Column headers */}
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">#</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Name</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Email</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Zip</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Estimate ID</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Estimate $</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Testing</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Real Est.</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Blueprint</th>
                                <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Consult</th>
                                {/*<th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Contractor Status</th>*/}
                                <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {isSearching ? (
                                <tr>
                                    <td colSpan={14} className="px-6 py-10 text-center text-slate-400 text-sm">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Searching…
                                        </span>
                                    </td>
                                </tr>
                            ) : estimateList.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                                        {hasActiveEstimateFilters(activeFilters)
                                            ? 'No submissions match your search.'
                                            : 'No submissions found.'}
                                    </td>
                                </tr>
                            ) : (
                                estimateList.map((est, index) => (
                                    <tr
                                        key={est.id}
                                        className={`hover:bg-slate-50/50 transition-colors ${selectedEstimate?.id === est.id ? 'bg-blue-50/40' : ''}`}
                                    >
                                        {/* Row count */}
                                        <td className="px-4 py-3 text-slate-400 text-xs font-medium">
                                            {currentPage * 10 + index + 1}
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                            {formatTimestamp(est.timestamp)}
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                                            {Capitalize(est.contact.firstName)} {Capitalize(est.contact.lastName)}
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-slate-600">
                                            {est.contact.email}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {est.contact.phone || 'N/A'}
                                        </td>

                                        {/* Zip */}
                                        <td className="px-4 py-3 font-mono text-slate-500 text-xs">
                                            {est.contact.zipCode}
                                        </td>

                                        {/* Estimate ID */}
                                        <td className="px-4 py-3 font-mono font-bold text-blue-600 text-xs">
                                            {est.estimateId}
                                        </td>

                                        {/* Estimate amount */}
                                        <td className="px-4 py-3 font-bold text-slate-900">
                                            ${est.estimateAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>

                                        {/* Testing status */}
                                        <td className="px-4 py-3 text-slate-500 text-xs Capitalize">
                                            {est.testingStatus}
                                        </td>

                                        {/* Real Estimates */}
                                        <td className="px-4 py-3 text-center">
                                            {est.requestRealEstimates ? <YesBadge color="emerald" /> : <NoBadge />}
                                        </td>

                                        {/* Blueprint */}
                                        <td className="px-4 py-3 text-center">
                                            {est.requestDiyBlueprint ? <YesBadge color="orange" /> : <NoBadge />}
                                        </td>

                                        {/* Consultant */}
                                        <td className="px-4 py-3 text-center">
                                            {est.requestConsultant ? <YesBadge color="blue" /> : <NoBadge />}
                                        </td>

                                        {/* Contractor match status 
                                        <td className="px-4 py-3">
                                            {est.requestRealEstimates ? (
                                                <ContractorStatusBadge status={est.contractorMatchStatus} />
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>*/}

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedEstimate(est)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View estimate details"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span className="hidden md:inline">View</span>
                                            </button>
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

            {/* Detail drawer — simple inline expand for now, swap for a modal/sheet if preferred */}
            {selectedEstimate && (
                 <AdminEstimatePreview
                    estimate={selectedEstimate}
                    onClose={() => setSelectedEstimate(null)}
                />
            )}
        </div>
    )
}

// ── Not using currently may add as premium feature: Contractor status badge ───────────────────────────────────────────────────
/*
function ContractorStatusBadge({ status }: { status?: string }) {
    if (!status || status === 'pending') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-tight">
                Pending
            </span>
        )
    }
    const styles: Record<string, string> = {
        matched: 'bg-blue-100 text-blue-700',
        emailed: 'bg-violet-100 text-violet-700',
        called: 'bg-violet-100 text-violet-700',
        texted: 'bg-violet-100 text-violet-700',
        'no-response': 'bg-red-100 text-red-600',
        completed: 'bg-emerald-100 text-emerald-700',
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${styles[status] ?? 'bg-slate-100 text-slate-500'}`}>
            {status.replace(/-/g, ' ')}
        </span>
    )
}*/

