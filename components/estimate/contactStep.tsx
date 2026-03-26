'use client'

import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ContactInfo } from '@/lib/types'
import { COUNTRIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ContactStepProps {
  contact: ContactInfo
  setContact: (c: ContactInfo) => void
  dataZipCode: string
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  isSubmitting: boolean
}

export default function ContactStep({ contact, setContact, dataZipCode, onSubmit, onBack, isSubmitting }: ContactStepProps) {
  return (
    <div className="space-y-8">

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Your Estimate is Ready!</h2>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Enter your contact details so we can email your personalized cost estimate.
          You&lsquo;ll also receive your unique Account # and direct account link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Field label="First Name">
            <input required type="text" placeholder="First Name"
              autoCapitalize="words"
              value={contact.firstName}
              onChange={e => setContact({ ...contact, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700"
            />
          </Field>

          <Field label="Last Name">
            <input required type="text" placeholder="Last Name"
              value={contact.lastName}
              autoCapitalize="words"
              onChange={e => setContact({ ...contact, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700"
            />
          </Field>

          <Field label="Email Address" className="md:col-span-2">
            <input required type="email" placeholder="email@example.com"
              value={contact.email}
              onChange={e => setContact({ ...contact, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700"
            />
          </Field>

          <Field label="Phone (optional)">
            <input type="tel" placeholder="(555) 000-0000"
              value={contact.phone ?? ''}
              onChange={e => setContact({ ...contact, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700"
            />
          </Field>

          <Field label="Preferred Contact">
            <select
              value={contact.preferredContact ?? ''}
              onChange={e => setContact({ ...contact, preferredContact: e.target.value as ContactInfo['preferredContact'] })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700 bg-white"
            >
              <option value="">Select…</option>
              <option value="email">Email</option>
              <option value="call">Phone call</option>
              <option value="text">Text message</option>
            </select>
          </Field>

          <Field label="Zip Code">
            <input required type="text" placeholder="Zip Code"
              value={contact.zipCode || dataZipCode}
              onChange={e => setContact({ ...contact, zipCode: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700"
            />
          </Field>

          <Field label="Country">
            <select required
              value={contact.country}
              onChange={e => setContact({ ...contact, country: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700 bg-white"
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

        </div>

        <button type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-theme1 text-white font-black text-lg shadow-xl shadow-teal-200 hover:bg-theme1Shade disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
        >
          {isSubmitting ? 'Calculating…' : <>Get Your Estimate <ChevronRight className="w-6 h-6" /></>}
        </button>
        <p className='text-slate-400 text-center'> By submitting your contact info, you are agreeing to our <Link href='/tos' target='_blank' className="underline">Terms of Service</Link> and <Link href="/privacy" target='_blank' className='underline'>Privacy Policy</Link>.</p>
      </form>

      <button type="button" onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}