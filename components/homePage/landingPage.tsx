'use client';

import { Zap, ChevronRight } from "lucide-react";
import { WHY_ITEMS, HOW_STEPS, FEATURE_CARDS } from "./landingPageData";
import Link from "next/link";
import HeroSection from "./heroSection";
import WhySection from "./whySection";
import HowItWorksSection from "./howItWorks";
import AboutSection from "./aboutSection";


export interface LandingPageProps {
  brandName?: string;
  orgName?: string;
  orgUrl?: string;
}

export function LandingPage({  brandName = 'MoldCosts',  orgName = 'IAQ Network',  orgUrl = 'https://www.iaq.network',}: LandingPageProps) {

  return (
    <div className="flex flex-col w-full">
        
        <HeroSection>
            <section className="px-6 py-16 md:px-16 md:py-24 text-center space-y-8 bg-linear-to-b from-theme1Bright to-transparent relative">
                 <h2 className="absolute top-0 left-1/2 -translate-x-1/2 text-xs sm:text-sm md:text-lg lg:text-3xl font-semibold uppercase tracking-widest text-slate-700 bg-teal-100/70 px-8 py-2 rounded-b-2xl border border-t-0 border-slate-200 whitespace-nowrap">
                    MOLD REMEDIATION CALCULATOR
                </h2>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-theme1 text-xs font-bold uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Professional Grade Calculator
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-3xl mx-auto">
                    Know Your Mold Remediation Costs{' '}      
                    <span className="text-theme1">Instantly.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                Get a professional-grade estimate based on regional pricing, growth severity, and property
                details. No site visit required for your initial budget.
                </p>

                <Link
                    href="/estimator"
                    type="button"
                    className="inline-flex items-center gap-3 bg-theme1 hover:bg-theme1Shade text-white font-black py-5 px-10 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-teal-600/30 group"
                >
                Start Free Estimate
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section> 
        </HeroSection>
      
        <WhySection>
            <section className="px-6 py-16 md:px-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight"> The Power of Certainty in an Uncertain Time</h2>
                        <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">Finding mold is stressful. Not knowing the cost is worse. Here is why thousands of homeowners use our calculator before calling a contractor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {WHY_ITEMS.map((item) => (
                        <div key={item.title} className="flex gap-6">
                            <div
                            className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 ${item.color}`}
                            >
                            <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </WhySection>
      
        <HowItWorksSection>
            <section className="px-6 py-16 md:px-16 md:py-24 bg-white border-y border-slate-100">
                <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
                <p className="text-slate-500 mt-2">Three simple steps to your professional estimate.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                {HOW_STEPS.map((item) => (
                    <div key={item.title} className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-theme1 border border-slate-100">
                        <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
                </div>
            </section>
        </HowItWorksSection>
        
        <WhySection >
            <section className="px-6 py-16 md:px-16 md:py-24 bg-slate-50">
                <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Why Use Our Calculator?</h2>
                <p className="text-slate-500 mt-2">The most accurate preliminary tool in the industry.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {FEATURE_CARDS.map((item) => (
                    <div
                    key={item.title}
                    className="flex gap-5 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
                    >
                    <div className="w-12 h-12 bg-theme1Bright rounded-xl flex items-center justify-center text-theme1 shrink-0">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                    </div>
                ))}
                </div>

                <div className="mt-12 text-center">
                <Link
                    href="/estimator"
                    type="button"
                    className="text-theme1 font-bold hover:underline inline-flex items-center gap-2"
                >
                    Ready to start? Launch the calculator <ChevronRight className="w-4 h-4" />
                </Link>
                </div>
            </section>  
        </WhySection>
        
        <AboutSection>
            <section className="px-6 py-16 md:px-16 md:py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900">
                        About the {brandName} Calculator
                        </h2>
                        <div className="h-1 w-12 bg-theme1 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                        <p>
                        The Mold Remediation Estimate Calculator was developed by the{' '}
                        <a
                            href={orgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00897d] font-bold hover:underline"
                        >
                            {orgName}
                        </a>
                        , a collective of HVAC professionals, Mold Inspectors & Remediators, Indoor Environmental Hygienists, and IAC2 Certified Consultants.
                        </p>
                        <p>
                        We realized that most homeowners have no way of knowing if their remediation quotes are fair without spending hundreds on professional consultations. We built this logic-engine to bridge that gap, providing professional-grade cost insights at no cost.
                        </p>
                    </div>

                    <Link
                        href="/estimator"
                        type="button"
                        className="bg-theme1 hover:bg-theme1Shade text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-teal-600/20"
                    >
                        Start Free Estimate
                    </Link>
                </div>
            </section>
        </AboutSection>      

    </div>
  );
}