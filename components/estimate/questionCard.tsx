'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuestionCardProps {
  stepNumber: number
  title: string
  subtitle?: string
  children: React.ReactNode
  // Next button — only rendered when provided
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  // Back button — always rendered
  onBack: () => void
}

export default function QuestionCard({
  stepNumber,
  title,
  subtitle,
  children,
  onNext,
  nextDisabled,
  nextLabel = 'Next Step',
  onBack,
}: QuestionCardProps) {
  return (
    <div className="space-y-8">

      {/* Question header */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">
          Step {stepNumber} of 19
        </p>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-slate-500">{subtitle}</p>}
      </div>

      {/* Question content */}
      {children}

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-2 py-4 rounded-2xl bg-theme1 hover:bg-theme1Shade text-white font-bold  disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {nextLabel} <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  )
}