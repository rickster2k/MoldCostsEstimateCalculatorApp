'use client'

import { ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2, UserCheck, ShoppingCart, UploadCloud, FileCheck } from 'lucide-react'
import Link from 'next/link'
import ConsultantDisclaimerSection from '../consultantDisclaimerSection'

interface RemoteClientProps {
  consultationPrice?: number
  consultationUrl?: string
}

export default function RemoteClient({ consultationPrice = 297, consultationUrl = '' }: RemoteClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#000080] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">Remote Consultation</span>
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
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-[#000080] rounded-full text-xs font-black uppercase tracking-widest mb-4">
              Expert Unbiased Guidance
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-red-700 via-red-600 to-red-500">
                Don&lsquo;t Hire a Mold Remediation Company
              </span>{' '}
              <br />
              Before You Get All the Facts!
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Get a second, unbiased opinion from a remediation consulting expert before you sign that expensive
              contract.
            </p>
            <div className="pt-8">
              <button
                onClick={() => document.getElementById('consult-order-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-6 bg-[#000080] text-white rounded-4xl font-black text-xl shadow-2xl shadow-blue-200 hover:bg-[#000066] transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
              >
                Get My Expert Consultation <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">
                Stop Unnecessary Upsells and Overpriced Quotes
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Remediation companies often use fear to push unnecessary services and inflated quotes. If you&lsquo;re
                  looking at a bill for <span className="font-bold text-slate-900">$10,000+</span>, you need to know
                  if it&lsquo;s actually required.
                </p>
                <p>
                  Our{' '}
                  <span className="font-bold text-[#000080]">Remote Mold Remediation Consultation</span> provides you
                  with a detailed, personalized PDF document from a certified indoor environmental consultant. We
                  review your testing results and quotes to give you the{' '}
                  <span className="font-bold text-slate-900">real truth</span>.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 bg-blue-100 text-[#000080] rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">What You Get:</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Professional review of your mold lab results',
                  "Unbiased analysis of remediation quotes you've received",
                  'Personalized Plan-of-Action and recommendations',
                  "Identification of unnecessary services or 'upsells'",
                  'Clear, step-by-step Scope of Work for your specific issue',
                  'Peace of mind before making a major financial decision',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 bg-blue-50 text-[#000080] rounded-full flex items-center justify-center mt-0.5 shrink-0">
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
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900">How It Works</h2>
              <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: ShoppingCart,
                  title: 'Step 1',
                  desc: 'Order Your Consultation',
                },
                {
                  icon: UploadCloud,
                  title: 'Step 2',
                  desc: "Then, you'll be directed to submit your mold-related documents (testing results, remediation price quotes, etc.) for our remediation consultant to review",
                },
                {
                  icon: FileCheck,
                  title: 'Step 3',
                  desc: "Finally, you'll receive your detailed remediation protocol consultation and recommendation PDF document to your MoldCosts.com Estimate Account within 2 business days.",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-blue-50 text-[#000080] rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-blue-100/50">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        <ConsultantDisclaimerSection/>

        {/* Order Section */}
        <section id="consult-order-section" className="py-24 px-4 bg-white">
          <div className="max-w-3xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center text-white space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Protect Your Wallet and Your Home
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Upload your documents and get your expert consultation report within 24–48 hours.
              </p>
            </div>

            <div className="relative z-10 py-8 border-y border-white/10">
              <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">
                Investment in Peace of Mind
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-500 text-2xl line-through font-bold">$597</span>
                <span className="text-6xl font-black text-blue-400">${consultationPrice}</span>
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <button
                onClick={() => consultationUrl && window.open(consultationUrl, '_blank')}
                className="w-full py-6 bg-[#000080] text-white rounded-4xl font-black text-2xl shadow-2xl shadow-blue-500/20 hover:bg-[#000066] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
              >
                Order My Consultation Now <ChevronRight className="w-8 h-8" />
              </button>
              <div className="flex items-center justify-center gap-6 text-slate-400 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Certified Experts
                </div>
                <button
                      onClick={() => document.getElementById('disclaimer-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-slate-400 hover:text-blue-500 text-sm font-bold underline underline-offset-2 transition-colors"
                  >
                      See Disclaimer
                  </button>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Unbiased Advice
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-black text-lg">MoldCosts</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            &copy; 2026{' '}
            <a href="https://www.iaq.network" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              IAQ Network
            </a>
            . All rights reserved. Professional environmental consulting services.
          </p>
        </div>
      </footer>

    </div>
  )
}