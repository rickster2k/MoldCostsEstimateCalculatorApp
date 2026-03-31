'use client'

import { ChevronRight, ArrowLeft, ShieldCheck, FileText, CheckCircle2, ShoppingCart, UploadCloud, FileCheck } from 'lucide-react'
import Link from 'next/link'
import DiyDisclaimerSection from '../diyDisclaimerSection'

interface DiyClientProps {
  blueprintPrice?: number
  blueprintUrl?: string
}

export default function DiyClient({ blueprintPrice = 197, blueprintUrl = '' }: DiyClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">DIY Mold Blueprint</span>
          </div>
          
        <Link
            href='/user/report'
            className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
          
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white py-20 px-4 border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              Exclusive DIY Solution
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              AVOID Overpaying for <br />
              Mold Remediation!
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Save thousands by doing it yourself—safely, professionally, and with total confidence.
            </p>
            <div className="pt-8">
              <button
                onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-6 bg-orange-500 text-white rounded-4xl font-black text-xl shadow-2xl shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
              >
                Get Your Personalized Blueprint <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">
                The Professional Secret They Don&lsquo;t Want You to Know...
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Hiring a professional remediation company can cost anywhere from{' '}
                  <span className="font-bold text-slate-900">$5,000 to $15,000+</span>. But did you know that with
                  the right guidance, most homeowners can safely de-contaminate their own properties for a fraction
                  of that cost?
                </p>
                <p>
                  Our <span className="font-bold text-orange-500">DIY Mold Remediation Blueprint</span> is a
                  personalized, step-by-step PDF guide tailored to your specific situation. It&lsquo;s not just a generic
                  manual—it&lsquo;s a professional-grade strategy designed by certified indoor environmental consultants.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">What&lsquo;s Included:</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Personalized Scope of Work based on your home's data",
                  "List of professional-grade equipment & where to rent it",
                  "Safety protocols to protect your family during the process",
                  "Step-by-step decontamination instructions",
                  "Post-remediation verification checklist",
                  "Direct links to recommended supplies",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900">How It Works</h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                Three simple steps to taking control of your home&lsquo;s remediation process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  icon: ShoppingCart,
                  title: 'Order Your Blueprint',
                  description: 'Order Your Blueprint',
                },
                {
                  step: '02',
                  icon: UploadCloud,
                  title: 'Submit Documents',
                  description:
                    "Then, you'll be directed to submit your mold-related documents (some photos of the growth areas, remediation price quotes, etc.) for our remediation consultant to review",
                },
                {
                  step: '03',
                  icon: FileCheck,
                  title: 'Receive Your Plan',
                  description:
                    "You'll then receive your detailed, personalized remediation blueprint PDF document to your MoldCosts.com Estimate Account within 2 business days.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative space-y-6 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors group"
                >
                  <div className="text-6xl font-black text-orange-500/10 absolute top-4 right-8 group-hover:text-orange-500/20 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-200">
                    {i + 1}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*DIY DISCLAIMER SECTION */}
        <DiyDisclaimerSection />
        



        {/* Order Section */}
        <section id="order-section" className="py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center text-white space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Take Control of Your Home&lsquo;s Health Today
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Your personalized blueprint will be drafted by a remediation consulting professional and delivered
                to you within 2 business days.
              </p>
            </div>

            <div className="relative z-10 py-8 border-y border-white/10">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">
                Special Limited Time Offer
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-500 text-2xl line-through font-bold">$497</span>
                <span className="text-6xl font-black text-orange-500">${blueprintPrice}</span>
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <button
                onClick={() => blueprintUrl && window.open(blueprintUrl, '_blank')}
                className="w-full py-6 bg-orange-500 text-white rounded-4xl font-black text-2xl shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
              >
                Order My Blueprint Now <ChevronRight className="w-8 h-8" />
              </button>
              <div className="flex items-center justify-center gap-6 text-slate-400 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Secure Payment
                </div>
                 <button
                      onClick={() => document.getElementById('disclaimer-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-slate-400 hover:text-orange-500 text-sm font-bold underline underline-offset-2 transition-colors"
                  >
                      See Disclaimer
                  </button>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 100% Satisfaction
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

    

    </div>
  )
}