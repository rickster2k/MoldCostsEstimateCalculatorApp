'use client'

import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { EstimateData, ContactInfo, CalculationResult } from '@/lib/types'
import { fmt } from '@/lib/utils'

interface ResultsStepProps {
  data: EstimateData
  results: CalculationResult
  estimateId: string
  contact: ContactInfo
  setContact: (c: ContactInfo) => void
  isSaved: boolean
  isUserSignedIn: boolean
  requestEstimates: boolean
  setRequestEstimates: (v: boolean) => void
  requestDiyBlueprint: boolean
  setRequestDiyBlueprint: (v: boolean) => void
  requestConsultant: boolean
  setRequestConsultant: (v: boolean) => void
  onSave: (e: React.FormEvent) => void
  onRestart: () => void
  saveSectionRef: React.RefObject<HTMLDivElement | null>
}

export default function ResultsStep({
  data, results, estimateId,
  contact, setContact,
  isSaved, isUserSignedIn,
  requestEstimates, setRequestEstimates,
  requestDiyBlueprint, setRequestDiyBlueprint,
  requestConsultant, setRequestConsultant,
  onSave, onRestart, saveSectionRef,
}: ResultsStepProps) {

  const { lowEstimate, highEstimate, averageEstimate, breakdown } = results

  const BREAKDOWN_ROWS = [
    { label: 'Base remediation cost', val: breakdown.baseCost            },
    { label: 'Severity adjustment',   val: breakdown.severityAdjustment  },
    { label: 'Access complexity',     val: breakdown.complexityAdjustment },
    { label: 'Additional services',   val: breakdown.additionalServices   },
    ...(breakdown.foggingCost ? [{ label: 'Whole-home fogging', val: breakdown.foggingCost }] : []),
  ]

  const SERVICE_OPTIONS = [
    { label: 'Request Real Estimates',      desc: 'Match with certified local mold remediators.',    val: requestEstimates,    set: setRequestEstimates    },
    { label: 'Request DIY Blueprint',       desc: 'Get a professional self-remediation guide.',       val: requestDiyBlueprint, set: setRequestDiyBlueprint },
    { label: 'Request Expert Consultation', desc: 'One-on-one consultation with a certified expert.', val: requestConsultant,   set: setRequestConsultant   },
  ]


    
  return (
    <div className="space-y-10">

      {/* Estimate range hero */}
      <div className="bg-linear-to-br from-primary to-primary-dark rounded-3xl p-8 text-white text-center space-y-2 shadow-2xl shadow-primary/30">
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">
          Estimated Remediation Cost
        </p>
        <div className="text-5xl font-black tracking-tight">
          ${fmt(lowEstimate)} – ${fmt(highEstimate)}
        </div>
        <p className="text-sm opacity-70 font-medium">
          Average estimate: ${fmt(averageEstimate)}
        </p>
        <div className="pt-2 text-xs bg-white/10 rounded-xl px-4 py-2 inline-block font-mono tracking-widest">
          Estimate ID: {estimateId}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">Cost Breakdown</h3>
        {BREAKDOWN_ROWS.map(row => (
          <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <span className="text-slate-600 text-sm font-medium">{row.label}</span>
            <span className="font-bold text-slate-800">${fmt(row.val)}</span>
          </div>
        ))}
      </div>

      {/* Service request + save — only shown before saving */}
      {!isSaved && !isUserSignedIn && (
        <div className="bg-slate-50 rounded-3xl p-6 space-y-5 border border-slate-100" ref={saveSectionRef}>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">Get Real Estimates From Certified Contractors</h3>
            <p className="text-sm text-slate-500">Save your estimate and request additional resources.</p>
          </div>

          {SERVICE_OPTIONS.map(opt => (
            <label key={opt.label} className="flex items-start gap-4 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary/30 cursor-pointer transition-all">
              <input type="checkbox" checked={opt.val} onChange={e => opt.set(e.target.checked)}
                className="w-5 h-5 rounded mt-0.5 accent-primary" />
              <div>
                <div className="font-bold text-slate-800 text-sm">{opt.label}</div>
                <div className="text-xs text-slate-500">{opt.desc}</div>
              </div>
            </label>
          ))}

          <form onSubmit={onSave} className="space-y-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="First Name"
                value={contact.firstName}
                onChange={e => setContact({ ...contact, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700"
              />
              <input required type="text" placeholder="Last Name"
                value={contact.lastName}
                onChange={e => setContact({ ...contact, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700"
              />
              <input required type="email" placeholder="Email Address"
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700 md:col-span-2"
              />
            </div>
            <button type="submit"
              className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-3"
            >
              Save Estimate &amp; Submit Request <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Saved confirmation */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
          <div>
            <div className="font-bold text-green-800">Estimate Saved!</div>
            <div className="text-sm text-green-700">Check your email for your account link.</div>
          </div>
        </div>
      )}

      {/* Testing advisory */}
      {data.needsTesting === 'yes' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-800">Mold Testing Recommended</div>
            <div className="text-sm text-amber-700 leading-relaxed">
              Professional testing ($300–$450) will identify the mold species, which may be
              required for insurance claims and determines the remediation approach.
            </div>
          </div>
        </div>
      )}

      {/* Restart */}
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onRestart}
          className="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Start New Estimate
        </button>
      </div>

    </div>
  )
}