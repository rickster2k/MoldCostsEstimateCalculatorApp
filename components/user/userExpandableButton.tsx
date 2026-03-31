import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

type ExpandableItemProps = {
    title: string
    children: React.ReactNode
    preview: string
    color?: 'orange' | 'blue'
}

export default function ExpandableItem({ title, children, preview, color = 'orange' }: ExpandableItemProps) {
    const [expanded, setExpanded] = useState(false)

    const colorStyles = {
        orange: 'text-orange-500 hover:text-orange-600',
        blue: 'text-blue-500 hover:text-blue-600',
    }

    return (
        <div className="border-b border-slate-200 pb-6">
            <h3 className="text-base font-bold text-slate-800 mb-3">{title}</h3>
            
            {!expanded && (
                <p className="text-slate-600 text-sm leading-relaxed">
                    {preview}<span className="text-slate-400">...</span>
                </p>
            )}

            {expanded && (
                <div className="text-slate-600 text-sm leading-relaxed">
                    {children}
                </div>
            )}

            <button
                onClick={() => setExpanded(!expanded)}
                className={`mt-3 flex items-center gap-1 text-sm font-bold transition-colors ${colorStyles[color]}`}
            >
                {expanded ? (
                    <><ChevronUp className="w-4 h-4" /> Read less</>
                ) : (
                    <><ChevronDown className="w-4 h-4" /> Read more</>
                )}
            </button>
        </div>
    )


}